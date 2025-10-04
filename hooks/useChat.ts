import { useState, useCallback } from 'react';
import type { Message } from '@/types/planweave';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'I understand. Let me help you plan this...',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsThinking(false);
  }, []);

  return { messages, sendMessage, isThinking };
}
