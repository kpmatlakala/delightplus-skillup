import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Index from "./pages/Index";
import ModulesPage from "./pages/ModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import LearnersPage from "./pages/LearnersPage";
import LessonPlansPage from "./pages/LessonPlansPage";
import AssessmentsPage from "./pages/AssessmentsPage";
import ProgramsPage from "./pages/ProgramsPage";
import CompliancePage from "./pages/CompliancePage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import MessagesPage from "./pages/MessagesPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import LearnerPortalPage from "./pages/LearnerPortalPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import NotFound from "./pages/NotFound";
import PresentationRemotePage from "./pages/PresentationRemotePage";
import PoEPage from "./pages/PoEPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin", "lecturer"]} />}>
              <Route path="/" element={<Index />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/modules/:id" element={<ModuleDetailPage />} />
              <Route path="/learners" element={<LearnersPage />} />
              <Route path="/lesson-plans" element={<LessonPlansPage />} />
              <Route path="/assessments" element={<AssessmentsPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["learner"]} />}>
              <Route path="/learner" element={<LearnerPortalPage />} />
              <Route path="/learner/modules/:id" element={<ModuleDetailPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/communications" element={<CommunicationsPage />} />
              <Route path="/poe" element={<PoEPage />} />
            </Route>

            {/* Public — no auth, session code is the shared secret */}
            <Route path="/present/remote/:code" element={<PresentationRemotePage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
