import programmeBriefingData from "./programmeBriefingData";

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
  speakerNotes?: string[];
  badge?: string;
};

type ProgrammeBriefingDataShape = {
  programmeBriefingSlides: ProgrammeBriefingSlide[];
};

const data = programmeBriefingData as unknown as ProgrammeBriefingDataShape;

export const programmeBriefingSlides: ProgrammeBriefingSlide[] = data.programmeBriefingSlides.map((slide) => {
  const speakerNote = slide.speakerNotes?.length
    ? slide.speakerNotes.join("\n\n")
    : slide.speakerNote;

  return {
    ...slide,
    speakerNote,
  };
});
