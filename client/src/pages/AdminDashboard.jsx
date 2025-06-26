import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [limit, setLimit] = useState(50);
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
        api.get("/login-logs/"),
        // api.get("/notifications/")
        
      ]);

      // Response is a direct array
      setUsers(userRes.data || []);
          
      setCourses(courseRes.data || []);
      setLogs(logRes.data || []);
      
      // setNotifications(notifRes.data || []);
      
      setLoadingCounts(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoadingCounts(false);
    }
  }

  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.premium).length; // assuming `premium` will exist in future
  const totalCourses = courses.length;
  const totalInstitutions = users.filter((u) => u.role === "institution").length;

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

        <Card className="bg-[#1f2937] text-white shadow-xl mb-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-lg font-semibold">
          Login History
        </CardTitle>
        <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value))}>
          <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            {[50, 100, 150, 200].map((num) => (
              <SelectItem key={num} value={String(num)}>
                Last {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">Device</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="px-4 py-2">{log.ip_address}</td>
                  <td className="px-4 py-2 truncate max-w-[300px]">{log.user_agent}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        log.status === "success"
                          ? "text-green-400 font-medium"
                          : "text-red-400 font-medium"
                      }
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-400">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No login logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>

        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader>
            <CardTitle>Notifications & Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notifications.length > 0 ? notifications.map((note, idx) => (
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
              )) : <p className="text-sm text-gray-400">No notifications available.</p>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
