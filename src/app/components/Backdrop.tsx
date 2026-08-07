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
      {/* Base — lifted very slightly at the top, deepest at the floor */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(178deg, var(--surface-high) 0%, var(--surface) 42%, var(--surface) 68%, var(--surface-low) 100%)'
        }}
      />

      {/* Ambient lighting. These are fixed to the viewport rather than the
          document, so every section gets some fall of light instead of the
          page going flat black once the hero scrolls away. All of them are
          held very low — they should register as room light, never as shapes. */}

      {/* Warm key, off-center left */}
      <div
        className="absolute -left-[15%] top-[8%] w-[70vw] h-[70vw] rounded-full opacity-[0.5] blur-[150px]"
        style={{ background: 'radial-gradient(closest-side, var(--surface-warm), transparent 72%)' }}
      />

      {/* Cool mint counterweight, low right */}
      <div
        className="absolute -right-[20%] bottom-[-10%] w-[65vw] h-[65vw] rounded-full opacity-[0.13] blur-[160px]"
        style={{ background: 'radial-gradient(closest-side, var(--accent), transparent 70%)' }}
      />

      {/* Cool rim, high right — keeps the top of every section off pure black */}
      <div
        className="absolute -right-[10%] -top-[15%] w-[55vw] h-[55vw] rounded-full opacity-[0.09] blur-[150px]"
        style={{ background: 'radial-gradient(closest-side, var(--accent-strong), transparent 70%)' }}
      />

      {/* Warm fill, mid-left, sitting behind the middle of the page */}
      <div
        className="absolute left-[8%] top-[42%] w-[50vw] h-[50vw] rounded-full opacity-[0.3] blur-[170px]"
        style={{ background: 'radial-gradient(closest-side, var(--surface-warm), transparent 74%)' }}
      />

      {/* A soft pool low-centre, so the footer is lit rather than fading out */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[-18%] w-[75vw] h-[45vw] rounded-full opacity-[0.16] blur-[170px]"
        style={{ background: 'radial-gradient(closest-side, #6f6a5c, transparent 72%)' }}
      />

      {/* Tubelight — a strip fixture just above the viewport. The tube itself is
          a thin bright core; everything below it is the spill. Three stacked
          layers rather than one, because a single gradient reads as fog. */}
      <motion.div style={{ opacity: tubeOpacity }} className="absolute inset-x-0 top-0">
        {/* The fixture: a narrow, very wide bar of light */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-[26px] h-[54px] w-[62vw] rounded-full blur-[26px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(226,240,234,0.30), transparent)' }}
        />
        {/* Its bloom, wider and softer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-[90px] h-[240px] w-[86vw] rounded-[50%] blur-[80px]"
          style={{ background: 'radial-gradient(closest-side, rgba(200,224,214,0.16), transparent 72%)' }}
        />
        {/* The spill down the page, which is what actually lights the sections */}
        <div
          className="absolute inset-x-0 top-0 h-[62vh]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(214,234,225,0.085) 0%, rgba(214,234,225,0.035) 26%, transparent 100%)'
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
      <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-white/[0.05] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
};
