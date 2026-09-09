import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { ProjectDesk } from './ProjectDesk';

export const Work = () => {
  return (
    <div className="min-h-screen text-ink pt-32 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-24">
           <div>
             <Link to="/" className="text-xs uppercase tracking-widest text-ink-faint hover:text-ink transition-colors mb-8 block">
               ← Back to Home
             </Link>
             <h1 className="font-display text-6xl md:text-8xl tracking-[-0.02em] leading-[0.95]">
               Projects <br />
               <span className="font-display text-accent">2025—26</span>
             </h1>
           </div>
        </div>

        <div className="pb-32">
          <ProjectDesk projects={projects} />
        </div>
      </div>
    </div>
  );
};
