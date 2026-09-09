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
  view = 'icons',
  onOpen,
}: {
  project: Project;
  index: number;
  active: boolean;
  view?: 'icons' | 'list';
  onOpen: () => void;
}) => {
  const style = {
    '--folder-color': project.folderColor,
    '--folder-dark': project.folderDark,
  } as FolderStyle;

  if (view === 'list') {
    return (
      <motion.button
        type="button"
        onClick={onOpen}
        aria-expanded={active}
        aria-label={`Open ${project.title} project folder`}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.16 }}
        className="finder-folder-row group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_minmax(7rem,.75fr)_4rem] items-center gap-3 rounded-lg px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#70a7ff]"
        style={style}
      >
        <span className="finder-folder-icon finder-folder-icon-small" aria-hidden>
          <span className="finder-folder-shine" />
        </span>
        <span className="truncate text-xs font-medium text-white/90">{project.title}</span>
        <span className="truncate text-[10px] text-white/42">{project.category}</span>
        <span className="text-right text-[10px] tabular-nums text-white/38">{project.year}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-expanded={active}
      aria-label={`Open ${project.title} project folder`}
      initial={false}
      whileHover={{ y: -5, scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 390, damping: 27, mass: 0.55 }}
      className="finder-folder group flex min-w-0 flex-col items-center rounded-xl px-2 py-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#70a7ff]"
      style={style}
    >
      <span className="finder-folder-icon" aria-hidden>
        <span className="finder-folder-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="finder-folder-shine" />
      </span>
      <span className="mt-3 max-w-full truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium text-white/92 group-hover:bg-[#3478f6] sm:text-xs">
        {project.title}
      </span>
      <span className="mt-1 max-w-full truncate text-[9px] text-white/38">{project.category}</span>
    </motion.button>
  );
};
