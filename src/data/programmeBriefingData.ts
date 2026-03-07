const programmeBriefingData = {
  programmeBriefingSlides: [
    {
      type: "title",
      title: "Welcome to Information Technology:\nSystems Development",
      subtitle:
        "FETC · SAQA 78965 · NQF Level 4 · 165 Credits · 15 Days · 3 Blocks",
      body: "Programme Briefing",
      speakerNotes: [
        "Welcome everyone. Before we open any unit content, we spend a few minutes orienting: what this qualification is, what you will be able to do by the end, and why it matters for your learners and your professional practice.",
        "Ensure attendance registers are signed and PoE folders are distributed now — this session is short and we want full attention once we begin.",
        "Tone to set: energetic and forward-looking. This is not a compliance exercise — it is the opening of a 15-day journey that changes how these lecturers teach systems thinking.",
      ],
    },
    {
      type: "content",
      title: "Meet Your Facilitator",
      subtitle: "Who you'll be learning with",
      bullets: [
        "Kabelo Matlakala — Scrum Master, Data Science Academy",
        "BSc Mathematical Sciences, University of Limpopo",
        "Software Development background",
        "Email: matlakalakabelo1@gmail.com",
        "Mobile: +27 72 713 8367",
      ],
      highlight: "Based in Limpopo Province, South Africa",
      speakerNotes: [
        "Keep this brief — 2 minutes maximum. Mention your background in both software development and systems analysis. The credibility point matters: learners need to see that this content is grounded in real professional practice, not just academic theory.",
        "Optional: share one real project you have worked on that required both analysis and development skills. One sentence is enough. It anchors your authority early.",
      ],
    },
    {
      type: "content",
      title: "What is Information Technology?",
      subtitle: "The invisible infrastructure every organisation depends on",
      bullets: [
        "IT is the combination of hardware and software products and services that organisations use to manage, access, communicate, and share information",
        "IT is not just computers — it underpins every business function",
        "Force 1 — Changes in the world: globalisation, remote work",
        "Force 2 — Changes in technology: cloud computing, AI",
        "Force 3 — Changes in client demand: systems must be faster",
      ],
      highlight:
        "You will learn to design, build, and maintain IT systems organisations rely on.",
      speakerNotes: [
        "1) Start with a simple definition of IT:\n- Information Technology (IT) is the combination of hardware and software organisations use to store, process, communicate, and share information.\n- Hardware -> physical devices (computers, servers, networks).\n- Software -> programs and systems that run on those devices.",
        "Example explanation:\n- IT is not just computers; it supports communication, data storage, customer systems, accounting, and decision-making.\n- Examples learners already know: email, online banking, databases, and cloud storage.",
        "2) Ask a context question:\n- Ask: 'Name one IT system your institution depends on that would cause serious disruption if it went down for a full day.'\n- Use responses (student records, payroll, logistics, service delivery) to transition into the three forces.",
        "3) The three forces driving IT change:\n- Force 1: Changes in the world (globalisation, remote work).\n- Force 2: Changes in technology (cloud computing, AI).\n- Force 3: Changes in client demand (faster, always-on, convenient digital services).",
        "4) Explain each force briefly with examples:\n- Force 1 (world): organisations operate across locations, so systems must enable communication and access from anywhere.\n- Force 2 (technology): cloud and AI improve speed and automation, so organisations must modernise to stay competitive.\n- Force 3 (demand): clients expect fast, reliable, mobile, and 24/7 services, so systems must be responsive and available.",
        "5) Very short summary (exam-friendly):\n- IT = hardware + software used to store, process, and share information.\n- World changes require connected systems.\n- Technology changes require upgraded systems.\n- Client demand requires faster, better digital services.",
        "6) Facilitation note:\n- Keep this to about 4 minutes. Keep it motivation-level, not deep technical teaching.",
      ],
    },
    {
      type: "content",
      title: "What is a System?",
      subtitle: "A vocabulary frame — we will apply this properly in Unit 1",
      bullets: [
        "A system is an organised set of interrelated components working together toward a defined goal",
        "An information system collects, processes, stores and distributes data to support operations and decisions",
        "Every information system follows one structural pattern: Input → Process → Storage → Output",
        "Example: a student registration portal captures enrolment data, checks eligibility, generates student numbers, and updates timetables",
      ],
      highlight:
        "Carry four words into Unit 1: Components, Input/Output, Processes, and Feedback.",
      speakerNotes: [
        "This slide is just introducing vocabulary. We are not doing full system analysis yet — that happens in Unit 1.",

        "2️⃣ Explain the idea of a system simply",
        "A system is simply a set of parts that work together to achieve a goal.",
        "In IT, those parts could be software, databases, users, or devices.",
        "The key idea is that the parts interact with each other to produce a result.",

        "3️⃣ Briefly explain an Information System",
        "An information system is a system that deals specifically with data and information.",
        "It collects data (input), processes it, stores it, and produces output that helps people make decisions or perform tasks.",

        "4️⃣ Mention the system pattern",
        "Most information systems follow a basic structure:",
        "Input → Process → Storage → Output.",
        "Data goes in, the system works on it, stores it if necessary, and produces results.",

        "5️⃣Give the example (very briefly)",
        "For example, a student registration portal takes in enrolment data, checks whether a student qualifies, generates a student number, and updates the timetable",

        "6️⃣ Ask the quick interaction question",
        "Quick question: can someone name an IT system you use at CET every day?",
        "What does it take in as input, and what does it produce as output?",
        "---- We’ll analyse systems like that properly in Unit 1.",

        "7️⃣ End with the forward pointer",
        "For now, I want you to remember four words:",
        "Components, Input/Output, Processes, and Feedback.",
      ],
    },
    {
      type: "content",
      title: "What is Systems Development?",
      subtitle: "6 phases — coding is only phase 4",
      bullets: [
        "Investigation — Identify and confirm the business problem",
        "Analysis — Establish exactly WHAT the system must do",
        "Design — Specify HOW it will work: architecture, data structures, module structure, user interfaces",
        "Development — Write and unit-test the code",
        "Implementation — Deploy, manage the transition to live operation",
        "Maintenance — Monitor for defects, fixes and plan future iterations",
      ],
      highlight:
        "Coding is phase 4. Strong analysis and design come first to avoid building the wrong solution.",
      speakerNotes: [
        "When people hear systems development, they usually think about coding.",
        "But coding is actually only one phase in a much bigger process.",
        "-Investigation-",
        "First we identify the business problem. What exactly needs to be fixed or improved?",
        "-Analysis-",
        "Then we analyse the requirements — this is where we determine what the system must do.",
        "-Design-",
        "Next comes design, where we decide how the system will work — the architecture, data structures, and interfaces.",
        "-Development-",
        "Only after that do developers start writing the code and testing it.",
        "-Implementation-",
        "Once the system is ready, it is deployed and users are trained to use it.",
        "-Maintenance-",
        "Finally, the system is monitored, bugs are fixed, and improvements are planned.",
        
        "------",
        "Strong analysis and design must happen first — otherwise you risk building the wrong system.",
        "“In Unit 1 we will study this lifecycle in detail. By the end of the session you’ll be able to explain each phase and what happens when one is skipped.”",
      ],
    },
    {
      type: "content",
      title: "Systems Development vs Software Development",
      subtitle: "Different scopes — deeply connected",
      bullets: [
        "Software Development — design, write, test, and deploy software artefacts",
        "Systems Development — people, process, data, technology AND code",
        "Software development is a SUBSET that sits inside systems development",
        "The analyst determines WHAT to build and WHY · The developer determines HOW to build it",
        "In this qualification: you will think like an analyst AND write like a developer",
      ],
      highlight:
        "Systems development frames the full solution; software development builds the code within it.",
      speakerNotes: [
        "Another common misunderstanding is thinking systems development and software development are the same thing. They’re related, but not identical.",
        "-Software Development-",
        "Software development focuses on building the software itself — writing code, testing it, and deploying it.",
        "-Systems Development-",
        "Systems development is broader. It includes the people, the processes, the data, the technology, and the software.",
        "--So you can think of software development as a subset inside systems development",
        "A complete IT professional needs both skills."
      ],
    },
    {
      type: "content",
      title: "Why Does This Qualification Matter?",
      subtitle: "Four reasons anchored in South African IT",
      bullets: [
        "Organisations run on systems — every business function depends on reliable information systems that someone designed and built",
        "Poor analysis = expensive failures — most IT project failures trace to misunderstood requirements, not bad code (Standish CHAOS Report)",
        "NQF Level 4 opens careers — analyst, developer, BA support and project coordination roles are in demand across SA government and industry",
        "Professional practice modelling — structured thinking (analyse → design → build) is the standard the workplace expects and the standard you will model for your learners",
      ],
      highlight:
        "This qualification prepares you for real roles in analysis, development, and project delivery.",
      speakerNotes: [
        "Every modern organisation runs on information systems",
        "— banking systems, hospital systems, government systems, education systems.",
        "----",
        "When systems are poorly designed, they can fail in very expensive ways. Research like the Standish CHAOS Report shows that most project failures happen because requirements were misunderstood, not because developers wrote bad code.",
         "----",
        "This qualification is positioned at NQF Level 4, which is preparation for roles such as junior systems analyst, developer, business analysis support, or project coordination.",
        "----",
        "More importantly, it teaches a structured way of thinking - as a stadard approach used across the IT industry."
      ],
    },
    {
      type: "content",
      title: "Your 10-Module Roadmap",
      subtitle: "15 days · 3 blocks · 56 credits delivered",
      bullets: [
        "Block 1 · Days 1–5 · Foundations (23 credits): Systems Analysis (today), Team Collaboration, Programming Principles, Problem Solving, Design",
        "Block 2 · Days 6–9 · Applied Programming (14 credits): Apply Programming Principles, Web Scripting",
        "Block 3 · Days 11–13 · Systems in Practice (19 credits): Testing IT Systems, Resolve User Problems, Work as Project Team Member",
        "Each unit ends with a quiz, and each block ends with one combined assessment",
      ],
      highlight:
        "You complete 56 credits in 15 days; remaining credits toward 165 come through PoE workplace evidence.",
      speakerNotes: [
        "Before we start Unit 1, I want you to see the overall structure of the programme so you know where today fits in.",
        "Block 1 – Foundations",
        "The first block, which runs over the first five days, focuses on the foundations of systems development — systems analysis, collaboration, programming principles, problem solving, and design.",
        "Block 2 – Applied Programming",
        "The second block moves into applied programming, where you begin implementing those principles in code and web scripting.",
        "Block 3 – Systems in Practice",
        "The final block focuses on real-world systems work — testing systems, resolving user problems, and working as part of a project team."
      ],
    },
    {
      type: "summary",
      title: "Ready to Begin",
      subtitle: "Briefing complete — Unit 1 opens now",
      bullets: [
        "✓  You know what Information Technology is and the three forces shaping it",
        "✓  You have the vocabulary frame for systems: components, input/output, processes, feedback",
        "✓  You can name the 6 phases of Systems Development and why coding is only phase 4",
        "✓  You understand the distinction between systems development and software development",
        "✓  You know your 10-module roadmap across 3 blocks",
        "✓  You know how to reach your facilitator between sessions",
      ],
      highlight:
        "Briefing done. Unit 1 now builds practical systems analysis language, tools, and habits.",
      speakerNotes: [
        "Pause for genuine Q&A — 3 to 5 minutes maximum. Answer only orientation questions here. Any content question ('what exactly is a DFD?', 'how does Agile work?') gets deferred: 'That is a great question — and exactly what Unit 1 covers. Let us get into it.'",
        "Then navigate to Unit 1 and open with the title slide.",
        "Handoff line to say clearly: 'The briefing gave you the map. Unit 1 gives you the first destination in depth. Everything we named in the briefing — systems, lifecycle, analysis vs development — we are now going to examine properly. Let us begin.'",
      ],
    },
  ],
} as const;

export default programmeBriefingData;
