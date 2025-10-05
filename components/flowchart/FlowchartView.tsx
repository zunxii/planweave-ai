'use client';

import { Badge } from '@/components/ui/badge';
import { ArrowDown } from 'lucide-react';
import { StatusIcon } from '@/components/canvas';
import type { PlanNode } from '@/types';
import { JSX } from 'react';

interface FlowchartViewProps {
  nodes: PlanNode[];
  onToggleNode: (nodeId: string) => void;
}

export function FlowchartView({ nodes, onToggleNode }: FlowchartViewProps) {
  const renderConnector = () => (
    <div className="flex justify-center my-2">
      <ArrowDown className="w-4 h-4 text-zinc-800" />
    </div>
  );

  const renderNode = (node: PlanNode): JSX.Element | null => {
    if (node.type === 'start') return null;

    const statusColors = {
      pending: 'border-zinc-800 bg-zinc-950',
      'in-progress': 'border-amber-900/50 bg-amber-950/20',
      completed: 'border-emerald-900/50 bg-emerald-950/20'
    };

    return (
      <div key={node.id} className="animate-in">
        <div
          className={`rounded-lg border p-3 cursor-pointer transition-all hover:border-zinc-700 ${
            statusColors[node.status || 'pending']
          }`}
          onClick={() => onToggleNode(node.id)}
        >
          <div className="flex items-start gap-2">
            <StatusIcon status={node.status || 'pending'} className="w-4 h-4 mt-0.5" />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-zinc-300">{node.label}</span>
                {node.type === 'phase' && (
                  <Badge variant="outline" className="text-xs border-zinc-800 bg-zinc-900/50 text-zinc-500">
                    Phase
                  </Badge>
                )}
              </div>
              
              {node.description && (
                <p className="text-xs text-zinc-600">{node.description}</p>
              )}

              {node.files && node.files.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {node.files.map((file, i) => (
                    <code key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-zinc-800/50 text-zinc-600">
                      {file}
                    </code>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {node.expanded && node.children && node.children.length > 0 && (
          <div className="ml-6 mt-2 space-y-2 border-l border-zinc-900 pl-4">
            {node.children.map(childId => {
              const childNode = nodes.find(n => n.id === childId);
              return childNode ? renderNode(childNode) : null;
            })}
          </div>
        )}

        {!node.expanded && node.children && node.children.length > 0 && renderConnector()}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-2">
      {nodes.filter(n => n.type === 'phase').map(node => renderNode(node))}
    </div>
  );
}