import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';
import { EcgDemo } from './demos/EcgDemo';
import { GridDemo } from './demos/GridDemo';
import { CredibilityDemo } from './demos/CredibilityDemo';

const demos: Record<string, React.ComponentType> = {
  ecg: EcgDemo,
  grid: GridDemo,
  nlp: CredibilityDemo
};

export const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-900">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Project not found</h1>
          <Link to="/work" className="text-neutral-500 hover:text-neutral-900 underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const Demo = demos[(project as any).demo] ?? EcgDemo;

  return (
    <div className="min-h-screen text-neutral-900 pt-32 px-6">
      <div className="container mx-auto">
        <Link to="/work" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors mb-12">
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
             <h1 className="text-6xl md:text-9xl font-medium tracking-tighter leading-[0.9]">
               {project.title}
             </h1>
             <span className="font-mono text-sm text-neutral-600 mb-2">{project.category} — {project.year}</span>
          </div>

          <p className="max-w-2xl text-xl font-light text-neutral-600 leading-relaxed mb-12">
            {(project as any).tagline}
          </p>

          <div className="rounded-2xl border border-white/60 bg-white/35 backdrop-blur-xl p-6 md:p-10">
            <div className="flex items-center gap-2.5 pb-5 mb-6 border-b border-black/[0.07]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#135029] opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#135029]" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-600">
                {project.title}
              </span>
            </div>
            <Demo />
          </div>
          <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Replay of recorded results
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-24 mb-32">
           <div className="space-y-12">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-2">Context</span>
                <p className="text-xl font-light">{project.client}</p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-2">Stack</span>
                <p className="text-xl font-light">{project.role}</p>
              </div>
           </div>

           <div>
              <p className="text-2xl md:text-4xl font-light leading-relaxed text-neutral-700">
                {project.description}
              </p>
              
              <div className="mt-16 pt-16 border-t border-black/10">
                 <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-8">Highlights</span>
                 <ul className="space-y-6 mb-16">
                   {project.highlights.map((point: string) => (
                     <li key={point} className="flex gap-4 text-lg text-neutral-600 font-light leading-relaxed">
                       <span className="mt-[0.7rem] w-1 h-1 shrink-0 rounded-full bg-neutral-500" />
                       <span>{point}</span>
                     </li>
                   ))}
                 </ul>
                 <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-8">Numbers</span>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {((project as any).metrics ?? []).map((metric: any) => (
                      <div key={metric.label}>
                        <div className="font-display text-3xl leading-none text-neutral-900">{metric.value}</div>
                        <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-neutral-600">{metric.label}</div>
                        <div className="mt-1 text-xs text-neutral-500 font-light">{metric.note}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
        
        {/* Next Project (Simple Link) */}
        <div className="border-t border-black/10 py-24 text-center">
           <Link to="/work" className="group inline-flex flex-col items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">More Work</span>
              <span className="text-6xl md:text-8xl font-medium tracking-tighter group-hover:text-neutral-600 transition-colors">
                View All Projects
              </span>
           </Link>
        </div>
      </div>
    </div>
  );
};
