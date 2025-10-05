import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

const chainMap = new Map<string, any>();

export async function getChainForSession(sessionId: string) {
  if (chainMap.has(sessionId)) return chainMap.get(sessionId);

  const llm = new ChatGoogleGenerativeAI({ 
    model: 'gemini-2.5-flash',
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY
  });
  
  const memory = new BufferMemory({ returnMessages: true });

  const chain = new ConversationChain({ llm, memory, verbose: false });
  chainMap.set(sessionId, chain);

  return chain;
}