export type SectionFieldKind = "input" | "textarea" | "select";

export interface SectionField {
  id: string;
  label: string;
  kind: SectionFieldKind;
  placeholder?: string;
  rows?: number;
  options?: string[];
}

export interface SectionMcq {
  id: string;
  prompt: string;
  marks: number;
  options: string[];
}

export interface WrittenPrompt {
  id: string;
  label: string;
  prompt: string;
  marks: number;
  fields: SectionField[];
}

export interface DiagramPrompt {
  id: string;
  label: string;
  prompt: string;
  marks: number;
  imageUrl: string;
  caption: string;
  identifyPrompt: string;
  identifyOptions: string[];
  labelFields: SectionField[];
}

export interface BlockInteractiveSection {
  id: string;
  moduleCode: string;
  title: string;
  subtitle: string;
  totalMarks: number;
  mcqs: SectionMcq[];
  written: WrittenPrompt[];
  diagram: DiagramPrompt;
}

const BLOCK1_DIAGRAM_BASE = "/docs/SAQA_78965_CET_Training/Block-1/Block1-Test/diagrams/block1";

export const BLOCK1_INTERACTIVE_SECTIONS: BlockInteractiveSection[] = [
  {
    id: "1",
    moduleCode: "14924",
    title: "Section 1 · Module 14924",
    subtitle: "Systems Analysis",
    totalMarks: 20,
    mcqs: [
      {
        id: "s1-a1",
        marks: 2,
        prompt: "Which phase of the SDLC focuses specifically on gathering and documenting user requirements?",
        options: [
          "A) Feasibility Study",
          "B) Systems Analysis",
          "C) Implementation",
          "D) Maintenance",
        ],
      },
      {
        id: "s1-a2",
        marks: 2,
        prompt: "A systems analyst visits the CET registration office and watches how clerks process student enrolments without asking questions. Which fact-finding technique is this?",
        options: [
          "A) Interview",
          "B) Questionnaire",
          "C) Observation",
          "D) Document Review",
        ],
      },
      {
        id: "s1-a3",
        marks: 2,
        prompt: "Which DFD symbol represents a location where data is stored for later use?",
        options: [
          "A) Circle (or rounded rectangle)",
          "B) Arrow",
          "C) Two parallel lines (open rectangle)",
          "D) Rectangle with a shadow",
        ],
      },
      {
        id: "s1-a4",
        marks: 2,
        prompt: "A CET attendance system must be replaced. The analyst must first determine if the project is technically possible and cost-effective. Which SDLC phase does this describe?",
        options: [
          "A) Requirements Analysis",
          "B) Logical Design",
          "C) Feasibility Study",
          "D) Physical Design",
        ],
      },
      {
        id: "s1-a5",
        marks: 2,
        prompt: "Which development approach is MOST suitable when requirements change frequently and user feedback after each delivery is important?",
        options: [
          "A) Waterfall — sequential phase-by-phase with formal sign-offs",
          "B) Agile — iterative sprints with regular stakeholder review",
          "C) Manual filing system with periodic updates",
          "D) A single once-off requirements document approved before build",
        ],
      },
    ],
    written: [
      {
        id: "s1-b1",
        label: "1.B1",
        marks: 4,
        prompt: "Differentiate between Systems Analysis and Requirements Analysis. Give ONE point for each.",
        fields: [
          { id: "s1-b1-systems", label: "Systems Analysis", kind: "input", placeholder: "Key point for Systems Analysis" },
          { id: "s1-b1-requirements", label: "Requirements Analysis", kind: "input", placeholder: "Key point for Requirements Analysis" },
        ],
      },
      {
        id: "s1-b2",
        label: "1.B2",
        marks: 6,
        prompt: "List THREE fact-finding techniques the analyst could use and give ONE reason why each is appropriate for the CET attendance-system context.",
        fields: [
          { id: "s1-b2-technique-1", label: "Technique 1", kind: "input", placeholder: "e.g. Observation" },
          { id: "s1-b2-why-1", label: "Why appropriate", kind: "textarea", rows: 2, placeholder: "Reason for technique 1" },
          { id: "s1-b2-technique-2", label: "Technique 2", kind: "input", placeholder: "e.g. Interview" },
          { id: "s1-b2-why-2", label: "Why appropriate", kind: "textarea", rows: 2, placeholder: "Reason for technique 2" },
          { id: "s1-b2-technique-3", label: "Technique 3", kind: "input", placeholder: "e.g. Questionnaire" },
          { id: "s1-b2-why-3", label: "Why appropriate", kind: "textarea", rows: 2, placeholder: "Reason for technique 3" },
        ],
      },
    ],
    diagram: {
      id: "s1-b3",
      label: "1.B3",
      marks: 4,
      prompt: "Refer to Figure A below and answer the related questions.",
      imageUrl: `${BLOCK1_DIAGRAM_BASE}/s1-b3-fig-a-dfd.svg`,
      caption: "Figure A — Systems Analysis DFD",
      identifyPrompt: "What type of diagram is shown above? Choose ONE.",
      identifyOptions: [
        "A) Flowchart",
        "B) Data Flow Diagram (DFD)",
        "C) Fishbone (Ishikawa) diagram",
        "D) Network diagram",
      ],
      labelFields: [
        { id: "s1-b3-label-1", label: "Label 1", kind: "select", options: ["External Entity", "Process", "Data Flow", "Data Store"] },
        { id: "s1-b3-label-2", label: "Label 2", kind: "select", options: ["External Entity", "Process", "Data Flow", "Data Store"] },
        { id: "s1-b3-label-3", label: "Label 3", kind: "select", options: ["External Entity", "Process", "Data Flow", "Data Store"] },
        { id: "s1-b3-label-4", label: "Label 4", kind: "select", options: ["External Entity", "Process", "Data Flow", "Data Store"] },
      ],
    },
  },
  {
    id: "2",
    moduleCode: "14920",
    title: "Section 2 · Module 14920",
    subtitle: "Team Collaboration & Problem Solving",
    totalMarks: 20,
    mcqs: [
      {
        id: "s2-a1",
        marks: 2,
        prompt: "What is the PRIMARY difference between a group and a team?",
        options: [
          "A) A team always has more members than a group",
          "B) A team shares a common goal and is mutually accountable for outcomes",
          "C) A group meets more regularly than a team",
          "D) A group always has a formal leader while a team does not",
        ],
      },
      {
        id: "s2-a2",
        marks: 2,
        prompt: "A CET project team is unable to agree on which student management system to adopt. Which problem-solving step should they take FIRST?",
        options: [
          "A) Implement the cheapest option immediately",
          "B) Clearly define and agree on the problem before evaluating solutions",
          "C) Ask management to decide on their behalf",
          "D) Wait until the conflict resolves itself",
        ],
      },
      {
        id: "s2-a3",
        marks: 2,
        prompt: "Which technique involves each team member independently writing ideas before sharing and ranking them as a group?",
        options: [
          "A) Round-robin brainstorming",
          "B) Nominal Group Technique (NGT)",
          "C) Open group discussion",
          "D) Majority voting without discussion",
        ],
      },
      {
        id: "s2-a4",
        marks: 2,
        prompt: "Which characteristic MOST contributes to an effective team environment?",
        options: [
          "A) Each member works independently to avoid conflict",
          "B) Trust, open communication, and shared accountability",
          "C) Strong leadership that makes all decisions",
          "D) Keeping team roles undefined for flexibility",
        ],
      },
      {
        id: "s2-a5",
        marks: 2,
        prompt: "A team member consistently misses deadlines and blames others for delays. Which team quality is MOST clearly absent?",
        options: [
          "A) Creativity",
          "B) Flexibility",
          "C) Accountability",
          "D) Technical skill",
        ],
      },
    ],
    written: [
      {
        id: "s2-b1",
        label: "2.B1",
        marks: 6,
        prompt: "List THREE common challenges teams face and briefly explain how each challenge can be addressed.",
        fields: [
          { id: "s2-b1-challenge-1", label: "Challenge 1", kind: "input", placeholder: "e.g. Poor communication" },
          { id: "s2-b1-address-1", label: "How to address it", kind: "textarea", rows: 2, placeholder: "How to solve challenge 1" },
          { id: "s2-b1-challenge-2", label: "Challenge 2", kind: "input", placeholder: "Challenge 2" },
          { id: "s2-b1-address-2", label: "How to address it", kind: "textarea", rows: 2, placeholder: "How to solve challenge 2" },
          { id: "s2-b1-challenge-3", label: "Challenge 3", kind: "input", placeholder: "Challenge 3" },
          { id: "s2-b1-address-3", label: "How to address it", kind: "textarea", rows: 2, placeholder: "How to solve challenge 3" },
        ],
      },
      {
        id: "s2-b2",
        label: "2.B2",
        marks: 4,
        prompt: "Describe TWO ways an individual team member can actively contribute to solving a shared problem.",
        fields: [
          { id: "s2-b2-way-1", label: "Way 1", kind: "textarea", rows: 3, placeholder: "Describe contribution 1" },
          { id: "s2-b2-way-2", label: "Way 2", kind: "textarea", rows: 3, placeholder: "Describe contribution 2" },
        ],
      },
    ],
    diagram: {
      id: "s2-b3",
      label: "2.B3",
      marks: 4,
      prompt: "Refer to Figure A below and answer the related questions.",
      imageUrl: `${BLOCK1_DIAGRAM_BASE}/s2-b3-fig-a-team.svg`,
      caption: "Figure A — Team Collaboration Diagram",
      identifyPrompt: "What type of diagram is shown above? Choose ONE.",
      identifyOptions: [
        "A) Team collaboration diagram",
        "B) Fishbone diagram",
        "C) Gantt chart",
        "D) Flowchart",
      ],
      labelFields: [
        { id: "s2-b3-label-1", label: "Label 1", kind: "select", options: ["Team Leader", "Team Member", "Task", "Communication"] },
        { id: "s2-b3-label-2", label: "Label 2", kind: "select", options: ["Team Leader", "Team Member", "Task", "Communication"] },
        { id: "s2-b3-label-3", label: "Label 3", kind: "select", options: ["Team Leader", "Team Member", "Task", "Communication"] },
        { id: "s2-b3-label-4", label: "Label 4", kind: "select", options: ["Team Leader", "Team Member", "Task", "Communication"] },
      ],
    },
  },
  {
    id: "3",
    moduleCode: "14918",
    title: "Section 3 · Module 14918",
    subtitle: "Programming Principles Introduction",
    totalMarks: 20,
    mcqs: [
      {
        id: "s3-a1",
        marks: 2,
        prompt: "Which control structure causes a section of code to repeat while a condition remains true?",
        options: [
          "A) Sequence — steps run one after another in order",
          "B) Selection — a condition determines which path to follow",
          "C) Iteration (Loop) — steps repeat based on a condition",
          "D) Function — a named block of reusable code",
        ],
      },
      {
        id: "s3-a2",
        marks: 2,
        prompt: "A programmer writes out the logic of a program in plain English steps before writing any code. What is this technique called?",
        options: [
          "A) Debugging",
          "B) Pseudocode",
          "C) Compilation",
          "D) Syntax checking",
        ],
      },
      {
        id: "s3-a3",
        marks: 2,
        prompt: "What is the key difference between validation and verification of data?",
        options: [
          "A) Validation confirms data is in the correct format and range; verification confirms the data was entered accurately",
          "B) Validation is only used for numbers; verification is only used for text",
          "C) Validation runs after compilation; verification runs before",
          "D) Validation and verification describe the same process",
        ],
      },
      {
        id: "s3-a4",
        marks: 2,
        prompt: "Which of the following is a valid reason to use documentation and comments inside program code?",
        options: [
          "A) Comments make the program run faster",
          "B) Documentation helps other developers understand and maintain the code",
          "C) Comments prevent syntax errors at runtime",
          "D) Documentation is only needed for hardware programs",
        ],
      },
      {
        id: "s3-a5",
        marks: 2,
        prompt: "A student writes code that has no syntax errors but produces an incorrect result. What type of error is this?",
        options: [
          "A) Syntax error — the code breaks language rules",
          "B) Compilation error — the code cannot be compiled",
          "C) Logic error — the code runs but produces wrong output",
          "D) Runtime error — the code crashes during execution",
        ],
      },
    ],
    written: [
      {
        id: "s3-b1",
        label: "3.B1",
        marks: 4,
        prompt: "Write simple pseudocode for a program that reads a student mark, checks if it is 50 or above, and prints either 'Pass' or 'Fail'.",
        fields: [
          { id: "s3-b1-answer", label: "Pseudocode", kind: "textarea", rows: 6, placeholder: "START\nINPUT mark\nIF ..." },
        ],
      },
      {
        id: "s3-b2",
        label: "3.B2",
        marks: 6,
        prompt: "Complete the table below by giving ONE example of each control structure.",
        fields: [
          { id: "s3-b2-sequence", label: "Sequence example", kind: "input", placeholder: "Example of sequence" },
          { id: "s3-b2-selection", label: "Selection example", kind: "input", placeholder: "Example of selection" },
          { id: "s3-b2-iteration", label: "Iteration example", kind: "input", placeholder: "Example of iteration" },
        ],
      },
    ],
    diagram: {
      id: "s3-b3",
      label: "3.B3",
      marks: 4,
      prompt: "Refer to Figure A below and answer the related questions.",
      imageUrl: `${BLOCK1_DIAGRAM_BASE}/s3-b3-fig-a-flowchart.svg`,
      caption: "Figure A — Flowchart",
      identifyPrompt: "What type of diagram is shown above? Choose ONE.",
      identifyOptions: [
        "A) Pseudocode listing",
        "B) Flowchart",
        "C) Data Flow Diagram",
        "D) Entity Relationship Diagram",
      ],
      labelFields: [
        { id: "s3-b3-label-1", label: "Label 1", kind: "select", options: ["Start", "Process", "Decision", "End"] },
        { id: "s3-b3-label-2", label: "Label 2", kind: "select", options: ["Start", "Process", "Decision", "End"] },
        { id: "s3-b3-label-3", label: "Label 3", kind: "select", options: ["Start", "Process", "Decision", "End"] },
        { id: "s3-b3-label-4", label: "Label 4", kind: "select", options: ["Start", "Process", "Decision", "End"] },
      ],
    },
  },
  {
    id: "4",
    moduleCode: "14927",
    title: "Section 4 · Module 14927",
    subtitle: "Apply Problem-Solving Strategies",
    totalMarks: 20,
    mcqs: [
      {
        id: "s4-a1",
        marks: 2,
        prompt: "When evaluating possible solutions, what does FEASIBLE mean in this context?",
        options: [
          "A) The solution is the most attractive option",
          "B) The solution can realistically be implemented given available resources, time, and skills",
          "C) The solution is the simplest to explain to management",
          "D) The solution has already been tested in a similar environment",
        ],
      },
      {
        id: "s4-a2",
        marks: 2,
        prompt: "A CET lecturer maps a process step-by-step to find where data errors are introduced. Which tool is she most likely using?",
        options: [
          "A) Pie chart",
          "B) Process map / flow diagram",
          "C) Budget sheet",
          "D) Attendance register",
        ],
      },
      {
        id: "s4-a3",
        marks: 2,
        prompt: "Which of the following best describes root-cause analysis?",
        options: [
          "A) Treating only the visible symptoms of a problem",
          "B) Finding the underlying reason the problem keeps happening",
          "C) Choosing the fastest solution regardless of evidence",
          "D) Recording the problem without acting on it",
        ],
      },
      {
        id: "s4-a4",
        marks: 2,
        prompt: "Which document is most useful for planning who will do what and by when when implementing a solution?",
        options: [
          "A) Implementation plan",
          "B) Password policy",
          "C) Meeting apology letter",
          "D) Invoice",
        ],
      },
      {
        id: "s4-a5",
        marks: 2,
        prompt: "If a solution does not solve the original problem after implementation, what should happen next?",
        options: [
          "A) Ignore the results and close the issue",
          "B) Evaluate the outcome, refine the solution, and repeat the cycle if needed",
          "C) Delete all project notes",
          "D) Blame the users immediately",
        ],
      },
    ],
    written: [
      {
        id: "s4-b1",
        label: "4.B1",
        marks: 4,
        prompt: "Name TWO problem-solving tools and explain when each should be used.",
        fields: [
          { id: "s4-b1-tool-1", label: "Tool 1", kind: "input", placeholder: "e.g. Fishbone diagram" },
          { id: "s4-b1-use-1", label: "When to use it", kind: "textarea", rows: 2, placeholder: "Use case for tool 1" },
          { id: "s4-b1-tool-2", label: "Tool 2", kind: "input", placeholder: "e.g. Decision tree" },
          { id: "s4-b1-use-2", label: "When to use it", kind: "textarea", rows: 2, placeholder: "Use case for tool 2" },
        ],
      },
      {
        id: "s4-b2",
        label: "4.B2",
        marks: 6,
        prompt: "Outline the components of a simple implementation plan for a chosen solution.",
        fields: [
          { id: "s4-b2-answer", label: "Implementation plan outline", kind: "textarea", rows: 6, placeholder: "Include tasks, owners, timeframes, and resources..." },
        ],
      },
    ],
    diagram: {
      id: "s4-b3",
      label: "4.B3",
      marks: 4,
      prompt: "Refer to Figure A below and answer the related questions.",
      imageUrl: `${BLOCK1_DIAGRAM_BASE}/s4-b3-fig-a-fishbone.svg`,
      caption: "Figure A — Fishbone (Ishikawa) Diagram",
      identifyPrompt: "What type of diagram is shown above? Choose ONE.",
      identifyOptions: [
        "A) Pie chart",
        "B) Fishbone (Ishikawa) diagram",
        "C) DFD",
        "D) Gantt chart",
      ],
      labelFields: [
        { id: "s4-b3-label-1", label: "Label 1", kind: "select", options: ["Problem/Effect", "Cause Category", "Sub-cause", "Main Spine"] },
        { id: "s4-b3-label-2", label: "Label 2", kind: "select", options: ["Problem/Effect", "Cause Category", "Sub-cause", "Main Spine"] },
        { id: "s4-b3-label-3", label: "Label 3", kind: "select", options: ["Problem/Effect", "Cause Category", "Sub-cause", "Main Spine"] },
        { id: "s4-b3-label-4", label: "Label 4", kind: "select", options: ["Problem/Effect", "Cause Category", "Sub-cause", "Main Spine"] },
      ],
    },
  },
  {
    id: "5",
    moduleCode: "14915",
    title: "Section 5 · Module 14915",
    subtitle: "Design a Computer Program to Specification",
    totalMarks: 20,
    mcqs: [
      {
        id: "s5-a1",
        marks: 2,
        prompt: "What is the main purpose of desk-checking before coding begins?",
        options: [
          "A) To increase computer speed",
          "B) To manually test the logic of an algorithm before writing code",
          "C) To back up files to the cloud",
          "D) To install the compiler",
        ],
      },
      {
        id: "s5-a2",
        marks: 2,
        prompt: "Which design approach starts with the whole problem and breaks it into smaller modules?",
        options: [
          "A) Bottom-up design",
          "B) Trial-and-error design",
          "C) Top-down design",
          "D) Reactive design",
        ],
      },
      {
        id: "s5-a3",
        marks: 2,
        prompt: "What is a user-defined function?",
        options: [
          "A) A built-in command that cannot be changed",
          "B) A reusable block of code created by the programmer to perform a specific task",
          "C) A hardware device used for processing",
          "D) A diagram used only in networking",
        ],
      },
      {
        id: "s5-a4",
        marks: 2,
        prompt: "Why are program specifications important before coding begins?",
        options: [
          "A) They replace the need for testing",
          "B) They clarify requirements, inputs, outputs, and processing rules",
          "C) They only matter after deployment",
          "D) They are used to decorate the final report",
        ],
      },
      {
        id: "s5-a5",
        marks: 2,
        prompt: "Which document or model best shows the hierarchical structure of program modules?",
        options: [
          "A) Structure diagram",
          "B) Attendance register",
          "C) Email thread",
          "D) Pie chart",
        ],
      },
    ],
    written: [
      {
        id: "s5-b1",
        label: "5.B1",
        marks: 4,
        prompt: "Distinguish between top-down and bottom-up design approaches and give one advantage of each.",
        fields: [
          { id: "s5-b1-top-down", label: "Top-down approach", kind: "textarea", rows: 3, placeholder: "Definition and one advantage" },
          { id: "s5-b1-bottom-up", label: "Bottom-up approach", kind: "textarea", rows: 3, placeholder: "Definition and one advantage" },
        ],
      },
      {
        id: "s5-b2",
        label: "5.B2",
        marks: 6,
        prompt: "Explain what should be included in program specifications before coding begins.",
        fields: [
          { id: "s5-b2-answer", label: "Program specification details", kind: "textarea", rows: 6, placeholder: "Include inputs, outputs, processing, validations, and assumptions..." },
        ],
      },
    ],
    diagram: {
      id: "s5-b3",
      label: "5.B3",
      marks: 4,
      prompt: "Refer to Figure A below and answer the related questions.",
      imageUrl: `${BLOCK1_DIAGRAM_BASE}/s5-b3-fig-a-structure.svg`,
      caption: "Figure A — Structure Diagram",
      identifyPrompt: "What type of diagram is shown above? Choose ONE.",
      identifyOptions: [
        "A) Structure diagram",
        "B) Fishbone diagram",
        "C) Entity relationship diagram",
        "D) Sequence diagram",
      ],
      labelFields: [
        { id: "s5-b3-label-1", label: "Label 1", kind: "select", options: ["Main Module", "Sub-module", "Control Line", "Call/Hierarchy Link"] },
        { id: "s5-b3-label-2", label: "Label 2", kind: "select", options: ["Main Module", "Sub-module", "Control Line", "Call/Hierarchy Link"] },
        { id: "s5-b3-label-3", label: "Label 3", kind: "select", options: ["Main Module", "Sub-module", "Control Line", "Call/Hierarchy Link"] },
        { id: "s5-b3-label-4", label: "Label 4", kind: "select", options: ["Main Module", "Sub-module", "Control Line", "Call/Hierarchy Link"] },
      ],
    },
  },
];
