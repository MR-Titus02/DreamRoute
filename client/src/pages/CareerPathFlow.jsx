import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";

const STATUS_COLORS = {
  not_started: { background: '#1E293B', border: '#475569', text: '#94a3b8' },
  ongoing: { background: '#312e81', border: '#6366f1', text: '#a5b4fc' },
  done: { background: '#064e3b', border: '#10b981', text: '#6ee7b7' },
};

function getNextStatus(current) {
  if (current === 'not_started') return 'ongoing';
  if (current === 'ongoing') return 'done';
  return 'not_started';
}

// Custom Status Node
function StatusNode({ id, data }) {
  const { label, description, status, onToggleStatus } = data;
  const colors = STATUS_COLORS[status] || STATUS_COLORS.not_started;

  return (
    <div
      onClick={() => onToggleStatus(id)}
      style={{
        padding: 12,
        borderRadius: 10,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.background,
        color: colors.text,
        cursor: 'pointer',
        minWidth: 220,
        maxWidth: 260,
        userSelect: 'none',
        fontSize: 14,
        boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
        whiteSpace: 'normal',
        overflowWrap: 'break-word'
      }}
      title="Click to toggle status"
    >
      <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 12, opacity: 0.85, whiteSpace: 'pre-wrap' }}>{description}</div>
    </div>
  );
}

// Memoized node types (outside component)
const nodeTypes = { statusNode: StatusNode };

export default function CareerRoadmapReactFlow() {
  const { user } = useAuth();
  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMap, setStatusMap] = useState(() => {
    const saved = localStorage.getItem('careerRoadmapStatus');
    return saved ? JSON.parse(saved) : {};
  });

  const handleToggleStatus = useCallback((nodeId) => {
    setStatusMap((prev) => {
      const current = prev[nodeId] || 'not_started';
      const next = getNextStatus(current);
      const updated = { ...prev, [nodeId]: next };
      localStorage.setItem('careerRoadmapStatus', JSON.stringify(updated));

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
        setError("Invalid roadmap format");
        setLoading(false);
        return;
      }

      const { nodes: rawNodes, edges: rawEdges } = res.data.content;

      const preparedNodes = rawNodes.map((node) => ({
        ...node,
        type: 'statusNode',
        data: {
          ...node.data,
          status: statusMap[node.id] || 'not_started',
          onToggleStatus: handleToggleStatus,
        },
        position: node.position || { x: 0, y: 0 },
      }));

      const preparedEdges = rawEdges.map(({ id, source, target, type }) => ({
        id,
        source,
        target,
        type: type || 'smoothstep',
        animated: true,
        style: { stroke: '#00ADB5', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          color: '#00ADB5',
          width: 20,
          height: 20,
        },
      }));
      

      setNodes(preparedNodes);
      setEdges(preparedEdges);
    } catch (err) {
      console.error("Failed to load roadmap", err);
      setError(err.response?.data?.error || "Could not load roadmap");
    } finally {
      setLoading(false);
    }
  }, [userId, statusMap, handleToggleStatus]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  if (loading) return <div className="text-center py-10">Loading roadmap...</div>;
  if (error) return (
    <div className="text-center py-10 text-red-600">
      <p>{error}</p>
      <button
        onClick={fetchRoadmap}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Retry / Regenerate
      </button>
    </div>
  );

  return (
    <div className="w-full h-[900px] border rounded-xl p-4 shadow bg-white">
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
            type: 'smoothstep',
            markerEnd: {
              type: 'arrowclosed',
              color: '#00ADB5', 
              width: 20,
              height: 20,
            },
            style: {
              stroke: '#1e40af',
              strokeWidth: 2,
            },
          }}
      >
        <Controls />
        <Background gap={18} size={1} />
      </ReactFlow>
      <div className="text-center mt-4">
        <button
          onClick={fetchRoadmap}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Regenerate Roadmap
        </button>
      </div>
    </div>
  );
}