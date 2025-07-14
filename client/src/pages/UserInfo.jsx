// StepFormWrapper.jsx
import React, { useState } from "react";
import Step1PersonalDetails from "./Step1PersonalDetails";
import Step2CareerGoals from "./Step2CareerGoals";
import Step3SkillsExperience from "./Step3SkillsExperience";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "@/context/AuthContext";
import BackButton from "../components/BackButton"; 

const UserInfo = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = async (data) => {
    const combinedData = { ...formData, ...data };

    if (step < 3) {
      setFormData(combinedData);
      setStep(step + 1);
    } else {
      // Final submit to generate roadmap
      try {
        setLoading(true);

        const payload = {
          userId: user?.id || JSON.parse(localStorage.getItem("user"))?.id,
          ...combinedData,
        };

        console.log("🟢 Submitting final data to AI:", payload);

        await api.post("/roadmap", payload);

        navigate("/dashboard");
      } catch (err) {
        console.error("❌ Roadmap generation failed:", err);
        alert("Failed to generate roadmap. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrev = () => setStep(step - 1);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#101C2B] text-white px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00ADB5] mb-6"></div>
        <p className="text-xl font-semibold">Generating your personalized roadmap...</p>
        <p className="text-sm text-gray-400 mt-2">Hang tight! This may take a few seconds.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101C2B] via-[#1F2D3D] to-[#101C2B] text-white p-6 flex items-center justify-center">
      {/* Top-left back button */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton to="/" label="Back" />
      </div>
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="mb-4 text-center text-white/60 text-sm">Step {step} of 3</div>
        <div className="w-full bg-white/10 rounded-full h-2 mb-6">
          <div
            className="h-2 rounded-full bg-[#00ADB5] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        {step === 1 && <Step1PersonalDetails onNext={handleNext} />}
        {step === 2 && <Step2CareerGoals onNext={handleNext} onBack={handlePrev} />}
        {step === 3 && <Step3SkillsExperience onNext={handleNext} onBack={handlePrev} />}
      </div>
    </div>
  );
};

export default UserInfo;
