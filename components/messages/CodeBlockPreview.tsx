'use client';

import { Code } from 'lucide-react';
import type { CodeBlock } from '@/types';

interface CodeBlockPreviewProps {
  block: CodeBlock;
}

export function CodeBlockPreview({ block }: CodeBlockPreviewProps) {
  return (
    <div className="rounded-lg border border-[#1f1f28] overflow-hidden surface-inset">
      {block.filename && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1f1f28] surface-elevated">
          <Code className="w-4 h-4 text-[#64748b]" />
          <span className="text-xs font-mono text-[#e2e8f0]">{block.filename}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-md surface-inset text-[#94a3b8] ml-auto border border-[#28283a]">
            {block.language}
          </span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-xs">
        <code className="text-[#94a3b8] font-mono">
          {block.code}
        </code>
      </pre>
    </div>
  );
}