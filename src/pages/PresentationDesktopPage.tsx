/**
 * PresentationDesktopPage — /present/desktop/:code/:moduleId
 *
 * Opened in a new browser tab by PresentationLaunchPage when the facilitator
 * taps a module on their phone. Renders PresentationMode fullscreen using
 * the pre-agreed session code so the phone's remote page connects instantly.
 *
 * Because Supabase stores the session in localStorage, this new tab is
 * already authenticated — no re-login needed.
 */

import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useModuleFlow } from "@/hooks/useModuleFlow";
import { PresentationMode } from "@/components/PresentationMode";
import { modules as allModules } from "@/data/courseData";
import { GraduationCap, Lock, Loader2 } from "lucide-react";

export default function PresentationDesktopPage() {
  const { code, moduleId } = useParams<{ code: string; moduleId: string }>();
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

  const isBriefing = moduleId === "briefing";

  /* Look up the module from courseData */
  const mod = useMemo(
    () => (isBriefing ? undefined : allModules.find((m) => m.id === moduleId)),
    [moduleId, isBriefing]
  );

  /* Load the lesson flow (DB or static fallback) */
  const { flow, loading: flowLoading } = useModuleFlow(isBriefing ? undefined : moduleId);

  /* Close this tab when the presentation ends */
  const handleClose = () => {
    if (window.opener) {
      window.close();
    } else {
      navigate("/");
    }
  };

  /* ── Auth loading ── */
  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-950">
        <Loader2 size={28} className="text-indigo-400 animate-spin" />
      </div>
    );
  }

  /* ── Auth guard ── */
  if (!user || (role !== "admin" && role !== "lecturer" && role !== "moderator")) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-gray-950 text-white px-6 text-center">
        <Lock size={36} className="text-white/20" />
        <p className="text-white/50 text-sm max-w-xs">
          You must be logged in as a facilitator or admin to run presentations.
        </p>
        <button
          onClick={() => navigate("/auth/login")}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  /* ── Module not found ── */
  if (!isBriefing && !mod) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 bg-gray-950 text-white px-6 text-center">
        <GraduationCap size={36} className="text-white/20" />
        <p className="text-white/50 text-sm">Module "{moduleId}" not found.</p>
      </div>
    );
  }

  /* ── Flow still loading — show a brief splash while slides build ── */
  if (!isBriefing && flowLoading && !flow) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 bg-gray-950 text-white">
        <Loader2 size={28} className="text-indigo-400 animate-spin" />
        <p className="text-white/35 text-sm">Loading lesson flow…</p>
      </div>
    );
  }

  /* ── Render the fullscreen presentation ── */
  return (
    <PresentationMode
      module={mod}
      flow={flow}
      mode={isBriefing ? "briefing" : "module"}
      isAdmin={true}
      initialSessionCode={code}
      onClose={handleClose}
    />
  );
}
