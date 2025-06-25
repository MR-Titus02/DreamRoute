import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [titleFilter, setTitleFilter] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await api.get("/courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  }

  async function handleCourseAction(courseId, action) {
    try {
      if (action === "approve" || action === "reject") {
        await api.patch(`/courses/${courseId}/status`, { status: action });
      } else if (action === "delete") {
        await api.delete(`/courses/${courseId}`);
      }
      fetchCourses();
    } catch (err) {
      console.error(`Error during ${action} course:`, err);
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchStatus = statusFilter === "all" || course.status === statusFilter;
    const matchTitle = course.title.toLowerCase().includes(titleFilter.toLowerCase());
    return matchStatus && matchTitle;
  });

  return (
    <div className="p-6 bg-[#1E293B] min-h-screen text-[#F1F5F9]">
      <h2 className="text-3xl font-bold mb-6 text-white">Course Management</h2>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by title..."
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="bg-[#1E293B] text-white border-gray-500"
        />
        <Select
          onValueChange={(val) => setStatusFilter(val)}
          defaultValue="all"
        >
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
      </div>

      <Card className="bg-[#3B4758] shadow-lg">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead className="text-gray-300">
              <tr>
                <th className="py-2">Title</th>
                <th>Institution</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className="border-t border-gray-600">
                  <td className="py-2">{course.title}</td>
                  <td>{course.institution_name || "Admin Created"}</td>
                  <td>{course.status}</td>
                  <td className="space-x-2 text-center">
                    {course.status === "pending" && (
                      <>
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
                      </>
                    )}
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
