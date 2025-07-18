import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import BackButton from "../components/BackButton";
import { useAuth } from "@/context/AuthContext";

const PaymentMethodsPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, token } = useAuth();

  const selectedPlan = localStorage.getItem("selectedPlan") || "Pro";

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name || formData.name.length < 3)
      newErrors.name = "Full name is required (min 3 characters)";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: formData.name,
          email: formData.email,
        },
      });

      if (pmError) {
        alert("❌ Payment method creation failed: " + pmError.message);
        setProcessing(false);
        return;
      }

      console.log("📦 Sending to backend:", {
        selectedPlan: selectedPlan.toLowerCase(),
        paymentMethodId: paymentMethod.id,
      });

      const res = await axios.post(
        "http://localhost:5000/api/stripe/create-subscription",
        {
          selectedPlan: selectedPlan.toLowerCase(),
          paymentMethodId: paymentMethod.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret);

      if (result.error) {
        alert("❌ Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setSuccess(true);
        alert("✅ Subscription successful!");

        await axios.post(
          "http://localhost:5000/api/stripe/payment/success",
          {
            userId: user.id,
            selectedPlan,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem("userPlan", selectedPlan);
      }
    } catch (err) {
      console.error("❌ Error during subscription:", err);
      alert("⚠️ Subscription failed. Check console for details.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E293B] flex items-center justify-center px-4 py-10 relative">
      <div className="absolute top-6 left-6 z-10">
        <BackButton />
      </div>

      <div className="bg-[#334155] w-full max-w-md p-8 rounded-2xl shadow-2xl text-white">
        <h2 className="text-2xl font-bold text-center text-[#00ADB5] mb-6">
          {selectedPlan === "Basic"
            ? "Basic Plan is Free"
            : `Subscribe to ${selectedPlan} Plan`}
        </h2>

        {selectedPlan === "Basic" ? (
          <p className="text-center text-[#EEEEEEAA]">
            🎉 You’ve selected the free Basic Plan. No payment required.
          </p>
        ) : success ? (
          <p className="text-green-400 text-center">✅ Subscription Successful!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 bg-[#475569] text-white placeholder-gray-300 rounded-lg focus:outline-none ${
                  errors.name ? "border border-red-400" : ""
                }`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 bg-[#475569] text-white placeholder-gray-300 rounded-lg focus:outline-none ${
                  errors.email ? "border border-red-400" : ""
                }`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Card Element */}
            <div className="p-4 bg-[#475569] rounded-lg min-h-[56px]">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "18px",
                      color: "#fff",
                      "::placeholder": { color: "#bbb" },
                    },
                    invalid: { color: "#ff6b6b" },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!stripe || processing}
              className="w-full mt-4 bg-[#00ADB5] py-3 text-[#0F172A] font-bold rounded-lg hover:bg-[#00C4CC] transition disabled:opacity-50"
            >
              {processing ? "Processing..." : "Start Subscription"}
            </button>
          </form>
        )}

        <p className="text-xs text-center mt-4 text-[#EEEEEEAA]">
          🔒 Secure subscription powered by Stripe
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
