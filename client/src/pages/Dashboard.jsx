import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchRoadmap, fetchProgress } from "@/api/roadmap";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  const [career, setCareer] = useState("");
  const [totalSteps, setTotalSteps] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [flatSteps, setFlatSteps] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

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

        // Check if this is a new user with no profile data
        const userData = JSON.parse(localStorage.getItem("user"));
        if ((!career || !roadmap) && !userData?.profileCompleted) {
          setIsNewUser(true);
          setShowProfileModal(true);
          setLoading(false);
          return;
        }

        if (!roadmap || roadmap.length === 0) {
          setCareer(""); // no roadmap
          setLoading(false);
          return;
        }

        const steps = Array.isArray(roadmap[0]?.steps)
          ? roadmap.flatMap((section) =>
              section.steps.map((step) => ({
                ...step,
                section: section.section,
              }))
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
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userId]);

  const handleProfileComplete = () => {
    // Update user data in localStorage to mark profile as completed
    const userData = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("user", JSON.stringify({ ...userData, profileCompleted: true }));
    setShowProfileModal(false);
    navigate("/userdetails");
  };

  const handleCloseAttempt = () => {
    if (isNewUser) {
      setShowConfirmClose(true);
    } else {
      setShowProfileModal(false);
    }
  };

  const handleConfirmClose = () => {
    setShowProfileModal(false);
    setShowConfirmClose(false);
  };

  const handleCancelClose = () => {
    setShowConfirmClose(false);
  };

  const remainingSteps = totalSteps - completedSteps;

  const progressMap = {};
  progressData.forEach((item) => {
    if (item.step_id !== undefined && item.step_id !== null) {
      progressMap[item.step_id.toString()] = item.status;
    }
  });

  const nextStep = flatSteps.find((step) => {
    if (!step.id) return false;
    const status = progressMap[step.id.toString()] || "not started";
    return status !== "done" && status !== "completed";
  });

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-white text-lg">Loading dashboard...</p>
      </DashboardLayout>
    );
  }

return (
    <DashboardLayout>
      {/* Profile Completion Modal - Enhanced */}
      <Dialog open={showProfileModal} onOpenChange={handleCloseAttempt}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 border border-gray-700 rounded-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {isNewUser ? (
                <span className="flex items-center gap-2">
                  <span className="text-blue-400">👋</span> Welcome to Career Compass!
                </span>
              ) : (
                "Complete Your Profile"
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              {isNewUser
                ? "Let's create your personalized career roadmap in just 2 minutes."
                : "Update your profile for better recommendations."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
              <div className="text-blue-400 mt-0.5">ℹ️</div>
              <div>
                <p className="text-sm font-medium text-white">
                  {isNewUser 
                    ? "This helps us tailor recommendations to your goals"
                    : "Your information helps us improve suggestions"}
                </p>
                <ul className="list-disc pl-5 text-gray-300 text-sm mt-2 space-y-1">
                  <li>Quick and easy setup</li>
                  <li>Data privacy guaranteed</li>
                  <li>Editable anytime</li>
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handleProfileComplete}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-lg"
              size="lg"
            >
              {isNewUser ? "Begin Setup" : "Update Profile"}
            </Button>
            {!isNewUser && (
              <Button
                onClick={handleCloseAttempt}
                variant="outline"
                className="w-full text-gray-300 border-gray-600 hover:bg-gray-700/50 hover:text-white rounded-lg"
              >
                Remind Me Later
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog - Styled */}
      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent className="bg-gray-800 border border-gray-700 rounded-lg text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <span className="text-yellow-400">⚠️</span> Required Step
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 mt-2">
              You need to complete your profile to unlock all features.
              <br />
              <span className="text-blue-300 font-medium mt-1 inline-block">
                This ensures you get the best recommendations.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel 
              onClick={handleCancelClose}
              className="text-white border-gray-600 hover:bg-gray-700/50 rounded-lg"
            >
              Continue Setup
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmClose}
              className="bg-red-500 hover:bg-red-600 rounded-lg"
            >
              Exit Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!career ? (
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 text-gray-900 border border-amber-200 shadow-md mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="text-amber-600">🎯</span> Setup Your Career Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700">
              Complete your profile to generate a personalized career roadmap.
            </p>
            <Button
              onClick={() => navigate("/userdetails")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg"
            >
              Start Setup
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Career Recommendation Card - Enhanced */}
          <Card className="bg-gradient-to-br from-slate-800 to-gray-900 text-white border border-gray-700 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                <span className="text-blue-400">✨</span> Your Career Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Our AI recommends:{" "}
                <span className="text-blue-300 font-medium">{career}</span>
              </p>
              <Button
                onClick={() => navigate("/dashboard/roadmap")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg"
              >
                View Full Roadmap
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card - Enhanced */}
          <Card className="bg-gradient-to-br from-gray-900 to-slate-800 text-white border border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
                <span className="text-green-400">📊</span> Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-300 mb-1">
                    Completed: <span className="text-green-400 font-medium">{completedSteps}</span>/{totalSteps}
                  </p>
                  <p className="text-blue-300 font-medium">
                    {percentage}% Complete
                  </p>
                </div>
                <div className="w-40 bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-teal-400 h-2.5 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-800/50 rounded-lg mb-6 border border-gray-700">
                <p className="text-center text-blue-300 font-medium">
                  {message} {remainingSteps > 0 && (
                    <span className="text-gray-300">
                      - {remainingSteps} step{remainingSteps !== 1 ? "s" : ""} remaining
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {flatSteps.map((step) => {
                  const isCompleted = progressData.some(
                    (progress) => progress.step_id === step.id.toString() && progress.status === "done"
                  );
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start p-3 rounded-lg border ${
                        isCompleted 
                          ? "bg-gray-800/30 border-green-900/50" 
                          : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span className="text-xs font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p
                          className={`${
                            isCompleted
                              ? "text-gray-400 line-through"
                              : "text-white"
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.section && (
                          <p className="text-xs text-gray-400 mt-1">
                            {step.section}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {nextStep && (
                <Button
                  onClick={() => navigate(`/dashboard/roadmap?step=${nextStep.id}`)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg py-2"
                >
                  Continue with "{nextStep.label.substring(0, 30)}{nextStep.label.length > 30 ? "..." : ""}"
                </Button>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}