import { useIDEStore } from '@/store';
import { nanoid } from 'nanoid';
import type { Message } from '@/types';

export function useChatMessages() {
  const messages = useIDEStore(state => state.messages);
  const addMessage = useIDEStore(state => state.addMessage);
  const clearMessages = useIDEStore(state => state.clearMessages);

  const addUserMessage = (content: string): Message => {
    const message: Message = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(message);
    return message;
  };

  const addAssistantMessage = (content: string, extras?: Partial<Message>): Message => {
    const message: Message = {
      id: nanoid(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      ...extras,
    };
    addMessage(message);
    return message;
  };

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    clearMessages,
  };
}
