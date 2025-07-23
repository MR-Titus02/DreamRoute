import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E293B] px-4">
      <div className="bg-[#334155] shadow-xl rounded-2xl p-8 max-w-lg w-full text-center border border-[#475569]">
        <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#EEEEEE] mb-2">Payment Successful!</h1>
        <p className="text-[#cbd5e1] mb-6">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#00ADB5] text-[#EEEEEE] px-6 py-2 rounded-xl hover:bg-[#00C4CC] transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate('/feedback')}
            className="bg-[#393E46] text-[#EEEEEE] px-6 py-2 rounded-xl hover:bg-[#475569] transition"
          >
            Leave Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
