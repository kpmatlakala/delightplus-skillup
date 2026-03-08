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
        "Slide 1 of 41",
        "Title: Information Systems Analysis",
        "",
        "Facilitator notes:",
        "Welcome learners and set the tone immediately.",
        "",
        "Opening line: 'Today we think like analysts before we code like developers. Our job is not to jump to a solution — it is to understand the problem so precisely that the right solution becomes obvious.'",

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
        "Slide 2 of 41",
        "Title: Unit Purpose & Learning Outcomes",
        "",
        "Facilitator notes:",
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
        "Slide 3 of 41",
        "Title: What Is a System?",
        "",
        "Facilitator notes:",
        "System - a set of components that work together to achieve a purpose.-",
        "",
        "Now the question becomes: how do we examine that system to understand problems and improve it?",
        "That is where system analysis begins.",

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
        "Slide 4 of 41",
        "Title: Adam Wants to Open an Online Store",
        "",
        "Facilitator notes:",
        "",
        "Story hook:",
        "'Adam wants to open an online store to sell sneakers. He calls his developer friend and says: Just build me a website.'",
        "'The developer replies: Okay… but how should the system actually work?",
        "",
        "Question is:",
        "- How will customers pay?",
        "- Who manages stock?",
        "- What happens if payment fails?",
        "- How do orders get delivered?",
        "",
        "Use the teaching line:",
        "'This is exactly where system analysis begins...",
        "Before building anything, we must understand the system itself.'",

      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 5,
      "title": "Understanding Adam’s System",
      "learnerView": {
        "subtitle": "Looking at the system before building it",
        "onScreenContent": [
          "Analysts first identify the components of the system -- customers, products, payments, delivery, support.",
          "Analysts then examine inputs and outputs"

        ],
        "body": "These steps form the Software Development Life Cycle (SDLC): the structured path from idea to reliable operation."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 5 of 41",
        "Title: How Adam's Store Gets Built",
        "",
        "Facilitator notes:",
        "The first thing analysts identify is the components — the parts that make up the system.",
        "",
        "Components include: Customers, ",
        "Adam as the store owner",
        "The online store website",
        "The product database",
        "The payment system",
        "The delivery service",

        "If analysts miss one component — for example the delivery company — the system design may fail later",
        "",
        "Can anyone think of another component Adam might need?",
        "customer support, inventory management, email notification system",
        "",
        "Inputs and Outputs:",
        "information systems: Garbage In, Garbage Out.",
        "If incorrect data enters the system, the outputs will also be incorrect.",
        "",
        "If a customer enters the wrong delivery address, the system will still process the order — but the package will go to the wrong place.",
        "",
        "By identifying components, inputs, and outputs, analysts start to understand how the system works. -- But to fully understand a system, we must also study the processes and feedback inside the system."
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
          "Use the system lens to answer those questions: Adam’s store identified",

        ],
        "phaseCards": [
          "Components",
          "Inputs & Outputs",
          "Processes",
          "Feedback Loops",
        ],
        "body": ""
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 6 of 41",
        "Title: 1.0 Introduction to System Analysis",
        "",
        "Facilitator notes:",
        "System analysis is a structured way of studying a system before building or improving it",
        "",
        "good projects always start with understanding the problem first.",
        "",
        "1️⃣ What is happening now? Understand how the current system works.",
        "2️⃣ Why is it happening? Identify the root causes of problems.",
        "3️⃣ What must change? Define improvements the system should make.",
        "",
        "System analysis is really about asking the right questions before proposing solutions.",
        "",
        "Teaching prompt: 'If you had to analyse a system you have never seen before, what is the first question you would ask?'",
        "Common answers: 'Who uses it?', 'What does it produce?', and 'Where does the data come from?'",
        "All are valid because each maps to a core system dimension.",
        "",
        "System analysis compares the current system (AS-IS) with the future improved system (TO-BE).",
        "The gap between them becomes the system requirements.",
        "",

      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 7,
      "title": "1.0 Introduction to System Analysis (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Why System Analysis Matters",
        "onScreenContent": [
          "Efficiency - identifying bottlenecks, redundant steps, and unnecessary complexity in current processes.",
          "Cost - improving resource usage and preventing expensive rework caused by misunderstood requirements.",
          "Quality - improving the reliability of system outputs by catching design and logic problems before they are built into the system.",
          "Innovation - supporting structured problem-solving rather than reactive trial and error."
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 7 of 41",
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
      "title": "1.1 SDLC Flow",
      "learnerView": {
        "subtitle": "Session 1 | Analyst Thinking + SDLC Lifecycle",
        "onScreenContent": [ ],
        "phaseCards": [
          "Identify & Boundaries / Feasibility",
          "Gather Info / Requirements",
          "Model / Logical Design",
          "Analyse / Physical Design",
          "Propose Options / Implementation",
          "Implement / Testing",
          "Test & Monitor / Deployment",
          "Iterate / Maintenance"
        ],
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 8 of 41",
        "Title: 1.1 SDLC Flow",
        "",
        "Purpose:",
        "Use one visual to connect analyst-centric thinking steps with formal SDLC project stages.",
        "",
        "Explain:",
        "'Each card has two parts: the first shows how analysts think; the second shows how organisations manage the same work through SDLC stages and deliverables.'",
        "",
        "Use Adam's store example card-by-card:",
        "- Identify & Boundaries / Feasibility: Define the store scope and decide whether the project is worth doing.",
        "- Gather Info / Requirements: Capture features — catalogue, cart, checkout, payments, delivery.",
        "- Model / Logical Design: Represent flows, entities, and interactions conceptually.",
        "- Analyse / Physical Design: Select technical architecture, stack, and data structures.",
        "- Propose Options / Implementation: Choose the best option and begin building.",
        "- Implement / Testing: Validate payments, stock updates, and order processing.",
        "- Test & Monitor / Deployment: Launch, monitor behaviour, and stabilise operations.",
        "- Iterate / Maintenance: Improve, fix, and scale as business needs evolve.",
        "",
        "Key message:",
        "'System analysis and SDLC are not competing models — they are two views of one disciplined process: thinking clearly, then delivering reliably.'",
        "",
        "Transition:",
        "'Now we move into methodology choices — Waterfall, Agile, and DevOps — which all walk this same backbone at different rhythms.'"
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 9,
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
        "Slide 9 of 41",
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
      "slideNumber": 10,
      "title": "1.1 SDLC Models: Waterfall, Agile, and DevOps",
      "learnerView": {
        "subtitle": "Session 1 | The SDLC Backbone and Methodologies",
        "onScreenContent": [
          "Waterfall | Sequential phase-by-phase progression | Best for stable requirements and regulated projects | Low flexibility when requirements change late",
          "Agile | Iterative sprints with frequent stakeholder review | Best for evolving requirements and fast delivery | Requires active user participation",
          "DevOps | Continuous integration, automated testing, and deployment | Best for high-frequency releases | Requires automation maturity and shared Dev/Ops culture",
          "All three follow the same SDLC logic: plan, define, design, build, validate, release, maintain",
        ],
        
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 10 of 41",
        "Title: 1.1 SDLC Models: Waterfall, Agile, and DevOps",
        "",
        "Purpose of this slide:",
        "Unify SDLC methodology concepts and show how teams move through phases differently depending on context.",
        "",
        "Facilitation flow:",
        "1) Explain each model in one sentence — plain language, no acronyms first pass.",
        "2) Apply Adam's store scenario: 'Adam's initial build used Waterfall — fixed requirements and predictability. After launch, Agile was used for iterative feature updates. Today, DevOps CI/CD handles continuous deployment.'",
        "3) Check: ask learners which methodology they would recommend for a new student management system at CET and why. Emphasize reasoning over the answer.",
        "",
        "Visual suggestion: draw on board —",
        "- Waterfall: straight horizontal arrow through phases",
        "- Agile: overlapping sprint loops",
        "- DevOps: continuous circular pipeline",
        "Contrast shows methodology execution while SDLC phases stay the same.",
        "",
        "Transition:",
        "'Next, we focus on the analysis phase itself — what systems analysis establishes before design begins.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 11,
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
        "Slide 11 of 41",
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
      "slideNumber": 12,
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
        "Slide 12 of 41",
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
      "slideNumber": 13,
      "title": "1.3 Feasibility Study (cont.)",
      "learnerView": {
        "subtitle": "Session 1 | Tangible and Intangible Costs and Benefits",
        "phaseCards": [
          "Tangible Benefits",
          "Intangible Benefits",
          "Tangible Costs",
          "Intangible Costs"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 13 of 41",
        "Title: 1.3 Feasibility Study (cont.) — Tangible and Intangible",
        "",
        "Facilitator notes:",
        "Purpose: Cover cost-benefit classification in detail while keeping the slide uncluttered.",
        "",
        "Explain to learners:",
        "- Tangible Benefits: Faster processing speed, access to previously unavailable management information, reduced staff time on manual data capture, fewer errors in reporting.",
        "- Intangible Benefits: Improved decision-making quality, enhanced data accuracy and trust, stronger competitive position, better institutional image, increased staff and student satisfaction.",
        "- Tangible Costs: Hardware/infrastructure investment, software licences, analyst and developer person-days, staff salaries during transition and training, training and change management programme.",
        "- Intangible Costs: Loss of operational focus during transition, reputational risk if project is delayed or fails publicly, reduced decision quality while old and new systems co-exist, disruption to established working routines and institutional habits.",
        "",
        "Activity suggestion:",
        "Classify these items as tangible benefit, intangible benefit, tangible cost, or intangible cost:",
        "1) 'Three-day training programme for 20 lecturers on the new LMS' → Tangible cost",
        "2) 'Improved lecturer satisfaction scores in the annual staff survey' → Intangible benefit",
        "3) 'Server upgrade required to run the new system' → Tangible cost",
        "4) 'Staff resistance and morale drop during the transition period' → Intangible cost",
        "",
        "Key insight: Intangible costs are often underestimated in proposals because they do not appear on invoices and are hard to quantify before the event. Poorly managed transitions can cost more in lost productivity than the system itself. A proper feasibility study surfaces them in advance.",
        "",
        "Transition: 'Feasibility established that we should proceed. Next, requirements analysis defines precisely what we are building.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 14,
      "title": "1.4 Requirements Analysis",
      "learnerView": {
        "subtitle": "Session 1 | Introduction to Information Systems Analysis",
        "onScreenContent": [
          "Asking the users directly: interviews for depth and context; questionnaires for breadth, scale, and anonymity.",
          "Deriving from an existing system: analysing current data flows, documents, reports, forms, and system outputs.",
          "Deriving from the business domain: Business Systems Planning, critical success factor analysis, benchmarking against comparable institutions.",
          "Experimenting with prototypes: build a rough version and let users react to something concrete rather than abstract descriptions."
        ],
        
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 14 of 41",
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
      "slideNumber": 15,
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
        "Slide 15 of 41",
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
      "slideNumber": 16,
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
        "Slide 16 of 41",
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
      "slideNumber": 17,
      "title": "1.5 Role of the Systems Analyst",
      "learnerView": {
        "subtitle": "Session 1 | Introduction to Information Systems Analysis",
        "onScreenContent": [
          "Consultant — Works as an outside expert hired to address a specific business problem. Brings an independent perspective and specialist knowledge the organisation does not have internally.",
          "Supporting Expert — Provides internal specialist assistance to a project team. Advises on IT capabilities and guides technical decisions without taking ownership of the project outcome.",
          "Agent of Change — Facilitates and drives organisational transformation. Analyses how work is currently done, proposes improvements, and guides the organisation through adopting the new solution.",
          "Problem Solver — Breaks complex business problems into manageable parts, identifies root causes, and develops systematic, practical solutions that can be built, tested, and maintained."
        ],
        
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 17 of 41",
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
        
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 18,
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
        "Slide 18 of 41",
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
      "slideNumber": 19,
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
        "Slide 19 of 41",
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
      "slideNumber": 20,
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
        "Slide 20 of 41",
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
      "slideNumber": 21,
      "title": "1.2 Diagnosing Systems Through Components",
      "learnerView": {
        "subtitle": "Session 1 | Diagnosing Systems Through Components",
        "phaseCards": [
          "Hardware",
          "Software",
          "Data",
          "Processes",
          "People"
        ],
        "body": "Every information system is made up of five interdependent components. Analysts use this lens to identify root causes and avoid misdiagnosis."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 21 of 41",
        "Title: 1.2 Diagnosing Systems Through Components",
        "",
        "Purpose: Introduce the five key components of any information system and explain why understanding them helps analysts pinpoint issues.",
        "",
        "Facilitator explanation for each card:",
        "- Hardware: The physical layer, e.g., servers, workstations, network equipment, and I/O devices. Capacity generally improves over time (Moore’s Law).",
        "- Software: Includes system software that manages hardware and application software that performs business tasks. Systems can be horizontal (generic), vertical (industry-specific), or legacy (older systems still running).",
        "- Data: The raw material stored in tables. Data = facts; information = data processed into something useful for decision-making.",
        "- Processes: Business tasks that transform data into information. Defines how data is captured, validated, transformed, and reported.",
        "- People: Users, administrators, managers — success depends on adoption, training, and how people interact with the system.",
        "",
        "Key teaching line: 'A system is only as strong as the weakest component. Ignoring any one of these five can lead to failure.'",
        "",
        "Transition: 'With these components in mind, we can analyze existing systems more effectively and propose meaningful improvements.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 22,
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
        "Slide 22 of 41",
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
      "slideNumber": 23,
      "title": "2.1 Fact-Finding Methods",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "cards": [
          "Interviews",
          "Questionnaires",
          "Document Review",
          "Observation",
          "Prototyping"
        ],
        "body": "Fact-finding methods help analysts gather accurate and complete information about the system and its users."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 23 of 41",
        "Title: 2.1 Fact-Finding Methods",
        "",
        "Purpose: Introduce the main information-gathering techniques and when to use each.",
        "",
        "Interviews: real-time dialogue with one respondent. Allows depth, follow-ups, uncovering unstated assumptions.",
        "Questionnaires: self-administered surveys. Economical at scale, anonymous, but limited depth.",
        "Document Review: analyse existing manuals, reports, and system logs to extract facts.",
        "Observation: watch the system in action to see what people actually do versus what they say.",
        "Prototyping: create a working model to clarify requirements and collect feedback.",
        "",
        "Scenario: CET attendance system — use interviews to understand WHY lecturers bypass the system; questionnaires to efficiently reach all 150 lecturers across five campuses.",
        "Key teaching point: No single method suffices. Combine methods appropriately for each stakeholder and goal.",
        "",
        "Transition: 'Once information is gathered, we visualise it with a Data Flow Diagram (DFD).'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 24,
      "title": "2.1 Interview Types",
      "learnerView": {
        "subtitle": "Session 2 | Fact-Finding Techniques",
        "cards": [
          "Structured Interview",
          "Unstructured Interview",
          "Semi-Structured Interview"
        ],
        "body": "Different interview types balance consistency and depth. Analysts choose the type depending on the stakeholder and information needed."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 24 of 41",
        "Title: 2.1 Interview Types",
        "",
        "Structured: same questions in same order for all respondents. Easy to compare and analyse; less flexible.",
        "Unstructured: free conversation, follows the topic wherever it leads. Good for exploring complex or sensitive issues; harder to analyse.",
        "Semi-Structured: blend of both — core questions for consistency, with flexibility to dive deeper when needed.",
        "",
        "Scenario: DHET compliance officer → structured for legal accuracy; first-year lecturer → unstructured to understand workflow and frustrations.",
        "Key teaching point: Experienced analysts use combinations of fact-finding methods and interview types to balance depth, breadth, and reliability.",
        "",
        "Transition: 'Now that we understand how to gather information, we model it using Data Flow Diagrams.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 25,
      "title": "2.2 Data Flow Diagrams (DFDs)",
      "learnerView": {
        "subtitle": "Session 2 | Visualising System Processes",
        "cards": [
          "External Entity",
          "Data Flow",
          "Process",
          "Data Store"
        ],
        "body": "DFDs graphically show how data moves through a system, what transforms it, and where it is stored — without showing detailed program logic."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 25 of 41",
        "Title: 2.2 Data Flow Diagrams (DFDs)",
        "",
        "External Entity: outside the system, sends or receives data. Named with a NOUN.",
        "Data Flow: arrow showing movement of data between components. Named with a NOUN describing the data.",
        "Process: transforms inputs to outputs. Named with a verb phrase. Represents business logic; 'black box' at DFD level.",
        "Data Store: repository for data. Named with NOUN plus reference number (D1, D2...).",
        "",
        "Demonstration: CET Attendance DFD — lecturer submits data, process transforms it, data store holds it, report goes to admin. Draw live on board.",
        "Common mistakes to warn against: naming processes with nouns only, arrows directly between external entities, missing data store references.",
        "",
        "Transition: 'Next we explore DFD levels: Context Diagram and Diagram 0, showing how detailed views relate to the overall system.'",
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 26,
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
        "Slide 26 of 41",
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
      "slideNumber": 27,
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
        "Slide 27 of 41",
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
      "slideNumber": 28,
      "title": "2.4 Object-Oriented Analysis",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "cards": [
          "Object",
          "Class",
          "Attribute",
          "Method"
        ],
        "body": "Object-oriented analysis views a system as interacting objects rather than as a sequence of processes transforming data."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 28 of 41",
        "Title: 2.4 Object-Oriented Analysis",
        "",
        "Purpose:",
        "Introduce the core concepts used in object-oriented systems analysis.",
        "",
        "Explain each card:",
        "Object — A real-world entity relevant to the system such as Student, Course, or Payment. An object represents a specific instance of a class.",
        "Class — A blueprint that defines the attributes and behaviours shared by all objects of that type.",
        "Attribute — A property that describes an object. Example: studentNumber, fullName, programme.",
        "Method — An action the object can perform. Methods are verbs such as calculateGPA() or generateTranscript().",
        "",
        "Example for CET:",
        "Class: Student",
        "Object: Kabelo Matlakala (studentNumber 20240023)",
        "Attributes: studentNumber, fullName, programme",
        "Methods: calculateGPA(), generateTranscript()",
        "",
        "Teaching analogy:",
        "Encapsulation is like a light switch — you flip the switch (method) without needing to understand the wiring behind the wall.",
        "",
        "Check for understanding:",
        "Ask learners to identify two objects, two attributes, and two methods for the CET Attendance System."
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 29,
      "title": "2.5 Systems Development Approaches",
      "learnerView": {
        "subtitle": "Session 2 | Systems Analysis Techniques",
        "cards": [
          "Traditional SDLC",
          "CASE-Supported Development",
          "Object-Oriented Development",
          "Agile Methods"
        ],
        "body": "Different development approaches suit different project contexts, requirement stability, and delivery timelines."
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 29 of 41",
        "Title: 2.5 Systems Development Approaches",
        "",
        "Purpose:",
        "Introduce the main approaches analysts can recommend for systems development.",
        "",
        "Explain each card:",
        "Traditional SDLC — Sequential phases with formal sign-off. Best for stable, well-defined systems such as accounting or government systems.",
        "CASE-Supported — Uses specialised software tools to assist analysis, design, documentation, and code generation.",
        "Object-Oriented Development — Builds systems around reusable classes and objects. Works well when requirements change frequently.",
        "Agile Methods — Focus on iterative delivery, working software, and continuous stakeholder feedback.",
        "",
        "Facilitation question:",
        "Ask learners which approach their institution most closely resembles and why.",
        "",
        "Teaching visual:",
        "Draw a quadrant on the board with axes:",
        "Requirement Stability (Low–High)",
        "Team Size (Small–Large)",
        "Place each development approach in the appropriate quadrant."
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 30,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Joint Application Development (JAD)",
        "cards": [
          "Collaborative Workshops",
          "User Participation",
          "Shared Requirements",
          "Facilitated Sessions"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 30 of 41",
        "Title: Joint Application Development (JAD)",
        "",
        "Purpose:",
        "Explain how JAD accelerates requirements gathering through structured workshops.",
        "",
        "Explanation:",
        "JAD replaces multiple one-on-one interviews with facilitated workshops where key users and IT staff work together to define system requirements.",
        "",
        "Advantages:",
        "Users participate directly, improving requirement accuracy.",
        "Shared understanding develops among stakeholders.",
        "Reduces back-and-forth clarification cycles.",
        "",
        "Disadvantages:",
        "Requires skilled facilitation.",
        "More expensive than interviews if many participants are involved.",
        "",
        "Experiential link:",
        "Explain that this classroom discussion format resembles a simplified JAD session.",
        "",
        "Key insight:",
        "People support what they helped to create."
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 31,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Rapid Application Development (RAD)",
        "cards": [
          "Rapid Prototyping",
          "Continuous User Feedback",
          "Iterative Development",
          "Faster Delivery"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 31 of 41",
        "Title: Rapid Application Development (RAD)",
        "",
        "Purpose:",
        "Explain how RAD shortens development time through iterative prototyping.",
        "",
        "Explanation:",
        "RAD emphasises building working prototypes quickly, gathering feedback, and refining the system through repeated cycles.",
        "",
        "Advantages:",
        "Faster development.",
        "Users see working screens early.",
        "Excellent for user-interface heavy systems.",
        "",
        "Disadvantages:",
        "Less time for architecture and design.",
        "Systems may become harder to maintain later.",
        "",
        "Discussion question:",
        "Ask learners to identify systems where RAD would be inappropriate (e.g., payroll, medical records, financial systems)."
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 32,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Agile Principles",
        "cards": [
          "Early Delivery",
          "Continuous Improvement",
          "Welcoming Change",
          "Customer Collaboration"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 32 of 41",
        "Title: Agile Principles",
        "",
        "Purpose:",
        "Introduce key Agile values guiding modern development teams.",
        "",
        "Explain each principle:",
        "Early Delivery — Deliver working software early and often.",
        "Continuous Improvement — Teams regularly reflect and improve processes.",
        "Welcoming Change — Changing requirements are expected and embraced.",
        "Customer Collaboration — Frequent interaction with users ensures the system solves the real problem.",
        "",
        "CET teaching link:",
        "Students should demonstrate working prototypes early in their projects rather than submitting only planning documents.",
        "",
        "Key message:",
        "Working software is the primary measure of progress."
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 33,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Agile Principles 3–6",
        "cards": [
          "Frequent Delivery",
          "Business–Developer Collaboration",
          "Motivated Teams",
          "Face-to-Face Communication"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 33 of 41",
        "Title: Agile Principles 3–6",
        "",
        "Explain each principle:",
        "",
        "Frequent Delivery:",
        "Deliver working software regularly in small increments rather than waiting months for a full release.",
        "",
        "Business–Developer Collaboration:",
        "Stakeholders and developers work together continuously, not only at the start or end of a project.",
        "",
        "Motivated Teams:",
        "Successful Agile projects rely on motivated individuals who are trusted to organise their work.",
        "",
        "Face-to-Face Communication:",
        "Direct conversation is the most effective way to share complex information.",
        "",
        "Teaching connection:",
        "Relate this to WIL projects where students work directly with employers and receive continuous feedback."
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 34,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Agile Principles 7–10",
        "cards": [
          "Working Software",
          "Sustainable Pace",
          "Technical Excellence",
          "Simplicity"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 34 of 41",
        "Title: Agile Principles 7–10",
        "",
        "Working Software:",
        "The main measure of progress is functioning software, not documentation or planning.",
        "",
        "Sustainable Pace:",
        "Teams should maintain a steady, manageable pace instead of relying on overtime and burnout.",
        "",
        "Technical Excellence:",
        "High-quality design and coding practices make systems easier to change and maintain.",
        "",
        "Simplicity:",
        "Build only what is necessary. Avoid unnecessary features or complexity.",
        "",
        "Teaching link:",
        "Remind learners that student PoE projects must demonstrate working prototypes."
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 35,
      "title": "2.5 Systems Development Approaches (cont.)",
      "learnerView": {
        "subtitle": "Session 2 | Agile Principles and DevOps",
        "cards": [
          "Self-Organising Teams",
          "Continuous Reflection",
          "Continuous Integration (CI)",
          "Continuous Deployment (CD)"
        ]
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 35 of 41",
        "Title: Final Agile Principles + DevOps",
        "",
        "Self-Organising Teams:",
        "The best solutions often emerge from teams that organise their own work rather than following strict top-down control.",
        "",
        "Continuous Reflection:",
        "Teams regularly review how they work and improve their processes.",
        "",
        "Continuous Integration (CI):",
        "Developers frequently merge code and automatically test it to detect problems early.",
        "",
        "Continuous Deployment (CD):",
        "Software can be released quickly because testing and deployment are automated.",
        "",
        "Teaching connection:",
        "For student projects, the key lesson is to keep the code in a working state and commit changes regularly using version control."
      ].join("\n"),
      "source": "Module14924 Enhanced v2"
    },
    {
      "slideNumber": 36,
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
        "Slide 36 of 41",
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
      "slideNumber": 37,
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
        "Slide 37 of 41",
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
      "slideNumber": 38,
      "title": "Knowledge Check 1 of 3",
      "learnerView": {
        "subtitle": "Session Quiz | Information Systems Analysis"
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 38 of 41",
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
      "slideNumber": 39,
      "title": "Knowledge Check 2 of 3",
      "learnerView": {
        "subtitle": "Session Quiz | Information Systems Analysis"
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 39 of 41",
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
      "slideNumber": 40,
      "title": "Knowledge Check 3 of 3",
      "learnerView": {
        "subtitle": "Session Quiz | Information Systems Analysis"
      },
      "facilitatorNotes": [
        "Facilitator Notes",
        "Slide 40 of 41",
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
      "slideNumber": 41,
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
        "Slide 41 of 41",
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
