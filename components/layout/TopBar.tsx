'use client';

import { Layers, Target, TrendingUp } from 'lucide-react';
import { useIDEStore } from '@/store';

export function TopBar() {
  const currentFile = useIDEStore(state => state.currentFilePath);
  const activePlan = useIDEStore(state => state.getActivePlan());
  const canvas = useIDEStore(state => state.canvas);

  return (
    <div className="h-12 glass-panel border-b flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-medium text-zinc-300">PlanWeave</span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <span className="text-xs text-zinc-600 font-mono">{currentFile || 'No file selected'}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Plan Status */}
        {activePlan && canvas.isOpen && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-zinc-400 max-w-[200px] truncate">{activePlan.title}</span>
            <div className="flex items-center gap-1">
              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
                  style={{ width: `${activePlan.progress}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-600 min-w-[30px]">
                {activePlan.progress}%
              </span>
            </div>
          </div>
        )}

        {/* Canvas Status Indicator */}
        {activePlan && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
            canvas.isOpen
              ? 'bg-violet-600/20 border border-violet-600/30'
              : 'bg-zinc-900/50 border border-zinc-800/50'
          }`}>
            <Target className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-medium text-zinc-300">
              {canvas.isOpen ? 'Canvas Active' : 'Canvas Ready'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}