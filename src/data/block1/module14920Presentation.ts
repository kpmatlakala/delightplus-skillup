  import module14920Data from "./module14920Data";

type Module14920LearnerView = {
  subtitle?: string;
  body?: string;
  badges?: string[];
  onScreenContent?: string[];
  phaseCards?: string[];
  cards?: string[];
};

type Module14920RawSlide = {
  slideNumber: number;
  title: string;
  learnerView?: Module14920LearnerView;
  facilitatorNotes?: string;
  source?: string;
};

export type Module14920SlideListItem = {
  slideNumber: number;
  id: string;
  title: string;
  type: "title" | "content" | "activity" | "summary" | "qa";
  content: string;
  notes: string;
  duration: number;
  phaseCards?: string[];
  cards?: string[];
  quiz?: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
};

function toSlideType(title: string, slideNumber: number): Module14920SlideListItem["type"] {
  const lower = title.toLowerCase();
  if (slideNumber === 1 || /^session\s+\d+$/i.test(title)) return "title";
  if (lower.includes("knowledge check") || lower.includes("quiz")) return "qa";
  if (lower.includes("wrap") || lower.includes("summary")) return "summary";
  if (lower.includes("activity") || lower.includes("technique")) return "activity";
  return "content";
}

function extractFacilitatorScript(notes: string): string {
  const marker = "Facilitator notes:\n";
  const markerIndex = notes.indexOf(marker);
  if (markerIndex === -1) return notes.trim();
  return notes.slice(markerIndex + marker.length).trim();
}

function buildContent(title: string, learnerView?: Module14920LearnerView): string {
  const lines: string[] = [];
  if (learnerView?.subtitle) lines.push(learnerView.subtitle);
  if (learnerView?.body) lines.push(learnerView.body);
  if (learnerView?.onScreenContent?.length) {
    lines.push(...learnerView.onScreenContent.map((item) => `• ${item}`));
  }
  if (learnerView?.badges?.length) {
    lines.push(`Focus: ${learnerView.badges.join(" | ")}`);
  }
  return lines.join("\n") || title;
}

function toModule14920Slide(
  raw: Module14920RawSlide,
  quizForSlide?: Module14920SlideListItem["quiz"],
): Module14920SlideListItem {
  return {
    slideNumber: raw.slideNumber,
    id: `slide-${raw.slideNumber}`,
    title: raw.title,
    type: toSlideType(raw.title, raw.slideNumber),
    content: buildContent(raw.title, raw.learnerView),
    notes: extractFacilitatorScript(raw.facilitatorNotes || ""),
    duration: 5,
    phaseCards: raw.learnerView?.phaseCards,
    cards: raw.learnerView?.cards,
    ...(quizForSlide ? { quiz: quizForSlide } : {}),
  };
}

const speakerNotes = module14920Data.module14920SpeakerNotes as Record<string, string>;
const slideList = module14920Data.module14920SlideList as Module14920RawSlide[];

export const module14920SpeakerNotes: Record<string, string> = {
  ...speakerNotes,
};

export const module14920SlideList: Module14920SlideListItem[] = slideList
  .slice()
  .sort((a, b) => a.slideNumber - b.slideNumber)
  .map((slide) => toModule14920Slide(slide));
