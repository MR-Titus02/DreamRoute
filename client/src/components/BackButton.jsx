// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton({ to = -1, label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-white rounded-lg border border-white/20 bg-white/5 hover:bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-inter mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}

export default BackButton;
