export interface ContextItem {
  id: string;
  type: 'file' | 'function' | 'class' | 'variable' | 'dependency';
  name: string;
  path?: string;
  lineNumber?: number;
  relevance?: number;
}

export interface SmartSuggestion {
  id: string;
  type: 'next-step' | 'alternative' | 'optimization' | 'fix';
  title: string;
  description: string;
  confidence: number;
  action?: () => void;
}