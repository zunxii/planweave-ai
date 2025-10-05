'use client';

import { Layers, Circle, Target, TrendingUp } from 'lucide-react';
import { useIDEStore } from '@/store/useIDEStore';

export function TopBar() {
  const currentFile = useIDEStore(state => state.currentFilePath);
  const canvas = useIDEStore(state => state.canvas);
  const toggleCanvas = useIDEStore(state => state.toggleCanvas);
  const activePlan = useIDEStore(state => state.getActivePlan());

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
        {activePlan && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-zinc-400">{activePlan.title}</span>
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

        {/* Canvas Toggle Button */}
        <button
          onClick={toggleCanvas}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
            canvas.isOpen
              ? 'bg-violet-600 text-white'
              : 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 border border-zinc-800/50 hover:border-zinc-700'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Canvas</span>
          {activePlan && (
            <Circle 
              className={`w-2 h-2 ${
                canvas.isOpen ? 'fill-white text-white' : 'fill-violet-500 text-violet-500'
              }`} 
            />
          )}
        </button>
      </div>
    </div>
  );
}