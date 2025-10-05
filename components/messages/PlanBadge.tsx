'use client';

import { Sparkles } from 'lucide-react';

export function PlanBadge() {
  return (
    <div className="inline-flex items-center gap-2 mb-3 text-xs border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6] px-3 py-1.5 rounded-full font-medium shadow-sm shadow-[#3b82f6]/10">
      <Sparkles className="w-3.5 h-3.5" />
      Plan Generated
    </div>
  );
}