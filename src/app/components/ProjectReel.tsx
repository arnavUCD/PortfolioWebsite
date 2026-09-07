import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Project } from '../data/projects';

const CHAR_MS = 16;
const LINE_PAUSE_MS = 300;

/**
 * One shared pattern for every project: the steps the system actually performs,
 * typed out in order, with colour arriving only as each step lands. There is no
 * per-project simulation any more — the specificity comes from the copy, which
 * is drawn from what each project really does, rather than from four bespoke
 * animations that all had to invent their own vocabulary.
 */
export const ProjectReel = ({ project, active }: { project: Project; active: boolean }) => {
  const reduce = useReducedMotion();
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);

  // Restart whenever this becomes the selected project.
  useEffect(() => {
    setLine(0);
    setChars(0);
  }, [project.id, active]);

  useEffect(() => {
    if (!active) return;
    // Reduced motion: no typing, just the finished state.
    if (reduce) {
      setLine(project.steps.length);
      return;
    }
    if (line >= project.steps.length) return;

    const text = project.steps[line];
    if (chars < text.length) {
      const id = window.setTimeout(() => setChars((c) => c + 1), CHAR_MS);
      return () => clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      setLine((l) => l + 1);
      setChars(0);
    }, LINE_PAUSE_MS);
    return () => clearTimeout(id);
  }, [active, line, chars, project.steps, reduce]);

  const done = line >= project.steps.length;
  const progress = Math.min(1, line / project.steps.length);

  return (
    <div>
      {/* The pipeline, typing itself out */}
      <div className="relative rounded-xl border border-glass-line bg-black/[0.025] py-4 pl-5 pr-4">
        {/* Colour arrives as a rule filling down the left edge, in step with
            the lines — the "colour coming in" is tied to real progress. */}
        <span className="absolute inset-y-4 left-0 w-px overflow-hidden bg-black/10">
          <motion.span
            className="absolute inset-x-0 top-0 origin-top bg-accent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progress }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%' }}
          />
        </span>

        <ol className="space-y-2">
          {project.steps.map((step, i) => {
            const settled = i < line;
            const typing = i === line;
            return (
              <li
                key={step}
                className={`flex items-baseline gap-3 text-sm transition-colors duration-500 ${
                  settled ? 'text-ink' : typing ? 'text-ink-dim' : 'text-ink-faint/45'
                }`}
              >
                <span
                  className={`text-[11px] tabular-nums transition-colors duration-500 ${
                    settled ? 'text-accent' : 'text-ink-faint/75'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-relaxed">
                  {settled || reduce ? step : typing ? step.slice(0, chars) : ''}
                  {typing && !reduce && (
                    <motion.span
                      aria-hidden
                      animate={{ opacity: [1, 1, 0, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-accent"
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Numbers, which only take colour once the run has finished */}
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {project.metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            animate={{ opacity: done ? 1 : 0.35 }}
            transition={{ duration: 0.5, delay: done ? i * 0.07 : 0 }}
          >
            <div
              className={`font-data text-2xl leading-none transition-colors duration-700 ${
                done ? 'text-accent' : 'text-ink-faint'
              }`}
            >
              {metric.value}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-widest text-ink-dim">
              {metric.label}
            </div>
            <div className="mt-1 text-xs font-light text-ink-faint">{metric.note}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
