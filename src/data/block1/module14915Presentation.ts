import module14915Data from "./module14915Data";

type Module14915LearnerView = {
  subtitle?: string;
  body?: string;
  badges?: string[];
  onScreenContent?: string[];
  phaseCards?: string[];
  cards?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

type Module14915RawSlide = {
  slideNumber: number;
  title: string;
  learnerView?: Module14915LearnerView;
  facilitatorNotes?: string;
  source?: string;
};

export type Module14915SlideListItem = {
  slideNumber: number;
  id: string;
  title: string;
  type: "title" | "content" | "activity" | "summary" | "qa";
  content: string;
  notes: string;
  duration: number;
  phaseCards?: string[];
  cards?: string[];
  imageUrl?: string;
  imageAlt?: string;
  quiz?: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
};

function toSlideType(title: string, slideNumber: number): Module14915SlideListItem["type"] {
  const lower = title.toLowerCase();
  if (slideNumber === 1 || /^session\s+\d+$/i.test(title)) return "title";
  if (lower.includes("knowledge check") || lower.includes("quiz")) return "qa";
  if (lower.includes("wrap") || lower.includes("summary")) return "summary";
  if (lower.includes("activity") || lower.includes("exercise") || lower.includes("sprint")) return "activity";
  return "content";
}

function extractFacilitatorScript(notes: string): string {
  const marker = "Facilitator notes:\n";
  const markerIndex = notes.indexOf(marker);
  if (markerIndex === -1) return notes.trim();
  return notes.slice(markerIndex + marker.length).trim();
}

function buildContent(title: string, learnerView?: Module14915LearnerView): string {
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

function toModule14915Slide(
  raw: Module14915RawSlide,
  quizForSlide?: Module14915SlideListItem["quiz"],
): Module14915SlideListItem {
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
    imageUrl: raw.learnerView?.imageUrl,
    imageAlt: raw.learnerView?.imageAlt,
    ...(quizForSlide ? { quiz: quizForSlide } : {}),
  };
}

const speakerNotes = module14915Data.module14915SpeakerNotes as Record<string, string>;
const slideList = module14915Data.module14915SlideList as Module14915RawSlide[];

export const module14915SpeakerNotes: Record<string, string> = {
  ...speakerNotes,
};

export const module14915SlideList: Module14915SlideListItem[] = slideList
  .slice()
  .sort((a, b) => a.slideNumber - b.slideNumber)
  .map((slide) => toModule14915Slide(slide));
