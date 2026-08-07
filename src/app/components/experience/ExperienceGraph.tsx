import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import Matter from 'matter-js';
import type { ExperienceEntry } from '../../data/experience';

const { Engine, Bodies, Body, Composite } = Matter;

type Skill = { name: string; roles: number[] };
type Active = { kind: 'role' | 'skill'; index: number } | null;

/** The slowly-moving point each pill is pulled toward while nothing is selected. */
type Drift = { cx: number; cy: number; rx: number; ry: number; fx: number; fy: number; px: number; py: number };

const mean = (ns: number[]) => ns.reduce((a, b) => a + b, 0) / ns.length;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Stable per-name value in [0,1) — the scatter looks random but never reshuffles. */
const noise = (name: string, salt: number) => {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
};

const buildSkills = (entries: ExperienceEntry[]): Skill[] => {
  const byName = new Map<string, number[]>();

  entries.forEach((entry, i) =>
    entry.tags.forEach((tag) => {
      const roles = byName.get(tag) ?? [];
      roles.push(i);
      byName.set(tag, roles);
    })
  );

  return [...byName.entries()]
    .map(([name, roles]) => ({ name, roles }))
    .sort((a, b) => mean(a.roles) - mean(b.roles) || a.name.localeCompare(b.name));
};

/* ── Physics tuning ──────────────────────────────────────────────────────────
 * Matter multiplies force/mass by delta² before it becomes velocity, which for
 * a 60fps step is a factor of ~278. Every pull constant below is therefore an
 * acceleration divided by that factor — writing them as if force mapped
 * straight to acceleration is what sent the pills flying at ~1800 px/s.
 *
 *   spring stiffness  ω  = sqrt(PULL * 278)      radians per step
 *   damping ratio     ζ  = DRAG / (2 * ω)
 *
 * DRAG 0.12 makes the gather critically damped (ζ ≈ 1.0), so pills arrive and
 * stop rather than overshooting, while the idle drift stays overdamped and
 * therefore slow and smooth.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Idle pull. ω ≈ 0.024/step, ζ ≈ 2.5 — heavily overdamped, so it merely loiters. */
const PULL_IDLE = 0.0000021;
/** Gather pull. ω ≈ 0.050/step, ζ ≈ 1.2 — overdamped, so it arrives without overshoot. */
const PULL_GATHER = 0.000009;
/** Air drag. Higher settles faster; lower keeps things floating longer. */
const DRAG = 0.12;
/** How much a pill rebounds off its neighbours. Kept low so contacts are soft. */
const BOUNCE = 0.25;
/** Cursor push-away radius and strength (peak accel ≈ 0.6 px/step²). */
const CURSOR_RADIUS = 170;
const CURSOR_FORCE = 0.0022;
/**
 * Hard ceiling on speed, in px/step. Set above what the springs ever ask for, so
 * it only ever catches contact spikes — if this starts shaping normal motion,
 * the pull constants are too strong rather than the cap too low.
 */
const MAX_SPEED = 7;
/** Fixed physics step, in ms. Matter is unstable on a variable delta. */
const STEP_MS = 1000 / 60;

/** Pills are seeded across this many columns so the cloud starts evenly spread. */
const COLUMNS = 3;
/** Head-room kept at the top and bottom of the cloud. */
const MARGIN = 22;
/** The gathered cluster is laid out this wide, and this far apart vertically. */
const GATHER_COLUMNS = 3;
const GATHER_PITCH = 52;

export const ExperienceGraph = ({ entries }: { entries: ExperienceEntry[] }) => {
  const skills = useMemo(() => buildSkills(entries), [entries]);
  /** For each role, the indices of the skills it owns. */
  const owned = useMemo(
    () =>
      entries.map((_, ri) =>
        skills.map((s, si) => ({ s, si })).filter((x) => x.s.roles.includes(ri)).map((x) => x.si)
      ),
    [entries, skills]
  );

  const [active, setActive] = useState<Active>(null);
  const reduce = useReducedMotion();

  const wrapRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const roleRefs = useRef<(HTMLElement | null)[]>([]);
  const skillRefs = useRef<(HTMLElement | null)[]>([]);

  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const wallsRef = useRef<Matter.Body[]>([]);
  const driftRef = useRef<Drift[]>([]);
  const gatheredRef = useRef<({ x: number; y: number } | null)[][]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  /** Pill dimensions, cached at build so the loop never reads layout. */
  const sizesRef = useRef<{ w: number; h: number }[]>([]);
  /** Cursor in cloud-local pixels, or null when it is not over the field. */
  const cursorRef = useRef<{ x: number; y: number } | null>(null);

  // The loop reads selection through a ref so it never needs re-subscribing.
  const activeRef = useRef<Active>(null);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /** Builds the world from the rendered pill sizes. Safe to call on every resize. */
  const build = useCallback(() => {
    const cloud = cloudRef.current;
    if (!cloud) return;

    const c = cloud.getBoundingClientRect();
    if (!c.width || !c.height) return;
    sizeRef.current = { w: c.width, h: c.height };

    const engine = engineRef.current ?? Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    engineRef.current = engine;

    // Rebuild from scratch — pill widths change with the font and breakpoint.
    Composite.clear(engine.world, false);
    bodiesRef.current = [];
    wallsRef.current = [];

    const rows = Math.ceil(skills.length / COLUMNS);
    const cellW = c.width / COLUMNS;
    const cellH = c.height / rows;

    driftRef.current = skills.map((skill, i) => {
      const col = i % COLUMNS;
      const row = Math.floor(i / COLUMNS);
      return {
        cx: (col + 0.5) * cellW,
        cy: (row + 0.5) * cellH,
        // Small radii and long periods: the pills should loiter around their
        // own patch of the cloud, not tour it.
        rx: Math.max(18, cellW * 0.16),
        ry: Math.max(20, cellH * 0.42),
        fx: (2 * Math.PI) / (34 + noise(skill.name, 4) * 30),
        fy: (2 * Math.PI) / (41 + noise(skill.name, 5) * 34),
        px: noise(skill.name, 6) * Math.PI * 2,
        py: noise(skill.name, 7) * Math.PI * 2
      };
    });

    sizesRef.current = skills.map((_, i) => ({
      w: skillRefs.current[i]?.offsetWidth || 80,
      h: skillRefs.current[i]?.offsetHeight || 36
    }));

    bodiesRef.current = skills.map((skill, i) => {
      const { w, h } = sizesRef.current[i];
      const d = driftRef.current[i];

      const body = Bodies.rectangle(
        clamp(d.cx, w / 2, Math.max(w / 2, c.width - w / 2)),
        clamp(d.cy, h / 2, Math.max(h / 2, c.height - h / 2)),
        w,
        h,
        {
          // Chamfered to the pill's own radius, so collisions match the shape
          chamfer: { radius: h / 2 },
          frictionAir: DRAG,
          friction: 0,
          restitution: BOUNCE,
          density: 0.0012,
          label: skill.name
        }
      );
      // Lock rotation — a tumbling word is unreadable.
      Body.setInertia(body, Infinity);
      return body;
    });

    // Static walls just outside the cloud keep everything in frame.
    const T = 200;
    wallsRef.current = [
      Bodies.rectangle(c.width / 2, -T / 2, c.width + T * 2, T, { isStatic: true }),
      Bodies.rectangle(c.width / 2, c.height + T / 2, c.width + T * 2, T, { isStatic: true }),
      Bodies.rectangle(-T / 2, c.height / 2, T, c.height + T * 2, { isStatic: true }),
      Bodies.rectangle(c.width + T / 2, c.height / 2, T, c.height + T * 2, { isStatic: true })
    ];

    Composite.add(engine.world, [...bodiesRef.current, ...wallsRef.current]);

    // Where each role's skills gather: a loose grid filling the horizontal band
    // the card occupies, so they arrive in front of it rather than beside it.
    const roleCentres = roleRefs.current.map((el) => {
      if (!el) return c.height / 2;
      const r = el.getBoundingClientRect();
      return r.top - c.top + r.height / 2;
    });

    gatheredRef.current = owned.map((list, ri) => {
      const slots: ({ x: number; y: number } | null)[] = skills.map(() => null);
      if (!list.length) return slots;

      const gridRows = Math.ceil(list.length / GATHER_COLUMNS);
      const bandH = gridRows * GATHER_PITCH;
      const top = clamp(
        roleCentres[ri] - bandH / 2,
        MARGIN,
        Math.max(MARGIN, c.height - bandH - MARGIN)
      );
      const colW = c.width / GATHER_COLUMNS;

      list.forEach((si, idx) => {
        const name = skills[si].name;
        const w = skillRefs.current[si]?.offsetWidth || 80;
        slots[si] = {
          x: clamp(
            (idx % GATHER_COLUMNS) * colW + colW / 2 + (noise(name, 8) - 0.5) * 40,
            w / 2,
            Math.max(w / 2, c.width - w / 2)
          ),
          y: top + Math.floor(idx / GATHER_COLUMNS) * GATHER_PITCH + GATHER_PITCH / 2 +
             (noise(name, 9) - 0.5) * 16
        };
      });

      return slots;
    });
  }, [skills, owned]);

  /**
   * Pushes every body's current position onto its DOM node. Sizes come from the
   * cache rather than `offsetWidth`, which would force a layout on all 53 pills
   * every frame. The scale factor is a CSS variable React owns, so the lit pill
   * can rise without the loop needing to know about selection.
   */
  const commit = useCallback(() => {
    const sizes = sizesRef.current;
    bodiesRef.current.forEach((body, i) => {
      const el = skillRefs.current[i];
      const s = sizes[i];
      if (!el || !s) return;
      el.style.transform =
        `translate3d(${body.position.x - s.w / 2}px, ${body.position.y - s.h / 2}px, 0) ` +
        `scale(var(--lift, 1))`;
    });
  }, []);

  useLayoutEffect(() => {
    // The first pass can land before the stylesheet has been applied, which
    // gives a zero-sized cloud. Retry on timers rather than rAF, so this still
    // resolves in a background tab.
    let attempts = 0;
    let retry = 0;

    const attempt = () => {
      build();
      commit();
      if (!sizeRef.current.w && attempts++ < 15) retry = window.setTimeout(attempt, 60);
    };
    attempt();

    const rebuild = () => {
      build();
      commit();
    };

    const cloud = cloudRef.current;
    const observer = new ResizeObserver(rebuild);
    if (cloud) observer.observe(cloud);
    window.addEventListener('resize', rebuild);

    return () => {
      clearTimeout(retry);
      observer.disconnect();
      window.removeEventListener('resize', rebuild);
    };
  }, [build, commit]);

  // Display fonts land after first paint and change every pill's width.
  useEffect(() => {
    document.fonts?.ready
      .then(() => {
        build();
        commit();
      })
      .catch(() => {});
  }, [build, commit]);

  // Cursor tracking, in cloud-local pixels.
  useEffect(() => {
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      const cloud = cloudRef.current;
      if (!cloud) return;
      const r = cloud.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const pad = CURSOR_RADIUS;
      cursorRef.current =
        x > -pad && y > -pad && x < r.width + pad && y < r.height + pad ? { x, y } : null;
    };
    const onLeave = () => {
      cursorRef.current = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce]);

  // The simulation loop.
  useEffect(() => {
    if (reduce) return;

    let raf = 0;
    let last = 0;
    let carry = 0;
    let t = 0;

    const frame = (now: number) => {
      const engine = engineRef.current;
      const bodies = bodiesRef.current;

      if (engine && bodies.length) {
        const real = last ? Math.min(64, now - last) : STEP_MS;
        last = now;
        carry += real;

        // Fixed timestep, capped so a stalled tab cannot spiral.
        let steps = 0;
        while (carry >= STEP_MS && steps < 3) {
          carry -= STEP_MS;
          steps++;
          t += STEP_MS / 1000;

          const sel = activeRef.current;
          const slots = !reduce && sel?.kind === 'role' ? gatheredRef.current[sel.index] : null;
          const cursor = cursorRef.current;
          const { w, h } = sizeRef.current;

          bodies.forEach((body, i) => {
            const d = driftRef.current[i];
            if (!d) return;

            const slot = slots?.[i] ?? null;

            // Idle: chase a point that is itself wandering, on two
            // incommensurate harmonics so the path never repeats visibly.
            const target = slot ?? {
              x: clamp(
                d.cx +
                  d.rx *
                    (0.72 * Math.sin(t * d.fx + d.px) + 0.28 * Math.sin(t * d.fx * 2.31 + d.px * 1.7)),
                MARGIN,
                Math.max(MARGIN, w - MARGIN)
              ),
              y: clamp(
                d.cy +
                  d.ry *
                    (0.72 * Math.sin(t * d.fy + d.py) + 0.28 * Math.sin(t * d.fy * 1.87 + d.py * 2.3)),
                MARGIN,
                Math.max(MARGIN, h - MARGIN)
              )
            };

            const k = slot ? PULL_GATHER : PULL_IDLE;
            let fx = (target.x - body.position.x) * k * body.mass;
            let fy = (target.y - body.position.y) * k * body.mass;

            // Cursor shoves pills aside, falling off smoothly to nothing.
            if (cursor) {
              const dx = body.position.x - cursor.x;
              const dy = body.position.y - cursor.y;
              const dist = Math.hypot(dx, dy);
              if (dist < CURSOR_RADIUS && dist > 0.01) {
                const falloff = 1 - dist / CURSOR_RADIUS;
                const push = falloff * falloff * CURSOR_FORCE * body.mass;
                fx += (dx / dist) * push;
                fy += (dy / dist) * push;
              }
            }

            Body.applyForce(body, body.position, { x: fx, y: fy });

            // Hard ceiling. Contacts between many bodies can occasionally spike
            // a velocity; capping it means the worst case is a pill moving
            // briskly, never one shooting across the field.
            const speed = Math.hypot(body.velocity.x, body.velocity.y);
            if (speed > MAX_SPEED) {
              const s = MAX_SPEED / speed;
              Body.setVelocity(body, { x: body.velocity.x * s, y: body.velocity.y * s });
            }
          });

          Engine.update(engine, STEP_MS);
        }
      } else {
        last = now;
      }

      commit();
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [commit, reduce]);

  // Tear the world down with the component.
  useEffect(
    () => () => {
      const engine = engineRef.current;
      if (!engine) return;
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      engineRef.current = null;
    },
    []
  );

  const roleLit = (i: number) =>
    !active ||
    (active.kind === 'role' && active.index === i) ||
    (active.kind === 'skill' && skills[active.index].roles.includes(i));

  const skillLit = (i: number) =>
    !active ||
    (active.kind === 'skill' && active.index === i) ||
    (active.kind === 'role' && skills[i].roles.includes(active.index));

  const isSkillOn = (i: number) =>
    (active?.kind === 'skill' && active.index === i) ||
    (active?.kind === 'role' && skills[i].roles.includes(active.index));

  const kindLabel = (kind: ExperienceEntry['kind']) =>
    kind === 'education' ? 'Education' : kind === 'projects' ? 'Self-directed' : 'Internship';

  /** Tap support: on touch there is no hover, so selection toggles and sticks. */
  const toggle = (next: NonNullable<Active>) =>
    setActive((prev) =>
      prev && prev.kind === next.kind && prev.index === next.index ? null : next
    );

  return (
    <div>
      <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        {skills.length} skills, drifting
        <span className="hidden lg:inline"> · pick a role and the ones it taught gather to it</span>
      </p>

      {/* ── Graph (wide screens only — the cloud needs the horizontal room) ── */}
      <div
        ref={wrapRef}
        onMouseLeave={() => setActive(null)}
        className="relative hidden lg:grid lg:grid-cols-[minmax(0,27rem)_1fr] lg:gap-20"
      >
        {/* Roles */}
        <div className="relative z-10 flex flex-col justify-center gap-7">
          {entries.map((entry, i) => (
            <article
              key={entry.org}
              ref={(el) => {
                roleRefs.current[i] = el;
              }}
              tabIndex={0}
              onMouseEnter={() => setActive({ kind: 'role', index: i })}
              onFocus={() => setActive({ kind: 'role', index: i })}
              onClick={() => toggle({ kind: 'role', index: i })}
              style={{ opacity: roleLit(i) ? 1 : 0.28 }}
              // Transitioning `all` would animate the neumorphic shadow pair on
              // every hover, which is expensive and looks smeared.
              className={`cursor-default rounded-2xl p-6 outline-none transition-[opacity,border-color,box-shadow,background-color] duration-300 focus-visible:ring-2 focus-visible:ring-accent/40 ${
                active?.kind === 'role' && active.index === i
                  ? 'neu neu-raised border-accent/35'
                  : 'neu'
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                  {kindLabel(entry.kind)}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  {entry.period}
                </span>
              </div>

              <h3 className="mt-3 font-display text-[1.75rem] leading-[1.12] tracking-[-0.02em] text-ink">
                {entry.org}
              </h3>
              <p className="mt-2 text-sm text-accent">{entry.role}</p>

              <ul className="mt-4 space-y-2">
                {entry.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm font-light leading-relaxed text-ink-dim"
                  >
                    <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-accent/50" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-glass-line pt-4">
                {entry.metric ? (
                  <span className="flex items-baseline gap-2.5">
                    <span className="font-display text-3xl leading-none text-accent">
                      {entry.metric.value}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                      {entry.metric.label}
                    </span>
                  </span>
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    {entry.place}
                  </span>
                )}
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  {entry.tags.length} skills
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Skill cloud — every position comes from the physics world */}
        <div ref={cloudRef} className="relative z-10 min-h-[36rem]">
          {skills.map((skill, i) => (
            <button
              key={skill.name}
              type="button"
              ref={(el) => {
                skillRefs.current[i] = el;
              }}
              onMouseEnter={() => setActive({ kind: 'skill', index: i })}
              onFocus={() => setActive({ kind: 'skill', index: i })}
              onClick={() => toggle({ kind: 'skill', index: i })}
              style={
                {
                  opacity: skillLit(i) ? 1 : 0.14,
                  // Read by the transform the physics loop writes, so the lift
                  // composes with the position instead of fighting it.
                  '--lift': isSkillOn(i) ? 1.07 : 1,
                  willChange: 'transform'
                } as React.CSSProperties
              }
              className={`absolute left-0 top-0 whitespace-nowrap rounded-full px-4 py-2 text-left text-sm outline-none transition-[opacity,background-color,border-color,box-shadow,color] duration-300 focus-visible:ring-2 focus-visible:ring-accent/40 ${
                isSkillOn(i) ? 'neu-pill neu-pill-on text-ink' : 'neu-pill text-ink-dim'
              }`}
            >
              {skill.name}
              {/* Skills earned in more than one place are the interesting ones */}
              {skill.roles.length > 1 && (
                <span className="ml-2 font-mono text-[10px] text-accent">×{skill.roles.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stacked fallback: no room for the cloud below lg ── */}
      <div className="flex flex-col gap-8 lg:hidden">
        {entries.map((entry) => (
          <article key={entry.org} className="rounded-2xl neu p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                {kindLabel(entry.kind)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                {entry.period} · {entry.place}
              </span>
            </div>

            <h3 className="mt-4 font-display text-3xl leading-[1.1] tracking-[-0.02em] text-ink">
              {entry.org}
            </h3>
            <p className="mt-2 text-accent">{entry.role}</p>

            <ul className="mt-5 space-y-2.5">
              {entry.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm font-light leading-relaxed text-ink-dim"
                >
                  <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent/50" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {entry.metric && (
              <div className="mt-6 flex items-baseline gap-3 border-t border-glass-line pt-5">
                <span className="font-display text-4xl leading-none text-accent">
                  {entry.metric.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  {entry.metric.label}
                </span>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full glass-pill px-2.5 py-1 font-mono text-[11px] text-ink-dim"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
