import { motion, useScroll, useTransform } from 'motion/react';
import { useLocation } from 'react-router-dom';

/**
 * A single fixed page surface shared by every section.
 * Layers, back to front: base gradient → warm/cool glows → tubelight →
 * container column rules → grain → edge falloff.
 */
export const Backdrop = () => {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();

  // The tubelight is for everything except the hero, which has its own cursor
  // field and reads better unlit. On the home page it fades in as the hero
  // leaves; every other route has no hero, so it is on from the first frame.
  const isHome = pathname === '/';
  const scrolledIn = useTransform(scrollY, [220, 640], [0, 1]);
  const tubeOpacity = isHome ? scrolledIn : 1;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden grain">
      {/* Base — held at the mid cream for most of the page and deepened toward
          the floor. Deliberately NOT brightest at the top: the tubelight below
          supplies that, and it can only read as light if there is somewhere
          for it to lift the surface from. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(178deg, var(--surface) 0%, var(--surface) 46%, var(--surface) 66%, var(--surface-low) 100%)'
        }}
      />

      {/* Ambient colour. One layered gradient preserves the same five pools of
          light without asking WebKit to composite five viewport-sized blur
          filters on every frame. */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 58% 60% at 18% 27%, rgba(247, 239, 223, 0.55) 0%, rgba(247, 239, 223, 0.28) 42%, transparent 76%)',
            'radial-gradient(ellipse 48% 52% at 88% 65%, rgba(14, 124, 134, 0.07) 0%, rgba(14, 124, 134, 0.035) 44%, transparent 75%)',
            'radial-gradient(ellipse 43% 48% at 84% 17%, rgba(10, 95, 104, 0.05) 0%, rgba(10, 95, 104, 0.024) 43%, transparent 74%)',
            'radial-gradient(ellipse 46% 52% at 32% 77%, rgba(247, 239, 223, 0.4) 0%, rgba(247, 239, 223, 0.19) 46%, transparent 78%)',
            'radial-gradient(ellipse 60% 38% at 50% 112%, rgba(232, 223, 201, 0.28) 0%, rgba(232, 223, 201, 0.13) 48%, transparent 80%)',
          ].join(', '),
        }}
      />

      {/* Tubelight — a strip fixture just above the viewport. The tube itself is
          a thin bright core; everything below it is the spill. Three stacked
          layers rather than one, because a single gradient reads as fog. */}
      <motion.div style={{ opacity: tubeOpacity }} className="absolute inset-x-0 top-0">
        {/* The fixture: a narrow, very wide bar of light */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-[26px] h-[54px] w-[62vw] rounded-full blur-[26px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)' }}
        />
        {/* Its bloom, wider and softer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-[90px] h-[240px] w-[86vw] rounded-[50%] blur-[80px]"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.8), transparent 72%)' }}
        />
        {/* The spill down the page, which is what actually lights the sections */}
        <div
          className="absolute inset-x-0 top-0 h-[62vh]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.34) 26%, transparent 100%)'
          }}
        />
      </motion.div>

      {/* Column rules — quiet structure, aligned with the layout grid */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-full max-w-[1400px] px-6">
          <div className="h-full rules opacity-70" />
        </div>
      </div>

      {/* A little light spilling from the top edge, and a soft floor */}
      <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-white/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-[#e8dfc9]/30 to-transparent" />
    </div>
  );
};
