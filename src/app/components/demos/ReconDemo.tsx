import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** The pipeline a single transaction walks through, in order. */
const STAGES = ['ingest', 'match', 'classify', 'commit', 'settled'] as const;
type Stage = (typeof STAGES)[number];

const STAGE_MS: Record<Stage, number> = {
  ingest: 900,
  match: 1700,
  classify: 1100,
  commit: 1700,
  settled: 1200
};

type Invoice = { id: string; customer: string; amount: number };

/** The open ledger the matcher reasons against — the "company invoice database". */
const invoices: Invoice[] = [
  { id: 'INV-1042', customer: 'Northwind LLC', amount: 2000 },
  { id: 'INV-1088', customer: 'Fabrikam Inc', amount: 6000 },
  { id: 'INV-1103', customer: 'Contoso Corp', amount: 4750 },
  { id: 'INV-1120', customer: 'Acme Holdings', amount: 18400 }
];

type Txn = {
  desc: string;
  bank: string;
  amount: number;
  /** The structured reference, when the transaction genuinely carries one. */
  reference: string | null;
  /** The invoice it resolves to with confidence. Null means no confident match. */
  matchId: string | null;
  /**
   * An invoice it merely *resembles* — same customer name, even the same amount.
   * Deliberately not enough to act on: existence is not attribution.
   */
  resembles?: string;
  classification: string;
  detail: string;
  tone: 'ok' | 'hold' | 'flag';
  auto: boolean;
  decision: string;
  audit: string;
};

const feed: Txn[] = [
  {
    desc: 'ACH CREDIT · NORTHWIND LLC',
    bank: 'Chase ····4417 · REF INV-1042',
    amount: 2000,
    reference: 'INV-1042',
    matchId: 'INV-1042',
    classification: 'Payment',
    detail: 'structured reference resolves to one open invoice, settles it in full',
    tone: 'ok',
    auto: true,
    decision: 'Payment written to Zoho Books',
    audit: 'automated · cannot be recorded as human-approved'
  },
  {
    desc: 'ZELLE FROM ACME HOLDINGS',
    bank: 'Bank of America ····8102',
    amount: 18400,
    reference: null,
    matchId: null,
    resembles: 'INV-1120',
    classification: 'Ambiguous',
    detail: 'customer name and amount both match INV-1120 — resemblance, not attribution',
    tone: 'hold',
    auto: false,
    decision: 'Routed to approval queue',
    audit: 'queued · awaiting a named approver'
  },
  {
    desc: 'ACH CREDIT · NORTHWIND LLC',
    bank: 'Chase ····4417 · REF INV-1042',
    amount: 2000,
    reference: 'INV-1042',
    matchId: 'INV-1042',
    classification: 'Duplicate',
    detail: 'INV-1042 was settled earlier in this run — candidate for a credit note',
    tone: 'flag',
    auto: false,
    decision: 'Routed to approval queue',
    audit: 'queued · awaiting a named approver'
  },
  {
    desc: 'WIRE IN · CONTOSO CORP',
    bank: 'Wells Fargo ····2290 · REF INV-1103',
    amount: 4750,
    reference: 'INV-1103',
    matchId: 'INV-1103',
    classification: 'Payment',
    detail: 'structured reference resolves to one open invoice, settles it in full',
    tone: 'ok',
    auto: true,
    decision: 'Payment written to Zoho Books',
    audit: 'automated · cannot be recorded as human-approved'
  }
];

const tones = {
  ok: { text: 'text-accent', dot: 'bg-accent', hex: 'var(--accent)' },
  hold: { text: 'text-amber-300', dot: 'bg-amber-400', hex: '#fbbf24' },
  flag: { text: 'text-rose-300', dot: 'bg-rose-400', hex: '#fb7185' }
} as const;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const freshLedger = () =>
  Object.fromEntries(invoices.map((i) => [i.id, 'open'])) as Record<string, 'open' | 'paid'>;

export const ReconDemo = () => {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('ingest');
  const [ledger, setLedger] = useState(freshLedger);

  const txn = feed[index];
  const tone = tones[txn.tone];
  const stageAt = STAGES.indexOf(stage);

  // Drive the pipeline: each stage hands off to the next, then the next
  // transaction. Under reduced motion nothing advances — the first case is
  // shown already resolved instead.
  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => {
      if (stage !== 'settled') {
        setStage(STAGES[stageAt + 1]);
      } else {
        setIndex((i) => (i + 1) % feed.length);
        setStage('ingest');
      }
    }, STAGE_MS[stage]);
    return () => clearTimeout(id);
  }, [stage, stageAt, index, reduce]);

  // The write itself, landing partway through the commit stage so it reads as
  // something happening rather than a state that was always true.
  useEffect(() => {
    if (reduce || stage !== 'commit' || !txn.auto || !txn.matchId) return;
    const id = window.setTimeout(
      () => setLedger((l) => ({ ...l, [txn.matchId!]: 'paid' })),
      850
    );
    return () => clearTimeout(id);
  }, [stage, txn, reduce]);

  // Start each pass from a clean ledger, so the duplicate case has something
  // to actually be a duplicate of.
  useEffect(() => {
    if (index === 0 && stage === 'ingest') setLedger(freshLedger());
  }, [index, stage]);

  // Reduced motion: present the first case fully resolved, no movement.
  useEffect(() => {
    if (!reduce) return;
    setStage('settled');
    setLedger({ ...freshLedger(), 'INV-1042': 'paid' });
  }, [reduce]);

  const steps = useMemo(
    () => ['Ingest', 'Match', 'Classify', txn.auto ? 'Write' : 'Route'],
    [txn.auto]
  );

  const showMatch = stageAt >= STAGES.indexOf('classify');
  const written = stageAt >= STAGES.indexOf('commit');

  return (
    <div className="flex h-full flex-col">
      {/* ── Source ── */}
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          Live bank feed · Plaid
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          cursor sync
        </span>
      </div>

      <motion.div
        key={`txn-${index}`}
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 flex items-start justify-between gap-4 rounded-xl border border-glass-line bg-black/25 p-4"
      >
        <div className="min-w-0">
          <div className="font-mono text-sm text-ink">{txn.desc}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            {txn.bank}
          </div>
        </div>
        <span className="shrink-0 font-display text-2xl leading-none text-ink">
          {usd.format(txn.amount)}
        </span>
      </motion.div>

      {/* ── Pipeline ── */}
      <div className="mt-4 flex items-center gap-1.5">
        {steps.map((label, i) => {
          const done = i < stageAt;
          const active = i === stageAt || (stage === 'settled' && i === steps.length - 1);
          return (
            <div key={label} className="flex flex-1 items-center gap-1.5">
              <motion.span
                animate={{
                  backgroundColor: done || active ? tone.hex : 'rgba(255,255,255,0.14)',
                  scale: active ? 1.5 : 1
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 w-1.5 shrink-0 rounded-full"
              />
              <span
                className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${
                  done || active ? tone.text : 'text-ink-faint/50'
                }`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <span className="relative h-px flex-1 overflow-hidden bg-white/10">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 origin-left"
                    style={{ backgroundColor: tone.hex }}
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── The invoice database being matched against ── */}
      <div className="mt-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Open invoices · Zoho Books
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            {txn.reference ? `ref ${txn.reference}` : 'no reference'}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-glass-line bg-black/25">
          {/* Scan sweep, only while matching */}
          {stage === 'match' && !reduce && (
            <motion.span
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              transition={{ duration: STAGE_MS.match / 1000, ease: 'linear' }}
              className="pointer-events-none absolute inset-x-0 z-10 h-10"
              style={{
                background: `linear-gradient(180deg, transparent, ${tone.hex}22, transparent)`
              }}
            />
          )}

          {invoices.map((inv) => {
            const isMatch = showMatch && txn.matchId === inv.id;
            const isDecoy = showMatch && txn.resembles === inv.id;
            const paid = ledger[inv.id] === 'paid';
            return (
              <motion.div
                key={inv.id}
                animate={{
                  backgroundColor: isMatch
                    ? 'rgba(255,255,255,0.05)'
                    : isDecoy
                      ? 'rgba(251,191,36,0.06)'
                      : 'rgba(255,255,255,0)'
                }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 border-b border-white/[0.05] px-3 py-2 last:border-b-0"
              >
                <span
                  className={`font-mono text-[11px] ${isMatch || isDecoy ? 'text-ink' : 'text-ink-faint'}`}
                >
                  {inv.id}
                </span>
                <span
                  className={`truncate text-xs font-light ${isMatch || isDecoy ? 'text-ink-dim' : 'text-ink-faint'}`}
                >
                  {inv.customer}
                </span>
                <span className="flex items-center gap-2.5">
                  <span
                    className={`font-mono text-[11px] ${isMatch || isDecoy ? 'text-ink-dim' : 'text-ink-faint'}`}
                  >
                    {usd.format(inv.amount)}
                  </span>
                  <span className="w-[3.6rem] text-right font-mono text-[9px] uppercase tracking-widest">
                    {paid ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-accent"
                      >
                        paid
                      </motion.span>
                    ) : isMatch ? (
                      <span className={tone.text}>matched</span>
                    ) : isDecoy ? (
                      <span className="text-amber-300">resembles</span>
                    ) : (
                      <span className="text-ink-faint/60">open</span>
                    )}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Classification ── */}
      <div className="mt-4 min-h-[46px]">
        {stageAt >= STAGES.indexOf('classify') && (
          <motion.div
            key={`cls-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center gap-2.5">
              <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
              <span className={`text-sm tracking-tight ${tone.text}`}>{txn.classification}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                classified
              </span>
            </div>
            <p className="mt-1.5 text-xs font-light leading-relaxed text-ink-dim">{txn.detail}</p>
          </motion.div>
        )}
      </div>

      {/* ── Decision ── */}
      <div className="mt-auto min-h-[62px] border-t border-glass-line pt-4">
        {written && (
          <motion.div
            key={`dec-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className={`text-base tracking-tight ${tone.text}`}>{txn.decision}</span>
              {txn.auto ? (
                <span className="shrink-0 rounded-full border border-accent/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-accent">
                  no human in loop
                </span>
              ) : (
                <span className="shrink-0 rounded-full border border-amber-300/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-300">
                  needs approval
                </span>
              )}
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              audit: {txn.audit}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
