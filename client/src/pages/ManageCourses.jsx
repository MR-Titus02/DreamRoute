import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import InstitutionDashboardLayout from "../layouts/InstitutionLayout";
import { useAuth } from "@/context/AuthContext";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user } = useAuth();

  const fetchCourses = async () => {
    try {
      const res = await api.get(`/institutions/${user.institution_id}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    if (user?.institution_id) fetchCourses();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.title?.trim() ||
      !formData.description?.trim() ||
      !formData.duration?.trim() ||
      !formData.price?.trim()
    ) {
      alert("Please fill all fields before submitting.");
      return;
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      alert("Price must be a valid positive number.");
      return;
    }

    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, formData);
      } else {
        await api.post("/courses", {
          ...formData,
          institution_id: user.institution_id,
        });
      }

      // Reset state
      setEditingCourse(null);
      setFormData({ title: "", description: "", duration: "", price: "" });
      setDialogOpen(false);
      fetchCourses();
    } catch (err) {
      console.error("Error submitting course:", err);
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
      price: course.price || "",
    });
    setDialogOpen(true);
  };

  const openAddNew = () => {
    setEditingCourse(null);
    setFormData({ title: "", description: "", duration: "", price: "" });
    setDialogOpen(true);
  };

  return (
    <InstitutionDashboardLayout>
      <div className="text-white space-y-6">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Manage Courses</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90 px-6 py-2 rounded-xl"
                onClick={openAddNew}
              >
                + Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#3B4758] text-white border border-[#475569] max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <Input
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
                <Input
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#00ADB5] text-white flex-1"
                  >
                    {editingCourse ? "Update" : "Create"}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="border border-gray-400 text-white flex-1"
                      onClick={() => {
                        setEditingCourse(null);
                        setFormData({
                          title: "",
                          description: "",
                          duration: "",
                          price: "",
                        });
                        setDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {courses.map((course) => (
    <div
      key={course.id}
      className="bg-[#3B4758] p-5 rounded-xl shadow-md space-y-3"
    >
      <div>
        <h4 className="text-xl font-semibold text-white">
          {course.title || "Untitled Course"}
        </h4>
        <p className="text-sm text-gray-300">
          {course.description?.trim() || "No description provided."}
        </p>
      </div>
      <div className="text-sm text-gray-400">
        Duration: {course.duration?.trim() || "Flexible"}
      </div>
      <div className="text-sm text-gray-400">
        Price: ₹{course.price ? course.price : "Free"}
      </div>
      <div className="flex space-x-2 mt-2">
        <Button
          onClick={() => openEdit(course)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black flex-1"
          type="button"
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(course.id)}
          className="bg-red-500 hover:bg-red-600 text-white flex-1"
          type="button"
        >
          Delete
        </Button>
      </div>
    </div>
  ))}
</div>
      </div>
    </InstitutionDashboardLayout>
  );
}
