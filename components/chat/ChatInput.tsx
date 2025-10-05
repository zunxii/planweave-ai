'use client';

import { useState, KeyboardEvent, FormEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-[#1f1f28] surface-elevated">
      <div className="relative w-full flex items-center justify-center gap-10">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask me anything about your code..."
          className={`w-full min-h-[80px] pr-14 surface-inset border smooth-transition resize-none text-sm rounded-xl p-3 focus:outline-none placeholder:text-[#64748b] text-[#e2e8f0] ${
            isFocused ? 'border-[#3b82f6]/50 accent-glow' : 'border-[#1f1f28]'
          }`}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="btn-3d absolute bottom-3 right-3 h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-b from-[#3b82f6] to-[#2563eb] disabled:from-[#28283a] disabled:to-[#1f1f28] disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
        {!input.trim() && !disabled && (
          <div className="absolute bottom-3 right-14 text-[#64748b] pointer-events-none">
            <Sparkles className="w-4 h-4 opacity-50" />
          </div>
        )}
      </div>
      <p className="text-xs text-[#64748b] mt-2 flex items-center gap-2">
        <kbd className="px-2 py-0.5 rounded-md surface-inset text-[#94a3b8] text-[11px] font-mono border border-[#28283a]">Enter</kbd> to send
        <span className="text-[#4b5563]">•</span>
        <kbd className="px-2 py-0.5 rounded-md surface-inset text-[#94a3b8] text-[11px] font-mono border border-[#28283a]">Shift+Enter</kbd> for new line
      </p>
    </form>
  );
}