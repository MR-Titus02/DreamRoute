import React, { useEffect, useState } from "react";
import api from "@/api/axios"; // Ensure this points to your axios instance
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Analytics() {
  const { user } = useAuth(); // get logged-in user from context
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
  
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/${user.id}`);
        console.log("Fetched Analytics:", res.data);
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error loading analytics", error);
      }
    };
  
    fetchAnalytics();
  }, [user]);
  
  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading your analytics...
      </div>
    );
  }

  const {
    roadmapCount,
    feedbackCount,
    viewedCourses,
    lastActive,
    averageRating,
    mostViewedCategory,
    mostEngagedInstitution,
  } = analytics;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10 lg:px-20">
      <h1 className="text-4xl font-bold mb-10 text-center text-green-400">
        📊 Your Career Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="bg-[#1e293b] border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              🚀 Roadmaps Generated
            </h2>
            <p className="text-xl font-bold">
  {analytics?.roadmapCount !== undefined ? analytics.roadmapCount : "0"}
</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              📝 Feedback Given
            </h2>
            <p className="text-3xl text-green-400 font-bold">{feedbackCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              🎓 Courses Explored
            </h2>
            <p className="text-xl font-bold">
  {analytics?.courseCount !== undefined ? analytics.courseCount : "0"}
</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              ⏱️ Last Active
            </h2>
            <p className="text-gray-400 text-sm">
  {analytics?.lastActive
    ? new Date(analytics.lastActive).toLocaleString()
    : "No activity yet"}
</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              ⭐ Avg. Feedback Rating
            </h2>
            <p className="text-3xl text-yellow-400 font-bold">{averageRating || "N/A"}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              🔍 Top Interest Area
            </h2>
            <p className="text-xl text-blue-400 font-bold">{mostViewedCategory || "N/A"}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-none shadow-xl col-span-full md:col-span-2 xl:col-span-3">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              🏫 Most Engaged Institution
            </h2>
            <p className="text-2xl text-purple-400 font-bold">
              {mostEngagedInstitution || "Not enough data"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
