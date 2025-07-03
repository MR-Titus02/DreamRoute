import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/logo.png";
import HeroBgImg from "../assets/bg.png"; // Your uploaded hero bg

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    title: "AI Career Pathing",
    desc: "Leverage generative AI to find curated career paths tailored to your goals and strengths.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    ),
  },
  {
    title: "Tailored Roadmaps",
    desc: "Visualize your journey with step-by-step tailored career roadmaps designed for your success.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </svg>
    ),
  },
  {
    title: "Course Finder",
    desc: "Explore a curated list of free, paid, filtered-by-difficulty courses to enhance your skills.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#222831] via-[#393E46] to-[#222831] min-h-screen text-white flex flex-col font-inter relative overflow-x-hidden">
      {/* FULL PAGE BG IMAGE */}
      <img
        src={HeroBgImg}
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover opacity-70 -z-10"
        draggable={false}
      />

      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-700 bg-black/10 backdrop-blur-lg z-20 relative">
        <div className="text-xl font-bold flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-12 h-12" />
          <span className="text-cyan-300 tracking-wide">DreamRoute</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md animate-pulse"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <section className="w-full relative flex items-center justify-center min-h-[70vh] py-10">
        <img
          src={HeroBgImg}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          style={{ zIndex: 0 }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        {/* Overlay content */}
        <div className="relative z-20 text-center w-full px-2 py-5 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-1 drop-shadow-lg"
          >
            Your Journey Begins with a Dream.
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-semibold mb-6 text-white"
          >
            We Build the Route.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="max-w-xl mx-auto text-gray-200 mb-8"
          >
            Discover personalized career paths, find relevant courses, and get AI-powered guidance to achieve your professional goals.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg animate-pulse text-lg"
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white/5 backdrop-blur-md py-16 px-4 pt-24">
        <h3 className="text-center text-2xl font-semibold mb-12 text-cyan-200">
          Why Choose DreamRoute?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-lg shadow hover:shadow-xl border border-white/10 transition"
            >
              <div className="flex items-center gap-2 mb-3 text-cyan-400">
                {feature.icon}
                <h4 className="text-lg font-bold">{feature.title}</h4>
              </div>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Educational Institutions Section */}
      <section className="w-full bg-transparent py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* LEFT */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-3">
              For Educational Institutions
            </h2>
            <p className="text-gray-200 text-lg mb-8">
              Partner with DreamRoute to provide comprehensive career guidance to your students. Access analytics, track student progress, and enhance your career counseling services.
            </p>
            <ul className="space-y-3 mb-8 text-base">
              <li className="flex items-center gap-2 text-gray-100">
                <span>
                  {/* Student Analytics Dashboard icon */}
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12"/><circle cx="12" cy="14" r="3"/></svg>
                </span>
                Student Analytics Dashboard
              </li>
              <li className="flex items-center gap-2 text-gray-100">
                <span>
                  {/* Progress Tracking icon */}
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="6" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                Progress Tracking
              </li>
              <li className="flex items-center gap-2 text-gray-100">
                <span>
                  {/* Multi-User Management icon */}
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="17" cy="7" r="4"/></svg>
                </span>
                Multi-User Management
              </li>
            </ul>
            <button
              onClick={() => navigate("/institution-login")}
              className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-full text-lg transition-all shadow-md"
            >
              {/* Login Arrow icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              Institution Register
            </button>
          </div>
          {/* RIGHT */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Success Metrics Box */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow border border-white/10 mb-2">
              <h4 className="text-xl font-semibold text-cyan-300 mb-5">Success Metrics</h4>
              <div className="flex flex-col gap-4 text-cyan-200">
                <div className="flex justify-between items-center border-b border-cyan-900/40 pb-3">
                  <span className="text-2xl md:text-3xl font-bold">95%</span>
                  <span className="text-base text-cyan-100">Student Satisfaction</span>
                </div>
                <div className="flex justify-between items-center border-b border-cyan-900/40 pb-3">
                  <span className="text-2xl md:text-3xl font-bold">2,500+</span>
                  <span className="text-base text-cyan-100">Students Guided</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl md:text-3xl font-bold">150+</span>
                  <span className="text-base text-cyan-100">Partner Institutions</span>
                </div>
              </div>
            </div>
            {/* Institution Dashboard Box */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow border border-white/10 flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-lg font-semibold text-cyan-300">Institution Dashboard</h5>
                <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full px-3 py-1">Live Analytics</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: "80%" }} />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 text-gray-200 text-sm">
                <span>Active Students: <span className="font-semibold text-cyan-200">245</span></span>
                <span>Completed Paths: <span className="font-semibold text-cyan-200">189</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 text-sm border-t border-gray-700 bg-black/10 backdrop-blur-sm mt-auto">
        © 2025 <span className="text-cyan-400 font-semibold">DreamRoute</span>. All rights reserved.
      </footer>
    </div>
  );
}
