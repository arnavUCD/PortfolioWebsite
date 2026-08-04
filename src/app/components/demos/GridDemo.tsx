import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Station = { id: string; risk: number; cause: string };

/** A deterministic little network, so the demo reads the same every visit. */
const stations: Station[] = [
  { id: 'DAV-0114', risk: 0.08, cause: 'nominal' },
  { id: 'DAV-0115', risk: 0.12, cause: 'nominal' },
  { id: 'SAC-0231', risk: 0.62, cause: 'connector wear' },
  { id: 'SAC-0232', risk: 0.19, cause: 'nominal' },
  { id: 'WDL-0308', risk: 0.91, cause: 'thermal derating + ground fault trend' },
  { id: 'WDL-0309', risk: 0.27, cause: 'nominal' },
  { id: 'VAC-0417', risk: 0.44, cause: 'session dropout rate rising' },
  { id: 'VAC-0418', risk: 0.06, cause: 'nominal' },
  { id: 'FFD-0522', risk: 0.15, cause: 'nominal' },
  { id: 'FFD-0523', risk: 0.78, cause: 'contactor cycling anomaly' },
  { id: 'DIX-0630', risk: 0.31, cause: 'nominal' },
  { id: 'DIX-0631', risk: 0.09, cause: 'nominal' }
];

const riskColor = (risk: number) =>
  risk >= 0.7 ? '#be123c' : risk >= 0.4 ? '#b45309' : '#135029';

export const GridDemo = () => {
  const reduce = useReducedMotion();

  // Cycle through the stations the model would actually escalate.
  const flagged = useMemo(
    () => stations.map((s, i) => ({ ...s, i })).filter((s) => s.risk >= 0.4),
    []
  );
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setCursor((c) => (c + 1) % flagged.length), 2800);
    return () => clearInterval(id);
  }, [flagged.length, reduce]);

  const active = flagged[cursor];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Network · 12 chargers
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Nightly scoring
        </span>
      </div>

      {/* Station grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {stations.map((s, i) => {
          const isActive = active?.i === i;
          const color = riskColor(s.risk);
          return (
            <motion.div
              key={s.id}
              animate={{
                scale: isActive ? 1.04 : 1,
                borderColor: isActive ? color : 'rgba(0,0,0,0.07)'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="relative aspect-[4/3] rounded-lg border bg-white/45 p-2 overflow-hidden"
            >
              <span className="text-[9px] font-mono text-neutral-500 leading-none">
                {s.id.slice(0, 3)}
              </span>

              {/* Risk fill */}
              <div className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-black/[0.07] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.risk * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.04 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>

              {isActive && (
                <motion.span
                  layoutId="risk-halo"
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className="absolute inset-0 rounded-lg"
                  style={{ boxShadow: `inset 0 0 0 1.5px ${color}, 0 8px 24px -14px ${color}` }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Escalation readout */}
      <div className="mt-6 rounded-xl border border-black/[0.07] bg-white/45 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Escalated
          </span>
          <span className="text-[10px] font-mono text-neutral-500">
            recall 0.90 · cost-weighted
          </span>
        </div>

        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3 flex items-end justify-between gap-6"
          >
            <div>
              <div className="font-mono text-lg text-neutral-900">{active.id}</div>
              <div className="text-sm text-neutral-600 font-light mt-1">{active.cause}</div>
            </div>
            <div className="text-right shrink-0">
              <div
                className="font-display text-4xl leading-none"
                style={{ color: riskColor(active.risk) }}
              >
                {active.risk.toFixed(2)}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                failure risk
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
