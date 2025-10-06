import { StepStatus, PhaseStatus, PlanStatus } from './common.types';

export interface ExecutionPlan {
  id: string;
  title: string;
  description?: string;
  status: PlanStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  phases: PlanPhase[];
  metadata?: PlanMetadata;
}

export interface PlanMetadata {
  estimatedTime?: string;
  totalSteps?: number;
  completedSteps?: number;
  filesAffected?: string[];
}

export interface PlanPhase {
  id: string;
  planId: string;
  label: string;
  description?: string;
  status: PhaseStatus;
  order: number;
  estimatedTime?: string;
  steps: PlanStep[];
  dependencies?: string[];
  expanded?: boolean;
}

export interface PlanStep {
  id: string;
  phaseId: string;
  label: string;
  description?: string;
  status: StepStatus;
  order: number;
  type: 'code' | 'file' | 'command' | 'review' | 'test';
  files?: string[];
  codeChanges?: CodeChange[];
  command?: string;
  estimatedTime?: string;
  completedAt?: Date;
  error?: string;
  expanded?: boolean;
  isHovered?: boolean;
}

export interface CodeChange {
  id: string;
  stepId: string;
  file: string;
  language: string;
  changeType: 'create' | 'modify' | 'delete';
  content?: string;
  diff?: string;
  before?: string;
  after?: string;
  lineStart?: number;
  lineEnd?: number;
  applied?: boolean;
  appliedAt?: Date;
}

export interface PlanNode {
  id: string;
  type: 'start' | 'phase' | 'step' | 'end' ;
  label: string;
  description?: string;
  x: number;
  y: number;
  children?: string[];
  files?: string[];
  expanded?: boolean;
  status?: 'pending' | 'in-progress' | 'completed'| 'failed' | 'skipped';
}
