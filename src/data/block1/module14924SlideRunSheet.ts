import { buildFlowSlides } from "@/components/PresentationMode";
import { modules } from "@/data/courseData";
import { module14924LessonFlow } from "@/data/block1/module14924LessonFlow";

export type Module14924SlideRunSheetItem = {
  slideNumber: number;
  title: string;
  subtitle?: string;
  learnerView: string[];
  facilitatorNotes: string;
};

const module14924 = modules.find((m) => m.id === "14924");

if (!module14924) {
  throw new Error("Module 14924 not found in courseData.");
}

const slides = buildFlowSlides(module14924LessonFlow, module14924);

function buildLearnerView(s: (typeof slides)[number]): string[] {
  const lines: string[] = [];
  if (s.subtitle) lines.push(`Subtitle: ${s.subtitle}`);
  if (s.body) lines.push(`Body: ${s.body}`);
  if (s.bullets?.length) {
    lines.push("On-screen content:");
    s.bullets.forEach((item, idx) => lines.push(`${idx + 1}. ${item}`));
  }
  if (s.phaseCards?.length) {
    lines.push(`Phase cards: ${s.phaseCards.join(" | ")}`);
  }
  if (s.cards?.length) {
    lines.push(`Cards: ${s.cards.join(" | ")}`);
  }
  if (s.highlight) lines.push(`Highlight: ${s.highlight}`);
  return lines;
}

function buildFacilitatorNotes(s: (typeof slides)[number], idx: number, total: number): string {
  const header = `Slide ${idx + 1} of ${total}\nTitle: ${s.title}`;
  const learnerViewLines = buildLearnerView(s);
  const learnerViewText = learnerViewLines.length
    ? `\nWhat learners see:\n${learnerViewLines.join("\n")}`
    : "";
  const notesText = s.speakerNote?.trim() ? `\nFacilitator notes:\n${s.speakerNote.trim()}` : "";
  return `${header}${learnerViewText}${notesText}`;
}

export const module14924SlideRunSheet: Module14924SlideRunSheetItem[] = slides.map((s, idx) => ({
  slideNumber: idx + 1,
  title: s.title,
  subtitle: s.subtitle,
  learnerView: buildLearnerView(s),
  facilitatorNotes: buildFacilitatorNotes(s, idx, slides.length),
}));

export const module14924SlideRunSheetMarkdown = module14924SlideRunSheet
  .map((item) => {
    const learnerView = item.learnerView.length
      ? item.learnerView.map((line) => `- ${line}`).join("\n")
      : "- (No on-screen content lines)";

    return [
      `## Slide ${item.slideNumber}`,
      "",
      `**Title:** ${item.title}`,
      item.subtitle ? `**Subtitle:** ${item.subtitle}` : "",
      "",
      "**What learners see**",
      learnerView,
      "",
      "**Facilitator Notes**",
      "```text",
      item.facilitatorNotes,
      "```",
      "",
    ]
      .filter(Boolean)
      .join("\n");
  })
  .join("\n");
