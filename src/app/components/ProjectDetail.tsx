import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { getProject } from '../data/projects';
import { demos } from './demos';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Project not found</h1>
          <Link to="/work" className="text-ink-faint hover:text-ink underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const Demo = demos[project.demo];

  return (
    <div className="min-h-screen text-ink pt-32 px-6">
      <div className="container mx-auto">
        <Link to="/work" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-faint hover:text-ink transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
             <h1 className="font-display text-6xl md:text-8xl tracking-[-0.02em] leading-[0.95]">
               {project.title}
             </h1>
             <span className="font-mono text-sm text-ink-dim mb-2">{project.category} — {project.year}</span>
          </div>

          <p className="max-w-2xl text-xl font-light text-ink-dim leading-relaxed mb-12">
            {project.tagline}
          </p>

          <div className="rounded-2xl neu p-6 md:p-10">
            <div className="flex items-center gap-2.5 pb-5 mb-6 border-b border-glass-line">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-dim">
                {project.title}
              </span>
            </div>
            <Demo />
          </div>
          <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.25em] text-ink-faint">
            Replay of recorded results
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-24 mb-32">
           <div className="space-y-12">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-ink-dim block mb-2">Context</span>
                <p className="text-xl font-light">{project.client}</p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-ink-dim block mb-2">Stack</span>
                <p className="text-xl font-light">{project.role}</p>
              </div>
           </div>

           <div>
              <p className="text-2xl md:text-4xl font-light leading-relaxed text-ink-dim">
                {project.description}
              </p>
              
              <div className="mt-16 pt-16 border-t border-glass-line">
                 <span className="text-xs font-mono uppercase tracking-widest text-ink-dim block mb-8">Highlights</span>
                 <ul className="space-y-6 mb-16">
                   {project.highlights.map((point) => (
                     <li key={point} className="flex gap-4 text-lg text-ink-dim font-light leading-relaxed">
                       <span className="mt-[0.7rem] w-1 h-1 shrink-0 rounded-full bg-accent/50" />
                       <span>{point}</span>
                     </li>
                   ))}
                 </ul>
                 <span className="text-xs font-mono uppercase tracking-widest text-ink-dim block mb-8">Numbers</span>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <div className="font-display text-3xl leading-none text-ink">{metric.value}</div>
                        <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-ink-dim">{metric.label}</div>
                        <div className="mt-1 text-xs text-ink-faint font-light">{metric.note}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
        
        {/* Next Project (Simple Link) */}
        <div className="border-t border-glass-line py-24 text-center">
           <Link to="/work" className="group inline-flex flex-col items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">More Work</span>
              <span className="text-6xl md:text-8xl font-medium tracking-tighter group-hover:text-ink-dim transition-colors">
                View All Projects
              </span>
           </Link>
        </div>
      </div>
    </div>
  );
};
