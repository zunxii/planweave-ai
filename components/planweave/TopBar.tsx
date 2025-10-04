'use client';

import { Layers, Circle } from 'lucide-react';

interface TopBarProps {
  currentFile: string;
  showFlowchart: boolean;
}

export function TopBar({ currentFile, showFlowchart }: TopBarProps) {
  return (
    <div className="h-12 glass-panel border-b flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-zinc-500" />
          <span className="text-lg font-medium text-zinc-300">PlanWeave</span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <span className="text-xs text-zinc-600 font-mono">{currentFile}</span>
      </div>

      <div className="flex items-center gap-2">
        {showFlowchart && (
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-zinc-900/50">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
            <span className="text-xs text-zinc-400">Plan Active</span>
          </div>
        )}
      </div>
    </div>
  );
}
