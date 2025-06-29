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
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from "@/components/ProtectedRoute";
import UserManagement from "./pages/UserManagement";
import CourseManagement from "./pages/CourseManagement";
import InstitutionManagement from "./pages/InstitutionManagement";
import Courses from "./pages/Courses";
import UserAnalytics from "./pages/Analytics";
import Settings from "./pages/Settings";


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
        <Route path="dashboard/roadmap" element={<Roadmap />} />
        <Route path="dashboard/courses" element={<Courses />} />
        <Route path="dashboard/analytics" element={<UserAnalytics />} />
        <Route path="dashboard/settings" element={<Settings />} />
<Route
      path="/admin"
      element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/courses" element={<CourseManagement />} />
        <Route path="/admin/institutions" element={<InstitutionManagement />} />
        {/* Redirects */}
        
      </Routes>
    </Router>
  );
}

export default App;
