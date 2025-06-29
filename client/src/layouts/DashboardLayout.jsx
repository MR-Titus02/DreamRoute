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
  TrendingUp,
  Users,
  BookOpen,
  BarChart3,
  ChevronRight,
  Zap,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/assets/logo.png";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: "Overview", href: "/dashboard", icon: BarChart3 },
    { title: "Find Courses", href: "/dashboard/courses", icon: BookOpen },
    { title: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { title: "Settings", href: "/dashboard/settings", icon: Users },
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
            <SidebarHeader className="border-b border-black/20 p-5">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center">
                  <img src={Logo} alt="DreamRoute Logo" className="w-16 h-16" />
                </div>
                <h1 className="text-xl font-bold text-white">DreamRoute</h1>
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
                            : "text-white hover:bg-gray-600/50 hover:scale-105 hover:shadow-md"
                        }`}
                      >
                        <a href={item.href} className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                          {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

              <div className="mt-8 p-4 bg-[#3B4758] rounded-xl border border-gray-600">
                <h3 className="text-sm font-semibold text-white mb-3">Career Tools</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate("/dashboard/career-path")}
                    className="w-full justify-start bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90 shadow-sm border-0"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate AI Path
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard/roadmap")}
                    className="w-full justify-start bg-[#3D3A3A] text-white hover:bg-[#3D3A3A]/90 shadow-sm border-0"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    View My Roadmap
                  </Button>
                </div>
              </div>
            </SidebarContent>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col ml-[280px] flex-1">
          {/* Header */}
          <header className="flex h-20 items-center justify-between bg-[#222831] px-6 border-b border-[#7F7F7F] shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="md:hidden text-white hover:bg-white/10" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user?.name || "Learner"}! 👋
                </h1>
                <p className="text-gray-300">
                  Let’s continue building your career path.
                </p>
              </div>
            </div>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center text-gray-700 font-medium text-sm hover:opacity-90 transition">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-[#2c3440] text-white border border-[#475569] shadow-lg mt-2">
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/settings")}
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
          <footer className="bg-[#222831] border-t border-[#7F7F7F] py-4 text-center">
            <p className="text-white text-sm">
              © 2025 DreamRoute. Empowering careers with AI-driven insights.
            </p>
          </footer>
        </div>
      </div>

      <SidebarRail />
      {user && <ChatBot userId={user.id} />}
    </SidebarProvider>
  );
}
