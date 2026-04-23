import { BLOCK_INTERACTIVE_SECTIONS_MAP } from "@/data/blockAssessmentQuestions";

export type AssessmentMarkTemplateItem = {
  id: string;
  label: string;
  prompt: string;
  maxMarks: number;
  sectionTitle?: string;
  sectionModule?: string;
  optionHints?: string[];
};

function parseMarks(activity: string, fallback = 5) {
  const match = activity.match(/(\d+)\s*marks?/i);
  const parsed = match ? Number(match[1]) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function splitMarks(totalMarks: number, parts: number): number[] {
  if (parts <= 1) return [totalMarks];

  const base = Math.floor((totalMarks / parts) * 100) / 100;
  const values = Array.from({ length: parts }, () => base);
  const used = Math.round(base * parts * 100) / 100;
  values[parts - 1] = Math.round((totalMarks - (used - base)) * 100) / 100;

  return values;
}

function normalizeOptions(options?: string[]) {
  return (options ?? []).filter((option) => !/^select\b/i.test(option));
}

export function buildAssessmentMarkTemplate(unitId: string, fallbackActivities: string[]): AssessmentMarkTemplateItem[] {
  const sections = Object.values(BLOCK_INTERACTIVE_SECTIONS_MAP)
    .flat()
    .filter((section) => section.module.startsWith(`${unitId} `) || section.module.startsWith(`${unitId}—`) || section.module.startsWith(`${unitId} -`) || section.module.startsWith(`${unitId} —`));

  if (!sections.length) {
    return fallbackActivities.map((activity, index) => ({
      id: `task-${index + 1}`,
      label: `Task ${index + 1}`,
      prompt: activity,
      maxMarks: parseMarks(activity, 5),
    }));
  }

  return sections.flatMap((section) =>
    section.questions.flatMap((question) => {
      if (question.inputType === "textarea" && question.subFields?.length) {
        const marks = splitMarks(question.marks, question.subFields.length);
        return question.subFields.map((subField, index) => ({
          id: `${question.id}::sub-${index + 1}`,
          label: `${question.label}.${index + 1}`,
          prompt: `${question.prompt} (${subField.label})`,
          maxMarks: marks[index],
          sectionTitle: section.title,
          sectionModule: section.module,
          optionHints: normalizeOptions(subField.options),
        }));
      }

      if (question.inputType === "table" && question.tableRows?.length && question.tableColumns?.length) {
        const parts = question.tableRows.length * question.tableColumns.length;
        const marks = splitMarks(question.marks, parts);
        let markIndex = 0;

        return question.tableRows.flatMap((rowLabel, rowIndex) =>
          question.tableColumns!.map((columnLabel, columnIndex) => {
            const item: AssessmentMarkTemplateItem = {
              id: `${question.id}::r${rowIndex + 1}c${columnIndex + 1}`,
              label: `${question.label}.${rowIndex + 1}.${columnIndex + 1}`,
              prompt: `${question.prompt} (Row ${rowLabel}, ${columnLabel})`,
              maxMarks: marks[markIndex],
              sectionTitle: section.title,
              sectionModule: section.module,
              optionHints: normalizeOptions(question.tableColumnOptions?.[columnIndex]),
            };
            markIndex += 1;
            return item;
          })
        );
      }

      return [{
        id: question.id,
        label: question.label,
        prompt: question.prompt,
        maxMarks: question.marks,
        sectionTitle: section.title,
        sectionModule: section.module,
        optionHints: normalizeOptions(question.options),
      }];
    })
  );
}
