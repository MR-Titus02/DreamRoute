import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await api.get("/users");
    setUsers(res.data);
  }

  async function handleRoleChange(userId, newRole) {
    await api.put(`/admin/change/${userId}`, { role: newRole });
    fetchUsers();
  }

  async function confirmDelete() {
    await api.delete(`/users/${deleteTarget}`);
    setDeleteTarget(null);
    fetchUsers();
  }

  const filteredUsers = users
    .filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "role"
        ? a.role.localeCompare(b.role)
        : a.name.localeCompare(b.name)
    );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const RoleBadge = ({ role }) => {
    const color =
      role === "admin"
        ? "bg-red-600"
        : role === "institution"
        ? "bg-blue-600"
        : "bg-green-600";
    return (
      <span className={`text-xs px-2 py-1 rounded ${color} text-white`}>
        {role}
      </span>
    );
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4 text-white">User Management</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Input
          placeholder="Search users..."
          className="bg-[#3B4758] text-white sm:w-1/2"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px] bg-[#1E293B] text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#3B4758] text-white">
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="role">Sort by Role</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-secondary text-primary-text">
        <CardHeader>
          <CardTitle className="text-primary-text">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {paginatedUsers.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center py-2 border-b border-gray-600"
              >
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-gray-200">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RoleBadge role={user.role} />
                  <Select
                    value={user.role}
                    onValueChange={(val) => handleRoleChange(user.id, val)}
                  >
                    <SelectTrigger className="w-36 bg-[#1E293B] text-white">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#3B4758] text-white">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteTarget(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-200">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-white border-gray-400"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-white border-gray-400"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-[#1E293B] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this user?</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
