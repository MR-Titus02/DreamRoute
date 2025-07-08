import React, { useEffect, useState } from "react";
import { fetchRoadmap, fetchProgress, updateProgress } from "@/api/roadmap";
import { useAuth } from "@/context/AuthContext";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";

const STATUS_COLORS = {
  not_started: { bg: "#1E293B", border: "#475569", text: "#94a3b8" },
  ongoing: { bg: "#312e81", border: "#6366f1", text: "#a5b4fc" },
  done: { bg: "#064e3b", border: "#10b981", text: "#6ee7b7" },
};

export default function Roadmap() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState([]);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [expandedSteps, setExpandedSteps] = useState({});

  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

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
      const flatSteps = Array.isArray(roadmap[0]?.steps)
        ? roadmap.flatMap((section) =>
            section.steps.map((step) => ({ ...step, section: section.section }))
          )
        : roadmap;
      const progressResponse = await fetchProgress(userId);
      const progressArray = progressResponse?.data || progressResponse;
const progressMap = {};

progressArray.forEach(({ step_id, status }) => {
  progressMap[String(step_id)] = status;
});

setStatusMap(progressMap);
      setCareer(career);
      setRoadmap(flatSteps);
      setCourses(courses);
      setInstitutions(institutions);
      setStatusMap(progressMap);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, [userId]);

  const handleStatusChange = async (stepId, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [stepId]: newStatus }));
    try {
      await updateProgress({ userId, stepId, status: newStatus });
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Navbar />
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
              const colors = STATUS_COLORS[status] || STATUS_COLORS["not_started"];

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
                  contentStyle={{
                    background: colors.bg,
                    color: colors.text,
                    borderTop: `3px solid ${colors.border}`,
                    transition: "all 0.3s ease",
                  }}
                  contentArrowStyle={{ borderRight: `7px solid ${colors.bg}` }}
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

                  <div className="mt-4">
                    <label
                      htmlFor={`status-${step.id}`}
                      className="text-sm font-medium text-indigo-300 block mb-1"
                    >
                      Change Status:
                    </label>
                    <select
                      id={`status-${step.id}`}
                      value={status}
                      onChange={(e) => handleStatusChange(step.id, e.target.value)}
                      className="bg-[#1E293B] text-white border border-[#475569] rounded px-3 py-1 text-sm"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>
        )}
      </div>
    </>
  );
}