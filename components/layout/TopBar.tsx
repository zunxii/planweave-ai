'use client';

import { Layers, Target, Activity } from 'lucide-react';
import { useIDEStore } from '@/store';

export function TopBar() {
  const currentFile = useIDEStore(state => state.currentFilePath);
  const activePlan = useIDEStore(state => state.getActivePlan());
  const canvas = useIDEStore(state => state.canvas);

  return (
    <div className="h-18 surface-elevated border-b border-[#1f1f28] flex items-center px-4 justify-between relative">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/10 to-transparent" />
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shadow-[#3b82f6]/30">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-[#f8fafc]">PlanWeave</span>
        </div>
        <div className="h-5 w-px bg-[#28283a]" />
        <span className="text-xs text-[#64748b] font-mono">{currentFile || 'No file selected'}</span>
      </div>

      <div className="flex items-center gap-3">
        {activePlan && canvas.isOpen && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg surface-card">
            <Activity className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-xs text-[#e2e8f0] max-w-[160px] truncate font-medium">{activePlan.title}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 surface-inset rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] smooth-transition"
                  style={{ width: `${activePlan.progress}%` }}
                />
              </div>
              <span className="text-[10px] text-[#94a3b8] min-w-[30px] font-mono">
                {activePlan.progress}%
              </span>
            </div>
          </div>
        )}

        {activePlan && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg smooth-transition ${
            canvas.isOpen
              ? 'surface-card border border-[#3b82f6]/30 accent-glow'
              : 'surface-card'
          }`}>
            <Target className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-xs font-semibold text-[#e2e8f0]">
              {canvas.isOpen ? 'Planning Active' : 'Plan Ready'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}