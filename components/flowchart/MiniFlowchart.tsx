'use client';

import { JSX } from 'react';
import { FlowchartNode } from './FlowchartNode';
import type { PlanNode } from '@/types';

interface MiniFlowchartProps {
  nodes: PlanNode[];
  onToggleNode: (nodeId: string) => void;
}

export function MiniFlowchart({ nodes, onToggleNode }: MiniFlowchartProps) {
  const renderNode = (node: PlanNode, depth: number = 0): JSX.Element | null => {
    if (node.type === 'start') return null;

    const childNodes = nodes.filter(n => node.children?.includes(n.id));

    return (
      <div key={node.id} className="animate-in">
        <FlowchartNode 
          node={node} 
          depth={depth}
          onToggle={() => onToggleNode(node.id)}
        />

        {node.expanded && childNodes.length > 0 && (
          <div className="mt-1">
            {childNodes.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const topLevelNodes = nodes.filter(n => {
    const isChild = nodes.some(parent => parent.children?.includes(n.id) && parent.type !== 'start');
    return !isChild && n.type !== 'start';
  });

  return (
    <div className="p-3 max-h-[300px] overflow-y-auto space-y-1">
      {topLevelNodes.map(node => renderNode(node, 0))}
    </div>
  );
}
