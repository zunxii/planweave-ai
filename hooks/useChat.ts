import { useState, useEffect } from 'react';
import { getSessionId } from '@/lib/session';
import { useIDEStore } from '@/store';

export function useChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const files = useIDEStore(state => state.files);
  const createPlan = useIDEStore(state => state.createPlan);
  const setActivePlan = useIDEStore(state => state.setActivePlan);
  const setCanvasOpen = useIDEStore(state => state.setCanvasOpen);
  const addNotification = useIDEStore(state => state.addNotification);

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
          files
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('API returned error:', res.status, errText);
        return { reply: 'Error from API' };
      }

      const data = await res.json();
      console.log('✓ Received reply from API');

      if (data.shouldCreatePlan && data.plan) {
        console.log('✓ Creating execution plan in store...');
        
        const planId = createPlan(data.plan);
        
        setActivePlan(planId);
        setCanvasOpen(true);
        
        addNotification({
          type: 'success',
          title: ' Execution Plan Created',
          message: 'Your step-by-step plan is ready! Toggle the canvas to see details.',
          autoHide: true,
          duration: 5000,
        });

        console.log('✓ Plan created and activated:', planId);
        
        return { 
          reply: data.reply,
          planCreated: true,
          planId 
        };
      }
      
      return { reply: data.reply }; 
    } catch (err) {
      console.error(' Error sending message:', err);
      return { reply: 'Failed to send message' };
    } finally {
      setIsThinking(false);
    }
  }

  return { sendMessage, isThinking, sessionId };
}
