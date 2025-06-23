import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start: Explore Interests' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Learn HTML/CSS/JS' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Build Projects' },
    position: { x: 400, y: 100 },
  },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }];

export default function Roadmap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="min-h-screen bg-[#1E293B] p-6">
      <Card className="bg-[#3B4758] text-white shadow-xl p-4 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Your Personalized Career Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300">
          Based on your interests and skills, this roadmap outlines your path to a successful career.
          You can zoom, pan, and interact with each step.
        </CardContent>
      </Card>

      <div className="bg-[#334155] rounded-xl p-4 shadow-lg h-[600px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodesDraggable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
