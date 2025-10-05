'use client';

import { Bot } from 'lucide-react';

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3 animate-slide-in">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3b82f6]/30">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 surface-card rounded-2xl rounded-tl-sm p-4">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full animate-bounce shadow-lg shadow-[#3b82f6]/50" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full animate-bounce shadow-lg shadow-[#3b82f6]/50" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full animate-bounce shadow-lg shadow-[#3b82f6]/50" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}