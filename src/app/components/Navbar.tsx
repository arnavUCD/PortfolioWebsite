import { useState } from 'react';
import { Menu, X, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { site, mailto } from '../data/site';

const navItems = [
  { name: 'About', to: '/about' },
  { name: 'Projects', to: '/projects' },
  { name: 'Experience', to: '/experience' },
  { name: 'Contact', to: '/contact' }
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const activePath = location.pathname.startsWith('/work') ? '/projects' : location.pathname;

  return (
    <>
    <nav className="fixed inset-x-0 top-3 z-50">
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 text-lg tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">
          Arnav<span className="text-ink-faint"> Sharma</span>
        </Link>

        <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full border border-glass-line bg-white/80 p-1.5 shadow-[0_10px_34px_-12px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => {
              const isActive = activePath === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`relative rounded-full px-5 py-2 text-sm tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/40 ${
                    isActive ? 'bg-black/[0.055] text-ink' : 'text-ink-dim hover:bg-black/[0.04] hover:text-ink'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-1 h-1 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-ink/85 hover:text-ink transition-colors"
          >
            Résumé
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/85 hover:text-ink transition-colors"
          >
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/85 hover:text-ink transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
          <a
            href={mailto}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/90 px-5 py-2.5 text-sm font-medium text-ink shadow-sm transition-colors hover:border-accent hover:bg-accent hover:text-surface"
          >
            Email me
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="xl:hidden ml-auto z-50 w-11 h-11 rounded-full glass-pill flex items-center justify-center text-ink"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-surface/95 backdrop-blur-xl xl:hidden">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="rounded-full glass-pill px-8 py-3 text-3xl tracking-tight transition-colors hover:border-accent/40"
            >
              {item.name}
            </Link>
          ))}
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-full glass-pill px-8 py-3 text-3xl font-medium tracking-tight text-ink transition-colors hover:border-accent/40"
          >
            Résumé
          </a>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass-pill px-5 py-2.5 text-sm font-medium text-ink"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass-pill px-5 py-2.5 text-sm font-medium text-ink"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
          <a href={mailto} className="mt-3 text-sm font-medium tracking-widest uppercase text-ink">
            {site.email}
          </a>
        </div>
      )}
    </>
  );
};
