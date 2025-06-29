import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Target,
  Brain,
  Award,
  ChevronRight,
  BarChart3,
  Calendar,
  Clock,
  Zap,
  Star,
  ArrowUpRight,
  Activity,
  PieChart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "../assets/logo.png"; 
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Overview", href: "/dashboard", icon: BarChart3, active: true },
    // { title: "AI Career Path", href: "/dashboard/career-path", icon: Brain },
    // { title: "My Roadmap", href: "/dashboard/roadmap", icon: Target },
    { title: "Find Courses", href: "/dashboard/courses", icon: BookOpen },
    { title: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { title: "Settings", href: "/dashboard/settings", icon: Users },
  ];

  const recentActivities = [
    {
      action: "Completed React Advanced Course",
      time: "2 hours ago",
      type: "course",
    },
    { action: "Updated Career Roadmap", time: "1 day ago", type: "roadmap" },
    {
      action: "Earned Full-Stack Developer Badge",
      time: "3 days ago",
      type: "achievement",
    },
    { action: "Started AI/ML Learning Path", time: "1 week ago", type: "path" },
  ];

  return (
    <div className="min-h-screen bg-[#222831]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
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

              <SidebarContent className="flex-1 p-4 ">
                <SidebarMenu className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`w-full justify-start text-left p-3 rounded-xl transition-all duration-300 transform ${
                            item.active
                              ? "bg-[#00ADB5] text-white shadow-lg scale-105"
                              : "text-white hover:bg-gray-600/50 hover:scale-105 hover:shadow-md"
                          }`}
                        >
                          <a
                            href={item.href}
                            className="flex items-center space-x-3"
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                            {item.active && (
                              <ChevronRight className="w-4 h-4 ml-auto" />
                            )}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>

                <div className="mt-8 p-4 bg-[#3B4758] rounded-xl border border-gray-600">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Career Tools
                  </h3>
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

          <div className="flex flex-col ml-[280px] flex-1">
            <header className="flex h-20 items-center justify-between bg-[#222831] px-6 border-b border-[#7F7F7F] shadow-sm">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden text-white hover:bg-white/10" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Welcome back, {user?.name || "Learner"}! 👋
                  </h1>
                  <p className="text-gray-300">
                    Let's continue building your career path.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium text-sm">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </header>

            <main className="flex-1 bg-[#222831] p-6 space-y-6">
              {/* Here you can insert more stats or insights about the career plan */}
              <Card className="border-0 shadow-xl bg-[#3B4758]">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-semibold">
                    Latest Career Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Based on your profile and interests, your ideal path is Full Stack Web Development.
                    Click below to explore your roadmap.
                  </p>
                  <Button
                    onClick={() => navigate("/dashboard/roadmap")}
                    className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  >
                    View Roadmap
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-[#3B4758]">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-semibold">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-600/30 hover:bg-gray-600/50 transition-colors"
                      >
                        <div className="w-2 h-2 bg-[#00ADB5] rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-300">
                            {activity.time}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-[#3D3A3A] text-white"
                        >
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </main>

            <footer className="bg-[#222831] border-t border-[#7F7F7F] py-4">
              <div className="text-center px-6">
                <p className="text-white text-sm">
                  © 2025 DreamRoute. Empowering careers with AI-driven insights.
                </p>
              </div>
            </footer>
          </div>
        </div>
        <SidebarRail />
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
