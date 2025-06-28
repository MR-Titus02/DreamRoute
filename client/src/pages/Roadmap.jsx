import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { fetchRoadmap } from "@/api/roadmap";
import "reactflow/dist/style.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Roadmap() {
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [career, setCareer] = useState("");

  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  const loadRoadmap = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    setNodes([]);
    setEdges([]);
    setCourses([]);
    setInstitutions([]);

    try {
      
      const { career, roadmap, courses, institutions } = await fetchRoadmap(userId);

      setCareer(career);
      const newNodes = roadmap.map((step, index) => ({
        id: step.id.toString(),
        data: { label: `${step.label}\n(${step.month} month${step.month > 1 ? "s" : ""})` },
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
    } catch (err) {
      console.error("❌ Error fetching roadmap:", err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
          "Something went wrong while generating your roadmap. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, [userId]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div className="min-h-screen bg-[#1E293B] p-6 text-white">
<Card className="bg-[#3B4758] shadow-xl p-4 mb-6">
  <CardHeader>
    <CardTitle className="text-xl">
      Suggested Career Path:{" "}
      <span className="text-green-400">{career || "Not available"}</span>
    </CardTitle>
  </CardHeader>
</Card>
      <Card className="bg-[#3B4758] shadow-xl p-4 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Your Personalized Career Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300">
          Based on your profile, the roadmap below outlines your suggested path. Scroll down to see matched courses and institutions.
        </CardContent>
      </Card>

      {loading && <p className="text-gray-400">🚀 Generating your roadmap...</p>}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          <p className="mb-2">{error}</p>
          <Button className="bg-white text-red-600" onClick={loadRoadmap}>
            🔁 Regenerate Roadmap
          </Button>
        </div>
      )}

      {!loading && !error && nodes.length > 0 && (
        <>
          <div className="bg-[#334155] rounded-xl p-4 shadow-lg h-[600px] mb-8">
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

          <div>
            <h2 className="text-xl font-bold mb-2">Recommended Courses</h2>
            <ul className="list-disc ml-6 text-gray-300">
              {courses.map((c) => (
                <li key={c.id}>{c.title} - {c.description}</li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-4 mb-2">Suggested Institutions</h2>
            <ul className="list-disc ml-6 text-gray-300">
              {institutions.map((i) => (
                <li key={i.id}>{i.name} ({i.address})</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
