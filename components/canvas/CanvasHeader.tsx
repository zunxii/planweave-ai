'use client';

import { Target } from 'lucide-react';
import { StatusIcon } from './StatusIcon';
import { ProgressBar } from './ProgressBar';
import { MetadataRow } from './MetadataRow';
import type { ExecutionPlan } from '@/types';

interface CanvasHeaderProps {
  plan: ExecutionPlan;
}

export function CanvasHeader({ plan }: CanvasHeaderProps) {
  const metadataItems = [
    ...(plan.metadata?.estimatedTime ? [{ icon: 'time' as const, label: plan.metadata.estimatedTime }] : []),
    ...(plan.metadata?.totalSteps ? [{ 
      icon: 'steps' as const, 
      label: `${plan.metadata.completedSteps || 0}/${plan.metadata.totalSteps}` 
    }] : []),
    ...(plan.metadata?.filesAffected?.length ? [{ 
      icon: 'files' as const, 
      label: `${plan.metadata.filesAffected.length} files` 
    }] : []),
  ];

  return (
    <div className="p-5 border-b border-[#1f1f28] surface-elevated relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/20 to-transparent" />
      
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3b82f6]/30">
          <Target className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-[#f8fafc] truncate">{plan.title}</h3>
            <StatusIcon status={plan.status} className="w-4 h-4" />
          </div>
          {plan.description && (
            <p className="text-xs text-[#94a3b8] line-clamp-2">{plan.description}</p>
          )}
        </div>
      </div>

      <ProgressBar progress={plan.progress} />
      
      {metadataItems.length > 0 && <MetadataRow items={metadataItems} />}
    </div>
  );
}