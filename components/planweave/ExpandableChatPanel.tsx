'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { CanvasContent } from './canvas/CanvasContent';
import { useIDEStore } from '@/store/useIDEStore';

interface ExpandableChatPanelProps {
  onSendMessage: (content: string) => void;
}

export function ExpandableChatPanel({ onSendMessage }: ExpandableChatPanelProps) {
  const messages = useIDEStore(state => state.messages);
  const isThinking = useIDEStore(state => state.isThinking);
  const canvas = useIDEStore(state => state.canvas);
  const toggleCanvas = useIDEStore(state => state.toggleCanvas);
  const activePlan = useIDEStore(state => state.getActivePlan());

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic width based on canvas state
  const panelWidth = canvas.isOpen ? '45%' : '480px';
  const minWidth = canvas.isOpen ? '700px' : '480px';
  const maxWidth = canvas.isOpen ? '55%' : '480px';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div 
      className="flex-shrink-0 glass-panel border-r flex flex-col transition-all duration-300 ease-out"
      style={{ 
        width: panelWidth,
        minWidth: minWidth,
        maxWidth: maxWidth
      }}
    >
      {/* Canvas Section - Top (expandable) */}
      {canvas.isOpen && activePlan && (
        <div className="border-b border-zinc-800/50 animate-in slide-in-from-top duration-300" style={{ height: '55%' }}>
          <CanvasContent plan={activePlan} />
        </div>
      )}

      {/* Chat Section - Bottom */}
      <div className={`flex flex-col transition-all duration-300 ${canvas.isOpen ? 'h-[45%]' : 'h-full'}`}>
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/50 flex-shrink-0">
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

            {activePlan && (
              <button
                onClick={toggleCanvas}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                  canvas.isOpen 
                    ? 'bg-violet-600 text-white hover:bg-violet-500' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {canvas.isOpen ? (
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

        {/* Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(m => <MessageBubble key={m.id} message={m} />)}
          {isThinking && (
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
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Fixed at bottom */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800/50 flex-shrink-0">
          <div className="relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              className="w-full min-h-[80px] pr-12 glass-subtle border border-zinc-800/50 focus:border-zinc-700 resize-none text-sm rounded-lg p-3 focus:outline-none bg-transparent"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-zinc-700 mt-2">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">Enter</kbd> to send
          </p>
        </form>
      </div>
    </div>
  );
}