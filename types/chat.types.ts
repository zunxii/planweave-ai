import { ExecutionPlan } from './plan.types';
import { CodeBlock } from './editor.types';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  planUpdate?: boolean;
  type?: 'text' | 'plan' | 'code' | 'mixed';
  plan?: ExecutionPlan;
  codeBlocks?: CodeBlock[];
  isStreaming?: boolean;  
  status?: string;        
}

export interface ChatState {
  messages: Message[];
  isThinking: boolean;
  sessionId: string | null;
}