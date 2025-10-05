import type { ExecutionPlan, PlanPhase, PlanStep } from '@/types/planweave';

/**
 * Detects if a user message is requesting a plan
 */
export function isPlanRequest(message: string): boolean {
  const planKeywords = [
    'build', 'create', 'implement', 'develop', 'make',
    'add', 'setup', 'configure', 'plan', 'design',
    'how to', 'steps to', 'help me', 'guide'
  ];

  const lowerMessage = message.toLowerCase();
  return planKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Parses AI response and extracts plan structure if present
 */
export function parsePlanFromResponse(aiResponse: string, userQuery: string): ExecutionPlan | null {
  // Try to detect if response contains a structured plan
  const hasPhases = aiResponse.match(/phase \d+:/gi) || 
                    aiResponse.match(/step \d+:/gi) ||
                    aiResponse.match(/\d+\.\s+/g);

  if (!hasPhases || hasPhases.length < 2) {
    return null; // Not a plan response
  }

  try {
    const plan = extractPlanStructure(aiResponse, userQuery);
    return plan;
  } catch (error) {
    console.error('Failed to parse plan:', error);
    return null;
  }
}

/**
 * Extracts structured plan from AI response text
 */
function extractPlanStructure(response: string, query: string): ExecutionPlan {
  const lines = response.split('\n').filter(l => l.trim());
  
  const phases: PlanPhase[] = [];
  let currentPhase: Partial<PlanPhase> | null = null;
  let currentSteps: Partial<PlanStep>[] = [];
  let phaseOrder = 0;
  let stepOrder = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect phase headers
    const phaseMatch = line.match(/^(?:phase|step)\s*(\d+)[:\s]+(.+)/i);
    if (phaseMatch) {
      // Save previous phase if exists
      if (currentPhase) {
        phases.push({
          ...currentPhase,
          id: `phase-${Date.now()}-${phaseOrder}`,
          planId: 'temp',
          order: phaseOrder,
          status: 'pending',
          steps: currentSteps.map((s, idx) => ({
            ...s,
            id: `step-${Date.now()}-${phaseOrder}-${idx}`,
            phaseId: `phase-${Date.now()}-${phaseOrder}`,
            order: idx,
            status: 'pending',
            type: s.type || 'code',
          } as PlanStep)),
          expanded: phaseOrder === 0, // First phase expanded by default
        } as PlanPhase);
      }

      // Start new phase
      currentPhase = {
        label: phaseMatch[2].trim(),
        description: '',
      };
      currentSteps = [];
      phaseOrder++;
      stepOrder = 0;
      continue;
    }

    // Detect sub-steps
    const stepMatch = line.match(/^[-•*]\s+(.+)|^\d+\.\s+(.+)/);
    if (stepMatch && currentPhase) {
      const stepText = (stepMatch[1] || stepMatch[2]).trim();
      
      // Try to extract file mentions
      const fileMatches = stepText.match(/`([^`]+\.[a-z]{2,4})`/gi);
      const files = fileMatches?.map(f => f.replace(/`/g, '')) || [];

      // Detect step type
      let type: PlanStep['type'] = 'code';
      if (stepText.toLowerCase().includes('test')) type = 'test';
      else if (stepText.toLowerCase().includes('review')) type = 'review';
      else if (stepText.toLowerCase().includes('install') || 
               stepText.toLowerCase().includes('run')) type = 'command';
      else if (files.length > 0) type = 'file';

      currentSteps.push({
        label: stepText,
        description: '',
        files,
        type,
      });
      stepOrder++;
      continue;
    }

    // Add to current phase description if it's descriptive text
    if (currentPhase && line && !line.match(/^[#\-*•\d]/)) {
      currentPhase.description = currentPhase.description 
        ? `${currentPhase.description} ${line}`
        : line;
    }
  }

  // Save last phase
  if (currentPhase) {
    phases.push({
      ...currentPhase,
      id: `phase-${Date.now()}-${phaseOrder}`,
      planId: 'temp',
      order: phaseOrder,
      status: 'pending',
      steps: currentSteps.map((s, idx) => ({
        ...s,
        id: `step-${Date.now()}-${phaseOrder}-${idx}`,
        phaseId: `phase-${Date.now()}-${phaseOrder}`,
        order: idx,
        status: 'pending',
        type: s.type || 'code',
      } as PlanStep)),
      expanded: phaseOrder === 0,
    } as PlanPhase);
  }

  // Generate title from query
  const title = query.length > 50 
    ? query.substring(0, 47) + '...' 
    : query;

  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);

  return {
    id: 'temp', // Will be replaced when added to store
    title,
    description: `Generated plan for: ${query}`,
    status: 'draft',
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    phases,
    metadata: {
      totalSteps,
      completedSteps: 0,
      filesAffected: Array.from(new Set(
        phases.flatMap(p => p.steps.flatMap(s => s.files || []))
      )),
    },
  };
}

/**
 * Enhances plan with code changes from AI response
 */
export function enrichPlanWithCode(plan: ExecutionPlan, aiResponse: string): ExecutionPlan {
  // Extract code blocks from response
  const codeBlockRegex = /```(\w+)?\n([\s\S]+?)```/g;
  const codeBlocks: Array<{ language: string; code: string }> = [];
  
  let match;
  while ((match = codeBlockRegex.exec(aiResponse)) !== null) {
    codeBlocks.push({
      language: match[1] || 'typescript',
      code: match[2].trim(),
    });
  }

  if (codeBlocks.length === 0) return plan;

  // Try to associate code blocks with steps
  const enrichedPhases = plan.phases.map(phase => ({
    ...phase,
    steps: phase.steps.map((step, idx) => {
      // Simple heuristic: assign code blocks to steps sequentially
      if (idx < codeBlocks.length && step.type === 'code') {
        const block = codeBlocks[idx];
        const file = step.files?.[0] || `file-${idx}.${getExtensionForLanguage(block.language)}`;
        
        return {
          ...step,
          codeChanges: [{
            id: `change-${Date.now()}-${idx}`,
            stepId: step.id,
            file,
            language: block.language,
            changeType: 'create' as const,
            content: block.code,
            applied: false,
          }],
        };
      }
      return step;
    }),
  }));

  return {
    ...plan,
    phases: enrichedPhases,
  };
}

function getExtensionForLanguage(language: string): string {
  const extensionMap: Record<string, string> = {
    typescript: 'ts',
    javascript: 'js',
    tsx: 'tsx',
    jsx: 'jsx',
    python: 'py',
    rust: 'rs',
    go: 'go',
    java: 'java',
    css: 'css',
    html: 'html',
    json: 'json',
  };
  return extensionMap[language.toLowerCase()] || 'txt';
}