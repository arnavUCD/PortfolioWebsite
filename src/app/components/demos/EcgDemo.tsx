import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** Width of the visible strip in SVG units; the trace tiles across exactly this. */
const STRIP = 360;
const HEIGHT = 150;
const BASELINE = 86;

type Rhythm = 'sinus' | 'sinus-brady' | 'afib';

type Verdict = {
  label: string;
  rhythm: Rhythm;
  confidence: number;
  bpm: number;
  tone: 'ok' | 'hold' | 'flag';
  note: string;
};

const verdicts: Verdict[] = [
  { label: 'Normal sinus', rhythm: 'sinus', confidence: 0.96, bpm: 72, tone: 'ok', note: 'regular · P before every QRS' },
  { label: 'Normal sinus', rhythm: 'sinus-brady', confidence: 0.93, bpm: 58, tone: 'ok', note: 'regular · rate at lower bound' },
  { label: 'Uncertain', rhythm: 'sinus', confidence: 0.71, bpm: 77, tone: 'hold', note: 'below 0.85 gate → defer to clinician' },
  { label: 'Atrial fibrillation', rhythm: 'afib', confidence: 0.94, bpm: 128, tone: 'flag', note: 'irregularly irregular · no discrete P' }
];

const tones = {
  ok: { text: 'text-accent', stroke: 'var(--accent)', dot: 'bg-accent' },
  hold: { text: 'text-amber-300', stroke: '#fbbf24', dot: 'bg-amber-400' },
  flag: { text: 'text-rose-300', stroke: '#fb7185', dot: 'bg-rose-400' }
} as const;

/** Deterministic value in [0,1) — the same rhythm always draws the same strip. */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const gauss = (t: number, centre: number, width: number, amp: number) =>
  amp * Math.exp(-((t - centre) ** 2) / (2 * width * width));

/**
 * One PQRST complex over u ∈ [0,1). Built from Gaussian components rather than
 * line segments, which is what gives the rounded P and T waves and the sharp
 * QRS a real trace has. `pAmp` drops to zero for fibrillation, where atrial
 * depolarisation is disorganised and no discrete P wave exists.
 */
const pqrst = (u: number, pAmp: number) =>
  gauss(u, 0.18, 0.028, 0.1 * pAmp) + // P — atrial depolarisation
  gauss(u, 0.31, 0.007, -0.07) + //      Q
  gauss(u, 0.34, 0.009, 1) + //          R
  gauss(u, 0.375, 0.011, -0.24) + //     S
  gauss(u, 0.6, 0.045, 0.26); //         T — ventricular repolarisation

/**
 * Builds one tiling strip plus the R–R intervals that produced it. Intervals are
 * normalised to sum to exactly STRIP so the two copies butt together seamlessly.
 */
const buildStrip = (rhythm: Rhythm) => {
  const afib = rhythm === 'afib';
  const nominal = rhythm === 'sinus-brady' ? 96 : afib ? 58 : 76;
  const count = Math.max(3, Math.round(STRIP / nominal));

  // Atrial fibrillation is defined by irregularly irregular ventricular
  // response, so the beat spacing itself carries the diagnosis.
  const raw = Array.from({ length: count }, (_, i) =>
    afib ? 1 + (rnd(i * 3.7) - 0.5) * 1.05 : 1 + (rnd(i * 9.1) - 0.5) * 0.05
  );
  const total = raw.reduce((a, b) => a + b, 0);
  const intervals = raw.map((v) => (v / total) * STRIP);

  const amp = 46;
  let x = 0;
  const points: string[] = [];

  intervals.forEach((len, bi) => {
    const steps = Math.max(14, Math.round(len / 1.6));
    for (let s = 0; s < steps; s++) {
      const u = s / steps;
      let v = pqrst(u, afib ? 0 : 1);
      // Coarse fibrillatory waves along the baseline, in place of the P wave.
      if (afib) v += Math.sin((x + u * len) * 1.15 + bi) * 0.035 + (rnd(x + s) - 0.5) * 0.02;
      points.push(`${(x + u * len).toFixed(2)},${(BASELINE - v * amp).toFixed(2)}`);
    }
    x += len;
  });

  return { d: `M${points.join('L')}`, intervals };
};

export const EcgDemo = () => {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % verdicts.length), 4200);
    return () => clearInterval(id);
  }, [reduce]);

  const current = verdicts[step];
  const tone = tones[current.tone];
  const { d, intervals } = useMemo(() => buildStrip(current.rhythm), [current.rhythm]);

  // Regularity is the headline signal, so it gets its own readout: the spread
  // of successive R–R intervals as a percentage of their mean.
  const rr = useMemo(() => {
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const spread =
      Math.sqrt(intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length) / mean;
    return { mean, spread };
  }, [intervals]);

  return (
    <div className="flex h-full flex-col">
      {/* ── Trace ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl border border-glass-line bg-black/25">
        <svg viewBox={`0 0 ${STRIP} ${HEIGHT}`} className="block w-full" preserveAspectRatio="none">
          <defs>
            {/* ECG paper: fine squares with a bolder every fifth line */}
            <pattern id="ecg-fine" width="7.2" height="7.2" patternUnits="userSpaceOnUse">
              <path d="M7.2 0H0V7.2" fill="none" stroke="currentColor" strokeWidth="0.35" className="text-rose-200/[0.07]" />
            </pattern>
            <pattern id="ecg-bold" width="36" height="36" patternUnits="userSpaceOnUse">
              <rect width="36" height="36" fill="url(#ecg-fine)" />
              <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth="0.7" className="text-rose-200/[0.13]" />
            </pattern>
            {/* The trace fades in from the left, as if being written */}
            <linearGradient id="ecg-fade" x1="0" x2="1">
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.12" stopColor="white" stopOpacity="1" />
              <stop offset="1" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="ecg-mask">
              <rect width={STRIP} height={HEIGHT} fill="url(#ecg-fade)" />
            </mask>
          </defs>

          <rect width={STRIP} height={HEIGHT} fill="url(#ecg-bold)" />

          {/* Isoelectric line */}
          <line
            x1="0"
            y1={BASELINE}
            x2={STRIP}
            y2={BASELINE}
            stroke="currentColor"
            strokeWidth="0.4"
            className="text-white/10"
          />

          <g mask="url(#ecg-mask)">
            <motion.g
              key={current.rhythm}
              animate={reduce ? undefined : { x: [0, -STRIP] }}
              transition={{ duration: current.rhythm === 'afib' ? 4.4 : 6, repeat: Infinity, ease: 'linear' }}
            >
              {[0, 1].map((copy) => (
                <path
                  key={copy}
                  d={d}
                  transform={`translate(${copy * STRIP},0)`}
                  fill="none"
                  stroke={tone.stroke}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </motion.g>
          </g>
        </svg>

        {/* Standard chart annotation */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Lead II</span>
          <span className="font-mono text-[10px] tracking-widest text-ink-faint">
            25 mm/s · 10 mm/mV · 360 Hz
          </span>
        </div>
      </div>

      {/* ── R–R intervals: the feature the classifier actually keys on ── */}
      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            R–R intervals
          </span>
          <span className="font-mono text-[10px] text-ink-faint">
            spread {(rr.spread * 100).toFixed(0)}%
            <span className={rr.spread > 0.15 ? 'text-rose-300' : 'text-accent'}>
              {rr.spread > 0.15 ? ' · irregular' : ' · regular'}
            </span>
          </span>
        </div>
        <div className="flex h-9 items-end gap-1">
          {intervals.map((len, i) => (
            <motion.div
              key={`${current.rhythm}-${i}`}
              initial={{ height: 2 }}
              animate={{ height: `${Math.min(100, (len / rr.mean) * 46)}%` }}
              transition={{ duration: 0.5, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 rounded-sm"
              style={{ backgroundColor: tone.stroke, opacity: 0.55 }}
            />
          ))}
        </div>
      </div>

      {/* ── Verdict ─────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-6 border-t border-glass-line pt-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            On-device verdict
          </span>
          <div className="mt-2 flex items-center gap-2.5">
            <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
            <motion.span
              key={current.label + step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xl tracking-tight ${tone.text}`}
            >
              {current.label}
            </motion.span>
          </div>

          {/* Confidence against the 0.85 safety gate */}
          <div className="relative mt-3 h-1 w-full max-w-[240px] overflow-hidden rounded-full bg-white/10">
            <motion.div
              key={step}
              initial={{ width: 0 }}
              animate={{ width: `${current.confidence * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: tone.stroke }}
            />
            <span className="absolute inset-y-0 left-[85%] w-px bg-white/45" />
          </div>
          <span className="mt-2 block font-mono text-xs text-ink-faint">
            {(current.confidence * 100).toFixed(0)}% · {current.note}
          </span>
        </div>

        <div className="text-right">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">BPM</span>
          <motion.div
            key={current.bpm}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl leading-none text-ink"
          >
            {current.bpm}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
