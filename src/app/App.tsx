import { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Work } from './components/Work';
import { ProjectDetail } from './components/ProjectDetail';
import { Backdrop } from './components/Backdrop';

const Preloader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
    className="fixed inset-0 z-[999] bg-surface flex items-center justify-center text-ink grain"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4"
    >
      <h1 className="font-display text-4xl md:text-6xl tracking-tight">Arnav Sharma</h1>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.5, duration: 1.5, ease: 'easeInOut' }}
        className="h-px bg-white/20 w-32"
      />
    </motion.div>
  </motion.div>
);

type NavState = { scrollTo?: string } | null;

/**
 * Restores scroll on route change, and honours a section handoff passed via
 * router *state* — never the URL. `HashRouter` already stores the route in
 * the URL fragment, so a second, nested `#section` inside it (the old
 * `to="/#about"` scheme) produced a malformed address-bar value; state
 * sidesteps that entirely, since it never touches the URL.
 */
const ScrollToTop = () => {
  const location = useLocation();
  const { pathname, key } = location;
  const scrollTo = (location.state as NavState)?.scrollTo;

  // Guards against re-scrolling if this location is revisited (e.g. the user
  // navigates elsewhere and back) without a fresh section request.
  const consumedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!scrollTo || consumedKey.current === key) {
      if (!scrollTo) window.scrollTo(0, 0);
      return;
    }
    consumedKey.current = key;

    let attempts = 0;
    let timer = 0;

    const tryScroll = () => {
      const el = document.getElementById(scrollTo);

      // The section may belong to a route that has not painted yet. Timers
      // are used rather than rAF so this still resolves in a background tab.
      if (!el) {
        if (attempts++ < 20) timer = window.setTimeout(tryScroll, 50);
        return;
      }

      const before = window.scrollY;
      el.scrollIntoView({ behavior: 'smooth' });

      // Smooth scrolling is ignored outright in some environments, and under
      // reduced-motion settings. Snap into place if nothing has moved.
      timer = window.setTimeout(() => {
        if (window.scrollY === before) el.scrollIntoView();
      }, 250);
    };

    tryScroll();
    return () => clearTimeout(timer);
  }, [pathname, scrollTo, key]);

  return null;
};

const HomePage = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Services />
    <Footer />
  </>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-6 text-center">
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">404</span>
      <h1 className="font-display text-5xl md:text-7xl tracking-[-0.02em] mt-4 mb-6">
        Nothing here.
      </h1>
      <Link
        to="/"
        className="font-mono text-xs uppercase tracking-widest text-ink-dim border-b border-glass-line pb-1 hover:text-accent hover:border-accent transition-colors"
      >
        Back to home
      </Link>
    </div>
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />

      {/* The site is always mounted; the preloader simply sits on top of it. */}
      <div className="min-h-screen text-ink selection:bg-white/20">
        <Backdrop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      <AnimatePresence mode="wait">{loading && <Preloader key="preloader" />}</AnimatePresence>
    </Router>
  );
}

export default App;
