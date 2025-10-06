import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { ExecutionPlan } from '@/types';
import { AGENT_PLAN_PROMPT } from '@/services/langchain/prompts/agent';

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json() as { plan: ExecutionPlan };
    
    if (!plan) {
      return NextResponse.json({ error: 'plan required' }, { status: 400 });
    }

    const allSteps = plan.phases.flatMap(p => p.steps);
    const approvedSteps = allSteps.filter(s => s.status === 'approved');
    const skippedSteps = allSteps.filter(s => s.status === 'skipped');

    const planContext = {
      title: plan.title,
      description: plan.description,
      totalSteps: allSteps.length,
      approvedCount: approvedSteps.length,
      skippedCount: skippedSteps.length,
      phases: plan.phases.map(phase => ({
        label: phase.label,
        description: phase.description,
        steps: phase.steps.map(step => ({
          label: step.label,
          description: step.description,
          status: step.status,
          type: step.type,
          files: step.files,
          codeChanges: step.codeChanges?.map(cc => ({
            file: cc.file,
            language: cc.language,
            content: cc.content
          }))
        }))
      }))
    };

    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash-exp',
      temperature: 0.2,
      apiKey: process.env.GOOGLE_API_KEY,
      maxOutputTokens: 8192,
    });

    const prompt = `${AGENT_PLAN_PROMPT}

## Original Plan Details:
\`\`\`json
${JSON.stringify(planContext, null, 2)}
\`\`\`

Generate the agent-friendly execution plan now:`;

    console.log('Generating agent-friendly plan...');
    
    const response = await llm.invoke(prompt);
    const agentPlan = response.content.toString();

    console.log(' Agent plan generated, length:', agentPlan.length);

    return NextResponse.json({ 
      success: true,
      agentPlan,
      metadata: {
        totalSteps: allSteps.length,
        approvedSteps: approvedSteps.length,
        skippedSteps: skippedSteps.length
      }
    });
  } catch (err: any) {
    console.error(' Complete plan API error:', err);
    return NextResponse.json({ 
      error: err.message || 'Failed to complete plan',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}