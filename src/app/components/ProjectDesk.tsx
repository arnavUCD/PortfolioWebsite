import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Folder,
  Grid2X2,
  Laptop,
  List,
  Search,
  Sparkles,
} from 'lucide-react';
import { LiquidGlass } from 'simple-liquid-glass';
import type { Project } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectFolder } from './ProjectFolder';

type FinderFilter = 'all' | '2026' | '2025';
type FinderView = 'icons' | 'list';

const sidebarItems: Array<{
  id: FinderFilter;
  label: string;
  icon: typeof Folder;
}> = [
  { id: 'all', label: 'All Projects', icon: Sparkles },
  { id: '2026', label: '2026', icon: Clock3 },
  { id: '2025', label: '2025', icon: Folder },
];

export const ProjectDesk = ({ projects }: { projects: Project[] }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FinderFilter>('all');
  const [view, setView] = useState<FinderView>('icons');
  const [query, setQuery] = useState('');
  const activeProject = projects.find((project) => project.id === activeId) ?? null;

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesFilter = filter === 'all' || project.year === filter;
      const searchable = `${project.title} ${project.category} ${project.stack.join(' ')}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, projects, query]);

  useEffect(() => {
    if (!activeProject) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activeProject]);

  return (
    <div className="project-finder-stage">
      <section className="project-finder-window" aria-label="Project Finder">
        <header className="project-finder-toolbar">
          <div className="finder-traffic-lights" aria-hidden>
            <i className="finder-light finder-light-red" />
            <i className="finder-light finder-light-yellow" />
            <i className="finder-light finder-light-green" />
          </div>

          <div className="finder-history-controls">
            <button
              type="button"
              aria-label={activeProject ? 'Back to projects' : 'Back'}
              onClick={() => setActiveId(null)}
              disabled={!activeProject}
            >
              <ChevronLeft />
            </button>
            <button type="button" aria-label="Forward" disabled>
              <ChevronRight />
            </button>
          </div>

          <div className="finder-location">
            <Folder className="h-3.5 w-3.5 text-[#72b9ef]" />
            <span>Projects</span>
            {filter !== 'all' && <><ChevronRight className="h-3 w-3 text-white/25" /><span>{filter}</span></>}
          </div>

          <div className="finder-toolbar-actions">
            <LiquidGlass
              mode="custom"
              scale={18}
              radius={10}
              border={0.08}
              displace={1}
              blur={9}
              frost={0.14}
              glassColor="rgba(255,255,255,0.08)"
              borderColor="rgba(255,255,255,0.16)"
              quality="low"
              mobileFallback="css-only"
              className="finder-view-glass"
            >
              <div className="finder-view-controls" aria-label="Project view">
                <button
                  type="button"
                  className={view === 'icons' ? 'is-active' : ''}
                  aria-label="Icon view"
                  aria-pressed={view === 'icons'}
                  onClick={() => setView('icons')}
                >
                  <Grid2X2 />
                </button>
                <button
                  type="button"
                  className={view === 'list' ? 'is-active' : ''}
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                  onClick={() => setView('list')}
                >
                  <List />
                </button>
              </div>
            </LiquidGlass>

            <label className="finder-search">
              <Search />
              <span className="sr-only">Search projects</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                type="search"
              />
            </label>
          </div>
        </header>

        <div className="project-finder-body">
          <aside className="project-finder-sidebar">
            <p>Favorites</p>
            <nav aria-label="Project filters">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const count = item.id === 'all'
                  ? projects.length
                  : projects.filter((project) => project.year === item.id).length;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={filter === item.id ? 'is-active' : ''}
                    onClick={() => {
                      setFilter(item.id);
                      setActiveId(null);
                    }}
                  >
                    <Icon />
                    <span>{item.label}</span>
                    <small>{count}</small>
                  </button>
                );
              })}
            </nav>

            <p className="mt-7">Locations</p>
            <div className="finder-location-static">
              <Laptop />
              <span>Arnav’s Portfolio</span>
            </div>
          </aside>

          <main className="project-finder-content">
            <div className="finder-content-heading">
              <div>
                <p>{filter === 'all' ? 'Selected work' : filter}</p>
                <span>{visibleProjects.length} {visibleProjects.length === 1 ? 'folder' : 'folders'}</span>
              </div>
              <span>Last modified</span>
            </div>

            {view === 'list' && visibleProjects.length > 0 && (
              <div className="finder-list-header" aria-hidden>
                <span>Name</span>
                <span>Kind</span>
                <span>Year</span>
              </div>
            )}

            {visibleProjects.length > 0 ? (
              <motion.div
                layout
                className={view === 'icons' ? 'finder-folder-grid' : 'finder-folder-list'}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {visibleProjects.map((project) => {
                    const sourceIndex = projects.findIndex((candidate) => candidate.id === project.id);
                    return (
                      <motion.div
                        layout
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                      >
                        <ProjectFolder
                          project={project}
                          index={sourceIndex}
                          active={activeId === project.id}
                          view={view}
                          onOpen={() => setActiveId(project.id)}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="finder-empty-state">
                <Search />
                <p>No matching projects</p>
                <button type="button" onClick={() => { setQuery(''); setFilter('all'); }}>
                  Clear search
                </button>
              </div>
            )}

            <div className="finder-status-bar">
              <span>{visibleProjects.length} items</span>
              <span>Portfolio · 2025—26</span>
            </div>
          </main>
        </div>

        <AnimatePresence initial={false}>
          {activeProject && (
            <motion.div
              className="finder-project-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className="finder-project-backdrop"
                aria-label="Close project"
                onClick={() => setActiveId(null)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`${activeProject.title} project`}
                className="finder-project-dialog"
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: 'spring', stiffness: 360, damping: 32, mass: 0.72 }}
              >
                <ProjectCard
                  project={activeProject}
                  presentation="finder"
                  onClose={() => setActiveId(null)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
