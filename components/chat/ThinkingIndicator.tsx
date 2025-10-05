'use client';

import { Sparkles } from 'lucide-react';

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3 animate-in">
      <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
      </div>
      <div className="flex-1 glass-subtle rounded-2xl rounded-tl-sm p-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}