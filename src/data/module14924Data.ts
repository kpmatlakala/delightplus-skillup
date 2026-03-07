// Editable source for Module 14924 presentation data.
// Multiline strings use .join("\n") for easier manual editing.

const module14924Data = {
  "module14924SpeakerNotes": {
    "title": "Welcome to Information Systems Analysis. Today we flip the script — we think like analysts before we code like developers. Our job is to understand what a system must do, deeply and precisely, before anyone writes a single line of code.",
    "objectives": [
      "Let me anchor today's four core outcomes before we begin, because everything we cover ties back to one of these:",
      "",
      "— Analyst role: We'll position the systems analyst as the translator between business reality and technical implementation. They ask WHY before HOW.",
      "— Fact-finding: Our questioning spine throughout the day is Who / What / Where / When / How / Why. Six questions. Every interview, every document review, every observation maps back to them.",
      "— Techniques: DFDs and decision models are communication tools first and documentation artefacts second. We draw them to think, not just to record.",
      "",
      "As we move through the day, I'll keep pulling every concept back to one central question: 'If you skipped this step on a real project, what would break?'",
      "",
      "Opening hook — give me three minutes before we touch any slides. Ask your group: 'Think of one system you used this week — registration, banking, WhatsApp, the LMS. Now tell me: what happens when it fails?' Capture three answers on the board under People | Process | Data. Then say: 'Everything we do today is designed to prevent exactly that failure. Good analysis saves money, time, and reputation. Poor analysis is the number one cause of IT project failure — not bad code, not hardware, not developers. Analysis.'",
    ].join("\n"),
    "activityIndividual": [
      "For every individual activity I'll run the E–D–C cycle: Explain briefly → Demonstrate one example → Check the learner's attempt before moving on.",
      "",
      "Systems vs Requirements Analysis:",
      "I'll use the phrase 'WHAT first, HOW later' as the anchor. Activity: give learners one vague stakeholder statement — 'The system must be fast and easy to use' — and ask them to rewrite it as a single, measurable requirement. Example transformation: 'The system must allow a lecturer to mark full class attendance in under 30 seconds on a mobile device.' The specificity of the requirement is what makes it testable and buildable.",
      "",
      "Feasibility and cost-benefit:",
      "Present a CET scenario: 'Should we replace the current paper attendance register with a mobile app?' Ask learners to list one tangible benefit, one intangible benefit, one tangible cost, and one intangible cost. Then ask them to make and defend a go/no-go decision. There is no single correct answer — the reasoning is what matters.",
      "",
      "Fact-finding techniques:",
      "Present this scenario: 'Remote CET site, 150 lecturers, unreliable internet, staff reluctant to criticise management openly, new system proposal.' Which two fact-finding methods would you combine and why? Expected reasoning: Questionnaires for scale and anonymity, plus Observation to catch informal workarounds that staff won't self-report. Probe further: 'Would your answer change if the site had only 5 staff?'",
      "",
      "DFD practice:",
      "I'll live-draw the Context Diagram first on the board, narrating each decision. Then Diagram 0. I enforce naming rules throughout: external entities and data stores take nouns, processes take verb phrases. Common mistake to highlight: students who write 'Attendance' as a process name instead of 'Record Attendance'. The noun tells you nothing about what the process DOES.",
      "",
      "Decision tools:",
      "Side-by-side comparison — draw one decision tree and one decision table for the same business rule: 'If a student has attended more than 80% of classes AND submitted all assignments, mark as eligible. If attendance is over 80% but assignments are missing, mark as conditional. Otherwise mark as ineligible.' Ask: which format is clearer for a developer to implement? Which is clearer for a manager to sign off?",
      "",
      "When learners are stuck, use probing questions before giving answers: 'What information would you need to answer that?' and 'What would happen on a real project if you skipped this step?'",
    ].join("\n"),
    "activityGroup": [
      "Group challenge — 25 minutes: 'Analyse the CET Attendance System Redesign.'",
      "",
      "Context brief for learners: The current CET attendance system crashes frequently. Lecturers have resorted to WhatsApp groups and paper registers as workarounds. Management wants a new digital solution. Your team is the analysis team. You have been brought in before any design or development work begins.",
      "",
      "Required deliverables per group:",
      "1. Problem statement — one sentence, specific and measurable. Not 'the system is bad' but 'the current attendance system causes X outcome which results in Y business impact.'",
      "2. Stakeholder list — identify both internal stakeholders (lecturers, admin staff, campus management, IT support) and external stakeholders (students, DHET, ETQA, potential system vendors).",
      "3. Fact-finding plan — minimum three techniques with a concrete reason for each choice. The reason must reference the specific stakeholder group or information gap it addresses.",
      "4. Mini Context DFD — identify all external entities, draw the single central process, and label the main data flows in and out. Apply all four symbol and naming rules.",
      "5. Approach recommendation — choose Waterfall or Agile and justify the choice using at least two project characteristics: requirement stability, team size, delivery urgency, stakeholder availability.",
      "",
      "Before starting, assign roles: Facilitator keeps discussion on track, Scribe captures all decisions, DFD Modeller owns the diagram, Presenter will present to the group, Timekeeper calls time at 20 minutes so the group has 5 minutes to prepare the presentation.",
      "",
      "While groups work, circulate and use these prompts if a group is stuck:",
      "— 'Who else is affected when this system fails that you haven't listed yet?'",
      "— 'Your DFD has a direct arrow between two external entities — is that allowed?'",
      "— 'What specific project characteristic are you basing your methodology recommendation on?'",
      "",
      "Debrief questions after each group presents:",
      "— 'Which requirement on your list is most risky if misunderstood at this stage?'",
      "— 'What data flow is missing from your context diagram?'",
      "— 'How would your methodology recommendation change if the institution had 500 lecturers across 20 campuses instead of 50 lecturers on one campus?'",
    ].join("\n"),
    "summary": [
      "Close-out script — 5 to 7 minutes:",
      "",
      "Say this clearly: 'Today we moved from intuition to structured analysis. Before this morning, you may have thought analysis meant asking a few questions and then starting to code. Now you know it means defining a system problem precisely, gathering facts through multiple lenses, modelling data movement visually, and justifying a development approach — all before a single line of code is written. That is the professional standard. That is what this unit prepares your students to do.'",
      "",
      "Rapid recall — call on four different learners, one question each:",
      "1) 'Explain what the SDLC is and why it exists — one sentence.'",
      "2) 'Name one fact-finding technique and describe the scenario where it is the best choice.'",
      "3) 'What is the structural difference between a Context Diagram and Diagram 0?'",
      "4) 'Give two project characteristics that would make Agile a better choice than Waterfall.'",
      "",
      "Do not correct or expand on answers immediately. Let the room respond first. Then clarify only if the answer is materially incomplete.",
      "",
      "Visual consolidation: return to the board map you drew at the start of the day — the four columns: Problem | Requirements | Models | Recommendation. Ask learners, not yourself, to place one concept from today under each column heading. The goal is for them to build the summary, not receive it.",
      "",
      "Before dismissal — three reminders:",
      "— Complete all workbook activities tonight. Every DFD practice page is a PoE evidence item. Do not discard them.",
      "— Bring one real workplace system issue to tomorrow's session. We will use it for live analysis practice in the morning.",
      "— Sign the attendance register before leaving. This is also PoE evidence for you as a learner today.",
      "",
      "Final line to leave them with: 'Research shows that more than 70% of failed IT projects cite poor requirements as the root cause. Not bad code. Not hardware failure. Poor analysis. You are now equipped to prevent that failure — in your own practice and in the practice of every student you teach.'",
    ].join("\n")
  },
  "module14924SlideList": [
    {
      "slideNumber": 1,
      "title": "Information Systems Analysis",
      "learnerView": {
        "subtitle": "SAQA 14924  |  Block 1  |  Day 1  |  3 Credits",
        "body": "Knowledge Unit",
        "badges": [
          "Block 1",
          "Day 1",
          "3 Credits",
          "Knowledge"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 1 of 47",
        "Title: Information Systems Analysis",
        "",
        "Facilitator notes:",
        "Welcome learners and set the tone immediately.",
        "",
        "Opening line: 'Today we think like analysts before we code like developers. Our job is not to jump to a solution — it is to understand the problem so precisely that the right solution becomes obvious.'",
        "",
        "Opening hook before any content — 3 minutes:",
        "Ask: 'Think of one system you used this week. Registration, banking, WhatsApp, the LMS. What happens when it fails?'",
        "Capture three answers on the board under three columns: People | Process | Data.",
        "",
        "Bridge statement: 'Everything we do today prevents exactly that failure. Good analysis saves money, time, and reputation. Poor analysis is cited in over 70% of failed IT projects — not bad code, not hardware. Poor analysis.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 2,
      "title": "Unit Purpose & Learning Outcomes",
      "learnerView": {
        "subtitle": "What we are building towards today",
        "onScreenContent": [
          "Explain the role of information systems analysis within the Software Development Life Cycle.",
          "Describe the key responsibilities of an information systems analyst.",
          "Identify and apply common information-gathering and fact-finding techniques.",
          "Describe industry-standard systems analysis techniques including DFDs, decision trees, and decision tables."
        ],
        "body": "People credited with this unit standard are able to describe information systems analysis and explain different systems analysis techniques used in the industry."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 2 of 47",
        "Title: Unit Purpose & Learning Outcomes",
        "",
        "Facilitator notes:",
        "Anchor these four outcomes now. You will return to this exact slide during the wrap-up and ask learners to self-assess against each one.",
        "",
        "How to frame each outcome:",
        "- Outcome 1 (SDLC): 'Analysis and design happen before coding. Always. The lifecycle is not a suggestion.'",
        "- Outcome 2 (Analyst role): 'The analyst translates between business reality and technical implementation. They ask WHY a requirement exists before they record WHAT it is.'",
        "- Outcome 3 (Fact-finding): 'Six questions drive all fact-finding: Who, What, Where, When, How, Why. Every technique we use maps back to these.'",
        "- Outcome 4 (Techniques): 'DFDs and decision models are thinking tools first, documentation artefacts second. We draw them to understand, then refine them to communicate.'",
        "",
        "Transition: 'Before we touch the lifecycle, let us establish what a system actually is. Because if you cannot describe it precisely, you cannot analyse it — and you certainly cannot redesign it.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 3,
      "title": "What Is a System?",
      "learnerView": {
        "subtitle": "Every system has these parts",
        "onScreenContent": [
          "Components — people, tools, data, rules",
          "Inputs & Outputs — what enters, what leaves",
          "Processes — transform input into output",
          "Feedback loops — improve future results",
          "Purpose — efficiency, quality, better decisions"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 3 of 47",
        "Title: What Is a System?",
        "",
        "Facilitator notes:",
        "Open with the definition: 'System analysis is the structured process of studying how a system works today, where the problems are, and what must improve before design or development begins.'",
        "",
        "For each concept, use the Explain -> Example -> Implication structure:",
        "",
        "Components:",
        "Explain: 'The parts of the system and how they relate.'",
        "Example: 'In a student registration system: the student portal, database, admin console, notification service, and clerk approval workflow.'",
        "Implication: 'If you miss one component, you miss its dependencies and introduce failure points later.'",
        "",
        "Input and Output:",
        "Explain: 'What enters the system and what it produces.'",
        "Example: 'Input: student submits a registration form. Output: confirmation message, updated record, and admin notification.'",
        "Implication: 'GIGO still applies. Weak input quality creates weak outputs.'",
        "",
        "Processes:",
        "Explain: 'The ordered activities that transform input to output.'",
        "Example: 'Submit form -> validate fields -> review -> confirm.'",
        "Implication: 'Process mapping reveals hidden delays, duplicate effort, and rework.'",
        "",
        "Feedback Loops:",
        "Explain: 'Information from outputs used to improve future system behavior.'",
        "Example: 'If many registrations fail validation, redesign the capture form.'",
        "Implication: 'Without feedback loops, systems repeat the same mistakes.'",
        "",
        "Facilitator prompt: 'Name one system at your campus. Identify one component, one input, one process, one output, and one feedback loop that is missing or weak.'",
        "",
        "Visual: Draw AS-IS vs TO-BE in two columns on the board.",
        "",
        "Transition: 'Now that we can describe a system clearly, we can apply the SDLC to improve it in a controlled way.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 4,
      "title": "Adam Wants to Open an Online Store",
      "learnerView": {
        "subtitle": "A real-world system problem",
        "onScreenContent": [
          "Adam wants to sell products online",
          "His friend is a software developer",
          "Adam says: 'Just build the website'",
          "The developer asks: 'Build what exactly?'",
          "This is where systems analysis begins"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 4 of 47",
        "Title: Adam Wants to Open an Online Store",
        "",
        "Facilitator notes:",
        "Tell the story as a problem, not as a method lecture.",
        "",
        "Story hook:",
        "'Adam wants to open an online store to sell sneakers. He calls his developer friend and says: Just build me a website.'",
        "'The developer replies: Okay, but how should it work?'",
        "",
        "Ask learners:",
        "- How will customers pay?",
        "- Who manages stock?",
        "- What happens if payment fails?",
        "- How do orders get delivered?",
        "",
        "Use the teaching line:",
        "'Before we write code, we must answer these questions. That structured thinking is called systems analysis.'",
        "",
        "Small teaching trick:",
        "'Imagine Adam says: Just build me something like Takealot.'",
        "Then ask: 'Is that a requirement, or just an idea?'",
        "",
        "Transition: 'Now let us look at the structured steps that turn Adam's idea into a working system.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 5,
      "title": "How Adam's Store Gets Built",
      "learnerView": {
        "subtitle": "The Software Development Life Cycle (SDLC)",
        "onScreenContent": [
          "Planning",
          "Requirements Analysis",
          "Design",
          "Implementation",
          "Testing",
          "Deployment & Maintenance"
        ],
        "body": "These steps form the Software Development Life Cycle (SDLC): the structured path from idea to reliable operation."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 5 of 47",
        "Title: How Adam's Store Gets Built",
        "",
        "Facilitator notes:",
        "Now introduce the lifecycle after the story.",
        "",
        "Walk the six phases briefly, one line each:",
        "- Planning: 'Define goals, scope, timeline, and resources.'",
        "- Requirements Analysis: 'Define what the system must do.'",
        "- Design: 'Define how the solution will work.'",
        "- Implementation: 'Build the solution.'",
        "- Testing: 'Validate that it works correctly.'",
        "- Deployment & Maintenance: 'Release, support, and improve continuously.'",
        "",
        "Key clarification:",
        "'These steps are not theory only. This is how real systems are delivered successfully.'",
        "",
        "Transition:",
        "'Next we unpack each SDLC phase in detail and connect it to the artefacts your students produce in their PoE.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 6,
      "title": "1.0 Introduction to System Analysis",
      "learnerView": {
        "subtitle": "Session 1 | System Analysis as a Structured Discipline",
        "onScreenContent": [
          "System analysis is a structured discipline, not a coding task: define the problem before proposing a solution.",
          "Three core questions guide analysis: What is happening now? Why is it happening? What must change?",
          "Use the system lens to answer those questions: Components, Input and Output, Processes, and Feedback loops.",
          "This framing prepares the SDLC and requirements work that follows in Session 1."
        ],
        "body": "Before methods, models, and tools, analysts must frame the system problem correctly. Strong analysis starts with disciplined questioning and evidence."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 6 of 47",
        "Title: 1.0 Introduction to System Analysis",
        "",
        "Facilitator notes:",
        "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.",
        "",
        "Facilitation flow:",
        "1) Explain each row of the table in plain language with minimal jargon.",
        "2) Demonstrate by applying the four dimensions to the CET attendance system live.",
        "3) Check understanding by asking one learner to identify the most likely root-cause component.",
        "",
        "Teaching prompt: 'If you had to analyse a system you have never seen before, what is the first question you would ask?'",
        "Common answers: 'Who uses it?', 'What does it produce?', and 'Where does the data come from?'",
        "All are valid because each maps to a core system dimension.",
        "",
        "Visual: Sketch AS-IS vs TO-BE in two columns. The gap between them becomes the requirements list.",
        "",
        "Key message: 'At project kickoff, teach system dimensions first, not technology choices.'",
        "",
        "Transition: 'The SDLC gives us the lifecycle to execute analysis, design, build, and deployment in a controlled way.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 7,
      "title": "1.0 Introduction to System Analysis (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Why System Analysis Matters",
        "onScreenContent": [
          "Improves efficiency by identifying bottlenecks, redundant steps, and unnecessary complexity in current processes.",
          "Reduces cost by improving resource usage and preventing expensive rework caused by misunderstood requirements.",
          "Improves quality and reliability of system outputs by catching design and logic problems before they are built into the system.",
          "Supports structured innovation through disciplined problem-solving rather than reactive trial and error."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 7 of 47",
        "Title: 1.0 Introduction to System Analysis (cont.)",
        "",
        "Facilitator notes:",
        "Continued. Connect each benefit to the CET context so it lands with meaning:",
        "",
        "Efficiency: 'Where in your current admin process do you see the most bottlenecks? How many steps could be removed if the system was properly analysed and redesigned?'",
        "",
        "Cost: 'Has anyone in this room experienced a system that was built, then rebuilt because the requirements were not clear? What did that rework cost in time, money, and staff morale?'",
        "",
        "Quality: 'What would change for your students if every project started with a properly documented requirements analysis instead of jumping straight to code?'",
        "",
        "Innovation: 'Structured analysis is not a constraint on creativity. It is the foundation that makes creative solutions viable. You cannot build something innovative on a misunderstood problem.'",
        "",
        "Key message: 'The value of good analysis is invisible when it is done well. It only becomes visible when it is skipped — and by then, the damage is expensive to reverse.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 8,
      "title": "1.0 Introduction to System Analysis (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | The System Analysis Process",
        "onScreenContent": [
          "Step 1: Identify the system and define its boundaries — what is inside scope and what is outside.",
          "Step 2: Gather data using interviews, observation, document review, and questionnaires.",
          "Step 3: Model the system using diagrams and process flows to make it visible and discussable.",
          "Step 4: Analyse issues, risks, and improvement opportunities against the organisation's business objectives."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 8 of 47",
        "Title: 1.0 Introduction to System Analysis (cont.)",
        "",
        "Facilitator notes:",
        "Continued. Introduce the process steps before the SDLC lifecycle detail.",
        "",
        "For Step 1, emphasise scope: 'Defining scope is one of the hardest and most important things an analyst does. A system boundary that is too wide means you are trying to fix everything and end up fixing nothing. Too narrow and you miss the root cause.'",
        "",
        "For Step 2, ask: 'Which of these four data-gathering methods do you think is most commonly done badly in practice? Why?' Common answer: interviews — because people ask leading questions or speak only to management and miss the people who actually use the system daily.",
        "",
        "For Step 3: 'Modelling makes the invisible visible. A DFD, a flowchart, a use case diagram — these are not bureaucracy. They are thinking tools that make a complex process discussable, verifiable, and buildable.'",
        "",
        "Transition: 'These eight steps sit inside the SDLC — the formal lifecycle that structures all of this work. Let us now look at the SDLC in detail.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 9,
      "title": "1.0 Introduction to System Analysis (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Completing the Analysis Process",
        "onScreenContent": [
          "Step 5: Propose and evaluate improvement options — compare alternatives before recommending a solution.",
          "Step 6: Implement agreed changes according to the chosen development approach and design specifications.",
          "Step 7: Test and monitor outcomes against the original requirements and agreed success criteria.",
          "Step 8: Iterate — system analysis is not a one-time event. Systems evolve and analysis must evolve with them."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 9 of 47",
        "Title: 1.0 Introduction to System Analysis (cont.)",
        "",
        "Facilitator notes:",
        "Continued. Complete the 8-step analysis process.",
        "",
        "For Step 5: 'Proposing options, not prescribing solutions, is a professional discipline. The analyst's job is to present alternatives with honest trade-offs, not to advocate for a favourite technology.'",
        "",
        "For Step 8, make the iteration point concrete: 'A student registration system that works well today will need re-analysis when the institution adds new programmes, changes assessment rules, or integrates with a new national system. Analysis is a lifecycle, not a one-off task. This is why maintenance skills are as valuable as build skills.'",
        "",
        "Connect to PoE: 'Your students will need to demonstrate evidence from each of these steps in their Portfolio of Evidence. A well-understood analysis process makes PoE compilation straightforward — because learners know exactly what evidence to collect at each stage.'",
        "",
        "Transition: 'Now let us look at the formal structure that houses all of these steps: the Systems Development Life Cycle.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 10,
      "title": "1.1 The Systems Development Life Cycle (SDLC)",
      "learnerView": {
        "subtitle": "Session 1 | Introduction to Information Systems Analysis",
        "onScreenContent": [
          "The SDLC divides a large development project into manageable stages, each with defined activities, responsibilities, and measurable deliverables.",
          "Every stage terminates in a milestone: a formal deliverable that must be produced and approved before the next stage begins.",
          "Maintenance costs typically exceed original development costs over the full system lifetime - documentation during development is not optional, it is the foundation for everything that follows.",
          "Extensive documentation during development is necessary to support future maintenance, auditing, and system handover to new teams."
        ],
        "body": "The Systems Development Life Cycle gives organisations a means of controlling a large development project by dividing it into manageable stages with well-defined outputs and clear accountability at each stage gate."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 10 of 47",
        "Title: 1.1 The Systems Development Life Cycle (SDLC)",
        "",
        "Facilitator notes:",
        "Outcome focus: Explain the role of information systems analysis within the Software Development Life Cycle.",
        "",
        "Facilitator question to open: 'Which SDLC phase do you think is most commonly skipped when a project is under deadline pressure?' Take answers before responding. Expected: Testing or Requirements Analysis. Then ask: 'What are the consequences of skipping each of those?'",
        "",
        "For Testing skipped: bugs in production, user trust destroyed, emergency patches, reputational damage.",
        "For Requirements skipped: built the wrong system, expensive rework, users reject the deliverable, scope creep on every subsequent phase.",
        "",
        "Visual: draw the SDLC as a looped timeline on the board — not a straight line. The loop represents maintenance feeding back into the next cycle. Under each phase, write one real deliverable and one real consequence of skipping it.",
        "",
        "Maintenance cost point: 'Studies consistently show that maintenance costs exceed development costs over a system's lifetime. Every shortcut taken during development creates a larger bill during maintenance. Documentation is not bureaucracy — it is insurance.'",
        "",
        "Transition: 'Let us now map each phase to its specific deliverable so you know exactly what must be produced at each stage.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 11,
      "title": "1.1 The Systems Development Life Cycle (SDLC) (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | SDLC Phases and Deliverables",
        "onScreenContent": [
          "Phase 1 - Feasibility Study: Is this worth doing? Deliverable: Go/No-Go recommendation report with cost-benefit analysis.",
          "Phase 2 - Requirements Analysis: What must the system do? Deliverable: Software Requirements Specification (SRS), agreed by all stakeholders.",
          "Phase 3 - Logical Design: What is the conceptual structure? Deliverable: Conceptual design of programmes, data models, and system architecture.",
          "Phase 4 - Physical Design: How will it be built? Deliverable: Detailed technical specifications for modules, databases, hardware, and software."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 11 of 47",
        "Title: 1.1 The Systems Development Life Cycle (SDLC) (cont.)",
        "",
        "Facilitator notes:",
        "Continued. For each phase, ask: 'What happens if this phase is skipped entirely?'",
        "",
        "Phase 1 skipped — Feasibility: 'You commit resources to a project that was never viable — legally, technically, or financially. The Standish Group's CHAOS Report shows 19% of IT projects are cancelled outright. Many of those would have been stopped at feasibility if it had been done properly.'",
        "",
        "Phase 2 skipped — Requirements: 'You build the wrong system. The development team works hard, delivers on time, and produces something nobody asked for. This is the most expensive mistake in software development.'",
        "",
        "Phase 3 skipped — Logical Design: 'You build a system that cannot scale, cannot integrate with adjacent systems, and falls apart when volume increases.'",
        "",
        "Phase 4 skipped — Physical Design: 'Developers make independent technical decisions that conflict with each other. The result is a system that works in parts but fails as a whole.'",
        "",
        "Ask learners to annotate their workbooks with one real-world example of a project consequence for each skipped phase.",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 12,
      "title": "1.1 The Systems Development Life Cycle (SDLC) (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Applied SDLC: Adam's Online Store",
        "onScreenContent": [
          "Planning | Agree on business goals, budget, timeline, and success criteria | Project scope document and plan",
          "Requirements Analysis | Capture required features: product catalogue, cart, checkout, account management, admin dashboard, payments | SRS — Software Requirements Specification",
          "Design | Define architecture, database structure, page flow, security model, and UI approach | DDS - Design Document Specification",
          "Implementation | Develop frontend, backend, APIs, database queries, and integrations according to DDS | Working software build"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 12 of 47",
        "Title: 1.1 The Systems Development Life Cycle (SDLC) (cont.)",
        "",
        "Facilitator notes:",
        "Continued. This slide grounds the abstract SDLC phases in Adam's concrete scenario.",
        "",
        "For each row, ask: 'What equivalent deliverable would your students produce for their capstone project?' This directly connects the SDLC to the PoE.",
        "",
        "Planning → Project scope document: students write a project charter.",
        "Requirements → SRS: students write a requirements specification.",
        "Design → DDS: students produce wireframes and architecture diagrams.",
        "Implementation → Working build: students submit their prototype.",
        "",
        "Key insight: 'The PoE your students compile is essentially an SDLC artefact collection. Every phase produces evidence. If they understand the SDLC, PoE compilation is not a burden — it is a natural output of the work.'",
        "",
        "Transition: 'Now let us look at how different teams execute these same SDLC phases — because the lifecycle is the structure, but the methodology is how you walk through it.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 13,
      "title": "The SDLC Backbone: How Methodologies Walk It",
      "learnerView": {
        "subtitle": "SDLC is the backbone — methodology is how you walk it",
        "onScreenContent": [
          "Waterfall: strong sequential phase gates — best when requirements are stable, well-defined, and compliance-critical.",
          "Agile: iterative sprints with stakeholder review after each cycle — best when requirements evolve and delivery speed matters.",
          "DevOps: automates build, test, and deploy pipelines with continuous monitoring and fast feedback loops.",
          "All three execute the same SDLC logic: plan, define, design, build, validate, release, maintain."
        ],
        "phaseCards": [
          "Waterfall",
          "Agile",
          "DevOps"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 13 of 47",
        "Title: The SDLC Backbone: How Methodologies Walk It",
        "",
        "Facilitator notes:",
        "Placement logic: this slide comes AFTER SDLC detail. Learners must first understand the lifecycle itself, then see how different methods execute it. Do not use this slide before Slide 10.",
        "",
        "Key line — say this clearly and slowly: 'Different methods. Same lifecycle backbone. The SDLC is not one of the methods. It is the underlying structure that ALL methods implement.'",
        "",
        "Talk track:",
        "— 'We now know what the SDLC phases are and why each one exists.'",
        "— 'This slide explains how different teams move through those same phases at different rhythms and with different emphases.'",
        "— 'Waterfall: sequential gates, formal sign-offs, heavy documentation. Best for regulated, stable-requirement projects.'",
        "— 'Agile: iterative sprint loops, working software every two weeks, continuous user feedback. Best for evolving requirements and fast delivery.'",
        "— 'DevOps: continuous delivery and monitoring, code can be tested and released multiple times per day. Best for post-go-live, high-frequency update environments.'",
        "",
        "Ask: 'For a government SETA compliance reporting system with fixed legal requirements — which method? For a student mobile app where features change every semester — which method? Why does your answer differ?'",
        "",
        "Transition: 'With methodology context clear, we move into the analysis phase itself — starting with feasibility, requirements, and the structured techniques that produce them.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 14,
      "title": "1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps",
      "learnerView": {
        "subtitle": "Session 1 | Introduction to Information Systems Analysis",
        "onScreenContent": [
          "Waterfall | Sequential phase-by-phase progression | Stable requirements, regulated projects | Low flexibility when requirements change late in the project",
          "Agile | Iterative sprints with frequent stakeholder review | Evolving requirements and fast delivery environments | Requires disciplined backlog management and active user participation",
          "DevOps | Continuous integration, testing, and automated deployment | High-frequency release environments | Requires automation maturity and shared culture between development and operations teams",
          "Waterfall works for Adam when requirements are fixed and approved upfront. Agile works when product features and user needs evolve rapidly based on real feedback."
        ],
        "body": "The SDLC is the backbone. Methodologies define HOW teams move through those phases. Different project contexts require different execution rhythms and different levels of documentation rigour."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 14 of 47",
        "Title: 1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps",
        "",
        "Facilitator notes:",
        "Outcome focus: Explain the role of information systems analysis within the SDLC.",
        "",
        "Facilitation flow:",
        "1) Explain each model in one sentence — plain language, no acronyms first pass.",
        "2) Apply Adam's store scenario: 'Adam's initial build used Waterfall — he had a fixed spec and needed predictability. Once live, his team shifted to Agile for feature updates. Today, his deployment pipeline uses DevOps CI/CD.'",
        "3) Check: ask one learner which model they would recommend for a brand-new student management system at CET and why. Listen for their reasoning, not just the answer.",
        "",
        "Visual to draw on board: a horizontal timeline for Waterfall (one straight arrow through phases). Overlapping loops for Agile (repeated sprint cycles). A continuous circular pipeline for DevOps. The contrast is memorable and fast to sketch.",
        "",
        "Transition: 'Now let us focus on the analysis phase itself — specifically what systems analysis establishes before design begins.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 15,
      "title": "1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | The CET Lens",
        "onScreenContent": [
          "Agile suits CET projects where programme requirements, assessment rules, or student demographics change from semester to semester.",
          "DevOps is valuable post-go-live when frequent small updates, content fixes, and incremental improvements are expected on a regular basis."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 15 of 47",
        "Title: 1.1A SDLC Models in Practice (cont.) — CET Lens",
        "",
        "Facilitator notes:",
        "Continued. Bring methodology choice back to the CET lecturer context.",
        "",
        "Key facilitation point: 'Your students will ask you which methodology to use for their capstone. The honest answer is: it depends on the project. Use this as your decision framework: How stable are the requirements? How fast must you deliver? How available is the user for feedback?'",
        "",
        "Ask: 'Which methodology would you recommend for a student building a community resource directory for a rural WIL site — where the community representative is available for weekly check-ins?' The conditions point to Agile.",
        "",
        "Transition: 'Now let us look at what systems analysis actually establishes — and how it differs from requirements analysis.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 16,
      "title": "SDLC Backbone Checkpoint",
      "learnerView": {
        "subtitle": "Consolidation before deep analysis techniques",
        "onScreenContent": [
          "Waterfall: strong phase gates — best when requirements are stable and compliance is strict.",
          "Agile: iterative sprints — best when requirements evolve and feedback must be fast.",
          "DevOps: automates build, test, and deploy with continuous monitoring and feedback loops.",
          "All three walk the same SDLC backbone; methodology changes the rhythm, not the lifecycle purpose."
        ],
        "phaseCards": [
          "Waterfall",
          "Agile",
          "DevOps"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 16 of 47",
        "Title: SDLC Backbone Checkpoint",
        "",
        "Facilitator notes:",
        "Quick consolidation check before entering the core analysis content.",
        "",
        "Workbook task — 2 minutes, then share one response: 'Write one sentence: which methodology would you recommend for a new student registration system at CET, and give two reasons.' This is low-stakes writing to consolidate before moving forward.",
        "",
        "After sharing, affirm the reasoning structure, not just the answer. Then move on.",
        "",
        "Transition: 'Good. With the lifecycle and its execution models clear, let us now look at what systems analysis actually produces — and the important distinction between analysis and requirements.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 17,
      "title": "1.2 Systems Analysis",
      "learnerView": {
        "subtitle": "Session 1 | WHAT Before HOW",
        "onScreenContent": [
          "Systems analysis establishes WHAT the system must do before any technical design choices are made.",
          "It defines objectives, user needs, information requirements, constraints, and expected outcomes in business terms.",
          "Design and development then determine HOW to implement those requirements using architecture, tools, and code.",
          "If teams start with HOW first, they risk building a technically sound system that solves the wrong problem."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 17 of 47",
        "Title: 1.2 Systems Analysis — WHAT, Not HOW",
        "",
        "Facilitator notes:",
        "Outcome focus: Explain the role of information systems analysis within the SDLC.",
        "",
        "This slide carries one of the most important conceptual distinctions in the entire unit. Give it full weight.",
        "",
        "Say clearly and slowly: 'Systems analysis tells us WHAT the system must do. Design and development tell us HOW to build it. If you mix these up — if you start designing technical solutions before you have defined the requirements — you will solve the wrong problem, or the right problem in the wrong way. Both outcomes waste money.'",
        "",
        "Visual to draw: two boxes, side by side. Left box: WHAT (Analysis). Right box: HOW (Design + Development). A one-way arrow pointing left to right. Then show two examples:",
        "WHAT example: 'The system must allow a lecturer to mark full class attendance in under 30 seconds on a mobile device.'",
        "HOW example: 'We will build a React Native frontend with a FastAPI backend and a PostgreSQL database.'",
        "",
        "Ask: 'Why is the WHAT statement more valuable than the HOW statement at this stage of the project?' Expected: because the WHAT can be verified against user needs; the HOW is a technical decision that should flow from the WHAT.",
        "",
        "Ask: 'What could go wrong if we specified the HOW first and then tried to reverse-engineer the WHAT from it?' This surfaces the common failure pattern: teams fall in love with a technology and then retrofit requirements to justify it.",
        "",
        "Transition: 'Before we commit to building anything, we need to answer a more fundamental question: should we build at all? That is the feasibility study.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 18,
      "title": "1.3 Feasibility Study",
      "learnerView": {
        "subtitle": "Session 1 | Introduction to Information Systems Analysis",
        "onScreenContent": [
          "Legal feasibility: Will the proposed system comply with applicable laws, POPIA, and sector-specific regulations?",
          "Ethical feasibility: Does the system align with ethical norms, user privacy rights, and institutional values?",
          "Technological feasibility: Does the organisation have the infrastructure, integration capability, and technical skills required?",
          "Economic feasibility: Will the system provide competitive advantage, measurable savings, or demonstrable benefit that justifies the full investment?"
        ],
        "body": "The main objective of the feasibility study is to determine whether the proposed system is desirable and viable before significant resources are committed to the full-scale project."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 18 of 47",
        "Title: 1.3 Feasibility Study",
        "",
        "Facilitator notes:",
        "Outcome focus: Explain the role of information systems analysis within the SDLC.",
        "",
        "Facilitation flow:",
        "1) Explain each feasibility dimension in one sentence.",
        "2) Apply all five dimensions to the CET attendance system replacement scenario as a live class exercise.",
        "3) Check: ask one learner which dimension would be the most critical for a biometric attendance system — and defend the answer.",
        "",
        "POPIA connection for Legal and Ethical: 'In South Africa, any system that collects personal data — names, ID numbers, biometric data, student records — must be assessed for legal and ethical feasibility against the Protection of Personal Information Act. POPIA compliance is not optional. Processing personal information without lawful grounds is a criminal offence. Biometric attendance is a serious POPIA question.'",
        "",
        "Visual to draw on board: a 2×2 grid. Rows: Benefits / Costs. Columns: Tangible / Intangible. Fill it together as a class using the attendance system scenario. This visual makes the classification concrete and memorable.",
        "",
        "Ask: 'Can someone give a real example of a project that was stopped at the feasibility stage? What dimension killed it?' This surfaces institutional experience and validates the real-world relevance of the exercise.",
        "",
        "Transition: 'Once feasibility confirms we should proceed, requirements analysis defines exactly what we are building. Let us look at how that works.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 19,
      "title": "1.3 Feasibility Study (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Tangible and Intangible Costs and Benefits",
        "onScreenContent": [
          "Tangible Benefits: Faster processing speed | Access to previously unavailable management information | Reduced staff time on manual data capture | Fewer errors in calculations and reporting",
          "Intangible Benefits: Improved decision-making quality | Enhanced data accuracy and trust | Stronger competitive position | Better institutional image | Increased staff and student satisfaction",
          "Tangible Costs: Hardware and infrastructure investment | Software licences | Analyst and developer time in person-days | Staff salaries during transition and training | Training and change management programme",
          "Intangible Costs: Loss of operational focus during transition | Reputational risk if the project is delayed or fails publicly | Reduced decision quality while old and new systems co-exist | Disruption to established working routines and institutional habits"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 19 of 47",
        "Title: 1.3 Feasibility Study (cont.) — Tangible and Intangible",
        "",
        "Facilitator notes:",
        "Continued. Cover the cost-benefit classification in detail.",
        "",
        "Activity — classify these four items as tangible benefit, intangible benefit, tangible cost, or intangible cost:",
        "1) 'Three-day training programme for 20 lecturers on the new LMS'",
        "2) 'Improved lecturer satisfaction scores in the annual staff survey'",
        "3) 'Server upgrade required to run the new system'",
        "4) 'Staff resistance and morale drop during the transition period'",
        "",
        "Answers: (1) Tangible cost, (2) Intangible benefit, (3) Tangible cost, (4) Intangible cost.",
        "",
        "Key insight: 'Intangible costs are systematically underestimated in project proposals because they do not appear on an invoice and are hard to quantify before the event. But the disruption of a poorly managed transition can cost more in lost productivity than the system itself. A proper feasibility study surfaces them before they become surprises.'",
        "",
        "Transition: 'Feasibility established that we should proceed. Now requirements analysis defines precisely what we are building. Let us look at how that works.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 20,
      "title": "1.4 Requirements Analysis",
      "learnerView": {
        "subtitle": "Session 1 | Introduction to Information Systems Analysis",
        "onScreenContent": [
          "Asking the users directly: interviews for depth and context; questionnaires for breadth, scale, and anonymity.",
          "Deriving from an existing system: analysing current data flows, documents, reports, forms, and system outputs.",
          "Deriving from the business domain: Business Systems Planning, critical success factor analysis, benchmarking against comparable institutions.",
          "Experimenting with prototypes: build a rough version and let users react to something concrete rather than abstract descriptions."
        ],
        "body": "The principal objective of requirements analysis is to produce a Requirements Specification — a detailed, agreed description of WHAT the system will do, signed off by developers, users, management, and all relevant stakeholders."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 20 of 47",
        "Title: 1.4 Requirements Analysis",
        "",
        "Facilitator notes:",
        "Outcome focus: Explain the role of information systems analysis within the SDLC.",
        "",
        "Key message on the Requirements Specification: 'The SRS is the contract between the development team and the stakeholders. Everything built must trace back to this document. If it is not in the specification, it should not be built. If it is in the specification, it must be testable. Both of those principles prevent scope creep and expensive rework.'",
        "",
        "The CRITICAL DISTINCTION box on this slide is one of the most important teaching points of the day. Say it with emphasis: 'If your students interview a user who describes their current workflow — complete with workarounds and manual fixes — that description is not the requirement. That description is the symptom. The requirement is what the workflow should look like if the system worked correctly.'",
        "",
        "Example to make it concrete: 'A lecturer tells you: I take attendance on paper, then photograph it, then type it into a WhatsApp group, and at month-end an admin person manually enters it into the system. That is the AS-IS. The TO-BE requirement is: the lecturer marks attendance on a mobile device in under 30 seconds and the data is immediately available to management. The gap between those two is the requirement.'",
        "",
        "Visual: draw AS-IS vs TO-BE two-column model on the board. The gap between left and right column is the requirements list.",
        "",
        "Transition: 'Now let us look at the structured framework we use to gather those requirements — the six questions every analyst must be able to answer.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 21,
      "title": "1.4 Requirements Analysis (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | The 6W Fact-Finding Framework — Part 1",
        "onScreenContent": [
          "WHO? — Who are the users, decision-makers, and stakeholders? Who provides data? Who receives it? Who is directly affected when the system fails?",
          "WHAT? — What data is captured, processed, stored, and reported? What decisions depend on this information? What are the specific business rules?",
          "WHERE? — Where does data originate? Where is it processed? Where are outputs delivered? Are there remote sites or distributed processes that must be considered?",
          "WHEN? — When do transactions occur? When must reports be available? When do volume peaks occur? What are the timing and latency constraints?"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 21 of 47",
        "Title: 1.4 Requirements Analysis (cont.) — 6W Framework Part 1",
        "",
        "Facilitator notes:",
        "Continued. Introduce the 6W fact-finding framework — the questioning spine for every interview, observation, and document review.",
        "",
        "Say: 'Memorise these six questions. Every fact-finding session you run — whether it is a 20-minute interview with a clerk or a 3-hour JAD workshop with management — maps back to one or more of these. If you have answered all six for every stakeholder group, your requirements gathering is comprehensive.'",
        "",
        "Live application exercise: 'Apply the first four Ws to the CET attendance system right now. What answers do you already know without any research? Where are the gaps that require investigation?'",
        "",
        "Write the 6Ws as column headers on the board. Start filling in the attendance system answers with the room. The gaps where the class cannot answer become the explicit requirements-gathering agenda.",
        "",
        "Transition to next slide: 'Two more Ws, then the specific techniques we use to answer all six.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 22,
      "title": "1.4 Requirements Analysis (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Fact-Finding Techniques",
        "onScreenContent": [
          "Interviews | Use when: deep understanding of individual roles, complex processes, or sensitive issues is needed | Advantage: allows follow-up questions; uncovers context, assumptions, and unstated requirements",
          "Document Review | Use when: existing forms, reports, policies, and data definitions are available | Advantage: reveals what the system actually does versus what people believe it does",
          "Observation | Use when: users may not accurately describe their own work, or informal workarounds are suspected | Advantage: shows the real process including undocumented steps, delays, and inefficiencies",
          "Questionnaires and Surveys | Use when: many respondents must be reached, or anonymity is needed to surface honest feedback | Advantage: cost-effective at scale; statistical analysis of aggregate responses is possible"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 22 of 47",
        "Title: 1.4 Requirements Analysis (cont.) — Fact-Finding Techniques",
        "",
        "Facilitator notes:",
        "Continued. Introduce the five main fact-finding techniques using the E–D–C cycle for each.",
        "",
        "For Document Review specifically: 'This is the most underused technique. Existing forms, reports, and spreadsheets tell you what data the organisation already captures, how it is used, and where the quality breaks down. Before your first interview, always review the existing documentation. It tells you what questions to ask — and which answers to challenge.'",
        "",
        "For Observation specifically: 'Observation is the technique that surfaces the truth that interviews miss. People do not lie in interviews — they genuinely believe their description of their work is accurate. But observation consistently reveals a different reality: the informal steps, the manual workarounds, the colleague who actually knows the system, the desk drawer full of printed checklists that nobody mentions in a meeting.'",
        "",
        "Scenario challenge: 'You are analysing a system for a remote rural CET campus. The site has 150 lecturers, unreliable internet, and management has indicated that some staff feel threatened by the new system. Which two techniques would you combine, and why?'",
        "",
        "Expected reasoning: Questionnaires (scale + anonymity — staff can express concerns without fear of identification) combined with Observation (to see actual workflows without relying on potentially defensive self-reporting).",
        "",
        "Key insight: 'No single technique is sufficient. Experienced analysts triangulate — they use multiple methods, compare what each reveals, and treat contradictions between sources as the most valuable finding of all.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 23,
      "title": "1.5 Role of the Systems Analyst",
      "learnerView": {
        "subtitle": "Session 1 | Introduction to Information Systems Analysis",
        "onScreenContent": [
          "Consultant — Works as an outside expert hired to address a specific business problem. Brings an independent perspective and specialist knowledge the organisation does not have internally.",
          "Supporting Expert — Provides internal specialist assistance to a project team. Advises on IT capabilities and guides technical decisions without taking ownership of the project outcome.",
          "Agent of Change — Facilitates and drives organisational transformation. Analyses how work is currently done, proposes improvements, and guides the organisation through adopting the new solution.",
          "Problem Solver — Breaks complex business problems into manageable parts, identifies root causes, and develops systematic, practical solutions that can be built, tested, and maintained."
        ],
        "body": "A systems analyst researches problems, plans solutions, recommends software and systems, and coordinates development to meet business requirements. They need strong analytical thinking, communication skills, and the ability to work with people at every level of an organisation."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 23 of 47",
        "Title: 1.5 Role of the Systems Analyst",
        "",
        "Facilitator notes:",
        "Outcome focus: Describe the key responsibilities of an information systems analyst.",
        "",
        "Facilitation flow:",
        "1) Explain each role with a one-sentence definition.",
        "2) Ask learners: 'In your current role as a CET lecturer supervising student projects — which of these three roles do you already play? Which one do you find hardest?'",
        "3) Check: give a mini-scenario and ask which role the analyst is playing: 'A lecturer is asked by the Principal to evaluate whether the current timetabling software should be replaced. She interviews the registrar, the IT manager, and three lecturers. She is not from the IT department.' — Answer: Consultant.",
        "",
        "Key insight: 'The systems analyst is the bridge between business reality and technical implementation. They are fluent in both languages — business needs and technical constraints — and they translate between the two. Their most important skill is not technical: it is asking the right question to the right person at the right time.'",
        "",
        "Visual to draw on board: a bridge. Business stakeholders on the left (language: problems, costs, users, outcomes). Technical team on the right (language: code, databases, APIs, latency). The analyst stands on the bridge — and is equally fluent in both languages.",
        "",
        "Transition: 'Four qualities define the most effective analysts. Let us look at those before we close this section.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 24,
      "title": "1.5 Role of the Systems Analyst (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Four Qualities of an Effective Analyst",
        "onScreenContent": [
          "Problem Solver — Breaks complexity into manageable parts; identifies root causes rather than symptoms; develops systematic solutions.",
          "Communicator — Translates technical concepts for non-technical stakeholders and business requirements for developers. Writes clearly. Listens actively. Asks better questions than most.",
          "Ethical — Handles sensitive data and organisational information with integrity, confidentiality, and POPIA compliance. Does not take shortcuts with data governance.",
          "Self-Disciplined and Self-Motivated — Manages time effectively, meets deadlines under pressure, drives tasks to completion with minimal supervision."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 24 of 47",
        "Title: 1.5 Role of the Systems Analyst (cont.) — Four Qualities",
        "",
        "Facilitator notes:",
        "Continued. Cover the four qualities of an effective analyst.",
        "",
        "Reflection activity: Ask learners to rate themselves privately on each quality from 1 (developing) to 5 (strong). This is not shared. Then ask: 'Which quality do you think your students find hardest to demonstrate in their projects? How would you develop it through the coursework?'",
        "",
        "For Ethics + POPIA: 'Any system that processes student data, staff records, or personal information is subject to POPIA. The analyst is often the first person who defines what data the system will collect. If they do not ask 'Is this collection necessary and lawful?' at the requirements stage, nobody will. By the time development is complete, it is too late to remove it without expensive rework.'",
        "",
        "For Communicator: 'The most technically brilliant analyst in the world produces no value if they cannot write a requirements document that a developer can implement and a manager can approve. Communication is the job. Technical knowledge is the tool that makes good communication credible.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 25,
      "title": "1.5 Role of the Systems Analyst (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Key Responsibilities — Part 1",
        "onScreenContent": [
          "Plan a system flow from the ground up — from problem identification, through requirements gathering and design, to delivery and formal handover.",
          "Interact with users to document requirements for Business Requirements Documents (BRD) and Software Requirements Specifications (SRS).",
          "Write clear, testable, unambiguous technical requirements from the requirements analysis phase.",
          "Support programmers during development by providing use cases, process flowcharts, data models, and database design guidance."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 25 of 47",
        "Title: 1.5 Role of the Systems Analyst (cont.) — Responsibilities Part 1",
        "",
        "Facilitator notes:",
        "Continued. Cover the key analyst responsibilities.",
        "",
        "Connect directly to the CET context: 'Which of these responsibilities do you currently perform in your role as a lecturer or WIL supervisor? How many of your students will be expected to perform these responsibilities in their workplace after graduation?'",
        "",
        "For BRD and SRS: 'These are exactly the documents your students must produce for their PoE. When you, as a lecturer, understand what an analyst produces and why, you are far better equipped to guide students through creating these artefacts — and to assess them against professional standards.'",
        "",
        "Key insight on testable requirements: 'A requirement that cannot be tested cannot be verified. If a requirement says 'the system must be fast', it cannot be tested. If it says 'the system must return search results in under 2 seconds for a dataset of 10,000 records', it can be tested. Teaching your students to write testable requirements is one of the highest-value skills you can give them.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 26,
      "title": "1.5 Role of the Systems Analyst (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Key Responsibilities — Part 2",
        "onScreenContent": [
          "Perform system testing and participate in the deployment and handover of the completed system to the user organisation.",
          "Document requirements throughout the project lifecycle and contribute to user manuals and training materials.",
          "Identify and plan for the organisational and human impacts of proposed systems — change management is part of the analyst's job, not an afterthought."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 26 of 47",
        "Title: 1.5 Role of the Systems Analyst (cont.) — Responsibilities Part 2",
        "",
        "Facilitator notes:",
        "Continued. Final analyst responsibilities.",
        "",
        "On testing and deployment: 'The analyst's work does not end when the requirements document is handed to the development team. They remain actively involved through testing — verifying that what was built matches what was specified — and through deployment, ensuring users can actually use the system.'",
        "",
        "On change management: 'This is the most underestimated analyst responsibility. A technically perfect system that users refuse to adopt is a failed project. The analyst who plans for human impact — who thinks about training, communication, and resistance management — is the analyst who delivers systems that are actually used.'",
        "",
        "Ask: 'Think of a system that was technically sound but was resisted by users. What was the human factor that was missed?'",
        "",
        "Transition: 'Now let us look at the information system itself — the five components every analyst must understand to diagnose problems and design improvements.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 27,
      "title": "1.6 Information System Components in Analysis Practice",
      "learnerView": {
        "subtitle": "Session 1 | Diagnosing Systems Through Components",
        "onScreenContent": [
          "Hardware — The physical layer: servers, workstations, network equipment, input/output devices. Capacity follows Moore's Law: processing power roughly doubles every two years while cost falls.",
          "Software — System software manages hardware resources. Application software performs specific business tasks. Systems may be horizontal (generic, cross-industry), vertical (industry-specific), or legacy (older systems still in production).",
          "Data — The raw material of the system. Data is stored in tables; related tables supply information to processes and users. Data = basic facts; Information = data transformed into something useful for decision-making.",
          "Processes — The tasks and business functions that transform data into information. Processes define how data is captured, validated, transformed, and reported.",
          "People — Users, administrators, and managers who operate and depend on the system. Adoption and training determine whether even technically strong systems succeed in practice."
        ],
        "body": "Every information system is made up of five interdependent components that must work together to produce useful results. Analysts use this component lens to avoid misdiagnosis and target the true root cause."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 27 of 47",
        "Title: 1.6 Information System Components",
        "",
        "Facilitator notes:",
        "Outcome focus: Explain the role of information systems analysis within the SDLC.",
        "",
        "Facilitation flow:",
        "1) Explain each of the five components in plain language.",
        "2) Apply all five to the CET student registration system as a class exercise — ask learners to contribute examples for each component.",
        "3) Check: ask which component is most likely to be the root cause of the problems with your current institutional system.",
        "",
        "Key diagnostic insight: 'When you are analysing a failing system, you must check all five components before diagnosing the root cause. A slow system appears to be a hardware problem — but it may be an inefficient database query (software), dirty data causing unnecessary processing (data), a process with redundant steps (processes), or users who have never been trained on the optimal workflow (people). Miss one component and you may fix the wrong thing.'",
        "",
        "Fifth component — People: 'This slide shows four components. The fifth is people — the users, administrators, and managers who operate the system. No system succeeds without them. The analyst must understand not just what the system does but who uses it, how they use it, and what will cause them to use it badly or not at all.'",
        "",
        "Transition: 'Session 1 complete. We understand what systems analysis is, what the SDLC looks like, who the analyst is, and what information systems are made of. Session 2 applies the technical tools — DFDs, decision models, and development approaches — to that foundation.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 28,
      "title": "Session 2",
      "learnerView": {
        "subtitle": "Systems Analysis Techniques",
        "onScreenContent": [
          "Describe industry-standard systems analysis techniques.",
          "Apply Data Flow Diagrams (DFDs) to document system processes and data flows.",
          "Use decision trees and decision tables to model business logic and rules.",
          "Compare development approaches: structured, object-oriented, Agile, JAD, and RAD."
        ],
        "body": "Session 2 applies DFDs, decision trees, decision tables, and development approach analysis to model and document real business systems."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 28 of 47",
        "Title: Session 2 Divider",
        "",
        "Facilitator notes:",
        "Session 2 opening sequence:",
        "",
        "1. Re-energise after the break: 2-minute pair activity. 'Turn to the person next to you. Name one SDLC phase and describe one thing that goes wrong when it is skipped. 60 seconds, then I will ask two pairs to share.'",
        "",
        "2. Connect Session 2 to Session 1: 'Session 1 gave us the foundation — what systems analysis is, what the SDLC looks like, and who the analyst is. Session 2 gives us the tools — the technical techniques analysts use to model and communicate what they discover.'",
        "",
        "3. Set concrete expectations: 'By the end of this session, you will be able to draw a DFD from scratch, read a decision table, and recommend a development approach with a justified rationale for a given project scenario.'",
        "",
        "Activation question: 'What do you already know about Data Flow Diagrams? Give me one word or phrase each.' Rapid fire around the room.",
        "",
        "Visual-first before any slide content: draw the four DFD symbols on the board with just their names — no explanation yet. Ask learners to guess what each symbol represents and why. This activates schema before the formal definitions land.",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 29,
      "title": "2.1 Interviews vs Questionnaires",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "onScreenContent": [
          "Cost | Questionnaires more economical at scale | Interviews less economical — require one facilitator per respondent",
          "Reach | Questionnaires reach many people simultaneously | Interviews reach one person at a time",
          "Accuracy | Questionnaires have fewer interpretation errors when well-designed | Interviews depend heavily on facilitator skill and consistency",
          "Depth | Questionnaires cannot probe or follow up on interesting responses | Interviews allow deep exploration of complex topics and surface unstated assumptions"
        ],
        "body": "Two primary fact-finding methods: interviews (real-time dialogue, one respondent at a time) and questionnaires (self-administered, scalable, anonymous). Each has specific strengths suited to different stakeholder groups and information needs."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 29 of 47",
        "Title: 2.1 Interviews vs Questionnaires",
        "",
        "Facilitator notes:",
        "Outcome focus: Identify and explain common information-gathering techniques.",
        "",
        "Facilitation flow:",
        "1) Explain the comparison table row by row.",
        "2) Demonstrate: give the CET attendance system scenario. Ask — 'You need to understand why lecturers are using WhatsApp instead of the official system, AND you need to reach 150 lecturers across five campuses. Which method do you use for each goal?'",
        "Expected: interviews for the WHY (depth, follow-up, context), questionnaires for the SCALE (reaching 150 people efficiently).",
        "3) Check: 'What would you learn from a questionnaire that an interview would not give you? What would an interview reveal that a questionnaire would miss?'",
        "",
        "Anonymity point: 'In many institutions, lecturers will not criticise a management-owned system openly if they think their name is attached to the feedback. Questionnaires create the psychological safety to surface real problems. If you only do interviews, you may only hear what people are comfortable saying to authority. Anonymised questionnaires often reveal a very different picture.'",
        "",
        "Transition: 'Now let us look at the visual technique that documents what you discover through all fact-finding methods: the Data Flow Diagram.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 30,
      "title": "2.1 Interviews vs Questionnaires (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Types of Interview",
        "onScreenContent": [
          "Structured Interview — Same questions in the same order for every interviewee. Best for: comparing responses across multiple stakeholders and ensuring consistency. Easier to analyse. Less flexible.",
          "Unstructured Interview — Respondents answer freely; the facilitator follows the conversation where it leads. Best for: exploring complex or sensitive topics; surfacing hidden issues; building trust and rapport. Harder to analyse at scale."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 30 of 47",
        "Title: 2.1 Interviews vs Questionnaires (cont.) — Interview Types",
        "",
        "Facilitator notes:",
        "Continued. Cover structured vs unstructured interview types.",
        "",
        "Practical insight: 'In practice, experienced analysts use a semi-structured approach — they prepare a list of core questions (structured) but allow the conversation to go deeper when something important emerges (unstructured). This gives both consistency and depth.'",
        "",
        "Scenario question: 'Which type of interview would you use when speaking with the DHET compliance officer about regulatory requirements? Which when speaking with a first-year lecturer who uses the attendance system daily?' The answers should differ — compliance officer needs structured consistency for legal accuracy; daily user needs unstructured depth to surface real workflow problems.",
        "",
        "Knowledge consolidation: 'You now have five fact-finding techniques: interviews, questionnaires, document review, observation, and prototyping. For any given analysis situation, the question is not which ONE to use — it is which combination, in what sequence, for which stakeholder group.'",
        "",
        "Transition: 'Once we have gathered our information through these methods, we need a visual tool to model the data flows and processes we discovered. That tool is the DFD.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 31,
      "title": "2.2 Data Flow Diagrams (DFDs)",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "onScreenContent": [
          "External Entity | Rectangle with shadow or double border | Named with a NOUN (Student, Lecturer, Bank) | A person, department, or system outside the system boundary. Acts as a data source (data enters) or sink (data exits). External entities are NOT controlled by the system.",
          "Data Flow | Arrow with single or double arrowhead | Named with a NOUN describing the data (Enrolment Form, Payment Confirmation) | The movement of data between components. The arrowhead shows direction. Represents data about a person, place, or event.",
          "Process | Rounded rectangle or circle | Named verb-adjective-noun (Validate Student Record, Calculate Final Mark) | Work being performed — a transformation of input data into output data. Contains the business logic. A 'black box' at DFD level: inputs and outputs are shown, internal logic is hidden.",
          "Data Store | Open-ended rectangle or parallel lines | Named with a NOUN plus unique reference number D1, D2, D3 | A repository where data is held for later use. Represents a database, computerised file, or physical filing system. At DFD level we show the logical store, not its physical implementation."
        ],
        "body": "A Data Flow Diagram shows how data moves through an information system. It graphically characterises data processes and flows — depicting system inputs, processes, and outputs — without showing programme logic or step-by-step processing detail. A DFD models what a system does, not how it does it technically."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 31 of 47",
        "Title: 2.2 Data Flow Diagrams (DFDs)",
        "",
        "Facilitator notes:",
        "Outcome focus: Describe industry-standard systems analysis techniques.",
        "",
        "Before this slide, draw the four DFD symbols on the whiteboard with names only. Ask learners to guess what each one represents. Common confusions:",
        "— Students mix up process and data store symbols",
        "— Students add arrows directly between two external entities (DFD violation)",
        "— Students name processes with nouns instead of verb phrases",
        "",
        "Facilitation flow:",
        "1) Explain each symbol using the naming rule as the primary anchor — the naming rule tells you what the symbol represents.",
        "2) Live draw: CET Attendance DFD from scratch on the board. 'Lecturer [external entity] → Attendance Data [data flow] → Record Attendance [process] → D1 Attendance Record [data store] → Generate Report [process] → Attendance Report [data flow] → Admin [external entity].' Narrate every naming decision.",
        "3) Make one deliberate error — for example, name the process 'Attendance' instead of 'Record Attendance'. Ask learners to spot the mistake and explain the rule that was broken.",
        "",
        "Common mistakes to explicitly warn against:",
        "— Process named with a noun only: WRONG — 'Attendance'. RIGHT — 'Record Attendance'. 'The noun tells you nothing about what the process does. The verb phrase tells you exactly what it does.'",
        "— Arrow directly between two external entities: 'This is the most common DFD violation. ALL data flows must pass through a process. If Student sends data directly to Admin with no process in between, you have not modelled a system — you have drawn two people talking.'",
        "— Missing data store reference numbers: 'Every data store gets a unique reference — D1, D2, D3. This allows you to show the same data store on multiple pages without redrawing it, just reference the number.'",
        "",
        "Transition: 'Let us now look at the two levels of DFD — Context Diagram and Diagram 0 — and how they relate to each other through levelling and balancing.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 32,
      "title": "2.2 Data Flow Diagrams (DFDs) (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Logical vs Physical DFDs",
        "onScreenContent": [
          "Logical DFD | WHAT the business does — the business events and the data required and produced by each | Describes current or required operations independently of any technology. Used during analysis to agree what the system must do.",
          "Physical DFD | HOW the system will be implemented — names of specific programmes, files, hardware, and people performing each process | Shows the chosen technology solution. Used during design to specify how the logical model will be built."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 32 of 47",
        "Title: 2.2 Data Flow Diagrams (DFDs) (cont.) — Logical vs Physical",
        "",
        "Facilitator notes:",
        "Continued. Cover the logical vs physical DFD distinction.",
        "",
        "This connects directly back to Slide 17 (WHAT vs HOW) — the distinction is the same principle expressed in DFD form:",
        "Logical DFD = WHAT the system does (analysis output)",
        "Physical DFD = HOW the system will be built (design output)",
        "",
        "Key message: 'Always build the logical DFD first. It captures what the business must do, without committing to any technology choice. Only once the logical model is reviewed, validated, and agreed by stakeholders do you build the physical DFD that specifies the technology solution.'",
        "",
        "Analogy to make it memorable: 'A logical DFD is like an architect's floor plan — it shows rooms, flows, and functions without specifying materials or construction methods. The physical DFD is the construction drawing that specifies every material, measurement, and technique.'",
        "",
        "Ask: 'What is the danger of jumping directly to the physical DFD without building the logical one first?' Expected: you commit to a technology before validating the requirement; business stakeholders cannot read physical DFDs and therefore cannot validate them; errors at the requirements stage are embedded into the technical design.",
        "",
        "Transition: 'Now let us look at structured analysis techniques — and how prototyping fits into the analyst's toolkit.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 33,
      "title": "2.3 Structured Analysis Techniques",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "onScreenContent": [
          "Structured systems analysis uses graphical tools to describe a system as interacting processes that transform input data into output data.",
          "These processes may later become code modules during the programming phase — the logical model maps directly onto the physical implementation.",
          "Prototyping approach: build an initial system version that embodies some requirements. Users define their needs by comparing their experience against something concrete — the 'as compared to something' approach.",
          "The prototype may be discarded after use (throwaway prototyping) or may evolve incrementally into the delivered system (evolutionary prototyping)."
        ],
        "body": "Structured analysis translates complex business requirements into precise, visual models that both business users and developers can review, validate, and build from with confidence."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 33 of 47",
        "Title: 2.3 Structured Analysis Techniques",
        "",
        "Facilitator notes:",
        "Outcome focus: Describe industry-standard systems analysis techniques.",
        "",
        "Key message: 'Structured analysis makes the invisible visible. It takes a complex business process that lives only in people's heads and makes it concrete, discussable, verifiable, and buildable.'",
        "",
        "For prototyping — distinguish the two types clearly:",
        "Throwaway prototype: 'Built only to clarify requirements. Like a sketch before the final painting. Once the requirements are clear, the sketch is discarded and the real system is built properly. The prototype was never meant to become the deliverable.'",
        "Evolutionary prototype: 'Built to become the final system through iteration. Each version is a working increment that grows towards the completed product based on user feedback. The risk is that prototypes built without architecture discipline become unmaintainable systems that are faster to rebuild than to extend.'",
        "",
        "Ask: 'When would you choose a throwaway prototype? When would you build an evolutionary one?' The answer maps to project context: throwaway for ambiguous requirements; evolutionary for systems where early delivery of working features creates business value.",
        "",
        "Transition: 'Structured analysis views systems as interacting processes. Object-oriented analysis views systems differently — as collections of objects. Let us compare the two perspectives.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 34,
      "title": "2.4 Object-Oriented Analysis",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "onScreenContent": [
          "Object — A person, place, or thing relevant to the system (Student, Course, Payment). An object belongs to a class, holds specific attribute values, and can perform methods.",
          "Class — Defines the shared attributes and behaviours found in every object of that type. Objects are instantiated from classes. Classes have subclasses (more specific types) and a superclass (more general parent).",
          "Attribute — A property shared by all objects in a class. If objects are nouns, attributes are the adjectives describing them (e.g. Student has: studentNumber, fullName, dateOfBirth, programme).",
          "Method — An action that any object of the class can perform. Methods are the verbs (e.g. Student.calculateGPA(), Student.generateTranscript()). A method defines what the object does, not how it does it internally."
        ],
        "body": "Object-oriented analysis views a system from the perspective of the objects themselves as they function and interact — rather than as sequential processes transforming data. It works well for systems that undergo continuous maintenance and redesign, because classes and objects are reusable across projects."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 34 of 47",
        "Title: 2.4 Object-Oriented Analysis",
        "",
        "Facilitator notes:",
        "Outcome focus: Describe industry-standard systems analysis techniques.",
        "",
        "Facilitation flow:",
        "1) Ground the concepts in the CET student context immediately: 'Student is a class. A specific learner — Kabelo Matlakala, student number 20240023 — is an object, an instance of the Student class. fullName, studentNumber, dateOfBirth, and programme are attributes. calculateGPA() and generateTranscript() are methods.'",
        "2) Demonstrate encapsulation with the light switch analogy: 'You do not need to understand the electrical wiring to turn a light on. The switch is the method. The internal wiring is encapsulated inside the wall. If an electrician rewires the circuit, the switch still works the same way. That is encapsulation — and it is why OO systems are easier to maintain.'",
        "3) Check: ask learners to identify at least two objects, two attributes per object, and two methods per object for the CET Attendance System.",
        "",
        "Key comparison with structured analysis: 'Structured analysis thinks in processes — what does the system DO. OO analysis thinks in objects — what entities exist and how do they interact. Modern systems often use both perspectives at different stages of the same project: OO for requirements and logical design, structured for process mapping and data flow documentation.'",
        "",
        "Transition: 'Now let us compare the full range of development approaches available to an analyst recommending a solution.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 35,
      "title": "2.5 Systems Development Approaches",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "onScreenContent": [
          "Traditional SDLC (Structured) | Sequential phases with formal sign-off gates | Large, well-defined, stable-requirement projects | Government systems, accounting systems, compliance platforms",
          "CASE-Supported | Computer-Aided Software Engineering tools automate analysis tasks, generate code, and maintain documentation | Projects where productivity, consistency, and life-cycle integration are priorities",
          "Object-Oriented (OO) | Small iterative analysis-design-build cycles; system as interacting objects | Rapidly changing requirements; environments where reuse is a priority",
          "Agile Methods | Incremental delivery with continuous user feedback; working software over documentation | Small teams; evolving requirements; situations where early frequent delivery creates value"
        ],
        "body": "Analysts must understand multiple development approaches. Project size, rate of requirement change, available skills, and organisational context all determine which approach is most appropriate — and the analyst is often the person who makes that recommendation."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 35 of 47",
        "Title: 2.5 Systems Development Approaches",
        "",
        "Facilitator notes:",
        "Outcome focus: Describe industry-standard systems analysis techniques.",
        "",
        "Facilitation flow:",
        "1) For each approach, explain the core philosophy in one sentence before any detail: what problem was this approach designed to solve?",
        "2) Ask learners: which of these approaches does their institution currently use for IT projects — or uses most closely? Why?",
        "3) Group challenge: 'Which approach would you recommend for a new student feedback app that will be piloted with 50 students next semester, with weekly check-ins with the student SRC?' Map the project characteristics to the approach.",
        "",
        "Visual to draw on board: a two-axis quadrant. Horizontal axis: Requirement Stability (Low to High). Vertical axis: Team Size (Small to Large). Ask learners to place each methodology in the correct quadrant together. Then add a third dimension verbally: delivery urgency.",
        "",
        "Key Agile principle for CET: 'Working software is the primary measure of progress.' This is directly relevant to PoE: your students must show working prototypes, not just planning documents. A beautiful requirements document with a broken prototype does not meet the standard.",
        "",
        "Transition: 'Let us now look at two specific techniques within this landscape: JAD and RAD — both of which involve intensive stakeholder collaboration.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 36,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Joint Application Development (JAD)",
        "onScreenContent": [
          "JAD brings key business users and IT staff together in structured workshops to define system requirements jointly — replacing serial one-on-one interviews with a collaborative group process.",
          "Advantage: Key users participate directly — resulting in more accurate requirements, better shared understanding, and stronger commitment to the final system because they helped define it.",
          "Advantage: Reduces the back-and-forth iteration between analysts and users that slows traditional interview-based requirements gathering.",
          "Disadvantage: More expensive and time-intensive than individual interviews. Can become cumbersome if the group is larger than the complexity of the project warrants."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 36 of 47",
        "Title: 2.5 Systems Development Approaches (cont.) — JAD",
        "",
        "Facilitator notes:",
        "Continued. Cover Joint Application Development.",
        "",
        "Make it immediate and experiential: 'What you are doing right now — in this training room — is a form of JAD. Lecturers from different CET campuses, different subject areas, different institutional contexts, working together to define how you will teach, supervise, and assess systems development. You are living the methodology. This is why JAD works: people support what they helped to create.'",
        "",
        "Key benefit to drive home: 'When stakeholders define requirements together in a room, they are not just building a specification — they are building buy-in. Resistance to a new system drops dramatically when the people who will use it were the people who specified it.'",
        "",
        "Disadvantage realism: 'JAD sessions require skilled facilitation. An underskilled facilitator can allow one dominant voice to override all others, producing a specification that reflects one person's preferences rather than the organisation's actual needs. This is why the analyst's facilitation skills are as important as their technical skills.'",
        "",
        "Transition: 'JAD focuses on requirements definition through collaboration. RAD focuses on speed of delivery through rapid prototyping. Let us look at RAD.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 37,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Rapid Application Development (RAD)",
        "onScreenContent": [
          "RAD speeds up information systems development by involving users in every phase — not just at requirements stage — and relies heavily on iterative prototyping.",
          "Objective: cut development time and cost by replacing lengthy requirements documentation with rapid build-feedback-revise cycles.",
          "The interactive prototyping cycle continues until users are satisfied and the system meets functional requirements.",
          "Advantage: systems developed faster with significant cost savings; user interface-heavy systems benefit greatly from the rapid feedback cycle."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 37 of 47",
        "Title: 2.5 Systems Development Approaches (cont.) — RAD",
        "",
        "Facilitator notes:",
        "Continued. Cover Rapid Application Development.",
        "",
        "Key advantage to articulate: 'RAD is excellent when the user interface is the most complex part of the system — forms, dashboards, mobile apps, reporting views. Showing users a working screen on Day 3 and asking for feedback is far more productive than asking them on Day 1 to describe in words what they want a screen to look like. The prototype replaces a thousand words of specification.'",
        "",
        "Key disadvantage to be honest about: 'RAD trades design rigour for delivery speed. A RAD-built system can be fast to build and expensive to maintain — because the pressure to prototype quickly can cause developers to bypass architecture, data modelling, and security design. For mission-critical systems where correctness and auditability matter more than speed, RAD is the wrong choice.'",
        "",
        "Ask: 'When would you NOT use RAD? Give me a real example of a system type where you would choose a different approach.' Expected: financial systems, medical records, payroll, examination result processing — any system where an error has serious consequences.",
        "",
        "Transition: 'RAD and JAD both emphasise user involvement. The Agile manifesto formalised this philosophy into 12 principles. Let us work through them quickly.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 38,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | RAD Trade-offs and Agile Principles 1–2",
        "onScreenContent": [
          "RAD disadvantage: may allow less time to develop quality, consistency, and architectural standards — the system works but may be expensive to maintain or extend.",
          "RAD disadvantage: emphasis on mechanics of the system rather than strategic business alignment — fast builds can solve the visible problem while missing the underlying one.",
          "Agile Principle 1: Satisfy the customer through early and continuous delivery of working software.",
          "Agile Principle 2: Welcome changing requirements, even late in development — ability to respond to change is a competitive advantage."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 38 of 47",
        "Title: 2.5 Systems Development Approaches (cont.) — RAD trade-offs + Agile Principles 1-2",
        "",
        "Facilitator notes:",
        "Continued. Begin the Agile principles sequence.",
        "",
        "For each Agile principle, connect it to the CET lecturer context: 'How would this principle change the way you supervise a student capstone project?'",
        "",
        "Principle 1 interpretation: 'Early and continuous delivery does NOT mean skipping planning. It means that delivery of working software happens in small increments throughout the project, not only at the end. Your students should be delivering working prototypes from Week 3 of their project — not submitting their first working version in the final week.'",
        "",
        "Principle 2 interpretation: 'This is the principle that feels most counterintuitive. It says welcome change. Not tolerate it — welcome it. In a CET WIL context, this means when the employer changes the project scope, that is not a problem — it is an opportunity to deliver something that better reflects the real business need. Agile teams are designed to accommodate this.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 39,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Agile Principles 3–6",
        "onScreenContent": [
          "Agile Principle 3: Deliver functioning software incrementally and frequently — in weeks, not months.",
          "Agile Principle 4: Business people and developers must work together daily throughout the project, not just at kickoff and sign-off.",
          "Agile Principle 5: Build projects around motivated individuals — give them the environment and support they need, and trust them to deliver.",
          "Agile Principle 6: Face-to-face conversation is the most efficient and effective method of conveying information within a development team."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 39 of 47",
        "Title: 2.5 Systems Development Approaches (cont.) — Agile Principles 3-6",
        "",
        "Facilitator notes:",
        "Continued. Agile principles 3–6.",
        "",
        "Principle 4 connection to WIL: 'This is exactly why Work-Integrated Learning works as a delivery mechanism. When students are embedded with an employer, the business-developer collaboration happens naturally every day. The challenge is formalising it into PoE evidence — and that is where you as the lecturer add value.'",
        "",
        "Principle 5 connection to lecturer role: 'As a lecturer, assessor, and future WIL supervisor, your job is to provide the environment — the resources, the safety, the structured feedback — and then trust your learners to make technical decisions. Micromanaging the HOW undermines both the learning and the product. Define the WHAT clearly. Then get out of the way.'",
        "",
        "Principle 6 reality check: 'In a post-COVID world, many teams work remotely. Agile principle 6 was written in 1999. The modern interpretation: use the richest available communication channel for the most complex decisions. Video call over email. In-person over video. The richer the channel, the more you can communicate and the fewer the misunderstandings.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 40,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Agile Principles 7–10",
        "onScreenContent": [
          "Agile Principle 7: Working software is the primary measure of progress — not plans, documents, or meeting outputs.",
          "Agile Principle 8: Agile promotes sustainable development — the team maintains a constant, predictable pace indefinitely, avoiding the burnout of crunch-driven projects.",
          "Agile Principle 9: Continuous attention to technical excellence and good design enhances agility — shortcuts now create constraints later.",
          "Agile Principle 10: Simplicity — the art of maximising the amount of work NOT done — is essential. Build only what is needed."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 40 of 47",
        "Title: 2.5 Systems Development Approaches (cont.) — Agile Principles 7-10",
        "",
        "Facilitator notes:",
        "Continued. Agile principles 7–10.",
        "",
        "Principle 7 — PoE connection: 'Working software is the primary measure. In a PoE context, this means your students must demonstrate a working prototype. A beautifully written requirements document with a broken or non-functional build does not meet professional standards. Function is the evidence.'",
        "",
        "Principle 8 — sustainable pace: 'This principle directly addresses the culture of burning developers out on crunch projects. The research is clear: overtime beyond two weeks creates a net productivity deficit — more errors, more rework, more burnout. Sustainable pace is not a compromise on ambition. It is the condition for sustained high performance.'",
        "",
        "Principle 10 — simplicity: 'This is the hardest principle for students to grasp because ambition drives them to add features. Simplicity says: what can we REMOVE without losing value? The best solution is often the simplest one that meets the requirement. Ask your students: what would happen if we removed this feature? If the answer is nothing important, remove it.'",
        "",
        "Ask: 'Which of these four Agile principles do you think is most relevant to how CET students should approach their capstone projects? Defend your answer with one specific reason.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 41,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Agile Principles 11–12 and DevOps CI/CD",
        "onScreenContent": [
          "Agile Principle 11: The best architectures, requirements, and designs emerge from self-organising teams — not from top-down mandates.",
          "Agile Principle 12: At regular intervals, the team reflects on how to become more effective, then adjusts its behaviour accordingly.",
          "CI — Continuous Integration: merge code frequently and run automated tests immediately. Every change triggers verification so integration errors are caught at the source.",
          "CD — Continuous Deployment: keep software releasable at all times and automate the deployment pipeline so safe releases happen without manual gatekeeping delays."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 41 of 47",
        "Title: 2.5 Systems Development Approaches (cont.) — Final Agile Principles + DevOps",
        "",
        "Facilitator notes:",
        "Continued. Final Agile principles and DevOps CI/CD.",
        "",
        "Principle 12 — retrospectives, make it live: 'At the end of each Block in this training programme, we will run a retrospective. Three questions: What worked? What did not? What will we change for the next Block? That is Agile Principle 12 in practice. You are experiencing the methodology, not just studying it.'",
        "",
        "CI/CD for the CET context: 'For student capstone projects, CI/CD at full scale is advanced. But the underlying principle — always keep your code in a working, testable state; never let the build break — is directly applicable to any project. Teach your students to commit working code, not broken work-in-progress.'",
        "",
        "Git connection: 'Version control through Git is the practical implementation of CI for student projects. Every commit is a verifiable, testable state. The PoE evidence trail is built into the commit history. This is why Git is part of the capstone toolkit for this programme.'",
        "",
        "Transition: 'Two enterprise methodologies to complete the picture, then we connect all of today's analysis work to what it enables downstream.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 42,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Enterprise Methodologies and DevOps Monitoring",
        "onScreenContent": [
          "Continuous Monitoring and Feedback: observe real usage and system health in production to drive continuous improvement cycles.",
          "Rational Unified Process (RUP): IBM iterative framework. Four phases — Inception, Elaboration, Construction, Transition — with defined workflows. Suited to large enterprise projects.",
          "Microsoft Solutions Framework (MSF): Microsoft's flexible, scalable framework. Emphasises team model, process model, and risk management. Common in Microsoft technology environments and large IT services organisations.",
          "Context comparison: RUP and MSF provide structure for large teams and enterprise-scale projects. Agile and RAD provide speed and flexibility for smaller teams with evolving requirements."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 42 of 47",
        "Title: 2.5 Systems Development Approaches (cont.) — Enterprise Methodologies",
        "",
        "Facilitator notes:",
        "Continued. DevOps monitoring and enterprise methodologies RUP and MSF.",
        "",
        "For RUP and MSF — scope-set clearly: 'These are unlikely to be used in a CET student capstone project. But you and your students will encounter them in workplace environments, especially in government and enterprise IT. As WIL supervisors, you need to recognise them when employers mention them so you can guide your students in that context.'",
        "",
        "Final synthesis question: 'If you had to choose ONE development approach for your students to learn as their primary methodology for the capstone — which would you choose, and give two reasons grounded in the CET project context?' This is a discussion question with no single correct answer. Listen for reasoning quality.",
        "",
        "Expected responses: Agile/Scrum is most commonly cited — evolving requirements, small teams, frequent deliverables, supervisor check-ins map naturally to sprint reviews. Encourage debate if some choose RAD or Waterfall with strong reasoning.",
        "",
        "Transition: 'We have covered all the major approaches. Let us now connect the dots — what does your analysis work actually enable downstream in the development cycle?'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 43,
      "title": "2.6 What Your Analysis Enables",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "onScreenContent": [
          "Requirements Specification → Project plan, WBS, and effort estimates. You cannot schedule what you have not defined. Downstream: Project Management.",
          "Stakeholder list and information needs → JAD workshops and RAD prototype planning. You know who to include and what to validate with them. Downstream: Requirements Modelling.",
          "Logical DFDs and process descriptions → Physical DFD design and detailed process specifications. The logical model becomes the technical blueprint. Downstream: Data and Process Modelling.",
          "Object identification and class relationships → UML class diagrams, use case models, and sequence diagrams for the full system design. Downstream: Object Modelling Levels 5 and 6."
        ],
        "body": "The analysis work completed today — requirements, process models, data flows, stakeholder identification — is not an end in itself. It is the foundation that makes every downstream development phase possible, efficient, and verifiable."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 43 of 47",
        "Title: 2.6 What Your Analysis Enables",
        "",
        "Facilitator notes:",
        "Outcome focus: Describe industry-standard systems analysis techniques.",
        "",
        "Key message to deliver with weight: 'Everything we do in analysis exists to enable something downstream. Nothing in analysis is done for its own sake. If you cannot explain what a piece of analysis enables, ask whether it needs to be done at all. If you cannot explain why a requirement exists, it is probably a symptom rather than a requirement.'",
        "",
        "Statistic to anchor the importance: 'The Standish Group CHAOS Report consistently finds that incomplete or poorly gathered requirements are cited in more than 70% of failed IT projects. Not bad code. Not hardware failure. Not late delivery. Poor requirements. That is why this module exists — and that is the most important thing your students will learn from you.'",
        "",
        "Ask: 'Looking at these four analysis outputs — requirements specification, stakeholder list, logical DFDs, and object models — which one do you think your students will find hardest to produce? How would you support them through that specific challenge?'",
        "",
        "This question is both a consolidation check and a practical teaching preparation exercise. Listen for answers that reveal both subject understanding and pedagogical thinking.",
        "",
        "Transition: 'Three knowledge checks before we close. These are not designed to trick — they are designed to surface any gaps before you leave today.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 44,
      "title": "Knowledge Check 1 of 3",
      "learnerView": {
        "subtitle": "Session Quiz | Information Systems Analysis"
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 44 of 47",
        "Title: Knowledge Check 1 of 3",
        "",
        "Facilitator notes:",
        "Question: A systems analyst is studying an existing CET attendance process. She discovers that lecturers have been using a WhatsApp group to track attendance because the official system crashes frequently.",
        "",
        "What does this finding MOST directly highlight the need for?",
        "A) A new programming language for the replacement system.",
        "B) Requirements analysis to distinguish current reality (the workaround) from the desired future state.",
        "C) A faster server to run the existing system.",
        "D) An immediate questionnaire sent to all lecturers.",
        "",
        "Do NOT read the correct answer. Wait for learners to respond. Allow silence.",
        "",
        "Correct answer: B.",
        "",
        "Reasoning to explain after the reveal: 'The WhatsApp workaround is precisely the kind of current reality vs desired future state gap that requirements analysis exists to surface. The workaround tells us what the system is NOT doing. Requirements analysis must capture both the workaround and the ideal behaviour — the gap between them IS the requirement.'",
        "",
        "Why the distractors are wrong:",
        "A: A new language solves nothing if requirements are not understood first.",
        "C: A faster server may reduce crashes but does not address the requirements gap — lecturers might still find the redesigned system unusable.",
        "D: A questionnaire is a fact-finding tool, not a requirements analysis output. Sending one is a means to an end, not the answer to the problem.",
        "",
        "Key teaching point: 'When you see a workaround in a system you are analysing, treat it as a requirements signal. The workaround tells you exactly what the system should have done — and did not. Write it down. It is one of your most valuable findings.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 45,
      "title": "Knowledge Check 2 of 3",
      "learnerView": {
        "subtitle": "Session Quiz | Information Systems Analysis"
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 45 of 47",
        "Title: Knowledge Check 2 of 3",
        "",
        "Facilitator notes:",
        "Question: In a DFD, the process 'Validate Student Record' receives a data flow from an external entity called 'Lecturer' and sends output to a data store called 'D1 Student Database.'",
        "",
        "Which statement about this DFD fragment is CORRECT?",
        "A) This violates DFD rules because processes must be named with a noun only.",
        "B) This violates DFD rules because external entities cannot send data flows directly to processes.",
        "C) This is a valid DFD fragment — the flow from external entity to process to data store is correct.",
        "D) This violates DFD rules because data stores cannot receive data from processes.",
        "",
        "Do NOT read the correct answer. Wait for learners to respond.",
        "",
        "Correct answer: C.",
        "",
        "Reasoning to explain after the reveal: 'External entity → Process → Data Store is one of the most common and completely valid DFD flow patterns. An external entity provides data to a process; the process transforms it and stores the result in a data store. This is textbook correct.'",
        "",
        "Why the distractors are wrong:",
        "A: 'Validate Student Record' IS named correctly — it uses a verb phrase (verb + adjective + noun). Processes MUST use verb phrases, not nouns. 'Student Record' alone would be the violation.",
        "B: External entities absolutely CAN send data flows to processes. That is precisely their function as data sources in a DFD.",
        "D: Data stores absolutely CAN receive data from processes. That is how data gets persisted.",
        "",
        "The real violation to reinforce: 'An arrow directly from an external entity to another external entity or directly to a data store — bypassing a process entirely — THAT is a DFD violation. All data flows must pass through a process.'",
        "",
        "Extension task: 'Draw this fragment in your workbook. Now add one more external entity and one more data flow that would make logical sense for a student management system. Apply all naming rules correctly.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 46,
      "title": "Knowledge Check 3 of 3",
      "learnerView": {
        "subtitle": "Session Quiz | Information Systems Analysis"
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 46 of 47",
        "Title: Knowledge Check 3 of 3",
        "",
        "Facilitator notes:",
        "Question: A CET campus is building a new student registration portal. Requirements change frequently as stakeholders add ideas. The team is small — four developers. Early delivery of working features is important to build stakeholder confidence.",
        "",
        "Which development approach is MOST suitable?",
        "A) Traditional Waterfall SDLC with strict phase sign-offs and full documentation before coding begins.",
        "B) Agile (Scrum) with iterative two-week sprints and stakeholder review after each sprint.",
        "C) CASE-supported development with automated code generation tools.",
        "D) Fixed-price outsource contract to an external vendor with a locked scope.",
        "",
        "Do NOT read the correct answer. Wait for learners to respond.",
        "",
        "Correct answer: B.",
        "",
        "Reasoning to explain after the reveal: 'Four Agile indicators are present in this scenario: evolving requirements, small team, need for early delivery, and stakeholder confidence building through visible progress. Scrum's sprint cycle delivers working features frequently, accommodates changing requirements without costly phase restarts, and builds stakeholder trust through regular demos of working software.'",
        "",
        "Why the distractors are wrong:",
        "A: Waterfall is rigid. When requirements change after a phase is signed off, the cost of revisiting earlier phases is disproportionate. Waterfall is optimised for stability, not change.",
        "C: CASE tools address productivity and documentation automation, not the requirement instability problem. They are a tooling choice, not a methodology answer.",
        "D: A fixed-price outsource contract is the worst possible match for unstable scope. When requirements change, fixed-price contracts become expensive renegotiations or result in a system that does not meet current needs.",
        "",
        "Challenge question to close: 'What would need to be DIFFERENT about this scenario for Waterfall to become the right answer?' Expected: stable, fully-documented, approved requirements; regulatory compliance framework that mandates sequential sign-offs; large team with specialised phases; no expectation of requirement change; long timeline with predictable milestones.",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 47,
      "title": "Session Wrap-Up",
      "learnerView": {
        "subtitle": "Key takeaways from today — Module 14924",
        "onScreenContent": [
          "–  Explain the role of information systems analysis within the Software Development Life Cycle.",
          "–  Describe the key responsibilities of an information systems analyst.",
          "–  Identify and apply common information-gathering and fact-finding techniques.",
          "–  Distinguish between Systems Analysis and Requirements Analysis.",
          "–  Describe industry-standard systems analysis techniques: DFDs, structured analysis, OO analysis.",
          "–  Compare and justify development approaches: Waterfall, Agile, JAD, RAD, DevOps."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 47 of 47",
        "Title: Session Wrap-Up",
        "",
        "Facilitator notes:",
        "Close-out script — 5 to 7 minutes. Do not rush this:",
        "",
        "Say clearly: 'Today we moved from intuition to structured analysis. Before this morning, analysis might have meant asking a few questions and then starting to code. Now you know it means something specific: defining a system problem precisely, gathering facts through multiple lenses, modelling data movement visually, and justifying a development approach — all before a single line of code is written. That is the professional standard. That is what this unit prepares your students for.'",
        "",
        "Rapid recall — four different learners, one question each. Do not let the same person answer twice:",
        "1) 'Explain what the SDLC is and why it exists — one sentence.'",
        "2) 'Name one fact-finding technique and describe the specific scenario where it is the best choice.'",
        "3) 'What is the structural difference between a Context Diagram and Diagram 0?'",
        "4) 'Give two project characteristics that would make Agile a better choice than Waterfall.'",
        "",
        "After each answer: do not immediately correct or expand. Ask the room first: 'Does anyone want to add to that or challenge it?' Only then clarify if the answer is materially incomplete.",
        "",
        "Visual consolidation: return to the board map from this morning — Problem | Requirements | Models | Recommendation. Ask learners to place one concept under each heading. They build the summary, not you.",
        "",
        "Before dismissal — three reminders, said once:",
        "1. 'Complete all workbook activities tonight. Every DFD practice page is a PoE evidence item. Do not discard them.'",
        "2. 'Bring one real workplace system issue tomorrow. We will use it for live analysis practice in the morning opening activity.'",
        "3. 'Sign the attendance register before you leave — this is PoE evidence for your own learning record today.'",
        "",
        "Final line: 'Research consistently shows that more than 70% of failed IT projects cite poor analysis as the root cause. Not bad code. Not hardware failure. Poor analysis. You are now equipped to prevent that failure — in your own professional practice and in the practice of every student you teach from this point forward.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    }
  ],
  "module14924PresentationFlow": {
    "preSessionSlides": [
      {
        "title": "Before SDLC: System Analysis Starts With 3 Questions",
        "subtitle": "Structured diagnosis before lifecycle methods",
        "bullets": [
          "What is happening now? Establish the current reality with evidence, not assumptions.",
          "Why is it happening? Identify root causes across components, input/output quality, processes, and feedback loops.",
          "What must change? Define improvement outcomes before selecting technology or implementation methods.",
          "System lens: Components, Input/Output, Processes, Feedback. This is the analysis vocabulary for Unit 1.",
          "Why it matters: disciplined diagnosis reduces rework, cost, and failed implementations."
        ],
        "speakerNote": [
          "Open with the definition: System Analysis is the structured process of studying a system to understand how it works today, where the problems are, and what must improve before we design or build anything.",
          "",
          "For each component, use the explain–example–implication structure:",
          "",
          "Components: 'The parts of the system and how they relate. In a student registration system: the student portal, the database, the admin console, the SMS notification service, and the approval process of the clerk. Miss one component, miss its dependencies. Changes to the database break the portal. Miss it — break it.'",
          "",
          "Input and Output: 'What enters and what is produced. GIGO. Bad input creates bad output even with perfect processing logic. The analyst must trace quality on both sides.'",
          "",
          "Processes: 'The ordered activities from input to output. Process mapping exposes the invisible: the step where three people re-capture the same data, the approval that waits three days because nobody owns it.'",
          "",
          "Feedback Loops: 'Information from outputs that adjusts future inputs. Without them, systems repeat mistakes indefinitely. Ask: what feedback loop is broken in your attendance system right now?'",
          "",
          "Facilitator prompt: 'Name one system at your campus. Identify one component, one input, one process, one output, and one feedback loop that is either missing or broken.'",
          "",
          "Draw AS-IS vs TO-BE on board.",
          "",
          "Transition: 'The SDLC gives us the lifecycle to execute improvements in a controlled way. But first — why does any system need a lifecycle at all?'",
        ].join("\n"),
        "phaseCards": [
          "Components",
          "Input & Output",
          "Processes",
          "Feedback Loops"
        ]
      },
      {
        "title": "Adam's Story: Why We Need an SDLC",
        "subtitle": "The structured path from idea to stable delivery",
        "bullets": [
          "Any system — an online store, a student portal, an attendance tracker — needs a structured path from idea to reliable operation.",
          "Without a lifecycle, teams jump from idea to code, skip requirements, miss stakeholders, and spend more fixing mistakes than building features.",
          "Adam's online store is one example. The system your students will build for their capstone is another. The lifecycle logic is identical."
        ],
        "speakerNote": [
          "Walk the phase cards left to right — one clear line each:",
          "— Planning: 'Agree on purpose, boundaries, success criteria, and timeline before any work begins.'",
          "— Requirements Analysis: 'Define precisely what users and stakeholders need the system to do. This becomes the contract for everything that follows.'",
          "— Design: 'Decide the structure before building anything.'",
          "— Implementation: 'Build according to the agreed design. No improvisation.'",
          "— Testing: 'Verify that the system behaves correctly before releasing to real users.'",
          "— Deployment and Maintenance: 'Run live. Fix issues. Continuously improve.'",
          "",
          "Key clarification: 'The point is not Adam's business — it is the journey from idea to reliable operation. Every system your students build follows this path. Know it well enough to guide them through every phase.'",
          "",
          "Transition: 'Let us now unpack each SDLC phase in detail, then compare how different methodologies execute them.'",
        ].join("\n"),
        "phaseCards": [
          "Planning",
          "Requirements Analysis",
          "Design",
          "Implementation",
          "Testing",
          "Deployment & Maintenance"
        ]
      }
    ],
    "session1Insertions": {
      "afterSdlc": {
        "title": "The SDLC Backbone: How Methodologies Walk It",
        "subtitle": "SDLC is the backbone — methodology is how you walk it",
        "bullets": [
          "Waterfall: strong sequential phase gates — best when requirements are stable, well-defined, and compliance-critical.",
          "Agile: iterative sprints with stakeholder review after each cycle — best when requirements evolve and delivery speed matters.",
          "DevOps: automates build, test, and deploy pipelines with continuous monitoring and fast feedback loops.",
          "All three execute the same SDLC logic: plan, define, design, build, validate, release, maintain."
        ],
        "speakerNote": [
          "This slide comes AFTER SDLC detail. Learners must understand the lifecycle before seeing how methods execute it.",
          "",
          "Key line — say this clearly: 'Different methods. Same lifecycle backbone. The SDLC is not one of the methods. It is the underlying structure that all methods implement.'",
          "",
          "Waterfall: 'Sequential gates. Formal sign-offs. Heavy documentation. Best for regulated, stable-requirement projects.'",
          "Agile: 'Iterative sprint loops. Working software every two weeks. Continuous user feedback. Best for evolving requirements and fast delivery.'",
          "DevOps: 'Continuous delivery and monitoring. Code tested and released multiple times per day. Best for post-go-live, high-frequency update environments.'",
          "",
          "Ask: 'For a SETA compliance reporting system with fixed legal requirements — which method? For a student mobile app where features change every semester — which method? Why does your answer differ?'",
          "",
          "Transition: 'With methodology context clear, we move into the analysis phase itself.'",
        ].join("\n"),
        "phaseCards": [
          "Waterfall",
          "Agile",
          "DevOps"
        ]
      }
    }
  },
  "module14924FlowMap": [
    {
      "placement": "Pre-session (before Session 1 starts)",
      "title": "Before SDLC: System Analysis Starts With 3 Questions"
    },
    {
      "placement": "Pre-session (before Session 1 starts)",
      "title": "Adam's Story: Why We Need an SDLC"
    },
    {
      "placement": "Session 1 (inserted after SDLC section)",
      "title": "The SDLC Backbone: How Methodologies Walk It"
    }
  ]
};

export default module14924Data;
