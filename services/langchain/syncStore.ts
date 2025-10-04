import { useIDEStore } from '@/store/useIDEStore';
import { getSessionId } from '@/lib/session';

export async function syncStore(action: 'sync' | 'clear' = 'sync') {
  const files = useIDEStore.getState().files; 
  const sessionId = getSessionId();

  try {
    const res = await fetch('/api/syncVectorStore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, files, sessionId }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error('Vector store sync failed:', data.message, data.error);
      return false;
    }

    console.log('✅', data.message);
    return true;
  } catch (err) {
    console.error('Network or unexpected error:', err);
    return false;
  }
}