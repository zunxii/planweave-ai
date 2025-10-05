'use client';

import { Circle, Loader2, CheckCircle2, AlertCircle, ChevronRight, ChevronDown, Clock } from 'lucide-react';
import { StepCard } from './StepCard';
import type { PlanPhase } from '@/types/planweave';
import { useIDEStore } from '@/store/useIDEStore';

interface PhaseCardProps {
  phase: PlanPhase;
  phaseNumber: number;
}

export function PhaseCard({ phase, phaseNumber }: PhaseCardProps) {
  const togglePhaseExpansion = useIDEStore(state => state.togglePhaseExpansion);

  const statusColors = {
    pending: 'border-zinc-800 bg-zinc-950/50',
    'in-progress': 'border-amber-600/30 bg-amber-950/10',
    completed: 'border-emerald-600/30 bg-emerald-950/10',
    failed: 'border-red-600/30 bg-red-950/10',
  };

  const statusIcons = {
    pending: <Circle className="w-4 h-4 text-zinc-600" />,
    'in-progress': <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />,
    completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    failed: <AlertCircle className="w-4 h-4 text-red-500" />,
  };

  const completedSteps = phase.steps.filter(s => s.status === 'completed').length;
  const totalSteps = phase.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className={`rounded-lg border ${statusColors[phase.status]} transition-all duration-300`}>
      {/* Phase Header */}
      <button
        onClick={() => togglePhaseExpansion(phase.id)}
        className="w-full flex items-start gap-3 p-3 hover:bg-zinc-900/20 transition-colors rounded-t-lg"
      >
        {/* Phase Number Badge */}
        <div className="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-zinc-400">{phaseNumber}</span>
        </div>

        {/* Phase Content */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-semibold text-zinc-200 truncate">{phase.label}</h4>
            {phase.estimatedTime && (
              <span className="text-[10px] text-zinc-600 flex items-center gap-1 flex-shrink-0">
                <Clock className="w-2.5 h-2.5" />
                {phase.estimatedTime}
              </span>
            )}
          </div>

          {phase.description && (
            <p className="text-[10px] text-zinc-500 line-clamp-2 mb-2">{phase.description}</p>
          )}

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  phase.status === 'completed' ? 'bg-emerald-500' :
                  phase.status === 'in-progress' ? 'bg-amber-500' :
                  phase.status === 'failed' ? 'bg-red-500' :
                  'bg-zinc-700'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-600 min-w-[50px] text-right">
              {completedSteps}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Status Icon & Expand Icon */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {statusIcons[phase.status]}
          {phase.expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Phase Steps */}
      {phase.expanded && (
        <div className="border-t border-zinc-800/50 p-2 space-y-1.5">
          {phase.steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              stepNumber={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}