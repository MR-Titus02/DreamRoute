import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Career Guidance",
      description:
        "Get personalized career recommendations based on your skills, interests, and market trends.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      title: "Custom Learning Roadmaps",
      description:
        "Follow step-by-step learning paths tailored to your career goals and current skill level.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Curated Course Library",
      description:
        "Access thousands of high-quality courses from top platforms and universities worldwide.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Monitor your learning progress with detailed analytics and achievement milestones.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Learners" },
    { number: "500+", label: "Career Paths" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Career Platform
            </Badge>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Chart Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dream Career
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Unlock your potential with AI-driven career guidance, personalized
              learning paths, and expert insights that adapt to your unique
              journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-4 h-auto"
              >
                <a href="/dashboard" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4 h-auto hover:scale-105 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DreamRoute?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of career development with our cutting-edge
              AI technology and personalized approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:text-purple-600 transition-colors">
                          Learn more
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers
            with DreamRoute's AI-powered guidance.
          </p>
          <Button
            asChild
            className="bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-4 h-auto font-semibold"
          >
            <a href="/dashboard" className="flex items-center">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2025 DreamRoute. Empowering careers with AI-driven insights.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
