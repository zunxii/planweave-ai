import { CanvasView } from './common.types';

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
  position: 'left' | 'right' | 'bottom' | 'floating';
  size: number;
  isVisible: boolean;
  isCollapsed: boolean;
}