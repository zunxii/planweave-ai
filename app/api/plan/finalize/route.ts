import { NextRequest, NextResponse } from 'next/server';

function planToMarkdown(plan: any): string {
  const lines: string[] = [];
  lines.push(`# Final Plan: ${plan.title || 'Untitled'}`);
  if (plan.description) lines.push('', plan.description);
  lines.push('', `Status: ${plan.status || 'finalized'}`);
  lines.push('', '---');
  (plan.phases || []).forEach((phase: any, idx: number) => {
    lines.push(`
## Phase ${idx + 1}: ${phase.label}`);
    if (phase.description) lines.push('', phase.description);
    const steps = (phase.steps || []).filter((s: any) => s.status === 'approved' || s.status === 'skipped');
    if (steps.length > 0) {
      lines.push('', '### Steps');
      steps.forEach((s: any, sIdx: number) => {
        lines.push(`- ${sIdx + 1}. ${s.label} ${s.status === 'skipped' ? '(skipped)' : ''}`);
        if (s.description) lines.push(`  - Action: ${s.description}`);
        if (Array.isArray(s.files) && s.files.length > 0) lines.push(`  - Files: ${s.files.join(', ')}`);
      });
    }
  });
  lines.push('', '---', '', '> This plan is approved and designed to be fed into a coding agent.');
  return lines.join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();
    if (!plan) return NextResponse.json({ error: 'plan required' }, { status: 400 });
    const markdown = planToMarkdown(plan);
    return NextResponse.json({ markdown });
  } catch (err: any) {
    console.error('Finalize API error:', err);
    return NextResponse.json({ error: err.message || 'failed' }, { status: 500 });
  }
}


