import { useState, useEffect, useCallback, type AnchorHTMLAttributes } from 'react';
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
import { site, mailto } from '../data/site';
import { useSectionLink } from '../hooks/useSectionLink';

const navItems = [
  { name: 'About', id: 'about' },
  { name: 'Projects', id: 'work' },
  { name: 'Experience', id: 'experience' },
  { name: 'Contact', id: 'contact' }
];

/**
 * A section anchor that scrolls directly (or hands off through router state
 * from another route) instead of going through a `Link`'s `to` prop — see
 * useSectionLink for why that matters under HashRouter.
 */
const SectionAnchor = ({
  id,
  className,
  children,
  onClick: onClickProp,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { id: string }) => {
  const scrollToSection = useSectionLink(id);
  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        scrollToSection(e);
        onClickProp?.(e);
      }}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};

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

  // The dedicated /work pages are a drill-down from the Projects section, so
  // they keep that item lit. There's no live scroll-spy for the other
  // sections — the URL no longer carries which one you're viewing (see
  // useSectionLink), so nothing to match against once you're back on `/`.
  const activeName = location.pathname.startsWith('/work') ? 'Projects' : undefined;

  return (
    <>
    {/* No `pointer-events: none` here. Re-enabling pointers on a child of a
        transformed, composited, fixed ancestor is a known Safari hit-testing
        failure — Chromium resolves it, Safari drops the click, which is why
        the nav animated correctly but every button did nothing. The bar is
        only as tall as its content, and nothing beneath that strip is
        interactive, so capturing pointers costs nothing. */}
    <motion.nav style={{ y }} className="fixed inset-x-0 top-0 z-50">
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">

        {/* Wordmark — only once the nav has left the hero, where the name is already huge */}
        <motion.div
          animate={{ opacity: docked ? 1 : 0, x: docked ? 0 : -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`shrink-0 ${docked ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <Link to="/" className="text-lg tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">
            Arnav<span className="text-ink-faint"> Sharma</span>
          </Link>
        </motion.div>

        {/* Centred translucent pill */}
        <div
          className="hidden lg:flex absolute left-1/2 -translate-x-1/2"
          onMouseLeave={() => setHovered(null)}
        >
          <motion.div
            animate={{
              backgroundColor: docked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
              boxShadow: docked
                ? '0 10px 34px -12px rgba(0,0,0,0.75)'
                : '0 10px 34px -16px rgba(0,0,0,0.5)'
            }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1 p-1.5 rounded-full border border-glass-line"
          >
            {navItems.map((item) => {
              const isActive = activeName === item.name;
              return (
                <SectionAnchor
                  key={item.name}
                  id={item.id}
                  onMouseEnter={() => setHovered(item.name)}
                  className="relative px-5 py-2 rounded-full text-sm tracking-wide"
                >
                  {hovered === item.name && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-black/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]"
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-300 ${
                      isActive || hovered === item.name ? 'text-ink' : 'text-ink-dim'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-1 h-1 rounded-full bg-accent" />
                  )}
                </SectionAnchor>
              );
            })}
          </motion.div>
        </div>

        {/* Right-hand actions */}
        <motion.div
          animate={{ opacity: docked ? 1 : 0, x: docked ? 0 : 8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`hidden lg:flex items-center gap-4 shrink-0 ${
            docked ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink-dim hover:text-ink transition-colors"
          >
            Résumé
          </a>
          <a
            href={mailto}
            className="inline-flex items-center gap-2 rounded-full glass-pill px-5 py-2.5 text-sm text-ink-dim hover:bg-accent hover:text-surface hover:border-accent transition-colors"
          >
            Email me
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="lg:hidden ml-auto z-50 w-11 h-11 rounded-full glass-pill flex items-center justify-center text-ink"
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
            className="fixed inset-0 bg-surface/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 lg:hidden"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <SectionAnchor
                  id={item.id}
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-3 rounded-full glass-pill text-3xl tracking-tight transition-colors block hover:border-accent/40"
                >
                  {item.name}
                </SectionAnchor>
              </motion.div>
            ))}
            <motion.a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + navItems.length * 0.06 }}
              className="px-8 py-3 rounded-full glass-pill text-3xl tracking-tight transition-colors hover:border-accent/40"
            >
              Résumé
            </motion.a>
            <a
              href={mailto}
              className="mt-4 text-sm tracking-widest uppercase text-ink-dim"
            >
              {site.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
