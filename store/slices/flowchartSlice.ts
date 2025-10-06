import type { StateCreator } from 'zustand';
import type { FlowchartState, FlowchartLayout, FlowchartViewport } from '@/types';

export interface FlowchartSlice {
  flowchart: FlowchartState;
  
  setFlowchartLayout: (layout: FlowchartLayout) => void;
  setFlowchartViewport: (viewport: Partial<FlowchartViewport>) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setHoveredNode: (nodeId: string | null) => void;
  toggleFlowchartFullscreen: () => void;
  resetFlowchartViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToView: () => void;
}

const initialState: FlowchartState = {
  layout: 'vertical',
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },
  selectedNodeId: null,
  hoveredNodeId: null,
  isFullscreen: false,
};

export const createFlowchartSlice: StateCreator<FlowchartSlice> = (set, get) => ({
  flowchart: initialState,

  setFlowchartLayout: (layout) =>
    set((state) => ({
      flowchart: { ...state.flowchart, layout },
    })),

  setFlowchartViewport: (viewport) =>
    set((state) => ({
      flowchart: {
        ...state.flowchart,
        viewport: { ...state.flowchart.viewport, ...viewport },
      },
    })),

  setSelectedNode: (nodeId) =>
    set((state) => ({
      flowchart: { ...state.flowchart, selectedNodeId: nodeId },
    })),

  setHoveredNode: (nodeId) =>
    set((state) => ({
      flowchart: { ...state.flowchart, hoveredNodeId: nodeId },
    })),

  toggleFlowchartFullscreen: () =>
    set((state) => ({
      flowchart: {
        ...state.flowchart,
        isFullscreen: !state.flowchart.isFullscreen,
      },
    })),

  resetFlowchartViewport: () =>
    set((state) => ({
      flowchart: {
        ...state.flowchart,
        viewport: initialState.viewport,
      },
    })),

  zoomIn: () =>
    set((state) => ({
      flowchart: {
        ...state.flowchart,
        viewport: {
          ...state.flowchart.viewport,
          zoom: Math.min(state.flowchart.viewport.zoom + 0.1, 2.0),
        },
      },
    })),

  zoomOut: () =>
    set((state) => ({
      flowchart: {
        ...state.flowchart,
        viewport: {
          ...state.flowchart.viewport,
          zoom: Math.max(state.flowchart.viewport.zoom - 0.1, 0.5),
        },
      },
    })),

  fitToView: () =>
    set((state) => ({
      flowchart: {
        ...state.flowchart,
        viewport: { x: 0, y: 0, zoom: 1 },
      },
    })),
});