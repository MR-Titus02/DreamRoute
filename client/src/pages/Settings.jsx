import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import DashboardLayout from "@/layouts/DashboardLayout"; // ✅ layout wrapper

export default function Settings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    careerGoal: "",
    learningMode: "Online",
    budget: "",
    duration: "Short-term",
    darkMode: true,
    emailNotifs: true,
    courseAlerts: true,
  });

  useEffect(() => {
    if (user?.id) {
      api.get(`/users/${user.id}`)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            name: res.data.name || "",
            email: res.data.email || "",
          }));
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, {
        name: formData.name,
        email: formData.email,
      });
      alert("Account info updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong while updating.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-[#1e293b] min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">⚙️ User Settings</h1>

        <form onSubmit={handleSubmit} className="grid gap-6 max-w-4xl mx-auto">
          {/* Account Settings */}
          <Card className="bg-[#334155] text-white">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="bg-white text-black"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-white text-black"
              />
              <Button variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">
                Change Password
              </Button>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>

          {/* Notification Preferences (only frontend for now) */}
          <Card className="bg-[#334155] text-white">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label>Email Notifications</label>
                <Switch
                  name="emailNotifs"
                  checked={formData.emailNotifs}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, emailNotifs: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Course Update Alerts</label>
                <Switch
                  name="courseAlerts"
                  checked={formData.courseAlerts}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, courseAlerts: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
