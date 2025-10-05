'use client';

import { MessageAvatar } from './MessageAvatar';
import { MessageContent } from './MessageContent';
import { PlanBadge } from './PlanBadge';
import { PlanCard } from './PlanCard';
import { CodeBlockPreview } from './CodeBlockPreview';
import { useIDEStore } from '@/store';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const executionPlans = useIDEStore(state => state.executionPlans);
  
  const associatedPlan = message.plan 
    ? executionPlans.find(p => p.title === message.plan?.title) 
    : null;

  return (
    <div className={`flex gap-3 animate-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <MessageAvatar role={message.role} />

      <div className={`flex-1 ${isUser ? 'max-w-[85%]' : 'max-w-full'}`}>
        {message.planUpdate && <PlanBadge />}

        <div className={`rounded-2xl p-3 ${
          isUser 
            ? 'bg-zinc-800/80 rounded-tr-sm ml-auto' 
            : associatedPlan
            ? 'glass-panel border border-zinc-800/50 rounded-tl-sm'
            : 'glass-subtle rounded-tl-sm'
        }`}>
          <MessageContent content={message.content} isUser={isUser} />

          {message.codeBlocks && message.codeBlocks.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.codeBlocks.map((block, idx) => (
                <CodeBlockPreview key={idx} block={block} />
              ))}
            </div>
          )}
        </div>

        {associatedPlan && <PlanCard plan={associatedPlan} />}
        
        <p className={`text-xs text-zinc-700 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}