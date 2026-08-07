import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { CursorField } from './CursorField';

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const yText = useTransform(scrollY, [0, 500], [0, 120]);
  const opacityText = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-6"
    >
      <CursorField />

      {/* Name — drifts and fades on scroll */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[19vw] md:text-[11rem] leading-[0.86] tracking-[-0.02em] text-ink"
        >
          Arnav Sharma
        </motion.h1>
      </motion.div>

      {/* The navigation rests here while you're at the top of the home page.
          Navbar tracks this anchor and rides up to the header as you scroll.
          It sits outside the parallax wrapper so its position stays exact. */}
      <div id="nav-anchor" className="relative z-10 mt-14 h-[52px] w-full" />

      {/* Footnote, mirroring the reference layout */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 right-8 hidden md:block text-lg text-ink-dim"
      >
        Built in <span className="text-ink">Davis, CA</span>
      </motion.span>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/25 to-transparent overflow-hidden">
          <motion.div
            animate={{ y: [-64, 64] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
            className="w-full h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
};
