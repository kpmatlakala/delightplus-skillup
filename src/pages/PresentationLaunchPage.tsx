/**
 * PresentationLaunchPage — /present/launch
 *
 * Mobile-first authenticated page for facilitators.
 * The facilitator selects a module (or Programme Briefing), taps "Launch",
 * and the desktop browser opens PresentationMode automatically via a
 * Supabase broadcast event.  The phone is then redirected to
 * /present/remote/{code} where it acts as the wireless remote controller.
 *
 * Flow:
 *  1. Facilitator opens /present/launch on their phone (must be logged in)
 *  2. Taps a module
 *  3. Phone generates a 4-char session code, broadcasts EV_LAUNCH on the
 *     global LAUNCHER_CHANNEL with { moduleId, sessionCode }
 *  4. Desktop AppLayout receives EV_LAUNCH and opens PresentationMode
 *     using that pre-agreed sessionCode
 *  5. Phone navigates to /present/remote/{sessionCode} — already connected
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  generateSessionCode,
  EV_LAUNCH,
  LAUNCHER_CHANNEL,
  type LaunchPayload,
} from "@/lib/presentationSync";
import { modules as allModules } from "@/data/courseData";
import {
  GraduationCap,
  Play,
  ChevronRight,
  Loader2,
  Cast,
  Lock,
} from "lucide-react";

export default function PresentationLaunchPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [launching, setLaunching] = useState<string | null>(null); // moduleId being launched

  const block1 = allModules.filter((m) => m.block === 1);
  const block2 = allModules.filter((m) => m.block === 2);
  const block3 = allModules.filter((m) => m.block === 3);

  /* ── Broadcast EV_LAUNCH then navigate to the remote page ── */
  const handleLaunch = (moduleId: string) => {
    if (launching) return;
    setLaunching(moduleId);

    const sessionCode = generateSessionCode();
    const payload: LaunchPayload = { moduleId, sessionCode };

    const ch = supabase.channel(LAUNCHER_CHANNEL, {
      config: { broadcast: { ack: false } },
    } as Parameters<typeof supabase.channel>[1]);

    ch.subscribe((status) => {
      if (status !== "SUBSCRIBED") return;
      ch.send({ type: "broadcast", event: EV_LAUNCH, payload }).then(() => {
        supabase.removeChannel(ch);
        // Phone becomes the remote — remote page already handles "Waiting for desktop"
        navigate(`/present/remote/${sessionCode}`);
      }).catch(() => {
        setLaunching(null);
        supabase.removeChannel(ch);
      });
    });
  };

  /* ── Guard ── */
  if (!user || (role !== "admin" && role !== "lecturer")) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-gray-950 text-white px-6 text-center">
        <Lock size={36} className="text-white/20" />
        <p className="text-white/50 text-sm max-w-xs">
          You must be logged in as a facilitator or admin to launch presentations remotely.
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

  /* ── Module button ── */
  const ModuleRow = ({
    id,
    title,
    days,
    credits,
  }: {
    id: string;
    title: string;
    days: string;
    credits: number;
  }) => {
    const isThis = launching === id;
    return (
      <button
        onClick={() => handleLaunch(id)}
        disabled={!!launching}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 active:bg-white/10 transition-all text-left disabled:opacity-40"
      >
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight truncate">{title}</p>
          <p className="text-white/40 text-xs mt-0.5">
            {days} · {credits} credits
          </p>
        </div>
        {isThis ? (
          <Loader2 size={16} className="text-indigo-400 animate-spin shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-white/25 shrink-0" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-dvh bg-gray-950 text-white flex flex-col select-none">

      {/* ── Header ── */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-black/60 flex-shrink-0">
        <Cast size={18} className="text-indigo-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight">Launch Presentation</p>
          <p className="text-white/40 text-xs">Select a module — desktop opens automatically</p>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-7 pb-12">

        {/* Programme Briefing ── */}
        <section>
          <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-3">
            Programme
          </p>
          <button
            onClick={() => handleLaunch("briefing")}
            disabled={!!launching}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-indigo-500/15 border border-indigo-500/30 active:bg-indigo-500/25 transition-all text-left disabled:opacity-40"
          >
            <GraduationCap size={20} className="text-indigo-400 shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Programme Briefing</p>
              <p className="text-white/40 text-xs">
                FETC IT Systems Development — Orientation &amp; Overview
              </p>
            </div>
            {launching === "briefing" ? (
              <Loader2 size={16} className="text-indigo-400 animate-spin shrink-0" />
            ) : (
              <Play size={16} className="text-indigo-400 shrink-0" />
            )}
          </button>
        </section>

        {/* Block 1 ── */}
        <section>
          <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-3">
            Block 1 · Foundation
          </p>
          <div className="space-y-2">
            {block1.map((m) => (
              <ModuleRow key={m.id} id={m.id} title={m.title} days={m.days} credits={m.credits} />
            ))}
          </div>
        </section>

        {/* Block 2 ── */}
        <section>
          <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-3">
            Block 2 · Applied Programming
          </p>
          <div className="space-y-2">
            {block2.map((m) => (
              <ModuleRow key={m.id} id={m.id} title={m.title} days={m.days} credits={m.credits} />
            ))}
          </div>
        </section>

        {/* Block 3 ── */}
        <section>
          <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-3">
            Block 3 · Systems in Practice
          </p>
          <div className="space-y-2">
            {block3.map((m) => (
              <ModuleRow key={m.id} id={m.id} title={m.title} days={m.days} credits={m.credits} />
            ))}
          </div>
        </section>

        {/* How it works note ── */}
        <div className="rounded-xl bg-white/3 border border-white/8 px-4 py-4 mt-2">
          <p className="text-white/45 text-xs font-semibold uppercase tracking-widest mb-2">
            How it works
          </p>
          <ol className="text-white/40 text-xs space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Tap any module above on your phone</li>
            <li>The desktop browser opens the presentation automatically</li>
            <li>Your phone becomes the wireless remote — Prev / Next from here</li>
            <li>Speaker notes display on your phone only</li>
          </ol>
          <p className="text-white/20 text-xs mt-3 leading-relaxed">
            ⚠ The desktop must be open and logged in to receive the launch signal.
          </p>
        </div>

      </div>
    </div>
  );
}
