'use client';

import { useState } from 'react';
import { CanvasHeader } from './CanvasHeader';
import { PhaseCard } from './PhaseCard';
import { FlowchartCanvas } from '@/components/flowchart/FlowchartCanvas';
import { LayoutList, GitBranch } from 'lucide-react';
import type { ExecutionPlan } from '@/types';

interface CanvasContentProps {
  plan: ExecutionPlan;
}

type CanvasView = 'list' | 'flowchart';

export function CanvasContent({ plan }: CanvasContentProps) {
  const [view, setView] = useState<CanvasView>('list');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      <CanvasHeader plan={plan} />
      
      {/* View Switcher */}
      <div className="px-3 py-2 border-b border-[#1f1f28] surface-elevated">
        <div className="flex items-center gap-2">
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
            {plan.phases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                phaseNumber={index + 1}
              />
            ))}
          </div>
        ) : (
          <FlowchartCanvas plan={plan} />
        )}
      </div>
    </div>
  );
}