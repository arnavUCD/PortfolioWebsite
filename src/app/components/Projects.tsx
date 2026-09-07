import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { ProjectReel } from './ProjectReel';

export const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="work" className="relative py-32 px-6 rule-top">
      <div className="container mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-accent tabular-nums">02</span>
                <span className="text-xs uppercase tracking-[0.3em] text-ink-dim">
                  Selected Projects
                </span>
              </div>
              <div className="h-px w-32 bg-gradient-to-r from-black/20 to-transparent" />
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.02em] text-ink">
              Projects
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light text-ink-dim leading-relaxed">
              A few things I've built recently. Open one to see what it actually does.
            </p>
          </div>

          <Link
            to="/work"
            className="shrink-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-dim border-b border-glass-line pb-2 hover:text-accent hover:border-accent transition-colors"
          >
            All projects
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Full-width rows. The selected one opens in place — there is no
            separate panel, so the detail sits with the project it belongs to. */}
        <div className="flex flex-col gap-4">
          {projects.map((project, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.div
                key={project.id}
                animate={{ y: isActive ? -4 : 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className={`rounded-2xl transition-[background-color,border-color,box-shadow] duration-300 ${
                  isActive ? 'neu neu-raised border-accent/25' : 'neu'
                }`}
              >
                {/* Header is the control; the body holds its own links, so the
                    two are siblings rather than a link nested in a button. */}
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`project-body-${project.id}`}
                  // Click/focus only. Hover-to-open worked when the detail lived
                  // in a fixed side panel, but on a stacked accordion it makes
                  // rows expand and collapse under the cursor while scrolling.
                  onClick={() => setActiveIndex(i)}
                  className="group flex w-full items-baseline gap-5 p-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-2xl"
                >
                  <span
                    className={`text-xs tabular-nums transition-colors ${
                      isActive ? 'text-accent' : 'text-ink-faint'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-2xl md:text-3xl tracking-tight transition-colors ${
                        isActive ? 'text-ink' : 'text-ink-dim group-hover:text-ink'
                      }`}
                    >
                      {project.title}
                    </span>
                    <span className="mt-1.5 block text-sm font-light text-ink-dim">
                      {project.tagline}
                    </span>
                  </span>

                  <span className="hidden shrink-0 text-xs uppercase tracking-widest text-ink-faint sm:block">
                    {project.category}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-ink-faint">
                    {project.year}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      id={`project-body-${project.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-7 pb-7 pt-0">
                        <div className="border-t border-glass-line pt-6">
                          <ProjectReel project={project} active={isActive} />

                          <div className="mt-7 flex flex-wrap items-center gap-2">
                            {project.stack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full glass-pill px-3 py-1.5 text-[11px] text-ink-dim"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <Link
                            to={`/work/${project.slug}`}
                            className="mt-7 group/cta inline-flex items-center gap-3 rounded-full bg-accent pl-6 pr-5 py-3 text-sm text-surface transition-colors hover:bg-accent-strong"
                          >
                            Read the case study
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
