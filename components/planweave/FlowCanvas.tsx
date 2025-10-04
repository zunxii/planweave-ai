'use client';
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { PlanNode } from '@/types/planweave';
import axios from 'axios';

interface FlowCanvasProps {
  planNodes?: PlanNode[]; // optional - if backend returns flow use that
  onNodeToggle?: (id: string) => void;
}

export function FlowCanvas({ planNodes, onNodeToggle }: FlowCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(false);

  // If you already have planNodes in memory, convert them client-side (quick)
  useEffect(() => {
    if (!planNodes || planNodes.length === 0) return;

    const ns = planNodes.map(n => ({
      id: n.id,
      position: { x: n.x ?? Math.random() * 600, y: n.y ?? Math.random() * 400 },
      data: { label: n.label, description: n.description, files: n.files, status: n.status },
      style: n.type === 'phase' ? { padding: 10, border: '1px solid #666', borderRadius: 8 } : undefined
    }));
    const es = [];
    planNodes.forEach(n => {
      n.children?.forEach(c => es.push({ id: `e-${n.id}-${c}`, source: n.id, target: c }));
    });

    setNodes(ns);
    setEdges(es);
  }, [planNodes]);

  // Optional: if you want server-generated layout, call backend /api/plan with query
  // and setNodes/setEdges from returned flow.flow.
  // Example fetch (uncomment & adapt):
  // useEffect(() => { ... fetch and setNodes/edges ... }, []);

  const onNodesChange = useCallback((changes) => setNodes(ns => applyNodeChanges(changes, ns)), []);
  const onEdgesChange = useCallback((changes) => setEdges(es => applyEdgeChanges(changes, es)), []);
  const onConnect = useCallback((params) => setEdges(es => addEdge(params, es)), []);

  return (
    <div className="p-3 border-b">
      {loading ? <div>Loading flow...</div> : null}
      <div style={{ width: '100%', height: 300 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background gap={12} />
        </ReactFlow>
      </div>
    </div>
  );
}
