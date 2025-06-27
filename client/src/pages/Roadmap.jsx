import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { fetchRoadmap } from "@/api/roadmap"; // API call
import "reactflow/dist/style.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext"; // 

export default function Roadmap() {
  const { user } = useAuth(); 
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!userId) return; 

    async function loadRoadmap() {
      try {
        const { roadmap, courses, institutions } = await fetchRoadmap(userId);

        const newNodes = roadmap.map((step, index) => ({
          id: step.id.toString(),
          data: { label: step.label },
          position: { x: 200 * (index % 3), y: 100 * Math.floor(index / 3) },
        }));

        const newEdges = roadmap.slice(1).map((step, i) => ({
          id: `e${roadmap[i].id}-${step.id}`,
          source: roadmap[i].id.toString(),
          target: step.id.toString(),
        }));

        setNodes(newNodes);
        setEdges(newEdges);
        setCourses(courses);
        setInstitutions(institutions);
      } catch (error) {
        console.error("Failed to load roadmap:", error);
      }
    }

    loadRoadmap();
  }, [userId]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div className="min-h-screen bg-[#1E293B] p-6">
      <Card className="bg-[#3B4758] text-white shadow-xl p-4 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Your Personalized Career Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300">
          Based on your profile, the roadmap below outlines your suggested path. Scroll down to see matched courses and institutions.
        </CardContent>
      </Card>

      <div className="bg-[#334155] rounded-xl p-4 shadow-lg h-[600px]">
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
          <Background variant="dots" gap={16} size={1} />
        </ReactFlow>
      </div>

      <div className="mt-8 text-white">
        <h2 className="text-xl font-bold mb-2">Recommended Courses</h2>
        <ul className="list-disc ml-6">
          {courses.map((c) => (
            <li key={c.id}>{c.name} - {c.description}</li>
          ))}
        </ul>

        <h2 className="text-xl font-bold mt-4 mb-2">Suggested Institutions</h2>
        <ul className="list-disc ml-6">
          {institutions.map((i) => (
            <li key={i.id}>{i.name} ({i.location})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
