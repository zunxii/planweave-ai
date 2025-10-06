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
    <div className={`surface-card ${statusColors[phase.status]} smooth-transition rounded-lg overflow-hidden`}>
      <button
        onClick={() => togglePhaseExpansion(phase.id)}
        className="w-full flex items-center gap-2.5 p-2.5 hover:bg-[#1a1a22] smooth-transition"
      >
        {/* Number badge */}
        <div className="flex-shrink-0 w-6 h-6 rounded-md surface-inset border border-[#28283a] flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#94a3b8]">{phaseNumber}</span>
        </div>

        {/* Content */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-semibold text-[#e2e8f0] truncate flex-1">{phase.label}</h4>
            {phase.estimatedTime && (
              <span className="text-[9px] text-[#64748b] flex items-center gap-0.5 flex-shrink-0">
                <Clock className="w-2.5 h-2.5" />
                {phase.estimatedTime}
              </span>
            )}
          </div>

          {/* Compact progress */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 surface-inset rounded-full overflow-hidden">
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
            <span className="text-[9px] text-[#94a3b8] min-w-[32px] text-right font-mono">
              {completedSteps}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Status & Toggle */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusIcon status={phase.status} className="w-3.5 h-3.5" />
          {phase.expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
          )}
        </div>
      </button>

      {phase.expanded && (
        <div className="border-t border-[#1f1f28] p-2 space-y-1.5 animate-slide-in bg-[#0f0f14]/50">
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