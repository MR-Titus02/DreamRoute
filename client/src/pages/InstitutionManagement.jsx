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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import AdminLayout from "@/layouts/AdminLayout";

export default function InstitutionManagement() {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newInstitutionName, setNewInstitutionName] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [userEmails, setUserEmails] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchInstitutions();
    fetchUserEmails();
    fetchInstitutionRequests();
  }, []);

  async function fetchInstitutions() {
    try {
      const res = await api.get("/institutions/");
      setInstitutions(res.data);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  }

  async function fetchUserEmails() {
    try {
      const res = await api.get("/users");
      const filtered = res.data.filter((user) => user.role !== "institution");
      setUserEmails(filtered);
    } catch (err) {
      console.error("Error fetching user emails:", err);
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
      await api.post("/institutions/new-ins", {
        name: newInstitutionName,
        email: selectedUserEmail,
      });
      setNewInstitutionName("");
      setSelectedUserEmail("");
      fetchInstitutions();
    } catch (err) {
      console.error("Error adding institution:", err);
    }
  }

  async function fetchInstitutionRequests() {
    try {
      const res = await api.get("/admin/");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching institution requests:", err);
    }
  }

  async function handleApproveRequest(id) {
    try {
      await api.post(`/admin/${id}/approve`);
      fetchInstitutionRequests();
      fetchInstitutions();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  }

  async function handleRejectRequest(id) {
    try {
      await api.post(`/admin/${id}/reject`);
      fetchInstitutionRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  }

  const filteredInstitutions = institutions.filter((i) =>
    (i.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-white">Institution Management</h1>

      {/* Existing Institution Management UI */}
      <Card className="mb-6 bg-[#3B4758] text-white">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-white">
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
          <div className="mb-4 flex flex-wrap gap-2">
            <Select onValueChange={setSelectedUserEmail}>
              <SelectTrigger className="bg-[#1E293B] text-white border-gray-500 w-64">
                <SelectValue placeholder="Select User Email" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] text-white border-gray-500">
                {userEmails.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.email}
                    className="text-white hover:bg-[#334155] focus:bg-[#334155] cursor-pointer"
                  >
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Institution Name"
              value={newInstitutionName}
              onChange={(e) => setNewInstitutionName(e.target.value)}
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
                  <p className="font-semibold text-white">{institution.name}</p>
                  <p className="text-sm text-gray-200">{institution.email}</p>
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

      {/* Courses by Selected Institution */}
      {selectedInstitutionId && (
        <Card className="bg-[#3B4758] text-white">
          <CardHeader>
            <CardTitle className="text-white">Courses by Institution</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-gray-300">No courses found for this institution.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-200">
                    <th className="py-2">Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-t border-gray-600">
                      <td className="py-2 font-medium text-white">{course.title}</td>
                      <td className="text-sm text-gray-200">{course.description}</td>
                      <td className="text-white">{course.status}</td>
                      <td className="space-x-2">
                        <Button
                          onClick={() =>
                            api
                              .put(`/courses/${course.id}/status`, { status: "approved" })
                              .then(() => fetchInstitutionCourses(selectedInstitutionId))
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() =>
                            api
                              .put(`/courses/${course.id}/status`, { status: "rejected" })
                              .then(() => fetchInstitutionCourses(selectedInstitutionId))
                          }
                        >
                          Reject
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            api
                              .delete(`/courses/${course.id}`)
                              .then(() => fetchInstitutionCourses(selectedInstitutionId))
                          }
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Institution Requests (New Section) */}
      <Card className="mt-6 bg-[#3B4758] text-white">
        <CardHeader>
          <CardTitle className="text-white">Pending Institution Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.filter((r) => r.status === "pending").length === 0 ? (
            <p className="text-gray-300">No pending requests.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-200 border-b border-gray-600">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Description</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests
                  .filter((r) => r.status === "pending")
                  .map((req) => (
                    <tr key={req.id} className="border-t border-gray-600">
                      <td className="py-2 text-white">{req.name}</td>
                      <td className="text-sm text-gray-200">{req.email}</td>
                      <td className="text-sm text-gray-300">{req.description}</td>
                      <td className="text-sm text-gray-300">{req.address}</td>
                      <td className="space-x-2">
                        <Button
                          onClick={() => handleApproveRequest(req.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRejectRequest(req.id)}
                          className="px-4 py-1"
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
