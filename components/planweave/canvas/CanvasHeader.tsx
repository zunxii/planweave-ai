'use client';

import { Circle, Loader2, CheckCircle2, AlertCircle, Pause, Clock, GitBranch, FileCode, Target } from 'lucide-react';
import type { ExecutionPlan } from '@/types/planweave';

interface CanvasHeaderProps {
  plan: ExecutionPlan;
}

export function CanvasHeader({ plan }: CanvasHeaderProps) {
  const statusColors = {
    draft: 'text-zinc-500',
    active: 'text-amber-500',
    completed: 'text-emerald-500',
    failed: 'text-red-500',
    paused: 'text-zinc-400',
  };

  const statusIcons = {
    draft: Circle,
    active: Loader2,
    completed: CheckCircle2,
    failed: AlertCircle,
    paused: Pause,
  };

  const StatusIcon = statusIcons[plan.status];

  return (
    <div className="p-4 border-b border-zinc-800/50 bg-zinc-950/50">
      {/* Top Section */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Target className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-zinc-100 truncate">{plan.title}</h3>
            <StatusIcon 
              className={`w-3.5 h-3.5 flex-shrink-0 ${statusColors[plan.status]} ${
                plan.status === 'active' ? 'animate-spin' : ''
              }`} 
            />
          </div>
          {plan.description && (
            <p className="text-xs text-zinc-500 line-clamp-2">{plan.description}</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Progress</span>
          <span className="text-zinc-300 font-medium">{plan.progress}%</span>
        </div>
        
        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${plan.progress}%` }}
          />
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-[10px] text-zinc-600 pt-1">
          {plan.metadata?.estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{plan.metadata.estimatedTime}</span>
            </div>
          )}
          {plan.metadata?.totalSteps && (
            <div className="flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              <span>{plan.metadata.completedSteps || 0}/{plan.metadata.totalSteps}</span>
            </div>
          )}
          {plan.metadata?.filesAffected && plan.metadata.filesAffected.length > 0 && (
            <div className="flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              <span>{plan.metadata.filesAffected.length} files</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}