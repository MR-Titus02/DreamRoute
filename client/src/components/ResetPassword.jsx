// pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import BackButton from "./BackButton"; 

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831] text-white px-4 relative">

      {/* Back Button top-left */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton to="/login" label="Back" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full px-4 py-2 rounded bg-white/10 border border-white/30 text-white placeholder-white/50 mb-3"
          required
        />

        <button
          type="submit"
          className="w-full py-2 rounded bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:opacity-90 font-bold"
        >
          Reset Password
        </button>

        {message && <p className="text-green-400 mt-3 text-center">{message}</p>}
        {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
