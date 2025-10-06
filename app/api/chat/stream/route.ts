import { NextRequest } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SYSTEM_PROMPT } from '@/services/langchain/prompts/system';
import { retrieveRelevant } from '@/services/ai/retriever';
import { generateExecutionPlan } from '@/services/ai/planGenerator';
import type { FileItem } from '@/types';

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

export async function POST(req: NextRequest) {
  const { sessionId, message, files } = await req.json() as {
    sessionId: string;
    message: string;
    files: FileItem[];
  };

  if (!sessionId || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendData = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const needsPlan = shouldGeneratePlan(message);

        if (needsPlan) {
          sendData({ 
            type: 'status', 
            message: 'Analyzing request and generating execution plan...' 
          });

          const plan = await generateExecutionPlan({
            userQuery: message,
            files: files || [],
            sessionId
          });

          if (plan) {
            sendData({ 
              type: 'status', 
              message: 'Plan generated! Creating conversational response...' 
            });
            const retrieved = await retrieveRelevant(message, sessionId, 5);
            const retrievedText = retrieved.length > 0
              ? retrieved.map(r => `From ${r.metadata.path}:\n${r.pageContent}`).join('\n\n')
              : 'No relevant code context found.';

            const filesContext = files.length > 0
              ? files.map(f => `File: ${f.path} (${f.language})`).join('\n')
              : 'No files in workspace.';

            const llm = new ChatGoogleGenerativeAI({
              model: 'gemini-2.0-flash-exp',
              temperature: 0.3,
              apiKey: process.env.GOOGLE_API_KEY,
              streaming: true,
            });

            const conversationalPrompt = `${SYSTEM_PROMPT}

Current Workspace Files:
${filesContext}

Relevant Code Context:
${retrievedText}

User Message: ${message}

I've created a detailed execution plan for this task. Please provide a brief, friendly summary (2-3 sentences) explaining what the plan will accomplish and encourage the user to check the Canvas view to see the step-by-step breakdown. Be conversational and helpful.`;

            const streamResponse = await llm.stream(conversationalPrompt);
            
            for await (const chunk of streamResponse) {
              const text = chunk.content.toString();
              sendData({ type: 'token', content: text });
            }

            sendData({ 
              type: 'plan', 
              plan,
              shouldCreatePlan: true 
            });

            sendData({ type: 'done' });
            controller.close();
            return;
          }
        }

        sendData({ 
          type: 'status', 
          message: 'Searching codebase...' 
        });

        const retrieved = await retrieveRelevant(message, sessionId, 5);
        const retrievedText = retrieved.length > 0
          ? retrieved.map(r => `From ${r.metadata.path}:\n${r.pageContent}`).join('\n\n')
          : 'No relevant code context found.';

        const filesContext = files.length > 0
          ? files.map(f => `File: ${f.path} (${f.language})\n\`\`\`${f.language}\n${f.content.substring(0, 500)}...\n\`\`\``).join('\n\n')
          : 'No files in workspace.';

        const prompt = `${SYSTEM_PROMPT}

Current Workspace Files:
${filesContext}

Relevant Code Snippets (from vector search):
${retrievedText}

User Message:
${message}

Please provide a helpful response based on the code context above. If you're suggesting changes, be specific about which file and what changes to make. Use code blocks with appropriate language tags.`;

        sendData({ 
          type: 'status', 
          message: 'Generating response...' 
        });

        const llm = new ChatGoogleGenerativeAI({
          model: 'gemini-2.0-flash-exp',
          temperature: 0.3,
          apiKey: process.env.GOOGLE_API_KEY,
          streaming: true,
        });

        const streamResponse = await llm.stream(prompt);
        
        for await (const chunk of streamResponse) {
          const text = chunk.content.toString();
          sendData({ type: 'token', content: text });
        }

        sendData({ type: 'done' });
        controller.close();

      } catch (error: any) {
        console.error(' Stream error:', error);
        sendData({ 
          type: 'error', 
          error: error.message || 'An error occurred' 
        });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}