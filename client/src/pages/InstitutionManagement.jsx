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
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function InstitutionManagement() {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newInstitutionName, setNewInstitutionName] = useState("");
  const [newInstitutionEmail, setNewInstitutionEmail] = useState("");

  useEffect(() => {
    fetchInstitutions();
  }, []);

  async function fetchInstitutions() {
    try {
      const res = await api.get("/institutions/");
      setInstitutions(res.data);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  }

  async function fetchInstitutionCourses(id) {
    try {
      const res = await api.get(`/institutions/${id}/courses`);
      setCourses(res.data);
      setSelectedInstitutionId(id);
    } catch (err) {
      console.error("Error fetching institution courses:", err);
    }
  }

  async function handleDeleteInstitution(id) {
    try {
      await api.delete(`/institutions/${id}`);
      fetchInstitutions();
    } catch (err) {
      console.error("Error deleting institution:", err);
    }
  }

  async function handleAddInstitution() {
    try {
      await api.post("/institutions/", {
        name: newInstitutionName,
        email: newInstitutionEmail,
      });
      setNewInstitutionName("");
      setNewInstitutionEmail("");
      fetchInstitutions();
    } catch (err) {
      console.error("Error adding institution:", err);
    }
  }

  async function handleAddCourse() {
    try {
      await api.post("/courses/", {
        title: newCourseTitle,
        institutionId: selectedInstitutionId,
      });
      setNewCourseTitle("");
      fetchInstitutionCourses(selectedInstitutionId);
    } catch (err) {
      console.error("Error adding course:", err);
    }
  }

  const filteredInstitutions = institutions.filter((i) =>
    (i.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#1E293B] min-h-screen text-[#F1F5F9]">
      <h1 className="text-3xl font-bold mb-6 text-white">Institution Management</h1>

      <Card className="mb-6 bg-[#3B4758]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Institutions</span>
            <Input
              placeholder="Search institution..."
              className="w-64 bg-[#1E293B] text-white border-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <Input
              placeholder="New Institution Name"
              value={newInstitutionName}
              onChange={(e) => setNewInstitutionName(e.target.value)}
              className="bg-[#1E293B] text-white border-gray-500"
            />
            <Input
              placeholder="New Institution Email"
              value={newInstitutionEmail}
              onChange={(e) => setNewInstitutionEmail(e.target.value)}
              className="bg-[#1E293B] text-white border-gray-500"
            />
            <Button onClick={handleAddInstitution}>Add Institution</Button>
          </div>
          <ul className="space-y-3">
            {filteredInstitutions.map((institution) => (
              <li
                key={institution.id}
                className="flex justify-between border-b border-gray-600 pb-2"
              >
                <div>
                  <p className="font-semibold">{institution.name}</p>
                  <p className="text-sm text-gray-300">{institution.email}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchInstitutionCourses(institution.id)}
                  >
                    View Courses
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteInstitution(institution.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {selectedInstitutionId && (
        <Card className="bg-[#3B4758]">
          <CardHeader>
            <CardTitle>Courses by Institution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex space-x-2">
              <Input
                placeholder="New Course Title"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                className="bg-[#1E293B] text-white border-gray-500"
              />
              <Button onClick={handleAddCourse}>Add Course</Button>
            </div>
            {courses.length === 0 ? (
              <p className="text-gray-400">No courses found for this institution.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-300">
                    <th className="py-2">Course</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-t border-gray-600">
                      <td className="py-2">{course.title}</td>
                      <td>{course.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
