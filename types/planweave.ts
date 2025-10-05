export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  planUpdate?: boolean;
  type?: 'text' | 'plan' | 'code' | 'mixed';
  plan?: ExecutionPlan;
  codeBlocks?: CodeBlock[];
}

export interface FileItem {
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface PlanNode {
  id: string;
  type: 'start' | 'phase' | 'step';
  label: string;
  description?: string;
  x: number;
  y: number;
  children?: string[];
  files?: string[];
  expanded?: boolean;
  status?: 'pending' | 'in-progress' | 'completed';
}

export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
export type PhaseStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
export type PlanStatus = 'draft' | 'active' | 'completed' | 'failed' | 'paused';

export interface ExecutionPlan {
  id: string;
  title: string;
  description?: string;
  status: PlanStatus;
  progress: number; 
  createdAt: Date;
  updatedAt: Date;
  phases: PlanPhase[];
  metadata?: {
    estimatedTime?: string;
    totalSteps?: number;
    completedSteps?: number;
    filesAffected?: string[];
  };
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

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  filename?: string;
  description?: string;
  highlighted?: boolean;
}

export type CanvasView = 'timeline' | 'kanban' | 'tree' | 'list';
export type PanelPosition = 'left' | 'right' | 'bottom' | 'floating';

export interface CanvasState {
  isOpen: boolean;
  view: CanvasView;
  activePlanId: string | null;
  selectedPhaseId: string | null;
  selectedStepId: string | null;
  
  showCodePreviews: boolean;
  autoAdvance: boolean; 
  splitView: boolean; 
}

export interface PanelConfig {
  id: string;
  type: 'chat' | 'canvas' | 'code' | 'preview';
  position: PanelPosition;
  size: number; 
  isVisible: boolean;
  isCollapsed: boolean;
}


export type StepAction = 
  | 'apply' 
  | 'preview' 
  | 'edit' 
  | 'skip' 
  | 'retry' 
  | 'ask' 
  | 'expand' 
  | 'collapse';

export interface StepActionPayload {
  stepId: string;
  action: StepAction;
  data?: any;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  actionLabel?: string;
  actionCallback?: () => void;
  autoHide?: boolean;
  duration?: number; 
}

export interface ContextItem {
  id: string;
  type: 'file' | 'function' | 'class' | 'variable' | 'dependency';
  name: string;
  path?: string;
  lineNumber?: number;
  relevance?: number; 
}

export interface SmartSuggestion {
  id: string;
  type: 'next-step' | 'alternative' | 'optimization' | 'fix';
  title: string;
  description: string;
  confidence: number; 
  action?: () => void;
}