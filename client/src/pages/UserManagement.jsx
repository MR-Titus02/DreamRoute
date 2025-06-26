import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/Sidebar"; // ✅ Added Sidebar

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  async function handleUserDelete(userId) {
    await api.delete(`/users/${userId}`);
    fetchUsers();
  }

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-[#1E293B] text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <Input
          placeholder="Search users..."
          className="mb-4 bg-[#3B4758] text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Card className="bg-[#3B4758]">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {filteredUsers.map((user) => (
                <li key={user.id} className="flex justify-between items-center py-2 border-b border-gray-600">
                  <div>
                    <p>{user.name}</p>
                    <p className="text-sm text-gray-300">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                  <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
  <SelectTrigger className="w-36 bg-[#1E293B] text-white">
    <SelectValue placeholder="Select Role" />
  </SelectTrigger>
  <SelectContent className="bg-[#3B4758] text-white">
    <SelectItem value="student">Student</SelectItem>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="institution">Institution</SelectItem>
  </SelectContent>
</Select>

                    <Button variant="destructive" onClick={() => handleUserDelete(user.id)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
