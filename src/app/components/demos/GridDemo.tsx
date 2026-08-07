import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Station = { id: string; risk: number; cause: string; action: string };

/** A deterministic little network, so the demo reads the same every visit. */
const stations: Station[] = [
  { id: 'DAV-0114', risk: 0.08, cause: 'nominal', action: 'none' },
  { id: 'DAV-0115', risk: 0.12, cause: 'nominal', action: 'none' },
  { id: 'SAC-0231', risk: 0.62, cause: 'connector wear', action: 'inspect within 14 days' },
  { id: 'SAC-0232', risk: 0.19, cause: 'nominal', action: 'none' },
  { id: 'WDL-0308', risk: 0.91, cause: 'thermal derating + ground fault trend', action: 'dispatch now' },
  { id: 'WDL-0309', risk: 0.27, cause: 'nominal', action: 'none' },
  { id: 'VAC-0417', risk: 0.44, cause: 'session dropout rate rising', action: 'schedule next cycle' },
  { id: 'VAC-0418', risk: 0.06, cause: 'nominal', action: 'none' },
  { id: 'FFD-0522', risk: 0.15, cause: 'nominal', action: 'none' },
  { id: 'FFD-0523', risk: 0.78, cause: 'contactor cycling anomaly', action: 'dispatch this week' },
  { id: 'DIX-0630', risk: 0.31, cause: 'nominal', action: 'none' },
  { id: 'DIX-0631', risk: 0.09, cause: 'nominal', action: 'none' }
];

/**
 * The decision threshold. Deliberately not 0.5: a missed failure strands a
 * driver and costs far more than sending a technician to a healthy charger,
 * so the cutoff sits low and the model accepts false alarms to buy recall.
 */
const THRESHOLD = 0.4;

const riskColor = (risk: number) =>
  risk >= 0.7 ? '#fb7185' : risk >= THRESHOLD ? '#fbbf24' : 'var(--accent)';

/** Deterministic 14-day history that lands on the station's current risk. */
const history = (station: Station) =>
  Array.from({ length: 14 }, (_, i) => {
    const drift = (Math.sin(i * 1.7 + station.risk * 11) + 1) / 2;
    const ramp = i / 13;
    return Math.max(0.02, Math.min(0.98, station.risk * (0.35 + 0.65 * ramp) + drift * 0.09 - 0.04));
  });

export const GridDemo = () => {
  const reduce = useReducedMotion();

  const flagged = useMemo(
    () => stations.map((s, i) => ({ ...s, i })).filter((s) => s.risk >= THRESHOLD),
    []
  );
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setCursor((c) => (c + 1) % flagged.length), 3400);
    return () => clearInterval(id);
  }, [flagged.length, reduce]);

  const active = flagged[cursor];
  const trend = useMemo(() => (active ? history(active) : []), [active]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          Network · {stations.length} chargers
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          Nightly scoring · {flagged.length} flagged
        </span>
      </div>

      {/* ── Risk axis: every charger placed against the decision threshold ── */}
      <div className="rounded-xl border border-glass-line bg-black/25 px-4 pb-3 pt-4">
        <div className="relative h-9">
          {/* The region the model escalates */}
          <div
            className="absolute inset-y-0 rounded-r-md bg-rose-400/[0.07]"
            style={{ left: `${THRESHOLD * 100}%`, right: 0 }}
          />
          {/* Axis */}
          <div className="absolute inset-x-0 bottom-3 h-px bg-white/12" />

          {/* Threshold marker */}
          <div className="absolute inset-y-0" style={{ left: `${THRESHOLD * 100}%` }}>
            <div className="h-6 w-px bg-white/45" />
            <span className="absolute -left-3 top-6 font-mono text-[9px] text-ink-faint">
              {THRESHOLD.toFixed(2)}
            </span>
          </div>

          {/* Each charger as a tick */}
          {stations.map((s, i) => (
            <motion.span
              key={s.id}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              className="absolute bottom-3 w-[3px] origin-bottom rounded-full"
              style={{
                left: `calc(${s.risk * 100}% - 1.5px)`,
                height: active?.i === i ? 22 : 13,
                backgroundColor: riskColor(s.risk),
                opacity: active?.i === i ? 1 : 0.55
              }}
            />
          ))}
        </div>

        <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-ink-faint">
          <span>0.00 · healthy</span>
          <span className="text-rose-300/70">escalate →</span>
          <span>1.00</span>
        </div>
      </div>

      {/* ── The network itself ── */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {stations.map((s, i) => {
          const isActive = active?.i === i;
          const color = riskColor(s.risk);
          return (
            <motion.div
              key={s.id}
              animate={{ scale: isActive ? 1.06 : 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="relative aspect-square overflow-hidden rounded-lg border p-1.5"
              style={{
                borderColor: isActive ? color : 'rgba(255,255,255,0.08)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)'
              }}
            >
              <span className="font-mono text-[8px] leading-none text-ink-faint">
                {s.id.slice(0, 3)}
              </span>
              <div className="absolute inset-x-1.5 bottom-1.5 h-[3px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.risk * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.035 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Escalation readout ── */}
      {active && (
        <div className="mt-4 rounded-xl border border-glass-line bg-black/25 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: riskColor(active.risk) }} />
                <motion.span
                  key={active.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-base text-ink"
                >
                  {active.id}
                </motion.span>
              </div>
              <motion.p
                key={active.cause}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-1.5 text-sm font-light text-ink-dim"
              >
                {active.cause}
              </motion.p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                → {active.action}
              </p>
            </div>

            <div className="shrink-0 text-right">
              {/* 14-day risk trend for the escalated charger */}
              <svg viewBox="0 0 90 26" className="mb-1.5 w-[90px]">
                <polyline
                  points={trend.map((v, i) => `${(i / 13) * 90},${26 - v * 24}`).join(' ')}
                  fill="none"
                  stroke={riskColor(active.risk)}
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <motion.div
                key={active.risk}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-3xl leading-none"
                style={{ color: riskColor(active.risk) }}
              >
                {active.risk.toFixed(2)}
              </motion.div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">
                14-day risk
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-glass-line pt-3 font-mono text-[9px] uppercase tracking-widest text-ink-faint">
            <span>recall 0.90</span>
            <span>threshold tuned on cost, not accuracy</span>
          </div>
        </div>
      )}
    </div>
  );
};
