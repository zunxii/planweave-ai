'use client';

import { useMemo, useState } from 'react';
import { CanvasHeader } from './CanvasHeader';
import { PhaseCard } from './PhaseCard';
import { FlowchartCanvas } from '@/components/flowchart/FlowchartCanvas';
import { LayoutList, GitBranch } from 'lucide-react';
import type { ExecutionPlan } from '@/types';

interface CanvasContentProps {
  plan: ExecutionPlan;
}

type CanvasView = 'list' | 'flowchart';
type PlanMode = 'proposed' | 'final';

export function CanvasContent({ plan }: CanvasContentProps) {
  const [view, setView] = useState<CanvasView>('list');
  const [mode, setMode] = useState<PlanMode>('proposed');

  const displayedPlan = useMemo(() => {
    if (mode === 'proposed') return plan;
    // Final mode: include only approved steps per phase
    return {
      ...plan,
      phases: plan.phases.map(phase => ({
        ...phase,
        steps: phase.steps.filter(s => s.status === 'approved')
      }))
    } as ExecutionPlan;
  }, [plan, mode]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      <CanvasHeader plan={plan} />
      
      {/* View Switcher */}
      <div className="px-3 py-2 border-b border-[#1f1f28] surface-elevated">
        <div className="flex items-center gap-2">
          <div className="mr-auto flex items-center gap-1 text-[10px]">
            <span className={`px-2 py-1 rounded-md border ${mode === 'proposed' ? 'bg-[#18181f] text-white border-[#3b82f6]/40' : 'text-[#94a3b8] border-[#28283a]'} cursor-pointer`}
              onClick={() => setMode('proposed')}
            >Proposed</span>
            <span className={`px-2 py-1 rounded-md border ${mode === 'final' ? 'bg-[#18181f] text-white border-[#10b981]/40' : 'text-[#94a3b8] border-[#28283a]'} cursor-pointer`}
              onClick={() => setMode('final')}
            >Final</span>
          </div>
          <button
            onClick={() => setView('list')}
            className={`btn-3d flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium smooth-transition ${
              view === 'list'
                ? 'bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white accent-glow'
                : 'bg-[#18181f] hover:bg-[#1a1a22] text-[#94a3b8] border border-[#28283a]'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            Phases
          </button>
          
          <button
            onClick={() => setView('flowchart')}
            className={`btn-3d flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium smooth-transition ${
              view === 'flowchart'
                ? 'bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white accent-glow'
                : 'bg-[#18181f] hover:bg-[#1a1a22] text-[#94a3b8] border border-[#28283a]'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Flowchart
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {view === 'list' ? (
          <div className="h-full overflow-y-auto p-3 space-y-2">
            {displayedPlan.phases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                phaseNumber={index + 1}
              />
            ))}
          </div>
        ) : (
          <FlowchartCanvas plan={displayedPlan} />
        )}
      </div>
    </div>
  );
}