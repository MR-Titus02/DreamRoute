import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";




export default function InstitutionDashboard() {
  const [courseCount, setCourseCount] = useState(0);
  const { user } = useAuth();
  console.log("User in InstitutionDashboard:", user);
  useEffect(() => {
    const fetchCourseStats = async () => {
      if (!user?.institution_id) {
        console.log("No institution_id found on user", user);
        return;
      }
  
      try {
        console.log("Fetching courses for institution:", user.institution_id);
        const res = await api.get(`/institutions/${user.institution_id}/courses`);
        console.log("Courses response:", res);
        setCourseCount(res.data.length || 0);
      } catch (err) {
        console.error("Error fetching courses for institution", err);
      }
    };
  
    fetchCourseStats();
  }, [user]);
  
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-[#3B4758] text-white shadow-md">
        <CardHeader>
          <CardTitle>Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-[#00ADB5]">{courseCount}</p>
        </CardContent>
      </Card>

      {/* Additional stats can go here */}
    </div>
  );
}
