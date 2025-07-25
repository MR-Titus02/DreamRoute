import React, { useEffect, useState, useRef } from "react";
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
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const modalRef = useRef(null);

  const limit = 6;
  const totalPages = Math.ceil(filteredCourses.length / limit);

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  useEffect(() => {
    const fetchCoursesAndInstitutions = async () => {
      try {
        const [coursesRes, institutionsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/courses"),
          axios.get("http://localhost:5000/api/institutions"),
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
            institution: inst || null,
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
        !maxPrice || parseFloat(course.price) <= parseFloat(maxPrice);

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesDuration &&
        matchesPrice
      );
    });

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedInstitution,
    minDuration,
    maxDuration,
    maxPrice,
    courses,
  ]);

  // Scroll to grid on page change
  useEffect(() => {
    const gridTop = document.getElementById("course-grid")?.offsetTop || 0;
    window.scrollTo({ top: gridTop - 100, behavior: "smooth" });
  }, [currentPage]);

  // Close modal if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectedCourse && modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedCourse(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCourse]);

  const closeModal = () => setSelectedCourse(null);

  const handleApplyNow = () => {
    // Here you can redirect to an application form or payment page
    alert(`Apply Now clicked for course: ${selectedCourse.title}`);
  };
  
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            🎓 Explore Available Courses
          </h1>
  
          {/* Filters - Enhanced */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center items-end">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <Input
                type="text"
                placeholder="Course title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
  
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">All Institutions</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration (weeks)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                  className="w-20 bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  className="w-20 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
  
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Price (₹)</label>
              <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Any price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full sm:w-32 bg-gray-700 border-gray-600 text-white"
              />
              <Input
                type="number"
                placeholder="Any price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full sm:w-32 bg-gray-700 border-gray-600 text-white"
              />
              </div>
            </div>
          </div>
  
          {/* Courses Grid - Enhanced */}
          <div
            id="course-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedCourses.map((course) => (
              <Card
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="cursor-pointer bg-gray-800 p-5 min-h-[250px] flex flex-col justify-between rounded-xl border border-gray-700 hover:border-cyan-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                    {course.description}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-indigo-600/80 text-white px-3 py-1 text-xs rounded-full">
                      {course.duration || "Flexible"} weeks
                    </span>
                    <span className="bg-green-600/80 text-white px-3 py-1 text-xs rounded-full">
                      ₹{course.price || "Free"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 italic">
                    {course.institution?.name || "Institution Unknown"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
  
          {/* No Results - Enhanced */}
          {filteredCourses.length === 0 && (
            <div className="text-center mt-12 py-8 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="text-gray-400 text-lg mb-2">No courses match your filters</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedInstitution("");
                  setMinDuration("");
                  setMaxDuration("");
                  setMaxPrice("");
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          )}
  
          {/* Pagination - Enhanced */}
          {filteredCourses.length > limit && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
              <div className="text-sm text-gray-400">
                Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, filteredCourses.length)} of {filteredCourses.length} courses
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={`min-w-[40px] ${currentPage === pageNum ? 'bg-cyan-500 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
  
          {/* Course Details Modal - Enhanced */}
          {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div
                ref={modalRef}
                className="relative bg-gray-800 text-gray-100 rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-700 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                
                <div className="p-6">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
  
                  <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {selectedCourse.title}
                  </h2>
  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-indigo-600/80 text-white px-3 py-1 text-xs rounded-full">
                      {selectedCourse.duration} weeks
                    </span>
                    <span className="bg-green-600/80 text-white px-3 py-1 text-xs rounded-full">
                      ₹{selectedCourse.price}
                    </span>
                  </div>
  
                  <p className="mb-6 text-gray-300">{selectedCourse.description}</p>
  
                  {selectedCourse.institution && (
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <h3 className="text-lg font-semibold mb-3 text-cyan-400">Offered By</h3>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-medium text-white">{selectedCourse.institution.name}</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-300">
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {selectedCourse.institution.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {selectedCourse.institution.email}
                          </p>
                        </div>
                        <p className="mt-3 text-sm text-gray-400">
                          {selectedCourse.institution.description}
                        </p>
                      </div>
                    </div>
                  )}
  
                  <div className="mt-8 flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handleApplyNow}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }