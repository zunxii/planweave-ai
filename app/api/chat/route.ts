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

    console.log(' Incoming message:', message.substring(0, 100), 'Session:', sessionId);
    console.log(' Files context:', files?.length || 0, 'files');

    // Enhanced RAG with plan generation
    const result = await runRag(sessionId, message, files || []);

    console.log(' Generated reply:', result.reply.substring(0, 100) + '...');
    
    if (result.shouldCreatePlan && result.plan) {
      console.log(' Plan created with', result.plan.phases?.length || 0, 'phases');
    }

    return NextResponse.json({ 
      reply: result.reply,
      plan: result.plan,
      shouldCreatePlan: result.shouldCreatePlan
    });
  } catch (err: any) {
    console.error(' API error:', err);
    return NextResponse.json({ 
      error: err.message || 'Internal error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}