import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Folder,
  Grid2X2,
  Laptop,
  List,
  Search,
  Sparkles,
} from 'lucide-react';
import { LiquidGlass } from 'simple-liquid-glass';
import { techBlogs } from '../data/blogs';
import type { Project } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectFolder } from './ProjectFolder';

type FinderFilter = 'all' | '2026' | '2025';
type FinderView = 'icons' | 'list';
type FinderLocation = 'projects' | 'tech-blogs';

type FolderStyle = CSSProperties & {
  '--folder-color': string;
  '--folder-dark': string;
};

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
  const [location, setLocation] = useState<FinderLocation>('projects');
  const activeProject = projects.find((project) => project.id === activeId) ?? null;
  const normalizedQuery = query.trim().toLowerCase();

  const visibleProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter = filter === 'all' || project.year === filter;
      const searchable = `${project.title} ${project.category} ${project.stack.join(' ')}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, projects, query]);

  const visibleBlogs = useMemo(() => techBlogs.filter((blog) => {
    const searchable = `${blog.title} ${blog.subtitle} ${blog.platform}`.toLowerCase();
    return !normalizedQuery || searchable.includes(normalizedQuery);
  }), [normalizedQuery]);

  const showTechBlogsFolder = location === 'projects'
    && filter === 'all'
    && (!normalizedQuery || `tech blogs writing medium ${techBlogs.map((blog) => `${blog.title} ${blog.subtitle}`).join(' ')}`.toLowerCase().includes(normalizedQuery));

  const visibleItemCount = location === 'tech-blogs'
    ? visibleBlogs.length
    : visibleProjects.length + (showTechBlogsFolder ? 1 : 0);

  const goBack = () => {
    if (activeProject) {
      setActiveId(null);
      return;
    }
    if (location === 'tech-blogs') {
      setLocation('projects');
      setQuery('');
    }
  };

  useEffect(() => {
    if (!activeProject) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activeProject]);

  return (
    <div className={`project-finder-stage ${activeProject ? 'has-open-project' : ''}`}>
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
              aria-label={activeProject || location === 'tech-blogs' ? 'Back to projects' : 'Back'}
              onClick={goBack}
              disabled={!activeProject && location === 'projects'}
            >
              <ChevronLeft />
            </button>
            <button type="button" aria-label="Forward" disabled>
              <ChevronRight />
            </button>
          </div>

          <div className="finder-location">
            <Folder className="h-3.5 w-3.5 text-[#72b9ef]" />
            {location === 'tech-blogs' ? (
              <button type="button" onClick={() => { setLocation('projects'); setQuery(''); }}>Projects</button>
            ) : (
              <span>Projects</span>
            )}
            {location === 'tech-blogs' ? (
              <><ChevronRight className="h-3 w-3 text-white/25" /><span>Tech Blogs</span></>
            ) : filter !== 'all' && (
              <><ChevronRight className="h-3 w-3 text-white/25" /><span>{filter}</span></>
            )}
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
              <span className="sr-only">Search {location === 'tech-blogs' ? 'blogs' : 'projects'}</span>
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
                  ? projects.length + 1
                  : projects.filter((project) => project.year === item.id).length;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={filter === item.id ? 'is-active' : ''}
                    onClick={() => {
                      setFilter(item.id);
                      setActiveId(null);
                      setLocation('projects');
                      setQuery('');
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
                <p>{location === 'tech-blogs' ? 'Tech Blogs' : filter === 'all' ? 'Selected work' : filter}</p>
                <span>
                  {visibleItemCount} {location === 'tech-blogs'
                    ? visibleItemCount === 1 ? 'article' : 'articles'
                    : visibleItemCount === 1 ? 'folder' : 'folders'}
                </span>
              </div>
              <span>{location === 'tech-blogs' ? 'Published on Medium' : 'Last modified'}</span>
            </div>

            {view === 'list' && visibleItemCount > 0 && (
              <div className="finder-list-header" aria-hidden>
                <span>Name</span>
                <span>{location === 'tech-blogs' ? 'Platform' : 'Kind'}</span>
                <span>{location === 'tech-blogs' ? 'Length' : 'Year'}</span>
              </div>
            )}

            {visibleItemCount > 0 ? (
              <motion.div
                layout
                className={view === 'icons' ? 'finder-folder-grid' : 'finder-folder-list'}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {location === 'projects' && visibleProjects.map((project) => {
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
                  {showTechBlogsFolder && (
                    <motion.div
                      layout
                      key="tech-blogs"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => { setLocation('tech-blogs'); setQuery(''); }}
                        aria-label="Open Tech Blogs folder"
                        whileHover={view === 'icons' ? { y: -5, scale: 1.035 } : { x: 3 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 390, damping: 27, mass: 0.55 }}
                        className={view === 'icons'
                          ? 'finder-folder group flex min-w-0 flex-col items-center rounded-xl px-2 py-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#70a7ff]'
                          : 'finder-folder-row group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_minmax(7rem,.75fr)_4rem] items-center gap-3 rounded-lg px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#70a7ff]'}
                        style={{ '--folder-color': '#5f738e', '--folder-dark': '#29384c' } as FolderStyle}
                      >
                        <span className={`finder-folder-icon ${view === 'list' ? 'finder-folder-icon-small' : ''}`} aria-hidden>
                          {view === 'icons' && <span className="finder-folder-number">{String(projects.length + 1).padStart(2, '0')}</span>}
                          <span className="finder-folder-shine" />
                        </span>
                        {view === 'icons' ? (
                          <>
                            <span className="mt-3 max-w-full truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium text-white/92 group-hover:bg-[#3478f6] sm:text-xs">Tech Blogs</span>
                            <span className="mt-1 max-w-full truncate text-[9px] text-white/38">Writing · {techBlogs.length} article</span>
                          </>
                        ) : (
                          <>
                            <span className="truncate text-xs font-medium text-white/90">Tech Blogs</span>
                            <span className="truncate text-[10px] text-white/42">Writing</span>
                            <span className="text-right text-[10px] tabular-nums text-white/38">{techBlogs.length}</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                  {location === 'tech-blogs' && visibleBlogs.map((blog) => (
                    <motion.div
                      layout
                      key={blog.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                    >
                      <motion.a
                        href={blog.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Read ${blog.title} on ${blog.platform}`}
                        whileHover={view === 'icons' ? { y: -5, scale: 1.025 } : { x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        className={view === 'icons'
                          ? 'finder-blog-file group flex min-w-0 flex-col items-center rounded-xl px-2 py-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#70a7ff]'
                          : 'finder-blog-row group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_minmax(7rem,.75fr)_4rem] items-center gap-3 rounded-lg px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#70a7ff]'}
                      >
                        {view === 'icons' ? (
                          <>
                            <span className="finder-blog-document" aria-hidden>
                              <span>M</span>
                              <FileText />
                            </span>
                            <span className="finder-blog-title mt-3 line-clamp-2 max-w-[11rem] text-[11px] font-medium leading-snug text-white/92 sm:text-xs">{blog.title}</span>
                            <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-white/42">{blog.platform}<ExternalLink className="h-2.5 w-2.5" /></span>
                          </>
                        ) : (
                          <>
                            <span className="finder-blog-document finder-blog-document-small" aria-hidden><span>M</span></span>
                            <span className="truncate text-xs font-medium text-white/90">{blog.title}</span>
                            <span className="truncate text-[10px] text-white/42">{blog.platform}</span>
                            <span className="text-right text-[10px] tabular-nums text-white/38">{blog.readTime.replace(' read', '')}</span>
                          </>
                        )}
                      </motion.a>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="finder-empty-state">
                <Search />
                <p>No matching {location === 'tech-blogs' ? 'articles' : 'projects'}</p>
                <button type="button" onClick={() => { setQuery(''); setFilter('all'); }}>
                  Clear search
                </button>
              </div>
            )}

            <div className="finder-status-bar">
              <span>{visibleItemCount} {visibleItemCount === 1 ? 'item' : 'items'}</span>
              <span>{location === 'tech-blogs' ? 'Writing · Medium' : 'Portfolio · 2025—26'}</span>
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
