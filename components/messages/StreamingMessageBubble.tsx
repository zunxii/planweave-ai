'use client';

import { useEffect, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { MessageAvatar } from './MessageAvatar';
import { MessageContent } from './MessageContent';

interface StreamingMessageBubbleProps {
  content: string;
  status?: string;
  isComplete?: boolean;
}

export function StreamingMessageBubble({ 
  content, 
  status,
  isComplete = false 
}: StreamingMessageBubbleProps) {
  const [displayContent, setDisplayContent] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayContent(content);
  }, [content]);

  useEffect(() => {
    if (!isComplete) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setShowCursor(false);
    }
  }, [isComplete]);

  return (
    <div className="flex gap-3 animate-slide-in">
      <MessageAvatar role="assistant" />

      <div className="flex-1 max-w-full">
        {status && !isComplete && (
          <div className="mb-2 flex items-center gap-2 text-xs text-[#94a3b8]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#3b82f6]" />
            <span className="animate-pulse">{status}</span>
          </div>
        )}

        <div className="surface-card rounded-2xl rounded-tl-sm p-4 smooth-transition relative">
          <MessageContent content={displayContent} isUser={false} />

          {!isComplete && showCursor && (
            <span className="inline-block w-2 h-4 bg-[#3b82f6] ml-1 animate-pulse" />
          )}

          {!isComplete && (
            <div className="absolute bottom-2 right-2">
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
        </div>

        {isComplete && (
          <p className="text-xs text-[#64748b] mt-2 text-left">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}