export type Module14924SpeakerNotes = {
  title: string;
  objectives: string;
  activityIndividual: string;
  activityGroup: string;
  summary: string;
};

export type Module14924PresentationSlide = {
  title: string;
  subtitle: string;
  bullets: string[];
  highlight: string;
  speakerNote: string;
  phaseCards?: string[];
};

export const module14924SpeakerNotes: Module14924SpeakerNotes = {
  title:
    "Welcome to Information Systems Analysis. Today we'll think like analysts before coding like developers.\n\n" +
    "Let's start with a quick hook (3 minutes): I'll ask, 'Think of one system you used this week (registration, banking, WhatsApp, LMS). What happens if it fails?' We'll capture 3 answers under People / Process / Data on the board.\n\n" +
    "Bridge statement: 'Everything we do today prevents expensive failure later. Good analysis saves money, time, and reputation.'",
  objectives:
    "Let's anchor our learning outcomes around four core ideas:\n" +
    "- SDLC: I'll emphasise why analysis and design must happen before coding.\n" +
    "- Analyst role: We'll position the analyst as the translator between business reality and technical implementation.\n" +
    "- Fact-finding: I'll use Who / What / Where / When / How / Why as our questioning spine.\n" +
    "- Techniques: We'll treat DFDs and decision models as communication tools, not just diagrams.\n\n" +
    "As we move through the day, let's keep linking each concept back to the opening hook scenario.",
  activityIndividual:
    "For individual activities, I'll use the E-D-C cycle: Explain briefly -> Demonstrate one example -> Check learner attempt.\n\n" +
    "- Systems vs Requirements Analysis: I'll use 'WHAT first, HOW later' and ask learners to rewrite one vague request into a measurable requirement.\n" +
    "- Feasibility and cost-benefit: We'll classify examples into tangible vs intangible and defend one decision.\n" +
    "- Fact-finding techniques: I'll give one scenario (remote site, sensitive users, many respondents) and we'll decide which method fits best and why.\n" +
    "- DFD practice: I'll live-draw Context Diagram first, then Diagram 0, and we'll enforce naming rules (noun for entity/data store, verb phrase for process).\n" +
    "- Decision tools: We'll compare one decision tree and one decision table for the same rule so everyone sees when each is clearer.\n\n" +
    "When learners are stuck, I'll use probing questions first and avoid giving final answers too early.",
  activityGroup:
    "For the group task (25 minutes), we'll run an integrated challenge: 'Analyse the CET Attendance System redesign.'\n\n" +
    "We'll require these deliverables per group:\n" +
    "1. Problem statement (1 sentence)\n" +
    "2. Stakeholder list (internal + external)\n" +
    "3. Fact-finding plan (at least 3 methods with reasons)\n" +
    "4. Mini Context DFD (entities + main process + flows)\n" +
    "5. One recommendation: structured vs Agile (with justification)\n\n" +
    "I'll assign roles: Facilitator, Scribe, Modeler, Presenter, Timekeeper.\n\n" +
    "During debrief, I'll ask:\n" +
    "- 'Which requirement is most risky if misunderstood?'\n" +
    "- 'What data flow is missing from your model?'\n" +
    "- 'How would your recommendation change if requirements were unstable?'",
  summary:
    "For the close-out (5-7 minutes), I'll say:\n\n" +
    "'Today we moved from intuition to structured analysis. You can now define a system problem, gather facts, model data movement, and justify an approach before coding starts.'\n\n" +
    "Then we'll run a rapid recall with four learners:\n" +
    "1) 'Explain SDLC in one sentence.'\n" +
    "2) 'Give one fact-finding technique and best-use case.'\n" +
    "3) 'What is the difference between context diagram and Diagram 0?'\n" +
    "4) 'When would Agile be better than strict sequential SDLC?'\n\n" +
    "We'll end with visual consolidation: I'll return to the board map (Problem -> Requirements -> Models -> Recommendation) and ask learners to place one concept under each.\n\n" +
    "Before dismissal, let's remember:\n" +
    "- Complete workbook activities and keep DFD practice pages for PoE\n" +
    "- Bring one real workplace system issue for tomorrow's discussion\n" +
    "- Ensure attendance sign-out before leaving.",
};

export const module14924SystemAnalysisSlide: Module14924PresentationSlide = {
  title: "Before SDLC: What Is System Analysis?",
  subtitle: "Foundation first, lifecycle second",
  bullets: [
    "Components: what parts make up the system, and how they connect",
    "Input and Output: what goes in, what comes out, and what must be measured",
    "Processes: the sequence of activities that transform inputs into results",
    "Feedback loops: how outputs influence future inputs and system behavior",
    "Why it matters: better efficiency, lower cost, better quality, stronger problem-solving",
  ],
  highlight:
    "Order matters: understand the system first, then use SDLC and methods to deliver improvements with control.",
  speakerNote:
    "Definition (say this clearly): System Analysis is the structured process of studying a system to understand how it works today, where the problems are, and what must improve before designing or building solutions.\n\n" +
    "Explanation script for each point:\n" +
    "1) Components\n" +
    "- Definition: The building blocks of the system (people, tools, data stores, rules, interfaces).\n" +
    "- Explain: If we do not identify all components and relationships, we miss dependencies and break the system during change.\n\n" +
    "2) Input and Output\n" +
    "- Definition: Inputs are what enters the system; outputs are the results it produces.\n" +
    "- Explain: Analysts must check quality on both sides: bad input creates bad output, even when processing logic is correct.\n\n" +
    "3) Processes\n" +
    "- Definition: The ordered activities that transform input into output.\n" +
    "- Explain: Process mapping exposes delays, rework, bottlenecks, and unnecessary steps that increase cost.\n\n" +
    "4) Feedback loops\n" +
    "- Definition: Information from outputs used to adjust future inputs and process behavior.\n" +
    "- Explain: Without feedback loops, systems repeat mistakes and cannot improve performance over time.\n\n" +
    "5) Why it matters\n" +
    "- Explain: Strong analysis improves efficiency, reduces cost, raises quality, and supports better problem-solving decisions.\n\n" +
    "Facilitator prompt: 'Name one system at your site and identify one component, one input, one process, one output, and one feedback loop.'\n\n" +
    "Transition line: 'Now that we understand system analysis foundations, SDLC gives us the lifecycle to execute these improvements in a controlled way.'",
};

export const module14924AdamStorySlide: Module14924PresentationSlide = {
  title: "Adam's Story: Why We Need an SDLC",
  subtitle: "General path from system idea to stable delivery",
  phaseCards: [
    "Planning",
    "Requirements Analysis",
    "Design",
    "Implementation",
    "Testing",
    "Deployment & Maintenance",
  ],
  bullets: [
    "Any system scenario can be used here: online store, registration, attendance, or payroll",
    "The point is not detail yet: we need a structured path so work is planned and controlled",
    "This gives us a shared language for what comes next in the rest of Session 1",
  ],
  highlight: "No matter the system type, teams still need a lifecycle. SDLC is that lifecycle.",
  speakerNote:
    "Speaker flow (keep this high-level and connected to slide 3):\n\n" +
    "1) Link back to slide 3 question\n" +
    "'On the previous slide we asked you to identify a real system (components, inputs/outputs, processes, feedback). Adam's online store is just one example of that same thinking.'\n\n" +
    "2) Clarify scope\n" +
    "'We can swap Adam's story for any system in your context. The point here is not the business details; the point is the journey from idea to reliable operation.'\n\n" +
    "3) Walk the cards left to right (one line each)\n" +
    "- Planning: agree on purpose and boundaries.\n" +
    "- Requirements Analysis: define what users and stakeholders need.\n" +
    "- Design: decide structure before building.\n" +
    "- Implementation: build according to agreed design.\n" +
    "- Testing: verify behavior before release.\n" +
    "- Deployment & Maintenance: run live, fix, improve continuously.\n\n" +
    "4) Emphasize the takeaway\n" +
    "'For any system, we must sit down, plan, and move in a structured lifecycle. That structure is what SDLC gives us.'\n\n" +
    "5) Say what is next\n" +
    "'Next, in Session 1 we will unpack SDLC in more detail first, then compare methods (Waterfall, Agile, DevOps) to show different ways teams execute the same lifecycle.'",
};

export const module14924SdlcModelsSlide: Module14924PresentationSlide = {
  title: "How Models Execute the Same SDLC",
  subtitle: "After understanding SDLC steps, compare execution styles",
  phaseCards: ["Waterfall", "Agile", "DevOps"],
  bullets: [
    "Waterfall: strong phase gates; best when requirements are stable and compliance is strict",
    "Agile: iterative sprints; best when requirements evolve and feedback must be fast",
    "DevOps: automates build/test/deploy with continuous monitoring and feedback",
    "All three still rely on the same SDLC logic: plan, design, build, test, release, maintain",
  ],
  highlight: "Model choice changes execution rhythm, not the need for SDLC discipline.",
  speakerNote:
    "Placement logic: this slide comes AFTER SDLC detail so learners first understand the lifecycle itself.\n\n" +
    "Talk track:\n" +
    "- We now know WHAT SDLC phases are and why they exist.\n" +
    "- This slide explains HOW teams move through those same phases under different methods.\n" +
    "- Waterfall = sequential gates. Agile = iterative sprint loops. DevOps = continuous delivery and feedback.\n\n" +
    "Key line to say clearly: 'Different methods, same lifecycle backbone.'\n\n" +
    "Next transition: 'With this model context in mind, we continue Session 1 into feasibility and requirements where analysis decisions become concrete.'",
};
