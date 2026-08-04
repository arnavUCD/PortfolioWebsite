import React, { useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent
} from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'About', to: '/#about' },
  { name: 'Projects', to: '/work' },
  { name: 'Experience', to: '/#experience' },
  { name: 'Contact', to: '/#contact' }
];

/** Resting offset from the top of the viewport once the nav has docked. */
const DOCKED_Y = 14;

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [docked, setDocked] = useState(false);
  const location = useLocation();

  const { scrollY } = useScroll();

  // Where the nav rests in the document. On the home page that's the hero
  // anchor; anywhere else it's the header. Measured on layout only — never
  // during scroll — so scrolling stays a pure transform with no reflow.
  const restY = useMotionValue(DOCKED_Y);

  const measure = useCallback(() => {
    const anchor = document.getElementById('nav-anchor');
    const rest = anchor ? anchor.getBoundingClientRect().top + window.scrollY : DOCKED_Y;
    restY.set(rest);
    // Pages without an anchor are docked from the first paint.
    setDocked(Math.max(DOCKED_Y, rest - window.scrollY) <= DOCKED_Y + 1);
  }, [restY]);

  useEffect(() => {
    // Wait a frame so a freshly mounted route has painted its anchor.
    const initial = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener('resize', measure);
    };
  }, [measure, location.pathname]);

  // Scroll-linked, frame-synced target: no React state in the hot path.
  const target = useTransform([scrollY, restY], ([s, rest]: number[]) =>
    Math.max(DOCKED_Y, rest - s)
  );

  // A stiff spring only takes the edge off — it tracks scroll almost exactly
  // but rounds off the moment the nav lands on the header.
  const y = useSpring(target, { stiffness: 900, damping: 70, mass: 0.4, restDelta: 0.05 });

  useMotionValueEvent(target, 'change', (v) => {
    const next = v <= DOCKED_Y + 1;
    setDocked((prev) => (prev === next ? prev : next));
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const activeName = navItems.find((item) =>
    item.to.startsWith('/#')
      ? location.hash === item.to.slice(1)
      : location.pathname.startsWith(item.to)
  )?.name;

  return (
    <>
    <motion.nav style={{ y }} className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">

        {/* Wordmark — only once the nav has left the hero, where the name is already huge */}
        <motion.div
          animate={{ opacity: docked ? 1 : 0, x: docked ? 0 : -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`shrink-0 ${docked ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <Link to="/" className="text-lg tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">
            Arnav<span className="text-neutral-500"> Sharma</span>
          </Link>
        </motion.div>

        {/* Centred translucent pill */}
        <div
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-auto"
          onMouseLeave={() => setHovered(null)}
        >
          <motion.div
            animate={{
              backgroundColor: docked ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.35)',
              boxShadow: docked
                ? '0 8px 30px -12px rgba(0,0,0,0.20)'
                : '0 8px 30px -14px rgba(0,0,0,0.10)'
            }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1 p-1.5 rounded-full border border-white/50 backdrop-blur-xl"
          >
            {navItems.map((item) => {
              const isActive = activeName === item.name;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  onMouseEnter={() => setHovered(item.name)}
                  className="relative px-5 py-2 rounded-full text-sm tracking-wide"
                >
                  {hovered === item.name && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-300 ${
                      isActive || hovered === item.name ? 'text-neutral-900' : 'text-neutral-600'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-1 h-1 rounded-full bg-[#135029]" />
                  )}
                </Link>
              );
            })}
          </motion.div>
        </div>

        {/* Right-hand action */}
        <motion.a
          href="mailto:arnsharma@ucdavis.edu"
          animate={{ opacity: docked ? 1 : 0, x: docked ? 0 : 8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`hidden md:inline-flex items-center gap-2 shrink-0 rounded-full border border-black/10 bg-white/40 backdrop-blur-md px-5 py-2.5 text-sm text-neutral-700 hover:bg-[#135029] hover:text-white hover:border-neutral-900 transition-colors ${
            docked ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          Email me
          <ArrowUpRight className="w-4 h-4" />
        </motion.a>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="md:hidden pointer-events-auto ml-auto z-50 w-11 h-11 rounded-full border border-black/10 bg-white/50 backdrop-blur-md flex items-center justify-center text-neutral-900"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>
    </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed inset-0 pointer-events-auto bg-[#f7e7ce]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Link
                  to={item.to}
                  className="px-8 py-3 rounded-full border border-black/[0.07] bg-white/50 text-3xl tracking-tight hover:bg-white transition-colors block"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <a
              href="mailto:arnsharma@ucdavis.edu"
              className="mt-4 text-sm font-mono tracking-widest uppercase text-neutral-600"
            >
              arnsharma@ucdavis.edu
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
