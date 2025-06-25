import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#38BDF8", "#34D399", "#F87171"];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const userRes = await api.get("/users");
    const courseRes = await api.get("/admin/course-requests");
    setUsers(userRes.data);
    setCourses(courseRes.data);
  }

  const userRoleStats = [
    { name: "Admin", value: users.filter(u => u.role === "admin").length },
    { name: "Institution", value: users.filter(u => u.role === "institution").length },
    { name: "User", value: users.filter(u => u.role === "user").length },
  ];

  const courseStatusStats = [
    { name: "Pending", value: courses.filter(c => c.status === "pending").length },
    { name: "Approved", value: courses.filter(c => c.status === "approved").length },
    { name: "Rejected", value: courses.filter(c => c.status === "rejected").length },
  ];

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    statusFilter === "all" ? true : c.status === statusFilter
  );

  return (
    <div className="p-6 bg-[#1E293B] min-h-screen text-[#F1F5F9]">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={userRoleStats} dataKey="value" nameKey="name" outerRadius={80}>
                  {userRoleStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader>
            <CardTitle>Course Requests</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={courseStatusStats} dataKey="value" nameKey="name" outerRadius={80}>
                  {courseStatusStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Manage Users */}
      <Card className="mb-10 bg-[#3B4758] shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Manage Users
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64 bg-[#1E293B] text-white border-gray-500"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-300">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t border-gray-600">
                  <td className="py-2">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="space-x-2 text-center">
                    {user.role !== "institution" && (
                      <Button
                        variant="secondary"
                        onClick={() => handleRoleChange(user.id, "institution")}
                      >
                        Make Institution
                      </Button>
                    )}
                    <Button variant="destructive" onClick={() => handleUserDelete(user.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Manage Courses */}
      <Card className="bg-[#3B4758] shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Requested Courses
            <Select onValueChange={value => setStatusFilter(value)} defaultValue="all">
              <SelectTrigger className="w-48 bg-[#1E293B] text-white border-gray-500">
                {statusFilter === "all" ? "All Statuses" : statusFilter}
              </SelectTrigger>
              <SelectContent className="bg-[#3B4758] text-white">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-300">
                <th className="py-2">Course</th>
                <th>Institution</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id} className="border-t border-gray-600">
                  <td className="py-2">{course.title}</td>
                  <td>{course.institution_name}</td>
                  <td>{course.status}</td>
                  <td className="space-x-2 text-center">
                    <Button
                      variant="secondary"
                      onClick={() => handleCourseAction(course.id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCourseAction(course.id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCourseAction(course.id, "delete")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
