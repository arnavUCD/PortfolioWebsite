import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** One beat, ~170px wide, drawn on a 120-tall baseline. */
const beat = 'h44 l12,-5 l8,10 l9,-40 l9,66 l9,-36 l10,5 h60';
const strip = `M0,60 ${beat} ${beat} ${beat} ${beat}`;

const verdicts = [
  { label: 'Normal sinus', confidence: 0.96, tone: 'ok' },
  { label: 'Normal sinus', confidence: 0.93, tone: 'ok' },
  { label: 'Uncertain', confidence: 0.71, tone: 'hold' },
  { label: 'Atrial fibrillation', confidence: 0.94, tone: 'flag' }
] as const;

const tones = {
  ok: { dot: 'bg-[#135029]', text: 'text-[#135029]', bar: '#135029' },
  hold: { dot: 'bg-amber-600', text: 'text-amber-700', bar: '#b45309' },
  flag: { dot: 'bg-rose-600', text: 'text-rose-700', bar: '#be123c' }
};

export const EcgDemo = () => {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % verdicts.length), 3200);
    return () => clearInterval(id);
  }, [reduce]);

  const current = verdicts[step];
  const tone = tones[current.tone];
  const bpm = current.tone === 'flag' ? 128 : 72 + step * 3;

  return (
    <div className="flex flex-col h-full">
      {/* Trace */}
      <div className="relative flex-1 min-h-[180px] overflow-hidden rounded-xl border border-black/[0.07] bg-white/40">
        <svg viewBox="0 0 340 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <line x1="0" y1="60" x2="340" y2="60" stroke="currentColor" strokeWidth="0.5" className="text-black/10" />
          <motion.g
            animate={reduce ? undefined : { x: [0, -340] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <path
              d={strip}
              fill="none"
              stroke={tone.bar}
              strokeWidth={1.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <g transform="translate(340,0)">
              <path
                d={strip}
                fill="none"
                stroke={tone.bar}
                strokeWidth={1.5}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </motion.g>
        </svg>

        {/* Sweep highlight — the 10-second classification window */}
        <motion.div
          animate={reduce ? undefined : { opacity: [0, 0.5, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />

        <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Lead II · 360 Hz
        </span>
      </div>

      {/* Verdict */}
      <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            On-device verdict
          </span>
          <div className="mt-2 flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full ${tone.dot}`} />
            <motion.span
              key={current.label + step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xl tracking-tight ${tone.text}`}
            >
              {current.label}
            </motion.span>
          </div>
          <div className="mt-3 h-1 w-full max-w-[220px] rounded-full bg-black/[0.07] overflow-hidden">
            <motion.div
              key={step}
              initial={{ width: 0 }}
              animate={{ width: `${current.confidence * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: tone.bar }}
            />
          </div>
          <span className="mt-2 block text-xs font-mono text-neutral-500">
            confidence {(current.confidence * 100).toFixed(0)}%
            {current.tone === 'hold' && ' · below 0.85 gate → defer'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">BPM</span>
          <div className="font-display text-4xl text-neutral-900 leading-none mt-1">{bpm}</div>
        </div>
      </div>
    </div>
  );
};
