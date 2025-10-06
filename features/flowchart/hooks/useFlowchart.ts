import { useIDEStore } from '@/store';
import { useMemo } from 'react';
import { 
  calculateNodePositions, 
  generateFlowchartEdges,
  planToFlowchartNodes 
} from '../utils/layoutCalculator';
import type { ExecutionPlan } from '@/types';

export function useFlowchart(plan: ExecutionPlan | null) {
  const flowchart = useIDEStore((state) => state.flowchart);
  const setFlowchartLayout = useIDEStore((state) => state.setFlowchartLayout);
  const setFlowchartViewport = useIDEStore((state) => state.setFlowchartViewport);
  const setSelectedNode = useIDEStore((state) => state.setSelectedNode);
  const setHoveredNode = useIDEStore((state) => state.setHoveredNode);
  const toggleFlowchartFullscreen = useIDEStore((state) => state.toggleFlowchartFullscreen);
  const resetFlowchartViewport = useIDEStore((state) => state.resetFlowchartViewport);
  const zoomIn = useIDEStore((state) => state.zoomIn);
  const zoomOut = useIDEStore((state) => state.zoomOut);
  const fitToView = useIDEStore((state) => state.fitToView);

  const nodes = useMemo(() => {
    if (!plan) return [];
    return planToFlowchartNodes(plan);
  }, [plan]);

  const positions = useMemo(() => {
    if (!plan) return new Map();
    return calculateNodePositions(plan);
  }, [plan]);

  const edges = useMemo(() => {
    if (!plan) return [];
    return generateFlowchartEdges(plan);
  }, [plan]);

  return {
    flowchart,
    nodes,
    positions,
    edges,
    actions: {
      setLayout: setFlowchartLayout,
      setViewport: setFlowchartViewport,
      setSelectedNode,
      setHoveredNode,
      toggleFullscreen: toggleFlowchartFullscreen,
      resetViewport: resetFlowchartViewport,
      zoomIn,
      zoomOut,
      fitToView,
    },
  };
}