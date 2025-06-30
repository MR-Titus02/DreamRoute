import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Users,
  BookOpen,
  Home,
  Settings,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", href: "/admin", icon: Home },
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Course Management", href: "/admin/courses", icon: BookOpen },
    { title: "Institution Management", href: "/admin/institutions", icon: ShieldCheck }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#222831]">
        {/* Sidebar */}
        <Sidebar
          side="left"
          variant="sidebar"
          collapsible="offcanvas"
          className="border-none fixed h-full"
          style={{ width: "280px" }}
        >
          <div className="flex h-full flex-col bg-[#393E46] border-r border-gray-700 shadow-2xl">
          <SidebarHeader className="border-b border-black/20 p-5 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center">
                  <img src={Logo} alt="DreamRoute Logo" className="w-16 h-16" />
                </div>
                <h1 className="text-xl font-bold">DreamRoute Admin</h1>
              </div>
            </SidebarHeader>

            <SidebarContent className="flex-1 p-4">
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`w-full justify-start text-left p-3 rounded-xl transition-all duration-300 transform ${
                        isActive
                          ? "bg-[#00ADB5] text-white shadow-lg scale-105"
                          : "text-gray-300 hover:bg-gray-600/50 hover:scale-105 hover:shadow-md"
                      }`}
                    >
                      <a href={item.href} className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-300" />
                        <span className="font-medium">{item.title}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

              {/* Optional extra admin tools
              <div className="mt-8 p-4 bg-[#3B4758] rounded-xl border border-gray-600">
                <h3 className="text-sm font-semibold text-white mb-3">Admin Tools</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate("/admin/analytics")}
                    className="w-full justify-start bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90 shadow-sm border-0"
                  >
                    Analytics
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/reports")}
                    className="w-full justify-start bg-[#3D3A3A] text-white hover:bg-[#3D3A3A]/90 shadow-sm border-0"
                  >
                    Reports
                  </Button>
                </div>
              </div> */}
            </SidebarContent>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col ml-[280px] flex-1">
          {/* Header */}
          <header className="flex h-20 items-center justify-between bg-[#222831] px-6 border-b border-[#7F7F7F] shadow-sm text-gray-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="md:hidden text-white hover:bg-white/10" />
              <div>
              <h1 className="text-2xl font-bold">
    Welcome back, {user?.name || "Admin"}! 👋
  </h1>
  <p className="text-gray-400">Manage your platform effectively.</p>
              </div>
            </div>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center text-gray-700 font-medium text-sm hover:opacity-90 transition">
                    {user?.name?.[0]?.toUpperCase() || "A"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-[#2c3440] text-gray-300 border border-[#475569] shadow-lg mt-2">
                  <DropdownMenuItem
                    onClick={() => navigate("/admin/settings")}
                    className="hover:bg-[#3B4758] cursor-pointer"
                  >
                    ⚙️ Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#475569]" />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="hover:bg-[#3B4758] text-red-400 cursor-pointer"
                  >
                    🔓 Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 bg-[#222831] p-6">{children}</main>

          {/* Footer */}
          <footer className="bg-[#222831] border-t border-[#7F7F7F] py-4 text-center text-gray-400">
  <p>© 2025 DreamRoute Admin. All rights reserved.</p>
</footer>
        </div>

        <SidebarRail />
      </div>
    </SidebarProvider>
  );
}
