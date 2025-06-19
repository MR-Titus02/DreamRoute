import React from "react";

function LandingPage() {
  return (
    <div className="bg-[#0D1521] text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="text-xl font-bold flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span>DreamRoute</span>
        </div>
        <div className="space-x-4">
          <button className="text-sm text-gray-300 hover:text-white">Login</button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="text-center py-16 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
          Your Journey Begins with a Dream.
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          We Build the Route
        </h2>
        <p className="max-w-xl mx-auto text-gray-300 mb-8">
          Discover personalized career paths, find relevant courses, and get AI-powered guidance to achieve your professional goals.
        </p>
        <div className="bg-gray-600 w-full max-w-xl h-48 mx-auto rounded-lg shadow-inner" />
      </header>

      {/* Features */}
      <section className="bg-[#101C2B] py-12 px-4">
        <h3 className="text-center text-xl font-semibold mb-8">Why Choose DreamRoute?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-[#1F2D3D] p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-lg font-bold mb-2 text-cyan-400">AI Career Pathing</h4>
            <p className="text-gray-300 text-sm">
              Leverage generative AI to find curated career paths tailored to your goals and strengths.
            </p>
          </div>
          <div className="bg-[#1F2D3D] p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-lg font-bold mb-2 text-cyan-400">Tailored Roadmaps</h4>
            <p className="text-gray-300 text-sm">
              Visualize your journey with step-by-step tailored career roadmaps designed for your success.
            </p>
          </div>
          <div className="bg-[#1F2D3D] p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-lg font-bold mb-2 text-cyan-400">Course Finder</h4>
            <p className="text-gray-300 text-sm">
              Explore a curated list of free, paid, filtered-by-difficulty courses to enhance your skills.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-4 text-sm border-t border-gray-700">
        © 2025 DreamRoute. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
