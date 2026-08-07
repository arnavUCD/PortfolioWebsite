import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';

type Blob = {
  color: string;
  size: string;
  /** Resting position, as a percentage of the field. */
  x: number;
  y: number;
  /** How far this blob travels with the cursor, in px. */
  pull: number;
  /** Spring feel — heavier blobs lag further behind. */
  stiffness: number;
  damping: number;
  mass: number;
  /** Idle drift, so the field breathes when the cursor is still. */
  drift: number;
  duration: number;
};

// On a near-black surface these read as light sources, so they are held at low
// alpha — a saturated blob at full strength would blow out the wordmark.
const blobs: Blob[] = [
  { color: 'rgba(122,110,88,0.55)', size: '78vw', x: 68, y: 22, pull: 90, stiffness: 40, damping: 22, mass: 2.2, drift: 26, duration: 19 },
  { color: 'rgba(190,220,206,0.20)', size: '62vw', x: 22, y: 78, pull: 130, stiffness: 26, damping: 18, mass: 3, drift: 34, duration: 24 },
  { color: 'rgba(150,132,102,0.38)', size: '46vw', x: 82, y: 84, pull: 60, stiffness: 55, damping: 26, mass: 1.4, drift: 18, duration: 16 },
  { color: 'rgba(216,236,227,0.16)', size: '40vw', x: 34, y: 26, pull: 170, stiffness: 70, damping: 24, mass: 1, drift: 14, duration: 13 }
];

export const CursorField = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Normalised pointer position, −0.5 … 0.5 from the centre of the field.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion) return;

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    };

    const onLeave = () => {
      px.set(0);
      py.set(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [px, py, reduceMotion]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none grain-strong"
    >
      {blobs.map((blob, i) => (
        <FieldBlob key={i} blob={blob} px={px} py={py} still={!!reduceMotion} />
      ))}

      {/* Keeps the type legible wherever the blobs drift — a dark scrim now,
          since the glows brighten the surface rather than tinting paper */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />
    </div>
  );
};

const FieldBlob = ({
  blob,
  px,
  py,
  still
}: {
  blob: Blob;
  px: ReturnType<typeof useMotionValue<number>>;
  py: ReturnType<typeof useMotionValue<number>>;
  still: boolean;
}) => {
  const spring = { stiffness: blob.stiffness, damping: blob.damping, mass: blob.mass };

  // Blobs lead the cursor slightly, each with its own weight — that lag is the "physics".
  const x = useSpring(useTransform(px, (v) => v * blob.pull), spring);
  const y = useSpring(useTransform(py, (v) => v * blob.pull), spring);

  return (
    <div
      className="absolute"
      style={{
        left: `${blob.x}%`,
        top: `${blob.y}%`,
        width: blob.size,
        height: blob.size,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Cursor spring */}
      <motion.div className="w-full h-full" style={{ x: still ? 0 : x, y: still ? 0 : y }}>
        {/* Idle drift */}
        <motion.div
          className="w-full h-full rounded-full blur-[90px] opacity-80"
          style={{ background: `radial-gradient(closest-side, ${blob.color}, transparent 70%)` }}
          animate={
            still
              ? undefined
              : { x: [0, blob.drift, 0], y: [0, -blob.drift * 0.7, 0], scale: [1, 1.06, 1] }
          }
          transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
};
