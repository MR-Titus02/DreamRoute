import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Simulate signup success and navigate to dashboard
    navigate("/dashboard");
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
      <header className="relative z-10 flex items-center justify-between px-4 lg:px-8 py-2 bg-black/10 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F695e717eeae345fe9c4e2371d3d38c50%2F3f1c97cc2466444ca6af5530dd3bfb31"
            alt="DreamRoute Logo"
            className="w-8 h-8 rounded-lg shadow-lg"
          />
          <h1 className="font-kaisei-tokumin font-extrabold text-lg lg:text-xl text-white">
            DreamRoute
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="text-white/80 hover:text-white transition-colors duration-300 font-inter text-xs"
          >
            Login
          </button>
          <button className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white px-3 py-1 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs">
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col flex-grow px-4 py-4">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-4">
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
                className="w-full bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00ADB5]/30 focus:outline-none focus:ring-4 focus:ring-[#00ADB5]/50 font-inter"
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
                  className="flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
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
                  className="flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
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
