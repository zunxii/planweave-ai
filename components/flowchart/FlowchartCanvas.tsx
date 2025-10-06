'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { FlowchartNode } from './FlowchartNode';
import { FlowchartEdge } from './FlowchartEdge';
import { FlowchartControls } from './FlowchartControls';
import { useFlowchart } from '@/features/flowchart/hooks/useFlowchart';
import type { ExecutionPlan, PlanNode, FlowchartNodePosition } from '@/types';

interface FlowchartCanvasProps {
  plan: ExecutionPlan;
}

export function FlowchartCanvas({ plan }: FlowchartCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const { flowchart, nodes, positions, edges, actions } = useFlowchart(plan);
  const { viewport } = flowchart;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  }, [viewport]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      actions.setViewport({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  }, [isPanning, panStart, actions]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      actions.zoomIn();
    } else {
      actions.zoomOut();
    }
  }, [actions]);

  const handleNodeClick = useCallback((node: PlanNode) => {
    actions.setSelectedNode(node.id);
  }, [actions]);

  return (
    <div className="relative w-full h-full bg-[#0a0a0f] overflow-hidden">
      <FlowchartControls
        zoom={viewport.zoom}
        onZoomIn={actions.zoomIn}
        onZoomOut={actions.zoomOut}
        onFitToView={actions.fitToView}
        onResetViewport={actions.resetViewport}
        onToggleFullscreen={actions.toggleFullscreen}
        isFullscreen={flowchart.isFullscreen}
      />

      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill="#3b82f6"
                opacity="0.6"
              />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill="#f59e0b"
              />
            </marker>
          </defs>

          {edges.map((edge) => (
            <FlowchartEdge
              key={edge.id}
              edge={edge}
              sourcePos={positions.get(edge.source)}
              targetPos={positions.get(edge.target)}
            />
          ))}
        </svg>

        <div
          className="absolute"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {nodes.map((node) => {
            const position = positions.get(node.id);
            if (!position) return null;

            return (
              <FlowchartNode
                key={node.id}
                node={node}
                position={position}
                isSelected={flowchart.selectedNodeId === node.id}
                isHovered={flowchart.hoveredNodeId === node.id}
                onClick={handleNodeClick}
                onMouseEnter={() => actions.setHoveredNode(node.id)}
                onMouseLeave={() => actions.setHoveredNode(null)}
              />
            );
          })}
        </div>
      </div>

   
      <div className="absolute bottom-4 right-4 w-48 h-32 surface-card rounded-lg border border-[#1f1f28] opacity-80 pointer-events-none">
        <div className="relative w-full h-full p-2">
          <div className="text-[10px] text-[#64748b] mb-1">Map</div>
          
        </div>
      </div>
    </div>
  );
}