'use client';

import { Target, ChevronDown } from 'lucide-react';
import { useIDEStore } from '@/store';
import type { ExecutionPlan } from '@/types';

interface PlanCardProps {
  plan: ExecutionPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const canvas = useIDEStore(state => state.canvas);
  const toggleCanvas = useIDEStore(state => state.toggleCanvas);
  const setActivePlan = useIDEStore(state => state.setActivePlan);

  const handleViewPlan = () => {
    setActivePlan(plan.id);
    if (!canvas.isOpen) {
      toggleCanvas();
    }
  };

  return (
    <button
      onClick={handleViewPlan}
      className="mt-2 w-full glass-panel border border-zinc-800/50 rounded-lg p-3 hover:border-violet-600/30 hover:bg-violet-950/10 transition-all group text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-zinc-300">
            View Execution Plan
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors ${canvas.isOpen ? 'rotate-180' : ''}`} />
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-zinc-500 line-clamp-1">{plan.title}</p>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${plan.progress}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-600">
            {plan.phases.length} phases • {plan.metadata?.totalSteps || 0} steps
          </span>
        </div>
      </div>
    </button>
  );
}
