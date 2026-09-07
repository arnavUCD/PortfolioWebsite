/**
 * Scrolls a section into view without relying on the browser's own smooth
 * scroll.
 *
 * `scrollIntoView({ behavior: 'smooth' })` is the obvious way to do this and it
 * worked in Chromium, but Safari's implementation is unreliable — particularly
 * once anything sets `overflow` on the root element, which can move Safari's
 * document scroller out from under it. Driving `window.scrollTo` directly is
 * the same amount of code and behaves identically everywhere.
 *
 * Returns false when the target does not exist, so callers can retry while a
 * freshly mounted route is still painting.
 */

/** Mirrors the `scroll-margin-top: 5rem` the section anchors carry. */
const NAV_OFFSET = 80;

/** easeInOutCubic — a scroll that accelerates and settles rather than ramping. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const scrollToSection = (id: string): boolean => {
  const el = document.getElementById(id);
  if (!el) return false;

  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const targetY = Math.min(
    maxY,
    Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET)
  );
  const startY = window.scrollY;
  const distance = targetY - startY;

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (reduce || Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    return true;
  }

  const duration = Math.min(900, Math.max(420, Math.abs(distance) * 0.35));
  let raf = 0;
  let startTs = 0;

  const step = (ts: number) => {
    if (!startTs) startTs = ts;
    const p = Math.min(1, (ts - startTs) / duration);
    window.scrollTo(0, Math.round(startY + distance * ease(p)));
    if (p < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);

  // Safety net. If frames never arrive — a throttled tab, a stalled
  // compositor, a browser that ignores the animation — land on the target
  // anyway. A nav button that does nothing is far worse than one that jumps.
  window.setTimeout(() => {
    if (Math.abs(window.scrollY - targetY) > 4) {
      cancelAnimationFrame(raf);
      window.scrollTo(0, targetY);
    }
  }, duration + 300);

  return true;
};
