import { AnimatePresence, MotionConfig } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { SensingProvider } from "@/context/SensingContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LandingPage from "@/components/landing/LandingPage";
import AuthPage from "@/components/app/AuthPage";
import Fork from "@/components/onboarding/Fork";
import Options from "@/components/onboarding/Options";
import AppShell from "@/components/app/AppShell";
import FacultyDashboard from "@/components/app/FacultyDashboard";
import ParentDashboard from "@/components/app/ParentDashboard";
import Dashboard from "@/components/app/pages/Dashboard";
import ProblemBank from "@/components/app/pages/ProblemBank";
import DailyChallenge from "@/components/app/pages/DailyChallenge";
import MockInterviewPage from "@/components/app/pages/MockInterviewPage";
import Leaderboard from "@/components/app/pages/Leaderboard";
import Forum from "@/components/app/pages/Forum";
import StudyGroups from "@/components/app/pages/StudyGroups";
import StudyRoom from "@/components/app/pages/StudyRoom";
import SkillReport from "@/components/app/pages/SkillReport";
import JobReadiness from "@/components/app/pages/JobReadiness";
import Certifications from "@/components/app/pages/Certifications";
import Assignments from "@/components/app/pages/Assignments";
import Roadmap from "@/components/app/pages/Roadmap";
import Profile from "@/components/app/pages/Profile";
import Settings from "@/components/app/pages/Settings";
import TwinView from "@/components/twin/TwinView";
import ReverseMatch from "@/components/jobs/ReverseMatch";
import NegotiationSim from "@/components/negotiate/NegotiationSim";
import RecruiterResume from "@/components/resume/RecruiterResume";

function AppRoutes() {
  const location = useLocation();
  // Animate transitions for the standalone routes; the in-shell feature pages
  // share a layout, so we key the AnimatePresence on the top-level segment.
  const segment = "/" + (location.pathname.split("/")[1] ?? "");

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={segment}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Onboarding (students) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute role="student">
              <Fork />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/options"
          element={
            <ProtectedRoute role="student">
              <Options />
            </ProtectedRoute>
          }
        />

        {/* The product — 14 features under one adaptive shell */}
        <Route
          path="/app"
          element={
            <ProtectedRoute role="student">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="problems" element={<ProblemBank />} />
          <Route path="daily" element={<DailyChallenge />} />
          <Route path="interview" element={<MockInterviewPage />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="forum" element={<Forum />} />
          <Route path="groups" element={<StudyGroups />} />
          <Route path="groups/:roomId" element={<StudyRoom />} />
          <Route path="skills" element={<SkillReport />} />
          <Route path="readiness" element={<JobReadiness />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Settings + the placement-edge features share the same shell */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute role="student">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Settings />} />
        </Route>
        <Route
          path="/twin"
          element={
            <ProtectedRoute role="student">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<TwinView />} />
        </Route>
        <Route
          path="/jobs"
          element={
            <ProtectedRoute role="student">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="gap" element={<ReverseMatch />} />
        </Route>
        <Route
          path="/negotiate"
          element={
            <ProtectedRoute role="student">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<NegotiationSim />} />
        </Route>
        <Route
          path="/resume"
          element={
            <ProtectedRoute role="student">
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="recruiter-view" element={<RecruiterResume />} />
        </Route>

        {/* Faculty / counselor */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Parent / Guardian — consent-based, read-only progress + wellbeing */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute role="guardian">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <AccessibilityProvider>
          <ProgressProvider>
            <SensingProvider>
              <AppRoutes />
            </SensingProvider>
          </ProgressProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
