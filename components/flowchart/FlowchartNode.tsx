'use client';

import { ChevronRight, ChevronDown, FileCode } from 'lucide-react';
import { StatusIcon } from '@/components/canvas';
import type { PlanNode } from '@/types';

interface FlowchartNodeProps {
  node: PlanNode;
  depth?: number;
  onToggle?: () => void;
}

export function FlowchartNode({ node, depth = 0, onToggle }: FlowchartNodeProps) {
  if (node.type === 'start') return null;

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: `${depth * 16}px` }}>
      <div
        className={`group flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-all ${
          node.type === 'phase'
            ? 'hover:bg-zinc-900/50'
            : 'hover:bg-zinc-900/30'
        }`}
        onClick={hasChildren ? onToggle : undefined}
      >
        {hasChildren && (
          <button className="mt-0.5 text-zinc-600 hover:text-zinc-400">
            {node.expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        <div className="mt-0.5">
          <StatusIcon status={node.status || 'pending'} className="w-3.5 h-3.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-medium ${
              node.type === 'phase' ? 'text-zinc-300' : 'text-zinc-400'
            }`}>
              {node.label}
            </span>
            {node.type === 'phase' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-500">
                Phase
              </span>
            )}
          </div>
          
          {node.description && (
            <p className="text-[11px] text-zinc-600 mb-1">{node.description}</p>
          )}

          {node.files && node.files.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap mt-1">
              <FileCode className="w-3 h-3 text-zinc-700" />
              {node.files.slice(0, 2).map((file, i) => (
                <code key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 border border-zinc-800/50 text-zinc-600">
                  {file}
                </code>
              ))}
              {node.files.length > 2 && (
                <span className="text-[10px] text-zinc-700">+{node.files.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}