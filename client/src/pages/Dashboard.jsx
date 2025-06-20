import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import Logo from "../assets/logo.png"; 

const Dashboard = () => {
  const menuItems = [
    { title: "Overview", href: "/dashboard", icon: BarChart3, active: true },
    { title: "AI Career Path", href: "/dashboard/career-path", icon: Brain },
    { title: "My Roadmap", href: "/dashboard/roadmap", icon: Target },
    { title: "Find Courses", href: "/dashboard/courses", icon: BookOpen },
    { title: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { title: "Settings", href: "/dashboard/settings", icon: Users },
  ];

  const stats = [
    {
      title: "Learning Progress",
      value: "68%",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-[#00ADB5]",
    },
    {
      title: "Courses Completed",
      value: "24",
      change: "+3 this week",
      trend: "up",
      icon: BookOpen,
      color: "bg-[#00ADB5]",
    },
    {
      title: "Skill Score",
      value: "8.9",
      change: "+0.5",
      trend: "up",
      icon: Award,
      color: "bg-[#00ADB5]",
    },
    {
      title: "Career Goals",
      value: "5/7",
      change: "2 remaining",
      trend: "neutral",
      icon: Target,
      color: "bg-[#00ADB5]",
    },
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

  const progressData = [
    { month: "Jan", progress: 20 },
    { month: "Feb", progress: 35 },
    { month: "Mar", progress: 45 },
    { month: "Apr", progress: 55 },
    { month: "May", progress: 68 },
    { month: "Jun", progress: 75 },
  ];

  const skillsData = [
    { name: "Frontend", value: 85, color: "#00ADB5" },
    { name: "Backend", value: 70, color: "#00ADB5" },
    { name: "DevOps", value: 60, color: "#3D3A3A" },
    { name: "AI/ML", value: 40, color: "#3D3A3A" },
  ];

  return (
    <div className="min-h-screen bg-[#222831]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Modern Sidebar */}
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

                {/* Quick Actions */}
                <div className="mt-8 p-4 bg-[#3B4758] rounded-xl border border-gray-600">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90 shadow-sm border-0">
                      <Zap className="w-4 h-4 mr-2" />
                      Generate AI Path
                    </Button>
                    <Button className="w-full justify-start bg-[#3D3A3A] text-white hover:bg-[#3D3A3A]/90 shadow-sm border-0">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Courses
                    </Button>
                  </div>
                </div>
              </SidebarContent>
            </div>
          </Sidebar>

          {/* Main Content */}
          <div className="flex flex-col ml-[280px] flex-1"> {/* Changed SidebarInset to div with margin */}
            {/* Modern Header */}
            <header className="flex h-20 items-center justify-between bg-[#222831] px-6 border-b border-[#7F7F7F] shadow-sm">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden text-white hover:bg-white/10" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Good morning, Alex! 👋
                  </h1>
                  <p className="text-gray-300">
                    Ready to continue your learning journey?
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* <Button className="bg-[#00ADB5] text-white shadow-lg hover:bg-[#00ADB5]/90 hover:shadow-xl transition-all duration-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button> */}
                <div className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium text-sm">AS</span>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <main className="flex-1 bg-[#222831] p-6 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="relative overflow-hidden border-0 shadow-xl bg-[#3B4758] hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">
                          {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          {stat.trend === "up" && (
                            <ArrowUpRight className="h-3 w-3 text-[#00ADB5]" />
                          )}
                          <span
                            className={
                              stat.trend === "up"
                                ? "text-[#00ADB5]"
                                : "text-gray-400"
                            }
                          >
                            {stat.change}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Chart */}
                <Card className="border-0 shadow-xl bg-[#3B4758] hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Activity className="w-5 h-5 text-[#00ADB5] group-hover:scale-110 transition-transform duration-300" />
                      <span>Learning Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={progressData}>
                        <defs>
                          <linearGradient
                            id="colorProgress"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3B82F6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3B82F6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="progress"
                          stroke="#3B82F6"
                          fillOpacity={1}
                          fill="url(#colorProgress)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Skills Distribution */}
                <Card className="border-0 shadow-xl bg-[#3B4758] hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <PieChart className="w-5 h-5 text-[#00ADB5] group-hover:scale-110 transition-transform duration-300" />
                      <span>Skills Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skillsData.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: skill.color }}
                            />
                            <span className="text-sm font-medium text-white">
                              {skill.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${skill.value}%`,
                                  backgroundColor: skill.color,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-white">
                              {skill.value}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity and Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="border-0 shadow-xl bg-[#3B4758]">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Clock className="w-5 h-5 text-[#00ADB5]" />
                      <span>Recent Activity</span>
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

                {/* AI Recommendations */}
                <Card className="border-0 shadow-xl bg-[#3B4758] border border-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Brain className="w-5 h-5 text-[#00ADB5]" />
                      <span>AI Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* <div className="p-4 bg-[#D9D9D9] rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-[#00ADB5]" />
                        <span className="font-medium text-gray-900">
                          Next Course
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Based on your progress, we recommend taking "Advanced
                        React Patterns" next.
                      </p>
                      <Button className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-white">
                        Start Course
                      </Button>
                    </div> */}

                    <div className="p-4 bg-[#D9D9D9] rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-[#00ADB5]" />
                        <span className="font-medium text-gray-900">
                          Career Goal
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        You're 75% towards becoming a Senior Full-Stack
                        Developer.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-[#3D3A3A] text-[#3D3A3A] hover:bg-[#3D3A3A] hover:text-white"
                      >
                        View Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* Modern Footer */}
            <footer className="bg-[#222831] border-t border-[#7F7F7F] py-4">
              <div className="text-center px-6">
                <p className="text-white text-sm">
                  © 2025 DreamRoute. Empowering careers with AI-driven
                  insights.
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