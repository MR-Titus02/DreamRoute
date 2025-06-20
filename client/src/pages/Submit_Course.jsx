import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const InstitutionCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    duration: "",
    mode: "Online",
    link: "",
    price: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Course Request Submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({
      courseName: "",
      description: "",
      category: "",
      difficulty: "Beginner",
      duration: "",
      mode: "Online",
      link: "",
      price: "",
    });
  };

  const itCategories = [
    "Web Development",
    "Mobile App Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Blockchain",
    "Game Development",
    "AR/VR",
    "Digital Marketing",
    "IT Project Management",
    "Computer Networking",
    "Database Administration",
    "Software Testing",
    "Embedded Systems",
  ];

  const priceOptions = [
    "No Cost",
    "Below ₹1,000",
    "₹1,000 - ₹5,000",
    "₹5,000 - ₹10,000",
    "₹10,000 - ₹50,000",
    "₹50,000 - ₹1 Lakh",
    "₹1 Lakh - ₹5 Lakhs",
    "₹5 Lakhs - ₹10 Lakhs",
    "₹10 Lakhs - ₹20 Lakhs",
    "₹20 Lakhs or above",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222831] via-[#393E46] to-[#222831] text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-2 border-b border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="DreamRoute Logo" className="w-14 h-14 rounded shadow" />
          <h1 className="text-xl font-extrabold">DreamRoute</h1>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:text-white text-sm transition"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-2">Request to Add a Course</h2>
          <p className="text-center text-sm text-white/70 mb-6">
            Submit course details to be reviewed and added by an admin.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Course Name */}
            <div>
              <label className="text-sm text-white/80 block mb-1">Course Name</label>
              <input
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                onFocus={() => setFocused("courseName")}
                onBlur={() => setFocused("")}
                placeholder="e.g. Full Stack Web Development"
                required
                className={`w-full px-4 py-2 rounded-lg border bg-white/5 placeholder-white/50 text-white transition-all ${
                  focused === "courseName"
                    ? "border-[#00ADB5] shadow shadow-[#00ADB5]/30"
                    : "border-white/20 hover:border-white/40"
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-white/80 block mb-1">Course Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocused("description")}
                onBlur={() => setFocused("")}
                placeholder="Explain what this course covers"
                required
                className={`w-full px-4 py-2 rounded-lg border bg-white/5 placeholder-white/50 text-white h-28 resize-none transition-all ${
                  focused === "description"
                    ? "border-[#00ADB5] shadow shadow-[#00ADB5]/30"
                    : "border-white/20 hover:border-white/40"
                }`}
              />
            </div>

            {/* Category + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/80 block mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[#1F2D3D] text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"


                >
                  <option value="" disabled hidden>Select Category</option>
                  {itCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-white/80 block mb-1">Price</label>
                <select
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[#1F2D3D] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"

                >
                  <option value="">Select Price</option>
                  {priceOptions.map((price) => (
                    <option key={price} value={price}>
                      {price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty + Duration + Mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-white/80 block mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1F2D3D] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"

                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-white/80 block mb-1">Duration</label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 6 weeks"
                  className="w-full px-4 py-2 rounded-lg bg-[#1F2D3D] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"

                />
              </div>

              <div>
                <label className="text-sm text-white/80 block mb-1">Mode</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1F2D3D] text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"

                >
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>

            {/* Course Link (optional) */}
            <div>
              <label className="text-sm text-white/80 block mb-1">Course Link (optional)</label>
              <input
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="e.g. https://..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 text-white placeholder-white/50 border border-white/20"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] text-white font-semibold py-2 rounded-lg hover:from-[#00C4CC] hover:to-[#00ADB5] transition-all hover:shadow-lg hover:scale-[1.01]"
            >
              Submit Course Request
            </button>

            {submitted && (
              <p className="text-center text-green-400 mt-2">
                Course request sent successfully.
              </p>
            )}
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-4 text-sm border-t border-white/10 bg-black/10 backdrop-blur-sm">
        © 2025 DreamRoute. All rights reserved.
      </footer>
    </div>
  );
};

export default InstitutionCourse;
