import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton"; // ✅ Import your BackButton

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Access basic roadmap features",
    features: ["Basic Roadmaps", "Limited Courses"],
  },
  {
    name: "Pro",
    price: "$9.99/month",
    description: "Premium roadmap & suggestions",
    features: ["Advanced Roadmaps", "Smart Suggestions", "Priority Support"],
  },
  {
    name: "Premium",
    price: "$19.99/month",
    description: "Full access with mentoring",
    features: ["AI Career Coach", "Unlimited Courses", "1-on-1 Mentoring"],
  },
];

const PlansPage = () => {
  const navigate = useNavigate();

  const handleSelect = (planName) => {
    localStorage.setItem("selectedPlan", planName);
    navigate("/payment-methods");
  };

  return (
    <div className="min-h-screen bg-[#1E293B] text-white flex items-center justify-center px-4 py-12 relative">
      {/* 🔙 Back Button in top-left corner */}
      <div className="absolute top-6 left-6 z-10">
        <BackButton />
      </div>

      <div className="w-full max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#00ADB5]">
          Choose Your Plan
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-[#334155] text-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300 border border-[#00ADB5]/20"
            >
              <div>
                <h3 className="text-xl font-semibold text-[#00C4CC]">{plan.name}</h3>
                <p className="text-2xl font-bold mt-2">{plan.price}</p>
                <p className="text-sm mt-2 text-[#EEEEEE99]">{plan.description}</p>
                <ul className="mt-4 space-y-1 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-400">✔</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSelect(plan.name)}
                className="mt-6 bg-[#00ADB5] text-[#0F172A] font-semibold py-2 rounded-xl hover:bg-[#00C4CC]"
              >
                Continue to Payment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
