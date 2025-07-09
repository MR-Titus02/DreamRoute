// ✅ Updated OAuthRedirect.jsx with full user data
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function OAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const role = params.get("role") || "student";
    const id = params.get("id") || params.get("userId");

    if (token && name && email && id) {
      const user = { id, name, email, role };
      login(user, token);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "institution") {
        navigate("/institution-dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="text-white text-center mt-10">Signing in via Google...</div>
  );
}

export default OAuthRedirect;