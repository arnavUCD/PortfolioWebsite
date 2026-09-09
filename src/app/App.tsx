import { useState, useEffect, useLayoutEffect } from 'react';
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
    className="fixed inset-0 z-[999] bg-surface flex items-center justify-center text-ink grain pointer-events-none"
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
        className="h-px bg-black/12 w-32"
      />
    </motion.div>
  </motion.div>
);

const sectionRoutes: Record<string, string> = {
  '/about': 'about',
  '/projects': 'work',
  '/experience': 'experience',
  '/contact': 'contact',
};

/** Detail routes start at the top. Named section routes position themselves
 *  synchronously in HomePage so there is no hero flash before the jump. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (sectionRoutes[pathname]) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const HomePage = () => {
  const { pathname } = useLocation();
  const sectionId = sectionRoutes[pathname];
  const validRoute = pathname === '/' || Boolean(sectionId);

  useLayoutEffect(() => {
    if (!sectionId) return;
    const section = document.getElementById(sectionId);
    if (!section) return;
    window.scrollTo(0, Math.max(0, section.offsetTop - 80));
  }, [sectionId]);

  if (!validRoute) return <NotFound />;

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Services />
      <Footer />
    </>
  );
};

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-6 text-center">
    <div>
      <span className="text-xs uppercase tracking-[0.3em] text-ink-faint">404</span>
      <h1 className="font-display text-5xl md:text-7xl tracking-[-0.02em] mt-4 mb-6">
        Nothing here.
      </h1>
      <Link
        to="/"
        className="text-xs uppercase tracking-widest text-ink-dim border-b border-glass-line pb-1 hover:text-accent hover:border-accent transition-colors"
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
      <div className="min-h-screen text-ink selection:bg-black/12">
        <Backdrop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/:section?" element={<HomePage />} />
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
