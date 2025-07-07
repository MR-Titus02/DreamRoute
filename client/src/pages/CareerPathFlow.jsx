import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

const STATUS_COLORS = {
  not_started: { background: "#1E293B", border: "#475569", text: "#CBD5E1" },
  ongoing: { background: "#3730A3", border: "#6366F1", text: "#E0E7FF" },
  done: { background: "#065F46", border: "#10B981", text: "#BBF7D0" },
};

function getNextStatus(current) {
  if (current === "not_started") return "ongoing";
  if (current === "ongoing") return "done";
  return "not_started";
}

function StatusNode({ id, data }) {
  const { label, description, status, onToggleStatus } = data;
  const colors = STATUS_COLORS[status] || STATUS_COLORS.not_started;

  return (
    <div
      onClick={() => onToggleStatus(id)}
      style={{
        padding: 14,
        borderRadius: 12,
        border: `2px solid ${colors.border}`,
        background: colors.background,
        color: colors.text,
        cursor: "pointer",
        minWidth: 240,
        maxWidth: 280,
        userSelect: "none",
        fontSize: 14,
        boxShadow: `0 0 14px ${colors.border}88`,
        whiteSpace: "normal",
        overflowWrap: "break-word",
        transition: "all 0.3s ease",
      }}
      title="Click to toggle status"
    >
      <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, opacity: 0.9, whiteSpace: "pre-wrap" }}>{description}</div>
      <div className="mt-2 text-xs italic text-indigo-300 select-none">
        Status:{" "}
        <span className="font-semibold">
          {status === "not_started"
            ? "Not Started"
            : status === "ongoing"
            ? "Ongoing"
            : "Done"}
        </span>
      </div>
    </div>
  );
}

const nodeTypes = { statusNode: StatusNode };

export default function CareerRoadmapReactFlow() {
  const { user } = useAuth();
  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMap, setStatusMap] = useState(() => {
    const saved = localStorage.getItem("careerRoadmapStatus");
    return saved ? JSON.parse(saved) : {};
  });

  const handleToggleStatus = useCallback((nodeId) => {
    setStatusMap((prev) => {
      const current = prev[nodeId] || "not_started";
      const next = getNextStatus(current);
      const updated = { ...prev, [nodeId]: next };
      localStorage.setItem("careerRoadmapStatus", JSON.stringify(updated));

      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, status: next } } : node
        )
      );

      return updated;
    });
  }, []);

  const fetchRoadmap = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:5000/api/career", { userId });

      if (res.data.type !== "reactflow") {
        setError("Invalid roadmap format.");
        setLoading(false);
        return;
      }

      const { nodes: rawNodes, edges: rawEdges, career: careerTitle } = res.data.content;

      const preparedNodes = rawNodes.map((node) => ({
        ...node,
        type: "statusNode",
        data: {
          ...node.data,
          status: statusMap[node.id] || "not_started",
          onToggleStatus: handleToggleStatus,
        },
        position: node.position || { x: 0, y: 0 },
      }));

      const preparedEdges = rawEdges.map(({ id, source, target }) => ({
        id,
        source,
        target,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#7c3aed",
          strokeWidth: 3,
        },
        markerEnd: {
          type: "arrowclosed",
          color: "#a78bfa",
          width: 20,
          height: 20,
        },
      }));

      setCareer(careerTitle);
      setNodes(preparedNodes);
      setEdges(preparedEdges);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [userId, statusMap, handleToggleStatus]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  useEffect(() => {
    localStorage.setItem("careerRoadmapStatus", JSON.stringify(statusMap));
  }, [statusMap]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6">
      <h1 className="text-4xl font-bold text-center text-green-400 mb-2">
          🎯 Career Goal <span className="text-white">{career}</span>
        </h1>
        <p className="text-center text-indigo-300 text-sm mb-6">
          Visual roadmap with branching paths, click nodes to track your progress.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] animate-pulse text-gray-300 space-y-4">
            <LoaderCircle className="animate-spin w-10 h-10 text-purple-500" />
            <p className="text-lg font-medium">Generating your roadmap...</p>
          </div>
        ) : error ? (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center max-w-2xl mx-auto">
            <p className="mb-3">{error}</p>
            <Button
              className="bg-gradient-to-r from-white to-gray-200 text-red-600 hover:brightness-105"
              onClick={fetchRoadmap}
            >
              🔁 Retry / Regenerate
            </Button>
          </div>
        ) : (
          <>
            <div className="w-full h-[850px] bg-[#1e293b] border border-[#334155] rounded-xl p-2 shadow-lg">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                panOnDrag
                zoomOnScroll
                nodeTypes={nodeTypes}
                attributionPosition="bottom-left"
                nodesDraggable={false}
                nodesConnectable={false}
                defaultEdgeOptions={{
                  animated: true,
                  type: "smoothstep",
                  markerEnd: {
                    type: "arrowclosed",
                    color: "#7c3aed",
                    width: 20,
                    height: 20,
                  },
                  style: {
                    stroke: "#7c3aed",
                    strokeWidth: 3,
                  },
                }}
              >
                <Controls />
                <Background gap={20} size={1.5} color="#475569" />
              </ReactFlow>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={fetchRoadmap}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:brightness-110 transition"
              >
                🔄 Regenerate Roadmap
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
