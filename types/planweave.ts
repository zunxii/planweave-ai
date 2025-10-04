export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  planUpdate?: boolean;
}

export interface PlanNode {
  id: string;
  type: 'start' | 'phase' | 'step';
  label: string;
  description?: string;
  x: number;
  y: number;
  children?: string[];
  files?: string[];
  expanded?: boolean;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface FileItem {
  name: string;
  path: string;
  content: string;
  language: string;
}