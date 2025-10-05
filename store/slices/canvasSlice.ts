import { StateCreator } from 'zustand';
import type { CanvasState, CanvasView } from '@/types/planweave';

export interface CanvasSlice {
  canvas: CanvasState;
  setCanvasOpen: (isOpen: boolean) => void;
  setCanvasView: (view: CanvasView) => void;
  toggleCanvas: () => void;
}

export const createCanvasSlice: StateCreator<CanvasSlice> = (set, get) => ({
  canvas: {
    isOpen: false,
    view: 'timeline',
    activePlanId: null,
    selectedPhaseId: null,
    selectedStepId: null,
    showCodePreviews: true,
    autoAdvance: false,
    splitView: false,
  },

  setCanvasOpen: (isOpen) => set({ 
    canvas: { ...get().canvas, isOpen } 
  }),
  
  setCanvasView: (view) => set({ 
    canvas: { ...get().canvas, view } 
  }),
  
  toggleCanvas: () => set({ 
    canvas: { ...get().canvas, isOpen: !get().canvas.isOpen } 
  }),
});