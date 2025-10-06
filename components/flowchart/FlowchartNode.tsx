'use client';

import { StatusIcon } from '@/components/canvas';
import { FileCode, Clock, ThumbsUp } from 'lucide-react';
import type { PlanNode, FlowchartNodePosition } from '@/types';

export { FlowchartNode as default };

interface FlowchartNodeProps {
  node: PlanNode;
  position: FlowchartNodePosition;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (node: PlanNode) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function FlowchartNode({
  node,
  position,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: FlowchartNodeProps) {
  const nodeWidth = 280;
  const nodeHeight = 120;

  const getNodeStyle = () => {
    switch (node.type) {
      case 'start':
        return 'bg-gradient-to-br from-[#10b981] to-[#059669] border-[#10b981]/50';
      case 'end':
        return 'bg-gradient-to-br from-[#6366f1] to-[#4f46e5] border-[#6366f1]/50';
      case 'phase':
        return 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] border-[#3b82f6]/50';
      case 'step':
        return 'surface-card border-[#1f1f28]';
      default:
        return 'surface-card border-[#1f1f28]';
    }
  };

  const getStatusEffect = () => {
    switch (node.status) {
      case 'in-progress':
        return 'ring-2 ring-[#f59e0b] ring-opacity-50 animate-pulse';
      case 'completed':
        return 'ring-2 ring-[#10b981] ring-opacity-30';
      case 'failed':
        return 'ring-2 ring-[#ef4444] ring-opacity-50';
      default:
        return '';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(node);
  };

  return (
    <div
      className={`absolute cursor-pointer smooth-transition pointer-events-auto ${getNodeStyle()} ${getStatusEffect()} ${
        isSelected ? 'ring-4 ring-[#3b82f6]' : ''
      } ${isHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'}`}
      style={{
        left: position.x - nodeWidth / 2,
        top: position.y - nodeHeight / 2,
        width: nodeWidth,
        height: nodeHeight,
      }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative w-full h-full rounded-xl border-2 p-4 overflow-hidden">
        {/* Background pattern for phases */}
        {node.type === 'phase' && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {node.type === 'phase' && (
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
              )}
              <StatusIcon status={node.status!} className="w-4 h-4" />
            </div>
            
            {node.type === 'step' && node.status === 'pending' && (
              <button className="btn-3d p-1 rounded bg-[#10b981] hover:bg-[#059669]">
                <ThumbsUp className="w-3 h-3 text-white" />
              </button>
            )}
          </div>

          {/* Label */}
          <h4 className={`text-sm font-semibold mb-1 line-clamp-2 ${
            node.type === 'start' || node.type === 'end' || node.type === 'phase' 
              ? 'text-white' 
              : 'text-[#e2e8f0]'
          }`}>
            {node.label}
          </h4>

          {/* Description */}
          {node.description && (
            <p className={`text-xs line-clamp-2 mb-2 ${
              node.type === 'start' || node.type === 'end' || node.type === 'phase'
                ? 'text-white/80'
                : 'text-[#94a3b8]'
            }`}>
              {node.description}
            </p>
          )}

          {/* Footer metadata */}
          <div className="mt-auto flex items-center justify-between text-[10px]">
            {node.files && node.files.length > 0 && (
              <div className={`flex items-center gap-1 ${
                node.type === 'phase' ? 'text-white/70' : 'text-[#64748b]'
              }`}>
                <FileCode className="w-3 h-3" />
                <span>{node.files.length} file{node.files.length > 1 ? 's' : ''}</span>
              </div>
            )}

            {node.type === 'phase' && (
              <div className="flex items-center gap-1 text-white/70">
                <Clock className="w-3 h-3" />
                <span>Est. 30m</span>
              </div>
            )}
          </div>

          {/* Children indicator */}
          {node.children && node.children.length > 0 && (
            <div className="absolute bottom-2 right-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{node.children.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}