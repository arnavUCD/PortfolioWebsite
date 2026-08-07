import { ExperienceGraph } from './experience/ExperienceGraph';
import { experience } from '../data/experience';

export const Services = () => {
  return (
    <section id="experience" className="relative py-32 rule-top">
      <div className="container mx-auto px-6">

        {/* Section header */}
        <div className="mb-20">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-accent">03</span>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-ink-dim">
                Experience
              </span>
            </div>
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-white/25 to-transparent" />
          </div>

          <h2 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.02em] text-ink">
            Where it came from
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-light text-ink-dim leading-relaxed">
            Two software internships, the projects I build on my own, and a degree in progress
            at UC Davis — and what each one actually taught me.
          </p>

        </div>

        <ExperienceGraph entries={experience} />

      </div>

    </section>
  );
};
