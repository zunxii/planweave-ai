import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { planId, stepId, instruction } = await req.json();
    if (!planId || !stepId || !instruction) {
      return NextResponse.json({ error: 'planId, stepId, instruction required' }, { status: 400 });
    }

    // Placeholder: In the future, invoke an AI function to mutate step
    // For now, return a minimal update (e.g., append to description)
    const updatedStep = {
      id: stepId,
      description: `Updated: ${instruction}`,
    };

    return NextResponse.json({ step: updatedStep });
  } catch (err: any) {
    console.error('Edit step API error:', err);
    return NextResponse.json({ error: err.message || 'failed' }, { status: 500 });
  }
}


