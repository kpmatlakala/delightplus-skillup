/**
 * Shared utilities for the desktop ↔ mobile presentation sync system.
 *
 * Architecture:
 *  - Desktop (PresentationMode) generates a 4-char session code and joins
 *    a Supabase broadcast channel named  `presentation:<CODE>`.
 *  - Mobile (PresentationRemotePage) visits /present/remote/<CODE> and joins
 *    the same channel.
 *  - Desktop broadcasts `slide-state` events (full slide snapshot) whenever
 *    the current slide changes.
 *  - Mobile broadcasts `ping` (every 5 s) to signal it is alive; desktop
 *    responds with current state so mobile always catches up.
 *  - Mobile broadcasts `cmd` (next / prev / goto) to control the desktop.
 */

/* ─── Code generator ─────────────────────────────────────────────────────── */

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion

export function generateSessionCode(): string {
  return Array.from(
    { length: 4 },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");
}

/* ─── Shared event names ─────────────────────────────────────────────────── */

export const EV_SLIDE_STATE  = "slide-state";   // desktop → mobile
export const EV_CMD          = "cmd";           // mobile  → desktop
export const EV_PING         = "ping";          // mobile  → desktop (keepalive + sync request)
export const EV_REQUEST_SYNC = "request-sync";  // mobile  → desktop on first connect

/**
 * EV_LAUNCH — sent from the facilitator's phone on the global launch channel.
 * The desktop (AppLayout listener) receives this and opens PresentationMode
 * using the pre-agreed session code so the phone can connect as remote immediately.
 */
export const EV_LAUNCH = "launch";

/**
 * Fixed Supabase broadcast channel that every authenticated desktop
 * listens on. The facilitator's phone broadcasts EV_LAUNCH here.
 * No session code in the channel name — it is carried in the payload.
 */
export const LAUNCHER_CHANNEL = "cet:presentation-launcher";

export function channelName(code: string): string {
  return `presentation:${code}`;
}

/** Payload carried by EV_LAUNCH */
export interface LaunchPayload {
  /** Module unit-standard id ('14924', '14918', …) or 'briefing' for the programme briefing */
  moduleId: string;
  /** Pre-agreed 4-char session code — desktop adopts this code so the phone can connect as remote */
  sessionCode: string;
}

/* ─── Payload types ─────────────────────────────────────────────────────── */

/** Snapshot of the current slide, sent from desktop → mobile. */
export interface SlideStatePayload {
  index: number;
  total: number;
  type: string;
  title: string;
  subtitle?: string;
  badge?: string;
  sessionLabel?: string;
  speakerNote?: string;
  /** Title of the next slide (for the "up next" preview on mobile) */
  nextTitle?: string;
  /** Title of the previous slide */
  prevTitle?: string;
  /** Whether the current slide is a quiz slide (disables remote Next until answered) */
  isQuiz?: boolean;
}

/** Command sent from mobile → desktop. */
export type RemoteCommand =
  | { action: "next" }
  | { action: "prev" }
  | { action: "goto"; index: number };
