import { useEffect, useState, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Target,
  BookOpen,
  Zap,
  CheckCircle2,
  Lightbulb,
  Users,
  AlertCircle,
  Maximize2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Module } from "@/types/course";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
type SlideType = "title" | "objectives" | "content" | "activity" | "summary";

interface Slide {
  type: SlideType;
  title: string;
  subtitle?: string;
  bullets?: string[];
  body?: string;
  highlight?: string; // callout / example box
  speakerNote?: string;
  badge?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Slide builder  — converts a Module into a Slide[]
───────────────────────────────────────────────────────────────────────────── */
export function buildSlides(mod: Module): Slide[] {
  const slides: Slide[] = [];

  /* 1 ── Title slide */
  slides.push({
    type: "title",
    title: mod.title,
    subtitle: `SAQA ${mod.id}  ·  Block ${mod.block}  ·  ${mod.days}  ·  ${mod.credits} Credits`,
    body: mod.type,
    speakerNote:
      `Welcome learners to ${mod.title}. ` +
      `Today we cover SAQA unit standard ${mod.id}. ` +
      `Remind learners to sign the attendance register before the session starts. ` +
      `Distribute the learner workbook and ensure all resources are accessible.`,
    badge: mod.type,
  });

  /* 2 ── Learning objectives */
  slides.push({
    type: "objectives",
    title: "What You Will Be Able To Do",
    subtitle: "Learning Outcomes",
    bullets: mod.objectives,
    highlight:
      "These outcomes align with the unit standard's specific outcomes. Learners will be assessed against these at the end of the block.",
    speakerNote:
      `Walk through each objective clearly. Ask learners: "Which of these do you already know something about?" ` +
      `This activates prior knowledge and gives you a sense of the group's baseline.`,
  });

  /* 3 ── Content slides — group into chunks of 3 items */
  const chunkSize = 3;
  for (let i = 0; i < mod.content.length; i += chunkSize) {
    const chunk = mod.content.slice(i, i + chunkSize);
    const isFirst = i === 0;
    slides.push({
      type: "content",
      title: isFirst ? "Core Concepts" : "Core Concepts (continued)",
      subtitle: `Topic ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(mod.content.length / chunkSize)}`,
      bullets: chunk,
      speakerNote:
        `Use the learner guide to expand on each point. ` +
        `Encourage learners to annotate their workbooks as you present. ` +
        chunk
          .map((item) => {
            const key = item.split(":")[0].trim();
            return `For "${key}": draw a real-world example on the board before moving on.`;
          })
          .join(" "),
    });
  }

  /* 4 ── Activities */
  if (mod.activities.length > 0) {
    const individual = mod.activities.filter((a) => !a.toLowerCase().includes("group"));
    const group = mod.activities.filter((a) => a.toLowerCase().includes("group"));

    if (individual.length > 0) {
      slides.push({
        type: "activity",
        title: "Individual Activities",
        subtitle: "Work through these in your learner workbook",
        bullets: individual,
        highlight:
          "Allow 5–10 minutes per activity. Circulate the room. Do not give answers — ask leading questions.",
        speakerNote:
          `Set a timer for each activity. ` +
          `While learners work, check understanding by asking: "Can you explain your reasoning?" ` +
          `Debrief each activity before moving to the next — do not rush.`,
      });
    }

    if (group.length > 0) {
      slides.push({
        type: "activity",
        title: "Group Activity",
        subtitle: "Collaborative task — assign roles before starting",
        bullets: group,
        highlight:
          "Suggested roles: Scribe, Presenter, Timekeeper, Devil's Advocate. Groups should be 3–4 learners.",
        speakerNote:
          `Ensure group diversity — mix strong and developing learners. ` +
          `Group outputs should be presented to the class. ` +
          `Award marks or verbal recognition for strong group contributions.`,
      });
    }
  }

  /* 5 ── Resources */
  slides.push({
    type: "content",
    title: "Resources for This Session",
    subtitle: "Documents & tools you need",
    bullets: mod.resources,
    speakerNote:
      `Confirm all resources are available before the session runs. ` +
      `Physical copies should be distributed. Digital copies are in the portal under this module. ` +
      `The bilingual glossary is especially important for learners whose first language is Sepedi or Tshivenda.`,
  });

  /* 6 ── Summary */
  slides.push({
    type: "summary",
    title: "Session Wrap-Up",
    subtitle: "Key takeaways",
    bullets: mod.objectives.map((o) => `✓  ${o}`),
    highlight:
      "Before leaving: make sure you understand each learning outcome. If unsure, flag it with the facilitator.",
    speakerNote:
      `Run a quick verbal check: call on individual learners to summarise one concept each. ` +
      `Remind learners of:\n` +
      `• Any upcoming quiz or assessment\n` +
      `• Documents to complete in their workbook before next session\n` +
      `• Attendance — ensure sign-out is done.`,
  });

  return slides;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Slide type config
───────────────────────────────────────────────────────────────────────────── */
const SLIDE_CONFIG: Record<
  SlideType,
  { bg: string; accent: string; label: string; Icon: React.ElementType }
> = {
  title: {
    bg: "from-indigo-950 via-indigo-900 to-violet-900",
    accent: "text-violet-300 border-violet-500/40",
    label: "Introduction",
    Icon: Maximize2,
  },
  objectives: {
    bg: "from-sky-950 via-sky-900 to-cyan-900",
    accent: "text-cyan-300 border-cyan-500/40",
    label: "Objectives",
    Icon: Target,
  },
  content: {
    bg: "from-slate-950 via-slate-900 to-slate-800",
    accent: "text-emerald-300 border-emerald-600/40",
    label: "Content",
    Icon: BookOpen,
  },
  activity: {
    bg: "from-amber-950 via-orange-950 to-amber-900",
    accent: "text-amber-300 border-amber-500/40",
    label: "Activity",
    Icon: Zap,
  },
  summary: {
    bg: "from-green-950 via-emerald-950 to-teal-900",
    accent: "text-teal-300 border-teal-500/40",
    label: "Summary",
    Icon: CheckCircle2,
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
interface PresentationModeProps {
  module: Module;
  isAdmin?: boolean;
  onClose: () => void;
}

export function PresentationMode({ module: mod, isAdmin = false, onClose }: PresentationModeProps) {
  const slides = buildSlides(mod);
  const [current, setCurrent] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [animating, setAnimating] = useState<"in" | "out" | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const total = slides.length;
  const slide = slides[current];
  const config = SLIDE_CONFIG[slide.type];

  /* ── Navigation */
  const go = useCallback(
    (dir: "next" | "prev") => {
      const next = dir === "next" ? current + 1 : current - 1;
      if (next < 0 || next >= total) return;
      setDirection(dir);
      setAnimating("out");
      setTimeout(() => {
        setCurrent(next);
        setAnimating("in");
        setTimeout(() => setAnimating(null), 250);
      }, 180);
    },
    [current, total]
  );

  /* ── Keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go("next");
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go("prev");
      if (e.key === "Escape") onClose();
      if (e.key.toLowerCase() === "n" && isAdmin) setNotesOpen((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, onClose, isAdmin]);

  /* ── Slide content animation class */
  const contentClass =
    animating === "out"
      ? direction === "next"
        ? "opacity-0 translate-x-6"
        : "opacity-0 -translate-x-6"
      : animating === "in"
      ? direction === "next"
        ? "opacity-0 -translate-x-4"
        : "opacity-0 translate-x-4"
      : "opacity-100 translate-x-0";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "black" }}>
      {/* ── Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-black/60 backdrop-blur border-b border-white/10 z-10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Badge
            variant="outline"
            className={`text-xs font-semibold uppercase tracking-widest shrink-0 ${config.accent}`}
          >
            <config.Icon size={11} className="mr-1" />
            {config.label}
          </Badge>
          <span className="text-white/60 text-sm truncate">{mod.title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white/40 text-sm tabular-nums">
            {current + 1} / {total}
          </span>
          {isAdmin && (
            <button
              onClick={() => setNotesOpen((v) => !v)}
              title="Toggle speaker notes (N)"
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                notesOpen
                  ? "bg-white/15 border-white/30 text-white"
                  : "border-white/15 text-white/50 hover:text-white/80"
              }`}
            >
              <MessageSquare size={13} />
              Notes
            </button>
          )}
          <button
            onClick={onClose}
            title="Exit (Esc)"
            className="ml-1 text-white/50 hover:text-white transition-colors p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Progress bar */}
      <div className="h-1 bg-white/10 flex-shrink-0">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* ── Slide area */}
      <div
        className={`flex-1 bg-gradient-to-br ${config.bg} flex flex-col overflow-hidden`}
      >
        {/* Decorative grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          className={`relative flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-32 py-8 transition-all duration-200 ease-in-out ${contentClass}`}
        >
          {slide.type === "title" ? (
            /* ── Title slide layout */
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm mb-8">
                <Lightbulb size={14} />
                SAQA {mod.id}  ·  NQF Level 4  ·  {mod.credits} Credits
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {slide.title}
              </h1>
              <p className="text-white/50 text-lg mb-10">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
                  Block {mod.block}
                </span>
                <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
                  {mod.days}
                </span>
                <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm font-medium capitalize">
                  {mod.type}
                </span>
              </div>
            </div>
          ) : (
            /* ── Content slide layout */
            <div className="max-w-4xl w-full mx-auto">
              {slide.subtitle && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-3 ${config.accent.split(" ")[0]}`}>
                  {slide.subtitle}
                </p>
              )}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-snug">
                {slide.title}
              </h2>

              {slide.bullets && slide.bullets.length > 0 && (
                <ul className="space-y-3 mb-7">
                  {slide.bullets.map((item, i) => {
                    const isCheckmark = item.startsWith("✓");
                    const cleaned = item.replace(/^✓\s*/, "");
                    const [label, detail] = cleaned.split(":").map((s) => s.trim());
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-1 shrink-0 ${isCheckmark ? "text-green-400" : config.accent.split(" ")[0]}`}>
                          {isCheckmark ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                              {i + 1}
                            </span>
                          )}
                        </span>
                        <span className="text-white/90 text-base md:text-lg leading-relaxed">
                          {detail ? (
                            <>
                              <span className="font-semibold text-white">{label}</span>
                              <span className="text-white/60"> — </span>
                              {detail}
                            </>
                          ) : (
                            cleaned
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {slide.body && (
                <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">{slide.body}</p>
              )}

              {slide.highlight && (
                <div className={`flex gap-3 p-4 rounded-xl border bg-white/5 ${config.accent}`}>
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base leading-relaxed opacity-90">{slide.highlight}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Speaker notes panel */}
      {isAdmin && notesOpen && slide.speakerNote && (
        <div className="flex-shrink-0 bg-black/90 border-t border-white/10 px-6 md:px-16 py-4 max-h-48 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Users size={13} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">
              Facilitator Notes
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{slide.speakerNote}</p>
        </div>
      )}

      {/* ── Bottom navigation */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-black/60 backdrop-blur border-t border-white/10">
        {/* Dot nav */}
        <div className="flex gap-1.5 overflow-x-auto max-w-xs">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? "next" : "prev");
                setAnimating("out");
                setTimeout(() => {
                  setCurrent(i);
                  setAnimating("in");
                  setTimeout(() => setAnimating(null), 250);
                }, 180);
              }}
              className={`shrink-0 rounded-full transition-all duration-200 ${
                i === current
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/25 hover:bg-white/50"
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => go("prev")}
            disabled={current === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors border border-white/15"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <button
            onClick={() => go("next")}
            disabled={current === total - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-16 right-5 text-white/20 text-xs pointer-events-none select-none">
        ← → navigate · Esc exit{isAdmin ? " · N notes" : ""}
      </div>
    </div>
  );
}
