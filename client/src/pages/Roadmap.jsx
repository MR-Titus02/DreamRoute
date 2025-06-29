import React, { useEffect, useState } from "react";
import { fetchRoadmap } from "@/api/roadmap";
import { useAuth } from "@/context/AuthContext";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { Button } from "@/components/ui/button";

const STATUS_COLORS = {
  not_started: { bg: "#1E293B", border: "#475569", text: "#94a3b8" }, // gray
  ongoing: { bg: "#312e81", border: "#6366f1", text: "#a5b4fc" }, // indigo
  done: { bg: "#064e3b", border: "#10b981", text: "#6ee7b7" }, // green
};

function getNextStatus(current) {
  if (current === "not_started") return "ongoing";
  if (current === "ongoing") return "done";
  return "not_started";
}

export default function Roadmap() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState([]);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMap, setStatusMap] = useState(() => {
    const saved = localStorage.getItem("timelineStatus");
    return saved ? JSON.parse(saved) : {};
  });
  const [expandedSteps, setExpandedSteps] = useState({});

  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    localStorage.setItem("timelineStatus", JSON.stringify(statusMap));
  }, [statusMap]);

  const loadRoadmap = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    setRoadmap([]);
    setCourses([]);
    setInstitutions([]);
    setCareer("");

    try {
      const { career, roadmap, courses, institutions } = await fetchRoadmap(userId);
      // Flatten roadmap steps if nested inside sections (adjust if your data differs)
      const flatSteps = Array.isArray(roadmap[0]?.steps)
        ? roadmap.flatMap((section) =>
            section.steps.map((step) => ({ ...step, section: section.section }))
          )
        : roadmap;

      setCareer(career);
      setRoadmap(flatSteps);
      setCourses(courses);
      setInstitutions(institutions);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, [userId]);

  const toggleStatus = (id) => {
    const current = statusMap[id] || "not_started";
    const next = getNextStatus(current);
    setStatusMap((prev) => ({ ...prev, [id]: next }));
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation(); // prevent status toggle when clicking expand icon
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-6 text-white max-w-full">
      <h1 className="text-4xl font-bold text-green-400 mb-6 text-center">
        🎯 Career Recommendation: <span className="text-white">{career || "Not available"}</span>
      </h1>

      {loading && (
        <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-300 animate-pulse space-y-4">
          <svg className="animate-spin h-10 w-10 text-purple-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-lg font-medium">Generating your roadmap...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center max-w-2xl mx-auto">
          <p className="mb-3">{error}</p>
          <Button
            className="bg-gradient-to-r from-white to-gray-200 text-red-600 hover:brightness-105"
            onClick={loadRoadmap}
          >
            🔁 Regenerate Roadmap
          </Button>
        </div>
      )}

      {!loading && !error && roadmap.length > 0 && (
        <VerticalTimeline lineColor="#7c3aed" className="max-w-5xl mx-auto">
          {roadmap.map((step, index) => {
            const status = statusMap[step.id] || "not_started";
            const expanded = !!expandedSteps[step.id];

            const colors = STATUS_COLORS[status];
            const contentStyle = {
              background: colors.bg,
              color: colors.text,
              borderTop: `3px solid ${colors.border}`,
              cursor: "pointer",
              transition: "all 0.3s ease",
            };
            const contentArrowStyle = { borderRight: `7px solid ${colors.bg}` };

            return (
              <VerticalTimelineElement
                key={step.id}
                date={step.section || ""}
                iconStyle={{
                  background: colors.border,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  userSelect: "none",
                }}
                icon={
                  step.milestone ? (
                    <span role="img" aria-label="milestone">
                      🏁
                    </span>
                  ) : (
                    index + 1
                  )
                }
                contentStyle={contentStyle}
                contentArrowStyle={contentArrowStyle}
                onClick={() => toggleStatus(step.id)}
                className="select-none"
              >
                <div className="flex justify-between items-center">
                  <h3 className="vertical-timeline-element-title text-xl font-semibold">
                    {step.label}
                  </h3>
                  <button
                    onClick={(e) => toggleExpand(step.id, e)}
                    className="text-indigo-300 font-bold text-xl select-text focus:outline-none"
                    aria-label={expanded ? "Collapse details" : "Expand details"}
                    title={expanded ? "Collapse details" : "Expand details"}
                  >
                    {expanded ? "−" : "+"}
                  </button>
                </div>

                <h4 className="vertical-timeline-element-subtitle text-indigo-300 mb-2">
                  Estimated Time: {step.estimatedTime || "N/A"}
                </h4>
                <p className="text-gray-300 whitespace-pre-line">{step.description}</p>

                {expanded && step.details && Array.isArray(step.details) && (
                  <ul className="ml-6 mt-3 text-sm space-y-2 border-l-2 border-indigo-600 pl-4">
                    {step.details.map((sub) => (
                      <li
                        key={sub.id}
                        className="bg-[#222c3c] p-2 rounded hover:bg-[#3b4758] transition cursor-default select-text"
                        title={sub.description}
                      >
                        <strong className="text-indigo-300">{sub.label}</strong>: {sub.description}
                      </li>
                    ))}
                  </ul>
                )}

                {expanded && step.details && typeof step.details === "string" && (
                  <div className="mt-3 text-sm text-gray-400 whitespace-pre-line">
                    {step.details}
                  </div>
                )}

                <p className="mt-3 text-xs italic text-indigo-300 select-none">
                  Status:{" "}
                  <span className="font-semibold">
                    {status === "not_started"
                      ? "Not Started"
                      : status === "ongoing"
                      ? "Ongoing"
                      : "Done"}
                  </span>{" "}
                  (Click card to change status, click + to expand)
                </p>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      )}

      {!loading && courses.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          🎓 Recommended Courses & Institutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const inst = institutions.find((i) => i.id === course.institution_id);
            return (
              <div
                key={course.id}
                className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                  {course.description}
                </p>
      
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-indigo-700 text-xs text-white px-2 py-1 rounded-full">
                    {course.duration || "Flexible Duration"}
                  </span>
                  <span className="bg-green-600 text-xs text-white px-2 py-1 rounded-full">
                    ₹{course.price || "0"}
                  </span>
                </div>
      
                {inst && (
                  <div className="flex items-center mt-2 gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {inst.name[0]}
                    </div>
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-white">{inst.name}</p>
                      <p className="text-xs text-gray-400">{inst.address}</p>
                    </div>
                  </div>
                )}
      
                {/* 🔒 Premium Blur Feature */}
                <div className="mt-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-sm rounded-lg hidden group-hover:flex items-center justify-center transition">
                    <p className="text-white text-sm">
                      🔒 <span className="font-medium">Premium Only</span>
                    </p>
                  </div>
                  <Button className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:brightness-110">
                    Learn More
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>      
      )}
    </div>
  );
}
