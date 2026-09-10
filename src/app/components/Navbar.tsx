import { useCallback, useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowUpRight, Github, Linkedin, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { goToSection } from '../lib/goToSection';
import { mailto, site } from '../data/site';

const navItems = [
  { name: 'About', id: 'about' },
  { name: 'Projects', id: 'work' },
  { name: 'Experience', id: 'experience' },
  { name: 'Contact', id: 'contact' },
];

const DOCKED_Y = 14;

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [docked, setDocked] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const restY = useMotionValue(DOCKED_Y);

  const measure = useCallback(() => {
    const anchor = document.getElementById('nav-anchor');
    const rest = anchor ? anchor.getBoundingClientRect().top + window.scrollY : DOCKED_Y;
    restY.set(rest);
    setDocked(Math.max(DOCKED_Y, rest - window.scrollY) <= DOCKED_Y + 1);
  }, [restY]);

  useEffect(() => {
    const initial = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener('resize', measure);
    };
  }, [location.pathname, measure]);

  const target = useTransform([scrollY, restY], ([scroll, rest]: number[]) =>
    Math.max(DOCKED_Y, rest - scroll)
  );

  useMotionValueEvent(target, 'change', (value) => {
    const next = value <= DOCKED_Y + 1;
    setDocked((previous) => (previous === next ? previous : next));
  });

  useEffect(() => setIsOpen(false), [location]);

  const activeName = location.pathname.startsWith('/work') ? 'Projects' : undefined;

  return (
    <>
      <motion.nav
        style={{ y: target }}
        className="fixed inset-x-0 top-0 z-50 will-change-transform"
      >
        <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-4 px-6">
          <motion.div
            animate={{ opacity: docked ? 1 : 0, x: docked ? 0 : -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`shrink-0 ${docked ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            <Link
              to="/"
              className="text-lg uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
            >
              Arnav<span className="text-ink-faint"> Sharma</span>
            </Link>
          </motion.div>

          <div
            className="absolute left-1/2 hidden -translate-x-1/2 xl:flex"
            onPointerLeave={() => setHovered(null)}
          >
            <motion.div
              animate={{
                backgroundColor: docked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                boxShadow: docked
                  ? '0 10px 34px -12px rgba(0,0,0,0.75)'
                  : '0 10px 34px -16px rgba(0,0,0,0.5)',
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 rounded-full border border-glass-line p-1.5"
            >
              {navItems.map((item) => {
                const isActive = activeName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setHovered(null);
                      goToSection(item.id);
                    }}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') setHovered(item.name);
                    }}
                    className="relative rounded-full px-5 py-2 text-sm tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 rounded-full bg-black/[0.05] transition-opacity duration-150 ${
                        hovered === item.name ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive || hovered === item.name ? 'text-ink' : 'text-ink-dim'
                      }`}
                    >
                      {item.name}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: docked ? 1 : 0, x: docked ? 0 : 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`hidden shrink-0 items-center gap-2 xl:flex ${
              docked ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-black/12 bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-black/20"
            >
              Résumé
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0a66c2] bg-[#0a66c2] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(10,102,194,.9)] transition-all hover:-translate-y-0.5 hover:bg-[#0958a8]"
            >
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#17181a] bg-[#17181a] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(0,0,0,.9)] transition-all hover:-translate-y-0.5 hover:bg-black"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
            <a
              href={mailto}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-surface"
            >
              Email me <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="z-50 ml-auto flex h-11 w-11 items-center justify-center rounded-full text-ink glass-pill xl:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-surface/95 backdrop-blur-xl xl:hidden"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.06 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    goToSection(item.id);
                  }}
                  className="block rounded-full px-8 py-3 text-3xl tracking-tight transition-colors glass-pill hover:border-accent/40"
                >
                  {item.name}
                </button>
              </motion.div>
            ))}
            <motion.a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + navItems.length * 0.06 }}
              className="rounded-full px-8 py-3 text-3xl font-medium tracking-tight text-ink glass-pill"
            >
              Résumé
            </motion.a>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#17181a] px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
            <a href={mailto} className="mt-3 text-sm font-medium uppercase tracking-widest text-ink">
              {site.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
