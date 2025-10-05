'use client';

import { FileCode, CheckCircle2 } from 'lucide-react';
import type { CodeChange } from '@/types';

interface CodeChangePreviewProps {
  change: CodeChange;
}

export function CodeChangePreview({ change }: CodeChangePreviewProps) {
  const changeTypeConfig = {
    create: {
      border: 'border-[#10b981]/30',
      bg: 'bg-[#10b981]/5',
      text: 'text-[#10b981]',
      label: 'Create'
    },
    modify: {
      border: 'border-[#f59e0b]/30',
      bg: 'bg-[#f59e0b]/5',
      text: 'text-[#f59e0b]',
      label: 'Modify'
    },
    delete: {
      border: 'border-[#ef4444]/30',
      bg: 'bg-[#ef4444]/5',
      text: 'text-[#ef4444]',
      label: 'Delete'
    },
  };

  const config = changeTypeConfig[change.changeType];

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-[#94a3b8]" />
          <span className="text-xs font-mono text-[#e2e8f0]">{change.file}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-md surface-inset ${config.text} font-bold`}>
          {config.label}
        </span>
      </div>

      {change.content && (
        <pre className="text-[10px] font-mono text-[#94a3b8] surface-inset rounded-lg p-2 overflow-x-auto max-h-32 overflow-y-auto border border-[#1f1f28]">
          <code>{change.content.slice(0, 300)}{change.content.length > 300 ? '...' : ''}</code>
        </pre>
      )}

      {change.diff && (
        <pre className="text-[10px] font-mono text-[#94a3b8] surface-inset rounded-lg p-2 overflow-x-auto max-h-32 overflow-y-auto border border-[#1f1f28]">
          <code>{change.diff}</code>
        </pre>
      )}

      {change.applied && (
        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#10b981]">
          <CheckCircle2 className="w-3 h-3" />
          <span>Applied {change.appliedAt?.toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
}
