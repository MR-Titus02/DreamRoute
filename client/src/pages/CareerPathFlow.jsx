import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, { Background, Controls, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

const NODE_WIDTH = 280;
const NODE_HEIGHT = 140;

function CustomNode({ data }) {
  const { label, description } = data;

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "2px solid #7c3aed",
        background: "#1E293B",
        color: "#E2E8F0",
        minWidth: NODE_WIDTH,
        maxWidth: NODE_WIDTH,
        height: NODE_HEIGHT,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: "#7c3aed",
          borderRadius: "50%",
          width: 10,
          height: 10,
        }}
      />
      <div>
        <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8, color: "#A78BFA" }}>
          {label}
        </div>
        <div style={{ fontSize: 14, opacity: 0.9, whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
          {description}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: "#7c3aed",
          borderRadius: "50%",
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}

const nodeTypes = { customNode: CustomNode };

export default function CareerRoadmapReactFlow() {
  const { user } = useAuth();
  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoadmap = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
  
    try {
      const res = await axios.get(`http://localhost:5000/api/career/${userId}`);
      if (res.data.type !== "reactflow") throw new Error("Invalid roadmap format.");
  
      const { nodes: rawNodes, edges: rawEdges, career: careerTitle } = res.data.content;
  
      const preparedNodes = rawNodes.map((node, index) => ({
        ...node,
        id: String(node.id),
        type: "customNode",
        data: {
          ...node.data,
          label: node.data.label || `Step ${index + 1}`,
          description: node.data.description || "Career path step",
        },
        style: { width: NODE_WIDTH, height: NODE_HEIGHT },
      }));
  
      const preparedEdges = rawEdges.map((edge, index) => ({
        id: `e${edge.source}-${edge.target}-${index}`,
        source: String(edge.source),
        target: String(edge.target),
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "smoothstep",
        animated: true,
        style: { stroke: "#7c3aed", strokeWidth: 2 },
        markerEnd: { type: "arrowclosed", color: "#7c3aed", width: 20, height: 20 },
      }));
  
      setCareer(careerTitle);
      setNodes(preparedNodes);
      setEdges(preparedEdges);
    } catch (err) {
      // If not found, generate new roadmap
      if (err.response?.status === 404) {
        try {
          console.warn("No saved roadmap found. Generating a new one...");
          await axios.post("http://localhost:5000/api/career/generate", { userId });
          await fetchRoadmap(); // Try again after generating
          return;
        } catch (generateErr) {
          console.error("Failed to generate new roadmap:", generateErr);
          setError("Failed to generate a new roadmap.");
          return;
        }
      }
  
      console.error("Fetch error:", err);
      setError("Failed to load roadmap.");
    } finally {
      setLoading(false);
    }
  }, [userId]);
  

  const regenerateRoadmap = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:5000/api/career/generate", { userId });
      await fetchRoadmap();
    } catch (err) {
      console.error("Regenerate error:", err);
      setError("Failed to regenerate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-green-400 mb-2">
            🎯 Career Path: <span className="text-white">{career}</span>
          </h1>
          <p className="text-center text-indigo-300 text-sm mb-6">
            Interactive visualization of your career progression
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[300px] animate-pulse text-gray-300 space-y-4">
              <LoaderCircle className="animate-spin w-10 h-10 text-purple-500" />
              <p className="text-lg font-medium">Building your career map...</p>
            </div>
          ) : error ? (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center max-w-2xl mx-auto">
              <p className="mb-3">{error}</p>
              <Button
                className="bg-gradient-to-r from-white to-gray-200 text-red-600 hover:brightness-105"
                onClick={fetchRoadmap}
              >
                🔁 Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="w-full h-[750px] bg-[#0f172a] border border-[#334155] rounded-xl p-2 shadow-xl">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  fitView
                  panOnDrag
                  zoomOnScroll
                  nodeTypes={nodeTypes}
                  attributionPosition="bottom-left"
                  nodesDraggable={true}
                  nodesConnectable={false}
                  defaultEdgeOptions={{
                    animated: true,
                    type: "smoothstep",
                    style: { stroke: "#7c3aed", strokeWidth: 2 },
                    markerEnd: { type: "arrowclosed", color: "#7c3aed" },
                  }}
                >
                  <Controls
                    style={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #334155",
                      borderRadius: "4px",
                    }}
                  />
                  <Background gap={24} size={1} color="#334155" variant="dots" />
                </ReactFlow>
              </div>

              <div className="flex justify-center mt-6 space-x-4">
                <Button
                  onClick={regenerateRoadmap}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition shadow-lg"
                >
                  🔄 Regenerate Map
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition shadow-lg"
                >
                  🖨️ Print Roadmap
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
