import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PLAN_GENERATION_PROMPT } from '../langchain/prompts/system';
import { retrieveRelevant } from './retriever';
import type { FileItem, ExecutionPlan, PlanPhase, PlanStep } from '@/types';

export interface PlanGenerationContext {
  userQuery: string;
  files: FileItem[];
  sessionId: string;
}

export async function generateExecutionPlan(context: PlanGenerationContext): Promise<ExecutionPlan | null> {
  try {
    const llm = new ChatGoogleGenerativeAI({ 
      model: 'gemini-2.5-flash',
      temperature: 0.3,
      apiKey: process.env.GOOGLE_API_KEY
    });

    const relevantDocs = await retrieveRelevant(context.userQuery, context.sessionId, 5);
    const codeContext = relevantDocs.length > 0
      ? relevantDocs.map(doc => `From ${doc.metadata.path}:\n${doc.pageContent}`).join('\n\n')
      : 'No existing code context found.';

    const prompt = `${PLAN_GENERATION_PROMPT}

## Current Workspace Context:

### Existing Files:
${context.files.map(f => `- ${f.path} (${f.language})`).join('\n')}

### Relevant Code Context:
${codeContext}

---

## User Request:
${context.userQuery}

---

Now generate a detailed, structured execution plan following the format above. Include actual working code in the steps.`;

    console.log('Generating execution plan for:', context.userQuery);

    const response = await llm.invoke(prompt);
    const planText = response.content.toString();

    console.log('Raw plan generated, length:', planText.length);

    const plan = parseStructuredPlan(planText, context.userQuery);
    
    if (plan) {
      console.log(` Parsed plan: ${plan.phases.length} phases, ${plan.phases.reduce((sum, p) => sum + p.steps.length, 0)} total steps`);
    }

    return plan;
  } catch (error) {
    console.error(' Error generating execution plan:', error);
    return null;
  }
}

function parseStructuredPlan(planText: string, userQuery: string): ExecutionPlan | null {
  const lines = planText.split('\n');
  
  let title = '';
  let description = '';
  const phases: PlanPhase[] = [];
  let currentPhase: Partial<PlanPhase> | null = null;
  let currentStep: Partial<PlanStep> | null = null;
  let phaseOrder = 0;
  let stepOrder = 0;
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract title
    if (line.startsWith('PLAN:') && !title) {
      title = line.replace('PLAN:', '').trim();
      continue;
    }

    // Extract description
    if (line.startsWith('DESCRIPTION:') && !description) {
      description = line.replace('DESCRIPTION:', '').trim();
      continue;
    }

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLanguage = line.replace('```', '').trim() || 'typescript';
        codeBlockContent = '';
      } else {
        inCodeBlock = false;
        // Add code to current step
        if (currentStep) {
          if (!currentStep.codeChanges) {
            currentStep.codeChanges = [];
          }
          const file = currentStep.files?.[0] || `generated-${Date.now()}.${getExtensionForLanguage(codeBlockLanguage)}`;
          currentStep.codeChanges.push({
            id: `change-${Date.now()}-${Math.random()}`,
            stepId: 'temp',
            file,
            language: codeBlockLanguage,
            changeType: 'create',
            content: codeBlockContent.trim(),
            applied: false,
          });
        }
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    // Parse PHASE headers
    const phaseMatch = line.match(/^PHASE\s+(\d+):\s*(.+)/i);
    if (phaseMatch) {
      // Save previous phase
      if (currentPhase && currentPhase.label) {
        const steps = currentPhase.steps || [];
        phases.push({
          id: `phase-${Date.now()}-${phaseOrder}`,
          planId: 'temp',
          label: currentPhase.label,
          description: currentPhase.description || '',
          status: 'pending',
          order: phaseOrder,
          estimatedTime: currentPhase.estimatedTime,
          steps: steps as PlanStep[],
          expanded: phaseOrder === 0,
        });
      }

      currentPhase = {
        label: phaseMatch[2].trim(),
        description: '',
        estimatedTime: '',
        steps: [],
      };
      phaseOrder++;
      stepOrder = 0;
      continue;
    }

    // Parse phase metadata
    if (currentPhase && line.startsWith('- Estimated time:')) {
      currentPhase.estimatedTime = line.replace('- Estimated time:', '').trim();
      continue;
    }

    if (currentPhase && line.startsWith('- Description:')) {
      currentPhase.description = line.replace('- Description:', '').trim();
      continue;
    }

    // Parse STEP headers
    const stepMatch = line.match(/^STEP\s+[\d.]+:\s*(.+)/i);
    if (stepMatch) {
      // Save previous step
      if (currentStep && currentStep.label && currentPhase) {
        if (!currentPhase.steps) currentPhase.steps = [];
        currentPhase.steps.push({
          id: `step-${Date.now()}-${phaseOrder}-${stepOrder}`,
          phaseId: 'temp',
          label: currentStep.label,
          description: currentStep.description || '',
          status: 'pending',
          order: stepOrder,
          type: currentStep.type || 'code',
          files: currentStep.files || [],
          codeChanges: currentStep.codeChanges || [],
          expanded: false,
        });
      }

      currentStep = {
        label: stepMatch[1].trim(),
        description: '',
        type: 'code',
        files: [],
        codeChanges: [],
      };
      stepOrder++;
      continue;
    }

    // Parse step metadata
    if (currentStep) {
      if (line.startsWith('- Type:')) {
        const typeStr = line.replace('- Type:', '').trim().toLowerCase();
        currentStep.type = typeStr as PlanStep['type'];
      } else if (line.startsWith('- Files:')) {
        const filesStr = line.replace('- Files:', '').trim();
        currentStep.files = filesStr.split(',').map(f => f.trim()).filter(Boolean);
      } else if (line.startsWith('- Action:')) {
        currentStep.description = line.replace('- Action:', '').trim();
      }
    }
  }

  // Save last step and phase
  if (currentStep && currentStep.label && currentPhase) {
    if (!currentPhase.steps) currentPhase.steps = [];
    currentPhase.steps.push({
      id: `step-${Date.now()}-${phaseOrder}-${stepOrder}`,
      phaseId: 'temp',
      label: currentStep.label,
      description: currentStep.description || '',
      status: 'pending',
      order: stepOrder,
      type: currentStep.type || 'code',
      files: currentStep.files || [],
      codeChanges: currentStep.codeChanges || [],
      expanded: false,
    });
  }

  if (currentPhase && currentPhase.label) {
    phases.push({
      id: `phase-${Date.now()}-${phaseOrder}`,
      planId: 'temp',
      label: currentPhase.label,
      description: currentPhase.description || '',
      status: 'pending',
      order: phaseOrder,
      estimatedTime: currentPhase.estimatedTime,
      steps: (currentPhase.steps || []) as PlanStep[],
      expanded: phaseOrder === 0,
    });
  }

  if (phases.length === 0) {
    console.warn('⚠️ No phases parsed from plan');
    return null;
  }

  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const filesAffected = Array.from(new Set(
    phases.flatMap(p => p.steps.flatMap(s => s.files || []))
  ));

  return {
    id: 'temp',
    title: title || userQuery.substring(0, 50),
    description: description || `Execution plan for: ${userQuery}`,
    status: 'draft',
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    phases,
    metadata: {
      totalSteps,
      completedSteps: 0,
      filesAffected,
      estimatedTime: phases.map(p => p.estimatedTime).filter(Boolean).join(' + '),
    },
  };
}

function getExtensionForLanguage(language: string): string {
  const map: Record<string, string> = {
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
    bash: 'sh',
    shell: 'sh',
  };
  return map[language.toLowerCase()] || 'txt';
}