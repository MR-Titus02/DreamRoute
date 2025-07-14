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
      {/* Mandatory Profile Completion Modal */}
      <Dialog open={showProfileModal} onOpenChange={handleCloseAttempt}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-0" showCloseButton={!isNewUser}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {isNewUser ? "👋 Welcome to Career Compass!" : "Complete Your Profile"}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {isNewUser
                ? "To get started, we need some information about your background and goals. This will help our AI generate your personalized career roadmap."
                : "Your profile information is required to generate personalized recommendations."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-yellow-400 mb-2">
              {isNewUser 
                ? "This is a mandatory first step before you can access any features."
                : "Without this information, we can't provide career recommendations."}
            </p>
            <ul className="list-disc pl-5 text-gray-300 space-y-1">
              <li>It only takes 2 minutes</li>
              <li>Your data is kept private and secure</li>
              <li>You can update it anytime</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleProfileComplete}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2"
              size="lg"
            >
              {isNewUser ? "Get Started" : "Complete Profile"}
            </Button>
            {!isNewUser && (
              <Button
                onClick={handleCloseAttempt}
                variant="outline"
                className="w-full text-white border-gray-600 hover:bg-gray-700"
              >
                Maybe Later
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Closing */}
      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent className="bg-gray-800 border-0 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              You won't be able to generate any roadmaps without completing your profile.
              <br />
              <span className="text-yellow-400 font-medium">This step is required to continue.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelClose}
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              No, I'll complete it
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmClose}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, close anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!career ? (
        <Card className="bg-yellow-100 text-black border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">🎯 Complete Your Career Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">
              We need a few details about your background and goals to generate your personalized roadmap.
            </p>
            <Button
              onClick={() => navigate("/userdetails")}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-300">
                    <span className="text-green-500">{completedSteps}</span> of{" "}
                    <span className="font-semibold">{totalSteps}</span> steps completed
                  </p>
                  <p className="text-yellow-400">
                    <span className="font-semibold">{percentage}%</span> completed
                  </p>
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-3 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <p className="text-yellow-400 mb-3">
                🚀 {message} Just <strong>{remainingSteps}</strong> more step
                {remainingSteps !== 1 ? "s" : ""} to become a{" "}
                <strong>{career}</strong>!
              </p>

              <div className="space-y-3">
                {flatSteps.map((step) => {
                  const isCompleted = progressData.some(
                    (progress) => progress.step_id === step.id.toString() && progress.status === "done"
                  );
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center p-3 rounded-lg ${
                        isCompleted ? "bg-gray-700/50" : "bg-gray-800"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-600 text-gray-400"
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
                          <span className="text-xs">{step.id}</span>
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
                            Section: {step.section}
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
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white"
                >
                  🎯 Continue with "{nextStep.label}"
                </Button>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}