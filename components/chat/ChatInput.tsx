'use client';

import { useState, KeyboardEvent, FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

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
    <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800/50">
      <div className="relative">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to build..."
          className="w-full min-h-[80px] pr-12 glass-subtle border border-zinc-800/50 focus:border-zinc-700 resize-none text-sm rounded-lg p-3 focus:outline-none bg-transparent"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-xs text-zinc-700 mt-2">
        Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">Enter</kbd> to send
      </p>
    </form>
  );
}