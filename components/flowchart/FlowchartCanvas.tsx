'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { FlowchartNode } from './FlowchartNode';
import { FlowchartEdge } from './FlowchartEdge';
import { FlowchartControls } from './FlowchartControls';
import { useFlowchart } from '@/features/flowchart/hooks/useFlowchart';
import { Maximize2, X } from 'lucide-react';
import type { ExecutionPlan, PlanNode } from '@/types';

interface FlowchartCanvasProps {
  plan: ExecutionPlan;
}

export function FlowchartCanvas({ plan }: FlowchartCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { flowchart, nodes, positions, edges, actions } = useFlowchart(plan);
  const { viewport } = flowchart;

  // Enhanced horizontal layout
  const NODE_WIDTH = 280;
  const NODE_HEIGHT = 140;
  const HORIZONTAL_GAP = 300;
  const VERTICAL_GAP = 80;
  const STEP_OFFSET = 160;

  const horizontalPositions = new Map();
  let currentX = 150;
  let maxY = 0;

  // Start node
  const startNode = nodes.find(n => n.type === 'start');
  if (startNode) {
    horizontalPositions.set(startNode.id, { x: currentX, y: 300 });
    currentX += NODE_WIDTH + HORIZONTAL_GAP;
  }

  nodes.filter(n => n.type === 'phase').forEach((phaseNode, phaseIdx) => {
    const phaseY = 300;
    horizontalPositions.set(phaseNode.id, { x: currentX, y: phaseY });

    const stepNodes = nodes.filter(n => 
      n.type === 'step' && phaseNode.children?.includes(n.id)
    );
    
    if (stepNodes.length > 0) {
      const totalStepHeight = stepNodes.length * NODE_HEIGHT + (stepNodes.length - 1) * 40;
      const startStepY = phaseY - totalStepHeight / 2 + NODE_HEIGHT + STEP_OFFSET;
      
      stepNodes.forEach((stepNode, stepIdx) => {
        const stepY = startStepY + (stepIdx * (NODE_HEIGHT + 40));
        horizontalPositions.set(stepNode.id, { x: currentX, y: stepY });
        maxY = Math.max(maxY, stepY + NODE_HEIGHT);
      });
    }

    currentX += NODE_WIDTH + HORIZONTAL_GAP;
  });

  // End node
  const endNode = nodes.find(n => n.type === 'end');
  if (endNode) {
    horizontalPositions.set(endNode.id, { x: currentX, y: 300 });
  }

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
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(Math.max(viewport.zoom + delta, 0.3), 2.0);
    actions.setViewport({ zoom: newZoom });
  }, [actions, viewport.zoom]);

  const handleNodeClick = useCallback((node: PlanNode) => {
    actions.setSelectedNode(node.id);
  }, [actions]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      // Reset viewport when entering fullscreen
      actions.resetViewport();
    }
  };

  // Auto-fit on mount
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => actions.fitToView(), 100);
    }
  }, [nodes.length]);

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-[#0a0a0f]'
    : 'relative w-full h-full bg-[#0a0a0f]';

  return (
    <div className={containerClasses}>
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 left-4 z-20 btn-3d flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white text-sm font-medium accent-glow"
      >
        {isFullscreen ? (
          <>
            <X className="w-4 h-4" />
            Exit Fullscreen
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4" />
            Fullscreen View
          </>
        )}
      </button>

      {/* Plan Title in fullscreen */}
      {isFullscreen && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="surface-card rounded-lg px-4 py-2 border border-[#1f1f28]">
            <h3 className="text-sm font-semibold text-[#f8fafc]">{plan.title}</h3>
            <p className="text-xs text-[#64748b]">
              {plan.phases.length} phases • {plan.phases.reduce((sum, p) => sum + p.steps.length, 0)} steps
            </p>
          </div>
        </div>
      )}

      <FlowchartControls
        zoom={viewport.zoom}
        onZoomIn={actions.zoomIn}
        onZoomOut={actions.zoomOut}
        onFitToView={actions.fitToView}
        onResetViewport={actions.resetViewport}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div
        ref={canvasRef}
        className={`w-full h-full overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Grid background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#1f1f28"
                strokeWidth="0.5"
              />
            </pattern>
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

          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

          {/* Edges */}
          {edges.map((edge) => (
            <FlowchartEdge
              key={edge.id}
              edge={edge}
              sourcePos={horizontalPositions.get(edge.source)}
              targetPos={horizontalPositions.get(edge.target)}
            />
          ))}
        </svg>

        {/* Nodes */}
        <div
          className="absolute"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {nodes.map((node) => {
            const position = horizontalPositions.get(node.id);
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

      {/* Mini-map in fullscreen */}
      {isFullscreen && (
        <div className="absolute bottom-4 right-4 w-64 h-40 surface-card rounded-lg border border-[#1f1f28] overflow-hidden opacity-90">
          <div className="relative w-full h-full bg-[#0f0f14] p-2">
            <div className="text-[10px] text-[#64748b] mb-1 font-medium">Overview</div>
            <div className="relative w-full h-[calc(100%-20px)] border border-[#1f1f28] rounded overflow-hidden">
              {/* Mini version of the flowchart */}
              <div className="absolute inset-0" style={{ transform: 'scale(0.08)', transformOrigin: 'top left' }}>
                {nodes.map((node) => {
                  const position = horizontalPositions.get(node.id);
                  if (!position) return null;
                  return (
                    <div
                      key={node.id}
                      className="absolute w-[280px] h-[140px] bg-[#3b82f6]/30 rounded border border-[#3b82f6]/50"
                      style={{
                        left: position.x,
                        top: position.y,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}