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

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/submit-course" element={<InstitutionCourse />} />
        <Route path="/userdetails" element={<UserInfo />} />
        <Route path="/roadmap" element={<Roadmap />} />
                        
        {/* Redirects */}
        

      </Routes>
    </Router>
  );
}

export default App;
