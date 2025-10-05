'use client';

import { Code, FileCode, Zap, Eye, TrendingUp } from 'lucide-react';

interface StepTypeIconProps {
  type: 'code' | 'file' | 'command' | 'review' | 'test';
}

export function StepTypeIcon({ type }: StepTypeIconProps) {
  const typeIcons = {
    code: <Code className="w-3 h-3" />,
    file: <FileCode className="w-3 h-3" />,
    command: <Zap className="w-3 h-3" />,
    review: <Eye className="w-3 h-3" />,
    test: <TrendingUp className="w-3 h-3" />,
  };

  return (
    <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-zinc-900/50 border border-zinc-800/50">
      {typeIcons[type]}
      <span className="text-[9px] text-zinc-600 uppercase">{type}</span>
    </div>
  );
}