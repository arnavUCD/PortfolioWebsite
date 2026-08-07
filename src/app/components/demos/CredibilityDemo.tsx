import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

/** A token and its signed contribution to the credibility score, −1 … +1. */
type Token = [text: string, weight: number];

type Sample = {
  tokens: Token[];
  tfidf: number;
  bert: number;
  verdict: 'Credible' | 'Uncertain' | 'Low credibility';
};

/** Below this spread the two models agree; above it the ensemble defers. */
const GATE = [0.35, 0.65] as const;

const samples: Sample[] = [
  {
    tokens: [
      ['Central bank', 0], ['holds', 0.18], ['rates steady,', 0.12], ['citing', 0.46],
      ['softening wage growth', 0.38]
    ],
    tfidf: 0.88,
    bert: 0.94,
    verdict: 'Credible'
  },
  {
    tokens: [
      ['Scientists', 0], ['confirm', -0.52], ['single fruit', -0.34],
      ['reverses ageing', -0.78], ['in', 0], ['one week', -0.44]
    ],
    tfidf: 0.09,
    bert: 0.03,
    verdict: 'Low credibility'
  },
  {
    tokens: [
      ['Local council', 0], ['votes', 0.34], ['to expand transit', 0.1], ['after', 0],
      ['four-hour hearing', 0.42]
    ],
    tfidf: 0.71,
    bert: 0.86,
    verdict: 'Credible'
  },
  {
    tokens: [
      ['Anonymous source', -0.58], ['claims', -0.4], ['major', -0.22],
      ['merger talks', 0.05], ['under way', 0]
    ],
    tfidf: 0.52,
    bert: 0.49,
    verdict: 'Uncertain'
  }
];

const tones = {
  Credible: { text: 'text-accent', bar: 'var(--accent)' },
  Uncertain: { text: 'text-amber-300', bar: '#fbbf24' },
  'Low credibility': { text: 'text-rose-300', bar: '#fb7185' }
} as const;

/** Supporting evidence tints green, undermining tints red, neutral stays plain. */
const tokenStyle = (w: number) => {
  if (Math.abs(w) < 0.08) return undefined;
  const a = Math.min(0.3, Math.abs(w) * 0.34);
  return w > 0
    ? { backgroundColor: `rgba(190,220,206,${a})`, boxShadow: `inset 0 -1px 0 rgba(190,220,206,0.5)` }
    : { backgroundColor: `rgba(251,113,133,${a})`, boxShadow: `inset 0 -1px 0 rgba(251,113,133,0.5)` };
};

export const CredibilityDemo = () => {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % samples.length), 4200);
    return () => clearInterval(id);
  }, [reduce]);

  const s = samples[step];
  const tone = tones[s.verdict];
  const ensemble = (s.tfidf + s.bert) / 2;
  const spread = Math.abs(s.tfidf - s.bert);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          Input · headline
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          token attribution
        </span>
      </div>

      {/* ── The headline, with the spans that moved the score ── */}
      <div className="mt-3 min-h-[104px] rounded-xl border border-glass-line bg-black/25 p-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-lg font-light leading-relaxed text-ink"
          >
            {s.tokens.map(([text, w], i) => (
              <motion.span
                key={`${step}-${i}`}
                initial={{ opacity: 0.35 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="rounded-[3px] px-[3px] py-[1px]"
                style={tokenStyle(w)}
              >
                {text}{' '}
              </motion.span>
            ))}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── The two models, scored side by side ── */}
      <div className="mt-5 space-y-4">
        {[
          { name: 'TF-IDF + LogReg', score: s.tfidf, note: 'lexical' },
          { name: 'DistilBERT', score: s.bert, note: 'contextual' }
        ].map((model) => (
          <div key={model.name}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                {model.name}
                <span className="ml-2 text-ink-faint">{model.note}</span>
              </span>
              <span className="font-mono text-[11px] text-ink-faint">
                {model.score.toFixed(2)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                key={`${model.name}-${step}`}
                initial={{ width: 0 }}
                animate={{ width: `${model.score * 100}%` }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ backgroundColor: tone.bar }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Calibration: where the ensemble lands against the defer band ── */}
      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Ensemble · p(credible)
          </span>
          <span className="font-mono text-[10px] text-ink-faint">
            model spread {spread.toFixed(2)}
          </span>
        </div>

        <div className="relative h-7 rounded-md border border-glass-line bg-black/25">
          {/* The band where the model refuses to commit */}
          <div
            className="absolute inset-y-0 bg-amber-300/[0.09]"
            style={{ left: `${GATE[0] * 100}%`, right: `${(1 - GATE[1]) * 100}%` }}
          />
          <span className="absolute inset-y-0 w-px bg-white/20" style={{ left: `${GATE[0] * 100}%` }} />
          <span className="absolute inset-y-0 w-px bg-white/20" style={{ left: `${GATE[1] * 100}%` }} />
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] uppercase tracking-widest text-amber-300/60">
            defer
          </span>

          {/* The ensemble score itself */}
          <motion.span
            animate={{ left: `${ensemble * 100}%` }}
            transition={{ type: 'spring', stiffness: 180, damping: 26 }}
            className="absolute -top-1 h-[calc(100%+8px)] w-[2px] rounded-full"
            style={{ backgroundColor: tone.bar, boxShadow: `0 0 12px ${tone.bar}` }}
          />
        </div>
      </div>

      {/* ── Calibrated call ── */}
      <div className="mt-auto flex items-end justify-between gap-6 border-t border-glass-line pt-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Calibrated call
          </span>
          <motion.div
            key={s.verdict + step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-1 text-xl tracking-tight ${tone.text}`}
          >
            {s.verdict}
          </motion.div>
        </div>
        <span className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-widest text-ink-faint">
          44K articles
          <br />
          99% held-out
        </span>
      </div>
    </div>
  );
};
