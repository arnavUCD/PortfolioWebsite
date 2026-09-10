import { ArrowRight, ExternalLink, FileText, Github, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project, ProjectLink } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';

const LinkIcon = ({ kind }: { kind: ProjectLink['kind'] }) => {
  if (kind === 'github') return <Github className="h-3.5 w-3.5" />;
  if (kind === 'deck') return <FileText className="h-3.5 w-3.5" />;
  return <ExternalLink className="h-3.5 w-3.5" />;
};

export const ProjectCard = ({
  project,
  onClose,
  presentation = 'default',
}: {
  project: Project;
  onClose?: () => void;
  presentation?: 'default' | 'finder';
}) => (
  <article
    className={`project-panel relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fffdf8] text-ink ${
      presentation === 'finder' ? 'project-panel-finder' : ''
    }`}
  >
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${project.title}`}
        className="absolute right-3 top-3 z-30 rounded-full border border-black/10 bg-white/80 p-2 text-ink-dim backdrop-blur-md transition-colors hover:border-black/25 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <X className="h-4 w-4" />
      </button>
    )}

    <div className="grid md:grid-cols-[0.92fr_1.08fr]">
      <ProjectVisual projectId={project.id} />

      <div className="flex flex-col p-6 md:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pr-8 text-[10px] uppercase tracking-[0.2em] text-ink-faint lg:text-[11px]">
          <span>{project.category}</span><span aria-hidden>—</span><span>{project.year}</span>
        </div>
        <h3 className="mt-4 font-display text-4xl leading-none tracking-[-0.035em] lg:text-5xl">
          {project.title}
        </h3>
        <p className="mt-4 text-base font-light leading-relaxed text-ink-dim lg:text-lg">
          {project.tagline}
        </p>

        <div className="my-7 h-px bg-black/[0.08]" />

        <div className="grid grid-cols-3 gap-5">
          {project.metrics.slice(0, 3).map((metric) => (
            <div key={metric.label}>
              <div className="font-data text-2xl leading-none text-ink lg:text-3xl">{metric.value}</div>
              <div className="mt-2 text-[9px] uppercase tracking-[0.13em] text-ink-faint lg:text-[10px]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-7 line-clamp-4 text-sm font-light leading-relaxed text-ink-dim lg:text-base">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.slice(0, 5).map((tech) => (
            <span key={tech} className="rounded-full border border-black/[0.09] bg-black/[0.02] px-3 py-1.5 text-[10px] text-ink-dim lg:text-xs">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
          {project.links.map((projectLink) => (
            <a
              key={projectLink.href}
              href={projectLink.href}
              target="_blank"
              rel="noreferrer"
              className={
                projectLink.kind === 'github'
                  ? 'inline-flex items-center gap-2.5 rounded-full border border-[#17181a] bg-[#17181a] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,.8)] transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[0_14px_28px_-12px_rgba(0,0,0,.9)]'
                  : 'inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent'
              }
            >
              <LinkIcon kind={projectLink.kind} />
              {projectLink.label}
            </a>
          ))}

          <Link
            to={`/work/${project.slug}`}
            className="group ml-auto inline-flex items-center gap-2 text-xs font-medium text-ink transition-colors hover:text-accent"
          >
            Case study
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  </article>
);
