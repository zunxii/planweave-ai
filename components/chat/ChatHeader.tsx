'use client';

import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface ChatHeaderProps {
  showCanvas: boolean;
  onToggleCanvas: () => void;
  hasActivePlan: boolean;
}

export function ChatHeader({ showCanvas, onToggleCanvas, hasActivePlan }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-zinc-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-200">Planning Assistant</h2>
            <p className="text-xs text-zinc-600">Let's plan before we code</p>
          </div>
        </div>

        {hasActivePlan && (
          <button
            onClick={onToggleCanvas}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
              showCanvas 
                ? 'bg-violet-600 text-white hover:bg-violet-500' 
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {showCanvas ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Hide Canvas
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Show Canvas
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
