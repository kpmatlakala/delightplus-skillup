import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import ModulesPage from "./pages/ModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import ModuleProgressReviewPage from "./pages/ModuleProgressReviewPage";
import LearnersPage from "./pages/LearnersPage";
import LessonPlansPage from "./pages/LessonPlansPage";
import AssessmentsPage from "./pages/AssessmentsPage";
import ProgramsPage from "./pages/ProgramsPage";
import CompliancePage from "./pages/CompliancePage";
import CommunicationsPage from "./pages/CommunicationsPage";
import LearnerPortalPage from "./pages/LearnerPortalPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import PresentationRemotePage from "./pages/PresentationRemotePage";
import PresentationLaunchPage from "./pages/PresentationLaunchPage";
import PresentationDesktopPage from "./pages/PresentationDesktopPage";
import PoEPage from "./pages/PoEPage";
import BlockAssessmentPage from "./pages/BlockAssessmentPage";
import BlockAssessmentAdminPage from "./pages/BlockAssessmentAdminPage";
import UnitAssessmentPage from "./pages/UnitAssessmentPage";
import AssessmentDetailPage from "./pages/AssessmentDetailPage";
import AssessmentGradingPage from "./pages/AssessmentGradingPage";
import WorkbooksAdminPage from "./pages/WorkbooksAdminPage";
import SummativeAssessmentAdminPage from "./pages/SummativeAssessmentAdminPage";
import PracticalAssessmentAdminPage from "./pages/PracticalAssessmentAdminPage";
import QuizAssessmentAdminPage from "./pages/QuizAssessmentAdminPage";

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
            <Route path="/home" element={<LandingPage />} />

            <Route element={<PublicOnlyRoute />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute allowedRoles={["admin", "lecturer", "moderator"]} />}>
              <Route path="/" element={<Index />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/modules/:id" element={<ModuleDetailPage />} />
              <Route path="/learners" element={<LearnersPage />} />
              <Route path="/lesson-plans" element={<LessonPlansPage />} />
              <Route path="/assessments" element={<AssessmentsPage />} />
              <Route path="/assessments/quizzes" element={<QuizAssessmentAdminPage />} />
              <Route path="/assessments/quizzes/:unitId" element={<QuizAssessmentAdminPage />} />
              <Route path="/assessments/quizzes/:unitId/capture/:userId" element={<QuizAssessmentAdminPage />} />
              <Route path="/assessments/summative" element={<SummativeAssessmentAdminPage />} />
              <Route path="/assessments/summative/:unitId" element={<SummativeAssessmentAdminPage />} />
              <Route path="/assessments/summative/:unitId/capture/:userId" element={<SummativeAssessmentAdminPage />} />
              <Route path="/assessments/practical" element={<PracticalAssessmentAdminPage />} />
              <Route path="/assessments/practical/:unitId" element={<PracticalAssessmentAdminPage />} />
              <Route path="/assessments/practical/:unitId/capture/:userId" element={<PracticalAssessmentAdminPage />} />
              <Route path="/assessments/workbooks" element={<WorkbooksAdminPage />} />
              <Route path="/assessments/workbooks/:unitId" element={<WorkbooksAdminPage />} />
              <Route path="/assessments/workbooks/:unitId/capture/:userId" element={<WorkbooksAdminPage />} />
              <Route path="/assessments/blocks" element={<BlockAssessmentAdminPage />} />
              <Route path="/assessments/blocks/:blockKey/capture/:learnerId" element={<BlockAssessmentAdminPage />} />
              <Route path="/assessments/grade/:id" element={<AssessmentGradingPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["learner", "user"]} />}>
              <Route path="/learner" element={<LearnerPortalPage />} />
              <Route path="/learner/modules/:id" element={<ModuleDetailPage />} />
              <Route path="/learner/modules/:id/progress" element={<ModuleProgressReviewPage />} />
              <Route path="/learner/assessment/:id" element={<AssessmentDetailPage />} />
              <Route path="/learner/assessment/block/:blockNum" element={<BlockAssessmentPage />} />
              <Route path="/learner/assessment/unit/:id" element={<UnitAssessmentPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/communications" element={<CommunicationsPage />} />
              <Route path="/poe" element={<PoEPage />} />
            </Route>

            {/* Public — no auth, session code is the shared secret */}
            <Route path="/present/remote/:code" element={<PresentationRemotePage />} />

            {/* Remote launch + desktop projection — authenticated, admin/lecturer only */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "lecturer", "moderator"]} />}>
              <Route path="/present/launch" element={<PresentationLaunchPage />} />
              <Route path="/present/desktop/:code/:moduleId" element={<PresentationDesktopPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
