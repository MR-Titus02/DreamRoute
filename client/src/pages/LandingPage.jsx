import React from "react";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import HeroAnimation from "../assets/hero.json"; // Your Lottie JSON file

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#222831] via-[#393E46] to-[#222831] min-h-screen text-white flex flex-col font-inter">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-700 bg-black/10 backdrop-blur-sm z-20 relative">
        <div className="text-xl font-bold flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-16 h-16" />
          <span className="text-cyan-300 tracking-wide">DreamRoute</span>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md animate-pulse"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="min-h-[70vh] max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12 z-10 relative">
        {/* Text */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-4 drop-shadow-lg"
          >
            Your Journey Begins with a Dream.
          </motion.h1>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-semibold mb-6 text-white"
          >
            We Build the Route.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-xl mx-auto md:mx-0 text-gray-300 mb-8"
          >
            Discover personalized career paths, find relevant courses, and get
            AI-powered guidance to achieve your professional goals.
          </motion.p>
          <motion.button
            variants={fadeUp}
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Animation */}
        <motion.div
          className="flex-1 max-w-md md:max-w-xl"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Lottie animationData={HeroAnimation} loop={true} />
        </motion.div>
      </header>

      {/* Features */}
      <section className="bg-white/5 backdrop-blur-md py-16 px-4 pt-32">
        <h3 className="text-center text-2xl font-semibold mb-12 text-cyan-200">
          Why Choose DreamRoute?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "AI Career Pathing",
              desc: "Leverage generative AI to find curated career paths tailored to your goals and strengths.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#26C6DA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#26C6DA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  <rect width="20" height="14" x="2" y="6" rx="2" />
                </svg>
              ),
            },
            {
              title: "Course Finder",
              desc: "Explore a curated list of free, paid, filtered-by-difficulty courses to enhance your skills.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#26C6DA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              ),
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
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

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 text-sm border-t border-gray-700 bg-black/10 backdrop-blur-sm mt-auto">
        © 2025 <span className="text-cyan-400 font-semibold">DreamRoute</span>. All
        rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
