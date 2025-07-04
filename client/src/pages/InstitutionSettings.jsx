import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InstitutionDashboardLayout from "../layouts/InstitutionLayout";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

export default function InstitutionSettings() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.institution_id) {
      fetchInstitutionDetails();
    }
  }, [user]);

  const fetchInstitutionDetails = async () => {
    try {
      const res = await api.get(`/institutions/${user.institution_id}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching institution details:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.put(`/institutions/${user.institution_id}`, formData);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating institution:", err);
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your institution account? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/users/${user.id}`);
      logout();
      navigate("/register");
    } catch (err) {
      console.error("Error deleting institution:", err);
      alert("Account deletion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstitutionDashboardLayout>
      <div className="max-w-xl mx-auto bg-[#3B4758] p-6 rounded-xl shadow-lg text-white space-y-6">
        <h2 className="text-3xl font-bold mb-4">Institution Settings</h2>

        <div className="space-y-4">
          <Input
            placeholder="Institution Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleUpdate}
            className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-white flex-1"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </InstitutionDashboardLayout>
  );
}
