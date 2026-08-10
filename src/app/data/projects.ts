/** Which animated demo renders in the project's live panel. */
export type DemoKey = 'recon' | 'ecg' | 'grid' | 'nlp';

export type Metric = {
  label: string;
  value: string;
  /** Small qualifier under the number — the caveat that keeps it honest. */
  note: string;
};

export type Project = {
  id: string;
  slug: string;
  demo: DemoKey;
  title: string;
  category: string;
  year: string;
  /** One line, used wherever the project is listed. */
  tagline: string;
  stack: string[];
  metrics: Metric[];
  /** Where the work happened. */
  client: string;
  /** Condensed stack line for the case-study sidebar. */
  role: string;
  description: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    id: 'verity-ai',
    slug: 'verity-ai',
    demo: 'recon',
    title: 'Verity AI',
    category: 'Agentic AI / Fintech',
    year: '2026',
    tagline: 'An AI finance agent that knows exactly when not to act on its own.',
    stack: [
      'Python',
      'FastAPI',
      'LangGraph',
      'PostgreSQL',
      'MCP',
      'Plaid',
      'Zoho Books',
      'Gemini',
      'Docker'
    ],
    metrics: [
      { label: 'Unsafe auto-posts', value: '0', note: 'across a live bank run' },
      { label: 'Self-approval blocks', value: '3×', note: 'agent, API, database' },
      { label: 'Credit issuance', value: 'Exactly once', note: 'crash-injected tests' },
      { label: 'Infrastructure', value: 'Live', note: 'real bank, real books' }
    ],
    client: 'Independent',
    role: 'LangGraph, FastAPI, PostgreSQL RLS, Plaid, Zoho Books',
    description:
      'An agentic finance system that reads bank transactions and invoices, reasons about what to do, and defers to a human for everything it is not certain about. Built and run end to end against real infrastructure — a linked bank account through Plaid, a live Zoho Books organisation, and a real LLM — rather than simulated data.',
    highlights: [
      'Enforced a single rule that makes unattended action safe — existence is not attribution. The agent posts automatically only when a transaction carries a genuine structured invoice reference resolving to exactly one open invoice; a coincidental name match or multiple plausible candidates route to a human instead of being guessed at.',
      'Made agent self-approval structurally impossible at three independent levels: the agent’s tool surface has no approve capability, the API checks the caller’s role, and the database re-derives the approver’s identity and rejects self-approval even for a legitimate approver.',
      'Achieved exactly-once credit issuance internally with a transactional outbox and idempotency keys, proven under tests that deliberately inject crashes mid-transaction and concurrent retries.',
      'Designed at-most-once write-back to Zoho honestly rather than overclaiming a guarantee an external API cannot give: deterministic reference tags, a reconciliation check before every write, and a background sweep for duplicates — adversarially tested against the write-succeeds-but-local-record-fails case that causes real double-payments.',
      'Isolated tenants with PostgreSQL Row-Level Security verified against active spoofing, and marked every automated decision in the audit trail with a database rule that makes it impossible to disguise as a human approval.'
    ]
  },
  {
    id: 'cardiosense',
    slug: 'cardiosense',
    demo: 'ecg',
    title: 'CardioSense',
    category: 'Embedded ML / Health',
    year: '2026',
    tagline: 'Atrial fibrillation detection on a $30 wrist device, no cloud.',
    stack: ['PyTorch', 'NumPy', 'SciPy', 'SwiftUI', 'Streamlit', 'BLE'],
    metrics: [
      { label: 'Accuracy', value: '91%', note: '95% with safety gate' },
      { label: 'Inference', value: '10 ms', note: 'on-device' },
      { label: 'Model', value: '200 KB', note: '43K params' },
      { label: 'Built in', value: '24 h', note: 'end to end' }
    ],
    client: 'UC Davis',
    role: 'PyTorch, DSP, SwiftUI, BLE',
    description:
      'A sub-$30 wearable ECG that continuously detects atrial fibrillation entirely on-device — no cloud — returning a rhythm verdict in under 10 seconds. Built end-to-end in 24 hours.',
    highlights: [
      'Trained a 43K-parameter 1D CNN (PyTorch) on MIT-BIH clinical ECG data to classify 10-second windows as Normal or Arrhythmia, reaching ~91% accuracy — 95% with a strict "Uncertain" safety gate.',
      '~10 ms inference from a 200 KB model, small enough to run continuously on constrained hardware.',
      'Built the full signal-processing pipeline: bandpass/notch filtering, Pan-Tompkins R-peak detection, and HRV feature extraction.',
      'Shipped real-time SwiftUI patient and Streamlit clinician interfaces streaming over BLE.'
    ]
  },
  {
    id: 'infracopilot-ai',
    slug: 'infracopilot-ai',
    demo: 'grid',
    title: 'InfraCopilot AI',
    category: 'Full-Stack / Predictive ML',
    year: '2026',
    tagline: 'Predictive maintenance that flags a charger before it strands a driver.',
    stack: ['scikit-learn', 'SMOTE', 'FastAPI', 'Next.js', 'Pandas'],
    metrics: [
      { label: 'Failure recall', value: '90%', note: 'cost-aware threshold' },
      { label: 'Simulated savings', value: '$300K+', note: 'per network / yr' },
      { label: 'Scoring', value: 'Real time', note: 'FastAPI' },
      { label: 'Surface', value: 'Dashboard', note: 'root-cause insights' }
    ],
    client: 'UC Davis',
    role: 'scikit-learn, FastAPI, Next.js',
    description:
      'A full-stack predictive-maintenance platform for EV charging networks that flags failing chargers before they strand a driver.',
    highlights: [
      'Developed a cost-aware ML model (scikit-learn, SMOTE) achieving ~90% failure recall and $300K+ in simulated savings.',
      'Engineered a FastAPI backend serving real-time risk scores across the network.',
      'Built a Next.js dashboard surfacing root-cause insights and actionable maintenance recommendations.',
      'Tuned the decision threshold around the real cost asymmetry between a missed failure and a false alarm.'
    ]
  },
  {
    id: 'fake-news-classifier',
    slug: 'fake-news-classifier',
    demo: 'nlp',
    title: 'Fake News Classifier',
    category: 'NLP / Machine Learning',
    year: '2025',
    tagline: 'Credibility scoring that is allowed to say it isn’t sure.',
    stack: ['DistilBERT', 'TF-IDF', 'scikit-learn', 'Pandas'],
    metrics: [
      { label: 'Test accuracy', value: '99%', note: 'held-out' },
      { label: 'Corpus', value: '44K', note: 'real articles' },
      { label: 'Models', value: '2', note: 'classical + transformer' },
      { label: 'Output', value: 'Probabilistic', note: 'not binary' }
    ],
    client: 'UC Davis',
    role: 'NLP, DistilBERT, scikit-learn',
    description:
      'An end-to-end NLP pipeline that assesses news credibility, trained on ~44K real-world articles across classical and transformer approaches.',
    highlights: [
      'Compared TF-IDF + Logistic Regression against a fine-tuned DistilBERT transformer on the same corpus.',
      'Achieved ~99% test accuracy with rigorous held-out evaluation.',
      'Designed probabilistic credibility scoring that goes beyond binary real/fake labels.',
      'Emphasized ethical model outputs — calibrated confidence instead of false certainty.'
    ]
  }
];

/** Look a project up by its URL slug. */
export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);
