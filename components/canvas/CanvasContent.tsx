'use client';

import { CanvasHeader } from './CanvasHeader';
import { PhaseCard } from './PhaseCard';
import type { ExecutionPlan } from '@/types';

interface CanvasContentProps {
  plan: ExecutionPlan;
}

export function CanvasContent({ plan }: CanvasContentProps) {
  return (
    <div className="flex flex-col h-full bg-[#252526]">
      <CanvasHeader plan={plan} />
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {plan.phases.map((phase, index) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            phaseNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}