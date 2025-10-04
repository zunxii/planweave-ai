import { ChatOpenAI } from '@langchain/openai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

const chainMap = new Map<string, any>();

export async function getChainForSession(sessionId: string) {
  if (chainMap.has(sessionId)) return chainMap.get(sessionId);

  const llm = new ChatOpenAI({ modelName: 'gpt-4o', temperature: 0 });
  const memory = new BufferMemory({ returnMessages: true });

  const chain = new ConversationChain({ llm, memory, verbose: false });
  chainMap.set(sessionId, chain);

  return chain;
}
