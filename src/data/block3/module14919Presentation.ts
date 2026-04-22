export type Module14919SlideListItem = {
  slideNumber: number;
  id: string;
  title: string;
  type: "title" | "content" | "activity" | "summary";
  content: string;
  notes: string;
  duration: number;
  cards?: string[];
  phaseCards?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

export const module14919SlideList: Module14919SlideListItem[] = [
  {
    slideNumber: 1,
    id: "14919-title",
    title: "Resolve Computer Users' Problems",
    type: "title",
    content:
      "Block 3 dedicated facilitation deck for US 14919.\n" +
      "Focus: structured troubleshooting and user communication.",
    notes:
      "Frame support as a methodical process: ask, isolate, resolve, verify, document.",
    duration: 5,
    phaseCards: ["Ask", "Isolate", "Fix", "Verify", "Document"],
  },
  {
    slideNumber: 2,
    id: "14919-outcomes",
    title: "Session Outcomes",
    type: "content",
    content:
      "By the end of this session, learners can:\n" +
      "• Diagnose common user support issues logically\n" +
      "• Apply top-down and bottom-up troubleshooting\n" +
      "• Communicate fixes in plain language\n" +
      "• Capture resolution notes for workbook evidence",
    notes:
      "Use one real scenario from your lab environment to anchor the outcomes.",
    duration: 6,
    cards: ["Diagnosis", "Method", "Communication", "Evidence"],
  },
  {
    slideNumber: 3,
    id: "14919-workflow",
    title: "Troubleshooting Workflow",
    type: "content",
    content:
      "Recommended workflow:\n" +
      "• Ask clarifying questions\n" +
      "• Reproduce the issue\n" +
      "• Isolate root cause candidates\n" +
      "• Implement and test a fix\n" +
      "• Confirm with the user and document",
    notes:
      "Stress that skipping user verification causes repeat tickets.",
    duration: 7,
    cards: ["Ask", "Reproduce", "Isolate", "Fix", "Confirm"],
  },
  {
    slideNumber: 4,
    id: "14919-methods",
    title: "Top-Down vs Bottom-Up",
    type: "activity",
    content:
      "Compare troubleshooting approaches:\n" +
      "• Top-Down: start at application/user layer\n" +
      "• Bottom-Up: start at hardware/network layer\n" +
      "• Choose based on symptoms and available evidence\n" +
      "• Record why your team chose the method",
    notes:
      "Run a mini exercise: 'Cannot print' and 'Cannot login'. Ask which method is more efficient for each case and why.",
    duration: 8,
    cards: ["Top-Down", "Bottom-Up", "Symptoms", "Evidence"],
  },
  {
    slideNumber: 5,
    id: "14919-resolution-note",
    title: "Resolution Note Template",
    type: "content",
    content:
      "Every resolved issue should include:\n" +
      "• Ticket/problem summary\n" +
      "• Root cause found\n" +
      "• Action taken\n" +
      "• User confirmation status\n" +
      "• Follow-up recommendation",
    notes:
      "Good documentation improves handovers, audits, and learner portfolio quality.",
    duration: 7,
    cards: ["Summary", "Root Cause", "Fix", "Confirmation", "Follow-up"],
  },
  {
    slideNumber: 6,
    id: "14919-summary",
    title: "Wrap-Up And Evidence Checklist",
    type: "summary",
    content:
      "Before closing the session, confirm:\n" +
      "• Workbook troubleshooting tasks are complete\n" +
      "• At least one documented resolution note exists\n" +
      "• Learners can explain their diagnostic steps\n" +
      "• Learners are ready for the Block 3 knowledge quiz",
    notes:
      "Reinforce: clear troubleshooting logic plus clear communication is the main competency target.",
    duration: 5,
  },
];
