/** Clearance for the docked navbar, so a section never lands underneath it. */
const NAV_OFFSET = 80;

/**
 * Scroll to a section by id.
 *
 * Deliberately blunt, after three failed attempts at something cleverer:
 *
 *  - No router hooks. Nothing here reads or writes React Router state.
 *  - No anchor. Callers are `<button>`s, so there is no default navigation to
 *    cancel and no href that can push a second `#` into the URL.
 *  - No animation of our own. `window.scrollTo` *sets a position*; it either
 *    moves or it does not. Smoothness is a CSS garnish (`scroll-behavior`) the
 *    browser may ignore. That is the whole point — previously the animation was
 *    the mechanism, so a browser declining to animate meant nothing happened.
 */
export const goToSection = (id: string) => {
  const scroll = () => {
    const el = document.getElementById(id);
    if (!el) return false;
    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo(0, Math.max(0, y));
    return true;
  };

  if (scroll()) return;

  // The section is not on the current route. Every section lives on the home
  // route, so switch to it — this is a hash router, so that is just the hash —
  // and scroll once the section has painted.
  window.location.hash = '#/';
  let tries = 0;
  const timer = window.setInterval(() => {
    if (scroll() || ++tries > 40) window.clearInterval(timer);
  }, 50);
};
