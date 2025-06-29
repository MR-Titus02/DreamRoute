import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Card className="bg-[#3B4758] text-white border-0 shadow-xl mb-6">
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
    </DashboardLayout>
  );
}
