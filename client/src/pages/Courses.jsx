import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/layouts/DashboardLayout"; 

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  // const [limit, setLimit] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  // const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;




  const totalPages = Math.ceil(filteredCourses.length / limit);

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  )

  useEffect(() => {
    const fetchCoursesAndInstitutions = async () => {
      try {
        const [coursesRes, institutionsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/courses"),
          axios.get("http://localhost:5000/api/institutions")
        ]);

        const coursesData = coursesRes.data;
        const institutionsData = institutionsRes.data;

        if (!Array.isArray(coursesData) || !Array.isArray(institutionsData)) {
          console.error("Unexpected API response format");
          return;
        }

        const updatedCourses = coursesData.map((course) => {
          const inst = institutionsData.find(
            (i) => i.id === course.institution_id
          );
          return {
            ...course,
            institution_name: inst ? inst.name : "Institution Unknown",
          };
        });

        setInstitutions(institutionsData);
        setCourses(updatedCourses);
        setFilteredCourses(updatedCourses);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchCoursesAndInstitutions();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(lowerSearch) ||
        course.description.toLowerCase().includes(lowerSearch);

      const matchesInstitution = selectedInstitution
        ? course.institution_id === parseInt(selectedInstitution)
        : true;

      const matchesDuration =
        (!minDuration || parseInt(course.duration) >= parseInt(minDuration)) &&
        (!maxDuration || parseInt(course.duration) <= parseInt(maxDuration));

      const matchesPrice =
        (!minPrice || parseFloat(course.price) >= parseFloat(minPrice)) &&
        (!maxPrice || parseFloat(course.price) <= parseFloat(maxPrice));

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesDuration &&
        matchesPrice
      );
    });

    setFilteredCourses(filtered);
  }, [searchTerm, selectedInstitution, minDuration, maxDuration, minPrice, maxPrice, courses]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-center mb-6 text-green-400">
        🎓 Explore Available Courses
      </h1>

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Input
          type="text"
          placeholder="Search by course title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 bg-white text-black"
        />

        <select
          value={selectedInstitution}
          onChange={(e) => setSelectedInstitution(e.target.value)}
          className="bg-white text-black p-2 rounded"
        >
          <option value="">All Institutions</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>

        <Input
          type="number"
          placeholder="Min Duration (weeks)"
          value={minDuration}
          onChange={(e) => setMinDuration(e.target.value)}
          className="w-40 bg-white text-black"
        />
        <Input
          type="number"
          placeholder="Max Duration (weeks)"
          value={maxDuration}
          onChange={(e) => setMaxDuration(e.target.value)}
          className="w-40 bg-white text-black"
        />

        
        <Input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-40 bg-white text-black"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {paginatedCourses.map((course) => (
          <Card
            key={course.id}
            className="bg-[#334155] p-5 rounded-xl text-white border border-[#475569] hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-sm text-gray-300 line-clamp-3 mb-3">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-indigo-600 text-white px-2 py-1 text-xs rounded-full">
                {course.duration || "Flexible"} weeks
              </span>
              <span className="bg-green-600 text-white px-2 py-1 text-xs rounded-full">
                ₹{course.price || "0"}
              </span>
            </div>
            <p className="text-sm text-gray-400 italic">
              {course.institution_name}
            </p>
          </Card>
        ))}
      
      </div>

      {filteredCourses.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No courses match your filters.
        </p>
      )}

{filteredCourses.length > limit && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              className="bg-accent text-primary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-neutral-text">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              className="bg-accent text-primary"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
    </DashboardLayout>
  );
}
