import type { 
  ExecutionPlan, 
  PlanNode, 
  FlowchartNodePosition,
  FlowchartEdge,
  FlowchartConfig 
} from '@/types';

const DEFAULT_CONFIG: FlowchartConfig = {
  nodeWidth: 280,
  nodeHeight: 120,
  horizontalSpacing: 100,
  verticalSpacing: 80,
  phaseSpacing: 120,
  stepSpacing: 60,
};

export function calculateNodePositions(
  plan: ExecutionPlan,
  config: FlowchartConfig = DEFAULT_CONFIG
): Map<string, FlowchartNodePosition> {
  const positions = new Map<string, FlowchartNodePosition>();
  
  let currentY = 100; 
  
  positions.set('start', { x: 400, y: currentY });
  currentY += config.nodeHeight + config.phaseSpacing;
  
  plan.phases.forEach((phase, phaseIndex) => {
    const phaseId = phase.id;
    const stepCount = phase.steps.length;
   
    positions.set(phaseId, { x: 400, y: currentY });
    currentY += config.nodeHeight + config.verticalSpacing;

    if (stepCount > 0) {
      const totalWidth = (stepCount * config.nodeWidth) + ((stepCount - 1) * config.horizontalSpacing);
      const startX = 400 - (totalWidth / 2) + (config.nodeWidth / 2);
      
      phase.steps.forEach((step, stepIndex) => {
        const stepX = startX + (stepIndex * (config.nodeWidth + config.horizontalSpacing));
        positions.set(step.id, { x: stepX, y: currentY });
      });
      
      currentY += config.nodeHeight + config.phaseSpacing;
    }
  });
  
    positions.set('end', { x: 400, y: currentY });
  
  return positions;
}

export function generateFlowchartEdges(plan: ExecutionPlan): FlowchartEdge[] {
  const edges: FlowchartEdge[] = [];
  
  if (plan.phases.length > 0) {
    edges.push({
      id: `edge-start-${plan.phases[0].id}`,
      source: 'start',
      target: plan.phases[0].id,
      type: 'default',
    });
  }
 
  plan.phases.forEach((phase, phaseIndex) => {
    // Phase to its steps
    phase.steps.forEach((step) => {
      edges.push({
        id: `edge-${phase.id}-${step.id}`,
        source: phase.id,
        target: step.id,
        type: 'default',
      });
    });
    
    // Phase to next phase
    if (phaseIndex < plan.phases.length - 1) {
      edges.push({
        id: `edge-${phase.id}-${plan.phases[phaseIndex + 1].id}`,
        source: phase.id,
        target: plan.phases[phaseIndex + 1].id,
        type: 'default',
        animated: phase.status === 'in-progress',
      });
    }
    
    // Handle dependencies
    if (phase.dependencies) {
      phase.dependencies.forEach((depId) => {
        edges.push({
          id: `edge-dep-${depId}-${phase.id}`,
          source: depId,
          target: phase.id,
          type: 'dependency',
        });
      });
    }
  });
  
  // Last phase to end
  if (plan.phases.length > 0) {
    const lastPhase = plan.phases[plan.phases.length - 1];
    edges.push({
      id: `edge-${lastPhase.id}-end`,
      source: lastPhase.id,
      target: 'end',
      type: 'default',
    });
  }
  
  return edges;
}

export function planToFlowchartNodes(plan: ExecutionPlan): PlanNode[] {
  const nodes: PlanNode[] = [];
  
  // Start node
  nodes.push({
    id: 'start',
    type: 'start',
    label: 'Start',
    status: 'completed',
    x: 0,
    y: 0,
  });
  
  // Phase and step nodes
  plan.phases.forEach((phase) => {
    nodes.push({
      id: phase.id,
      type: 'phase',
      label: phase.label,
      description: phase.description,
      status: phase.status,
      children: phase.steps.map((s) => s.id),
      expanded: phase.expanded,
      x: 0,
      y: 0,
    });
    
    phase.steps.forEach((step) => {
      nodes.push({
        id: step.id,
        type: 'step',
        label: step.label,
        description: step.description,
        status: step.status,
        files: step.files,
        x: 0,
        y: 0,
      });
    });
  });
  
  // End node
  const allCompleted = plan.phases.every((p) => p.status === 'completed');
  nodes.push({
    id: 'end',
    type: 'end',
    label: 'Complete',
    status: allCompleted ? 'completed' : 'pending',
    x: 0,
    y: 0,
  });
  
  return nodes;
}

export function getBoundingBox(positions: Map<string, FlowchartNodePosition>, config: FlowchartConfig) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  positions.forEach((pos) => {
    minX = Math.min(minX, pos.x - config.nodeWidth / 2);
    minY = Math.min(minY, pos.y - config.nodeHeight / 2);
    maxX = Math.max(maxX, pos.x + config.nodeWidth / 2);
    maxY = Math.max(maxY, pos.y + config.nodeHeight / 2);
  });
  
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}