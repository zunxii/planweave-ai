import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

const chainMap = new Map<string, any>();

export async function getChainForSession(sessionId: string) {
  if (chainMap.has(sessionId)) return chainMap.get(sessionId);

  const llm = new ChatGoogleGenerativeAI({ 
    model: 'gemini-2.0-flash-exp',
    temperature: 0.1,
    apiKey: process.env.GOOGLE_API_KEY,
    maxOutputTokens: 8192,
  });
  
  const memory = new BufferMemory({ 
    returnMessages: true,
    memoryKey: 'history',
    inputKey: 'input',
    outputKey : 'response'
  });

  const chain = new ConversationChain({ 
    llm, 
    memory, 
    verbose: process.env.NODE_ENV === 'development'
  });
  
  chainMap.set(sessionId, chain);

  return chain;
}

export function clearChainForSession(sessionId: string) {
  chainMap.delete(sessionId);
  console.log(` Cleared chain for session: ${sessionId}`);
}

export function clearAllChains() {
  chainMap.clear();
  console.log('Cleared all chains');
}