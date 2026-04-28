export type Module14921SlideListItem = {
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

export const module14921SlideList: Module14921SlideListItem[] = [
  {
    slideNumber: 1,
    id: "14921-title",
    title: "Types of Computer Systems and Hardware Configurations",
    type: "title",
    content:
      "Block 3 dedicated facilitation deck for US 14921.\n" +
      "Focus: system types, hardware selection, and fit-for-purpose configurations.",
    notes:
      "Open with context: this unit is about making justified configuration decisions, not memorizing parts lists.",
    duration: 5,
    phaseCards: ["Need", "System Type", "Components", "Validation", "Recommendation"],
  },
  {
    slideNumber: 2,
    id: "14921-outcomes",
    title: "Session Outcomes",
    type: "content",
    content:
      "By the end of this session, learners can:\n" +
      "• Differentiate common computer system types by use case\n" +
      "• Explain the role of key hardware components\n" +
      "• Match user requirements to suitable configurations\n" +
      "• Justify hardware choices with compatibility and support in mind",
    notes:
      "Connect these outcomes to the learner guide sections before moving into examples.",
    duration: 6,
    cards: ["System Types", "Core Components", "User Needs", "Justified Selection"],
  },
  {
    slideNumber: 3,
    id: "14921-guide-mapping",
    title: "Learner Guide Focus Areas",
    type: "content",
    content:
      "Use the learner guide to structure concept delivery:\n" +
      "• Desktop, laptop, server, mobile, and embedded contexts\n" +
      "• CPU, RAM, storage, motherboard, PSU, and peripherals\n" +
      "• Fit-for-purpose hardware recommendations\n" +
      "• Upgrade and compatibility considerations",
    notes:
      "As each topic is introduced, ask learners for one real environment where that system type is appropriate.",
    duration: 7,
    cards: ["System Types", "Hardware Roles", "Use Cases", "Compatibility"],
  },
  {
    slideNumber: 4,
    id: "14921-workbook-evidence",
    title: "Workbook Evidence Targets",
    type: "activity",
    content:
      "Workbook outputs should include:\n" +
      "• System-type comparison table for at least three environments\n" +
      "• Component-function mapping activity\n" +
      "• Configuration recommendation with rationale\n" +
      "• Upgrade planning with constraints and trade-offs",
    notes:
      "Tell learners these workbook artefacts form evidence for moderation and summative readiness.",
    duration: 8,
    cards: ["Comparison", "Mapping", "Recommendation", "Upgrade Plan"],
  },
  {
    slideNumber: 5,
    id: "14921-practical-brief",
    title: "Practical Assessment Preparation",
    type: "activity",
    content:
      "Practical assessment pattern:\n" +
      "• Read a scenario (lab, office, or support environment)\n" +
      "• Identify user tasks and performance needs\n" +
      "• Propose a complete hardware configuration\n" +
      "• Defend choices using cost, compatibility, and supportability",
    notes:
      "Coach learners to explain why they chose each major component, not just list specs.",
    duration: 8,
    cards: ["Scenario", "Need Analysis", "Configuration", "Justification"],
  },
  {
    slideNumber: 6,
    id: "14921-summative-readiness",
    title: "Summative Assessment Readiness",
    type: "content",
    content:
      "Summative expectations:\n" +
      "• Identify and describe suitable system types\n" +
      "• Explain hardware roles accurately\n" +
      "• Recommend fit-for-purpose configurations\n" +
      "• Evaluate upgrade options and compatibility risks",
    notes:
      "Use one mini-question from the summative style and let learners answer verbally before closing.",
    duration: 7,
    cards: ["Knowledge", "Application", "Recommendation", "Risk Awareness"],
  },
  {
    slideNumber: 7,
    id: "14921-summary",
    title: "Wrap-Up and Evidence Checklist",
    type: "summary",
    content:
      "Before closing, confirm:\n" +
      "• Learner guide topics were covered with examples\n" +
      "• Workbook activities are completed and signed off\n" +
      "• Practical scenario responses include clear rationale\n" +
      "• Learners are prepared for the Block 3 summative structure",
    notes:
      "Close with a quick recap: user need first, then system type, then component decisions.",
    duration: 5,
  },
];
