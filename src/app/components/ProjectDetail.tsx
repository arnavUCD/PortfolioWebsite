import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, FileText, Github } from 'lucide-react';
import { getProject } from '../data/projects';
import { ProjectReel } from './ProjectReel';

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

  return (
    <div className="min-h-screen text-ink pt-32 px-6">
      <div className="container mx-auto">
        <Link to="/work" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-faint hover:text-ink transition-colors mb-12">
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
             <span className="text-sm text-ink-dim mb-2">
               {project.category} — {project.year}
             </span>
          </div>

          <p className="max-w-2xl text-xl font-light text-ink-dim leading-relaxed mb-12">
            {project.tagline}
          </p>

          {project.links.length > 0 && (
            <div className="mb-12 flex flex-wrap gap-3">
              {project.links.map((projectLink) => {
                const Icon =
                  projectLink.kind === 'github'
                    ? Github
                    : projectLink.kind === 'deck'
                      ? FileText
                      : ExternalLink;

                return (
                  <a
                    key={projectLink.href}
                    href={projectLink.href}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      projectLink.kind === 'github'
                        ? 'inline-flex items-center gap-2.5 rounded-full border border-[#17181a] bg-[#17181a] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,.8)] transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white'
                        : 'inline-flex items-center gap-2 rounded-full border border-glass-line bg-white/55 px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent'
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {projectLink.label}
                  </a>
                );
              })}
            </div>
          )}

          <div className="rounded-2xl neu p-6 md:p-10">
            <div className="flex items-center gap-2.5 pb-5 mb-6 border-b border-glass-line">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-ink-dim">
                {project.title} · pipeline
              </span>
            </div>
            <ProjectReel project={project} active />
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-24 mb-32">
           <div className="space-y-12">
              <div>
                <span className="text-xs uppercase tracking-widest text-ink-dim block mb-2">Context</span>
                <p className="text-xl font-light">{project.client}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-ink-dim block mb-2">Stack</span>
                <p className="text-xl font-light">{project.role}</p>
              </div>
           </div>

           <div>
              <p className="text-2xl md:text-4xl font-light leading-relaxed text-ink-dim">
                {project.description}
              </p>
              
              <div className="mt-16 pt-16 border-t border-glass-line">
                 <span className="text-xs uppercase tracking-widest text-ink-dim block mb-8">Highlights</span>
                 <ul className="space-y-6 mb-16">
                   {project.highlights.map((point) => (
                     <li key={point} className="flex gap-4 text-lg text-ink-dim font-light leading-relaxed">
                       <span className="mt-[0.7rem] w-1 h-1 shrink-0 rounded-full bg-accent/50" />
                       <span>{point}</span>
                     </li>
                   ))}
                 </ul>
              </div>
           </div>
        </div>
        
        {/* Next Project (Simple Link) */}
        <div className="border-t border-glass-line py-24 text-center">
           <Link to="/work" className="group inline-flex flex-col items-center gap-4">
              <span className="text-xs uppercase tracking-widest text-ink-faint">More Work</span>
              <span className="text-6xl md:text-8xl font-medium tracking-tighter group-hover:text-ink-dim transition-colors">
                View All Projects
              </span>
           </Link>
        </div>
      </div>
    </div>
  );
};
