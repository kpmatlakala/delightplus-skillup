import briefingJson from "./ProgrammeBriefing.json";

export type ProgrammeBriefingSlide = {
  type: "title" | "objectives" | "content" | "activity" | "summary" | "quiz" | "end-deck";
  title: string;
  subtitle?: string;
  bullets?: string[];
  diagram?: string;
  phaseCards?: string[];
  body?: string;
  highlight?: string;
  speakerNote?: string;
  badge?: string;
};

type ProgrammeBriefingJsonShape = {
  programmeBriefingSlides: ProgrammeBriefingSlide[];
};

const data = briefingJson as ProgrammeBriefingJsonShape;

export const programmeBriefingSlides: ProgrammeBriefingSlide[] = data.programmeBriefingSlides;
