import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection } from '../lib/scrollToSection';

/**
 * Click handler for same-page section anchors (About, Projects, Experience,
 * Contact). These never go through a `Link`'s `to` prop, because this site
 * runs on `HashRouter` — the URL fragment already stores the route, so a
 * `to="/#about"`-style link nests a second `#` inside it. React Router's own
 * location/state tracking survives that, but the resulting address bar value
 * is malformed, and anything that reads it back out (e.g. feeding it to
 * `document.querySelector`) can throw on the invalid selector.
 *
 * Instead: scroll directly when already on the home route, and hand the
 * target off through router *state* — never the URL — when navigating in
 * from elsewhere. `ScrollToTop` in App.tsx consumes that state once the
 * section has mounted.
 */
export const useSectionLink = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (location.pathname === '/') {
        scrollToSection(id);
      } else {
        navigate('/', { state: { scrollTo: id } });
      }
    },
    [id, location.pathname, navigate]
  );
};
