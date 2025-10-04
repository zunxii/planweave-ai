import { getChainForSession } from './chainManager';
import { SYSTEM_PROMPT } from './prompts/system';
import { retrieveRelevant, indexFiles } from '@/services/ai/retriever';
import type { FileItem } from '@/types/planweave';

export async function runRag(sessionId: string, userMessage: string, files: FileItem[] = []) {
  const chain = await getChainForSession(sessionId);

  if (files.length > 0) {
    await indexFiles(files, sessionId);
  }

  const retrieved = await retrieveRelevant(userMessage, sessionId, 5);

  const retrievedText = retrieved.length > 0
    ? retrieved.map(r => `From ${r.metadata.path}:\n${r.pageContent}`).join('\n\n')
    : 'No relevant code context found.';

  const filesContext = files.length > 0
    ? files.map(f => `File: ${f.path} (${f.language})\n\`\`\`${f.language}\n${f.content}\n\`\`\``).join('\n\n')
    : 'No files in workspace.';

  const prompt = `
${SYSTEM_PROMPT}

Current Workspace Files:
${filesContext}

Relevant Code Snippets (from vector search):
${retrievedText}

User Message:
${userMessage}

Please provide a helpful response based on the code context above. If you're suggesting changes, be specific about which file and what changes to make.
  `;

  console.log('Prompt length:', prompt.length);
  console.log('Retrieved contexts:', retrieved.length);

  try {
    const res = await chain.call({ input: prompt });
    return res.text || res.output || res.response || 'Sorry, I could not generate a response.';
  } catch (error: any) {
    console.error('RAG chain error:', error);
    return `Error: ${error.message}`;
  }
}