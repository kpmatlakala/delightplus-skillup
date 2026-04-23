import type { ModuleLessonFlow } from "./moduleLessonFlows";

export const module14924LessonFlow: ModuleLessonFlow = {
    moduleId: "14924",
    saqa: "14924",
    introTitle: "Information Systems Analysis",
    introSummary: "Explore the systems development life cycle, the analyst's roles and responsibilities, information-gathering techniques, data flow diagrams, object-oriented analysis, and structured development approaches.",
    introBody: "This module introduces the discipline of information systems analysis � establishing what systems are, how they are developed, who the analyst is, and how to gather and model requirements. You will work through feasibility studies, requirements analysis, data flow diagram construction, object-oriented analysis concepts, and development approaches including Agile, CASE tools, JAD, RAD, and structured methods. No prior systems analysis experience is required.",
    aboutGuide: "This learner guide provides a structured overview of information systems analysis and forms part of the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It is designed to develop your ability to analyse systems and apply structured analysis techniques.",
    unitPurpose: "People credited with this unit standard are able to describe information systems analysis and explain different systems analysis techniques used in the industry.",
    quizPlacement: "end",
    quizSummary: "Test your understanding of information systems analysis, the SDLC, feasibility studies, cost-benefit analysis, requirements analysis, data flow diagrams, object-oriented concepts, and Agile and structured development approaches.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all sessions in the learner guide before attempting this quiz. You can review the material at any time.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Submit a Portfolio of Evidence demonstrating your understanding of information systems analysis concepts and techniques.",
    lessons: [
      {
        id: "programme-intro",
        label: "Introduction",
        title: "Programme Introduction � FETC: IT Systems Development",
        summary: "A foundational orientation to the qualification � covering what information systems are, the SDLC, how systems development differs from software development, your full learning roadmap across all 11 modules, and how each lecture in this unit standard connects to the next. No assessed outcomes.",
        body: "This opening lesson orients you to the qualification before any assessed content begins. It maps the full programme structure � positioning each unit standard in context � and establishes the analytical mindset that underpins every lesson that follows. Work through these sections at your own pace before your facilitator opens Session 1.",
        sections: [
          {
            title: "What is Information Technology?",
            blocks: [
              {
                type: "paragraph" as const,
                text: "Information Technology (IT) is the combination of hardware and software products and services that organisations use to manage, access, communicate, and share information. IT is not just computers � it is the invisible infrastructure that underpins every business function, from student records and payroll to logistics and customer service.",
              },
              {
                type: "heading" as const,
                text: "Three Forces Shaping the Future of IT",
              },
              {
                type: "list" as const,
                items: [
                  "Changes in the world � globalisation, remote work, digital transformation, and the demand for real-time information access across every sector",
                  "Changes in technology � faster processors, cloud computing, artificial intelligence, mobile platforms, and the exponential growth of available data (Moore's Law: processing power roughly doubles every two years)",
                  "Changes in client demand � organisations and end users expect systems that are faster, more intuitive, more accessible, and more secure than ever before",
                ],
              },
              {
                type: "callout" as const,
                variant: "info" as const,
                text: "As a systems developer, you will design, build and maintain the IT infrastructure that organisations depend on. Understanding what IT is � and why it must be carefully planned � is the foundation on which every other unit in this qualification rests.",
              },
            ],
          },
          {
            title: "A. What is a System?",
            blocks: [
              {
                type: "callout" as const,
                variant: "info" as const,
                text: "Think of your college's student registration portal � it takes in learner data, processes it according to rules, stores records, and produces reports for the DoE. That is a real information system. Understanding how to build, analyse and improve systems like it is exactly what this qualification is about.",
              },
              {
                type: "paragraph" as const,
                text: "A system is an organised set of interrelated components that work together to achieve a defined goal. An information system specifically collects, processes, stores, and distributes information to support an organisation's day-to-day operations and decision-making.",
              },
              {
                type: "heading" as const,
                text: "Examples of Information Systems You Already Know",
              },
              {
                type: "list" as const,
                items: [
                  "Student registration portal � captures enrolment data, checks eligibility, generates student numbers and timetables",
                  "Attendance tracking tool � records daily sign-ins, flags patterns, produces reports for the Department of Education",
                  "Results management system � stores marks, calculates averages, generates transcripts and certificates",
                  "Leave management system � processes leave applications, checks available balances, notifies line managers",
                  "Online banking portal � takes your transaction instruction, validates it, updates balances, sends a confirmation",
                ],
              },
              {
                type: "paragraph" as const,
                text: "Notice the pattern: every one of these systems takes in data (inputs), applies rules or calculations (processing), retains records (storage), and produces something people act on � a report, a balance, a certificate (outputs). This input�process�storage�output model is the structural DNA of every information system you will ever build or analyse.",
              },
            ],
          },
          {
            title: "B. What is Systems Development?",
            blocks: [
              {
                type: "paragraph" as const,
                text: "Systems development is the end-to-end discipline of planning, analysing, designing, building, testing and maintaining information systems. It is not only about writing code � it is about ensuring the right system gets built in the first place, that it works correctly, and that it keeps working reliably after it is deployed.",
              },
              {
                type: "heading" as const,
                text: "The Six Phases of the Systems Development Life Cycle",
              },
              {
                type: "ordered-list" as const,
                items: [
                  "Investigation � Identify the business problem or opportunity; assess whether a new or improved system is justified before any money is committed",
                  "Analysis � Establish in detail what the system must do: requirements, data flows, user needs, volume estimates, constraints",
                  "Design � Specify how the system will work: architecture, data structures, user interfaces, program module structure",
                  "Development (Coding) � Write and unit-test the program code based on the approved design documents",
                  "Implementation � Deploy the system, convert existing data, train users, and manage the transition from the old system to the new one",
                  "Maintenance � Monitor for defects, apply fixes and enhancements, and eventually plan the next iteration or replacement",
                ],
              },
              {
                type: "callout" as const,
                variant: "tip" as const,
                text: "Notice that coding (phase 4) only appears more than halfway through. The analysis and design work that precedes it determines whether what gets built is actually useful. A technically excellent system that solves the wrong problem is still a failure � and failures at this stage cost two to ten times more to fix than failures caught during analysis.",
              },
            ],
          },
          {
            title: "C. Systems Development vs Software Development � Are They the Same?",
            blocks: [
              {
                type: "paragraph" as const,
                text: "These terms are used interchangeably in everyday conversation, but they describe different scopes. Software development is a subset of systems development � it is the phase where programs are written and tested. Systems development is the broader discipline that frames why the software needs to exist and ensures the solution works for the organisation as a whole.",
              },
              {
                type: "table" as const,
                headers: ["Aspect", "Systems Development", "Software Development"],
                rows: [
                  ["Scope", "End-to-end: people, process, data, technology and code", "Primarily code � design, write, test, deploy"],
                  ["Starting point", "Business problem or organisational need", "Requirements specification handed to developers by an analyst"],
                  ["Who is involved", "Analysts, business users, managers, developers, QA, trainers", "Developers, testers, DevOps engineers"],
                  ["Key output", "A working solution that solves the business problem", "A software artefact � an application, API, script or service"],
                  ["SDLC position", "Spans all 6 phases from investigation to maintenance", "Primarily phases 4�5: development and implementation"],
                  ["SA NQF framing", "The recognised qualification framing (SAQA 78965, NQF Level 4)", "Usually vendor-specific certifications (e.g. AWS, Oracle, Microsoft)"],
                ],
              },
              {
                type: "paragraph" as const,
                text: "How they connect: every piece of software exists inside a larger organisational system. The analyst's work � understanding the problem, gathering requirements, modelling data flows, designing before coding � determines whether the software that eventually gets written solves the right problem for the right people. In this qualification, you will learn to think like an analyst and write like a developer. Both skills are required to be fully effective in the IT workplace.",
              },
            ],
          },
          {
            title: "D. Why Study Systems Development?",
            blocks: [
              {
                type: "list" as const,
                items: [
                  "Organisations run on systems: every business function � payroll, HR, logistics, student records � depends on reliable information systems. Understanding how they are built is foundational to any IT role, from junior developer to project manager.",
                  "Poor analysis causes expensive failures: the Standish Group CHAOS Report consistently finds that fewer than 30% of IT projects are completed on time, within budget and to specification. The leading root causes are poor requirements gathering and inadequate analysis � not programming errors. This qualification addresses those root causes directly.",
                  "NQF Level 4 opens careers: competence in systems development creates pathways into junior analyst, developer, business analyst support and project coordination roles � all in high demand across South African government and private sector.",
                  "Professional practice modelling: as a CET lecturer delivering vocational IT training, demonstrating structured thinking � breaking a problem down before touching a keyboard, gathering requirements from users, designing before coding � is the professional standard your learners will carry into the workplace.",
                ],
              },
              {
                type: "callout" as const,
                variant: "info" as const,
                text: "Reflection activity: Name one IT system you interact with at your college. Write down one thing it does well and one thing it does poorly. When you reach Session 1 of ITSD-14924, you will have the vocabulary and the analytical tools to describe exactly why that problem exists � and how you would fix it.",
              },
            ],
          },
          {
            title: "E. Your Learning Roadmap",
            blocks: [
              {
                type: "paragraph" as const,
                text: "This qualification is delivered across 15 days in 3 blocks. The 11 unit standards below build on each other � Block 1 establishes the thinking frameworks, Block 2 applies them in working code, and Block 3 brings everything together in a professional practice context.",
              },
              {
                type: "table" as const,
                headers: ["#", "Code", "Title", "Block", "Credits", "What you will be able to do"],
                rows: [
                  ["1", "ITSD-14924", "Information Systems Analysis", "Block 1 � Day 1", "3", "Describe the SDLC, the analyst's role, information-gathering techniques, DFDs, decision tables and CASE tools"],
                  ["2", "ITSD-14920", "Team Collaboration & Problem Solving", "Block 1 � Day 2", "3", "Contribute effectively to team problem-solving using structured techniques and identify qualities of effective team members"],
                  ["3", "ITSD-14918", "Programming Principles Introduction", "Block 1 � Day 3", "5", "Explain data types, control structures and write pseudocode for simple problems"],
                  ["4", "ITSD-14927", "Apply Problem-Solving Strategies", "Block 1 � Day 4", "4", "Analyse workplace problems, evaluate solutions against criteria, and develop an implementation plan"],
                  ["5", "ITSD-14915", "Design a Computer Program to Specification", "Block 1 � Day 5", "8", "Design programs using structure diagrams, decision tables, pseudocode and desk-checking"],
                  ["6", "ITSD-14910", "Apply Programming Principles", "Block 2 � Days 6�7", "8", "Write, test and debug structured programs applying data types, functions, control structures and error handling"],
                  ["7", "ITSD-14933", "Web Scripting", "Block 2 � Days 8�9", "6", "Build interactive web pages using HTML5, CSS3 and JavaScript with DOM manipulation and responsive design"],
                  ["8", "ITSD-14930", "Developing Software for the Internet", "Block 2 � Integrated support", "3", "Explain network, interface, ownership and security principles that support the web-development work in Block 2"],
                  ["9", "ITSD-14921", "Types of Computer Systems & Hardware Configurations", "Block 3 � Day 11", "6", "Describe computer system types, hardware components, peripherals, and fit-for-purpose configurations"],
                  ["10", "ITSD-14908", "Testing IT Systems", "Block 3 � Day 12", "6", "Design test cases, execute test plans, log defects and apply quality assurance principles"],
                  ["11", "ITSD-14919", "Resolve User Problems", "Block 3 � Day 13", "5", "Diagnose and resolve common IT user problems using structured troubleshooting methodology"],
                ],
              },
              {
                type: "callout" as const,
                variant: "tip" as const,
                text: "Day 10 is a PoE consolidation day � no new unit standard content is delivered. Use this day to organise your portfolio evidence, complete any outstanding workbook activities, and prepare questions for the Block 3 sessions. Your facilitator will be available to provide guidance.",
              },
            ],
          },
          {
            title: "F. How the SA&D Course Unfolds",
            blocks: [
              {
                type: "paragraph" as const,
                text: "The work you do in Session 1 today � understanding what a system is, who the analyst is, how to gather requirements � is not isolated. Every lecture in the Systems Analysis and Design course builds directly on the foundation you are establishing right now. Here is how:",
              },
              {
                type: "table" as const,
                headers: ["Lecture", "Topic", "SDLC Phase", "How it builds on Day 1"],
                rows: [
                  ["L1 � Today", "Introduction to Information Systems", "Analysis", "Establishes the analyst's role, the SDLC, IS components, and information-gathering techniques � the lens through which every other lecture is understood"],
                  ["L2", "Systems Project Management", "All phases", "Shows how the analyst's work is scoped, planned, and controlled. Feasibility, WBS, and scheduling begin where your Day 1 problem definition ends"],
                  ["L3", "Requirements Modelling", "Analysis", "Deepens requirements gathering: JAD workshops, RAD prototyping, and Agile iterations are the techniques analysts use after initial fact-finding"],
                  ["L4", "Data and Process Modelling", "Analysis ? Design", "The DFDs you learn today are expanded here: context diagrams ? Diagram 0 ? levelled diagrams. Logical models become physical design"],
                  ["L5 & L6", "Object Modelling", "Analysis ? Design", "OO analysis (introduced today in section 2.4) is developed into full UML: class diagrams, use cases, sequence diagrams, activity diagrams"],
                  ["L7", "Data Design", "Design", "The data your analysis identifies becomes database tables. Your DFDs' data stores become ERDs, normalised tables, and referential integrity rules"],
                  ["L8", "Development Strategies & Implementation", "Design ? Implementation", "Your analyst recommendation from Day 1 (build vs buy, which approach) feeds directly into the acquisition process and changeover strategy"],
                  ["L9", "User Interface Design", "Design", "The user requirements you gather today define what the interface must do. UI design translates analysis outputs into screens, forms and reports"],
                  ["L10", "System Support and Security", "Maintenance", "The documentation you produce during analysis (requirements, data models, process models) enables future maintenance, security audits, and post-implementation review"],
                ],
              },
              {
                type: "callout" as const,
                variant: "tip" as const,
                text: "Think of Day 1 as the trunk of a tree. Every lecture that follows is a branch that grows from the roots you are putting down today. The analyst who cannot gather requirements (L1) cannot model processes (L4), cannot design data (L7), cannot specify the UI (L9), and cannot support the system (L10). Everything connects.",
              },
            ],
          },
        ],
      },
      {
        id: "unit-1",
        label: "Block 1 � Day 1",
        title: "Systems Analysis Foundations: SDLC, Roles and Techniques",
        summary: "Lesson plan for ITSD-14924 Block 1, Day 1 � CET Lecturers Systems Development Training. Duration: 300 minutes (5 hours).",
        body: "UNIT STANDARD: 14924 | NQF LEVEL: 4 | CREDITS: 3 | Block 1 � Day 1 of 5 | Duration: 300 min",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Introduction to Information Systems Analysis",
        summary: "Explore SDLC phases, the analyst's key responsibilities, information-gathering techniques, and the distinction from requirements analysis.",
        body: "Understand the stages of the SDLC that apply to systems analysis, the core functions of the information systems analyst, and the main techniques used to gather requirements from stakeholders and existing systems.",
        outcomes: [
          "Explain the role of information systems analysis within the Software Development Life Cycle.",
          "Describe the key responsibilities of an information systems analyst.",
          "Identify and explain common information-gathering techniques (interviews, questionnaires, observation, site visits, document review).",
          "Distinguish between Systems Analysis and Requirements Analysis.",
        ],
        sections: [
          {
            title: "1.0 Introduction to System Analysis",
            blocks: [
              { type: "paragraph", text: "System analysis is the discipline of understanding how a system works, how its parts interact, and how it can be improved. It applies to software systems, business processes, and real-world service systems." },
              { type: "heading", text: "Core Concepts Before SDLC" },
              { type: "table", headers: ["Concept", "Description", "Simple Example"], rows: [
                ["Components", "The parts that make up a system and their relationships", "Online store: catalog, cart, payment gateway, user accounts"],
                ["Input and Output", "What enters the system and what it produces", "Input: product search and payment details; Output: order confirmation"],
                ["Processes", "The ordered activities that transform inputs into outputs", "Browse -> add to cart -> checkout -> payment -> confirmation"],
                ["Feedback Loops", "Output information used to adjust future behavior", "Low stock alerts trigger restocking rules"],
              ]},
              { type: "heading", text: "Why System Analysis Matters" },
              { type: "list", items: [
                "Improves efficiency by identifying bottlenecks and redundant steps",
                "Reduces cost by improving resource usage and preventing rework",
                "Improves quality and reliability of system outputs",
                "Supports innovation through structured problem-solving",
                "Strengthens root-cause analysis when failures happen",
              ]},
              { type: "heading", text: "System Analysis Process (Before Full SDLC Detail)" },
              { type: "ordered-list", items: [
                "Identify the system and its boundaries",
                "Gather data (interviews, observation, documents)",
                "Model the system using diagrams/flows",
                "Analyse issues, risks, and opportunities",
                "Propose and evaluate improvement options",
                "Implement agreed changes",
                "Test and monitor outcomes",
              ]},
              { type: "callout", variant: "tip", text: "Transition to SDLC: once we understand components, inputs/outputs, processes, and feedback, SDLC gives us the disciplined lifecycle to execute analysis, design, build, test, deploy, and maintain effectively." },
            ],
          },
          {
            title: "1.1 The Systems Development Life Cycle (SDLC)",
            blocks: [
              { type: "paragraph", text: "The systems development life cycle (SDLC) gives organisations a means of controlling a large development project by dividing it into manageable stages with well-defined outputs." },
              { type: "heading", text: "Key Characteristics of the SDLC" },
              { type: "ordered-list", items: [
                "Every stage defines activities and responsibilities of the development team.",
                "Each stage terminates in a milestone with defined deliverables (e.g., requirements specification).",
                "The effort expended on development is often surpassed by maintenance � which may cost twice as much over time.",
                "Extensive system documentation is necessary during development to support future maintenance.",
              ]},
              { type: "heading", text: "SDLC Stages and Deliverables" },
              { type: "table", headers: ["Stage", "Key Deliverable"], rows: [
                ["Feasibility Study", "Recommendation to proceed or abandon"],
                ["Requirements Analysis", "Requirements specifications"],
                ["Logical Design", "Conceptual design of programs and databases"],
                ["Physical Design", "Detailed design of modules, databases, hardware and software specs"],
                ["Coding and Testing", "Accepted system with complete documentation"],
                ["Conversion", "Installed operational system"],
                ["Post-implementation Review", "Recommendations for enhancement and organisational adjustment"],
              ]},
              { type: "heading", text: "Applied SDLC Scenario: Adam's Online Home Decor Store" },
              { type: "paragraph", text: "Adam wants an online store where customers can browse and buy home decor products. The SDLC helps the team move from business idea to a stable, secure, maintainable online system." },
              { type: "table", headers: ["Phase", "How It Applies to Adam's Store", "Main Output"], rows: [
                ["Planning", "Define business goals, budget, timeline, and success criteria.", "Project scope and plan"],
                ["Requirements Analysis", "Capture required features: product catalogue, cart, checkout, account management, admin dashboard, payment integration.", "SRS (Software Requirements Specification)"],
                ["Design", "Define architecture, database structure, page flow, security model, and user interface approach.", "DDS (Design Document Specification)"],
                ["Implementation", "Develop frontend, backend, APIs, database queries, and integrations according to DDS.", "Working software build"],
                ["Testing", "Run QA across functional, usability, security, and performance checks; fix defects.", "Test reports + bug fixes"],
                ["Deployment & Maintenance", "Release to users, monitor incidents, patch bugs, improve features over time.", "Live system + updates"],
              ]},
              { type: "callout", variant: "tip", text: "Teaching takeaway: the phase names may vary by model, but the core logic stays the same � plan, define, design, build, validate, release, improve." },
            ],
          },
          {
            title: "1.1A SDLC Models in Practice: Waterfall, Agile, and DevOps",
            blocks: [
              { type: "paragraph", text: "SDLC is the backbone. Methodologies define HOW teams move through those phases. Different projects need different execution styles." },
              { type: "table", headers: ["Model", "Execution Pattern", "Best Fit", "Risk/Trade-off"], rows: [
                ["Waterfall", "Sequential phase-by-phase progression", "Stable requirements, regulated projects", "Low flexibility when requirements change late"],
                ["Agile", "Iterative sprints with frequent stakeholder feedback", "Evolving requirements and fast delivery needs", "Requires disciplined backlog and stakeholder participation"],
                ["DevOps", "Continuous integration, testing, deployment, and operations feedback", "High-frequency release environments", "Requires automation maturity and shared ownership culture"],
              ]},
              { type: "heading", text: "Online Store Lens" },
              { type: "list", items: [
                "Waterfall works when Adam's requirements are fixed and approved upfront.",
                "Agile works when product categories, promotions, and user journeys evolve rapidly.",
                "DevOps is valuable after go-live, where frequent updates and quick fixes are expected.",
              ]},
              { type: "callout", variant: "info", text: "CI/CD in DevOps means code can be integrated, tested, and safely released many times per day, reducing deployment risk while improving response speed to user feedback." },
            ],
          },
          {
            title: "1.2 Systems Analysis",
            blocks: [
              { type: "callout", variant: "info", text: "The task of systems analysis is to establish in detail WHAT the proposed system will do � as opposed to HOW it will be done technologically." },
              { type: "heading", text: "What Systems Analysis Establishes" },
              { type: "list", items: [
                "The objectives of the new system, including costs and benefits analysis.",
                "Who the system users are, the information they need, its form, and how it is obtained from incoming data.",
              ]},
            ],
          },
          {
            title: "1.3 Feasibility Study",
            blocks: [
              { type: "paragraph", text: "The main objective of the feasibility study is to determine whether the proposed system is desirable before resources are committed to the full-scale project." },
              { type: "heading", text: "Five Aspects of a Feasibility Study" },
              { type: "table", headers: ["Type", "Question Asked"], rows: [
                ["Legal feasibility", "Will the proposed system conform to laws and regulations?"],
                ["Ethical feasibility", "Will the proposed system conform to ethical norms?"],
                ["Technological feasibility", "Do we have the technology and skills needed?"],
                ["Economic feasibility", "Will the system provide competitive advantage or payoff?"],
                ["Organisational feasibility", "Will the change be accepted, improving quality of working life?"],
              ]},
              { type: "heading", text: "Identifying Benefits and Costs (Economic Feasibility in Practice)" },
              { type: "paragraph", text: "Economic feasibility requires the analyst to identify and categorise all benefits and costs associated with the proposed system. These fall into two dimensions: tangible (measurable in money) and intangible (difficult to quantify but real in impact)." },
              { type: "table", headers: ["Category", "Examples"], rows: [
                ["Tangible Benefits", "Faster processing speed; access to previously unavailable information; reduced employee time on manual tasks; fewer errors in calculations and reporting"],
                ["Intangible Benefits", "Improved decision-making quality; enhanced data accuracy; stronger competitive position in customer service; better company image; increased employee job satisfaction"],
                ["Tangible Costs", "Hardware and infrastructure; software licences; analyst and programmer time (person-days); employee salaries during transition; training costs"],
                ["Intangible Costs", "Loss of competitive edge during transition; reputational risk if the project is delayed or fails; ineffective decision-making while old and new systems co-exist; disruption to working routines"],
              ]},
              { type: "callout", variant: "info", text: "Cost-Benefit Analysis checklist: (1) List each development strategy being considered. (2) Identify all costs and benefits for each alternative, including when costs will be incurred and benefits realised. (3) Consider future growth and scalability. (4) Analyse software licensing options. (5) Study the results and prepare a report for management decision." },
            ],
          },
          {
            title: "1.4 Requirements Analysis",
            blocks: [
              { type: "paragraph", text: "The principal objective of requirements analysis is to produce requirements specifications � a detailed description of WHAT the system will do, agreed upon by developers, users, management and other stakeholders." },
              { type: "heading", text: "Information Gathering Techniques" },
              { type: "list", items: [
                "Asking the users (interviews and questionnaires)",
                "Deriving from an existing system (data analysis, document analysis, observing work)",
                "Deriving from analysis of the business area (Business Systems Planning, critical success factors)",
                "Experimenting with the system under development (prototyping)",
              ]},
              { type: "heading", text: "Structured Fact-Finding" },
              { type: "paragraph", text: "Beyond selecting a technique, effective requirements gathering requires a structured fact-finding plan. The analyst must first identify what information is needed, develop an approach, and then execute it. The six guiding questions frame every fact-finding effort:" },
              { type: "table", headers: ["Question", "What the Analyst is Establishing"], rows: [
                ["Who?", "Who are the users, decision-makers, and stakeholders? Who provides data? Who receives it? Who is affected when the system fails?"],
                ["What?", "What data is captured, processed, stored, and reported? What decisions depend on this information? What are the business rules?"],
                ["Where?", "Where does data originate? Where is it processed? Where are outputs delivered? Are there remote sites or distributed processes?"],
                ["When?", "When do transactions occur? When must reports be available? When do peaks in volume occur? What are the timing constraints?"],
                ["How?", "How is data currently captured and processed? How often? How many records? How does the current system handle exceptions?"],
                ["Why?", "Why does the current system fall short? Why do users need new functionality? Why is this system strategically important?"],
              ]},
              { type: "callout", variant: "tip", text: "Critical distinction: always ask what IS being done AND what SHOULD or COULD be done. Users often describe workarounds and manual fixes built around a broken system. Requirements analysis must surface both the current reality and the desired future state � they are rarely the same thing." },
              { type: "heading", text: "Five Fact-Finding Methods" },
              { type: "table", headers: ["Method", "Best Used When", "Key Advantage"], rows: [
                ["Interviews", "Deep understanding of individual roles, complex processes, or sensitive issues is needed", "Allows follow-up questions; uncovers context and opinion that surveys miss"],
                ["Document Review", "Existing forms, reports, policy documents, and data definitions exist", "Reveals what the system actually does vs what people think it does"],
                ["Observation", "Users may not accurately describe their own work, or informal workarounds are suspected", "Shows the real process � including undocumented steps and inefficiencies"],
                ["Questionnaires & Surveys", "Many respondents must be reached, or anonymity encourages honest answers", "Cost-effective at scale; statistical analysis of responses is possible"],
                ["Research", "Industry standards, benchmarks, or similar systems from other organisations are relevant", "Establishes what is already known � avoids reinventing solutions"],
              ]},
            ],
          },
          {
            title: "1.5 Role of the Systems Analyst",
            blocks: [
              { type: "paragraph", text: "A systems analyst researches problems, plans solutions, recommends software and systems, and coordinates development to meet business requirements. They must be good communicators with strong analytical and critical thinking skills, and able to work with people of all descriptions." },
              { type: "heading", text: "Three Primary Roles of the Systems Analyst" },
              { type: "table", headers: ["Role", "Description"], rows: [
                ["Consultant", "Works as an outside expert hired to address a specific business problem or need. Brings an independent perspective and specialist knowledge the organisation may not have internally."],
                ["Supporting Expert", "Provides internal specialist assistance to a department or project team. Advises on IT capabilities, helps design solutions, and guides technical decisions without taking ownership of the project."],
                ["Agent of Change", "Facilitates and drives organisational transformation. Analyses how work is currently done, proposes improvements, and helps the organisation adapt its people, processes and systems to the new solution."],
              ]},
              { type: "heading", text: "Four Qualities of an Effective Systems Analyst" },
              { type: "list", items: [
                "Problem solver � breaks complex business problems into manageable parts, identifies root causes, and develops practical, systematic solutions",
                "Communicator � translates technical concepts for non-technical users and business requirements for developers; writes clearly and listens actively",
                "Strong personal and professional ethics � handles sensitive data and organisational information with integrity and confidentiality",
                "Self-disciplined and self-motivated � manages time effectively, meets deadlines under pressure, and drives tasks to completion with minimal supervision",
              ]},
              { type: "heading", text: "Key Responsibilities" },
              { type: "list", items: [
                "Identify and plan for organisational and human impacts of planned systems.",
                "Plan a system flow from the ground up.",
                "Interact with users to document requirements for business requirements documents.",
                "Write technical requirements from a critical phase.",
                "Help programmers during development (use cases, flowcharts, database design).",
                "Perform system testing and deploy the completed system.",
                "Document requirements and contribute to user manuals.",
              ]},
            ],
          },
          {
            title: "1.6 Information System Components",
            blocks: [
              { type: "paragraph", text: "Every information system is made up of five interdependent components that must work together to produce useful results. Understanding these components helps analysts identify where problems occur and what must change when a system is redesigned." },
              { type: "callout", variant: "tip", text: "A mission-critical system is one that is vital to an organisation's operations � if it fails, the organisation cannot function. Examples: a hospital's patient records system, a bank's transaction processing system, a college's student registration portal." },
              { type: "table", headers: ["Component", "Description"], rows: [
                ["Hardware", "The physical layer of the information system � servers, workstations, network equipment, input/output devices. Hardware capacity follows Moore's Law: processing power roughly doubles every two years while cost falls, enabling ever-more powerful systems."],
                ["Software", "System software (operating systems, utilities) manages hardware resources. Application software performs specific business tasks. Enterprise applications (ERP, CRM) span the whole organisation. Systems may be horizontal (generic, used across industries), vertical (industry-specific), or legacy (older systems still in production use)."],
                ["Data", "The raw material of the system. Data is stored in tables; related tables are linked to supply information to processes and users. Data consists of basic facts; information is data that has been transformed into output that is valuable to users."],
                ["Processes", "The tasks and business functions that users, managers, and IT staff perform to achieve specific results using the system. Processes define the rules for how data is captured, validated, transformed and reported."],
                ["People", "All stakeholders who interact with or are affected by the system � end users, managers, IT staff, customers, and regulators. Identifying all people affected is a critical first step in any analysis project."],
              ]},
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Systems Analysis Techniques",
        summary: "Apply DFDs, decision trees, decision tables, and CASE tools to model and document business systems.",
        body: "Explore industry-standard systems analysis techniques for representing data flows, business logic, and processes � and understand how CASE tools support the analyst's work.",
        outcomes: [
          "Describe industry-standard systems analysis techniques.",
          "Apply Data Flow Diagrams (DFDs) to document system processes and data flows.",
          "Use decision trees and decision tables to model business logic.",
          "Identify Computer-Aided Software Engineering (CASE) tools and data structure modelling techniques.",
        ],
        sections: [
          {
            title: "2.1 Interviews vs Questionnaires",
            blocks: [
              { type: "paragraph", text: "Two primary information-gathering methods are interviews (face-to-face meetings) and questionnaires (self-administered tools). Each has advantages and limitations." },
              { type: "table", headers: ["Attribute", "Questionnaire", "Interview"], rows: [
                ["Cost", "Economical", "Less economical"],
                ["Participants", "Many people simultaneously", "One person at a time"],
                ["Error risk", "Fewer errors", "Depends on interviewer skill"],
                ["Anonymity", "Maintained � honest opinions", "Not maintained"],
                ["Reflection time", "Respondents can think carefully", "May not have enough time"],
              ]},
              { type: "heading", text: "Types of Interviews" },
              { type: "list", items: [
                "Structured Interview � same wording and order for all interviewees.",
                "Unstructured Interview � respondents answer freely; allows deeper exploration of complex topics.",
              ]},
            ],
          },
          {
            title: "2.2 Data Flow Diagrams (DFDs)",
            blocks: [
              { type: "paragraph", text: "A Data Flow Diagram (DFD) shows how data moves through an information system. It graphically characterises data processes and flows in a business system � depicting system inputs, processes, and outputs � but does not show program logic or step-by-step processing detail. A set of DFDs provides a logical model that shows what the system does, not how it does it technically." },
              { type: "heading", text: "The Four DFD Symbols" },
              { type: "table", headers: ["Symbol", "Shape", "Naming Convention", "What it Represents"], rows: [
                ["External Entity", "Double square (rectangle with a shadow)", "Named with a noun (e.g. Student, Department, Bank)", "A person, department, organisation, or system outside the system boundary. Acts as a source (data enters the system) or a sink (data leaves the system). External entities are not controlled by the system being analysed."],
                ["Data Flow", "Arrow (single or double arrowhead)", "Named with a noun describing the data (e.g. Enrolment Form, Payment Confirmation)", "The movement of data from one component to another. The arrowhead shows direction of flow. Represents data about a person, place, or thing."],
                ["Process", "Rectangle with rounded corners (or circle)", "Named using verb-adjective-noun form (e.g. Validate Student Record, Calculate Final Mark)", "Work being performed � a transformation of input data into output data. Processes contain the business logic (business rules) of the system. They are described as a 'black box': what goes in and out is shown, but internal logic is hidden at this level."],
                ["Data Store", "Open-ended rectangle (parallel lines)", "Named with a noun; given a unique reference number D1, D2, D3�", "A repository where data is held for later use. Represents a database, computerised file, or physical filing cabinet. At DFD level you are concerned only with the logical store � not its physical format."],
              ]},
              { type: "heading", text: "Context Diagram (Level 0)" },
              { type: "paragraph", text: "The context diagram is the highest-level DFD. It represents the entire system as a single process numbered 0 and shows all external entities that interact with the system, plus the major data flows between them and the system. No data stores appear at this level. The diagram must fit on one page and uses the name of the information system as the process name." },
              { type: "callout", variant: "info", text: "Context diagram rules: (1) Must have exactly one process. (2) No freestanding objects. (3) External entities may not connect directly to one another. (4) Every data flow must connect to or from the single process." },
              { type: "heading", text: "Diagram 0" },
              { type: "paragraph", text: "Diagram 0 is the explosion of the context diagram � it expands the single process into up to nine numbered sub-processes. All major data stores and all external entities are included. Drawing starts from the input side (data flow from an entity) or works backward from an output data flow." },
              { type: "heading", text: "Levelling and Balancing" },
              { type: "paragraph", text: "DFDs are built in layers (levels). Each process on Diagram 0 may be exploded into its own child diagram to show further detail. The child diagram is given the same number as the parent process (e.g. Process 3 on Diagram 0 explodes to Diagram 3). A process that is not exploded further is called a primitive process. Balancing means that a child diagram cannot produce output or receive input that its parent process does not also produce or receive." },
              { type: "heading", text: "Logical vs Physical DFDs" },
              { type: "table", headers: ["Type", "Focus", "Purpose"], rows: [
                ["Logical DFD", "What the business does � the business events that take place and the data required and produced by each event", "Describes current or required business operations independently of any technology. Used during analysis to agree what the system must do."],
                ["Physical DFD", "How the system will be implemented � names of programs, files, hardware, and people who perform each process", "Shows the specific technology solution. Used during design to specify how the logical model will be built."],
              ]},
            ],
          },
          {
            title: "2.3 Structured Analysis Techniques",
            blocks: [
              { type: "paragraph", text: "Structured systems analysis uses graphical tools to describe a system as interacting processes that transform input data into output data. These processes may later become code modules during programming." },
              { type: "heading", text: "Prototyping Approach" },
              { type: "list", items: [
                "An initial system version embodying some requirements is built.",
                "Users define requirements by comparing against the prototype ('as compared to something' approach).",
                "The prototype may be discarded after use, or evolve into the delivered system.",
              ]},
            ],
          },
          {
            title: "2.4 Object-Oriented Analysis",
            blocks: [
              { type: "paragraph", text: "Object-oriented (OO) analysis is a widely-used approach that sees a system from the viewpoint of the objects themselves as they function and interact � rather than viewing the system as sequential processes transforming data. It works well where systems undergo continuous maintenance, adaptation, and redesign, because objects and classes are reusable across projects." },
              { type: "heading", text: "Core OO Concepts" },
              { type: "table", headers: ["Concept", "Definition"], rows: [
                ["Object", "A person, place, or thing that is relevant to the system being analysed (e.g. Student, Course, Payment). An object belongs to a class and has specific attribute values and can perform methods."],
                ["Class", "Defines the set of shared attributes and behaviours found in every object of that type. When an object is created from a class, it is said to be instantiated. A class has subclasses (more specific types) and a superclass (a more general parent type)."],
                ["Attribute", "A property or characteristic shared by all objects in a class. If objects are nouns, attributes are the adjectives that describe them (e.g. Student has attributes: studentNumber, fullName, dateOfBirth)."],
                ["Method", "An action that any object of the class can perform. Methods are the verbs � they describe what an object does (e.g. Student.calculateGPA(), Student.generateTranscript()). A method defines the specific task the object carries out."],
                ["Message", "A request from one object asking another object to perform a specific behaviour or return information. Messages are the mechanism by which objects interact and collaborate."],
                ["Inheritance", "A derived (child) class automatically inherits all the attributes and behaviours of its base (parent) class. This reduces programming labour � common features are defined once in the parent class and reused by all child classes. Inheritance is a feature unique to object-oriented systems."],
              ]},
              { type: "heading", text: "The Unified Modeling Language (UML)" },
              { type: "paragraph", text: "The UML is the industry-standard notation for modelling object-oriented systems. It uses a set of graphical symbols to represent components and relationships visually. A UML class diagram shows the static features of the system: each class appears as a rectangle with three compartments � the class name at the top, followed by its attributes, followed by its methods." },
              { type: "callout", variant: "tip", text: "Key OO advantage � Encapsulation: each object is a 'black box'. Other parts of the system interact with it only through its defined methods. This means changing one object's internal logic has minimal impact on other objects, making systems far easier to maintain and extend over time." },
            ],
          },
          {
            title: "2.5 Systems Development Approaches",
            blocks: [
              { type: "paragraph", text: "Systems analysts must understand several approaches to developing information systems. Each approach has strengths suited to different project types � project size, rate of change in requirements, available skills, and organisational context all influence which approach is most appropriate." },
              { type: "heading", text: "Comparison of Development Approaches" },
              { type: "table", headers: ["Approach", "Core Idea", "Best Suited For"], rows: [
                ["Traditional SDLC (Structured)", "Sequential phases � each phase must be completed and signed off before the next begins. Heavy documentation emphasis.", "Large, well-defined projects with stable requirements where changes are costly (e.g. government systems, accounting systems)."],
                ["CASE-Supported Development", "Uses Computer-Aided Software Engineering tools to automate analyst tasks, generate code, maintain documentation and enforce consistency across the life cycle.", "Projects where productivity, consistency and integration of life cycle activities are priorities."],
                ["Object-Oriented (OO)", "Analyses and designs in small iterative cycles, each covering analysis ? design ? implementation of a specific part. The system is viewed as a collection of interacting objects.", "Systems with rapidly changing requirements; modern application development; reuse-critical environments."],
                ["Agile Methods", "Incremental, iterative development with continuous user feedback. Emphasises working software over documentation, collaboration over contracts, and responding to change over following a fixed plan.", "Smaller teams, projects with evolving requirements, and situations where early, frequent deliverables add value."],
              ]},
              { type: "heading", text: "Joint Application Development (JAD)" },
              { type: "list", items: [
                "A team-based strategy that brings key business users and IT staff together in structured workshops to define system requirements jointly",
                "Advantage: key users participate directly � resulting in more accurate requirements, better understanding of shared goals, and stronger commitment to the new system's success",
                "Advantage: reduces the back-and-forth between analysts and users that plagues traditional interview-based requirements gathering",
                "Disadvantage: more expensive and time-intensive than individual interviews",
                "Disadvantage: can be cumbersome if the group is too large relative to the scale of the project",
              ]},
              { type: "heading", text: "Rapid Application Development (RAD)" },
              { type: "list", items: [
                "A team-based technique that speeds up information systems development and produces a functioning system faster than traditional methods",
                "Relies heavily on prototyping and active user involvement throughout every phase of development",
                "Objective: cut development time and expense by involving users in every phase � not just at requirements stage",
                "The interactive prototyping cycle continues until users are satisfied and the system is complete",
                "Advantage: systems developed more quickly with significant cost savings; user interface-heavy systems benefit greatly",
                "Disadvantage: may allow less time to develop quality, consistency, and design standards � emphasis is on the mechanics of the system, not strategic business alignment",
              ]},
              { type: "heading", text: "Agile Methods � 12 Core Principles" },
              { type: "ordered-list", items: [
                "Satisfy the customer through early and continuous delivery of working software",
                "Embrace changing requirements � even when introduced late in development",
                "Deliver functioning software incrementally and frequently (weeks, not months)",
                "Ensure customers and analysts work together daily throughout the project",
                "Build projects around motivated individuals; trust them to get the job done",
                "Promote face-to-face conversation as the most efficient form of communication",
                "Working software is the primary measure of progress",
                "Encourage continuous, regular, sustainable development � the team maintains a constant pace indefinitely",
                "Maintain continuous attention to technical excellence and good design",
                "Support self-organising teams � the best architectures and designs emerge from empowered teams",
                "Provide rapid feedback and continuously encourage quality",
                "At regular intervals, the team reflects on how to become more effective and adjusts accordingly",
              ]},
              { type: "callout", variant: "info", text: "Scrum (an Agile framework): begin with a high-level plan that can be changed as the project proceeds. Work is done in fixed-length sprints (time boxes). The team's collective success is more important than individual contribution. Extreme Programming (XP) is another Agile method emphasising pair programming, test-driven development, and continuous integration." },
              { type: "heading", text: "DevOps and Continuous Delivery" },
              { type: "paragraph", text: "DevOps extends Agile by integrating development and operations into one continuous lifecycle. The goal is fast, reliable release cycles supported by automation and monitoring." },
              { type: "table", headers: ["Practice", "Purpose", "Example in Adam's Store"], rows: [
                ["Continuous Integration (CI)", "Merge code frequently and run automated checks early", "Every change to checkout logic triggers automated tests"],
                ["Continuous Delivery/Deployment (CD)", "Keep software releasable (or auto-release) at all times", "Release catalog updates and bug fixes safely without long delays"],
                ["Monitoring & Feedback", "Observe real usage and system health to drive improvement", "Track payment failures and improve checkout reliability"],
              ]},
              { type: "callout", variant: "tip", text: "Modern teams often use a hybrid approach: SDLC structure for governance, Agile for delivery cadence, and DevOps for release reliability." },
              { type: "heading", text: "Other Development Methods" },
              { type: "table", headers: ["Method", "Brief Description"], rows: [
                ["Rational Unified Process (RUP)", "An iterative software development framework developed by IBM Rational. Organises the development life cycle into four phases (Inception, Elaboration, Construction, Transition) with defined workflows. Suited to large, complex enterprise projects."],
                ["Microsoft Solutions Framework (MSF)", "A flexible, scalable framework developed by Microsoft. Emphasises team model, process model, and risk management. Used in Microsoft technology environments and large IT service organisations."],
              ]},
            ],
          },
          {
            title: "2.6 What Your Analysis Enables",
            blocks: [
              { type: "paragraph", text: "The analysis work completed today � requirements, process models, data flows, stakeholder identification � is not an end in itself. It is the input that makes every downstream phase possible. Here is what each analysis output directly enables:" },
              { type: "table", headers: ["Your Analysis Output", "Directly Enables", "Lecture / Phase"], rows: [
                ["Requirements specification (what the system must do)", "Project plan, WBS, and effort estimates. You cannot schedule what you have not defined.", "L2 � Project Management"],
                ["Stakeholder list and information needs", "JAD workshops and RAD prototype planning. You know who to include and what to validate with them.", "L3 � Requirements Modelling"],
                ["Logical DFDs and process descriptions", "Physical DFD design and detailed process specifications. The logical model becomes the technical blueprint.", "L4 � Data and Process Modelling"],
                ["Object identification and class relationships", "UML class diagrams, use case models, and sequence diagrams for the full system design.", "L5 & L6 � Object Modelling"],
                ["Data store identification and entity list", "Entity-relationship diagrams, table normalisation (1NF ? 3NF), and referential integrity rules.", "L7 � Data Design"],
                ["Analyst recommendation: build, buy, or adapt", "Acquisition process (RFP/RFQ), vendor evaluation, cost-benefit analysis, and changeover planning.", "L8 � Development Strategies"],
                ["User requirements and process outputs", "Screen designs, report layouts, input forms, and validation rules � every UI element traces to a requirement.", "L9 � User Interface Design"],
                ["Process documentation and data dictionary", "Maintenance procedures, security audit baseline, performance benchmarks, and the business continuity plan.", "L10 � System Support and Security"],
              ]},
              { type: "callout", variant: "warning", text: "The most common reason IT projects fail is not technical � it is analytical. Vague requirements, missed stakeholders, and undocumented processes at this stage cause rework, budget overruns, and sometimes total failure at implementation. The quality of your analysis today determines the quality of everything that follows." },
            ],
          },
        ],
      },
      {
        id: "facilitator-activities",
        label: "Facilitator Notes",
        title: "Facilitator Activities � Block 1, Day 1",
        summary: "Delivery guide, timing, and formative assessment for ITSD-14924 Block 1 Day 1.",
        body: "Total delivery time: 300 minutes (5 hours). Status: Active.",
        sections: [
          {
            title: "Planned Activities",
            blocks: [
              { type: "ordered-list", items: [
                "Icebreaker (15 min): Share a technology challenge experienced in your department.",
                "Mini-lecture (20 min): SDLC overview and the analyst's role in a CET context.",
                "Group Activity: Develop a stakeholder map for a student project tracking system.",
                "Paired Exercise: Select the most appropriate information-gathering technique for a given scenario.",
                "Distribute Systems Analysis Quick-Start Toolkit (DFD templates, stakeholder mapping templates).",
                "Peer Review: Exchange and critique each other's selected analysis techniques.",
              ]},
              { type: "callout", variant: "warning", text: "Distribute SDLC flowchart, stakeholder templates, and bilingual glossary at the start. Do not share assessment rubrics with learners before activities." },
            ],
          },
          {
            title: "Formative Assessment",
            blocks: [
              { type: "list", items: [
                "Observation checklist: participation and stakeholder identification.",
                "Completed worksheets: Activities 1�4.",
                "Peer feedback session at end of day.",
                "Exit reflection ticket (one thing learned, one question remaining).",
                "Evidence aligned to SAQA 14924 summative requirements.",
              ]},
            ],
          },
        ],
      },
      {
        id: "learner-activities",
        label: "Activities",
        title: "Learner Activities � Block 1, Day 1",
        summary: "Structured activities mapped to SAQA 14924 assessment criteria.",
        body: "Complete all activities in your workbook. Submit as part of your Portfolio of Evidence.",
        sections: [
          {
            title: "Activity Schedule",
            blocks: [
              { type: "table", headers: ["Activity", "Marks", "Focus"], rows: [
                ["Activity 1", "5", "Differentiate between Systems Analysis and Requirements Analysis."],
                ["Activity 2", "9", "Describe the functions of an Information Systems Analyst."],
                ["Activity 3", "12", "Explain information-gathering techniques (interviews, questionnaires, observation, site visits, document review)."],
                ["Activity 4", "15", "Describe systems analysis techniques: DFDs, Decision Trees, Decision Tables, and CASE tools."],
                ["Group Task", "�", "Develop a stakeholder map for a CET lab booking system."],
              ]},
            ],
          },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        title: "Resources � Block 1, Day 1",
        summary: "Materials required for the Block 1 Day 1 session.",
        body: "Prepare and print all resources before the session begins.",
        sections: [
          {
            title: "Resource List",
            blocks: [
              { type: "list", items: [
                "SDLC flowchart (printed, one per learner).",
                "Stakeholder mapping templates.",
                "Information-gathering checklist.",
                "Flipchart paper and markers.",
                "Bilingual glossary (Sepedi/Tshivenda key terms).",
                "Printed backup materials (offline contingency).",
                "Facilitator and Learner Guides (SAQA 14924).",
              ]},
              { type: "callout", variant: "tip", text: "Duration: 300 minutes (5 hours) | Status: Active" },
            ],
          },
        ],
      },
    ],
  };