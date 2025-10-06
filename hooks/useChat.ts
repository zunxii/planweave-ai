import { useState, useEffect } from 'react';
import { getSessionId } from '@/lib/session';
import { useIDEStore } from '@/store';

export function useChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
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

  async function sendMessage(
    message: string,
    onToken?: (token: string) => void,
    onStatus?: (status: string) => void
  ) {
    if (!sessionId) {
      console.error('Cannot send message: sessionId not ready');
      return { reply: 'Session not ready yet.' };
    }

    try {
      const res = await fetch('/api/chat/stream', {
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
        console.error(' API returned error:', res.status, errText);
        return { reply: 'Error from API' };
      }

      const reader = res.body?.getReader();
      if (!reader) {
        return { reply: 'No response stream' };
      }

      const decoder = new TextDecoder();
      let fullReply = '';
      let plan = null;
      let shouldCreatePlan = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'status') {
                onStatus?.(data.message);
              } else if (data.type === 'token') {
                fullReply += data.content;
                onToken?.(data.content);
              } else if (data.type === 'plan') {
                plan = data.plan;
                shouldCreatePlan = data.shouldCreatePlan;
              } else if (data.type === 'done') {
                console.log(' Stream completed');
              } else if (data.type === 'error') {
                console.error(' Stream error:', data.error);
                return { reply: `Error: ${data.error}` };
              }
            } catch (e) {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }

      if (shouldCreatePlan && plan) {
        console.log(' Creating execution plan in store...');
        
        const planId = createPlan(plan);
        setActivePlan(planId);
        setCanvasOpen(true);
        
        addNotification({
          type: 'success',
          title: ' Execution Plan Created',
          message: 'Your step-by-step plan is ready! Check the canvas to review.',
          autoHide: true,
          duration: 5000,
        });

        console.log(' Plan created and activated:', planId);
        
        return { 
          reply: fullReply,
          planCreated: true,
          planId 
        };
      }
      
      return { reply: fullReply }; 
    } catch (err) {
      console.error(' Error sending message:', err);
      return { reply: 'Failed to send message' };
    }
  }

  return { sendMessage, sessionId };
}