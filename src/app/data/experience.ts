export type ExperienceEntry = {
  kind: 'work' | 'projects' | 'education';
  org: string;
  role: string;
  /** Long form, shown in the card. */
  period: string;
  place: string;
  points: string[];
  /**
   * Everything this source taught. These populate the skill cloud directly —
   * one node per unique name, one link per entry that claims it.
   */
  tags: string[];
  /** The headline figure, where there is one. */
  metric?: { value: string; label: string };
};

export const experience: ExperienceEntry[] = [
  {
    kind: 'work',
    org: 'Fonabit AI',
    role: 'Software Engineer Intern',
    period: 'Jun — Sep 2026',
    place: 'Remote',
    points: [
      'Built custom MCP servers and APIs that connect LLM agents to enterprise CRM data.',
      'Designed A2A multi-agent workflows for sales and lead management with RBAC, prompt-injection defenses, and human approval for high-stakes actions.',
      'Optimized prompt chains and context retrieval to reduce token overhead and response latency.'
    ],
    tags: [
      'Python',
      'REST APIs',
      'MCP',
      'LLM Agents',
      'Agent-to-Agent (A2A)',
      'RBAC',
      'Prompt Injection Defense',
      'Human-in-the-loop',
      'Prompt Engineering',
      'Context Engineering',
      'scikit-learn',
      'Pandas',
      'NumPy',
      'SQL',
      'Machine Learning',
      'Feature Engineering',
      'Model Evaluation',
      'Data Visualization',
      'Tableau',
      'Salesforce'
    ]
  },
  {
    kind: 'work',
    org: 'Pixabits Technologies',
    role: 'Software Developer Intern',
    period: 'Jun — Aug 2025',
    place: 'Remote',
    points: [
      'Built backend services and REST APIs in Python and Java, improving response time and throughput by over 50%.',
      'Implemented responsive UI from Figma designs and refined components against user analytics.'
    ],
    tags: [
      'Python',
      'Java',
      'JavaScript',
      'TypeScript',
      'REST APIs',
      'Backend Services',
      'Performance Testing',
      'Debugging',
      'React',
      'Responsive UI',
      'Figma',
      'Git'
    ],
    metric: { value: '50%', label: 'faster responses' }
  },
  {
    kind: 'projects',
    org: 'Independent Projects',
    role: 'Credere AI · CardioSense · InfraCopilot AI · Fake News Classifier',
    period: '2025 — 2026',
    place: 'Self-directed',
    points: [
      'Built an agentic accounting platform, a local ECG monitoring pipeline, an EV fleet-triage model, and a calibrated news-credibility classifier.',
      'Shipped across agent orchestration, ML, signal processing, backend infrastructure, and product interfaces.'
    ],
    tags: [
      'PyTorch',
      'CNNs',
      'DistilBERT',
      'Transformers',
      'NLP',
      'TF-IDF',
      'SMOTE',
      'scikit-learn',
      'Pandas',
      'NumPy',
      'SciPy',
      'DSP',
      'FastAPI',
      'Next.js',
      'Streamlit',
      'Swift',
      'Arduino / BLE',
      'Embedded Systems',
      'Linux',
      'LangGraph',
      'MCP',
      'LLM Agents',
      'PostgreSQL RLS',
      'Docker',
      'pytest',
      'Astro'
    ],
    metric: { value: '4', label: 'shipped end to end' }
  },
  {
    kind: 'education',
    org: 'University of California, Davis',
    role: 'B.S. Computer Science · Minor in Business Studies',
    period: 'Sep 2023 — Jun 2027',
    place: 'Davis, CA',
    points: [
      "Dean's List, Spring 2024 — College of Engineering.",
      'Coursework in machine learning, artificial intelligence, and computer vision, alongside operating systems and computer architecture.'
    ],
    tags: [
      'Machine Learning',
      'Artificial Intelligence',
      'Computer Vision',
      'OpenCV',
      'Data Structures',
      'Algorithms',
      'C',
      'C++',
      'Assembly',
      'Operating Systems',
      'Concurrency',
      'Multithreading',
      'Memory Management',
      'CPU Pipelining',
      'Caches',
      'Computer Architecture',
      'Haskell',
      'Erlang',
      'Prolog',
      'Functional Programming',
      'Logic Programming'
    ]
  }
];
