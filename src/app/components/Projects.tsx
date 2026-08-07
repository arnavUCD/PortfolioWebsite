import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { demos } from './demos';

export const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];
  const Demo = demos[active.demo];

  return (
    <section id="work" className="relative py-32 px-6 rule-top">
      <div className="container mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">02</span>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-ink-dim">
                  Selected Projects
                </span>
              </div>
              <div className="h-px w-32 bg-gradient-to-r from-white/25 to-transparent" />
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.02em] text-ink">
              Projects
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light text-ink-dim leading-relaxed">
              A few things I've built recently. Select one to see how it works.
            </p>
          </div>

          <Link
            to="/work"
            className="shrink-0 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-dim border-b border-glass-line pb-2 hover:text-accent hover:border-accent transition-colors"
          >
            All projects
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">

          {/* Selector — each project is its own moulded card */}
          <div className="order-2 lg:order-1 flex flex-col gap-5" role="tablist" aria-label="Projects">
            {projects.map((project, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.button
                  key={project.id}
                  role="tab"
                  id={`project-tab-${project.id}`}
                  aria-selected={isActive}
                  aria-controls="project-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  // The lift is what sells it as coming forward; the shadow pair
                  // alone reads as a colour change at this size.
                  animate={{ y: isActive ? -6 : 0, scale: isActive ? 1.015 : 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  className={`group relative w-full rounded-2xl p-6 text-left outline-none transition-[background-color,border-color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-accent/40 ${
                    isActive ? 'neu neu-raised border-accent/30' : 'neu'
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={`font-mono text-xs tracking-widest transition-colors ${
                        isActive ? 'text-accent' : 'text-ink-faint'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`text-2xl md:text-3xl tracking-tight transition-colors ${
                        isActive ? 'text-ink' : 'text-ink-dim group-hover:text-ink'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <span className="ml-auto font-mono text-xs text-ink-faint">{project.year}</span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 pl-9 pr-2 text-sm text-ink-dim font-light leading-relaxed">
                          {project.tagline}
                        </p>
                        <div className="pt-4 pl-9 flex flex-wrap gap-2">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-full neu-pill text-[11px] font-mono text-ink-dim"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Live panel */}
          <div
            id="project-panel"
            role="tabpanel"
            aria-labelledby={`project-tab-${active.id}`}
            className="order-1 lg:order-2 lg:sticky lg:top-28"
          >
            <div className="rounded-2xl neu neu-pop p-6 md:p-8">

              {/* Panel chrome */}
              <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-glass-line">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-dim">
                    {active.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-faint">
                  {active.category}
                </span>
              </div>

              {/* The demo itself */}
              <div className="min-h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                  >
                    <Demo />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Metrics */}
              <div className="mt-8 pt-6 border-t border-glass-line grid grid-cols-2 sm:grid-cols-4 gap-6">
                {active.metrics.map((metric) => (
                  <motion.div
                    key={metric.label + active.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="font-display text-3xl leading-none text-ink">
                      {metric.value}
                    </div>
                    <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-ink-dim">
                      {metric.label}
                    </div>
                    <div className="mt-1 text-xs text-ink-faint font-light">{metric.note}</div>
                  </motion.div>
                ))}
              </div>

              {/* Case study link */}
              <Link
                to={`/work/${active.slug}`}
                className="mt-8 group inline-flex items-center gap-3 rounded-full bg-accent text-surface pl-6 pr-5 py-3 text-sm hover:bg-accent-strong transition-colors"
              >
                Read the case study
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <p className="mt-4 text-center text-[10px] font-mono uppercase tracking-[0.25em] text-ink-faint">
              Replay of recorded results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
