import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      fetchData();
    }
  }, [loading, token]);

  async function fetchData() {
    try {
      const [userRes, courseRes, logRes, notifRes] = await Promise.all([
        api.get("/users/"),
        api.get("/courses/"),
        api.get("/logs/"),
        api.get("/notifications/")
      ]);
      setUsers(userRes.data || []);
      setCourses(courseRes.data || []);
      setLogs(logRes.data || []);
      setNotifications(notifRes.data || []);
      setLoadingCounts(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoadingCounts(false);
    }
  }

  const totalUsers = users?.length || 0;
  const premiumUsers = users?.filter((u) => u.premium)?.length || 0;
  const totalCourses = courses?.length || 0;
  const totalInstitutions = users?.filter((u) => u.role === "institution")?.length || 0;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-[#1E293B] min-h-screen text-[#F1F5F9]">
        <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-[#3B4758] shadow-lg">
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {loadingCounts ? "..." : totalUsers}
            </CardContent>
          </Card>
          <Card className="bg-[#3B4758] shadow-lg">
            <CardHeader>
              <CardTitle>Premium Users</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {loadingCounts ? "..." : premiumUsers}
            </CardContent>
          </Card>
          <Card className="bg-[#3B4758] shadow-lg">
            <CardHeader>
              <CardTitle>Total Courses</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {loadingCounts ? "..." : totalCourses}
            </CardContent>
          </Card>
          <Card className="bg-[#3B4758] shadow-lg">
            <CardHeader>
              <CardTitle>Institutions</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {loadingCounts ? "..." : totalInstitutions}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#3B4758] shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Recent User Actions / Login History</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {logs.map((log, idx) => (
                <li key={idx} className="border-b border-gray-600 pb-2">
                  <p className="text-sm">
                    {log.userEmail} - {log.action || "Logged in"} - {log.timestamp}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader>
            <CardTitle>Notifications & Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notifications.map((note, idx) => (
                <li key={idx} className="border-b border-gray-600 pb-2">
                  <p className="text-sm">{note.message}</p>
                  {note.type === "course-request" && (
                    <Button
                      className="mt-1"
                      onClick={() =>
                        api
                          .patch(`/courses/${note.courseId}/status`, { status: "approved" })
                          .then(fetchData)
                      }
                    >
                      Approve Course
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
