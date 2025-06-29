import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  const [formData, setFormData] = useState({
    name: "Titus Senthil",
    email: "titus@example.com",
    careerGoal: "",
    learningMode: "Online",
    budget: "",
    duration: "Short-term",
    darkMode: true,
    emailNotifs: true,
    courseAlerts: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to save settings
    console.log("Saving settings:", formData);
  };

  return (
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

        {/* Career Preferences */}
        <Card className="bg-[#334155] text-white">
          <CardHeader>
            <CardTitle>Career Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="careerGoal"
              value={formData.careerGoal}
              onChange={handleChange}
              placeholder="Preferred Career (e.g., Web Developer)"
              className="bg-white text-black"
            />
            <select
              name="learningMode"
              value={formData.learningMode}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <Input
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Max Budget (₹)"
              className="bg-white text-black"
            />
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="Short-term">Short-term</option>
              <option value="Long-term">Long-term</option>
            </select>
          </CardContent>
        </Card>

        {/* Personalization */}
        <Card className="bg-[#334155] text-white">
          <CardHeader>
            <CardTitle>Personalization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="darkMode">Dark Mode</label>
              <Switch
                name="darkMode"
                checked={formData.darkMode}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, darkMode: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
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
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, emailNotifs: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <label>Course Update Alerts</label>
              <Switch
                name="courseAlerts"
                checked={formData.courseAlerts}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, courseAlerts: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
