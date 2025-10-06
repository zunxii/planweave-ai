'use client';

import { MessageAvatar } from './MessageAvatar';
import { MessageContent } from './MessageContent';
import { PlanBadge } from './PlanBadge';
import { PlanCard } from './PlanCard';
import { CodeBlockPreview } from './CodeBlockPreview';
import { useIDEStore } from '@/store';
import { Sparkles } from 'lucide-react';
import type { Message } from '@/types';
import { useState, useEffect } from 'react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [showCursor, setShowCursor] = useState(true);
  const isUser = message.role === 'user';
  const executionPlans = useIDEStore(state => state.executionPlans);
  
  const associatedPlan = message.plan 
    ? executionPlans.find(p => p.title === message.plan?.title) 
    : null;

  useEffect(() => {
    if (message.isStreaming) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setShowCursor(false);
    }
  }, [message.isStreaming]);

  return (
    <div className={`flex gap-3 animate-slide-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <MessageAvatar role={message.role} />

      <div className={`flex-1 ${isUser ? 'max-w-[85%]' : 'max-w-full'}`}>
        {message.planUpdate && <PlanBadge />}

        {message.isStreaming && message.status && (
          <div className="mb-2 flex items-center gap-2 text-xs text-[#94a3b8]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#3b82f6]" />
            <span className="animate-pulse">{message.status}</span>
          </div>
        )}

        <div className={`rounded-2xl p-4 smooth-transition relative ${
          isUser 
            ? 'surface-card rounded-tr-sm ml-auto' 
            : associatedPlan
            ? 'surface-elevated rounded-tl-sm'
            : 'surface-card rounded-tl-sm'
        }`}>
          <MessageContent content={message.content} isUser={isUser} />

          {message.isStreaming && showCursor && message.content && (
            <span className="inline-block w-0.5 h-4 bg-[#3b82f6] ml-1 animate-pulse" />
          )}

          {message.isStreaming && (
            <div className="absolute bottom-3 right-3">
              <div className="flex gap-1">
                <div 
                  className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce" 
                  style={{ animationDelay: '0ms' }} 
                />
                <div 
                  className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce" 
                  style={{ animationDelay: '150ms' }} 
                />
                <div 
                  className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce" 
                  style={{ animationDelay: '300ms' }} 
                />
              </div>
            </div>
          )}

          {message.codeBlocks && message.codeBlocks.length > 0 && !message.isStreaming && (
            <div className="mt-3 space-y-2">
              {message.codeBlocks.map((block, idx) => (
                <CodeBlockPreview key={idx} block={block} />
              ))}
            </div>
          )}
        </div>

        {associatedPlan && !message.isStreaming && <PlanCard plan={associatedPlan} />}
        
        {!message.isStreaming && (
          <p className={`text-xs text-[#64748b] mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}