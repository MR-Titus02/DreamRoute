import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const PlansModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = (planName) => {
    if (planName === "Basic") return; // No payment for Free plan
    localStorage.setItem("selectedPlan", planName);
    onClose();
    navigate("/payment-methods");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dim background */}
      <div
        className="absolute inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="z-50 bg-[#1E293B] text-white rounded-2xl shadow-2xl p-6 w-full max-w-5xl relative border border-[#00ADB5]/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-400"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-10 text-[#00ADB5]">
          Choose Your Plan
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-[#334155] rounded-xl p-6 flex flex-col justify-between border border-[#00C4CC]/20 shadow-lg hover:scale-105 transition-transform"
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

              <div className="mt-6">
                {plan.name === "Basic" ? (
                  <span className="block text-center bg-gray-300 text-gray-700 font-semibold py-2 rounded-xl cursor-default">
                    ✅ Current Plan
                  </span>
                ) : (
                  <button
                    onClick={() => handleSelect(plan.name)}
                    className="w-full bg-[#00ADB5] text-[#0F172A] font-semibold py-2 rounded-xl hover:bg-[#00C4CC] transition"
                  >
                    Continue to Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansModal;
