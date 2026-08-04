import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects'; // Import data

export const Work = () => {
  return (
    <div className="min-h-screen text-neutral-900 pt-32 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-24">
           <div>
             <Link to="/" className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors mb-8 block">
               ← Back to Home
             </Link>
             <h1 className="font-display text-6xl md:text-8xl tracking-[-0.02em] leading-[0.95]">
               Projects <br />
               <span className="font-display text-[#135029]">2025—26</span>
             </h1>
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16 pb-32">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/work/${project.slug}`} className="block h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/60 bg-white/35 backdrop-blur-xl p-7 transition-colors group-hover:bg-white/55">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">{project.year}</span>
                  </div>

                  <h3 className="mt-5 text-3xl tracking-tight text-neutral-900">{project.title}</h3>
                  <p className="mt-3 text-neutral-600 font-light leading-relaxed">
                    {(project as any).tagline ?? project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {((project as any).stack ?? []).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-full border border-black/[0.07] bg-white/50 text-[11px] font-mono text-neutral-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-7 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-display text-3xl leading-none text-neutral-900">
                        {(project as any).metrics?.[0]?.value}
                      </div>
                      <div className="mt-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                        {(project as any).metrics?.[0]?.label}
                      </div>
                    </div>
                    <span className="rounded-full border border-black/10 p-2.5 transition-colors group-hover:border-[#135029] group-hover:text-[#135029]">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
