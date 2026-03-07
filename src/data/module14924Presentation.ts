import module14924Data from "./module14924Data";

export type Module14924SpeakerNotes = {
  title: string;
  objectives: string;
  activityIndividual: string;
  activityGroup: string;
  summary: string;
};

export type Module14924PresentationSlide = {
  title: string;
  subtitle: string;
  bullets: string[];
  highlight: string;
  speakerNote: string;
  phaseCards?: string[];
};

export type Module14924SlideListItem = {
  slideNumber: number;
  title: string;
  learnerView: {
    subtitle?: string;
    badges?: string[];
    onScreenContent?: string[];
    body?: string;
    highlight?: string;
    // Some authored JSON entries include phase cards on the learner view object.
    phaseCards?: string[];
  };
  facilitatorNotes: string;
  source: string;
};

export type Module14924PresentationFlow = {
  preSessionSlides: Module14924PresentationSlide[];
  session1Insertions: {
    afterSdlc: Module14924PresentationSlide;
  };
};

type Module14924JsonShape = {
  module14924SpeakerNotes: Module14924SpeakerNotes;
  module14924SlideList: Module14924SlideListItem[];
  module14924PresentationFlow?: Module14924PresentationFlow;
  module14924FlowMap?: Array<{ placement: string; title: string }>;
};

const data = module14924Data as Module14924JsonShape;

function extractFacilitatorScript(notes: string): string {
  const marker = "Facilitator notes:\n";
  const markerIndex = notes.indexOf(marker);
  if (markerIndex === -1) return notes.trim();
  return notes.slice(markerIndex + marker.length).trim();
}

function getSlideByNumber(slideNumber: number): Module14924SlideListItem {
  const slide = data.module14924SlideList.find((item) => item.slideNumber === slideNumber);
  if (!slide) {
    throw new Error(`Module 14924 slide not found for slideNumber=${slideNumber}`);
  }
  return slide;
}

function toPresentationSlide(item: Module14924SlideListItem): Module14924PresentationSlide {
  return {
    title: item.title,
    subtitle: item.learnerView.subtitle ?? "",
    bullets: item.learnerView.onScreenContent ?? [],
    highlight: item.learnerView.highlight ?? "",
    speakerNote: extractFacilitatorScript(item.facilitatorNotes),
    phaseCards: item.learnerView.phaseCards,
  };
}

// Stable slide-number mapping avoids duplicate-title lookup bugs.
const PRE_SESSION_SLIDE_NUMBERS = [3, 4] as const;
const SESSION1_AFTER_SDLC_SLIDE_NUMBER = 13;

const module14924SystemAnalysisSlide = toPresentationSlide(getSlideByNumber(PRE_SESSION_SLIDE_NUMBERS[0]));
const module14924AdamStorySlide = toPresentationSlide(getSlideByNumber(PRE_SESSION_SLIDE_NUMBERS[1]));
const module14924SdlcModelsSlide = toPresentationSlide(getSlideByNumber(SESSION1_AFTER_SDLC_SLIDE_NUMBER));

export const module14924SpeakerNotes: Module14924SpeakerNotes = data.module14924SpeakerNotes;

export const module14924SlideList: Module14924SlideListItem[] = data.module14924SlideList;

export const module14924PresentationFlow: Module14924PresentationFlow = {
  preSessionSlides: [module14924SystemAnalysisSlide, module14924AdamStorySlide],
  session1Insertions: {
    afterSdlc: module14924SdlcModelsSlide,
  },
};

export const module14924FlowMap = [
  {
    placement: "Pre-session (before Session 1 starts)",
    title: module14924SystemAnalysisSlide.title,
  },
  {
    placement: "Pre-session (before Session 1 starts)",
    title: module14924AdamStorySlide.title,
  },
  {
    placement: "Session 1 (inserted after SDLC section)",
    title: module14924SdlcModelsSlide.title,
  },
] as const;
