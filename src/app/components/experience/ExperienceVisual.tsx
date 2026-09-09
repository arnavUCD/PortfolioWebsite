import { Activity, Bot, Braces, ChartNoAxesCombined, GraduationCap } from 'lucide-react';
import type { ExperienceEntry } from '../../data/experience';

type Variant = 'agents' | 'data' | 'software' | 'projects' | 'education';

const getVariant = (entry: ExperienceEntry): Variant => {
  if (entry.org === 'Fonabit AI') return 'agents';
  if (entry.org.startsWith('Fonabit')) return 'data';
  if (entry.org.startsWith('Pixabits')) return 'software';
  if (entry.kind === 'education') return 'education';
  return 'projects';
};

const visualCopy: Record<Variant, { code: string; label: string; items: string[] }> = {
  agents: { code: 'A2A', label: 'Agent systems', items: ['MCP servers', 'RBAC gates', 'Human approval'] },
  data: { code: '70%', label: 'Reporting workflow', items: ['Model output', 'Tableau', 'Business insight'] },
  software: { code: 'API', label: 'Product engineering', items: ['Python + Java', 'Responsive UI', 'Performance'] },
  projects: { code: '04', label: 'Systems shipped', items: ['Agents', 'Applied ML', 'Signal processing'] },
  education: { code: 'UCD', label: 'Computer science', items: ['ML + AI', 'Systems', 'Architecture'] },
};

const VisualIcon = ({ variant }: { variant: Variant }) => {
  if (variant === 'agents') return <Bot className="h-4 w-4" />;
  if (variant === 'data') return <ChartNoAxesCombined className="h-4 w-4" />;
  if (variant === 'software') return <Braces className="h-4 w-4" />;
  if (variant === 'education') return <GraduationCap className="h-4 w-4" />;
  return <Activity className="h-4 w-4" />;
};

export const ExperienceVisual = ({ entry }: { entry: ExperienceEntry }) => {
  const variant = getVariant(entry);
  const copy = visualCopy[variant];

  return (
    <div className={`experience-visual experience-visual-${variant}`}>
      <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.17em] text-white/65">
        <VisualIcon variant={variant} />
        {copy.label}
      </div>

      <div className="my-auto">
        <div className="font-display text-4xl leading-none tracking-[-0.06em] text-white">
          {copy.code}
        </div>
        <div className="mt-4 h-px w-10 bg-white/35" />
      </div>

      <div className="space-y-2">
        {copy.items.map((item, index) => (
          <div key={item} className="flex items-center gap-2 text-[9px] text-white/65">
            <span className="tnum text-white/35">0{index + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
