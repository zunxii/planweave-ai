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
    <div className="p-4 border-b border-zinc-800/50 bg-zinc-950/50">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Target className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-zinc-100 truncate">{plan.title}</h3>
            <StatusIcon status={plan.status} className="w-3.5 h-3.5" />
          </div>
          {plan.description && (
            <p className="text-xs text-zinc-500 line-clamp-2">{plan.description}</p>
          )}
        </div>
      </div>

      <ProgressBar progress={plan.progress} />
      
      {metadataItems.length > 0 && <MetadataRow items={metadataItems} />}
    </div>
  );
}
