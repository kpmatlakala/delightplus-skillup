export type Module120379SlideListItem = {
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

export const module120379SlideList: Module120379SlideListItem[] = [
  {
    slideNumber: 1,
    id: "120379-title",
    title: "Work as a Project Team Member",
    type: "title",
    content:
      "Block 3 dedicated facilitation deck for US 120379.\n" +
      "Focus: teamwork roles, sprint planning, and accountable delivery.",
    notes:
      "Position this as the capstone teamwork unit that integrates the previous modules.",
    duration: 5,
    phaseCards: ["Roles", "Plan", "Execute", "Track", "Review"],
  },
  {
    slideNumber: 2,
    id: "120379-outcomes",
    title: "Session Outcomes",
    type: "content",
    content:
      "By the end of this session, learners can:\n" +
      "• Describe effective project team participation\n" +
      "• Use basic project planning tools\n" +
      "• Allocate tasks by role and capability\n" +
      "• Track progress and report blockers clearly",
    notes:
      "Ask learners to share one example of a team project that failed and why.",
    duration: 6,
    cards: ["Participation", "Planning", "Allocation", "Tracking"],
  },
  {
    slideNumber: 3,
    id: "120379-role-clarity",
    title: "Role Clarity And Accountability",
    type: "content",
    content:
      "Key team role principles:\n" +
      "• Define ownership per task before execution\n" +
      "• Use simple RACI logic for responsibility clarity\n" +
      "• Surface blockers early during check-ins\n" +
      "• Record decisions so everyone works from one truth",
    notes:
      "Without role clarity, teams duplicate work and miss deadlines.",
    duration: 7,
    cards: ["Ownership", "RACI", "Blockers", "Decisions"],
  },
  {
    slideNumber: 4,
    id: "120379-sprint-board",
    title: "Sprint Board Starter",
    type: "activity",
    content:
      "Build a simple sprint board:\n" +
      "• Columns: To Do, In Progress, Done\n" +
      "• Add priority tags to each task\n" +
      "• Assign owner and due date\n" +
      "• Identify one top risk for the sprint",
    notes:
      "Facilitate a live 10-minute board setup using class tasks from current module work.",
    duration: 8,
    cards: ["Board", "Priority", "Owner", "Risk"],
  },
  {
    slideNumber: 5,
    id: "120379-communication",
    title: "Project Communication Basics",
    type: "content",
    content:
      "Minimum communication standards:\n" +
      "• Daily update: what was done, what is next, blockers\n" +
      "• Audience-aware reporting (technical vs non-technical)\n" +
      "• Escalate risks before they become failures\n" +
      "• Keep evidence in workbook/project notes",
    notes:
      "Tie communication quality to project success, not just etiquette.",
    duration: 7,
    cards: ["Daily Update", "Audience", "Escalation", "Evidence"],
  },
  {
    slideNumber: 6,
    id: "120379-summary",
    title: "Wrap-Up And Evidence Checklist",
    type: "summary",
    content:
      "Before closing the session, confirm:\n" +
      "• Workbook teamwork artefacts are complete\n" +
      "• Team roles and sprint plan are documented\n" +
      "• Risks and blockers are captured with owners\n" +
      "• Learners are ready for the Block 3 knowledge quiz",
    notes:
      "Finish by reinforcing that reliable team execution depends on structure, visibility, and accountability.",
    duration: 5,
  },
];
