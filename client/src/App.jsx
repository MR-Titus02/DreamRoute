import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Feedback from "./pages/Feedback";
import InstitutionCourse from "./pages/Submit_Course";
import UserInfo from "./pages/UserInfo";
import Roadmap from "./pages/Roadmap";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "@/context/AuthContext";



function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/submit-course" element={<InstitutionCourse />} />
        <Route path="/userdetails" element={<UserInfo />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route
  path="/admin"
  element={
    user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/unauthorized" />
  }
/>
                       
        {/* Redirects */}
        
      </Routes>
    </Router>
  );
}

export default App;
