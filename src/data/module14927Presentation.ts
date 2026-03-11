import module14927Data from "./module14927Data";

type Module14927LearnerView = {
  subtitle?: string;
  body?: string;
  badges?: string[];
  onScreenContent?: string[];
  phaseCards?: string[];
  cards?: string[];
};

type Module14927RawSlide = {
  slideNumber: number;
  title: string;
  learnerView?: Module14927LearnerView;
  facilitatorNotes?: string;
  source?: string;
};

export type Module14927SlideListItem = {
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

function toSlideType(title: string, slideNumber: number): Module14927SlideListItem["type"] {
  const lower = title.toLowerCase();
  if (slideNumber === 1 || /^session\s+\d+$/i.test(title)) return "title";
  if (lower.includes("knowledge check") || lower.includes("quiz")) return "qa";
  if (lower.includes("wrap") || lower.includes("summary")) return "summary";
  if (lower.includes("activity") || lower.includes("exercise")) return "activity";
  return "content";
}

function extractFacilitatorScript(notes: string): string {
  const marker = "Facilitator notes:\n";
  const markerIndex = notes.indexOf(marker);
  if (markerIndex === -1) return notes.trim();
  return notes.slice(markerIndex + marker.length).trim();
}

function buildContent(title: string, learnerView?: Module14927LearnerView): string {
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

function toModule14927Slide(
  raw: Module14927RawSlide,
  quizForSlide?: Module14927SlideListItem["quiz"],
): Module14927SlideListItem {
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

const speakerNotes = module14927Data.module14927SpeakerNotes as Record<string, string>;
const slideList = module14927Data.module14927SlideList as Module14927RawSlide[];

export const module14927SpeakerNotes: Record<string, string> = {
  ...speakerNotes,
};

export const module14927SlideList: Module14927SlideListItem[] = slideList
  .slice()
  .sort((a, b) => a.slideNumber - b.slideNumber)
  .map((slide) => toModule14927Slide(slide));
