import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import VerifySkill from "./pages/VerifySkill";
import QuizPage from "./pages/QuizPage";
import QuizSummary from "./pages/QuizSummary";
import QuizResultPage from "./pages/QuizResultPage";
import RoadmapPage from "./pages/RoadmapPage";
import SkillDashboardPage from "./pages/SkillDashboardPage";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "http://localhost:3000";
    return null;
  }
  return children;
}

function AppRoutes() {
  const { initializing } = useAuth();

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RequireAuth><VerifySkill /></RequireAuth>} />
        <Route path="/verify-skill" element={<RequireAuth><VerifySkill /></RequireAuth>} />
        <Route path="/quiz-summary" element={<RequireAuth><QuizSummary /></RequireAuth>} />
        <Route path="/quiz/result/:attemptId" element={<RequireAuth><QuizResultPage /></RequireAuth>} />
        <Route path="/quiz/:skill" element={<RequireAuth><QuizPage /></RequireAuth>} />
        <Route path="/roadmap/:skill" element={<RequireAuth><RoadmapPage /></RequireAuth>} />
        <Route path="/dashboard/skills" element={<RequireAuth><SkillDashboardPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/verify-skill" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}