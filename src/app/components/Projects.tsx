import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { EcgDemo } from './demos/EcgDemo';
import { GridDemo } from './demos/GridDemo';
import { CredibilityDemo } from './demos/CredibilityDemo';

const demos: Record<string, React.ComponentType> = {
  ecg: EcgDemo,
  grid: GridDemo,
  nlp: CredibilityDemo
};

export const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex] as any;
  const Demo = demos[active.demo] ?? EcgDemo;

  return (
    <section id="work" className="relative py-32 px-6 rule-top">
      <div className="container mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-[#135029]">03</span>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600">
                  Selected Projects
                </span>
              </div>
              <div className="h-px w-32 bg-gradient-to-r from-black/20 to-transparent" />
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.02em] text-neutral-900">
              Projects
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light text-neutral-600 leading-relaxed">
              A few things I've built recently. Select one to see how it works.
            </p>
          </div>

          <Link
            to="/work"
            className="shrink-0 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-600 border-b border-black/20 pb-2 hover:text-[#135029] hover:border-[#135029] transition-colors"
          >
            All projects
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">

          {/* Selector */}
          <div className="order-2 lg:order-1" role="tablist" aria-label="Projects">
            {projects.map((project: any, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={project.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  className="group relative w-full text-left py-7 border-t border-black/[0.09] last:border-b"
                >
                  {/* Active rule */}
                  {isActive && (
                    <motion.span
                      layoutId="project-rule"
                      transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                      className="absolute -top-px left-0 right-0 h-px bg-[#135029]"
                    />
                  )}

                  <div className="flex items-baseline gap-4">
                    <span
                      className={`font-mono text-xs tracking-widest transition-colors ${
                        isActive ? 'text-[#135029]' : 'text-neutral-500'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`text-3xl md:text-4xl tracking-tight transition-colors ${
                        isActive
                          ? 'text-neutral-900'
                          : 'text-neutral-500 group-hover:text-neutral-700'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <span className="ml-auto font-mono text-xs text-neutral-500">{project.year}</span>
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
                        <p className="pt-4 pl-9 pr-4 text-neutral-600 font-light leading-relaxed">
                          {project.tagline}
                        </p>
                        <div className="pt-4 pl-9 flex flex-wrap gap-2">
                          {(project.stack ?? []).map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-full border border-black/[0.07] bg-white/50 text-[11px] font-mono text-neutral-600"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Live panel */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-white/60 bg-white/35 backdrop-blur-xl p-6 md:p-8 shadow-[0_30px_80px_-50px_rgba(19,80,41,0.55)]">

              {/* Panel chrome */}
              <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-black/[0.07]">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#135029] opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#135029]" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-600">
                    {active.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
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
              <div className="mt-8 pt-6 border-t border-black/[0.07] grid grid-cols-2 sm:grid-cols-4 gap-6">
                {(active.metrics ?? []).map((metric: any) => (
                  <motion.div
                    key={metric.label + active.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="font-display text-3xl leading-none text-neutral-900">
                      {metric.value}
                    </div>
                    <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                      {metric.label}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500 font-light">{metric.note}</div>
                  </motion.div>
                ))}
              </div>

              {/* Case study link */}
              <Link
                to={`/work/${active.slug}`}
                className="mt-8 group inline-flex items-center gap-3 rounded-full bg-[#135029] text-white pl-6 pr-5 py-3 text-sm hover:bg-[#0d3a1e] transition-colors"
              >
                Read the case study
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <p className="mt-4 text-center text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
              Replay of recorded results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
