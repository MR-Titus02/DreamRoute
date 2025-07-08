import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchRoadmap, fetchProgress } from "@/api/roadmap";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  const [career, setCareer] = useState("");
  const [totalSteps, setTotalSteps] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [flatSteps, setFlatSteps] = useState([]);
  const [progressData, setProgressData] = useState([]);

  const percentage =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  let message = "You're just starting out!";
  if (percentage >= 25) message = "You're making good progress!";
  if (percentage >= 50) message = "You're halfway there!";
  if (percentage >= 75) message = "Almost there!";
  if (percentage === 100) message = "🎉 You've completed your roadmap!";

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userId) return;

      try {
        const { career, roadmap } = await fetchRoadmap(userId);

        const steps = Array.isArray(roadmap[0]?.steps)
          ? roadmap.flatMap((section) =>
              section.steps.map((step) => ({ ...step, section: section.section }))
            )
          : roadmap;

        steps.sort((a, b) => Number(a.id) - Number(b.id));

        setCareer(career);
        setFlatSteps(steps);
        setTotalSteps(steps.length);

        const progress = await fetchProgress(userId);
        setProgressData(progress);

        const doneCount = progress.filter((item) => item.status === "done").length;
        setCompletedSteps(doneCount);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    loadDashboardData();
  }, [userId]);

  const remainingSteps = totalSteps - completedSteps;

  // Create a map of progress for quick lookup
  const progressMap = {};
  progressData.forEach((item) => {
    if (item.stepId !== undefined && item.stepId !== null) {
      progressMap[item.stepId.toString()] = item.status;
    }
  });

  // Get the next step that is not marked "done" or "completed"
  const nextStep = flatSteps.find((step) => {
    if (!step.id) return false;
    const status = progressMap[step.id.toString()] || "not started";
    return status !== "done" && status !== "completed";
  });

  return (
    <DashboardLayout>
      <Card className="bg-[#3B4758] text-white border-0 shadow-xl mb-6">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold">
            Latest Career Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-3">
            Based on your profile and interests, your ideal path is{" "}
            <span className="text-green-400 font-semibold">{career}</span>.
          </p>
          <Button
            onClick={() => navigate("/dashboard/roadmap")}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            View Roadmap
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1e293b] text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold">
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-1">
            ✅ <strong>{completedSteps}</strong> of <strong>{totalSteps}</strong> steps completed
          </p>
          <p className="text-yellow-400 mb-1">
            🚀 Just <strong>{remainingSteps}</strong> more step
            {remainingSteps !== 1 ? "s" : ""} to become a{" "}
            <strong>{career}</strong>! <strong>{message}</strong>
          </p>

          <div className="w-full bg-gray-700 rounded h-3 mb-2 overflow-hidden">
            <div
              className="bg-green-500 h-3 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 mb-1">
            ✅ <strong>{completedSteps}</strong> of <strong>{totalSteps}</strong> steps completed (
            <strong>{percentage}%</strong>)
          </p>

          {nextStep && (
            <Button
              onClick={() => navigate("/dashboard/roadmap")}
              className="mt-3 bg-gradient-to-r from-green-500 to-teal-500 text-white"
            >
              🎯 Continue with “{nextStep.label}”
            </Button>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
