import { useState, useEffect } from 'react';
import { getSessionId } from '@/lib/session';

export function useSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sid = getSessionId();
    setSessionId(sid);
    setIsLoading(false);
  }, []);

  return { sessionId, isLoading };
}