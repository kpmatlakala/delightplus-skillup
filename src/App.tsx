import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ModulesPage from "./pages/ModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import LearnersPage from "./pages/LearnersPage";
import AttendancePage from "./pages/AttendancePage";
import LessonPlansPage from "./pages/LessonPlansPage";
import AssessmentsPage from "./pages/AssessmentsPage";
import ProgramsPage from "./pages/ProgramsPage";
import CompliancePage from "./pages/CompliancePage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import MessagesPage from "./pages/MessagesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/:id" element={<ModuleDetailPage />} />
          <Route path="/learners" element={<LearnersPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/lesson-plans" element={<LessonPlansPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
