import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "../api/axios";

function GoogleSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleUser = async () => {
      try {
        // ✅ Fetch the currently logged-in user via session
        const res = await api.get("/users/me", { withCredentials: true });
        const user = res.data;

        // ✅ Save user and dummy session token
        login(user, "session");

        // ✅ Redirect based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "institution") {
          navigate("/institution-dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Google auth error:", err);
        navigate("/login");
      }
    };

    fetchGoogleUser();
  }, []);

  return <div className="text-white text-center mt-10">Signing in via Google...</div>;
}

export default GoogleSuccess;
