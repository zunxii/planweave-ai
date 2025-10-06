'use client';

import { Target, Clock, GitBranch, FileCode, Check } from 'lucide-react';
import { StatusIcon } from './StatusIcon';
import type { ExecutionPlan } from '@/types';
import { useIDEStore } from '@/store';

interface CanvasHeaderProps {
  plan: ExecutionPlan;
}

export function CanvasHeader({ plan }: CanvasHeaderProps) {
  const finalizeActivePlan = useIDEStore(state => state.finalizeActivePlan);
  const getApprovedFinalPlan = useIDEStore(state => state.getApprovedFinalPlan);
  const canFinalize = useIDEStore(state => state.canFinalize);
  const setFinalPlanDoc = useIDEStore(state => state.setFinalPlanDoc);
  const setFinalPlanModalOpen = useIDEStore(state => state.setFinalPlanModalOpen);

  const handleFinalize = async () => {
    if (!canFinalize()) return;
    finalizeActivePlan();
    const finalPlan = getApprovedFinalPlan();
    try {
      const res = await fetch('/api/plan/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: finalPlan })
      });
      if (!res.ok) throw new Error('Failed to generate final plan document');
      const data = await res.json();
      setFinalPlanDoc(data.markdown || '');
      setFinalPlanModalOpen(true);
    } catch (e) {
      // Fallback: still open the modal with a minimal representation
      setFinalPlanDoc(`# Final Plan\n\nNo document generated.`);
      setFinalPlanModalOpen(true);
    }
  };
  return (
    <div className="px-3 py-2 border-b border-[#1f1f28] surface-elevated">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center flex-shrink-0 shadow-sm">
          <Target className="w-3 h-3 text-white" />
        </div>
        
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <h3 className="text-xs font-semibold text-[#f8fafc] truncate">{plan.title}</h3>
          <StatusIcon status={plan.status} className="w-3 h-3 flex-shrink-0" />
        </div>

        {/* Metadata inline */}
        <div className="flex items-center gap-2 text-[9px] text-[#64748b]">
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
          {plan.metadata?.filesAffected?.length! > 0 && (
            <div className="flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              <span>{plan.metadata?.filesAffected?.length}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleFinalize}
          disabled={!canFinalize()}
          className={`btn-3d ml-2 px-2 py-1 rounded-md text-[10px] font-medium border ${canFinalize() ? 'bg-[#18181f] hover:bg-[#1a1a22] text-[#e2e8f0] border-[#3b82f6]/40' : 'bg-[#0f0f14] text-[#475569] border-[#1f2937]'}`}
        >
          <Check className="w-3 h-3 inline mr-1" /> Finalize
        </button>
      </div>

      {/* Thin progress bar */}
      <div className="h-1 surface-inset rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] smooth-transition relative"
          style={{ width: `${plan.progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}