import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Project } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectFolder } from './ProjectFolder';

const placements = [
  { className: 'left-[3%] top-[4%]', rotation: -5, x: -320, y: -170 },
  { className: 'right-[7%] top-[10%]', rotation: 4, x: 320, y: -150 },
  { className: 'bottom-[2%] left-[10%]', rotation: 3, x: -290, y: 180 },
  { className: 'bottom-[5%] right-[12%]', rotation: -4, x: 290, y: 170 },
];

export const ProjectDesk = ({ projects }: { projects: Project[] }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = projects.findIndex((project) => project.id === activeId);
  const activeProject = activeIndex >= 0 ? projects[activeIndex] : null;
  const origin = placements[activeIndex] ?? placements[0];

  const toggle = (id: string) => setActiveId((current) => (current === id ? null : id));

  return (
    <div>
      {/* Mobile and tablet: folders stay tactile, while the open sheet enters
          normal flow so no content can be clipped or covered. */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {projects.map((project, index) => (
            <ProjectFolder
              key={project.id}
              project={project}
              index={index}
              active={activeId === project.id}
              rotation={index % 2 === 0 ? -2 : 2}
              onOpen={() => toggle(project.id)}
            />
          ))}
        </div>

        <AnimatePresence initial={false}>
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20 mt-10 will-change-transform"
            >
              <ProjectCard project={activeProject} onClose={() => setActiveId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop: a composed desk. The folders float around a central working
          area, and the selected project sheet ejects from its folder. */}
      <div className="relative hidden min-h-[620px] lg:block">
        {projects.map((project, index) => {
          const placement = placements[index] ?? placements[index % placements.length];
          return (
            <div
              key={project.id}
              className={`absolute z-20 w-[225px] xl:w-[260px] 2xl:w-[280px] ${placement.className}`}
            >
              <ProjectFolder
                project={project}
                index={index}
                active={activeId === project.id}
                rotation={placement.rotation}
                onOpen={() => toggle(project.id)}
              />
            </div>
          );
        })}

        <AnimatePresence initial={false}>
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial={{
                opacity: 0,
                x: origin.x * 0.2,
                y: origin.y * 0.2,
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{
                opacity: 0,
                x: origin.x * 0.1,
                y: origin.y * 0.1,
              }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 z-30 w-[min(92%,1120px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
            >
              <ProjectCard project={activeProject} onClose={() => setActiveId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
