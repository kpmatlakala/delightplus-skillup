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
  ArrowRight,
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

  /* Keep refs so interval/channel callbacks are never stale */
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const stateRef   = useRef<SlideStatePayload | null>(null);
  const pingTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectCount = useRef(0);

  useEffect(() => { stateRef.current = state; }, [state]);

  /* ── Send a command to the desktop */
  const send = (cmd: RemoteCommand) => {
    channelRef.current?.send({ type: "broadcast", event: EV_CMD, payload: cmd });
  };

  /* ── Channel setup — extracted so we can call it again on reconnect */
  const connectChannel = (code: string) => {
    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (pingTimer.current) { clearInterval(pingTimer.current); pingTimer.current = null; }

    const ch = supabase.channel(channelName(code), {
      config: { broadcast: { ack: false } },
    } as Parameters<typeof supabase.channel>[1]);

    ch
      .on("broadcast", { event: EV_SLIDE_STATE }, ({ payload }: { payload: SlideStatePayload }) => {
        reconnectCount.current = 0; // successful connection — reset backoff
        setState(payload);
        setStatus("connected");
      })
      .subscribe((subStatus) => {
        if (subStatus === "SUBSCRIBED") {
          setStatus("waiting");
          ch.send({ type: "broadcast", event: EV_REQUEST_SYNC, payload: {} });
        } else if (subStatus === "CHANNEL_ERROR" || subStatus === "TIMED_OUT") {
          setStatus("disconnected");
          // Auto-reconnect with exponential backoff (max 8 s)
          const delay = Math.min(1000 * 2 ** reconnectCount.current, 8000);
          reconnectCount.current += 1;
          reconnectTimer.current = setTimeout(() => {
            setStatus("connecting");
            connectChannel(code);
          }, delay);
        }
      });

    channelRef.current = ch;

    /* Retry sync every 1.5 s until we get a slide-state response,
       then switch to a 5 s keepalive ping so the desktop tracks presence. */
    pingTimer.current = setInterval(() => {
      if (!stateRef.current) {
        ch.send({ type: "broadcast", event: EV_REQUEST_SYNC, payload: {} });
      } else {
        ch.send({ type: "broadcast", event: EV_PING, payload: {} });
      }
    }, 1_500);
  };

  /* ── Channel lifecycle */
  useEffect(() => {
    if (!upperCode) return;
    connectChannel(upperCode);
    return () => {
      if (pingTimer.current) clearInterval(pingTimer.current);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upperCode]);

  /* ─────────────────── Render ────────────────────────────────────────────── */

  const progress = state ? ((state.index + 1) / state.total) * 100 : 0;
  const isFirst  = state?.index === 0;
  const isLast   = state ? state.index === state.total - 1 : false;
  const isQuiz   = state?.isQuiz ?? false;

  return (
    /* h-dvh + flex col — children must use flex-shrink-0 or flex-1 min-h-0
       so the middle region actually clips and scrolls instead of expanding. */
    <div className="h-dvh flex flex-col bg-gray-950 text-white select-none overflow-hidden">

      {/* ── Top chrome: header + progress ── */}
      <div className="flex-shrink-0">
        <header className="flex items-center justify-between px-4 py-2.5 bg-black/70 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <GraduationCap size={14} className="text-white/40 shrink-0" />
            <span className="text-white/50 text-xs font-medium truncate">CET Remote</span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <code className="font-mono text-white/80 font-bold tracking-[0.2em] text-xs">{upperCode}</code>
            {status === "connected" ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <Wifi size={11} /> Live
              </span>
            ) : status === "waiting" ? (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                <Monitor size={11} /> Waiting…
              </span>
            ) : status === "disconnected" ? (
              <span className="flex items-center gap-1 text-[11px] text-red-400 font-semibold">
                <WifiOff size={11} /> Disconnected
              </span>
            ) : (
              <span className="text-[11px] text-white/30">Connecting…</span>
            )}
          </div>
        </header>

        {/* Progress bar */}
        <div className="h-[3px] bg-white/8">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Waiting / not-yet-connected state ── */}
      {!state ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Monitor size={24} className="text-white/25" />
          </div>
          <p className="text-white/50 text-sm">Waiting for desktop presentation…</p>
          <p className="text-white/25 text-xs max-w-[220px]">
            Code: <strong className="font-mono text-white/40">{upperCode}</strong>
          </p>
        </div>
      ) : (
        <>
          {/* ── Sticky slide header (always visible, never scrolls away) ── */}
          <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-white/8 bg-gray-950">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <TypeBadge type={state.type} />
              <span className="text-white/30 text-xs tabular-nums font-mono shrink-0">
                {state.index + 1} / {state.total}
              </span>
            </div>
            {state.sessionLabel && (
              <p className="text-indigo-400 text-[11px] uppercase tracking-widest font-semibold mb-0.5">
                {state.sessionLabel}
              </p>
            )}
            <h1 className="text-base font-bold text-white leading-snug">
              {state.title}
            </h1>
            {state.subtitle && (
              <p className="text-white/40 text-xs leading-snug mt-0.5">{state.subtitle}</p>
            )}
          </div>

          {/* ── Scrollable notes + extras ── */}
          {/* min-h-0 is CRITICAL — without it flex-1 won't shrink and overflow-y-auto
              never activates, making the page one tall non-scrolling column. */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div className="px-4 pt-4 pb-4 space-y-3">

              {/* Speaker notes — always expanded, no toggle */}
              {state.speakerNote ? (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <ScrollText size={12} className="text-yellow-400 shrink-0" />
                    <span className="text-yellow-400 text-[11px] font-semibold uppercase tracking-widest">
                      Presenter Notes
                    </span>
                  </div>
                  <div className="bg-yellow-500/6 border border-yellow-500/20 rounded-xl px-4 py-3">
                    <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">
                      {state.speakerNote}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/20 text-xs italic">No speaker notes for this slide.</p>
              )}

              {/* Quiz notice */}
              {isQuiz && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3">
                  <p className="text-purple-300 text-sm font-medium">
                    🎯 Knowledge Check — do not reveal the answer until learners have responded.
                  </p>
                </div>
              )}

              {/* Up next */}
              {state.nextTitle && !isLast && (
                <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-2.5">
                  <p className="text-white/25 text-[11px] uppercase tracking-widest mb-0.5">Up next</p>
                  <p className="text-white/50 text-sm leading-snug">{state.nextTitle}</p>
                </div>
              )}

              {/* Launch next unit */}
              {state.isLastSlide && state.nextUnitId && (
                <div>
                  <p className="text-white/25 text-[11px] uppercase tracking-widest mb-2">Ready to continue?</p>
                  <button
                    onClick={() => send({ action: "launch-unit", unitId: state.nextUnitId! })}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500 active:bg-emerald-400 active:scale-[0.98] text-black font-bold text-sm transition-all"
                  >
                    {state.nextUnitLabel ?? "Open next unit"}
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-white/20 text-[11px] text-center mt-1.5">
                    Launches on the presentation screen too
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* ── Navigation bar — fixed to bottom, never scrolls ── */}
          <div className="flex-shrink-0 border-t border-white/10 bg-black/80 px-3 pt-3 pb-4 safe-area-bottom">
            <div className="flex gap-2 items-stretch">

              {/* PREV */}
              <button
                onClick={() => send({ action: "prev" })}
                disabled={isFirst}
                aria-label="Previous slide"
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-4 rounded-2xl bg-white/8 border border-white/10 text-white active:bg-white/15 active:scale-95 transition-all duration-100 disabled:opacity-20 disabled:pointer-events-none"
              >
                <ChevronLeft size={26} />
                <span className="text-[11px] font-semibold text-white/60">Prev</span>
              </button>

              {/* Centre counter */}
              <div className="flex flex-col items-center justify-center px-2 min-w-[52px]">
                <span className="text-white font-bold text-xl leading-none tabular-nums">
                  {state.index + 1}
                </span>
                <span className="text-white/30 text-[11px]">of {state.total}</span>
              </div>

              {/* NEXT */}
              <button
                onClick={() => send({ action: "next" })}
                disabled={isLast || isQuiz}
                aria-label="Next slide"
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-4 rounded-2xl bg-white text-gray-900 active:bg-white/80 active:scale-95 transition-all duration-100 disabled:opacity-20 disabled:pointer-events-none"
              >
                <ChevronRight size={26} />
                <span className="text-[11px] font-bold">Next</span>
              </button>

            </div>

            {isQuiz && (
              <p className="text-center text-white/25 text-[11px] mt-2">
                Next locked — answer the quiz on the presentation screen first.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
