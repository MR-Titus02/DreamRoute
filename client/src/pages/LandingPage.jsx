import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/logo.png";
import HeroBgImg from "../assets/bg.png";
import { useState } from "react";
import axios from "axios";

const UserProfileIcon = ({ white = false }) => (
  <svg width="24" height="24" fill="none" stroke={white ? "#ffffff" : "#00ADB5"} strokeWidth="2">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EducationIcon = ({ white = false }) => (
  <svg width="24" height="24" fill="none" stroke={white ? "#ffffff" : "#00ADB5"} strokeWidth="2">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const AIIcon = ({ white = false }) => (
  <svg width="24" height="24" fill="none" stroke={white ? "#ffffff" : "#00ADB5"} strokeWidth="2">
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const RoadmapIcon = ({ white = false }) => (
  <svg width="24" height="24" fill="none" stroke={white ? "#ffffff" : "#00ADB5"} strokeWidth="2">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const JobIcon = ({ white = false }) => (
  <svg width="24" height="24" fill="none" stroke={white ? "#ffffff" : "#00ADB5"} strokeWidth="2">
    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);




const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const processSteps = [
  {
    title: "Tell Us About Yourself",
    description: "Fill in your personal, educational and professional details",
    icon: <UserProfileIcon />,
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "AI Analysis",
    description: "Our AI evaluates your skills, experience and goals",
    icon: <AIIcon />,
    color: "from-purple-400 to-indigo-500"
  },
  {
    title: "Career Path Suggestions",
    description: "Get personalized recommendations like Full Stack, DevOps, etc.",
    icon: <RoadmapIcon />,
    color: "from-amber-400 to-orange-500"
  },
  {
    title: "Step-by-Step Roadmap",
    description: "Detailed learning path from your current level to your dream job",
    icon: <EducationIcon />,
    color: "from-emerald-400 to-teal-500"
  },
  {
    title: "Job Ready",
    description: "Follow the path to become qualified for your target role",
    icon: <JobIcon />,
    color: "from-pink-400 to-rose-500"
  }
];

const exampleRoadmaps = [
  {
    title: "High School to Software Engineer",
    steps: ["Computer Science Degree", "Learn Programming Basics", "Master Data Structures", "Build Projects", "Apply for Internships"],
    icon: "💻"
  },
  {
    title: "Career Switch to DevOps",
    steps: ["Learn Linux Fundamentals", "Master Cloud Basics", "Understand CI/CD", "Learn Infrastructure as Code", "Get Certified"],
    icon: "🔄"
  },
  {
    title: "Self-Taught Full Stack Developer",
    steps: ["HTML/CSS Fundamentals", "JavaScript Deep Dive", "Learn React/Node.js", "Build Portfolio", "Freelance Projects"],
    icon: "🌐"
  }
];

const features = [
  {
    title: "AI Career Pathing",
    desc: "Leverage generative AI to find curated career paths tailored to your goals and strengths.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#26C6DA" strokeWidth="2">
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
      <svg width="28" height="28" fill="none" stroke="#26C6DA" strokeWidth="2">
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </svg>
    ),
  },
  {
    title: "Course Finder",
    desc: "Explore a curated list of free, paid, filtered-by-difficulty courses to enhance your skills.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#26C6DA" strokeWidth="2">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
];


export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/api/contact/send", formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#222831] via-[#393E46] to-[#222831] min-h-screen text-white flex flex-col font-inter relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100 * Math.sin(i)],
              y: [0, 100 * Math.cos(i)],
              transition: {
                duration: 15 + i * 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            className="absolute rounded-full bg-cyan-400/10"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-700 bg-black/10 backdrop-blur-lg z-20 sticky top-0">
        <div className="text-xl font-bold flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-12 h-12" />
          <span className="text-cyan-300 tracking-wide">DreamRoute</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="w-full relative flex items-center justify-center min-h-[70vh] py-10">
        <img
          src={HeroBgImg}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          style={{ zIndex: 0 }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        <div className="relative z-20 text-center w-full px-2 py-5 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="bg-cyan-400/20 text-cyan-300 text-sm font-bold px-4 py-1 rounded-full inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI-Powered Career Guidance
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-4 drop-shadow-lg"
          >
            Your AI-Powered Career Roadmap
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="max-w-xl mx-auto text-gray-200 mb-8 text-lg"
          >
            Discover personalized career paths powered by AI, find relevant courses, and get intelligent guidance to achieve your professional goals.
          </motion.p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg text-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started
          </motion.button>
        </div>
      </section>


{/* How It Works Section - With Visible Icons */}
<section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
  <div className="max-w-4xl mx-auto">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl font-bold text-cyan-300 mb-3">Your Career Path in 5 Simple Steps</h2>
      <p className="max-w-lg mx-auto text-gray-300">
        From signup to your dream job - powered by AI
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {processSteps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center group"
        >
          {/* Circle with visible white icon */}
          <div className="relative mb-4 p-4 rounded-full bg-gradient-to-br from-[#00ADB5] to-[#00C4CC] shadow-lg
                        group-hover:shadow-cyan-400/30 transition-all duration-300">
            <div className="w-10 h-10 flex items-center justify-center [&>svg]:stroke-white [&>svg]:stroke-[2] [&>svg]:w-6 [&>svg]:h-6">
              {step.icon}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white text-cyan-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">
              {i+1}
            </div>
          </div>
          
          <h3 className="font-bold text-white mb-1 text-sm">{step.title}</h3>
          <p className="text-gray-300 text-xs px-2">{step.description}</p>
        </motion.div>
      ))}
    </div>

    {/* Visual connector for mobile */}
    <div className="mt-8 md:hidden flex justify-center">
      <svg width="80%" viewBox="0 0 400 40" className="text-cyan-400">
        <path 
          d="M0,20 Q100,40 200,20 T400,20" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
          strokeDasharray="5,5"
        />
      </svg>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#00ADB5]/10 to-[#00C4CC]/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Discover Your Career Path?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Get your personalized AI-generated roadmap in just 5 minutes
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl text-lg flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate My Roadmap
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/5 backdrop-blur-md py-16 px-4">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold mb-12 text-cyan-300"
        >
          How DreamRoute Helps You
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              custom={i}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow hover:shadow-lg border border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4 text-cyan-400">
                <div className="p-2 bg-cyan-400/10 rounded-lg">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold">{feature.title}</h4>
              </div>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
              <div className="mt-3">
                <span className="text-xs text-cyan-300/80">AI-Powered Feature</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Educational Institutions Section */}
      <section className="w-full bg-transparent py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* LEFT */}
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-cyan-400 mb-3"
            >
              For Educational Institutions
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-200 text-lg mb-8"
            >
              Partner with DreamRoute to provide comprehensive career guidance to your students. Access analytics, track student progress, and enhance your career counseling services.
            </motion.p>
            
            <motion.ul 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              viewport={{ once: true }}
              className="space-y-3 mb-8 text-base"
            >
              {[
                "Student Analytics Dashboard",
                "Progress Tracking",
                "Multi-User Management",
                "AI-Powered Recommendations"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-gray-100"
                >
                  <span className="text-cyan-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              onClick={() => navigate("/institution/requests")}
              className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-full text-lg transition-all shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Institution Register
            </motion.button>
          </div>
          
          {/* RIGHT */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Success Metrics Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow border border-white/10"
            >
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
            </motion.div>
            
            {/* Institution Dashboard Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow border border-white/10 flex flex-col gap-2"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#393E46] bg-opacity-70 backdrop-blur-xl p-8 rounded-lg shadow-xl space-y-6"
          >
            <h3 className="text-2xl font-bold text-cyan-300 mb-2">Get In Touch</h3>
            <p className="text-gray-300 mb-6">Have questions about our AI-powered career roadmaps? Contact us!</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 rounded-lg bg-[#222831] text-white border border-transparent focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    type="email"
                    placeholder="Your Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 rounded-lg bg-[#222831] text-white border border-transparent focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-4 rounded-lg bg-[#222831] text-white border border-transparent focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <textarea
                  placeholder="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 rounded-lg bg-[#222831] text-white border border-transparent focus:ring-2 focus:ring-cyan-400 focus:border-transparent h-32"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-cyan-400 border-none focus:ring-0 rounded"
                  required
                />
                <label className="text-gray-200 text-sm">
                  I agree to the <span className="text-cyan-300">privacy policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] text-white font-bold py-3 px-8 rounded-full w-full transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
            
            {submitStatus && (
              <div className={`mt-4 text-center ${submitStatus === "success" ? "text-green-400" : "text-red-400"}`}>
                {submitStatus === "success" ? "Message sent successfully!" : "There was an error, please try again."}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-8 text-sm border-t border-gray-700 bg-black/10 backdrop-blur-sm mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src={Logo} alt="Logo" className="w-8 h-8" />
              <span className="text-cyan-300 font-semibold">DreamRoute</span>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">AI-Powered</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors">Contact Us</a>
            </div>
          </div>
          <p>© {new Date().getFullYear()} DreamRoute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}




