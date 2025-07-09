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
import OAuthRedirect from "./pages/OAuthRedirect";
import './index.css'; 
import CareerPathFlow from "./pages/CareerPathFlow";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import ManageCourses from "./pages/ManageCourses";
// import Homepage from "./pages/Homepage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import InstitutionSettings from "./pages/InstitutionSettings";
import RequestInstitution from "./pages/RequestInstitution";
import TestPage from "./pages/TestPage";
import PlansPage from "./pages/PlansPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
// console.log("Stripe Public Key:", STRIPE_PUBLIC_KEY); //Debug

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Elements stripe={stripePromise}>
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
        <Route path="/oauth-redirect" element={<OAuthRedirect />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/dashboard/career-path" element={<CareerPathFlow />} />
        <Route path="/test" element={<TestPage />} />

<Route
      path="/admin"
      element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/admin/users" element={ <ProtectedRoute role="admin"> <UserManagement />  </ProtectedRoute> } />
        <Route path="/admin/courses" element={ <ProtectedRoute role="admin"> <CourseManagement /> </ProtectedRoute>} />
        <Route path="/admin/institutions" element={ <ProtectedRoute role="admin"> <InstitutionManagement /> </ProtectedRoute> } />
        <Route path="/institution/" element={ <ProtectedRoute role="institution"> <InstitutionDashboard /> </ProtectedRoute>} />
        <Route path="/institution/courses" element={ <ProtectedRoute role="institution"><ManageCourses /> </ProtectedRoute>  } />
        {/* <Route path="/home" element={ <Homepage />   } /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/institution/settings" element={<ProtectedRoute role="institution"><InstitutionSettings /></ProtectedRoute>} />
        <Route path="institution/requests" element={<RequestInstitution />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/payment-methods" element={<PaymentMethodsPage />} />
        {/* Redirects */}
        
      </Routes>
      </Elements>
    </Router>
  );
}

export default App;
