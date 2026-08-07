import type { CSSProperties } from 'react';

export type SkillGroup = { label: string; items: string[] };

/**
 * Row speeds are staggered and deliberately slow, so the rows never scroll as
 * one block and the names stay readable while they drift.
 */
const DURATIONS = ['58s', '74s', '52s', '66s'];

/**
 * The track holds this many identical copies and slides by exactly one of
 * them, which makes the loop seamless. Anything left of the shift has already
 * scrolled past, so the remaining COPIES - 1 must still cover the viewport —
 * the shortest row is ~1270px wide, so four copies carry displays to ~3800px.
 */
const COPIES = 4;

const Row = ({ group, duration }: { group: SkillGroup; duration: string }) => {
  // The gap lives inside each copy rather than on the track, otherwise the
  // copies would not be exactly equal in width and the seam would show.
  const copy = (
    <div className="flex items-center gap-4 pr-4">
      <span className="shrink-0 rounded-full border border-accent/25 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-accent whitespace-nowrap">
        {group.label}
      </span>
      {group.items.map((item) => (
        <span
          key={item}
          className="shrink-0 rounded-full glass-pill px-7 py-3.5 text-lg font-light text-ink-dim whitespace-nowrap transition-colors hover:border-accent/30 hover:text-ink"
        >
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      <div
        className="marquee-track"
        style={
          {
            '--marquee-duration': duration,
            '--marquee-shift': `${100 / COPIES}%`
          } as CSSProperties
        }
      >
        {Array.from({ length: COPIES }, (_, i) => (
          // Only the first copy is real content; the rest exist to close the loop.
          <div key={i} className="flex" aria-hidden={i > 0}>
            {copy}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkillsMarquee = ({ rows }: { rows: SkillGroup[] }) => (
  <div className="flex flex-col gap-4">
    {rows.map((group, i) => (
      <Row key={group.label} group={group} duration={DURATIONS[i % DURATIONS.length]} />
    ))}
  </div>
);
