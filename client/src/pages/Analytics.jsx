import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function Analytics() {
  const { user } = useAuth();
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
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen text-white">
          Loading your analytics...
        </div>
      </DashboardLayout>
    );
  }

  const {
    roadmapCount,
    feedbackCount,
    courseCount,
    lastActive,
    averageRating,
    mostViewedCategory,
    mostEngagedInstitution,
  } = analytics;

  const statCards = [
    {
      label: "🚀 Roadmaps Generated",
      value: roadmapCount || "0",
      color: "text-green-400",
    },
    {
      label: "📝 Feedback Given",
      value: feedbackCount || "0",
      color: "text-green-400",
    },
    {
      label: "🎓 Courses Explored",
      value: courseCount || "0",
      color: "text-indigo-400",
    },
    {
      label: "⏱️ Last Active",
      value: lastActive
        ? new Date(lastActive).toLocaleString()
        : "No activity yet",
      color: "text-gray-400 text-sm",
    },
    {
      label: "⭐ Avg. Feedback Rating",
      value: averageRating || "N/A",
      color: "text-yellow-400",
    },
    {
      label: "🔍 Top Interest Area",
      value: mostViewedCategory || "N/A",
      color: "text-blue-400",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0F172A] text-white px-4 py-10 sm:px-8 md:px-16">
        <h1 className="text-4xl font-bold text-center text-green-400 mb-12">
          📊 Your Career Analytics
        </h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card, index) => (
            <Card
              key={index}
              className="bg-[#1E293B] border border-[#334155] shadow-xl hover:shadow-2xl transition duration-300"
            >
              <CardContent className="p-6 space-y-2">
                <h2 className="text-lg font-semibold text-[#EEEEEE]">
                  {card.label}
                </h2>
                <p className={`text-3xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* <Card className="bg-[#1E293B] border border-[#334155] shadow-xl hover:shadow-2xl transition duration-300 col-span-full">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[#EEEEEE] mb-2">
                🏫 Most Engaged Institution
              </h2>
              <p className="text-2xl font-bold text-purple-400">
                {mostEngagedInstitution || "Not enough data"}
              </p>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </DashboardLayout>
  );
}
