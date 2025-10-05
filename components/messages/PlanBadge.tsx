'use client';

import { Zap } from 'lucide-react';

export function PlanBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 mb-2 text-xs border border-violet-600/30 bg-violet-950/20 text-violet-400 px-2.5 py-1 rounded-full">
      <Zap className="w-3 h-3" />
      Execution Plan Created
    </div>
  );
}