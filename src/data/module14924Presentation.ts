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
  title: "Welcome to Information Systems Analysis. Today we'll think like analysts before coding like developers.",
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

export type Module14924SlideListItem = {
  slideNumber: number;
  title: string;
  learnerView: {
    subtitle?: string;
    badges?: string[];
    onScreenContent?: string[];
    body?: string;
    highlight?: string;
  };
  facilitatorNotes: string;
  source: string;
};

const MODULE_14924_TOTAL_SLIDES = 47;

function formatLearnerViewForNotes(view: Module14924SlideListItem["learnerView"]): string {
  const lines: string[] = [];
  if (view.subtitle) lines.push(`Subtitle: ${view.subtitle}`);
  if (view.badges?.length) lines.push(`Badges: ${view.badges.join(" · ")}`);
  if (view.onScreenContent?.length) {
    lines.push("On-screen content:");
    view.onScreenContent.forEach((item, idx) => lines.push(`${idx + 1}. ${item}`));
  }
  if (view.body) lines.push(view.body);
  if (view.highlight) lines.push(`Highlight: ${view.highlight}`);
  return lines.join("\n");
}

function formatFacilitatorNotesBlock(
  slideNumber: number,
  title: string,
  learnerView: Module14924SlideListItem["learnerView"],
  facilitatorScript: string
): string {
  const learnerViewText = formatLearnerViewForNotes(learnerView);
  return (
    "Facilitator Notes\n" +
    `Slide ${slideNumber} of ${MODULE_14924_TOTAL_SLIDES}\n` +
    `Title: ${title}\n\n` +
    "What learners see:\n" +
    `${learnerViewText}\n\n` +
    "Facilitator notes:\n" +
    facilitatorScript
  );
}

/**
 * Numbered list to personalise the early deck flow quickly.
 *
 * NOTE:
 * - Slides 1-4 are explicit and stable.
 * - From slide 5 onward, slides are generated dynamically from
 *   module14924LessonFlow Session sections (chunked by bullet density).
 */
export const module14924SlideList: Module14924SlideListItem[] = [
  {
    slideNumber: 1,
    title: "Information Systems Analysis",
    learnerView: {
      subtitle: "SAQA 14924  |  Block 1  |  Day 1  |  3 Credits",
      body: "Knowledge",
      badges: [
        "Block 1",
        "Day 1",
        "Knowledge"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 1 of 47\\n" +
    " Title: Information Systems Analysis\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Welcome to Information Systems Analysis. Today we'll think like analysts before coding like developers.\\n" +
    "\\n",
    source: "Auto-generated from buildFlowSlides[0]"
  },
  {
    slideNumber: 2,
    title: "Unit Purpose & Learning Outcomes",
    learnerView: {
      subtitle: "Information Systems Analysis",
      onScreenContent: [
        "Explain the role of information systems analysis within the Software Development Life Cycle.",
        "Describe the key responsibilities of an information systems analyst.",
        "Identify and explain common information-gathering techniques.",
        "Describe industry-standard systems analysis techniques."
      ],
      body: "People credited with this unit standard are able to describe information systems analysis and explain different systems analysis techniques used in the industry."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 2 of 47\\n" +
    "Title: Unit Purpose & Learning Outcomes\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Let's anchor our learning outcomes around four core ideas:\\n" +
    "- SDLC: I'll emphasise why analysis and design must happen before coding.\\n" +
    "- Analyst role: We'll position the analyst as the translator between business reality and technical implementation.\\n" +
    "- Fact-finding: I'll use Who / What / Where / When / How / Why as our questioning spine.\\n" +
    "- Techniques: We'll treat DFDs and decision models as communication tools, not just diagrams.\\n" +
    "\\n" +
    "As we move through the day, let's keep linking each concept back to the opening hook scenario.\\n" +
    "\\n" +
    "Let's start with a quick hook (3 minutes): I'll ask, 'Think of one system you used this week (registration, banking, WhatsApp, LMS). What happens if it fails?' We'll capture 3 answers under People / Process / Data on the board.\\n" +
    "\\n" +
    "Bridge statement: 'Everything we do today prevents expensive failure later. Good analysis saves money, time, and reputation.'",
    source: "Auto-generated from buildFlowSlides[1]"
  },
  {
    slideNumber: 3,
    title: "Before SDLC: What Is System Analysis?",
    learnerView: {
      subtitle: "Foundation first, lifecycle second",
      onScreenContent: [
        "Components: what parts make up the system, and how they connect",
        "Input and Output: what goes in, what comes out, and what must be measured",
        "Processes: the sequence of activities that transform inputs into results",
        "Feedback loops: how outputs influence future inputs and system behavior",
        "Why it matters: better efficiency, lower cost, better quality, stronger problem-solving"
      ],
      highlight: "Order matters: understand the system first, then use SDLC and methods to deliver improvements with control."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 3 of 47\\n" +
    "Title: Before SDLC: What Is System Analysis?\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Definition (say this clearly): System Analysis is the structured process of studying a system to understand how it works today, where the problems are, and what must improve before designing or building solutions.\\n" +
    "\\n" +
    "Explanation script for each point:\\n" +
    "1) Components\\n" +
    "- Definition: The building blocks of the system (people, tools, data stores, rules, interfaces).\\n" +
    "- Explain: If we do not identify all components and relationships, we miss dependencies and break the system during change.\\n" +
    "\\n" +
    "2) Input and Output\\n" +
    "- Definition: Inputs are what enters the system; outputs are the results it produces.\\n" +
    "- Explain: Analysts must check quality on both sides: bad input creates bad output, even when processing logic is correct.\\n" +
    "\\n" +
    "3) Processes\\n" +
    "- Definition: The ordered activities that transform input into output.\\n" +
    "- Explain: Process mapping exposes delays, rework, bottlenecks, and unnecessary steps that increase cost.\\n" +
    "\\n" +
    "4) Feedback loops\\n" +
    "- Definition: Information from outputs used to adjust future inputs and process behavior.\\n" +
    "- Explain: Without feedback loops, systems repeat mistakes and cannot improve performance over time.\\n" +
    "\\n" +
    "5) Why it matters\\n" +
    "- Explain: Strong analysis improves efficiency, reduces cost, raises quality, and supports better problem-solving decisions.\\n" +
    "\\n" +
    "Facilitator prompt: 'Name one system at your site and identify one component, one input, one process, one output, and one feedback loop.'\\n" +
    "\\n" +
    "Transition line: 'Now that we understand system analysis foundations, SDLC gives us the lifecycle to execute these improvements in a controlled way.'",
    source: "Auto-generated from buildFlowSlides[2]"
  },
  {
    slideNumber: 4,
    title: "Adam's Story: Why We Need an SDLC",
    learnerView: {
      subtitle: "General path from system idea to stable delivery",
      onScreenContent: [
        "Any system scenario can be used here: online store, registration, attendance, or payroll",
        "The point is not detail yet: we need a structured path so work is planned and controlled",
        "This gives us a shared language for what comes next in the rest of Session 1"
      ],
      highlight: "No matter the system type, teams still need a lifecycle. SDLC is that lifecycle."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 4 of 47\\n" +
    "Title: Adam's Story: Why We Need an SDLC\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Speaker flow (keep this high-level and connected to slide 3):\\n" +
    "\\n" +
    "1) Link back to slide 3 question\\n" +
    "'On the previous slide we asked you to identify a real system (components, inputs/outputs, processes, feedback). Adam's online store is just one example of that same thinking.'\\n" +
    "\\n" +
    "2) Clarify scope\\n" +
    "'We can swap Adam's story for any system in your context. The point here is not the business details; the point is the journey from idea to reliable operation.'\\n" +
    "\\n" +
    "3) Walk the cards left to right (one line each)\\n" +
    "- Planning: agree on purpose and boundaries.\\n" +
    "- Requirements Analysis: define what users and stakeholders need.\\n" +
    "- Design: decide structure before building.\\n" +
    "- Implementation: build according to agreed design.\\n" +
    "- Testing: verify behavior before release.\\n" +
    "- Deployment & Maintenance: run live, fix, improve continuously.\\n" +
    "\\n" +
    "4) Emphasize the takeaway\\n" +
    "'For any system, we must sit down, plan, and move in a structured lifecycle. That structure is what SDLC gives us.'\\n" +
    "\\n" +
    "5) Say what is next\\n" +
    "'Next, in Session 1 we will unpack SDLC in more detail first, then compare methods (Waterfall, Agile, DevOps) to show different ways teams execute the same lifecycle.'",
    source: "Auto-generated from buildFlowSlides[3]"
  },
  {
    slideNumber: 5,
    title: "Session 1",
    learnerView: {
      subtitle: "Introduction to Information Systems Analysis",
      onScreenContent: [
        "Explain the role of information systems analysis within the Software Development Life Cycle.",
        "Describe the key responsibilities of an information systems analyst.",
        "Identify and explain common information-gathering techniques (interviews, questionnaires, observation, site visits, document review).",
        "Distinguish between Systems Analysis and Requirements Analysis."
      ],
      body: "Explore SDLC phases, the analyst's key responsibilities, information-gathering techniques, and the distinction from requirements analysis."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 5 of 47\\n" +
    "Title: Session 1\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Session 1: Introduction to Information Systems Analysis\\n" +
    "\\n" +
    "Explore SDLC phases, the analyst's key responsibilities, information-gathering techniques, and the distinction from requirements analysis.\\n" +
    "\\n" +
    "Session opening script:\\n" +
    "- Set context: what this session solves in the workplace.\\n" +
    "- Walk through outcomes and define success criteria clearly.\\n" +
    "- Prime participation: ask 2 learners to share prior experience.\\n" +
    "\\n" +
    "Ask: \"What do you already know about Introduction to Information Systems Analysis?\"\\n" +
    "Visual-first strategy:\\n" +
    "- Start with a board map (concept map or process flow) before text-heavy explanation.\\n" +
    "- Keep referring back to the map so visual learners can anchor each new point.",
    source: "Auto-generated from buildFlowSlides[4]"
  },
  {
    slideNumber: 6,
    title: "1.0 Introduction to System Analysis",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Components | The parts that make up a system and their relationships | Online store: catalog, cart, payment gateway, user accounts",
        "Input and Output | What enters the system and what it produces | Input: product search and payment details; Output: order confirmation",
        "Processes | The ordered activities that transform inputs into outputs | Browse -> add to cart -> checkout -> payment -> confirmation",
        "Feedback Loops | Output information used to adjust future behavior | Low stock alerts trigger restocking rules"
      ],
      body: "System analysis is the discipline of understanding how a system works, how its parts interact, and how it can be improved. It applies to software systems, business processes, and real-world service systems.",
      highlight: "Transition to SDLC: once we understand components, inputs/outputs, processes, and feedback, SDLC gives us the disciplined lifecycle to execute analysis, design, build, test, deploy, and maintain effectively."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 6 of 47\\n" +
    "Title: 1.0 Introduction to System Analysis\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Core Concepts Before SDLC | Why System Analysis Matters | System Analysis Process (Before Full SDLC Detail).\\n" +
    "\\n" +
    "TOPIC: 1.0 Introduction to System Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.0 Introduction to System Analysis is clear, let's move into 1.1 The Systems Development Life Cycle (SDLC) so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[5]"
  },
  {
    slideNumber: 7,
    title: "1.0 Introduction to System Analysis (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Improves efficiency by identifying bottlenecks and redundant steps",
        "Reduces cost by improving resource usage and preventing rework",
        "Improves quality and reliability of system outputs",
        "Supports innovation through structured problem-solving"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 7 of 47\\n" +
    "Title: 1.0 Introduction to System Analysis (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Core Concepts Before SDLC | Why System Analysis Matters | System Analysis Process (Before Full SDLC Detail).\\n" +
    "\\n" +
    "TOPIC: 1.0 Introduction to System Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.0 Introduction to System Analysis is clear, let's move into 1.1 The Systems Development Life Cycle (SDLC) so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[6]"
  },
  {
    slideNumber: 8,
    title: "1.0 Introduction to System Analysis (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Strengthens root-cause analysis when failures happen",
        "Identify the system and its boundaries",
        "Gather data (interviews, observation, documents)",
        "Model the system using diagrams/flows"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 8 of 47\\n" +
    "Title: 1.0 Introduction to System Analysis (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Core Concepts Before SDLC | Why System Analysis Matters | System Analysis Process (Before Full SDLC Detail).\\n" +
    "\\n" +
    "TOPIC: 1.0 Introduction to System Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.0 Introduction to System Analysis is clear, let's move into 1.1 The Systems Development Life Cycle (SDLC) so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[7]"
  },
  {
    slideNumber: 9,
    title: "1.0 Introduction to System Analysis (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Analyse issues, risks, and opportunities",
        "Propose and evaluate improvement options",
        "Implement agreed changes",
        "Test and monitor outcomes"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 9 of 47\\n" +
    "Title: 1.0 Introduction to System Analysis (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Core Concepts Before SDLC | Why System Analysis Matters | System Analysis Process (Before Full SDLC Detail).\\n" +
    "\\n" +
    "TOPIC: 1.0 Introduction to System Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.0 Introduction to System Analysis is clear, let's move into 1.1 The Systems Development Life Cycle (SDLC) so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[8]"
  },
  {
    slideNumber: 10,
    title: "1.1 The Systems Development Life Cycle (SDLC)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Every stage defines activities and responsibilities of the development team.",
        "Each stage terminates in a milestone with defined deliverables (e.g., requirements specification).",
        "The effort expended on development is often surpassed by maintenance - which may cost twice as much over time.",
        "Extensive system documentation is necessary during development to support future maintenance."
      ],
      body: "The systems development life cycle (SDLC) gives organisations a means of controlling a large development project by dividing it into manageable stages with well-defined outputs.",
      highlight: "Teaching takeaway: the phase names may vary by model, but the core logic stays the same - plan, define, design, build, validate, release, improve."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 10 of 47\\n" +
    "Title: 1.1 The Systems Development Life Cycle (SDLC)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Key Characteristics of the SDLC | SDLC Stages and Deliverables | Applied SDLC Scenario: Adam's Online Home Decor Store.\\n" +
    "\\n" +
    "TOPIC: 1.1 The Systems Development Life Cycle (SDLC). (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Which SDLC phase do you think is most commonly skipped by developers under pressure?' (Implementation / Testing.) Discuss the consequences.\\n" +
    "- Visual: draw the 6 SDLC phases as a looped timeline and place one real task under each phase.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.1 The Systems Development Life Cycle (SDLC) is clear, let's move into 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[9]"
  },
  {
    slideNumber: 11,
    title: "1.1 The Systems Development Life Cycle (SDLC) (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Feasibility Study: Recommendation to proceed or abandon",
        "Requirements Analysis: Requirements specifications",
        "Logical Design: Conceptual design of programs and databases",
        "Physical Design: Detailed design of modules, databases, hardware and software specs"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 11 of 47\\n" +
    "Title: 1.1 The Systems Development Life Cycle (SDLC) (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Key Characteristics of the SDLC | SDLC Stages and Deliverables | Applied SDLC Scenario: Adam's Online Home Decor Store.\\n" +
    "\\n" +
    "TOPIC: 1.1 The Systems Development Life Cycle (SDLC). (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Which SDLC phase do you think is most commonly skipped by developers under pressure?' (Implementation / Testing.) Discuss the consequences.\\n" +
    "- Visual: draw the 6 SDLC phases as a looped timeline and place one real task under each phase.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.1 The Systems Development Life Cycle (SDLC) is clear, let's move into 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[10]"
  },
  {
    slideNumber: 12,
    title: "1.1 The Systems Development Life Cycle (SDLC) (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Planning | Define business goals, budget, timeline, and success criteria. | Project scope and plan",
        "Requirements Analysis | Capture required features: product catalogue, cart, checkout, account management, admin dashboard, payment integration. | SRS (Software Requirements Specification)",
        "Design | Define architecture, database structure, page flow, security model, and user interface approach. | DDS (Design Document Specification)",
        "Implementation | Develop frontend, backend, APIs, database queries, and integrations according to DDS. | Working software build"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 12 of 47\\n" +
    "Title: 1.1 The Systems Development Life Cycle (SDLC) (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Key Characteristics of the SDLC | SDLC Stages and Deliverables | Applied SDLC Scenario: Adam's Online Home Decor Store.\\n" +
    "\\n" +
    "TOPIC: 1.1 The Systems Development Life Cycle (SDLC). (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Which SDLC phase do you think is most commonly skipped by developers under pressure?' (Implementation / Testing.) Discuss the consequences.\\n" +
    "- Visual: draw the 6 SDLC phases as a looped timeline and place one real task under each phase.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.1 The Systems Development Life Cycle (SDLC) is clear, let's move into 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[11]"
  },
  {
    slideNumber: 13,
    title: "How Models Execute the Same SDLC",
    learnerView: {
      subtitle: "After understanding SDLC steps, compare execution styles",
      onScreenContent: [
        "Waterfall: strong phase gates; best when requirements are stable and compliance is strict",
        "Agile: iterative sprints; best when requirements evolve and feedback must be fast",
        "DevOps: automates build/test/deploy with continuous monitoring and feedback",
        "All three still rely on the same SDLC logic: plan, design, build, test, release, maintain"
      ],
      highlight: "Model choice changes execution rhythm, not the need for SDLC discipline."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 13 of 47\\n" +
    "Title: How Models Execute the Same SDLC\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Placement logic: this slide comes AFTER SDLC detail so learners first understand the lifecycle itself.\\n" +
    "\\n" +
    "Talk track:\\n" +
    "- We now know WHAT SDLC phases are and why they exist.\\n" +
    "- This slide explains HOW teams move through those same phases under different methods.\\n" +
    "- Waterfall = sequential gates. Agile = iterative sprint loops. DevOps = continuous delivery and feedback.\\n" +
    "\\n" +
    "Key line to say clearly: 'Different methods, same lifecycle backbone.'\\n" +
    "\\n" +
    "Next transition: 'With this model context in mind, we continue Session 1 into feasibility and requirements where analysis decisions become concrete.'",
    source: "Auto-generated from buildFlowSlides[12]"
  },
  {
    slideNumber: 14,
    title: "1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Waterfall | Sequential phase-by-phase progression | Stable requirements, regulated projects | Low flexibility when requirements change late",
        "Agile | Iterative sprints with frequent stakeholder feedback | Evolving requirements and fast delivery needs | Requires disciplined backlog and stakeholder participation",
        "DevOps | Continuous integration, testing, deployment, and operations feedback | High-frequency release environments | Requires automation maturity and shared ownership culture",
        "Waterfall works when Adam's requirements are fixed and approved upfront."
      ],
      body: "SDLC is the backbone. Methodologies define HOW teams move through those phases. Different projects need different execution styles.",
      highlight: "CI/CD in DevOps means code can be integrated, tested, and safely released many times per day, reducing deployment risk while improving response speed to user feedback."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 14 of 47\\n" +
    "Title: 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Online Store Lens.\\n" +
    "\\n" +
    "TOPIC: 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Which SDLC phase do you think is most commonly skipped by developers under pressure?' (Implementation / Testing.) Discuss the consequences.\\n" +
    "- Visual: draw the 6 SDLC phases as a looped timeline and place one real task under each phase.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps is clear, let's move into 1.2 Systems Analysis so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[13]"
  },
  {
    slideNumber: 15,
    title: "1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Agile works when product categories, promotions, and user journeys evolve rapidly.",
        "DevOps is valuable after go-live, where frequent updates and quick fixes are expected."
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 15 of 47\\n" +
    "Title: 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Online Store Lens.\\n" +
    "\\n" +
    "TOPIC: 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Which SDLC phase do you think is most commonly skipped by developers under pressure?' (Implementation / Testing.) Discuss the consequences.\\n" +
    "- Visual: draw the 6 SDLC phases as a looped timeline and place one real task under each phase.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps is clear, let's move into 1.2 Systems Analysis so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[14]"
  },
  {
    slideNumber: 16,
    title: "How Models Execute the Same SDLC",
    learnerView: {
      subtitle: "After understanding SDLC steps, compare execution styles",
      onScreenContent: [
        "Waterfall: strong phase gates; best when requirements are stable and compliance is strict",
        "Agile: iterative sprints; best when requirements evolve and feedback must be fast",
        "DevOps: automates build/test/deploy with continuous monitoring and feedback",
        "All three still rely on the same SDLC logic: plan, design, build, test, release, maintain"
      ],
      highlight: "Model choice changes execution rhythm, not the need for SDLC discipline."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 16 of 47\\n" +
    "Title: How Models Execute the Same SDLC\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Placement logic: this slide comes AFTER SDLC detail so learners first understand the lifecycle itself.\\n" +
    "\\n" +
    "Talk track:\\n" +
    "- We now know WHAT SDLC phases are and why they exist.\\n" +
    "- This slide explains HOW teams move through those same phases under different methods.\\n" +
    "- Waterfall = sequential gates. Agile = iterative sprint loops. DevOps = continuous delivery and feedback.\\n" +
    "\\n" +
    "Key line to say clearly: 'Different methods, same lifecycle backbone.'\\n" +
    "\\n" +
    "Next transition: 'With this model context in mind, we continue Session 1 into feasibility and requirements where analysis decisions become concrete.'",
    source: "Auto-generated from buildFlowSlides[15]"
  },
  {
    slideNumber: 17,
    title: "1.2 Systems Analysis",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "The objectives of the new system, including costs and benefits analysis.",
        "Who the system users are, the information they need, its form, and how it is obtained from incoming data."
      ],
      highlight: "The task of systems analysis is to establish in detail WHAT the proposed system will do - as opposed to HOW it will be done technologically."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 17 of 47\\n" +
    "Title: 1.2 Systems Analysis\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: What Systems Analysis Establishes.\\n" +
    "\\n" +
    "TOPIC: 1.2 Systems Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.2 Systems Analysis is clear, let's move into 1.3 Feasibility Study so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[16]"
  },
  {
    slideNumber: 18,
    title: "1.3 Feasibility Study",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Legal feasibility: Will the proposed system conform to laws and regulations?",
        "Ethical feasibility: Will the proposed system conform to ethical norms?",
        "Technological feasibility: Do we have the technology and skills needed?",
        "Economic feasibility: Will the system provide competitive advantage or payoff?"
      ],
      body: "The main objective of the feasibility study is to determine whether the proposed system is desirable before resources are committed to the full-scale project.",
      highlight: "Cost-Benefit Analysis checklist: (1) List each development strategy being considered. (2) Identify all costs and benefits for each alternative, including when costs will be incurred and benefits realised. (3) Consider future growth and scalability. (4) Analyse software licensing options. (5) Study the results and prepare a report for management decision."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 18 of 47\\n" +
    "Title: 1.3 Feasibility Study\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Five Aspects of a Feasibility Study | Identifying Benefits and Costs (Economic Feasibility in Practice).\\n" +
    "\\n" +
    "TOPIC: 1.3 Feasibility Study. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"1.3 Feasibility Study\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.3 Feasibility Study is clear, let's move into 1.4 Requirements Analysis so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[17]"
  },
  {
    slideNumber: 19,
    title: "1.3 Feasibility Study (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Tangible Benefits: Faster processing speed; access to previously unavailable information; reduced employee time on manual tasks; fewer errors in calculations and reporting",
        "Intangible Benefits: Improved decision-making quality; enhanced data accuracy; stronger competitive position in customer service; better company image; increased employee job satisfaction",
        "Tangible Costs: Hardware and infrastructure; software licences; analyst and programmer time (person-days); employee salaries during transition; training costs",
        "Intangible Costs: Loss of competitive edge during transition; reputational risk if the project is delayed or fails; ineffective decision-making while old and new systems co-exist; disruption to working routines"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 19 of 47\\n" +
    "Title: 1.3 Feasibility Study (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Five Aspects of a Feasibility Study | Identifying Benefits and Costs (Economic Feasibility in Practice).\\n" +
    "\\n" +
    "TOPIC: 1.3 Feasibility Study. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"1.3 Feasibility Study\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.3 Feasibility Study is clear, let's move into 1.4 Requirements Analysis so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[18]"
  },
  {
    slideNumber: 20,
    title: "1.4 Requirements Analysis",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Asking the users (interviews and questionnaires)",
        "Deriving from an existing system (data analysis, document analysis, observing work)",
        "Deriving from analysis of the business area (Business Systems Planning, critical success factors)",
        "Experimenting with the system under development (prototyping)"
      ],
      body: "The principal objective of requirements analysis is to produce requirements specifications - a detailed description of WHAT the system will do, agreed upon by developers, users, management and other stakeholders.",
      highlight: "Critical distinction: always ask what IS being done AND what SHOULD or COULD be done. Users often describe workarounds and manual fixes built around a broken system. Requirements analysis must surface both the current reality and the desired future state - they are rarely the same thing."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 20 of 47\\n" +
    "Title: 1.4 Requirements Analysis\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Information Gathering Techniques | Structured Fact-Finding | Five Fact-Finding Methods.\\n" +
    "\\n" +
    "TOPIC: 1.4 Requirements Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.4 Requirements Analysis is clear, let's move into 1.5 Role of the Systems Analyst so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[19]"
  },
  {
    slideNumber: 21,
    title: "1.4 Requirements Analysis (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Who?: Who are the users, decision-makers, and stakeholders? Who provides data? Who receives it? Who is affected when the system fails?",
        "What?: What data is captured, processed, stored, and reported? What decisions depend on this information? What are the business rules?",
        "Where?: Where does data originate? Where is it processed? Where are outputs delivered? Are there remote sites or distributed processes?",
        "When?: When do transactions occur? When must reports be available? When do peaks in volume occur? What are the timing constraints?"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 21 of 47\\n" +
    "Title: 1.4 Requirements Analysis (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Information Gathering Techniques | Structured Fact-Finding | Five Fact-Finding Methods.\\n" +
    "\\n" +
    "TOPIC: 1.4 Requirements Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.4 Requirements Analysis is clear, let's move into 1.5 Role of the Systems Analyst so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[20]"
  },
  {
    slideNumber: 22,
    title: "1.4 Requirements Analysis (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Interviews | Deep understanding of individual roles, complex processes, or sensitive issues is needed | Allows follow-up questions; uncovers context and opinion that surveys miss",
        "Document Review | Existing forms, reports, policy documents, and data definitions exist | Reveals what the system actually does vs what people think it does",
        "Observation | Users may not accurately describe their own work, or informal workarounds are suspected | Shows the real process - including undocumented steps and inefficiencies",
        "Questionnaires & Surveys | Many respondents must be reached, or anonymity encourages honest answers | Cost-effective at scale; statistical analysis of responses is possible"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 22 of 47\\n" +
    "Title: 1.4 Requirements Analysis (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Information Gathering Techniques | Structured Fact-Finding | Five Fact-Finding Methods.\\n" +
    "\\n" +
    "TOPIC: 1.4 Requirements Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.4 Requirements Analysis is clear, let's move into 1.5 Role of the Systems Analyst so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[21]"
  },
  {
    slideNumber: 23,
    title: "1.5 Role of the Systems Analyst",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Consultant: Works as an outside expert hired to address a specific business problem or need. Brings an independent perspective and specialist knowledge the organisation may not have internally.",
        "Supporting Expert: Provides internal specialist assistance to a department or project team. Advises on IT capabilities, helps design solutions, and guides technical decisions without taking ownership of the project.",
        "Agent of Change: Facilitates and drives organisational transformation. Analyses how work is currently done, proposes improvements, and helps the organisation adapt its people, processes and systems to the new solution.",
        "Problem solver - breaks complex business problems into manageable parts, identifies root causes, and develops practical, systematic solutions"
      ],
      body: "A systems analyst researches problems, plans solutions, recommends software and systems, and coordinates development to meet business requirements. They must be good communicators with strong analytical and critical thinking skills, and able to work with people of all descriptions."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 23 of 47\\n" +
    "Title: 1.5 Role of the Systems Analyst\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Three Primary Roles of the Systems Analyst | Four Qualities of an Effective Systems Analyst | Key Responsibilities.\\n" +
    "\\n" +
    "TOPIC: 1.5 Role of the Systems Analyst. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"1.5 Role of the Systems Analyst\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.5 Role of the Systems Analyst is clear, let's move into 1.6 Information System Components so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[22]"
  },
  {
    slideNumber: 24,
    title: "1.5 Role of the Systems Analyst (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Communicator - translates technical concepts for non-technical users and business requirements for developers; writes clearly and listens actively",
        "Strong personal and professional ethics - handles sensitive data and organisational information with integrity and confidentiality",
        "Self-disciplined and self-motivated - manages time effectively, meets deadlines under pressure, and drives tasks to completion with minimal supervision",
        "Identify and plan for organisational and human impacts of planned systems."
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 24 of 47\\n" +
    "Title: 1.5 Role of the Systems Analyst (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Three Primary Roles of the Systems Analyst | Four Qualities of an Effective Systems Analyst | Key Responsibilities.\\n" +
    "\\n" +
    "TOPIC: 1.5 Role of the Systems Analyst. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"1.5 Role of the Systems Analyst\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.5 Role of the Systems Analyst is clear, let's move into 1.6 Information System Components so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[23]"
  },
  {
    slideNumber: 25,
    title: "1.5 Role of the Systems Analyst (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Plan a system flow from the ground up.",
        "Interact with users to document requirements for business requirements documents.",
        "Write technical requirements from a critical phase.",
        "Help programmers during development (use cases, flowcharts, database design)."
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 25 of 47\\n" +
    "Title: 1.5 Role of the Systems Analyst (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Three Primary Roles of the Systems Analyst | Four Qualities of an Effective Systems Analyst | Key Responsibilities.\\n" +
    "\\n" +
    "TOPIC: 1.5 Role of the Systems Analyst. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"1.5 Role of the Systems Analyst\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.5 Role of the Systems Analyst is clear, let's move into 1.6 Information System Components so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[24]"
  },
  {
    slideNumber: 26,
    title: "1.5 Role of the Systems Analyst (cont.)",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Perform system testing and deploy the completed system.",
        "Document requirements and contribute to user manuals."
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 26 of 47\\n" +
    "Title: 1.5 Role of the Systems Analyst (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Three Primary Roles of the Systems Analyst | Four Qualities of an Effective Systems Analyst | Key Responsibilities.\\n" +
    "\\n" +
    "TOPIC: 1.5 Role of the Systems Analyst. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"1.5 Role of the Systems Analyst\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 1.5 Role of the Systems Analyst is clear, let's move into 1.6 Information System Components so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[25]"
  },
  {
    slideNumber: 27,
    title: "1.6 Information System Components",
    learnerView: {
      subtitle: "Session 1 | Introduction to Information Systems Analysis",
      onScreenContent: [
        "Hardware: The physical layer of the information system - servers, workstations, network equipment, input/output devices. Hardware capacity follows Moore's Law: processing power roughly doubles every two years while cost falls, enabling ever-more powerful systems.",
        "Software: System software (operating systems, utilities) manages hardware resources. Application software performs specific business tasks. Enterprise applications (ERP, CRM) span the whole organisation. Systems may be horizontal (generic, used across industries), vertical (industry-specific), or legacy (older systems still in production use).",
        "Data: The raw material of the system. Data is stored in tables; related tables are linked to supply information to processes and users. Data consists of basic facts; information is data that has been transformed into output that is valuable to users.",
        "Processes: The tasks and business functions that users, managers, and IT staff perform to achieve specific results using the system. Processes define the rules for how data is captured, validated, transformed and reported."
      ],
      body: "Every information system is made up of five interdependent components that must work together to produce useful results. Understanding these components helps analysts identify where problems occur and what must change when a system is redesigned.",
      highlight: "A mission-critical system is one that is vital to an organisation's operations - if it fails, the organisation cannot function. Examples: a hospital's patient records system, a bank's transaction processing system, a college's student registration portal."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 27 of 47\\n" +
    "Title: 1.6 Information System Components\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "TOPIC: 1.6 Information System Components. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"1.6 Information System Components\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"We have completed the section flow. Next, we consolidate through recap and quiz checks.\"",
    source: "Auto-generated from buildFlowSlides[26]"
  },
  {
    slideNumber: 28,
    title: "Session 2",
    learnerView: {
      subtitle: "Systems Analysis Techniques",
      onScreenContent: [
        "Describe industry-standard systems analysis techniques.",
        "Apply Data Flow Diagrams (DFDs) to document system processes and data flows.",
        "Use decision trees and decision tables to model business logic.",
        "Identify Computer-Aided Software Engineering (CASE) tools and data structure modelling techniques."
      ],
      body: "Apply DFDs, decision trees, decision tables, and CASE tools to model and document business systems."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 28 of 47\\n" +
    "Title: Session 2\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Session 2: Systems Analysis Techniques\\n" +
    "\\n" +
    "Apply DFDs, decision trees, decision tables, and CASE tools to model and document business systems.\\n" +
    "\\n" +
    "Session opening script:\\n" +
    "- Set context: what this session solves in the workplace.\\n" +
    "- Walk through outcomes and define success criteria clearly.\\n" +
    "- Prime participation: ask 2 learners to share prior experience.\\n" +
    "\\n" +
    "Ask: \"What do you already know about Systems Analysis Techniques?\"\\n" +
    "Visual-first strategy:\\n" +
    "- Start with a board map (concept map or process flow) before text-heavy explanation.\\n" +
    "- Keep referring back to the map so visual learners can anchor each new point.",
    source: "Auto-generated from buildFlowSlides[27]"
  },
  {
    slideNumber: 29,
    title: "2.1 Interviews vs Questionnaires",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Cost | Economical | Less economical",
        "Participants | Many people simultaneously | One person at a time",
        "Error risk | Fewer errors | Depends on interviewer skill",
        "Anonymity | Maintained - honest opinions | Not maintained"
      ],
      body: "Two primary information-gathering methods are interviews (face-to-face meetings) and questionnaires (self-administered tools). Each has advantages and limitations."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 29 of 47\\n" +
    "Title: 2.1 Interviews vs Questionnaires\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Types of Interviews.\\n" +
    "\\n" +
    "TOPIC: 2.1 Interviews vs Questionnaires. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.1 Interviews vs Questionnaires\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.1 Interviews vs Questionnaires is clear, let's move into 2.2 Data Flow Diagrams (DFDs) so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[28]"
  },
  {
    slideNumber: 30,
    title: "2.1 Interviews vs Questionnaires (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Structured Interview - same wording and order for all interviewees.",
        "Unstructured Interview - respondents answer freely; allows deeper exploration of complex topics."
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 30 of 47\\n" +
    "Title: 2.1 Interviews vs Questionnaires (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Types of Interviews.\\n" +
    "\\n" +
    "TOPIC: 2.1 Interviews vs Questionnaires. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.1 Interviews vs Questionnaires\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.1 Interviews vs Questionnaires is clear, let's move into 2.2 Data Flow Diagrams (DFDs) so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[29]"
  },
  {
    slideNumber: 31,
    title: "2.2 Data Flow Diagrams (DFDs)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "External Entity | Double square (rectangle with a shadow) | Named with a noun (e.g. Student, Department, Bank) | A person, department, organisation, or system outside the system boundary. Acts as a source (data enters the system) or a sink (data leaves the system). External entities are not controlled by the system being analysed.",
        "Data Flow | Arrow (single or double arrowhead) | Named with a noun describing the data (e.g. Enrolment Form, Payment Confirmation) | The movement of data from one component to another. The arrowhead shows direction of flow. Represents data about a person, place, or thing.",
        "Process | Rectangle with rounded corners (or circle) | Named using verb-adjective-noun form (e.g. Validate Student Record, Calculate Final Mark) | Work being performed - a transformation of input data into output data. Processes contain the business logic (business rules) of the system. They are described as a 'black box': what goes in and out is shown, but internal logic is hidden at this level.",
        "Data Store | Open-ended rectangle (parallel lines) | Named with a noun; given a unique reference number D1, D2, D3- | A repository where data is held for later use. Represents a database, computerised file, or physical filing cabinet. At DFD level you are concerned only with the logical store - not its physical format."
      ],
      body: "A Data Flow Diagram (DFD) shows how data moves through an information system. It graphically characterises data processes and flows in a business system - depicting system inputs, processes, and outputs - but does not show program logic or step-by-step processing detail. A set of DFDs provides a logical model that shows what the system does, not how it does it technically.",
      highlight: "Context diagram rules: (1) Must have exactly one process. (2) No freestanding objects. (3) External entities may not connect directly to one another. (4) Every data flow must connect to or from the single process."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 31 of 47\\n" +
    "Title: 2.2 Data Flow Diagrams (DFDs)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: The Four DFD Symbols | Context Diagram (Level 0) | Diagram 0 | Levelling and Balancing | Logical vs Physical DFDs.\\n" +
    "\\n" +
    "TOPIC: 2.2 Data Flow Diagrams (DFDs). (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Draw the DFD notation key on the whiteboard before explaining. Learners often confuse the symbols. Reference: circle=process, arrow=data flow, parallel lines=data store, rectangle=external entity.\\n" +
    "- Visual: draw a mini DFD live (external entity - process - data store - output).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.2 Data Flow Diagrams (DFDs) is clear, let's move into 2.3 Structured Analysis Techniques so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[30]"
  },
  {
    slideNumber: 32,
    title: "2.2 Data Flow Diagrams (DFDs) (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Logical DFD | What the business does - the business events that take place and the data required and produced by each event | Describes current or required business operations independently of any technology. Used during analysis to agree what the system must do.",
        "Physical DFD | How the system will be implemented - names of programs, files, hardware, and people who perform each process | Shows the specific technology solution. Used during design to specify how the logical model will be built."
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 32 of 47\\n" +
    "Title: 2.2 Data Flow Diagrams (DFDs) (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: The Four DFD Symbols | Context Diagram (Level 0) | Diagram 0 | Levelling and Balancing | Logical vs Physical DFDs.\\n" +
    "\\n" +
    "TOPIC: 2.2 Data Flow Diagrams (DFDs). (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Draw the DFD notation key on the whiteboard before explaining. Learners often confuse the symbols. Reference: circle=process, arrow=data flow, parallel lines=data store, rectangle=external entity.\\n" +
    "- Visual: draw a mini DFD live (external entity - process - data store - output).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.2 Data Flow Diagrams (DFDs) is clear, let's move into 2.3 Structured Analysis Techniques so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[31]"
  },
  {
    slideNumber: 33,
    title: "2.3 Structured Analysis Techniques",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "An initial system version embodying some requirements is built.",
        "Users define requirements by comparing against the prototype ('as compared to something' approach).",
        "The prototype may be discarded after use, or evolve into the delivered system."
      ],
      body: "Structured systems analysis uses graphical tools to describe a system as interacting processes that transform input data into output data. These processes may later become code modules during programming."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 33 of 47\\n" +
    "Title: 2.3 Structured Analysis Techniques\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Prototyping Approach.\\n" +
    "\\n" +
    "TOPIC: 2.3 Structured Analysis Techniques. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.3 Structured Analysis Techniques is clear, let's move into 2.4 Object-Oriented Analysis so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[32]"
  },
  {
    slideNumber: 34,
    title: "2.4 Object-Oriented Analysis",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Object: A person, place, or thing that is relevant to the system being analysed (e.g. Student, Course, Payment). An object belongs to a class and has specific attribute values and can perform methods.",
        "Class: Defines the set of shared attributes and behaviours found in every object of that type. When an object is created from a class, it is said to be instantiated. A class has subclasses (more specific types) and a superclass (a more general parent type).",
        "Attribute: A property or characteristic shared by all objects in a class. If objects are nouns, attributes are the adjectives that describe them (e.g. Student has attributes: studentNumber, fullName, dateOfBirth).",
        "Method: An action that any object of the class can perform. Methods are the verbs - they describe what an object does (e.g. Student.calculateGPA(), Student.generateTranscript()). A method defines the specific task the object carries out."
      ],
      body: "Object-oriented (OO) analysis is a widely-used approach that sees a system from the viewpoint of the objects themselves as they function and interact - rather than viewing the system as sequential processes transforming data. It works well where systems undergo continuous maintenance, adaptation, and redesign, because objects and classes are reusable across projects.",
      highlight: "Key OO advantage - Encapsulation: each object is a 'black box'. Other parts of the system interact with it only through its defined methods. This means changing one object's internal logic has minimal impact on other objects, making systems far easier to maintain and extend over time."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 34 of 47\\n" +
    "Title: 2.4 Object-Oriented Analysis\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Core OO Concepts | The Unified Modeling Language (UML).\\n" +
    "\\n" +
    "TOPIC: 2.4 Object-Oriented Analysis. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.4 Object-Oriented Analysis is clear, let's move into 2.5 Systems Development Approaches so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[33]"
  },
  {
    slideNumber: 35,
    title: "2.5 Systems Development Approaches",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Traditional SDLC (Structured) | Sequential phases - each phase must be completed and signed off before the next begins. Heavy documentation emphasis. | Large, well-defined projects with stable requirements where changes are costly (e.g. government systems, accounting systems).",
        "CASE-Supported Development | Uses Computer-Aided Software Engineering tools to automate analyst tasks, generate code, maintain documentation and enforce consistency across the life cycle. | Projects where productivity, consistency and integration of life cycle activities are priorities.",
        "Object-Oriented (OO) | Analyses and designs in small iterative cycles, each covering analysis ? design ? implementation of a specific part. The system is viewed as a collection of interacting objects. | Systems with rapidly changing requirements; modern application development; reuse-critical environments.",
        "Agile Methods | Incremental, iterative development with continuous user feedback. Emphasises working software over documentation, collaboration over contracts, and responding to change over following a fixed plan. | Smaller teams, projects with evolving requirements, and situations where early, frequent deliverables add value."
      ],
      body: "Systems analysts must understand several approaches to developing information systems. Each approach has strengths suited to different project types - project size, rate of change in requirements, available skills, and organisational context all influence which approach is most appropriate.",
      highlight: "Scrum (an Agile framework): begin with a high-level plan that can be changed as the project proceeds. Work is done in fixed-length sprints (time boxes). The team's collective success is more important than individual contribution. Extreme Programming (XP) is another Agile method emphasising pair programming, test-driven development, and continuous integration."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 35 of 47\\n" +
    "Title: 2.5 Systems Development Approaches\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Sub-topics covered: Comparison of Development Approaches | Joint Application Development (JAD) | Rapid Application Development (RAD) | Agile Methods - 12 Core Principles | DevOps and Continuous Delivery | Other Development Methods.\\n" +
    "\\n" +
    "TOPIC: 2.5 Systems Development Approaches. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.5 Systems Development Approaches\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.5 Systems Development Approaches is clear, let's move into 2.6 What Your Analysis Enables so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[34]"
  },
  {
    slideNumber: 36,
    title: "2.5 Systems Development Approaches (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "A team-based strategy that brings key business users and IT staff together in structured workshops to define system requirements jointly",
        "Advantage: key users participate directly - resulting in more accurate requirements, better understanding of shared goals, and stronger commitment to the new system's success",
        "Advantage: reduces the back-and-forth between analysts and users that plagues traditional interview-based requirements gathering",
        "Disadvantage: more expensive and time-intensive than individual interviews"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 36 of 47\\n" +
    "Title: 2.5 Systems Development Approaches (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Comparison of Development Approaches | Joint Application Development (JAD) | Rapid Application Development (RAD) | Agile Methods - 12 Core Principles | DevOps and Continuous Delivery | Other Development Methods.\\n" +
    "\\n" +
    "TOPIC: 2.5 Systems Development Approaches. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.5 Systems Development Approaches\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.5 Systems Development Approaches is clear, let's move into 2.6 What Your Analysis Enables so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[35]"
  },
  {
    slideNumber: 37,
    title: "2.5 Systems Development Approaches (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Disadvantage: can be cumbersome if the group is too large relative to the scale of the project",
        "A team-based technique that speeds up information systems development and produces a functioning system faster than traditional methods",
        "Relies heavily on prototyping and active user involvement throughout every phase of development",
        "Objective: cut development time and expense by involving users in every phase - not just at requirements stage"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 37 of 47\\n" +
    "Title: 2.5 Systems Development Approaches (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Comparison of Development Approaches | Joint Application Development (JAD) | Rapid Application Development (RAD) | Agile Methods - 12 Core Principles | DevOps and Continuous Delivery | Other Development Methods.\\n" +
    "\\n" +
    "TOPIC: 2.5 Systems Development Approaches. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.5 Systems Development Approaches\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.5 Systems Development Approaches is clear, let's move into 2.6 What Your Analysis Enables so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[36]"
  },
  {
    slideNumber: 38,
    title: "2.5 Systems Development Approaches (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "The interactive prototyping cycle continues until users are satisfied and the system is complete",
        "Advantage: systems developed more quickly with significant cost savings; user interface-heavy systems benefit greatly",
        "Disadvantage: may allow less time to develop quality, consistency, and design standards - emphasis is on the mechanics of the system, not strategic business alignment",
        "Satisfy the customer through early and continuous delivery of working software"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 38 of 47\\n" +
    "Title: 2.5 Systems Development Approaches (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Comparison of Development Approaches | Joint Application Development (JAD) | Rapid Application Development (RAD) | Agile Methods - 12 Core Principles | DevOps and Continuous Delivery | Other Development Methods.\\n" +
    "\\n" +
    "TOPIC: 2.5 Systems Development Approaches. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.5 Systems Development Approaches\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.5 Systems Development Approaches is clear, let's move into 2.6 What Your Analysis Enables so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[37]"
  },
  {
    slideNumber: 39,
    title: "2.5 Systems Development Approaches (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Embrace changing requirements - even when introduced late in development",
        "Deliver functioning software incrementally and frequently (weeks, not months)",
        "Ensure customers and analysts work together daily throughout the project",
        "Build projects around motivated individuals; trust them to get the job done"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 39 of 47\\n" +
    "Title: 2.5 Systems Development Approaches (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Comparison of Development Approaches | Joint Application Development (JAD) | Rapid Application Development (RAD) | Agile Methods - 12 Core Principles | DevOps and Continuous Delivery | Other Development Methods.\\n" +
    "\\n" +
    "TOPIC: 2.5 Systems Development Approaches. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.5 Systems Development Approaches\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.5 Systems Development Approaches is clear, let's move into 2.6 What Your Analysis Enables so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[38]"
  },
  {
    slideNumber: 40,
    title: "2.5 Systems Development Approaches (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Promote face-to-face conversation as the most efficient form of communication",
        "Working software is the primary measure of progress",
        "Encourage continuous, regular, sustainable development - the team maintains a constant pace indefinitely",
        "Maintain continuous attention to technical excellence and good design"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 40 of 47\\n" +
    "Title: 2.5 Systems Development Approaches (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Comparison of Development Approaches | Joint Application Development (JAD) | Rapid Application Development (RAD) | Agile Methods - 12 Core Principles | DevOps and Continuous Delivery | Other Development Methods.\\n" +
    "\\n" +
    "TOPIC: 2.5 Systems Development Approaches. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.5 Systems Development Approaches\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.5 Systems Development Approaches is clear, let's move into 2.6 What Your Analysis Enables so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[39]"
  },
  {
    slideNumber: 41,
    title: "2.5 Systems Development Approaches (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Support self-organising teams - the best architectures and designs emerge from empowered teams",
        "Provide rapid feedback and continuously encourage quality",
        "At regular intervals, the team reflects on how to become more effective and adjusts accordingly",
        "Continuous Integration (CI) | Merge code frequently and run automated checks early | Every change to checkout logic triggers automated tests"
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 41 of 47\\n" +
    "Title: 2.5 Systems Development Approaches (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Comparison of Development Approaches | Joint Application Development (JAD) | Rapid Application Development (RAD) | Agile Methods - 12 Core Principles | DevOps and Continuous Delivery | Other Development Methods.\\n" +
    "\\n" +
    "TOPIC: 2.5 Systems Development Approaches. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.5 Systems Development Approaches\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.5 Systems Development Approaches is clear, let's move into 2.6 What Your Analysis Enables so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[40]"
  },
  {
    slideNumber: 42,
    title: "2.5 Systems Development Approaches (cont.)",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Continuous Delivery/Deployment (CD) | Keep software releasable (or auto-release) at all times | Release catalog updates and bug fixes safely without long delays",
        "Monitoring & Feedback | Observe real usage and system health to drive improvement | Track payment failures and improve checkout reliability",
        "Rational Unified Process (RUP): An iterative software development framework developed by IBM Rational. Organises the development life cycle into four phases (Inception, Elaboration, Construction, Transition) with defined workflows. Suited to large, complex enterprise projects.",
        "Microsoft Solutions Framework (MSF): A flexible, scalable framework developed by Microsoft. Emphasises team model, process model, and risk management. Used in Microsoft technology environments and large IT service organisations."
      ]
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 42 of 47\\n" +
    "Title: 2.5 Systems Development Approaches (cont.)\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Continued. Sub-topics covered: Comparison of Development Approaches | Joint Application Development (JAD) | Rapid Application Development (RAD) | Agile Methods - 12 Core Principles | DevOps and Continuous Delivery | Other Development Methods.\\n" +
    "\\n" +
    "TOPIC: 2.5 Systems Development Approaches. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'Can someone give a real-world example of \"2.5 Systems Development Approaches\" from their own workplace or study?'\\n" +
    "- Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow).\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"Now that 2.5 Systems Development Approaches is clear, let's move into 2.6 What Your Analysis Enables so we can apply this practically.\"",
    source: "Auto-generated from buildFlowSlides[41]"
  },
  {
    slideNumber: 43,
    title: "2.6 What Your Analysis Enables",
    learnerView: {
      subtitle: "Session 2 | Systems Analysis Techniques",
      onScreenContent: [
        "Requirements specification (what the system must do) | Project plan, WBS, and effort estimates. You cannot schedule what you have not defined. | L2 - Project Management",
        "Stakeholder list and information needs | JAD workshops and RAD prototype planning. You know who to include and what to validate with them. | L3 - Requirements Modelling",
        "Logical DFDs and process descriptions | Physical DFD design and detailed process specifications. The logical model becomes the technical blueprint. | L4 - Data and Process Modelling",
        "Object identification and class relationships | UML class diagrams, use case models, and sequence diagrams for the full system design. | L5 & L6 - Object Modelling"
      ],
      body: "The analysis work completed today - requirements, process models, data flows, stakeholder identification - is not an end in itself. It is the input that makes every downstream phase possible. Here is what each analysis output directly enables:",
      highlight: "The most common reason IT projects fail is not technical - it is analytical. Vague requirements, missed stakeholders, and undocumented processes at this stage cause rework, budget overruns, and sometimes total failure at implementation. The quality of your analysis today determines the quality of everything that follows."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 43 of 47\\n" +
    "Title: 2.6 What Your Analysis Enables\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "TOPIC: 2.6 What Your Analysis Enables. (Module 14924) \\n" +
    "\\n" +
    "Outcome focus: Describe industry-standard systems analysis techniques.\\n" +
    "\\n" +
    "Facilitation flow:\\n" +
    "1) Explain the concept in plain language (no jargon first).\\n" +
    "2) Demonstrate one concrete example step-by-step.\\n" +
    "3) Check understanding with one short learner response.\\n" +
    "\\n" +
    "Teaching pointers:\\n" +
    "- Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.\\n" +
    "- Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.\\n" +
    "- Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\\n" +
    "- End by restating the practical workplace implication of this concept.\\n" +
    "\\n" +
    "Transition line: \"We have completed the section flow. Next, we consolidate through recap and quiz checks.\"",
    source: "Auto-generated from buildFlowSlides[42]"
  },
  {
    slideNumber: 44,
    title: "Knowledge Check 1 of 3",
    learnerView: {
      subtitle: "Session Quiz | Information Systems Analysis"
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 44 of 47\\n" +
    "Title: Knowledge Check 1 of 3\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Pause for the knowledge check. Do not read out the correct answer - wait for learners to respond. After the reveal, ask: \"Can someone explain WHY the other options are incorrect?\" This deepens understanding beyond rote recall.",
    source: "Auto-generated from buildFlowSlides[43]"
  },
  {
    slideNumber: 45,
    title: "Knowledge Check 2 of 3",
    learnerView: {
      subtitle: "Session Quiz | Information Systems Analysis"
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 45 of 47\\n" +
    "Title: Knowledge Check 2 of 3\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Pause for the knowledge check. Do not read out the correct answer - wait for learners to respond. After the reveal, ask: \"Can someone explain WHY the other options are incorrect?\" This deepens understanding beyond rote recall.",
    source: "Auto-generated from buildFlowSlides[44]"
  },
  {
    slideNumber: 46,
    title: "Knowledge Check 3 of 3",
    learnerView: {
      subtitle: "Session Quiz | Information Systems Analysis"
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 46 of 47\\n" +
    "Title: Knowledge Check 3 of 3\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "Pause for the knowledge check. Do not read out the correct answer - wait for learners to respond. After the reveal, ask: \"Can someone explain WHY the other options are incorrect?\" This deepens understanding beyond rote recall.",
    source: "Auto-generated from buildFlowSlides[45]"
  },
  {
    slideNumber: 47,
    title: "Session Wrap-Up",
    learnerView: {
      subtitle: "Key takeaways from today",
      onScreenContent: [
        "-  Explain the role of information systems analysis within the Software Development Life Cycle.",
        "-  Describe the key responsibilities of an information systems analyst.",
        "-  Identify and explain common information-gathering techniques (interviews, questionnaires, observation, site visits, document review).",
        "-  Distinguish between Systems Analysis and Requirements Analysis.",
        "-  Describe industry-standard systems analysis techniques.",
        "-  Apply Data Flow Diagrams (DFDs) to document system processes and data flows."
      ],
      highlight: "Before leaving: make sure you can address each outcome above. Flag anything unclear with the facilitator."
    },
    facilitatorNotes:
    "Facilitator Notes\\n" +
    "Slide 47 of 47\\n" +
    "Title: Session Wrap-Up\\n" +
    "\\n" +
    "Facilitator notes:\\n" +
    "For the close-out (5-7 minutes), I'll say:\\n" +
    "\\n" +
    "'Today we moved from intuition to structured analysis. You can now define a system problem, gather facts, model data movement, and justify an approach before coding starts.'\\n" +
    "\\n" +
    "Then we'll run a rapid recall with four learners:\\n" +
    "1) 'Explain SDLC in one sentence.'\\n" +
    "2) 'Give one fact-finding technique and best-use case.'\\n" +
    "3) 'What is the difference between context diagram and Diagram 0?'\\n" +
    "4) 'When would Agile be better than strict sequential SDLC?'\\n" +
    "\\n" +
    "We'll end with visual consolidation: I'll return to the board map (Problem -> Requirements -> Models -> Recommendation) and ask learners to place one concept under each.\\n" +
    "\\n" +
    "Before dismissal, let's remember:\\n" +
    "- Complete workbook activities and keep DFD practice pages for PoE\\n" +
    "- Bring one real workplace system issue for tomorrow's discussion\\n" +
    "- Ensure attendance sign-out before leaving.",
    source: "Auto-generated from buildFlowSlides[46]"
  }
];

export type Module14924PresentationFlow = {
  preSessionSlides: Module14924PresentationSlide[];
  session1Insertions: {
    afterSdlc: Module14924PresentationSlide;
  };
};

const MODULE_14924_PHASE_CARDS_BY_TITLE: Record<string, string[]> = {
  "Adam's Story: Why We Need an SDLC": [
    "Planning",
    "Requirements Analysis",
    "Design",
    "Implementation",
    "Testing",
    "Deployment & Maintenance",
  ],
  "How Models Execute the Same SDLC": ["Waterfall", "Agile", "DevOps"],
};

function getModule14924SlideByTitle(title: string): Module14924SlideListItem {
  const slide = module14924SlideList.find((item) => item.title === title);
  if (!slide) {
    throw new Error(`Module 14924 slide not found: ${title}`);
  }
  return slide;
}

function extractFacilitatorScript(notes: string): string {
  const marker = "Facilitator notes:\n";
  const markerIndex = notes.indexOf(marker);
  if (markerIndex === -1) {
    return notes;
  }
  return notes.slice(markerIndex + marker.length).trim();
}

function toPresentationSlide(item: Module14924SlideListItem): Module14924PresentationSlide {
  return {
    title: item.title,
    subtitle: item.learnerView.subtitle ?? "",
    bullets: item.learnerView.onScreenContent ?? [],
    highlight: item.learnerView.highlight ?? "",
    speakerNote: extractFacilitatorScript(item.facilitatorNotes),
    phaseCards: MODULE_14924_PHASE_CARDS_BY_TITLE[item.title],
  };
}

const module14924SystemAnalysisSlide = toPresentationSlide(
  getModule14924SlideByTitle("Before SDLC: What Is System Analysis?")
);

const module14924AdamStorySlide = toPresentationSlide(
  getModule14924SlideByTitle("Adam's Story: Why We Need an SDLC")
);

const module14924SdlcModelsSlide = toPresentationSlide(
  getModule14924SlideByTitle("How Models Execute the Same SDLC")
);

export const module14924PresentationFlow: Module14924PresentationFlow = {
  preSessionSlides: [module14924SystemAnalysisSlide, module14924AdamStorySlide],
  session1Insertions: {
    afterSdlc: module14924SdlcModelsSlide,
  },
};

export const module14924FlowMap = [
  {
    placement: "Pre-session (before Session 1 starts)",
    title: module14924SystemAnalysisSlide.title,
  },
  {
    placement: "Pre-session (before Session 1 starts)",
    title: module14924AdamStorySlide.title,
  },
  {
    placement: "Session 1 (inserted after SDLC section)",
    title: module14924SdlcModelsSlide.title,
  },
] as const;





