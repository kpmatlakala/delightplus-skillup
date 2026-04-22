export type Module14908SlideListItem = {
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

export const module14908SlideList: Module14908SlideListItem[] = [
  {
    slideNumber: 1,
    id: "14908-title",
    title: "Testing IT Systems Against Specifications",
    type: "title",
    content:
      "Block 3 dedicated facilitation deck for US 14908.\n" +
      "Focus: test planning, execution, defect logging, and evidence capture.",
    notes:
      "Set the tone: testing is a quality discipline, not just a final checklist. Link this session to learner workbook evidence and quiz preparation.",
    duration: 5,
    phaseCards: ["Plan", "Design", "Execute", "Log", "Report"],
  },
  {
    slideNumber: 2,
    id: "14908-outcomes",
    title: "Session Outcomes",
    type: "content",
    content:
      "By the end of this session, learners can:\n" +
      "• Explain core testing levels and purposes\n" +
      "• Write structured test cases with expected results\n" +
      "• Record defects with clear reproduction steps\n" +
      "• Compile testing evidence for workbook and PoE",
    notes:
      "Ask learners to identify one testing mistake they have seen before, then map it to one of the outcomes.",
    duration: 6,
    cards: ["Levels", "Test Cases", "Defects", "Evidence"],
  },
  {
    slideNumber: 3,
    id: "14908-levels",
    title: "Testing Levels At A Glance",
    type: "content",
    content:
      "Four common testing levels:\n" +
      "• Unit testing: one function/component in isolation\n" +
      "• Integration testing: connected components together\n" +
      "• System testing: full application behavior\n" +
      "• Acceptance testing: user validation against requirements",
    notes:
      "Keep this practical. Use one learner project and explain which bug each level would detect first.",
    duration: 7,
    cards: ["Unit", "Integration", "System", "Acceptance"],
  },
  {
    slideNumber: 4,
    id: "14908-testcase-structure",
    title: "Minimum Test Case Structure",
    type: "activity",
    content:
      "Each test case should include:\n" +
      "• Test case ID\n" +
      "• Input / preconditions\n" +
      "• Expected result\n" +
      "• Actual result\n" +
      "• Pass/Fail status",
    notes:
      "Run a quick class activity: write one test case together for a login form and identify what makes it verifiable.",
    duration: 8,
    cards: ["ID", "Input", "Expected", "Actual", "Result"],
  },
  {
    slideNumber: 5,
    id: "14908-defect-log",
    title: "Defect Log Essentials",
    type: "content",
    content:
      "For each defect, capture:\n" +
      "• Defect ID and severity\n" +
      "• Steps to reproduce\n" +
      "• Expected vs actual behavior\n" +
      "• Module/screen affected\n" +
      "• Retest status after fix",
    notes:
      "Emphasize reproducibility. If another tester cannot reproduce the bug, the report is incomplete.",
    duration: 7,
    cards: ["Severity", "Reproduce", "Expected vs Actual", "Retest"],
  },
  {
    slideNumber: 6,
    id: "14908-summary",
    title: "Wrap-Up And Evidence Checklist",
    type: "summary",
    content:
      "Before closing the session, confirm:\n" +
      "• Workbook testing activities are completed\n" +
      "• At least one full test case set is captured\n" +
      "• Defect log entries are clear and traceable\n" +
      "• Learners are ready for the Block 3 knowledge quiz",
    notes:
      "Close by reminding learners that testing evidence and quiz performance are the two core completion signals for this block flow.",
    duration: 5,
  },
];
