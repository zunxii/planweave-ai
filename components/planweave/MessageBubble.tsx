'use client';

import { Sparkles, User, Zap } from 'lucide-react';
import type { Message } from '@/types/planweave';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 animate-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-zinc-800' : 'bg-zinc-900'
      }`}>
        {isUser ? (
          <User className="w-3.5 h-3.5 text-zinc-400" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
        )}
      </div>

      <div className="flex-1 max-w-[85%]">
        <div className={`rounded-2xl p-3 ${
          isUser 
            ? 'bg-zinc-800/80 rounded-tr-sm ml-auto' 
            : 'glass-subtle rounded-tl-sm'
        }`}>
          {message.planUpdate && (
            <div className="inline-flex items-center gap-1 mb-2 text-xs border border-zinc-700/50 bg-zinc-800/50 text-zinc-400 px-2 py-1 rounded">
              <Zap className="w-3 h-3" />
              Plan Updated
            </div>
          )}
          
          <div className={`text-sm whitespace-pre-wrap ${
            isUser ? 'text-zinc-200' : 'text-zinc-300'
          }`}>
            {message.content}
          </div>
        </div>
        
        <p className={`text-xs text-zinc-700 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
