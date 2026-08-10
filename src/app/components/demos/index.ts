import type { ComponentType } from 'react';
import type { DemoKey } from '../../data/projects';
import { EcgDemo } from './EcgDemo';
import { GridDemo } from './GridDemo';
import { CredibilityDemo } from './CredibilityDemo';
import { ReconDemo } from './ReconDemo';

/** Every project's live panel resolves through here. */
export const demos: Record<DemoKey, ComponentType> = {
  recon: ReconDemo,
  ecg: EcgDemo,
  grid: GridDemo,
  nlp: CredibilityDemo
};
