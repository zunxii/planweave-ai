'use client';

import { Bot, ChevronUp, ChevronDown } from 'lucide-react';

interface ChatHeaderProps {
  showCanvas: boolean;
  onToggleCanvas: () => void;
  hasActivePlan: boolean;
}

export function ChatHeader({ showCanvas, onToggleCanvas, hasActivePlan }: ChatHeaderProps) {
  return (
    <div className="px-4 py-4 border-b border-[#1f1f28] surface-elevated">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#f8fafc]">AI Assistant</h2>
            <p className="text-xs text-[#64748b]">Plan first, code better</p>
          </div>
        </div>

        {hasActivePlan && (
          <button
            onClick={onToggleCanvas}
            className={`btn-3d flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
              showCanvas 
                ? 'bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white accent-glow' 
                : 'bg-[#18181f] hover:bg-[#1a1a22] text-[#94a3b8] border border-[#28283a]'
            }`}
          >
            {showCanvas ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Plan
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Plan
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}