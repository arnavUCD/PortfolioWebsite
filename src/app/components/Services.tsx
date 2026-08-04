import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

type Entry = {
  kind: 'work' | 'education';
  org: string;
  role: string;
  period: string;
  place: string;
  points: string[];
  tags: string[];
};

const timeline: Entry[] = [
  {
    kind: 'work',
    org: 'Fonabit Technologies',
    role: 'Software Developer & Data Research Intern',
    period: 'Jun — Sep 2025',
    place: 'Remote',
    points: [
      'Built machine learning models over internal datasets and turned the output into insights the business actually used.',
      'Shipped Tableau dashboards on top of those models, cutting manual reporting effort by roughly 70%.',
      'Worked with the Salesforce support team to streamline internal workflows.'
    ],
    tags: ['Python', 'scikit-learn', 'Pandas', 'Tableau', 'Salesforce']
  },
  {
    kind: 'work',
    org: 'Pixabits Technologies',
    role: 'Software Developer Intern',
    period: 'Jun — Aug 2024',
    place: 'Remote',
    points: [
      'Built backend services and REST APIs in Python and Java, improving response time and throughput by over 50%.',
      'Debugged and performance-tested features with cross-functional teams across several releases.',
      'Implemented responsive UI from Figma designs and refined components against user analytics.'
    ],
    tags: ['Python', 'Java', 'REST APIs', 'React', 'Figma']
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
    tags: ['Machine Learning', 'Artificial Intelligence', 'Computer Vision', 'Operating Systems', 'Computer Architecture']
  }
];

const skills = [
  { label: 'Languages', items: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'Assembly'] },
  {
    label: 'ML & AI',
    items: ['PyTorch', 'scikit-learn', 'CNNs', 'DistilBERT', 'OpenCV', 'NLP', 'TF-IDF', 'SMOTE']
  },
  {
    label: 'Systems',
    items: ['Operating Systems', 'Concurrency', 'Memory Management', 'CPU Pipelining', 'Caches', 'Arduino / BLE']
  },
  {
    label: 'Data & Backend',
    items: ['NumPy', 'Pandas', 'FastAPI', 'Next.js', 'Streamlit', 'DSP', 'Git', 'Linux', 'Tableau']
  }
];

const TimelineRow = ({ entry }: { entry: Entry }) => (
  <motion.article
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="group relative grid md:grid-cols-[10rem_1fr] gap-4 md:gap-12 py-12 border-t border-black/[0.09] last:border-b"
  >
    {/* Left gutter — period + marker */}
    <div>
      <div className="hidden md:block absolute -left-10 top-[3.7rem] -translate-x-1/2">
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`block w-[9px] h-[9px] rounded-full ring-4 ring-[#f7e7ce] transition-colors ${
            entry.kind === 'education' ? 'bg-[#f7e7ce] border-2 border-[#135029]' : 'bg-[#135029]'
          }`}
        />
      </div>
      <div className="font-mono text-xs uppercase tracking-widest text-neutral-500">
        {entry.period}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
        {entry.place}
      </div>
    </div>

    {/* Body */}
    <div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="text-2xl md:text-3xl tracking-tight text-neutral-900">{entry.org}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          {entry.kind === 'education' ? 'Education' : 'Internship'}
        </span>
      </div>

      <p className="mt-2 text-lg text-[#135029]">{entry.role}</p>

      <ul className="mt-6 space-y-3 max-w-2xl">
        {entry.points.map((point) => (
          <li key={point} className="flex gap-4 text-neutral-600 font-light leading-relaxed">
            <span className="mt-[0.7rem] w-1 h-1 shrink-0 rounded-full bg-[#135029]/50" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full border border-black/[0.07] bg-white/45 text-[11px] font-mono text-neutral-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.article>
);

export const Services = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 75%', 'end 60%']
  });
  const spine = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" className="relative py-32 px-6 rule-top">
      <div className="container mx-auto">

        {/* Section header */}
        <div className="mb-20">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-[#135029]">04</span>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600">
                Experience
              </span>
            </div>
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          <h2 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.02em] text-neutral-900">
            Work &amp; education
          </h2>
          <p className="mt-6 max-w-xl text-lg font-light text-neutral-600 leading-relaxed">
            Two software internships and a degree in progress at UC Davis.
          </p>
        </div>

        {/* Timeline */}
        <div ref={railRef} className="relative md:pl-10">
          {/* Spine */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-black/[0.08]">
            <motion.div
              style={{ scaleY: spine }}
              className="absolute inset-0 origin-top bg-[#135029]/60"
            />
          </div>

          {timeline.map((entry) => (
            <TimelineRow key={entry.org} entry={entry} />
          ))}
        </div>

        {/* Skills */}
        <div className="mt-28">
          <div className="flex items-center gap-6 mb-10">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600">
              Toolkit
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          <dl>
            {skills.map((group, i) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.06, duration: 0.6 }}
                className="grid md:grid-cols-[12rem_1fr] gap-3 md:gap-10 py-6 border-t border-black/[0.09] last:border-b"
              >
                <dt className="font-mono text-xs uppercase tracking-widest text-neutral-500 md:pt-1">
                  {group.label}
                </dt>
                <dd className="flex flex-wrap gap-x-6 gap-y-2 text-neutral-700 font-light">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
