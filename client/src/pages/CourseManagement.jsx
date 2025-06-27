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
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [titleFilter, setTitleFilter] = useState("");
  const { user } = useAuth();

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    institution_id: "",
    status: "approved", // default to approved for admin
  });

  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetchCourses();
    if (user?.role === "admin") {
      fetchInstitutions();
    }
  }, []);

  async function fetchCourses() {
    try {
      const res = await api.get("/courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  }

  async function fetchInstitutions() {
    try {
      const res = await api.get("/institutions/");
      setInstitutions(res.data);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  }

  async function handleCourseAction(courseId, action) {
    try {
      if (action === "approve" || action === "reject") {
        const newStatus = action === "approve" ? "approved" : "rejected";
        await api.put(`/courses/${courseId}/status`, { status: newStatus });
      }else if (action === "delete") {
        await api.delete(`/courses/${courseId}`);
      }
      fetchCourses();
    } catch (err) {
      console.error(`Error during ${action} course:`, err?.response?.data || err.message);
    }
  }

  async function createCourse() {
    const { title, description, duration, price, institution_id, status } = newCourse;

    if (!title.trim() || !description.trim() || !institution_id) {
      alert("Title, description, and institution are required.");
      return;
    }

    try {
      await api.post("/courses", {
        title,
        description,
        duration,
        price,
        institution_id,
        status,
      });

      setNewCourse({
        title: "",
        description: "",
        duration: "",
        price: "",
        institution_id: "",
        status: "approved",
      });

      fetchCourses();
    } catch (err) {
      console.error("Error creating course:", err);
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchStatus = statusFilter === "all" || course.status === statusFilter;
    const matchTitle = course.title.toLowerCase().includes(titleFilter.toLowerCase());
    return matchStatus && matchTitle;
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-[#1E293B] min-h-screen text-[#F1F5F9]">
        <h2 className="text-3xl font-bold mb-6 text-white">Course Management</h2>

        {/* 🔹 Filters */}
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

        {/* 🔹 Admin Course Creation */}
        {user?.role === "admin" && (
          <Card className="bg-[#3B4758] p-6 mb-6">
            <CardTitle className="mb-4 text-white">Create New Course</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Title *"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              />
              <Input
                placeholder="Duration (e.g., 8 weeks)"
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
              />
              <Input
                placeholder="Price (e.g., 199.99)"
                type="number"
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
              />
              <Select
  value={newCourse.institution_id.toString()}
  onValueChange={(val) =>
    setNewCourse({ ...newCourse, institution_id: val })
  }
>
                <SelectTrigger className="bg-[#1E293B] text-white border-gray-500">
                  {newCourse.institution_id
                    ? institutions.find((i) => i.id === parseInt(newCourse.institution_id))?.name
                    : "Select Institution *"}
                </SelectTrigger>
                <SelectContent className="bg-[#3B4758] text-white">
                  {institutions.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id.toString()}>
                    {inst.name}
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Description *"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
              {/* Optional Status Dropdown */}
              <Select
                onValueChange={(val) => setNewCourse({ ...newCourse, status: val })}
                value={newCourse.status}
              >
                <SelectTrigger className="bg-[#1E293B] text-white border-gray-500">
                  {newCourse.status.charAt(0).toUpperCase() + newCourse.status.slice(1)}
                </SelectTrigger>
                <SelectContent className="bg-[#3B4758] text-white">
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className={`mt-4 w-full bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-1 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00ADB5]/30 focus:outline-none focus:ring-4 focus:ring-[#00ADB5]/50 font-inter
              ${!newCourse.title.trim() || !newCourse.description.trim() || !newCourse.institution_id ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={createCourse}
              disabled={
                !newCourse.title.trim() ||
                !newCourse.description.trim() ||
                !newCourse.institution_id
              }
            >
              Create Course
            </Button>
          </Card>
        )}

        {/* 🔹 Course List */}
        <Card className="bg-[#3B4758] shadow-lg">
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left">
              <thead className="text-gray-300">
                <tr>
                  <th className="py-2">Title</th>
                  <th>Created By</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-t border-gray-600">
                    <td className="py-2">{course.title}</td>
                    <td>{course.created_by?.name || "Unknown"}</td>
                    <td>{course.status}</td>
                    <td className="space-x-2 text-center">
                      {course.status === "pending" &&  user?.role === "admin" &&(
                        <>
                          <Button
      onClick={() => handleCourseAction(course.id, "approved")}
      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-1 px-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/30 focus:outline-none focus:ring-4 focus:ring-green-400/50 font-inter"
    >
      Approve
    </Button>
    <Button
      onClick={() => handleCourseAction(course.id, "rejected")}
      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-1 px-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/30 focus:outline-none focus:ring-4 focus:ring-red-400/50 font-inter"
    >
      Reject
    </Button>
                        </>
                      )}
                      <Button
  onClick={() => handleCourseAction(course.id, "delete")}
  className="bg-gradient-to-r from-[#ff3d3d] to-[#ff1e56] hover:from-[#ff1e56] hover:to-[#ff3d3d] text-white font-bold py-1 px-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/30 focus:outline-none focus:ring-4 focus:ring-red-400/50 font-inter"
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
    </div>
  );
}
