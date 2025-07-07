import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import InstitutionDashboardLayout from "../layouts/InstitutionLayout"; 

export default function InstitutionDashboard() {
  const [courseCount, setCourseCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourseStats = async () => {
      if (!user?.institution_id) {
        console.log("No institution_id found on user", user);
        return;
      }

      try {
        const res = await api.get(`/institutions/${user.institution_id}/courses`);
        setCourseCount(res.data.length || 0);
      } catch (err) {
        console.error("Error fetching courses for institution", err);
      }
    };

    fetchCourseStats();
  }, [user]);

  return (
    <InstitutionDashboardLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-[#3B4758] text-white shadow-md">
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#00ADB5]">{courseCount}</p>
          </CardContent>
        </Card>

        
      </div>
    </InstitutionDashboardLayout>
  );
}
