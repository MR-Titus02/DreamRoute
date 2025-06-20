import React from "react";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#222831] via-[#393E46] to-[#222831] min-h-screen text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-700 bg-black/10 backdrop-blur-sm">
        <div className="text-xl font-bold flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-20 h-20" />
          <span>DreamRoute</span>
        </div>
        <div className="space-x-4">
          <button onClick={() => navigate("/login")} className="text-sm text-gray-300 hover:text-white">
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-1 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00ADB5]/30 focus:outline-none focus:ring-4 focus:ring-[#00ADB5]/50 font-inter"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="text-center py-16 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00ADB5] mb-2">
          Your Journey Begins with a Dream.
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          We Build the Route.
        </h2>
        <p className="max-w-xl mx-auto text-gray-300 mb-8">
          Discover personalized career paths, find relevant courses, and get AI-powered guidance to achieve your professional goals.
        </p>
        <div className="bg-gray-600 w-full max-w-xl h-48 mx-auto rounded-lg shadow-inner" />
      </header>

      {/* Features */}
      <section className="bg-white/5 backdrop-blur-md py-12 px-4">
        <h3 className="text-center text-xl font-semibold mb-8">Why Choose DreamRoute?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg shadow hover:shadow-lg border border-white/10 transition">
            <div className="flex items-center gap-2 mb-2">
              {/* Brain Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                <path d="M9 13a4.5 4.5 0 0 0 3-4" />
                <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                <path d="M6 18a4 4 0 0 1-1.967-.516" />
                <path d="M12 13h4" />
                <path d="M12 18h6a2 2 0 0 1 2 2v1" />
                <path d="M12 8h8" />
                <path d="M16 8V5a2 2 0 0 1 2-2" />
                <circle cx="16" cy="13" r=".5" />
                <circle cx="18" cy="3" r=".5" />
                <circle cx="20" cy="21" r=".5" />
                <circle cx="20" cy="8" r=".5" />
              </svg>
              <h4 className="text-lg font-bold text-cyan-400">AI Career Pathing</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Leverage generative AI to find curated career paths tailored to your goals and strengths.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg shadow hover:shadow-lg border border-white/10 transition">
            <div className="flex items-center gap-2 mb-2">
              {/* Briefcase Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
              <h4 className="text-lg font-bold text-cyan-400">Tailored Roadmaps</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Visualize your journey with step-by-step tailored career roadmaps designed for your success.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg shadow hover:shadow-lg border border-white/10 transition">
            <div className="flex items-center gap-2 mb-2">
              {/* Lightbulb Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
              <h4 className="text-lg font-bold text-cyan-400">Course Finder</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Explore a curated list of free, paid, filtered-by-difficulty courses to enhance your skills.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-4 text-sm border-t border-gray-700 bg-black/10 backdrop-blur-sm">
        © 2025 DreamRoute. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
