import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const priceMap = {
  basic: null, 
  pro: 'price_1RlNC7B7LCNwTzAibT4mDcY9',
  premium: 'price_1RlNCNB7LCNwTzAiIjn7LENH',
};

export default function PaymentMethodsPage() {
  const [plan, setPlan] = useState('pro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

const handleSubscribe = async () => {
  const selectedPriceId = priceMap[plan];
  if (!selectedPriceId || !user) {
    alert('User not authenticated. Please log in first.');
    return;
  }

  setLoading(true);

  try {
    const { data } = await api.post('/payment/create-checkout-session', {
      priceId: selectedPriceId,
      userId: user.id,
      plan,
    });

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: data.sessionId });
  } catch (err) {
    console.error('Checkout session error:', err);
    alert('Error starting checkout session. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 rounded-2xl shadow-xl bg-white dark:bg-[#1E293B]">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#00ADB5]">Subscribe to a Plan</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Select a Plan
        </label>
        <select
          className="w-full p-2 border rounded bg-white dark:bg-[#334155] dark:text-white"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option value="pro">Pro - LKR 990/month</option>
          <option value="premium">Premium - LKR 1990/month</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-2 rounded">
          {error}
        </div>
      )}

      <Button
        disabled={loading}
        onClick={handleSubscribe}
        className="w-full bg-[#00ADB5] hover:bg-[#00c4cc] text-white text-lg"
      >
        {loading ? 'Redirecting to Stripe...' : `Subscribe to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`}
      </Button>
    </div>
  );
}
