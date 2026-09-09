export type Metric = {
  label: string;
  value: string;
  /** Small qualifier under the number — the caveat that keeps it honest. */
  note: string;
};

export type ProjectLink = {
  label: string;
  href: string;
  kind: 'github' | 'live' | 'deck';
};

export type Project = {
  id: string;
  slug: string;
  /**
   * What the system actually does, in order. These type out in the card, so
   * they should read as steps a machine performs — not as marketing copy.
   */
  steps: string[];
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
  links: ProjectLink[];
  /** Folder colour used in the project desk. */
  folderColor: string;
  folderDark: string;
};

const cardioSensePitchDeck = new URL('../../../CardioSense_Pitch.pdf', import.meta.url).href;

export const projects: Project[] = [
  {
    id: 'verity-ai',
    slug: 'verity-ai',
    steps: [
      'poll bank via Plaid cursor sync',
      'match against open Zoho invoices',
      'structured reference, exactly one candidate?',
      'post payment · audit marked automated'
    ],
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
      { label: 'Pipeline', value: '6 stages', note: 'ingest through report' },
      { label: 'Safety layers', value: '3', note: 'agent, API, database' },
      { label: 'Live connectors', value: '2', note: 'Plaid and Zoho Books' },
      { label: 'Decision rule', value: 'Evidence', note: 'the model never authorizes' }
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
    ],
    links: [
      { label: 'Live site', href: 'https://arnavucd.github.io/verity-site/', kind: 'live' },
      { label: 'Site source', href: 'https://github.com/arnavUCD/verity-site', kind: 'github' }
    ],
    folderColor: '#242b2b',
    folderDark: '#151919'
  },
  {
    id: 'cardiosense',
    slug: 'cardiosense',
    steps: [
      'bandpass + notch filter, lead II',
      'Pan-Tompkins R-peak detection',
      '1D CNN · 43K params · 10 ms',
      'confidence below 0.60 → defer'
    ],
    title: 'CardioSense',
    category: 'Embedded ML / Health',
    year: '2026',
    tagline: 'Continuous ECG monitoring for patients underserved by consumer wearables.',
    stack: ['PyTorch', 'NumPy', 'SciPy', 'SwiftUI', 'Streamlit', 'BLE'],
    metrics: [
      { label: 'Held-out accuracy', value: '90.9%', note: '2,741 windows' },
      { label: 'Arrhythmia recall', value: '88.7%', note: 'record-separated test' },
      { label: 'Model', value: '43K', note: 'trainable parameters' },
      { label: 'Built in', value: '24 h', note: 'end to end' }
    ],
    client: 'UC Davis',
    role: 'PyTorch, DSP, SwiftUI, BLE',
    description:
      'A no-cloud ECG monitoring prototype pairing an AD8232 patch and signal-processing pipeline with a compact CNN, a calm SwiftUI patient app, and a detailed clinician dashboard.',
    highlights: [
      'Trained a 43,362-parameter 1D CNN on MIT-BIH clinical ECG data to classify 10-second windows as Normal or Arrhythmia, reaching 90.9% held-out accuracy.',
      'Runs the complete inference pipeline locally on a laptop; the SwiftUI patient app polls its output over the local network without a cloud service.',
      'Built the full signal-processing pipeline: bandpass/notch filtering, Pan-Tompkins R-peak detection, and HRV feature extraction.',
      'Built separate patient and clinician interfaces for rhythm status, event history, ECG waveforms, probabilities, HRV, and signal quality.'
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/arnavUCD/CardioSense', kind: 'github' },
      { label: 'Pitch deck', href: cardioSensePitchDeck, kind: 'deck' }
    ],
    folderColor: '#7eb6c8',
    folderDark: '#4f8fa4'
  },
  {
    id: 'infracopilot-ai',
    slug: 'infracopilot-ai',
    steps: [
      'score 50K chargers in one pass',
      'load cost-aware threshold from model metadata',
      'rank risk and explain top contributors',
      'recommend action, urgency, and savings'
    ],
    title: 'InfraCopilot AI',
    category: 'Predictive ML / Decision Support',
    year: '2026',
    tagline: 'Predictive maintenance that flags a charger before it strands a driver.',
    stack: ['Python', 'scikit-learn', 'SMOTE', 'Pandas', 'NumPy'],
    metrics: [
      { label: 'Failure recall', value: '90%', note: 'cost-aware threshold' },
      { label: 'Simulated savings', value: '$300K+', note: 'per network / yr' },
      { label: 'Fleet scoring', value: '<3 sec', note: '50K chargers' },
      { label: 'Dataset', value: '50K', note: 'simulated chargers' }
    ],
    client: 'UC Davis',
    role: 'Python, scikit-learn, Pandas, cost-aware modeling',
    description:
      'A fleet-triage ML prototype that scores simulated EV chargers, ranks failure risk, explains the leading contributing conditions, and recommends maintenance actions.',
    highlights: [
      'Developed a cost-aware model over 50,000 simulated chargers, reporting 90%+ failure recall and $300K+ in modeled savings.',
      'Built a vectorized engine that scores 50,000 chargers in under three seconds and exports a ranked maintenance queue.',
      'Explains each score with coefficient-based feature contributions and maps the leading condition to an actionable recommendation.',
      'Tuned the decision threshold around a 24× cost asymmetry between a missed failure and a false alert.'
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/arnavUCD/InfraCopilot-AI', kind: 'github' }
    ],
    folderColor: '#c49a68',
    folderDark: '#987044'
  },
  {
    id: 'fake-news-classifier',
    slug: 'fake-news-classifier',
    steps: [
      'TF-IDF + logistic regression',
      'fine-tuned DistilBERT',
      'ensemble p(credible)',
      'inside 0.35–0.65 → defer'
    ],
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
    ],
    links: [],
    folderColor: '#a7a99a',
    folderDark: '#797c6e'
  }
];

/** Look a project up by its URL slug. */
export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);
