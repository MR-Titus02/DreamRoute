import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", duration: "", price: "" });

  const fetchCourses = async () => {
    try {
      const res = await api.get(`/institutions/${user.institution_id}/courses`); 
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, formData);
      } else {
        await api.post("/courses", formData);
      }
      setEditingCourse(null);
      setFormData({ title: "", description: "", duration: "", price: "" });
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormData(course);
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Courses</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90">+ Add Course</Button>
          </DialogTrigger>
          <DialogContent className="bg-[#3B4758] text-white">
            <h3 className="text-lg font-semibold mb-4">{editingCourse ? "Edit Course" : "Add New Course"}</h3>
            <div className="space-y-3">
              <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <Input placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <Input placeholder="Duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
              <Input placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              <Button onClick={handleSubmit} className="bg-[#00ADB5] w-full">{editingCourse ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-[#3B4758] p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xl font-semibold">{course.title}</h4>
                <p className="text-gray-300 text-sm">{course.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => openEdit(course)} className="bg-yellow-400 hover:bg-yellow-500 text-black">Edit</Button>
                <Button onClick={() => handleDelete(course.id)} className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
