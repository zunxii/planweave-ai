'use client';

import { Target, Clock, GitBranch, FileCode, Check, Sparkles } from 'lucide-react';
import { StatusIcon } from './StatusIcon';
import type { ExecutionPlan } from '@/types';
import { useIDEStore } from '@/store';
import { useState } from 'react';

interface CanvasHeaderProps {
  plan: ExecutionPlan;
}

export function CanvasHeader({ plan }: CanvasHeaderProps) {
  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);
  const canCompletePlan = useIDEStore(state => state.canCompletePlan);
  const setFinalPlanDoc = useIDEStore(state => state.setFinalPlanDoc);
  const setFinalPlanModalOpen = useIDEStore(state => state.setFinalPlanModalOpen);
  const getActivePlan = useIDEStore(state => state.getActivePlan);
  const getPlanHash = useIDEStore(state => state.getPlanHash);
  const getCachedPlan = useIDEStore(state => state.getCachedPlan);
  const setCachedPlan = useIDEStore(state => state.setCachedPlan);
  const addNotification = useIDEStore(state => state.addNotification);

  const handleCompletePlan = async () => {
    const activePlan = getActivePlan();
    if (!activePlan || !canCompletePlan()) return;

    // Check cache first
    const cachedDoc = getCachedPlan(activePlan.id);
    if (cachedDoc) {
      setFinalPlanDoc(cachedDoc);
      setFinalPlanModalOpen(true);
      addNotification({
        type: 'info',
        title: 'Cached Plan Loaded',
        message: 'Showing previously generated plan (no changes detected)',
        autoHide: true,
        duration: 2500
      });
      return;
    }

    setIsGeneratingFinal(true);

    try {
      const res = await fetch('/api/plan/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: activePlan })
      });

      if (!res.ok) throw new Error('Failed to complete plan');
      
      const data = await res.json();
      const agentPlan = data.agentPlan || data.markdown || '';
      
      const planHash = getPlanHash(activePlan);
      setCachedPlan(activePlan.id, agentPlan, planHash);
      
      setFinalPlanDoc(agentPlan);
      setFinalPlanModalOpen(true);
      
      addNotification({
        type: 'success',
        title: 'Plan Completed',
        message: 'Your agent-friendly execution plan is ready!',
        autoHide: true,
        duration: 3000
      });
    } catch (e) {
      console.error('Complete plan error:', e);
      addNotification({
        type: 'error',
        title: 'Completion Failed',
        message: 'Could not complete the plan. Please try again.',
        autoHide: true,
        duration: 4000
      });
    } finally {
      setIsGeneratingFinal(false);
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

        {canCompletePlan() && (
          <button
            onClick={handleCompletePlan}
            disabled={isGeneratingFinal}
            className={`btn-3d ml-2 px-3 py-1.5 rounded-md text-[10px] font-medium border smooth-transition ${
              isGeneratingFinal
                ? 'bg-[#0f0f14] text-[#475569] border-[#1f2937] cursor-wait'
                : 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white border-[#10b981]/40 accent-glow'
            }`}
          >
            {isGeneratingFinal ? (
              <>
                <Sparkles className="w-3 h-3 inline mr-1 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Check className="w-3 h-3 inline mr-1" />
                Complete Plan
              </>
            )}
          </button>
        )}
      </div>

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