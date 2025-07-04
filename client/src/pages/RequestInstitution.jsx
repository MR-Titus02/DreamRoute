import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton"; 

export default function RequestInstitution() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    email: user?.email || "", // prefill if available
  });

  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    try {
      await api.post("/institutions/requests", {
        ...formData,
        user_id: user?.id,
      });
      setStatus("submitted");
    } catch (err) {
      console.error("Request failed:", err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831] px-4 relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton to="/" label="Back" />
      </div>

      <div className="w-full max-w-xl bg-[#3B4758] p-8 rounded-2xl shadow-lg text-white space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">
          Apply to Become an Institution
        </h2>

        <Input
          placeholder="Institution Name"
          className="bg-[#475569] border-none placeholder:text-gray-300"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          placeholder="Email"
          type="email"
          className="bg-[#475569] border-none placeholder:text-gray-300"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          placeholder="Description"
          className="bg-[#475569] border-none placeholder:text-gray-300"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <Input
          placeholder="Address"
          className="bg-[#475569] border-none placeholder:text-gray-300"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />

        <Button
          onClick={handleSubmit}
          className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-white w-full rounded-xl py-2"
        >
          Submit Request
        </Button>

        {status === "submitted" && (
          <p className="text-green-400 text-sm text-center">
            ✅ Request submitted! Please wait for admin approval.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-sm text-center">
            ❌ Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}
