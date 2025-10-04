import { NextResponse } from 'next/server';
import { runRag } from '@/services/langchain/rag';

export async function POST(req: Request) {
  try {
    const { sessionId, message, files } = await req.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }
    
    if (!message) {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    console.log('Incoming message:', message, 'Session:', sessionId);
    console.log('Files context:', files?.length || 0, 'files');

    const reply = await runRag(sessionId, message, files || []);

    console.log('Generated reply:', reply.substring(0, 100) + '...');

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ 
      error: err.message || 'Internal error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}