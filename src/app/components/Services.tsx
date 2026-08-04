import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Briefcase, GraduationCap, Cpu, Code2, Database, Wrench } from 'lucide-react';

const experience = [
  {
    company: "Fonabit Technologies Pvt. Ltd.",
    role: "Software Developer & Data Research Intern",
    period: "Jun 2025 — Sep 2025",
    points: [
      "Built machine learning models to analyze datasets and generate insights that informed data-driven business decisions.",
      "Developed Tableau dashboards translating model outputs into clear visual reports, cutting manual reporting effort by 70%.",
      "Partnered with the Salesforce support team to streamline organizational workflows."
    ]
  },
  {
    company: "Pixabits Technologies Pvt. Ltd.",
    role: "Software Developer Intern",
    period: "Jun 2024 — Aug 2024",
    points: [
      "Built backend services and REST APIs in Python and Java, improving response time and throughput by over 50%.",
      "Debugged and performance-tested features alongside cross-functional teams across releases.",
      "Implemented responsive UI from Figma designs and refined components using user analytics, increasing engagement."
    ]
  },
  {
    company: "University of California, Davis",
    role: "B.S. Computer Science · Minor in Business Studies",
    period: "Expected Jun 2027",
    points: [
      "Dean's List, Spring 2024 — College of Engineering | Graduate School of Management.",
      "Coursework: Machine Learning, Artificial Intelligence, Computer Vision, Operating Systems, Computer Architecture."
    ]
  }
];

const skillGroups = [
  {
    icon: Code2,
    title: "Languages",
    description: "Python, Java, C, C++, JavaScript, Assembly"
  },
  {
    icon: Cpu,
    title: "Machine Learning & AI",
    description: "PyTorch, scikit-learn, Deep Learning, CNNs, Transformers (DistilBERT), Computer Vision (OpenCV), NLP, TF-IDF, SMOTE"
  },
  {
    icon: Wrench,
    title: "Systems & Architecture",
    description: "Operating Systems, Concurrency & Multithreading, Memory Management, CPU Pipelining, Cache/Memory Hierarchy, Embedded (Arduino/BLE)"
  },
  {
    icon: Database,
    title: "Data, Backend & Tools",
    description: "NumPy, Pandas, FastAPI, Next.js, Streamlit, REST APIs, DSP, Git, Linux/Unix, Jupyter, Tableau, Salesforce, Figma"
  }
];

export const Services = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} id="experience" className="py-32 px-6 relative overflow-hidden">
       {/* A pale panel lifts this section off the page surface */}
       <div className="absolute inset-x-0 top-0 bottom-0 bg-white/25 rule-top pointer-events-none" />

      <div className="container mx-auto relative z-10">

        {/* Section Header */}
        <div className="mb-32 grid md:grid-cols-2 gap-16 items-end">
          <div>
            <div className="flex items-center gap-6 mb-8">
               <div className="flex items-baseline gap-3">
                  <span className="font-serif italic text-lg text-neutral-900">04</span>
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600">/ Experience</span>
               </div>
               <div className="h-px w-32 bg-gradient-to-r from-black/20 to-transparent" />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-9xl font-medium tracking-tighter leading-none"
            >
              Work & <br />
              <span className="italic font-serif text-[#135029]">Education</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="md:pl-12 border-l border-black/10 relative"
          >
            <div className="absolute top-0 left-[-1px] h-12 w-[1px] bg-gradient-to-b from-[#135029] to-transparent" />
            <p className="text-xl md:text-2xl font-light text-neutral-700 leading-relaxed">
              Two software internships shipping production backends, ML models, and analytics — alongside a CS degree at UC Davis.
            </p>
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <div className="mb-32">
          {experience.map((item, index) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              className="group grid md:grid-cols-[0.9fr_1.6fr] gap-8 md:gap-16 py-12 border-t border-black/10 last:border-b hover:bg-black/[0.02] transition-colors duration-500 px-2"
            >
              <div className="flex items-start gap-4">
                 <div className="mt-1 w-10 h-10 shrink-0 rounded-full bg-black/[0.04] border border-black/[0.06] flex items-center justify-center group-hover:bg-[#135029] group-hover:text-white transition-colors duration-500">
                   {index === experience.length - 1
                     ? <GraduationCap className="w-5 h-5" />
                     : <Briefcase className="w-5 h-5" />}
                 </div>
                 <div>
                   <h3 className="text-2xl font-medium tracking-tight leading-tight">{item.company}</h3>
                   <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mt-3">{item.period}</p>
                 </div>
              </div>

              <div>
                <p className="italic font-serif text-lg text-neutral-700 mb-6">{item.role}</p>
                <ul className="space-y-4">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-4 text-neutral-600 font-light leading-relaxed">
                      <span className="mt-[0.65rem] w-1 h-1 shrink-0 rounded-full bg-neutral-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Grid */}
        <div>
          <div className="flex items-center gap-6 mb-16">
             <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600">Technical Skills</span>
             <div className="h-px flex-1 bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skillGroups.map((group, index) => (
              <motion.div
                 key={group.title}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1, duration: 0.7 }}
              >
                 <SkillCard group={group} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillCard = ({ group, index }: { group: any, index: number }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group h-full p-8 rounded-2xl bg-black/[0.04] border border-black/[0.06] hover:border-black/15 hover:bg-black/5 transition-all duration-500 backdrop-blur-sm"
    >
      <div className="mb-8 w-12 h-12 rounded-full bg-black/[0.04] flex items-center justify-center group-hover:bg-[#135029] group-hover:text-white transition-colors duration-500">
        <group.icon className="w-6 h-6" />
      </div>

      <h3 className="text-xl font-medium mb-4 tracking-tight">{group.title}</h3>
      <p className="text-neutral-600 font-light leading-relaxed group-hover:text-neutral-700 transition-colors">
        {group.description}
      </p>
    </motion.div>
  );
};
