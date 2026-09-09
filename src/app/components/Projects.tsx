import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { ProjectDesk } from './ProjectDesk';

export const Projects = () => {
  return (
    <section id="work" className="relative overflow-hidden px-6 py-32 rule-top">
      <div className="container mx-auto">
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
              Four working files from recent builds. Pick a folder and pull out the story.
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

        <ProjectDesk projects={projects} />
      </div>
    </section>
  );
};
