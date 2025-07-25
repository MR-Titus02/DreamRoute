import React, { useState } from "react";
import { X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
  {
    name: "Free",
    price: "Free",
    description: "Start your career journey with limited access.",
    features: ["Basic Roadmaps", "Limited Courses"],
    isPaid: false,
  },
  {
    name: "Pro",
    price: "USD 9.99/month",
    description: "Unlock full roadmap guidance and smart suggestions.",
    features: ["Advanced Roadmaps", "Smart Suggestions", "Priority Support"],
    isPaid: true,
    priceId: "price_1RlNC7B7LCNwTzAibT4mDcY9",
  },
];

const PlansModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubscribe = async (priceId) => {
    if (!user) {
      alert("Please log in to continue.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/payment/create-checkout-session", {
        priceId,
        userId: user.id,
        plan: "pro",
      });

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      alert("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
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

        <div className="grid md:grid-cols-2 gap-6">
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
                {plan.isPaid ? (
                  <button
                    onClick={() => handleSubscribe(plan.priceId)}
                    disabled={loading}
                    className="w-full bg-[#00ADB5] text-[#0F172A] font-semibold py-2 rounded-xl hover:bg-[#00C4CC] transition"
                  >
                    {loading ? "Redirecting..." : "Subscribe to Pro"}
                  </button>
                ) : (
                  <span className="block text-center bg-gray-300 text-gray-700 font-semibold py-2 rounded-xl cursor-default">
                    ✅ Current Plan
                  </span>
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
