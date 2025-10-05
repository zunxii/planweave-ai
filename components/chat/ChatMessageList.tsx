'use client';

import { useRef, useEffect } from 'react';
import { MessageBubble } from '@/components/messages';
import { ThinkingIndicator } from './ThinkingIndicator';
import type { Message } from '@/types';

interface ChatMessageListProps {
  messages: Message[];
  isThinking: boolean;
}

export function ChatMessageList({ messages, isThinking }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(m => <MessageBubble key={m.id} message={m} />)}
      {isThinking && <ThinkingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
