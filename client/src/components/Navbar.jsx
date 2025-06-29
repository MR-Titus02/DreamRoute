import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: "Overview", path: "/dashboard" },
    { title: "Find Courses", path: "/dashboard/courses" },
    { title: "Analytics", path: "/dashboard/analytics" },
    { title: "Settings", path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    logout(); // from AuthContext
    navigate("/login");
  };

  return (
    <nav className="bg-[#222831] text-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left: Logo & App Name */}
      <div className="flex items-center gap-4">
        <img src={Logo} alt="DreamRoute Logo" className="w-10 h-10 rounded" />
        <h1 className="text-xl font-bold">DreamRoute</h1>
      </div>

      {/* Center: Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        {menuItems.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className={`text-sm font-medium hover:text-green-400 transition ${
              location.pathname === item.path ? "text-green-400" : "text-white"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Right: Welcome + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          👋 {user?.name || "User"}
        </span>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
