import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import axios from "../api/axios";
import { useAuth } from '@/context/AuthContext';

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const [formData, setFormData] = useState({
    name: "",        
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [focusedField, setFocusedField] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, email, password, confirmPassword } = formData;
  
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }
  
    try {
      const payload = {
        name,
        email,
        password,
        role: "student", // default role
      };
  
      const res = await axios.post("/auth/register", payload);

      // Destructure user and token from response data
      const { user, token } = res.data;

      // Use AuthContext login to set global auth state
      login(user, token);

      // Navigate to user details page after successful register + login
      navigate("/userdetails");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#222831] via-[#393E46] to-[#222831] relative overflow-hidden flex flex-col justify-between">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-[#00ADB5] rounded-full mix-blend-multiply filter blur-lg opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#EEEEEE] rounded-full mix-blend-multiply filter blur-lg opacity-10 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00ADB5] rounded-full mix-blend-multiply filter blur-2xl opacity-5"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 lg:px-8 bg-black/10 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <img
            src={Logo}
            alt="DreamRoute Logo"
            className="w-16 h-16 rounded-lg shadow-lg"
          />
          <h1 className="font-kaisei-tokumin font-extrabold text-lg lg:text-xl text-white">
            DreamRoute
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white px-3 py-1 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs"
          >
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col flex-grow px-4 py-2">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-2">
            <h2 className="font-inter font-bold text-2xl lg:text-3xl text-white mb-1">
              Join{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE]">
                DreamRoute
              </span>
            </h2>
            <p className="text-white/70 text-sm font-inter">
              Start your journey to extraordinary destinations
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 shadow-xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-3">
              <h3 className="text-lg font-bold text-white text-center mb-4 font-inter">
                Create Account
              </h3>

              {/* Name Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/90 font-inter">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-white placeholder-white/50 font-inter transition-all duration-300 ${
                    focusedField === "name"
                      ? "border-[#00ADB5] shadow-lg shadow-[#00ADB5]/25 bg-white/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/90 font-inter">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-white placeholder-white/50 font-inter transition-all duration-300 ${
                    focusedField === "email"
                      ? "border-[#00ADB5] shadow-lg shadow-[#00ADB5]/25 bg-white/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/90 font-inter">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-white placeholder-white/50 font-inter transition-all duration-300 ${
                    focusedField === "password"
                      ? "border-[#00ADB5] shadow-lg shadow-[#00ADB5]/25 bg-white/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                  placeholder="Create a strong password"
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/90 font-inter">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-white placeholder-white/50 font-inter transition-all duration-300 ${
                    focusedField === "confirmPassword"
                      ? "border-[#00ADB5] shadow-lg shadow-[#00ADB5]/25 bg-white/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-1 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00ADB5]/30 focus:outline-none focus:ring-4 focus:ring-[#00ADB5]/50 font-inter"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/60 font-inter">
                    or continue with
                  </span>
                </div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-1 cursor-pointer border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  {/* Google Icon */}
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-1 cursor-pointer border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  {/* GitHub Icon */}
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-white/70 font-inter">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#00ADB5] hover:text-[#00C4CC] font-semibold transition-colors duration-300"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 bg-black/10 backdrop-blur-sm border-t border-white/10 text-center text-white">
        <p>© 2025 DreamRoute. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SignUp;
