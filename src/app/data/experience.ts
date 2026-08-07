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
    org: 'Fonabit Technologies',
    role: 'Software Developer & Data Research Intern',
    period: 'Jun — Sep 2025',
    place: 'Remote',
    points: [
      'Built machine learning models over internal datasets and turned the output into insights the business actually used.',
      'Shipped Tableau dashboards on top of those models, cutting manual reporting effort by roughly 70%.'
    ],
    tags: [
      'Python',
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
    ],
    metric: { value: '70%', label: 'less manual reporting' }
  },
  {
    kind: 'work',
    org: 'Pixabits Technologies',
    role: 'Software Developer Intern',
    period: 'Jun — Aug 2024',
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
    role: 'CardioSense · InfraCopilot AI · Fake News Classifier',
    period: '2025 — 2026',
    place: 'Self-directed',
    points: [
      'An on-device ECG arrhythmia classifier, a predictive-maintenance platform for EV charging networks, and a calibrated news-credibility model.',
      'Most of the modelling and embedded tooling below came from building these rather than from coursework.'
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
      'Linux'
    ],
    metric: { value: '3', label: 'shipped end to end' }
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
      'Computer Architecture'
    ]
  }
];
