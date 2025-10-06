import { getChainForSession } from './chainManager';
import { SYSTEM_PROMPT } from './prompts/system';
import { retrieveRelevant, indexFiles } from '@/services/ai/retriever';
import { generateExecutionPlan } from '@/services/ai/planGenerator';
import type { FileItem } from '@/types';

export interface RAGResponse {
  reply: string;
  plan?: any;
  shouldCreatePlan: boolean;
}

// Keywords that indicate user wants to build/create something
const PLAN_TRIGGER_KEYWORDS = [
  'build', 'create', 'implement', 'develop', 'make', 'add', 
  'setup', 'configure', 'generate', 'write', 'code',
  'how to build', 'help me create', 'show me how to',
  'need to implement', 'want to add', 'can you build'
];

function shouldGeneratePlan(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return PLAN_TRIGGER_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

export async function runRag(sessionId: string, userMessage: string, files: FileItem[] = []): Promise<RAGResponse> {
  const chain = await getChainForSession(sessionId);

  // Index files if provided
  if (files.length > 0) {
    await indexFiles(files, sessionId);
  }

  // Check if this is a plan request
  const needsPlan = shouldGeneratePlan(userMessage);

  if (needsPlan) {
    console.log(' Plan request detected, generating structured execution plan...');
    
    try {
      // Generate structured plan
      const plan = await generateExecutionPlan({
        userQuery: userMessage,
        files,
        sessionId
      });

      if (plan) {
        // Also generate a conversational response
        const retrieved = await retrieveRelevant(userMessage, sessionId, 5);
        const retrievedText = retrieved.length > 0
          ? retrieved.map(r => `From ${r.metadata.path}:\n${r.pageContent}`).join('\n\n')
          : 'No relevant code context found.';

        const filesContext = files.length > 0
          ? files.map(f => `File: ${f.path} (${f.language})`).join('\n')
          : 'No files in workspace.';

        const conversationalPrompt = `
${SYSTEM_PROMPT}

Current Workspace Files:
${filesContext}

Relevant Code Context:
${retrievedText}

User Message: ${userMessage}

I've created a detailed execution plan for this task. Please provide a brief, conversational summary (2-3 sentences) explaining what the plan will accomplish and encourage the user to check the Canvas view to see the step-by-step breakdown.
        `;

        const res = await chain.call({ input: conversationalPrompt });
        const reply = res.text || res.output || res.response || 'I\'ve created an execution plan for you. Check the Canvas view to see the detailed steps!';

        return {
          reply,
          plan,
          shouldCreatePlan: true
        };
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      // Fall through to regular RAG if plan generation fails
    }
  }

  // Regular RAG flow for non-plan requests
  const retrieved = await retrieveRelevant(userMessage, sessionId, 5);

  const retrievedText = retrieved.length > 0
    ? retrieved.map(r => `From ${r.metadata.path}:\n${r.pageContent}`).join('\n\n')
    : 'No relevant code context found.';

  const filesContext = files.length > 0
    ? files.map(f => `File: ${f.path} (${f.language})\n\`\`\`${f.language}\n${f.content.substring(0, 500)}...\n\`\`\``).join('\n\n')
    : 'No files in workspace.';

  const prompt = `
${SYSTEM_PROMPT}

Current Workspace Files:
${filesContext}

Relevant Code Snippets (from vector search):
${retrievedText}

User Message:
${userMessage}

Please provide a helpful response based on the code context above. If you're suggesting changes, be specific about which file and what changes to make. Use code blocks with appropriate language tags.
  `;

  console.log(' Regular RAG query, retrieved contexts:', retrieved.length);

  try {
    const res = await chain.call({ input: prompt });
    const reply = res.text || res.output || res.response || 'Sorry, I could not generate a response.';
    
    return {
      reply,
      shouldCreatePlan: false
    };
  } catch (error: any) {
    console.error('RAG chain error:', error);
    return {
      reply: `Error: ${error.message}`,
      shouldCreatePlan: false
    };
  }
}