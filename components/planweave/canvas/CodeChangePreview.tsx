'use client';

import { FileCode, CheckCircle2 } from 'lucide-react';
import type { CodeChange } from '@/types/planweave';

interface CodeChangePreviewProps {
  change: CodeChange;
}

export function CodeChangePreview({ change }: CodeChangePreviewProps) {
  const changeTypeColors = {
    create: 'border-emerald-600/30 bg-emerald-950/10',
    modify: 'border-amber-600/30 bg-amber-950/10',
    delete: 'border-red-600/30 bg-red-950/10',
  };

  const changeTypeLabels = {
    create: 'Create',
    modify: 'Modify',
    delete: 'Delete',
  };

  return (
    <div className={`rounded-md border ${changeTypeColors[change.changeType]} p-2`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <FileCode className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-mono text-zinc-400">{change.file}</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900/50 text-zinc-500">
          {changeTypeLabels[change.changeType]}
        </span>
      </div>

      {change.content && (
        <pre className="text-[9px] font-mono text-zinc-400 bg-black/40 rounded p-1.5 overflow-x-auto max-h-32 overflow-y-auto">
          <code>{change.content.slice(0, 300)}{change.content.length > 300 ? '...' : ''}</code>
        </pre>
      )}

      {change.diff && (
        <pre className="text-[9px] font-mono text-zinc-400 bg-black/40 rounded p-1.5 overflow-x-auto max-h-32 overflow-y-auto">
          <code>{change.diff}</code>
        </pre>
      )}

      {change.applied && (
        <div className="flex items-center gap-1 mt-1.5 text-[9px] text-emerald-600">
          <CheckCircle2 className="w-2.5 h-2.5" />
          <span>Applied {change.appliedAt?.toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
}