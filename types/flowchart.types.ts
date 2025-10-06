export type FlowchartLayout = 'vertical' | 'horizontal';
export type FlowchartZoom = number; 

export interface FlowchartViewport {
  x: number;
  y: number;
  zoom: FlowchartZoom;
}

export interface FlowchartNodePosition {
  x: number;
  y: number;
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'dependency' | 'parallel';
  animated?: boolean;
}

export interface FlowchartState {
  layout: FlowchartLayout;
  viewport: FlowchartViewport;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  isFullscreen: boolean;
}

export interface FlowchartConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  phaseSpacing: number;
  stepSpacing: number;
}