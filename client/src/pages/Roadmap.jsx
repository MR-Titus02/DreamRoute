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

      console.log("✅ Career:", career);
      console.log("✅ Roadmap:", roadmap);
      console.log("✅ Institutions:", institutions);
      console.log("📚 Final Courses with institution_id:", courses);

      setCareer(career);
      const newNodes = roadmap.map((step, index) => ({
        id: step.id.toString(),
        data: {
          label: `${step.label}\n(${step.month} month${step.month > 1 ? "s" : ""})`,
        },
        position: { x: 200 * (index % 3), y: 100 * Math.floor(index / 3) },
        style: {
          backgroundColor: "#1E293B",
          color: "#F1F5F9",
          border: "1px solid #475569",
          borderRadius: 12,
          padding: 10,
        },
      }));

      const newEdges = roadmap.slice(1).map((step, i) => ({
        id: `e${roadmap[i].id}-${step.id}`,
        source: roadmap[i].id.toString(),
        target: step.id.toString(),
        animated: true,
        style: { stroke: "#7c3aed" },
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-6 text-white">
      <Card className="bg-[#1E293B] shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-400">
            🎯 Career Recommendation: <span className="text-white">{career || "Not available"}</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-[#1E293B] shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">🧭 Personalized Career Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300">
          This roadmap was generated based on your age, education, skills, and goals.
          It outlines your journey step-by-step.
        </CardContent>
      </Card>

      {loading && (
        <p className="text-gray-400 text-center text-lg mb-6">🚀 Generating your roadmap...</p>
      )}

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
          <p className="mb-3">{error}</p>
          <Button
            className="bg-gradient-to-r from-white to-gray-200 text-red-600 hover:brightness-105"
            onClick={loadRoadmap}
          >
            🔁 Regenerate Roadmap
          </Button>
        </div>
      )}

      {!loading && !error && nodes.length > 0 && (
        <>
          <div className="bg-[#334155] rounded-xl p-4 shadow-xl h-[600px] mb-10">
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
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>

          <div className="grid grid-cols-1 gap-6">
          <Card className="bg-[#1E293B] shadow-md">
          <CardHeader>
  <CardTitle className="text-xl">📚 Recommended Courses</CardTitle>
</CardHeader>
<CardContent className="text-gray-300">
  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {courses.map((c) => {
      const inst = institutions.find(i => i.id === c.institution_id);
      return (
        <li key={c.id} className="bg-[#334155] p-4 rounded-lg shadow hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold text-white mb-2">{c.title}</h3>
          <p className="text-sm text-gray-300 mb-2">{c.description}</p>
          {inst && (
            <div className="text-sm text-gray-400">
              Offered by <span className="text-white font-medium">{inst.name}</span>
            </div>
          )}
        </li>
      );
    })}
  </ul>
</CardContent>
</Card>

          </div>
          
        </>
      )}
    </div>
  );
}
