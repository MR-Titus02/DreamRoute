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
  const [flatRoadmap, setFlatRoadmap] = useState([]);

  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  const loadRoadmap = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    setNodes([]);
    setEdges([]);
    setCourses([]);
    setInstitutions([]);
    setFlatRoadmap([]);

    try {
      const { career, roadmap, courses, institutions } = await fetchRoadmap(userId);

      console.log("✅ Career:", career);
      console.log("✅ Roadmap:", roadmap);
      console.log("✅ Institutions:", institutions);
      console.log("📚 Final Courses with institution_id:", courses);

      setCareer(career);

      // ✅ Flatten roadmap
      const flat = roadmap.flatMap((section) =>
        section.steps.map((step, index) => ({
          ...step,
          section: section.section,
          index,
        }))
      );

      setFlatRoadmap(flat); // Store for later rendering below

      const newNodes = flat.map((step, index) => ({
        id: step.id.toString(),
        data: {
          label: `${step.section}: ${step.label}\n(${step.estimatedTime || "Step"})`,
        },
        position: { x: 250 * (index % 4), y: 150 * Math.floor(index / 4) },

        style: {
          backgroundColor: "#1E293B",
          color: "#F1F5F9",
          border: "1px solid #475569",
          borderRadius: 12,
          padding: 10,
        },
      }));

      const newEdges = flat.slice(1).map((step, i) => ({
        id: `e${flat[i].id}-${step.id}`,
        source: flat[i].id.toString(),
        target: step.id.toString(),
        animated: true,
        style: { stroke: "#7c3aed" },
      }));

      // Clear first
setNodes([]);
setEdges([]);

// Animated build-up of nodes
flat.forEach((step, index) => {
  setTimeout(() => {
    setNodes(prev => [
      ...prev,
      {
        id: step.id.toString(),
        data: {
          label: `${step.section}: ${step.label}\n(${step.estimatedTime || "Step"})`,
        },
        position: { x: 250 * (index % 3), y: 150 * Math.floor(index / 3) }, // 👈 spacing improved
        style: {
          backgroundColor: "#1E293B",
          color: "#F1F5F9",
          border: "1px solid #475569",
          borderRadius: 12,
          padding: 10,
        },
      },
    ]);

    if (index > 0) {
      setEdges(prev => [
        ...prev,
        {
          id: `e${flat[index - 1].id}-${step.id}`,
          source: flat[index - 1].id.toString(),
          target: step.id.toString(),
          animated: true,
          style: { stroke: "#7c3aed" },
        },
      ]);
    }
  }, 200 * index); // 👈 delay per node
});

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
            🎯 Career Recommendation:{" "}
            <span className="text-white">{career || "Not available"}</span>
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
      {loading && (
  <div className="flex flex-col items-center justify-center h-[400px] text-center text-gray-300 animate-pulse space-y-4">
    <svg className="animate-spin h-10 w-10 text-purple-500" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <p className="text-lg font-medium">Crafting your personalized roadmap...</p>
  </div>
)}
      { !error && nodes.length > 0 && (
        <>
          <div className="bg-[#334155] rounded-xl p-4 shadow-xl h-[600px] mb-10" >
            <div className={`transition-opacity duration-500 ${nodes.length > 0 ? 'opacity-100' : 'opacity-0'}`} style={{ height: "600px", width: "100%" }}>
            <ReactFlow
              style={{ height: "100%", width: "100%" }}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              
              <Controls />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
            </div>
          </div>

          {/* Optional: Progress Checklist UI */}
          <Card className="bg-[#1E293B] shadow-md mb-10">
  <CardHeader>
    <CardTitle className="text-xl">✅ Step-by-Step Checklist</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {flatRoadmap.map((step) => (
      <div key={step.id} className="bg-[#334155] p-4 rounded-lg shadow-md flex items-start gap-4">
        <input type="checkbox" className="mt-1" />
        <div>
          <h3 className="text-white font-semibold">{step.section}: {step.label}</h3>
          <p className="text-gray-400 text-sm">{step.description}</p>
          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
            <span>⏱ {step.estimatedTime || "Unspecified"}</span>
            {step.skills?.map((skill) => (
              <span
                key={skill}
                className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </CardContent>
</Card>


          {/* Courses and Institutions */}
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
                      <li
                        key={c.id}
                        className="bg-[#334155] p-4 rounded-lg shadow hover:shadow-lg transition-all"
                      >
                        <h3 className="text-lg font-semibold text-white mb-2">{c.title}</h3>
                        <p className="text-sm text-gray-300 mb-2">{c.description}</p>
                        {inst && (
                          <div className="text-sm text-gray-400">
                            Offered by{" "}
                            <span className="text-white font-medium">{inst.name}</span>
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
