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
      <h1 className="text-3xl font-bold text-center mb-6 text-green-400">
        🎓 Explore Available Courses
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Input
          type="text"
          placeholder="Search by title or description..."
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

      {/* Courses Grid */}
      <div
        id="course-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        {paginatedCourses.map((course) => (
          <Card
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="cursor-pointer bg-[#334155] p-5 min-h-[250px] flex flex-col justify-between rounded-xl text-white border border-[#475569] hover:shadow-md transition-all"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-sm text-gray-300 line-clamp-3 mb-3">
                {course.description}
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-indigo-600 text-white px-2 py-1 text-xs rounded-full">
                  {course.duration || "Flexible"} weeks
                </span>
                <span className="bg-green-600 text-white px-2 py-1 text-xs rounded-full">
                  ₹{course.price || "0"}
                </span>
              </div>
              <p className="text-sm text-gray-400 italic">
                {course.institution?.name || "Institution Unknown"}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No courses match your filters.
        </p>
      )}

      {/* Pagination */}
      {filteredCourses.length > limit && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <Button
            className="bg-[#00ADB5] hover:bg-[#00C4CC] text-white px-4 py-2 rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅️ Previous
          </Button>

          <span className="text-white font-semibold text-sm sm:text-base">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            className="bg-[#00ADB5] hover:bg-[#00C4CC] text-white px-4 py-2 rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next ➡️
          </Button>
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
        >
          <div
            ref={modalRef}
            className="bg-[#1E293B] text-[#EEEEEE] rounded-2xl shadow-xl w-full max-w-2xl p-6 relative border border-[#334155] 
              transform transition-all duration-300 ease-out
              opacity-100 translate-y-0
              "
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-3xl font-bold text-[#00C4CC] hover:text-[#00ADB5]"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-[#00ADB5]">
              {selectedCourse.title}
            </h2>

            <p className="mb-3 text-gray-300">{selectedCourse.description}</p>

            <div className="mb-4 flex gap-4 text-sm">
              <span className="bg-indigo-600 text-white px-2 py-1 rounded">
                Duration: {selectedCourse.duration} weeks
              </span>
              <span className="bg-green-600 text-white px-2 py-1 rounded">
                Price: ₹{selectedCourse.price}
              </span>
            </div>

            {selectedCourse.institution && (
              <div className="mt-4 border-t border-[#334155] pt-4">
                <h3 className="text-lg font-semibold mb-2 text-[#00ADB5]">
                  Offered By: {selectedCourse.institution.name}
                </h3>
                <p className="text-sm text-gray-400 mb-1">
                  📍 Address: {selectedCourse.institution.address}
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  📧 Email: {selectedCourse.institution.email}
                </p>
                <p className="text-sm text-gray-300">
                  📝 {selectedCourse.institution.description}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleApplyNow}
                className="bg-[#00ADB5] hover:bg-[#00C4CC] text-white px-6 py-2 rounded font-semibold transition"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
