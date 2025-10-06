export type StepStatus = 'pending' | 'in-progress' | 'approved' | 'completed' | 'failed' | 'skipped';
export type PhaseStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
export type PlanStatus = 'draft' | 'active' | 'finalized' | 'completed' | 'failed' | 'paused';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type CanvasView = 'timeline' | 'kanban' | 'tree' | 'list';
export type PanelPosition = 'left' | 'right' | 'bottom' | 'floating';
export type StepAction = 'approve' | 'apply' | 'preview' | 'edit' | 'skip' | 'retry' | 'ask' | 'expand' | 'collapse';
