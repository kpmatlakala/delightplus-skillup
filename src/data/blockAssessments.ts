const BLOCK_1_DOC_BASE = "/docs/SAQA_78965_CET_Training/Block-1/Block1-Test";
<<<<<<< Updated upstream
=======
const BLOCK_2_DOC_BASE = "/docs/SAQA_78965_CET_Training/Block-2/Block2-Test";
const BLOCK_3_DOC_BASE = "/docs/SAQA_78965_CET_Training/Block-3/Block3-Test";
>>>>>>> Stashed changes

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
    ],
    totalMarks: 65,
    status: "coming-soon",
    ctaLabel: "Coming Soon",
    paperMarkdown: `# Block 2 Summative Test\n\nBlock 2 planning is now aligned for readiness review.\n\n**Main 4-day focus:**\n- US 14910 — Apply Principles of Computer Programming\n- US 14933 — Create Web Applications with Scripting\n\n**Integrated support / reference:**\n- US 14930 — Principles of Developing Software for the Internet\n\n**Optional flex arrangement:**\n- If the two main units are completed in 3 days, one elective module can be nominated for the remaining day.\n\n> The in-app Block 2 paper is still being prepared.`,
  },
  {
    blockNum: "3",
    label: "Block 3 — Unified Group Practical Assessment",
    shortLabel: "Block 3",
    theme: "04–08 May 2026",
    date: "Thursday 07 / Friday 08 May 2026 (AM)",
    route: "/learner/assessment/block/3",
    units: [
<<<<<<< Updated upstream
      "US 14908: Testing IT Systems Against Specifications",
      "US 14919: Resolve Computer Users' Problems",
      "US 120379: Work as a Project Team Member",
    ],
    totalMarks: 80,
    status: "coming-soon",
    ctaLabel: "Coming Soon",
    paperMarkdown: `# Block 3 Summative Test\n\nThe in-app Block 3 paper is being prepared.\n\n**Included units:**\n- US 14908 — Testing IT Systems Against Specifications\n- US 14919 — Resolve Computer Users' Problems\n- US 120379 — Work as a Project Team Member\n\n> Placeholder only for now.`,
=======
      "US 14924: Information Systems Analysis",
      "US 14920: Participate in Groups/Teams",
      "US 14918: Describe Principles of Computer Programming",
      "US 14927: Apply Problem-Solving Strategies",
      "US 14915: Design a Computer Program to Specification",
      "US 14910: Apply Principles of Computer Programming",
      "US 14933: Create Web Applications with Scripting",
      "US 14930: Principles of Developing Software for the Internet",
      "US 14921: Describe the Types of Computer Systems and Associated Hardware Configurations",
      "US 14908: Testing IT Systems Against Specifications",
      "US 14919: Resolve Computer Users' Problems",
      "US 118028: Supervise Customer Service Standards",
    ],
    totalMarks: 100,
    status: "ready",
    ctaLabel: "Open Block 3 Practical",
    paperMarkdown: `# Block 3 Unified Group Practical Assessment\n\nThe Block 3 practical guide has been moved to the public docs folder.\n\n- Practical guide: ${BLOCK_3_DOC_BASE}/Block3_Practical_Assessment.md\n- Assessor memorandum: ${BLOCK_3_DOC_BASE}/Block3_Practical_Memorandum.md\n\n**Format:** 7 groups × 3 learners, 4 stations, individual sign-off and reflection.\n\n**Coverage:** Integrated evidence across Block 1–3 unit standards, including teamwork and service supervision outcomes.`,
    paperSourceHref: `${BLOCK_3_DOC_BASE}/Block3_Practical_Assessment.md`,
    memorandumHref: `${BLOCK_3_DOC_BASE}/Block3_Practical_Memorandum.md`,
>>>>>>> Stashed changes
  },
];

export const BLOCK_ASSESSMENT_MAP: Record<string, BlockAssessmentMeta> =
  Object.fromEntries(BLOCK_ASSESSMENTS.map((item) => [item.blockNum, item])) as Record<string, BlockAssessmentMeta>;
