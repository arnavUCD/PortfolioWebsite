import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import Matter from 'matter-js';
import type { ExperienceEntry } from '../../data/experience';
import { ExperienceVisual } from './ExperienceVisual';

const { Engine, Bodies, Body, Composite } = Matter;

type Skill = { name: string; roles: number[] };

/** The slowly-moving point each pill is pulled toward. */
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
 * DRAG 0.12 keeps the idle drift overdamped, slow, and smooth.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Idle pull. ω ≈ 0.024/step, ζ ≈ 2.5 — heavily overdamped, so it merely loiters. */
const PULL_IDLE = 0.0000021;
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
export const ExperienceGraph = ({ entries }: { entries: ExperienceEntry[] }) => {
  const skills = useMemo(() => buildSkills(entries), [entries]);

  const [simulationActive, setSimulationActive] = useState(false);
  const reduce = useReducedMotion();

  const wrapRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<(HTMLElement | null)[]>([]);

  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const wallsRef = useRef<Matter.Body[]>([]);
  const driftRef = useRef<Drift[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  /** Pill dimensions, cached at build so the loop never reads layout. */
  const sizesRef = useRef<{ w: number; h: number }[]>([]);
  /** Cursor in cloud-local pixels, or null when it is not over the field. */
  const cursorRef = useRef<{ x: number; y: number } | null>(null);

  // Safari pays heavily for a page-wide animation loop, even when the moving
  // layer is far below the viewport. Keep the exact same physics, but only run
  // it while the graph is close enough to be seen and the tab is visible.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reduce) {
      setSimulationActive(false);
      return;
    }

    let inView = false;
    const sync = () => setSimulationActive(inView && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: '160px 0px' }
    );

    observer.observe(wrap);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [reduce]);

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

  }, [skills]);

  /**
   * Pushes every body's current position onto its DOM node. Sizes come from the
   * cache rather than `offsetWidth`, which would force a layout on all 53 pills
   * every frame.
   */
  const commit = useCallback(() => {
    const sizes = sizesRef.current;
    bodiesRef.current.forEach((body, i) => {
      const el = skillRefs.current[i];
      const s = sizes[i];
      if (!el || !s) return;
      el.style.transform = `translate3d(${body.position.x - s.w / 2}px, ${body.position.y - s.h / 2}px, 0)`;
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
    if (
      reduce ||
      !simulationActive ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) return;

    const cloud = cloudRef.current;
    if (!cloud) return;
    let bounds: DOMRect | null = null;

    const onMove = (e: PointerEvent) => {
      const r = bounds ?? (bounds = cloud.getBoundingClientRect());
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const pad = CURSOR_RADIUS;
      cursorRef.current =
        x > -pad && y > -pad && x < r.width + pad && y < r.height + pad ? { x, y } : null;
    };
    const onLeave = () => {
      cursorRef.current = null;
    };
    const invalidateBounds = () => {
      bounds = null;
    };

    cloud.addEventListener('pointermove', onMove, { passive: true });
    cloud.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', invalidateBounds, { passive: true });
    window.addEventListener('resize', invalidateBounds, { passive: true });
    return () => {
      cloud.removeEventListener('pointermove', onMove);
      cloud.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', invalidateBounds);
      window.removeEventListener('resize', invalidateBounds);
    };
  }, [reduce, simulationActive]);

  // The simulation loop.
  useEffect(() => {
    if (reduce || !simulationActive) return;

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

          const cursor = cursorRef.current;
          const { w, h } = sizeRef.current;

          bodies.forEach((body, i) => {
            const d = driftRef.current[i];
            if (!d) return;

            // Chase a point that is itself wandering, on two
            // incommensurate harmonics so the path never repeats visibly.
            const target = {
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

            let fx = (target.x - body.position.x) * PULL_IDLE * body.mass;
            let fy = (target.y - body.position.y) * PULL_IDLE * body.mass;

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
  }, [commit, reduce, simulationActive]);

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

  const kindLabel = (kind: ExperienceEntry['kind']) =>
    kind === 'education' ? 'Education' : kind === 'projects' ? 'Self-directed' : 'Internship';

  return (
    <div>
      <p className="mb-12 text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        Skills from my experience and education
      </p>

      {/* ── Graph (wide screens only — the cloud needs the horizontal room) ── */}
      <div
        ref={wrapRef}
        className="relative hidden lg:grid lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-12 xl:gap-20"
      >
        {/* Roles */}
        <div className="relative z-10 flex flex-col justify-center gap-7">
          {entries.map((entry) => (
            <article
              key={entry.org}
              className="experience-card group overflow-hidden rounded-[1.75rem]"
            >
              <ExperienceVisual entry={entry} />
              <div className="experience-card-body relative z-10 -mt-7 rounded-t-[1.65rem] p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                    {kindLabel(entry.kind)}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-ink-faint">
                    {entry.period}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-[2rem] leading-[1.08] tracking-[-0.03em] text-ink">
                  {entry.org}
                </h3>
                <p className="mt-2 text-sm font-medium text-accent">{entry.role}</p>

                <ul className="mt-5 space-y-2.5">
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

                <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-glass-line pt-5">
                  {entry.metric ? (
                    <span className="flex items-baseline gap-2.5">
                      <span className="font-data text-3xl leading-none text-accent">
                        {entry.metric.value}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-ink-faint">
                        {entry.metric.label}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-ink-faint">
                      {entry.place}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-widest text-ink-faint">
                    {entry.tags.length} skills
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Skill cloud — every position comes from the physics world */}
        <div ref={cloudRef} className="relative z-10 min-h-[36rem]">
          {skills.map((skill, i) => (
            <span
              key={skill.name}
              ref={(el) => {
                skillRefs.current[i] = el;
              }}
              style={
                {
                  willChange: 'transform'
                } as React.CSSProperties
              }
              className="absolute left-0 top-0 whitespace-nowrap rounded-full px-4 py-2 text-left text-sm neu-pill text-ink-dim"
            >
              {skill.name}
              {/* Skills earned in more than one place are the interesting ones */}
              {skill.roles.length > 1 && (
                <span className="ml-2 text-[10px] text-accent">×{skill.roles.length}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stacked fallback: no room for the cloud below lg ── */}
      <div className="flex flex-col gap-8 lg:hidden">
        {entries.map((entry) => (
          <article key={entry.org} className="experience-card overflow-hidden rounded-[1.75rem]">
            <ExperienceVisual entry={entry} />
            <div className="experience-card-body relative z-10 -mt-7 rounded-t-[1.65rem] p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                  {kindLabel(entry.kind)}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ink-faint">
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
                  <span className="font-data text-4xl leading-none text-accent">
                    {entry.metric.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-ink-faint">
                    {entry.metric.label}
                  </span>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full glass-pill px-2.5 py-1 text-[11px] text-ink-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
