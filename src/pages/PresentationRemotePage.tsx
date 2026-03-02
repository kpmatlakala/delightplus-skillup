/**
 * PresentationRemotePage — Mobile presenter notes + remote slide controller.
 *
 * URL:  /present/remote/:code
 *
 * Open this page on a phone while running PresentationMode on a desktop.
 * Once connected the page shows:
 *   • Current slide title / type / session
 *   • Full speaker notes (scrollable)
 *   • Up-next slide preview
 *   • PREV / NEXT touch buttons (controls the desktop)
 *
 * No authentication is required — the 4-char session code is the shared secret.
 */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Target,
  Zap,
  CheckCircle2,
  Trophy,
  HelpCircle,
  Maximize2,
  Monitor,
  WifiOff,
  Wifi,
  GraduationCap,
  ScrollText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  channelName,
  EV_SLIDE_STATE,
  EV_CMD,
  EV_PING,
  EV_REQUEST_SYNC,
  type SlideStatePayload,
  type RemoteCommand,
} from "@/lib/presentationSync";

/* ─── Slide-type display map ─────────────────────────────────────────────── */

const TYPE_CONFIG: Record<
  string,
  { label: string; Icon: React.ElementType; color: string }
> = {
  title:      { label: "Introduction", Icon: Maximize2,    color: "text-violet-400 bg-violet-500/15 border-violet-500/30" },
  objectives: { label: "Objectives",   Icon: Target,       color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30" },
  content:    { label: "Content",      Icon: BookOpen,     color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  activity:   { label: "Activity",     Icon: Zap,          color: "text-amber-400 bg-amber-500/15 border-amber-500/30" },
  summary:    { label: "Summary",      Icon: CheckCircle2, color: "text-teal-400 bg-teal-500/15 border-teal-500/30" },
  quiz:       { label: "Quiz",         Icon: HelpCircle,   color: "text-purple-400 bg-purple-500/15 border-purple-500/30" },
  "end-deck": { label: "Complete",     Icon: Trophy,       color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
};

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG["content"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.color}`}
    >
      <cfg.Icon size={11} />
      {cfg.label}
    </span>
  );
}

/* ─── Connection status indicator ────────────────────────────────────────── */

type ConnectionStatus = "connecting" | "connected" | "waiting" | "disconnected";

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function PresentationRemotePage() {
  const { code = "" } = useParams<{ code: string }>();
  const upperCode = code.toUpperCase();

  const [state, setState] = useState<SlideStatePayload | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [notesExpanded, setNotesExpanded] = useState(true);

  /* Keep refs so interval/channel callbacks are never stale */
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const stateRef   = useRef<SlideStatePayload | null>(null);
  const pingTimer  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { stateRef.current = state; }, [state]);

  /* ── Send a command to the desktop */
  const send = (cmd: RemoteCommand) => {
    channelRef.current?.send({ type: "broadcast", event: EV_CMD, payload: cmd });
  };

  /* ── Channel lifecycle */
  useEffect(() => {
    if (!upperCode) return;

    const ch = supabase.channel(channelName(upperCode), {
      config: { broadcast: { ack: false } },
    } as Parameters<typeof supabase.channel>[1]);

    ch
      .on("broadcast", { event: EV_SLIDE_STATE }, ({ payload }: { payload: SlideStatePayload }) => {
        setState(payload);
        setStatus("connected");
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setStatus("waiting");
          // Ask the desktop for the latest state immediately
          ch.send({ type: "broadcast", event: EV_REQUEST_SYNC, payload: {} });
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setStatus("disconnected");
        }
      });

    channelRef.current = ch;

    /* Heartbeat ping every 5 s — desktop responds with current slide state */
    pingTimer.current = setInterval(() => {
      ch.send({ type: "broadcast", event: EV_PING, payload: {} });
    }, 5_000);

    return () => {
      if (pingTimer.current) clearInterval(pingTimer.current);
      supabase.removeChannel(ch);
    };
  }, [upperCode]);

  /* ─────────────────── Render ────────────────────────────────────────────── */

  const progress = state ? ((state.index + 1) / state.total) * 100 : 0;
  const isFirst  = state?.index === 0;
  const isLast   = state ? state.index === state.total - 1 : false;
  const isQuiz   = state?.isQuiz ?? false;

  return (
    <div className="min-h-dvh flex flex-col bg-gray-950 text-white select-none">

      {/* ── Header bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap size={16} className="text-white/50" />
          <span className="text-white/60 text-sm font-medium">CET Connect Remote</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="font-mono text-white font-bold tracking-widest text-sm">{upperCode}</code>
          {status === "connected" ? (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <Wifi size={12} /> Live
            </span>
          ) : status === "waiting" ? (
            <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
              <Monitor size={12} /> Waiting for desktop…
            </span>
          ) : status === "disconnected" ? (
            <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
              <WifiOff size={12} /> Disconnected
            </span>
          ) : (
            <span className="text-xs text-white/35">Connecting…</span>
          )}
        </div>
      </header>

      {/* ── Progress bar */}
      <div className="h-1 bg-white/8 flex-shrink-0">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Main content (scrollable) */}
      {!state ? (
        /* Waiting state */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Monitor size={28} className="text-white/30" />
          </div>
          <p className="text-white/50 text-base">
            Waiting for the desktop presentation to connect…
          </p>
          <p className="text-white/25 text-sm">
            Make sure the presenter has opened the presentation with code{" "}
            <strong className="font-mono text-white/40">{upperCode}</strong>.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 pt-5 pb-3">

            {/* Slide meta */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <TypeBadge type={state.type} />
              <span className="text-white/35 text-xs tabular-nums font-mono">
                {state.index + 1} / {state.total}
              </span>
            </div>

            {/* Session label */}
            {state.sessionLabel && (
              <p className="text-indigo-400 text-xs uppercase tracking-widest font-semibold mb-2">
                {state.sessionLabel}
              </p>
            )}

            {/* Slide title */}
            <h1 className="text-2xl font-bold text-white leading-snug mb-1">
              {state.title}
            </h1>

            {/* Subtitle */}
            {state.subtitle && (
              <p className="text-white/45 text-sm leading-snug mb-4">{state.subtitle}</p>
            )}

            <hr className="border-white/8 mb-4" />

            {/* Speaker notes section */}
            {state.speakerNote ? (
              <div className="mb-4">
                <button
                  onClick={() => setNotesExpanded((v) => !v)}
                  className="flex items-center gap-2 mb-3 w-full"
                >
                  <ScrollText size={14} className="text-yellow-400 shrink-0" />
                  <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest flex-1 text-left">
                    Presenter Notes
                  </span>
                  <span className="text-white/25 text-xs">
                    {notesExpanded ? "▲ hide" : "▼ show"}
                  </span>
                </button>

                {notesExpanded && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                      {state.speakerNote}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/20 text-sm italic mb-4">No speaker notes for this slide.</p>
            )}

            {/* Quiz notice */}
            {isQuiz && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 mb-4">
                <p className="text-purple-300 text-sm font-medium">
                  🎯 Knowledge Check — do not reveal the answer until learners have responded.
                </p>
              </div>
            )}

            {/* Up next */}
            {state.nextTitle && !isLast && (
              <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 mb-2">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-0.5">Up next</p>
                <p className="text-white/55 text-sm leading-snug">{state.nextTitle}</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── Navigation controls (always visible, pinned to bottom) */}
      <div className="flex-shrink-0 border-t border-white/10 bg-black/60 p-4">
        <div className="flex gap-3">
          {/* PREV */}
          <button
            onClick={() => send({ action: "prev" })}
            disabled={isFirst || !state}
            aria-label="Previous slide"
            className="flex-1 flex items-center justify-center gap-2 py-5 rounded-xl bg-white/8 border border-white/12 text-white font-semibold text-base active:scale-95 transition-all duration-100 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={22} />
            Prev
          </button>

          {/* Slide counter pill */}
          {state && (
            <div className="flex flex-col items-center justify-center px-3 min-w-[52px]">
              <span className="text-white font-bold text-lg leading-none tabular-nums">
                {state.index + 1}
              </span>
              <span className="text-white/30 text-xs">of {state.total}</span>
            </div>
          )}

          {/* NEXT */}
          <button
            onClick={() => send({ action: "next" })}
            disabled={isLast || !state || isQuiz}
            aria-label="Next slide"
            title={isQuiz ? "Quiz must be answered on the desktop first" : undefined}
            className="flex-1 flex items-center justify-center gap-2 py-5 rounded-xl bg-white text-black font-semibold text-base active:scale-95 transition-all duration-100 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={22} />
          </button>
        </div>

        {isQuiz && (
          <p className="text-center text-white/30 text-xs mt-2">
            Next locked — quiz must be answered on the presentation screen first.
          </p>
        )}
      </div>
    </div>
  );
}
