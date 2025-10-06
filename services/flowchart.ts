import type { PlannerResult } from "./ai/planner";

export type RFNode = {
  id: string;
  type?: string;
  data: { label: string; description?: string; files?: string[]; status?: string };
  position: { x: number; y: number };
  style?: React.CSSProperties;
};

export type RFEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
};

export function plannerToReactFlow(plan: PlannerResult): { nodes: RFNode[]; edges: RFEdge[] } {
  const nodes = (plan.nodes || []).map(n => {
    const x = typeof n.x === 'number' ? n.x : Math.random() * 800;
    const y = typeof n.y === 'number' ? n.y : Math.random() * 400;
    return {
      id: n.id,
      type: n.type === 'phase' ? 'default' : 'default',
      data: { label: n.label, description: n.description, files: n.files, status: n.status },
      position: { x, y },
      style: n.type === 'phase' ? { border: '1px solid #666', padding: 6 } : undefined
    } as RFNode;
  });

  const edges = (plan.edges && plan.edges.length > 0)
    ? plan.edges.map(e => ({ id: e.id, source: e.source, target: e.target, animated: !!e.animated }))
    : ([] as RFEdge[]);

  if (edges.length === 0) {
    plan.nodes?.forEach(n => {
      if (n.children?.length) {
        n.children.forEach(childId => {
          edges.push({ id: `e-${n.id}-${childId}`, source: n.id, target: childId, animated: false });
        });
      }
    });
  }

  return { nodes, edges };
}
