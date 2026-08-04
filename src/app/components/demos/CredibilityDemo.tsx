import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const samples = [
  {
    headline: 'Central bank holds rates steady, citing softening wage growth',
    tfidf: 0.88,
    bert: 0.94,
    verdict: 'Credible'
  },
  {
    headline: 'Scientists confirm single fruit reverses ageing in one week',
    tfidf: 0.09,
    bert: 0.03,
    verdict: 'Low credibility'
  },
  {
    headline: 'Local council votes to expand transit after four-hour hearing',
    tfidf: 0.71,
    bert: 0.86,
    verdict: 'Credible'
  },
  {
    headline: 'Anonymous source claims major merger talks under way',
    tfidf: 0.52,
    bert: 0.49,
    verdict: 'Uncertain'
  }
];

const verdictTone: Record<string, { text: string; bar: string }> = {
  Credible: { text: 'text-[#135029]', bar: '#135029' },
  Uncertain: { text: 'text-amber-700', bar: '#b45309' },
  'Low credibility': { text: 'text-rose-700', bar: '#be123c' }
};

export const CredibilityDemo = () => {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % samples.length), 3600);
    return () => clearInterval(id);
  }, [reduce]);

  const s = samples[step];
  const tone = verdictTone[s.verdict];

  return (
    <div className="flex flex-col h-full">
      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
        Input · headline + body
      </span>

      {/* Headline under evaluation */}
      <div className="mt-3 min-h-[92px] rounded-xl border border-black/[0.07] bg-white/45 p-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={s.headline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-light text-neutral-800 leading-snug"
          >
            “{s.headline}”
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Two models, side by side */}
      <div className="mt-6 space-y-5">
        {[
          { name: 'TF-IDF + LogReg', score: s.tfidf },
          { name: 'DistilBERT', score: s.bert }
        ].map((model) => (
          <div key={model.name}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-600">
                {model.name}
              </span>
              <span className="font-mono text-xs text-neutral-500">
                p(credible) = {model.score.toFixed(2)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-black/[0.07] overflow-hidden">
              <motion.div
                key={`${model.name}-${step}`}
                initial={{ width: 0 }}
                animate={{ width: `${model.score * 100}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ backgroundColor: tone.bar }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Calibrated call */}
      <div className="mt-auto pt-6 flex items-end justify-between gap-6 border-t border-black/[0.07] mt-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Calibrated call
          </span>
          <motion.div
            key={s.verdict + step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xl tracking-tight mt-1 ${tone.text}`}
          >
            {s.verdict}
          </motion.div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 text-right leading-relaxed">
          44K articles
          <br />
          99% held-out
        </span>
      </div>
    </div>
  );
};
