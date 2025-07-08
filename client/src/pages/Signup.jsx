import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import axios from "../api/axios";
import { useAuth } from "@/context/AuthContext";
import BackButton from "../components/BackButton"; // ✅ Import the BackButton

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [focusedField, setFocusedField] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const payload = { name, email, password, role: "student" };
      const res = await axios.post("/auth/register", payload);
      const { user, token } = res.data;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222831] via-[#393E46] to-[#222831] flex items-center justify-center px-4 relative overflow-hidden">

      {/* ✅ Back Button Top-Left */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton to="/" label="Back" />
      </div>

      {/* 🔵 Animated Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#00ADB5] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-[#EEEEEE] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00ADB5] rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      {/* 📄 SignUp Form Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
        {/* 🔗 Logo and Heading */}
        <div className="flex flex-col items-center mb-4">
          <img src={Logo} alt="DreamRoute" className="w-16 h-16 mb-2 rounded-lg" />
          <h2 className="text-2xl font-bold text-white text-center mb-1">
            Join <span className="text-[#00ADB5]">DreamRoute</span>
          </h2>
          <p className="text-white/70 text-sm text-center">
            Start your journey to extraordinary destinations
          </p>
        </div>

        {/* 🔐 Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div key={field} className="relative">
              <label
                htmlFor={field}
                className="block text-sm font-semibold text-white/90 capitalize mb-1"
              >
                {field === "confirmPassword" ? "Confirm Password" : field}
              </label>
              <input
                id={field}
                name={field}
                type={
                  field === "password" || field === "confirmPassword"
                    ? showPassword[field]
                      ? "text"
                      : "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                value={formData[field]}
                onChange={handleInputChange}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField("")}
                placeholder={`Enter your ${
                  field === "confirmPassword" ? "password again" : field
                }`}
                required
                className={`w-full px-4 py-2 rounded-lg bg-white/10 border placeholder-white/50 text-white font-medium transition duration-300 ${
                  focusedField === field
                    ? "border-cyan-400 shadow-md bg-white/20"
                    : "border-white/30 hover:border-white/50"
                }`}
              />

              {/* 👁️ Toggle password visibility */}
              {(field === "password" || field === "confirmPassword") && (
                <button
                  type="button"
                  onClick={() => toggleShowPassword(field)}
                  className="absolute right-3 top-[38px] text-white/70 hover:text-white"
                  tabIndex={-1}
                  aria-label={
                    showPassword[field] ? "Hide password" : "Show password"
                  }
                >
                  {showPassword[field] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.098.2-2.155.57-3.13M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}

          {/* ✅ Submit */}
          <button
            type="submit"
            className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 text-center text-white/60 text-sm">or continue with</div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white text-sm">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.14-1.1-1.45-1.1-1.45-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.82.09-.64.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.56 1.38.21 2.4.11 2.65.64.7 1.03 1.59 1.03 2.67 0 3.85-2.34 4.7-4.57 4.95.36.31.69.92.69 1.85 0 1.33-.01 2.4-.01 2.72 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"
              />
            </svg>
            GitHub
          </button>
        </div>

        {/* 🔁 Login Redirect */}
        <p className="mt-5 text-center text-sm text-white/70">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#00ADB5] font-semibold hover:text-[#00C4CC] transition"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
