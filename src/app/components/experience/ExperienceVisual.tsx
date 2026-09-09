import {
  Activity,
  ArrowRight,
  Bot,
  Braces,
  BrainCircuit,
  Check,
  Database,
  GraduationCap,
  HeartPulse,
  Newspaper,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { ExperienceEntry } from '../../data/experience';

type Variant = 'agents' | 'software' | 'projects' | 'education';

const getVariant = (entry: ExperienceEntry): Variant => {
  if (entry.org === 'Fonabit AI') return 'agents';
  if (entry.org.startsWith('Pixabits')) return 'software';
  if (entry.kind === 'education') return 'education';
  return 'projects';
};

const VisualIcon = ({ variant }: { variant: Variant }) => {
  if (variant === 'agents') return <Bot className="h-4 w-4" />;
  if (variant === 'software') return <Braces className="h-4 w-4" />;
  if (variant === 'education') return <GraduationCap className="h-4 w-4" />;
  return <Activity className="h-4 w-4" />;
};

const AgentScene = () => (
  <div className="experience-scene experience-scene-agents">
    <div className="agent-flow-line" />
    <div className="agent-node agent-node-left">
      <Database className="h-4 w-4" />
      <span>CRM</span>
      <small>live context</small>
    </div>
    <div className="agent-node agent-node-center">
      <BrainCircuit className="h-5 w-5" />
      <span>MCP gateway</span>
      <small>tools scoped</small>
    </div>
    <div className="agent-node agent-node-right">
      <Bot className="h-4 w-4" />
      <span>Agent team</span>
      <small>A2A routed</small>
    </div>
    <div className="scene-badge scene-badge-left"><ShieldCheck className="h-3.5 w-3.5" /> RBAC enforced</div>
    <div className="scene-badge scene-badge-right"><Check className="h-3.5 w-3.5" /> Human approved</div>
  </div>
);

const SoftwareScene = () => (
  <div className="experience-scene experience-scene-software">
    <div className="code-window">
      <div className="code-window-bar"><i /><i /><i /><span>api.pixabits.dev</span></div>
      <div className="code-request">
        <span className="request-method">POST</span>
        <span>/v1/insights</span>
        <ArrowRight className="ml-auto h-3.5 w-3.5" />
      </div>
      <div className="code-response">
        <span>200 OK</span>
        <strong>118 ms</strong>
      </div>
      <div className="code-lines"><i /><i /><i /></div>
    </div>
    <div className="latency-card">
      <span>Response time</span>
      <strong>−50%</strong>
      <small>after profiling</small>
    </div>
  </div>
);

const ProjectsScene = () => (
  <div className="experience-scene experience-scene-projects">
    <div className="project-mini project-mini-verity">
      <span>VERITY</span>
      <strong>$18.4K</strong>
      <small><Check className="h-3 w-3" /> payment matched</small>
    </div>
    <div className="project-mini project-mini-cardio">
      <HeartPulse className="h-4 w-4" />
      <strong>91%</strong>
      <small>rhythm confidence</small>
    </div>
    <div className="project-mini project-mini-infra">
      <Zap className="h-4 w-4" />
      <strong>90%</strong>
      <small>failure recall</small>
    </div>
    <div className="project-mini project-mini-news">
      <Newspaper className="h-4 w-4" />
      <span>Credibility</span>
      <small>probabilistic output</small>
    </div>
  </div>
);

const EducationScene = () => (
  <div className="experience-scene experience-scene-education">
    <div className="ucd-mark">
      <small>University of California</small>
      <strong>DAVIS</strong>
      <span>Computer Science · 2027</span>
    </div>
    <div className="course-chip course-chip-ai">Artificial Intelligence</div>
    <div className="course-chip course-chip-os">Operating Systems</div>
    <div className="course-chip course-chip-cv">Computer Vision</div>
  </div>
);

export const ExperienceVisual = ({ entry }: { entry: ExperienceEntry }) => {
  const variant = getVariant(entry);

  return (
    <div className={`experience-visual experience-visual-${variant}`}>
      <div className="experience-visual-label">
        <VisualIcon variant={variant} />
        {variant === 'agents'
          ? 'Agent infrastructure'
          : variant === 'software'
            ? 'Product engineering'
            : variant === 'education'
              ? 'Computer science'
              : 'Selected systems'}
      </div>
      {variant === 'agents' && <AgentScene />}
      {variant === 'software' && <SoftwareScene />}
      {variant === 'projects' && <ProjectsScene />}
      {variant === 'education' && <EducationScene />}
    </div>
  );
};
