import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export type PlannerResult = {
  nodes: Array<{
    id: string;
    type?: string;
    label: string;
    description?: string;
    files?: string[];
    x?: number;
    y?: number;
    status?: 'pending'|'completed'|'in-progress';
    children?: string[];
  }>;
  edges?: Array<{ id: string; source: string; target: string; animated?: boolean }>;
};

// Simple prompt to ask the model to generate a plan JSON for reactflow-style nodes
export async function generatePlanFromQuery(query: string, context = ""): Promise<PlannerResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `You are a planning assistant that outputs JSON only. Output a JSON object with "nodes" and optional "edges".
Nodes should have fields: id, type (start|phase|step), label, description, files (optional array), children (optional), x, y, status.
Edges should have fields: id, source, target, animated (optional).
Return the smallest, valid JSON only (no explanation).

User query: ${query}

Context:
${context}

Create a clear plan split into phases and steps. Keep labels short. Provide coordinates (x,y) roughly for layout, but it's ok if approximate.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Try to parse directly
    try {
      const parsed = JSON.parse(text);
      return parsed as PlannerResult;
    } catch (err) {
      // best-effort: try to extract JSON block
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as PlannerResult;
      }
      throw new Error("Planner returned non-JSON response");
    }
  } catch (error) {
    console.error('Error generating plan:', error);
    throw new Error(`Failed to generate plan: ${error}`);
  }
}