export type PlannerNode = {
  id: string;
  type?: string;
  label: string;
  description?: string;
  files?: string[];
  x?: number;
  y?: number;
  children?: string[];
  status?: 'pending'|'completed'|'in-progress';
};

export type PlannerResult = {
  nodes: PlannerNode[];
  edges?: Array<{ id:string; source:string; target:string; animated?: boolean }>;
};

export type ChatAPIResponse = {
  reply: string;            
  plan?: PlannerResult;     
  raw?: string;             
};
