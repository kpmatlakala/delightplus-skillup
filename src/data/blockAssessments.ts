const BLOCK_1_DOC_BASE = "/docs/SAQA_78965_CET_Training/Block-1/Block1-Test";
const BLOCK_2_DOC_BASE = "/docs/SAQA_78965_CET_Training/Block-2/Block2-Test";

export type BlockAssessmentStatus = "ready" | "coming-soon";

export interface BlockAssessmentMeta {
  blockNum: string;
  label: string;
  shortLabel: string;
  theme: string;
  date: string;
  route: string;
  units: string[];
  totalMarks: number;
  status: BlockAssessmentStatus;
  ctaLabel: string;
  paperMarkdown: string;
  paperSourceHref?: string;
  memorandumHref?: string;
}

export const BLOCK_ASSESSMENTS: BlockAssessmentMeta[] = [
  {
    blockNum: "1",
    label: "Block 1 — Foundations of Systems Development",
    shortLabel: "Block 1",
    theme: "09–13 March 2026",
    date: "Monday 13 April 2026 (AM)",
    route: "/learner/assessment/block/1",
    units: [
      "US 14924: Information Systems Analysis",
      "US 14920: Participate in Groups/Teams",
      "US 14918: Describe Principles of Computer Programming",
      "US 14927: Apply Problem-Solving Strategies",
      "US 14915: Design a Computer Program to Specification",
    ],
    totalMarks: 100,
    status: "ready",
    ctaLabel: "Open Block 1 Test",
    paperMarkdown: `# Block 1 Summative Test\n\nThe Block 1 reference paper has been moved to the public docs folder.\n\n- Test paper: ${BLOCK_1_DOC_BASE}/Block1_Summative_Test.md\n- Memorandum: ${BLOCK_1_DOC_BASE}/Block1_Summative_Memorandum.md`,
    paperSourceHref: `${BLOCK_1_DOC_BASE}/Block1_Summative_Test.md`,
    memorandumHref: `${BLOCK_1_DOC_BASE}/Block1_Summative_Memorandum.md`,
  },
  {
    blockNum: "2",
    label: "Block 2 — Applied Programming and Systems Design",
    shortLabel: "Block 2",
    theme: "06–10 April 2026",
    date: "Monday 04 May 2026 (AM)",
    route: "/learner/assessment/block/2",
    units: [
      "US 14910: Apply Principles of Computer Programming",
      "US 14933: Create Web Applications with Scripting",
      "US 14930: Principles of Developing Software for the Internet",
    ],
    totalMarks: 100,
    status: "ready",
    ctaLabel: "Open Block 2 Test",
    paperMarkdown: `# Block 2 Summative Test\n\nThe Block 2 reference paper has been moved to the public docs folder.\n\n- Test paper: ${BLOCK_2_DOC_BASE}/Block2_Summative_Test.md\n- Memorandum: ${BLOCK_2_DOC_BASE}/Block2_Summative_Memorandum.md\n\n**Included unit standards:**\n- US 14910 — Apply Principles of Computer Programming\n- US 14933 — Create Web Applications with Scripting\n- US 14930 — Principles of Developing Software for the Internet (included for integrated competency evidence).`,
    paperSourceHref: `${BLOCK_2_DOC_BASE}/Block2_Summative_Test.md`,
    memorandumHref: `${BLOCK_2_DOC_BASE}/Block2_Summative_Memorandum.md`,
  },
  {
    blockNum: "3",
    label: "Block 3 — Testing, Support and Integrated Assessment",
    shortLabel: "Block 3",
    theme: "04–08 May 2026",
    date: "Thursday 07 / Friday 08 May 2026 (AM)",
    route: "/learner/assessment/block/3",
    units: [
      "US 14908: Testing IT Systems Against Specifications",
      "US 14919: Resolve Computer Users' Problems",
      "US 120379: Work as a Project Team Member",
    ],
    totalMarks: 80,
    status: "coming-soon",
    ctaLabel: "Coming Soon",
    paperMarkdown: `# Block 3 Summative Test\n\nThe in-app Block 3 paper is being prepared.\n\n**Included units:**\n- US 14908 — Testing IT Systems Against Specifications\n- US 14919 — Resolve Computer Users' Problems\n- US 120379 — Work as a Project Team Member\n\n> Placeholder only for now.`,
  },
];

export const BLOCK_ASSESSMENT_MAP: Record<string, BlockAssessmentMeta> =
  Object.fromEntries(BLOCK_ASSESSMENTS.map((item) => [item.blockNum, item])) as Record<string, BlockAssessmentMeta>;
