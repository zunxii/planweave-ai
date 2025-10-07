'use client';

import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowchartNode } from './FlowchartNode';
import { Maximize2, Minimize2 } from 'lucide-react';
import type { ExecutionPlan } from '@/types';

interface FlowchartCanvasProps {
  plan: ExecutionPlan;
}

const nodeTypes = {
  custom: FlowchartNode,
};

export function FlowchartCanvas({ plan }: FlowchartCanvasProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Convert plan to React Flow nodes
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    let currentY = 0;
    const horizontalSpacing = 400;
    const verticalSpacing = 200;
    const centerX = 400;
    
    // Start node
    nodes.push({
      id: 'start',
      type: 'custom',
      position: { x: centerX, y: currentY },
      data: {
        node: {
          id: 'start',
          type: 'start',
          label: 'Start',
          status: 'completed',
          x: centerX,
          y: currentY,
        },
      },
    });
    
    currentY += verticalSpacing;
    
    // Process each phase
    plan.phases.forEach((phase, phaseIndex) => {
      const phaseId = phase.id;
      const prevNodeId = phaseIndex === 0 ? 'start' : plan.phases[phaseIndex - 1].id;
      
      // Phase node
      nodes.push({
        id: phaseId,
        type: 'custom',
        position: { x: centerX, y: currentY },
        data: {
          node: {
            id: phaseId,
            type: 'phase',
            label: phase.label,
            description: phase.description,
            status: phase.status,
            children: phase.steps.map(s => s.id),
            expanded: phase.expanded,
            x: centerX,
            y: currentY,
          },
        },
      });
      
      // Edge from previous to current phase
      edges.push({
        id: `e-${prevNodeId}-${phaseId}`,
        source: prevNodeId,
        target: phaseId,
        type: 'smoothstep',
        animated: phase.status === 'in-progress',
        style: {
          stroke: phase.status === 'in-progress' ? '#f59e0b' : '#3b82f6',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: phase.status === 'in-progress' ? '#f59e0b' : '#3b82f6',
        },
      });
      
      currentY += verticalSpacing;
      
      // Steps for this phase
      const stepCount = phase.steps.length;
      if (stepCount > 0) {
        const totalWidth = (stepCount - 1) * horizontalSpacing;
        const startX = centerX - totalWidth / 2;
        
        phase.steps.forEach((step, stepIndex) => {
          const stepX = startX + stepIndex * horizontalSpacing;
          const stepId = step.id;
          
          nodes.push({
            id: stepId,
            type: 'custom',
            position: { x: stepX, y: currentY },
            data: {
              node: {
                id: stepId,
                type: 'step',
                label: step.label,
                description: step.description,
                status: step.status,
                files: step.files,
                x: stepX,
                y: currentY,
              },
            },
          });
          
          // Edge from phase to step
          edges.push({
            id: `e-${phaseId}-${stepId}`,
            source: phaseId,
            target: stepId,
            type: 'smoothstep',
            animated: step.status === 'in-progress',
            style: {
              stroke: step.status === 'in-progress' ? '#f59e0b' : '#64748b',
              strokeWidth: 1.5,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: step.status === 'in-progress' ? '#f59e0b' : '#64748b',
            },
          });
        });
        
        currentY += verticalSpacing;
      }
    });
    
    // End node
    const lastPhaseId = plan.phases[plan.phases.length - 1]?.id || 'start';
    nodes.push({
      id: 'end',
      type: 'custom',
      position: { x: centerX, y: currentY },
      data: {
        node: {
          id: 'end',
          type: 'end',
          label: 'Complete',
          status: plan.status === 'completed' ? 'completed' : 'pending',
          x: centerX,
          y: currentY,
        },
      },
    });
    
    edges.push({
      id: `e-${lastPhaseId}-end`,
      source: lastPhaseId,
      target: 'end',
      type: 'smoothstep',
      style: {
        stroke: '#3b82f6',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6',
      },
    });
    
    return { nodes, edges };
  }, [plan]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-[#0a0a0f]'
    : 'w-full h-full bg-[#0a0a0f]';

  return (
    <div className={containerClasses}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        minZoom={0.3}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="#1f1f28"
          gap={20}
          size={1}
          className="opacity-30"
        />
        
        <Controls
          className="!bg-[#18181f] !border-[#1f1f28] [&_button]:!bg-[#18181f] [&_button]:!border-[#28283a] [&_button]:!text-[#94a3b8] hover:[&_button]:!bg-[#1a1a22]"
          showInteractive={false}
        />
        
        <MiniMap
          className="!bg-[#0f0f14] !border-[#1f1f28]"
          nodeColor={(node) => {
            if (node.data.node.type === 'start') return '#10b981';
            if (node.data.node.type === 'end') return '#6366f1';
            if (node.data.node.type === 'phase') return '#3b82f6';
            return '#18181f';
          }}
          maskColor="rgba(10, 10, 15, 0.6)"
        />

        <Panel position="top-left" className="!m-4">
          <div className="surface-card rounded-lg px-4 py-2 border border-[#1f1f28]">
            <h3 className="text-sm font-semibold text-[#f8fafc]">{plan.title}</h3>
            <p className="text-xs text-[#64748b]">
              {plan.phases.length} phases • {plan.phases.reduce((sum, p) => sum + p.steps.length, 0)} steps
            </p>
          </div>
        </Panel>

        <Panel position="top-right" className="!m-4 flex flex-col gap-2">
          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="btn-3d flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white text-sm font-medium accent-glow surface-card border border-[#1f1f28]"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                Fullscreen View
              </>
            )}
          </button>

          {/* Legend */}
          <div className="surface-card rounded-lg p-3 border border-[#1f1f28]">
            <div className="text-[10px] font-semibold text-[#e2e8f0] mb-2">Legend</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-[#3b82f6] to-[#2563eb]" />
                <span className="text-[9px] text-[#94a3b8]">Phase</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded surface-card border border-[#1f1f28]" />
                <span className="text-[9px] text-[#94a3b8]">Step</span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}