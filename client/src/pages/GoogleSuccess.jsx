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
        const res = await api.get("/users", { withCredentials: true });
        const user = res.data;

        // Optionally save a dummy token or leave null
        login(user, "session"); // session placeholder

        // Redirect by role
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
