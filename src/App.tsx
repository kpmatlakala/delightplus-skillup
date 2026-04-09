import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import LandingPage from "./pages/LandingPage";
import Index from "./_lmis/pages/Index";
import ModulesPage from "./_lmis/pages/ModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import LearnersPage from "./_lmis/pages/LearnersPage";
import LessonPlansPage from "./_lmis/pages/LessonPlansPage";
import AssessmentsPage from "./_lmis/pages/AssessmentsPage";
import ProgramsPage from "./_lmis/pages/ProgramsPage";
import CompliancePage from "./_lmis/pages/CompliancePage";
import AnnouncementsPage from "./_lmis/pages/AnnouncementsPage";
import MessagesPage from "./_lmis/pages/MessagesPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import LearnerPortalPage from "./pages/LearnerPortalPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import PresentationRemotePage from "./pages/PresentationRemotePage";
import PresentationLaunchPage from "./_lmis/pages/PresentationLaunchPage";
import PresentationDesktopPage from "./_lmis/pages/PresentationDesktopPage";
import PoEPage from "./pages/PoEPage";
import BlockAssessmentPage from "./pages/BlockAssessmentPage";
import BlockAssessmentAdminPage from "./_lmis/pages/BlockAssessmentAdminPage";
import AttendancePage from "./_lmis/pages/AttendancePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />

            <Route element={<PublicOnlyRoute />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            {/* ── LMIS — Admin / Lecturer portal ─────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "lecturer"]} />}>
              <Route path="/lmis" element={<Index />} />
              <Route path="/lmis/modules" element={<ModulesPage />} />
              <Route path="/lmis/modules/:id" element={<ModuleDetailPage />} />
              <Route path="/lmis/learners" element={<LearnersPage />} />
              <Route path="/lmis/lesson-plans" element={<LessonPlansPage />} />
              <Route path="/lmis/assessments" element={<AssessmentsPage />} />
              <Route path="/lmis/assessments/blocks" element={<BlockAssessmentAdminPage />} />
              <Route path="/lmis/programs" element={<ProgramsPage />} />
              <Route path="/lmis/compliance" element={<CompliancePage />} />
              <Route path="/lmis/attendance" element={<AttendancePage />} />
              <Route path="/lmis/announcements" element={<AnnouncementsPage />} />
              <Route path="/lmis/messages" element={<MessagesPage />} />
            </Route>

            {/* Legacy redirects → LMIS */}
            <Route path="/dashboard" element={<Navigate to="/lmis" replace />} />
            <Route path="/modules" element={<Navigate to="/lmis/modules" replace />} />
            <Route path="/modules/:id" element={<Navigate to="/lmis/modules/:id" replace />} />
            <Route path="/learners" element={<Navigate to="/lmis/learners" replace />} />
            <Route path="/lesson-plans" element={<Navigate to="/lmis/lesson-plans" replace />} />
            <Route path="/assessments" element={<Navigate to="/lmis/assessments" replace />} />
            <Route path="/programs" element={<Navigate to="/lmis/programs" replace />} />
            <Route path="/compliance" element={<Navigate to="/lmis/compliance" replace />} />

            {/* ── Learner portal (all authenticated users) ────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route path="/learner" element={<LearnerPortalPage />} />
              <Route path="/learner/modules/:id" element={<ModuleDetailPage />} />
              <Route path="/learner/assessment/block/:blockNum" element={<BlockAssessmentPage />} />
            </Route>

            {/* ── Shared (all authenticated) ─────────────────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/communications" element={<CommunicationsPage />} />
              <Route path="/poe" element={<PoEPage />} />
            </Route>

            {/* Public — presentation remote */}
            <Route path="/present/remote/:code" element={<PresentationRemotePage />} />

            {/* LMIS — presentation tools */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "lecturer"]} />}>
              <Route path="/lmis/present/launch" element={<PresentationLaunchPage />} />
              <Route path="/lmis/present/desktop/:code/:moduleId" element={<PresentationDesktopPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
