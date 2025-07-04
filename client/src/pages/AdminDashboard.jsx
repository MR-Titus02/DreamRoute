import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
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
  const [limit, setLimit] = useState(10); // Set default limit to 10
  const [notifications, setNotifications] = useState([]);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const { token, loading } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!loading && token) {
      fetchData();
    }
  }, [loading, token]);

  async function fetchData() {
    try {
      const [userRes, courseRes, logRes] = await Promise.all([
        api.get("/users/"),
        api.get("/courses/"),
        api.get("/login-logs/"),
      ]);
      setUsers(userRes.data || []);
      setCourses(courseRes.data || []);
      setLogs(logRes.data || []);
      setLoadingCounts(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoadingCounts(false);
    }
  }

  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.premium).length;
  const totalCourses = courses.length;
  const totalInstitutions = users.filter((u) => u.role === "institution").length;

  const paginatedLogs = logs.slice((currentPage - 1) * limit, currentPage * limit);
  const totalPages = Math.ceil(logs.length / limit);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-white">
            {loadingCounts ? "..." : totalUsers}
          </CardContent>
        </Card>
        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Premium Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-white">
            {loadingCounts ? "..." : premiumUsers}
          </CardContent>
        </Card>
        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Total Courses</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-white">
            {loadingCounts ? "..." : totalCourses}
          </CardContent>
        </Card>
        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader className="text-white">
            <CardTitle>Institutions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-white">
            {loadingCounts ? "..." : totalInstitutions}
          </CardContent>
        </Card>
      </div>

      {/* Login History Section */}
      <Card className="bg-[#1f2937] text-white shadow-xl mb-6">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Login History</CardTitle>
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              setLimit(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              {[5 ,10, 20, 50, 100].map((num) => (
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
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, idx) => (
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

          {/* Pagination Controls */}
          {logs.length > limit && (
            <div className="flex justify-between items-center mt-4">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
