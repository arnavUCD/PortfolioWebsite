import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { Project } from '../data/projects';

type FolderStyle = CSSProperties & {
  '--folder-color': string;
  '--folder-dark': string;
};

export const ProjectFolder = ({
  project,
  index,
  active,
  rotation = 0,
  onOpen,
}: {
  project: Project;
  index: number;
  active: boolean;
  rotation?: number;
  onOpen: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onOpen}
    aria-expanded={active}
    aria-label={`${active ? 'Close' : 'Open'} ${project.title} project folder`}
    initial={false}
    animate={{ y: active ? -6 : 0, rotate: active ? 0 : rotation }}
    whileHover={{ y: -8, rotate: rotation * 0.35, scale: 1.025 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.65 }}
    className={`project-folder group relative block aspect-[1.35/1] w-full max-w-[250px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
      active ? 'is-open' : ''
    }`}
    style={
      {
        '--folder-color': project.folderColor,
        '--folder-dark': project.folderDark,
      } as FolderStyle
    }
  >
    <span className="project-folder-back absolute inset-0 rounded-b-2xl rounded-tr-2xl" />
    <span className="project-folder-paper absolute inset-x-[7%] bottom-[8%] top-[18%] rounded-lg bg-[#fffdf7]">
      <span className="absolute left-3 top-3 text-[7px] uppercase tracking-[0.14em] text-black/45 sm:left-4 sm:top-4 sm:text-[9px] sm:tracking-[0.18em]">
        File {String(index + 1).padStart(2, '0')}
      </span>
      <span className="absolute bottom-4 left-4 right-4 line-clamp-2 text-xs leading-snug text-black/55">
        {project.tagline}
      </span>
    </span>
    <span className="project-folder-front absolute inset-x-0 bottom-0 h-[72%] rounded-2xl">
      <span className="absolute left-5 right-3 top-5 hidden truncate text-[9px] uppercase tracking-[0.18em] text-white/70 sm:block">
        {project.category}
      </span>
      <span className="absolute bottom-4 left-4 right-3 sm:bottom-5 sm:left-5 sm:right-5">
        <span className="line-clamp-2 block font-display text-sm leading-[0.95] tracking-tight text-white sm:text-xl md:text-2xl">
          {project.title}
        </span>
        <span className="mt-1.5 block truncate text-[7px] uppercase tracking-[0.14em] text-white/65 sm:mt-2 sm:text-[10px] sm:tracking-[0.2em]">
          {project.year}<span className="hidden sm:inline"> · open file</span>
        </span>
      </span>
    </span>
  </motion.button>
);
