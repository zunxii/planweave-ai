'use client';

import { ChevronRight, ChevronDown, Clock } from 'lucide-react';
import { StatusIcon } from './StatusIcon';
import { StepCard } from './StepCard';
import { useIDEStore } from '@/store';
import type { PlanPhase } from '@/types';

interface PhaseCardProps { 
  phase: PlanPhase;
  phaseNumber: number;
}

export function PhaseCard({ phase, phaseNumber }: PhaseCardProps) {
  const togglePhaseExpansion = useIDEStore(state => state.togglePhaseExpansion);

  const statusColors = {
    pending: 'border-[#1f1f28] bg-[#14141a]',
    'in-progress': 'border-[#f59e0b]/30 bg-[#18141a]',
    completed: 'border-[#10b981]/30 bg-[#14181a]',
    failed: 'border-[#ef4444]/30 bg-[#1a1418]',
  };

  const completedSteps = phase.steps.filter(s => s.status === 'completed').length;
  const totalSteps = phase.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className={`surface-card ${statusColors[phase.status]} smooth-transition`}>
      <button
        onClick={() => togglePhaseExpansion(phase.id)}
        className="w-full flex items-start gap-3 p-4 hover:bg-[#1a1a22] smooth-transition rounded-xl"
      >
        <div className="flex-shrink-0 w-7 h-7 rounded-lg surface-inset border border-[#28283a] flex items-center justify-center">
          <span className="text-[11px] font-bold text-[#94a3b8]">{phaseNumber}</span>
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-[#e2e8f0] truncate">{phase.label}</h4>
            {phase.estimatedTime && (
              <span className="text-[10px] text-[#64748b] flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {phase.estimatedTime}
              </span>
            )}
          </div>

          {phase.description && (
            <p className="text-xs text-[#94a3b8] line-clamp-2 mb-3">{phase.description}</p>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 surface-inset rounded-full overflow-hidden">
              <div
                className={`h-full smooth-transition ${
                  phase.status === 'completed' ? 'bg-gradient-to-r from-[#10b981] to-[#059669]' :
                  phase.status === 'in-progress' ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706]' :
                  phase.status === 'failed' ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]' :
                  'bg-[#28283a]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#94a3b8] min-w-[50px] text-right font-mono">
              {completedSteps}/{totalSteps}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusIcon status={phase.status} className="w-4 h-4" />
          {phase.expanded ? (
            <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          )}
        </div>
      </button>

      {phase.expanded && (
        <div className="border-t border-[#1f1f28] p-3 space-y-2 animate-slide-in bg-[#0f0f14]/50">
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