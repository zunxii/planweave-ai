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
      className="btn-3d mt-3 w-full surface-card rounded-xl p-4 hover:border-[#3b82f6]/30 group text-left border border-[#1f1f28]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center shadow-lg shadow-[#3b82f6]/20">
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#e2e8f0]">
            View Execution Plan
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#64748b] group-hover:text-[#3b82f6] smooth-transition ${canvas.isOpen ? 'rotate-180' : ''}`} />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[#94a3b8] line-clamp-1">{plan.title}</p>
        
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 surface-inset rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] smooth-transition"
              style={{ width: `${plan.progress}%` }}
            />
          </div>
          <span className="text-[10px] text-[#64748b] font-mono">
            {plan.phases.length} phases • {plan.metadata?.totalSteps || 0} steps
          </span>
        </div>
      </div>
    </button>
  );
}