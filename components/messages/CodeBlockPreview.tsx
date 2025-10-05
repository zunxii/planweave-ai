'use client';

import { Code } from 'lucide-react';
import type { CodeBlock } from '@/types';

interface CodeBlockPreviewProps {
  block: CodeBlock;
}

export function CodeBlockPreview({ block }: CodeBlockPreviewProps) {
  return (
    <div className="rounded-lg border border-zinc-800/50 bg-black/40 overflow-hidden">
      {block.filename && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/50 bg-zinc-900/30">
          <Code className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-xs font-mono text-zinc-500">{block.filename}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900/50 text-zinc-600 ml-auto">
            {block.language}
          </span>
        </div>
      )}
      <pre className="p-3 overflow-x-auto text-xs">
        <code className="text-zinc-400 font-mono">
          {block.code}
        </code>
      </pre>
    </div>
  );
}
