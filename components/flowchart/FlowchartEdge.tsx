'use client';

import type { FlowchartEdge as Edge, FlowchartNodePosition } from '@/types';

interface FlowchartEdgeProps {
  edge: Edge;
  sourcePos?: FlowchartNodePosition;
  targetPos?: FlowchartNodePosition;
}

export function FlowchartEdge({ edge, sourcePos, targetPos }: FlowchartEdgeProps) {
  if (!sourcePos || !targetPos) return null;

  const nodeHeight = 120;
  const startY = sourcePos.y + nodeHeight / 2;
  const endY = targetPos.y - nodeHeight / 2;
  const midY = (startY + endY) / 2;

  const pathData = `
    M ${sourcePos.x} ${startY}
    L ${sourcePos.x} ${midY}
    L ${targetPos.x} ${midY}
    L ${targetPos.x} ${endY}
  `;

  const strokeColor = edge.animated ? '#f59e0b' : '#3b82f6';
  const strokeWidth = edge.type === 'dependency' ? 2 : 2;
  const strokeDasharray = edge.type === 'dependency' ? '5,5' : undefined;
  const markerEnd = edge.animated ? 'url(#arrowhead-active)' : 'url(#arrowhead)';

  return (
    <g>
      <path
        d={pathData}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        fill="none"
        opacity={0.6}
        markerEnd={markerEnd}
        className={edge.animated ? 'animate-pulse' : ''}
      />
    </g>
  );
}