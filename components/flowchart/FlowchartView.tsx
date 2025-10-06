'use client';

import { useState } from 'react';
import { FlowchartCanvas } from './FlowchartCanvas';
import { Layers, List } from 'lucide-react';
import type { ExecutionPlan } from '@/types';

interface FlowchartViewProps {
  plan: ExecutionPlan;
}

type ViewMode = 'canvas' | 'list';

export function FlowchartView({ plan }: FlowchartViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');

  return (
    <div className="flex flex-col h-full">
      {/* View mode toggle */}
      <div className="flex items-center gap-2 p-3 border-b border-[#1f1f28] surface-elevated">
        <button
          onClick={() => setViewMode('canvas')}
          className={`btn-3d flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
            viewMode === 'canvas'
              ? 'bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white accent-glow'
              : 'bg-[#18181f] hover:bg-[#1a1a22] text-[#94a3b8] border border-[#28283a]'
          }`}
        >
          <Layers className="w-4 h-4" />
          Canvas View
        </button>
        
        <button
          onClick={() => setViewMode('list')}
          className={`btn-3d flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
            viewMode === 'list'
              ? 'bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white accent-glow'
              : 'bg-[#18181f] hover:bg-[#1a1a22] text-[#94a3b8] border border-[#28283a]'
          }`}
        >
          <List className="w-4 h-4" />
          List View
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-[#64748b]">
            {plan.phases.length} phases • {plan.phases.reduce((acc, p) => acc + p.steps.length, 0)} steps
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'canvas' ? (
          <FlowchartCanvas plan={plan} />
        ) : (
          <div className="h-full overflow-y-auto p-4">
            {/* List view - reuse existing components */}
            <div className="space-y-3">
              {plan.phases.map((phase, index) => (
                <div key={phase.id} className="surface-card rounded-xl p-4 border border-[#1f1f28]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#e2e8f0]">{phase.label}</h3>
                      {phase.description && (
                        <p className="text-xs text-[#94a3b8] mt-1">{phase.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="ml-11 space-y-2">
                    {phase.steps.map((step, stepIndex) => (
                      <div key={step.id} className="text-xs text-[#94a3b8] flex items-center gap-2">
                        <span className="text-[#64748b]">{stepIndex + 1}.</span>
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}