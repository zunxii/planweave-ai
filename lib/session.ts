export function getSessionId(): string | null {
  if (typeof window === 'undefined') {
    console.error('getSessionId called on server — localStorage not available');
    return null; 
  }

  try {
    let sid = localStorage.getItem('pw_session');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('pw_session', sid);
      console.log('Generated new session ID:', sid);
    } else {
      console.log('Existing session ID found:', sid);
    }
    return sid;
  } catch (err) {
    console.error('Error accessing localStorage:', err);
    return null;
  }
}
