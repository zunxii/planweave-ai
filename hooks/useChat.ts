import { useState, useEffect } from 'react';
import { getSessionId } from '@/lib/session';
import { useIDEStore } from '@/store/useIDEStore';

export function useChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const files = useIDEStore(state => state.files);

  useEffect(() => {
    const sid = getSessionId();
    if (!sid) {
      console.error('Session ID could not be retrieved.');
    }
    setSessionId(sid);
  }, []);

  async function sendMessage(message: string) {
    if (!sessionId) {
      console.error('Cannot send message: sessionId not ready');
      return { reply: 'Session not ready yet.' };
    }

    setIsThinking(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          message,
          files // Send current files with every message
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('API returned error:', res.status, errText);
        return { reply: 'Error from API' };
      }

      const data = await res.json();
      console.log('Received reply from API');
      return data; 
    } catch (err) {
      console.error('Error sending message:', err);
      return { reply: 'Failed to send message' };
    } finally {
      setIsThinking(false);
    }
  }

  return { sendMessage, isThinking, sessionId };
}