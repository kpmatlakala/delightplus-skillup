// --- Content block types -----------------------------------------------------

import { module14924LessonFlow } from "./module14924LessonFlow";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; text: string }
  | { type: "callout"; variant: "info" | "tip" | "warning"; text: string };

export type LessonSection = {
  title: string;
  blocks: ContentBlock[];
};

export type LessonOverview = {
  id: string;
  label: string;
  title: string;
  summary: string;
  body: string;
  outcomes?: string[];
  sections?: LessonSection[];
};

// --- Module flow type ---------------------------------------------------------

export type ModuleLessonFlow = {
  moduleId: string;
  saqa: string;
  introTitle: string;
  introSummary: string;
  introBody: string;
  aboutGuide: string;
  lessons: LessonOverview[];
  unitPurpose: string;
  quizPlacement: "end" | "per-lesson";
  quizSummary: string;
  quizPageTitle: string;
  quizPageBody: string;
  assessmentPageTitle: string;
  assessmentPageBody: string;
};

// --- Module flows -------------------------------------------------------------

export const moduleLessonFlows: Record<string, ModuleLessonFlow> = {
  "14910": {
    moduleId: "14910",
    saqa: "14910",
    introTitle: "Introduction: Apply the Principles of Computer Programming",
    introSummary:
      "Get an overview of this unit standard, why the principles of computer programming matter for systems development, and how you will be assessed through activities, workplace tasks and a portfolio of evidence.",
    introBody:
      "In this unit you focus on applying the principles of computer programming in a real systems-development context. You will see how this standard fits into the FETC: IT: Systems Development qualification, what knowledge and skills are expected of you before you start, and how your competence will be judged through activities, assignments and workplace evidence.",
    aboutGuide:
      "This Learner Guide provides a comprehensive overview of 'Apply the principles of Computer Programming' and forms part of a series of Learner Guides developed for the Further Education and Training Certificate: Information Technology: Systems Development (ID 78965, Level 4, 165 credits). The series is structured in modular format to build your skills and knowledge so that you can complete specific tasks effectively and efficiently. Training is presented in workshop modules by a qualified facilitator, and you are expected to participate actively and ask for support when needed.",
    unitPurpose:
      "The purpose of this Unit Standard is to apply the principles of computer programming in a systems development context, including problem analysis, data representation, fundamental programming principles and high-level language concepts.",
    quizPlacement: "end",
    quizSummary: "After completing all four sessions you will take a checkpoint quiz to confirm your understanding across the full unit.",
    quizPageTitle: "Quiz & Lab checkpoint",
    quizPageBody: "The quiz focuses on applying programming principles, recognising correct data representations and choosing appropriate algorithm structures � not just memorising definitions.",
    assessmentPageTitle: "Summative assessment overview",
    assessmentPageBody: "The summative assessment draws together everything practised in this unit standard. You will complete a structured task, submit your work as evidence, and meet the criteria in the assessment brief. A registered assessor uses your portfolio to determine competence.",

    lessons: [
      {
        id: "unit-1",
        label: "Unit 1",
        title: "Learning Unit 1: Apply the principles of Computer Programming",
        summary: "Overview of Unit Standard 14910 � NQF level, credits, field, purpose and assumed learning.",
        body: "Unit Standard 14910 (Level 4, 8 credits). Field: Physical, Mathematical, Computer and Life Sciences. Sub-field: Construction, Information Technology and Computer Sciences. Assumed learning: fundamental maths and English at NQF Level 2, basic PC competency, and an ability to describe the principles of computer programming.",
      },

      // -- SESSION 1 ------------------------------------------------------------
      {
        id: "session-1",
        label: "Session 1",
        title: "Session 1: Operate programming development tools",
        summary: "Use an editor to produce source code, use the syntax checker to find errors, and compile your program.",
        body: "Learn how to use the key tools every programmer relies on.",
        outcomes: [
          "The operation demonstrates the use of the editor of the development tools to produce program source code.",
          "The operation includes the use of the syntax checker of the tools to check for syntax errors.",
          "The operation uses the tool to compile the program source code produced.",
        ],
        sections: [
          {
            title: "1.1 Programming Development Tools & The Editor",
            blocks: [
              { type: "paragraph", text: "A programming tool or software development tool is a program or application that software developers use to create, debug, maintain, or otherwise support other programs. Sometimes called a text editor, it enables you to create and edit text files. There are two general categories of editor:" },
              { type: "list", items: [
                "Line editors � A primitive form where you must first specify the exact line number before making changes.",
                "Screen-oriented editors (full-screen editors) � Enable you to modify any text visible on the display screen by moving the cursor to the desired location.",
              ]},
              { type: "callout", variant: "tip", text: "Modern IDEs like VS Code, IntelliJ and Eclipse are screen-oriented editors with many extra features built on top." },
              { type: "heading", text: "Common Editor Keyboard Shortcuts" },
              { type: "table", headers: ["Command", "Action"], rows: [
                ["Ctrl-A / Home", "Move cursor to the beginning of the current line"],
                ["Ctrl-B / Left Arrow", "Move cursor backwards one character"],
                ["Ctrl-C", "Copy highlighted text to clipboard"],
                ["Ctrl-D / Delete", "Delete the character to the right of the cursor"],
                ["Ctrl-E / End", "Move cursor to the end of the current line"],
                ["Ctrl-F", "Find a sequence of characters (Esc to cancel)"],
                ["Ctrl-G", "Find the next occurrence of the last searched sequence"],
              ]},
            ],
          },
          {
            title: "1.2 The Syntax Checker",
            blocks: [
              { type: "paragraph", text: "In computer science, a syntax error refers to an error in the syntax of a sequence of characters or tokens intended to be written in a particular programming language. For compiled languages, syntax errors occur strictly at compile-time � a program will not compile until all syntax errors are corrected." },
              { type: "callout", variant: "info", text: "For interpreted languages, not all syntax errors can be reliably detected until run-time, making it harder to differentiate a syntax error from a semantic error." },
              { type: "heading", text: "Syntax Error Severity Codes" },
              { type: "table", headers: ["Code", "Severity", "Meaning"], rows: [
                ["U", "Unrecoverable", "Stops the compiler system immediately."],
                ["S", "Severe", "You must correct this � compiler cannot generate code."],
                ["E", "Error", "Compiler makes an assumption; you should verify it."],
                ["W", "Warning", "Possible error, but program is syntactically correct."],
                ["I", "Information", "Draws your attention to something � not necessarily an error."],
              ]},
              { type: "callout", variant: "tip", text: "E-level, W-level and I-level messages can be suppressed. S-level errors must always be corrected before object code can be produced." },
            ],
          },
          {
            title: "1.3 Compiling Source Code",
            blocks: [
              { type: "paragraph", text: "Compilation converts your source code into executable instructions the computer can run. Three categories of code are involved:" },
              { type: "list", items: [
                "User-written code � the statements you type yourself.",
                "Library functions � pre-built functions provided by the language (e.g. LEFT$, LEN, MID$, ABS, SQR in Q-Basic).",
                "User-defined functions � functions you create to encapsulate reusable logic and return a single value.",
              ]},
              { type: "heading", text: "User-Defined Functions in QBasic" },
              { type: "code", text: "FUNCTION FunctionName(x, y, z)\n  REM body of function\n  FunctionName = x + y + z   ' return value\nEND FUNCTION" },
              { type: "heading", text: "Subroutines (SUB � END SUB)" },
              { type: "paragraph", text: "A subroutine (also called a module) is a mini-program inside your main program � a collection of commands that can be executed from anywhere. To add one in QBasic: go to Edit ? New Sub, name it, and place commands between SUB and END SUB. A function is the same as a subroutine except it returns a value." },
              { type: "heading", text: "Local vs Global Variables" },
              { type: "table", headers: ["Scope", "Declaration", "Accessible from"], rows: [
                ["Local", "Inside a module/procedure without SHARED", "Only that module or procedure"],
                ["Global", "In the main module with SHARED attribute", "Any SUB or FUNCTION in the whole module"],
              ]},
            ],
          },
        ],
      },

      // -- SESSION 2 ------------------------------------------------------------
      {
        id: "session-2",
        label: "Session 2",
        title: "Session 2: Data representations in programs",
        summary: "Convert between decimal, binary, octal and hex; understand ASCII; compare data types; use logical operators.",
        body: "Explore how all the information you work with is eventually stored as 0s and 1s.",
        outcomes: [
          "The demonstration applies different number conversion techniques between data types (at least 2).",
          "The demonstration compares different logical data types (at least 3) in a language of choice (incl. pseudo code).",
          "The demonstration differentiates between different internal representations of data types (in ASCII).",
          "The demonstration distinguishes between different logical operators (at least 2).",
        ],
        sections: [
          {
            title: "2.1 Number Systems",
            blocks: [
              { type: "paragraph", text: "There are four number systems commonly used in computing. All four can represent any number and can be perfectly converted between one another without any loss of numeric value." },
              { type: "table", headers: ["System", "Base", "Digits used", "Example counting"], rows: [
                ["Decimal", "10", "0 � 9", "0, 1, 2 � 9, 10, 11 �"],
                ["Binary", "2", "0 � 1", "0, 1, 10, 11, 100, 101 �"],
                ["Octal", "8", "0 � 7", "0, 1 � 7, 10, 11 � 17, 20 �"],
                ["Hexadecimal", "16", "0 � 9, A � F", "0 � 9, A, B, C, D, E, F, 10 �"],
              ]},
              { type: "callout", variant: "tip", text: "Binary numbers are often written with a 0b prefix (e.g. 0b1011) and hexadecimal with 0x (e.g. 0x1B84) to avoid confusion with decimal." },
              { type: "heading", text: "Conversion Reference Table (0 � 15)" },
              { type: "table", headers: ["Decimal", "Hex", "Octal", "Binary"], rows: [
                ["0","0","000","00000000"],["1","1","001","00000001"],["2","2","002","00000010"],
                ["3","3","003","00000011"],["4","4","004","00000100"],["5","5","005","00000101"],
                ["6","6","006","00000110"],["7","7","007","00000111"],["8","8","010","00001000"],
                ["9","9","011","00001001"],["10","A","012","00001010"],["11","B","013","00001011"],
                ["12","C","014","00001100"],["13","D","015","00001101"],["14","E","016","00001110"],
                ["15","F","017","00001111"],
              ]},
            ],
          },
          {
            title: "2.2 Memory Structure & ASCII",
            blocks: [
              { type: "paragraph", text: "ALL types of information stored in a computer are stored internally in the same simple format: a sequence of 0s and 1s. How these bits are interpreted determines whether they represent a number, a character, a pixel colour, or a sound sample." },
              { type: "table", headers: ["Unit", "Size", "Possible values"], rows: [
                ["Bit", "1 bit", "2 values (0 or 1)"],
                ["Byte", "8 bits", "256 values (0 � 255)"],
                ["2-byte word", "16 bits", "~65,000 values"],
              ]},
              { type: "heading", text: "ASCII (American Standard Code for Information Interchange)" },
              { type: "paragraph", text: "ASCII defines 128 symbols and assigns each a unique numeric code (0 � 127). When you save a file as plain text it is stored using ASCII � one byte per character." },
              { type: "table", headers: ["Character", "Decimal", "Binary"], rows: [
                ["A","65","01000001"],["B","66","01000010"],
                ["a","97","01100001"],["b","98","01100010"],
                ["0 (zero)","48","00110000"],["Space","32","00100000"],
              ]},
              { type: "callout", variant: "info", text: "ASCII only covers 128 characters. Unicode (UTF-8) extends this to over 1 million characters and is the modern web standard." },
            ],
          },
          {
            title: "2.3 Data Types",
            blocks: [
              { type: "paragraph", text: "When data is input to a computer system you must analyse it and select appropriate data types for each value." },
              { type: "table", headers: ["Data Type", "Description", "Examples"], rows: [
                ["Integer", "Whole number; no decimal; positive or negative.", "12, -3, 1000000"],
                ["Real (Float)", "Any number with or without a decimal part.", "1.4534, -0.0003, 3.142"],
                ["Currency", "Real formatted with a currency symbol and 2 decimal places.", "�12.45, $5500.00"],
                ["Percentage", "Fractional real displayed as %; 0.5 is shown as 50%.", "25%, 1200%, -5%"],
                ["Alphanumeric (Text)", "Letters, numbers and symbols; shown in speech marks.", "'DOG', 'ABC123'"],
                ["Date / Time", "Formatted date or time; format depends on locale settings.", "25/10/2007, 15:00"],
                ["Boolean (Logical)", "Only TRUE or FALSE. Also shown as YES/NO, ON/OFF, ticked/unticked.", "TRUE, FALSE, ON, OFF"],
              ]},
              { type: "callout", variant: "warning", text: "Date format confusion: 06/09/08 means 6 September in international format but 9 June in American format. Always confirm the convention!" },
            ],
          },
          {
            title: "2.4 Logical Operators",
            blocks: [
              { type: "paragraph", text: "Logical operators are used with Boolean values and return a Boolean result. The three fundamental operators are AND, OR and NOT." },
              { type: "table", headers: ["Operator", "Symbol", "Returns TRUE when�", "Example", "Result"], rows: [
                ["AND", "&&", "BOTH operands are true", "TRUE && FALSE", "FALSE"],
                ["OR", "||", "EITHER operand is true", "TRUE || FALSE", "TRUE"],
                ["NOT", "!", "The single operand is false", "!TRUE", "FALSE"],
              ]},
              { type: "callout", variant: "info", text: "In Fortran the equivalents are .AND., .OR., .NOT., .EQV. (equivalence) and .NEQV. (not equivalence). Priority order: arithmetic ? relational ? logical." },
            ],
          },
        ],
      },

      // -- SESSION 3 ------------------------------------------------------------
      {
        id: "session-3",
        label: "Session 3",
        title: "Session 3: Fundamental programming principles",
        summary: "Write algorithms using pseudocode; describe sequence, selection and loop structures; apply documentation and quality assurance principles.",
        body: "Master the building blocks every programmer uses regardless of language.",
        outcomes: [
          "The demonstration illustrates the differences between the various algorithmic structures of programming languages, using a language of choice (incl. pseudo code).",
          "The demonstration compares good & bad program documentation principles (at least 3), using a language of choice (incl. pseudo code) where needed.",
          "The demonstration illustrates good programming quality assurance principles.",
        ],
        sections: [
          {
            title: "3.1 Algorithms & Pseudocode",
            blocks: [
              { type: "paragraph", text: "An algorithm is the set of steps a programmer writes that will become a program. It is expressed in pseudocode � a structured English-like notation that does not use the keywords of any specific programming language." },
              { type: "list", items: [
                "Written as a list of consecutive phrases.",
                "No flowchart symbols required � arrows can show loops.",
                "Indentation is used to show logic and nesting.",
                "Any programmer should be able to read it regardless of their usual language.",
              ]},
              { type: "callout", variant: "tip", text: "Writing pseudocode before coding saves time during construction and testing. If you have pseudocode, the actual coding becomes straightforward." },
            ],
          },
          {
            title: "3.2 The Three Algorithmic Structures",
            blocks: [
              { type: "heading", text: "Sequence Structure" },
              { type: "paragraph", text: "The simplest structure: one or more actions performed in order with a single entry point and a single exit point. No branches or loops are allowed within a pure sequence." },
              { type: "code", text: "Enter\n  Action 1\n  Action 2\n  Action 3\nExit" },
              { type: "heading", text: "Selection (Decision) Structure" },
              { type: "paragraph", text: "Tests a condition for true or false. If true, one set of actions runs; if false, a different (or no) set of actions runs. Control then exits through a single exit point." },
              { type: "code", text: "Enter\n  Test condition\n  ON TRUE\n    Action A\n  ON FALSE\n    Action B   (can be empty / omitted)\nExit" },
              { type: "heading", text: "Loop (Iteration) Structure" },
              { type: "paragraph", text: "Tests a condition first. If false, control exits immediately without action. If true, one or more actions run and the condition is tested again. This repeats until the condition is false." },
              { type: "code", text: "Enter\n  Test condition ? EXIT on false\n  ON TRUE\n    Action 1\n    Action 2\n    Go back and test again" },
              { type: "callout", variant: "warning", text: "Always ensure one of the actions inside a loop eventually causes the condition to become false � otherwise you create an infinite loop." },
            ],
          },
          {
            title: "3.3 Program Documentation",
            blocks: [
              { type: "paragraph", text: "Documentation is a written detailed description of the programming cycle and specific facts about the program. It must be written continuously throughout design, development and testing � not just at the end." },
              { type: "heading", text: "What good documentation includes" },
              { type: "list", items: [
                "Origin and nature of the problem the program solves.",
                "A brief narrative description of the program.",
                "Logic tools: flowcharts and pseudocode.",
                "Data-record descriptions (inputs, outputs, data types).",
                "Program listings with inline comments.",
                "Testing results, including test data and expected vs actual output.",
              ]},
              { type: "callout", variant: "info", text: "Inline comments in your source code are also considered essential documentation. The next person to maintain your code � or a future version of you � will be grateful." },
            ],
          },
          {
            title: "3.4 Programming Quality Assurance",
            blocks: [
              { type: "paragraph", text: "Software quality has multiple dimensions that must all be considered when developing and reviewing programs:" },
              { type: "table", headers: ["Quality Attribute", "What it means"], rows: [
                ["Effectiveness", "Satisfies user and organisational requirements established during analysis."],
                ["Usability", "The intended users can use the system easily through a proper user-system interface."],
                ["Efficiency", "Hardware resources are used economically to meet requirements."],
                ["Reliability", "Probability that the system operates correctly over a period of time; freedom from defects."],
                ["Maintainability", "Ease of understanding, modifying and testing the system."],
                ["Understandability", "Achieved through readable, well-commented code and thorough documentation."],
                ["Modifiability", "Any part of the system can be changed without affecting other parts."],
                ["Testability", "Ease with which a modification can be verified to have produced a quality result."],
              ]},
              { type: "callout", variant: "tip", text: "ISO 9000 certifies quality assurance during business processes. Many organisations � especially those selling to the EU � require this certification." },
            ],
          },
        ],
      },

      // -- SESSION 4 ------------------------------------------------------------
      {
        id: "session-4",
        label: "Session 4",
        title: "Session 4: High-level language concepts",
        summary: "Understand constants, variables, operators, expressions, modular programming and debugging techniques.",
        body: "Connect the theory to how real high-level programs are structured and maintained.",
        outcomes: [
          "The demonstration explains what is understood by constants and variables.",
          "The demonstration illustrates the concepts of operators and expressions.",
          "The demonstration illustrates different modular programming features and variable passing.",
          "The demonstration applies different debugging techniques.",
        ],
        sections: [
          {
            title: "4.1 Constants and Variables",
            blocks: [
              { type: "paragraph", text: "A variable is a symbol or name that stands for a value that can change during program execution. Every variable has a name (identifier) and a data type. Variables make programs flexible � using variables instead of hard-coded data means the same program can process different data sets." },
              { type: "code", text: "x + y\n' x and y are variables; they can hold any numeric value" },
              { type: "table", headers: ["Feature", "Variable", "Constant"], rows: [
                ["Value", "Changes during execution", "Fixed at definition"],
                ["Flexibility", "High", "Low"],
                ["Use case", "User input, counters, calculated results", "Fixed rates, mathematical constants"],
                ["QBasic example", "total = total + price", "CONST PI = 3.14159"],
              ]},
            ],
          },
          {
            title: "4.2 Operators and Expressions",
            blocks: [
              { type: "paragraph", text: "An operator is a code element that performs an operation on one or more operands (value elements). An expression is a series of value elements combined with operators that yields a new value." },
              { type: "table", headers: ["Type", "Purpose", "Examples"], rows: [
                ["Arithmetic", "Calculations on numeric values.", "+  -  *  /  ^  MOD"],
                ["Comparison (Relational)", "Compare two expressions; return Boolean.", "=  <>  <  >  <=  >="],
                ["Concatenation", "Join multiple strings into one.", "& (VB),  + (Python)"],
                ["Logical / Bitwise", "Combine Boolean or numeric values.", "AND  OR  NOT  XOR"],
              ]},
              { type: "heading", text: "Expression Examples (Visual Basic)" },
              { type: "code", text: "5 + 4                          ' evaluates to 9\n15 * Sqrt(9) + x               ' evaluates to 45 + x\n\"Concat\" & \"ena\" & \"tion\"       ' evaluates to \"Concatenation\"\n763 < 23                       ' evaluates to False\nx = 45 + y * z ^ 2             ' assigns result to x" },
              { type: "callout", variant: "info", text: "When multiple operators appear in one expression, operator precedence determines evaluation order (e.g. ^ before * before + in Visual Basic)." },
            ],
          },
          {
            title: "4.3 Modular Programming",
            blocks: [
              { type: "paragraph", text: "Linear programming writes the entire program in a single block from start to finish � it becomes complex and unmanageable as it grows. Modular programming breaks the program into smaller, self-contained pieces (modules), each responsible for one task." },
              { type: "heading", text: "Advantages of Modular Programming" },
              { type: "list", items: [
                "The same procedure can be reused without rewriting, reducing code length.",
                "Debugging is easier because problems are isolated to specific modules.",
                "Modules can be tested and debugged independently.",
                "Smaller code units are easier to document.",
                "Programs are more readable than equivalent linear code.",
              ]},
              { type: "heading", text: "SUBs vs FUNCTIONs in QBasic" },
              { type: "table", headers: ["Feature", "SUB (Subroutine)", "FUNCTION"], rows: [
                ["Returns a value?", "No", "Yes � stored in the function name"],
                ["Called with", "CALL SubName(args)", "result = FuncName(args)"],
                ["Use case", "Perform an action (e.g. draw a menu)", "Calculate a result (e.g. tax amount)"],
              ]},
              { type: "heading", text: "Local vs Global Variables" },
              { type: "table", headers: ["Scope", "Declaration", "Accessible from"], rows: [
                ["Local", "Inside a module/procedure without SHARED", "Only that module or procedure"],
                ["Global", "Main module with SHARED attribute", "Any SUB or FUNCTION in the whole program"],
              ]},
            ],
          },
          {
            title: "4.4 Debugging Techniques",
            blocks: [
              { type: "paragraph", text: "Debugging means detecting, locating and correcting bugs � usually by running the program with carefully-designed test data that exercises every part of the code, including edge cases." },
              { type: "heading", text: "RTFM � Read The Fine Manual" },
              { type: "paragraph", text: "Before debugging blindly, take time to find and read the relevant documentation for the compiler, make tool, preprocessor, linker and any libraries you are using. Distinguish between tutorial documentation (learn how) and reference documentation (look up details)." },
              { type: "heading", text: "print() Debugging" },
              { type: "paragraph", text: "Printf debugging involves adding temporary output statements (printf / cout / print) throughout the code to track control flow and variable values during execution. While quick, it has serious disadvantages:" },
              { type: "list", items: [
                "Very ad hoc � code must be added and removed for each bug found.",
                "Clutters the normal output of the program.",
                "Slows the program down considerably.",
              ]},
              { type: "callout", variant: "tip", text: "Use a proper debugger (breakpoints, watch expressions, call stack) rather than print statements for systematic, efficient debugging." },
              { type: "heading", text: "ANWB Debugging � Explain It Out Loud" },
              { type: "paragraph", text: "Find a willing bystander (or even a rubber duck!) and explain out loud how your code works. This forces you to re-examine your assumptions and articulate what is really happening. Very often you discover the cause of the bug while explaining it to someone else." },
            ],
          },
        ],
      },
    ],
  },
  "14924": module14924LessonFlow,
  "14920": {
    moduleId: "14920",
    saqa: "14920",
    introTitle: "Participate in Groups and/or Teams",
    introSummary: "Develop skills for contributing effectively to problem-solving teams and functioning as a collaborative team member.",
    introBody: "This module explores team dynamics, group problem-solving disciplines, advantages and disadvantages of group decision-making, and the qualities of an effective team player.",
    aboutGuide: "This learner guide covers participative teamwork for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). You will explore how teams function, how to contribute to team problem-solving, and how to build a collaborative team environment.",
    unitPurpose: "People credited with this unit standard are able to contribute to team problem solving, and contribute to group and/or team function.",
    quizPlacement: "end",
    quizSummary: "Test your understanding of teamwork concepts, the 8D problem-solving process, and effective team member qualities.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all sessions before attempting this quiz. Review the session content as needed.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Provide evidence of your participation and contribution to group and/or team problem-solving activities.",
    lessons: [
      {
        id: "unit-1",
        label: "Block 1 � Day 2",
        title: "Teamwork Foundations: Collaboration, Roles and Problem Solving",
        summary: "Lesson plan for ITSD-14920 Block 1, Day 2 � CET Lecturers Systems Development Training. Duration: 300 minutes (5 hours).",
        body: "UNIT STANDARD: 14920 | NQF LEVEL: 4 | CREDITS: 3 | Block 1 � Day 2 of 5 | Duration: 300 min",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Contributing to Team Problem Solving",
        summary: "Examine common team challenges, the structured problem-solving process, and the Nominal Group Technique (NGT) for structured idea generation.",
        body: "Identify what can go wrong in teams, how to apply the problem-solving cycle, and when to use NGT to ensure all voices are heard in group decision-making.",
        outcomes: [
          "Identify common challenges faced by teams.",
          "Explain how individuals can contribute effectively to team problem-solving.",
          "Apply the Nominal Group Technique (NGT) for structured group idea generation.",
          "Distinguish between advantages and disadvantages of group problem-solving.",
        ],
        sections: [
          {
            title: "1.1 What is a Team?",
            blocks: [
              { type: "paragraph", text: "A team is any group of people organised to work together interdependently and cooperatively to meet the needs of their customers by accomplishing a purpose and goals." },
              { type: "heading", text: "Common Types of Teams" },
              { type: "table", headers: ["Type", "Description"], rows: [
                ["Functional/Departmental", "People from the same work area meeting regularly to solve problems and share information."],
                ["Cross-functional", "People from different departments pulled together to deal with a specific product, issue, or process."],
                ["Self-managing", "Groups that gradually assume full responsibility for self-direction in all aspects of their work."],
              ]},
            ],
          },
          {
            title: "1.2 The 8D Problem-Solving Process",
            blocks: [
              { type: "callout", variant: "info", text: "The 8D approach (Eight Disciplines) is a structured method for addressing problems systematically, from planning through celebration of team success." },
              { type: "ordered-list", items: [
                "Plan � Think about team composition, time frame, and resources needed.",
                "Build the Team � Assemble people with the right skills; create a team charter and build trust.",
                "Describe the Problem � Specify the who, what, when, where, why, how, and how many.",
                "Implement a Temporary Fix � Provide a quick solution while investigating root causes.",
                "Identify and Eliminate the Root Cause � Use Cause and Effect Analysis and Root Cause Analysis.",
                "Verify the Solution � Test with FMEA, Impact Analysis, and Six Thinking Hats.",
                "Implement a Permanent Solution � Roll out, monitor, and confirm no unexpected side effects.",
                "Prevent the Problem from Recurring � Update procedures, policies and training manuals.",
                "Celebrate Team Success � Recognise contributions and conduct a Post-Implementation Review.",
              ]},
            ],
          },
          {
            title: "1.3 Advantages and Disadvantages of Group Problem Solving",
            blocks: [
              { type: "heading", text: "Disadvantages" },
              { type: "list", items: [
                "Competition � members may compete for recognition, creating destructive behaviour.",
                "Conformity � pressure to agree can suppress creative or minority ideas.",
                "Lack of objective direction � discussion can wander without effective leadership.",
                "Time constraints � group problem solving is slower than individual work.",
              ]},
              { type: "heading", text: "Advantages" },
              { type: "list", items: [
                "Greater output � more ideas due to diverse experience, knowledge and values.",
                "Cross-fertilisation � exchanging ideas stimulates imagination and exploration.",
                "Reduced bias � shared responsibility challenges individual biases.",
                "Increased risk-taking � shared accountability encourages considering bold solutions.",
                "Higher commitment � contributors feel greater ownership of the solution.",
                "Better solutions � broad range of knowledge and skills produces higher-quality results.",
              ]},
            ],
          },
          {
            title: "1.4 Nominal Group Technique (NGT)",
            blocks: [
              { type: "paragraph", text: "NGT is a structured brainstorming method that encourages equal contributions from all group members. It is particularly useful when some members are more vocal than others, when there is heated conflict, or when new team members are present." },
              { type: "heading", text: "NGT Procedure" },
              { type: "ordered-list", items: [
                "State the brainstorming subject clearly so everyone understands it.",
                "Each member silently writes down as many ideas as possible (5�10 min).",
                "Each member states one idea in turn; facilitator records on flipchart � no discussion at this stage.",
                "Continue around the group until all members pass.",
                "Discuss each idea for clarification (wording changed only by the originator's consent).",
                "Prioritise ideas using multivoting or list reduction.",
              ]},
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Effective Team Functioning",
        summary: "Explore the benefits of teamwork, characteristics of effective team members, and strategies for building a collaborative team environment.",
        body: "Understand what underpins effective teams, the ten qualities of a high-performing team player, and how roles contribute to both the task and the group dynamic.",
        outcomes: [
          "Describe the benefits of teamwork for reliability, communication, and cooperation.",
          "Identify the characteristics of an effective team member.",
          "Propose strategies to build a collaborative team environment.",
          "Explain the contribution roles that support both work output and team atmosphere.",
        ],
        sections: [
          {
            title: "2.1 Elements of Effective Team Working",
            blocks: [
              { type: "list", items: [
                "Shared goals and a common vision",
                "Accountability � members accountable to each other and to the team leader",
                "Clear roles and responsibilities � prevents conflict and poor resource use",
                "Good communication � effective team meetings, agendas, and follow-up",
                "Strong leadership � using multiple leadership styles suited to the situation",
              ]},
              { type: "callout", variant: "tip", text: "Leaders who use 3�4 leadership styles flexibly (directive, visionary, affiliative, participative, pacesetting, coaching) are more effective than those who rely on a single style." },
            ],
          },
          {
            title: "2.2 Ten Qualities of an Effective Team Player",
            blocks: [
              { type: "table", headers: ["Quality", "What It Means"], rows: [
                ["Demonstrates reliability", "Gets work done consistently; meets commitments."],
                ["Communicates constructively", "Speaks up clearly, directly, and with respect for others."],
                ["Listens actively", "Absorbs ideas without debating every point; receives criticism without defensiveness."],
                ["Functions as active participant", "Comes prepared, volunteers, and takes initiative."],
                ["Shares openly and willingly", "Keeps others informed; participates in informal sharing."],
                ["Cooperates and pitches in", "Works with others despite style and perspective differences."],
                ["Exhibits flexibility", "Adapts to changing conditions; considers different viewpoints."],
                ["Shows commitment to the team", "Demonstrates care for the work and the team's success."],
                ["Works as a problem-solver", "Addresses issues in a solutions-oriented, collaborative manner."],
                ["Treats others with respect", "Professional, courteous, and supportive at all times."],
              ]},
            ],
          },
          {
            title: "2.3 Roles That Contribute to Group Function",
            blocks: [
              { type: "heading", text: "Work Contribution Roles" },
              { type: "list", items: [
                "Initiating � taking initiative, suggesting procedures, providing new energy and ideas.",
                "Seeking/Giving information � requesting and providing facts, data, and preferences.",
                "Questioning � stepping back and challenging the group or task assumptions.",
                "Clarifying � interpreting ideas, linking related contributions from different people.",
                "Summarising � putting contributions into a pattern without adding new information.",
              ]},
              { type: "heading", text: "Atmosphere Contribution Roles" },
              { type: "list", items: [
                "Supporting � remembering others' remarks, being encouraging and responsive.",
                "Observing � noticing group dynamics and commenting constructively.",
                "Mediating � recognising and working through disagreements.",
                "Compromising � yielding a position to help the group move forward.",
              ]},
            ],
          },
        ],
      },
      {
        id: "facilitator-activities",
        label: "Facilitator Notes",
        title: "Facilitator Activities � Block 1, Day 2",
        summary: "Delivery guide, timing, and formative assessment for ITSD-14920 Block 1 Day 2.",
        body: "Total delivery time: 300 minutes (5 hours). Status: Active.",
        sections: [
          {
            title: "Planned Activities",
            blocks: [
              { type: "ordered-list", items: [
                "Icebreaker: Share a positive and a challenging team experience.",
                "Mini-lecture: Common team challenges and the Nominal Group Technique (NGT) process.",
                "Group Task: Draft a Team Charter for your capstone projects.",
                "Paired Exercise: Identify two team challenges from your context and propose practical solutions.",
                "Distribute Team Quick-Start Toolkit (charter template, NGT guide).",
                "Peer Review: Evaluate another group's team charter for clarity and role definition.",
              ]},
              { type: "callout", variant: "warning", text: "Ensure bilingual glossary and offline resource pack are distributed before activities begin." },
            ],
          },
          {
            title: "Formative Assessment",
            blocks: [
              { type: "list", items: [
                "Participation observation checklist.",
                "Submitted worksheets (Activities 1�6) and completed team charter.",
                "Peer review feedback session.",
                "Exit reflection ticket.",
              ]},
            ],
          },
        ],
      },
      {
        id: "learner-activities",
        label: "Activities",
        title: "Learner Activities � Block 1, Day 2",
        summary: "Structured activities mapped to SAQA 14920 assessment criteria.",
        body: "Complete all activities in your workbook. Submit as part of your Portfolio of Evidence.",
        sections: [
          {
            title: "Activity Schedule",
            blocks: [
              { type: "table", headers: ["Activity", "Focus"], rows: [
                ["Activity 1", "Identify common challenges faced by teams."],
                ["Activity 2", "Explain how individuals can contribute effectively to team problem-solving."],
                ["Activity 3", "Assess when the Nominal Group Technique (NGT) is the most suitable approach."],
                ["Activity 4", "Describe the benefits of teamwork."],
                ["Activity 5", "Identify the qualities of an effective team member."],
                ["Activity 6", "Propose strategies to build a collaborative team environment."],
                ["Group Task", "Develop and present a Team Charter with assigned roles."],
              ]},
            ],
          },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        title: "Resources � Block 1, Day 2",
        summary: "Materials required for the Block 1 Day 2 session.",
        body: "Prepare and print all resources before the session begins.",
        sections: [
          {
            title: "Resource List",
            blocks: [
              { type: "list", items: [
                "Team charter templates.",
                "NGT (Nominal Group Technique) guide.",
                "Problem-solving checklist.",
                "Bilingual glossary (Sepedi/Tshivenda key terms).",
                "Printed offline backup materials.",
                "Facilitator and Learner Guides (SAQA 14920).",
              ]},
              { type: "callout", variant: "tip", text: "Duration: 300 minutes (5 hours) | Status: Active" },
            ],
          },
        ],
      },
    ],
  },
  "14918": {
    moduleId: "14918",
    saqa: "14918",
    introTitle: "Principles of Computer Programming",
    introSummary: "Describe the fundamental concepts of computer programming including data representations, algorithmic structures, and quality assurance.",
    introBody: "This module covers the complete foundations of computer programming: from program design techniques and data representations to algorithmic structures, documentation, QA principles, and program design methods.",
    aboutGuide: "This learner guide covers computer programming principles for the FETC: IT Systems Development (SAQA 78965, NQF Level 4). It provides conceptual knowledge for those entering the systems development workplace.",
    unitPurpose: "People credited with this unit standard are able to describe problem analysis techniques, different data representations, basic programming principles, and the principles used in designing a computer program.",
    quizPlacement: "end",
    quizSummary: "Test your knowledge of pseudocode, binary/hexadecimal/octal numbers, data types, algorithmic structures, and QA principles.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all session content before attempting this quiz.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Submit evidence demonstrating your understanding of computer programming principles, including examples of pseudocode, number conversion, and program documentation.",
    lessons: [
      {
        id: "unit-1",
        label: "Block 1 � Day 3",
        title: "Programming Foundations: Logic, Data and Structure",
        summary: "Lesson plan for ITSD-14918 Block 1, Day 3 � CET Lecturers Systems Development Training. Duration: 300 minutes (5 hours).",
        body: "UNIT STANDARD: 14918 | NQF LEVEL: 3 | CREDITS: 5 | Block 1 � Day 3 of 5 | Duration: 300 min",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Program Development Cycle and Design Techniques",
        summary: "Understand the program development cycle, analysis approaches (top-down/bottom-up), and pseudocode conventions.",
        body: "Explore the seven-step program development process, top-down and bottom-up design strategies, modular decomposition, and pseudocode standards.",
        outcomes: [
          "Describe the steps of the program development cycle, including maintenance.",
          "Identify at least two problem analysis techniques (top-down and bottom-up).",
          "Apply pseudocode conventions to represent algorithmic logic for simple programs.",
        ],
        sections: [
          {
            title: "1.1 Program Development Process",
            blocks: [
              { type: "ordered-list", items: [
                "Understand the problem.",
                "Plan the logic of the program.",
                "Code the program using a structured high-level language.",
                "Using a compiler, translate the program into machine language.",
                "Test and debug the program.",
                "Put the program into production.",
                "Maintain and enhance the program.",
              ]},
              { type: "callout", variant: "info", text: "Planning the logic requires developing an algorithm � a finite, ordered set of unambiguous steps that terminates with a solution. Flowcharts and pseudocode are common representations." },
            ],
          },
          {
            title: "1.2 Problem Analysis Techniques",
            blocks: [
              { type: "heading", text: "Top-Down Approach (Deductive / Decomposition)" },
              { type: "paragraph", text: "Starts with an overview of the system, then breaks it down into subsystems at progressively greater levels of detail. Top-down models are often specified with 'black boxes'. Works best for restrictive requirements." },
              { type: "heading", text: "Bottom-Up Approach (Inductive / Synthesis)" },
              { type: "paragraph", text: "Starts with base elements specified in great detail, then links them into larger subsystems. Often used when incorporating existing off-the-shelf components. Minimises cost and increases availability." },
              { type: "heading", text: "Modular Design" },
              { type: "paragraph", text: "Modularity means designing a system divided into functional units (modules) that can be independently developed, tested, and deployed, communicating through well-defined interfaces." },
              { type: "list", items: [
                "Modules have high internal cohesion and loose coupling between each other.",
                "Can be developed and deployed on independent schedules.",
                "Allows teams to work independently and version modules separately.",
              ]},
            ],
          },
          {
            title: "1.3 Pseudocode",
            blocks: [
              { type: "paragraph", text: "Pseudocode is structured English that has been formalised and abbreviated to resemble a high-level programming language. It allows the programmer to focus on logic without worrying about language syntax." },
              { type: "heading", text: "Common Pseudocode Characteristics" },
              { type: "list", items: [
                "Statements are written in simple English.",
                "Each instruction is written on a separate line.",
                "Keywords and indentation signify control structures.",
                "Each set of instructions runs top to bottom with one entry and one exit.",
                "Groups of statements may be formed into named modules.",
              ]},
              { type: "code", text: "// Pseudocode example � simple grade check\nINPUT score\nIF score >= 50 THEN\n    PRINT \"Pass\"\nELSE\n    PRINT \"Fail\"\nEND IF" },
              { type: "callout", variant: "tip", text: "Pseudocode is easier to write than source code and language-independent. It should be clear enough that a human can execute it by hand." },
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Describe Different Data Representations",
        summary: "Understand binary, decimal, hexadecimal, and octal numbering systems, and identify data types and logical operators.",
        body: "Explore how numbers and data are represented inside a computer, and understand the various logical and numeric data types used in programming.",
        outcomes: [
          "Distinguish between different numeric data types (at least 3).",
          "Identify different logical data types.",
          "Distinguish between different internal representations of data types.",
          "Identify different logical operators.",
        ],
        sections: [
          {
            title: "2.1 Numerical Notation Systems",
            blocks: [
              { type: "paragraph", text: "Computers internally store all data as binary. Understanding hexadecimal, octal, and decimal notation is essential for programming and interpreting memory contents." },
              { type: "table", headers: ["System", "Base", "Digits Used", "Example"], rows: [
                ["Binary", "2", "0, 1", "11012 = 13 decimal"],
                ["Decimal", "10", "0�9", "2993 = two thousand nine hundred ninety-three"],
                ["Octal", "8", "0�7", "040 = 32 decimal"],
                ["Hexadecimal", "16", "0�9, A�F", "0x1F = 31 decimal"],
              ]},
              { type: "heading", text: "Hexadecimal Digit Table" },
              { type: "table", headers: ["Hex", "Binary", "Decimal"], rows: [
                ["0�9", "0000�1001", "0�9"],
                ["A", "1010", "10"],
                ["B", "1011", "11"],
                ["C", "1100", "12"],
                ["D", "1101", "13"],
                ["E", "1110", "14"],
                ["F", "1111", "15"],
              ]},
            ],
          },
          {
            title: "2.2 Data Types",
            blocks: [
              { type: "table", headers: ["Type", "Description", "Examples"], rows: [
                ["Integer", "Whole numbers, positive or negative", "12, -3, 1274"],
                ["Real/Float", "Numbers with decimal parts", "1.4534, -0.0003, 3.142"],
                ["Currency", "Formatted real numbers with currency symbol", "�12.45, $5500"],
                ["Percentage", "Fractional real stored as decimal, displayed as %", "50% stored as 0.5"],
                ["Alphanumeric/Text", "Letters, numbers, symbols", "\"DOG\", \"ABC123\""],
                ["Date/Time", "Formatted date or time values", "25/10/2007, 15:00"],
                ["Boolean/Logical", "Only two values: TRUE or FALSE", "TRUE, FALSE, YES, NO, ON, OFF"],
              ]},
              { type: "callout", variant: "info", text: "Some software uses names like 'single', 'double', or 'float' for real numbers. 50% is stored internally as 0.5." },
            ],
          },
          {
            title: "2.3 Logical Operators",
            blocks: [
              { type: "table", headers: ["Operator", "Usage", "Description"], rows: [
                ["Logical AND (&&)", "expr1 && expr2", "Returns true only if both operands are true."],
                ["Logical OR (||)", "expr1 || expr2", "Returns true if either operand is true."],
                ["Logical NOT (!)", "!expr", "Returns false if operand is true; otherwise returns true."],
              ]},
            ],
          },
        ],
      },
      {
        id: "session-3",
        label: "Session 3",
        title: "Describe the Basic Principles of Computer Programming",
        summary: "Explore algorithmic structures, documentation principles, QA, and the relationship between files, records, and fields.",
        body: "Understand how Sequence, Selection, and Loop structures form the basis of all algorithms, and why documentation and quality assurance are essential in professional programming.",
        outcomes: [
          "Identify different algorithmic structures of programming languages.",
          "Identify good program documentation principles (at least 3).",
          "Identify programming quality assurance (QA) principles.",
          "Distinguish between validation and verification.",
          "Explain the relationship between files, records and fields.",
        ],
        sections: [
          {
            title: "3.1 Algorithmic Structures",
            blocks: [
              { type: "paragraph", text: "All programming problems can be solved using three control structures: Sequence, Selection, and Loop (Iteration)." },
              { type: "heading", text: "Sequence Structure" },
              { type: "code", text: "Enter\n  Perform one or more actions in sequence\nExit" },
              { type: "heading", text: "Selection (Decision) Structure" },
              { type: "code", text: "Enter\n  Test a condition for true or false\n  On true:\n    Take one or more actions\n  On false:\n    Take none, one, or more different actions\nExit" },
              { type: "heading", text: "Loop (Iteration) Structure" },
              { type: "code", text: "Enter\n  Test a condition for true or false\n  Exit on false\n  On true:\n    Perform one or more actions\n    Go back and test the condition again" },
              { type: "callout", variant: "warning", text: "Unless something in the loop body causes the condition to eventually return false, the program will be caught in an infinite loop." },
            ],
          },
          {
            title: "3.2 Program Documentation Principles",
            blocks: [
              { type: "heading", text: "Internal Documentation" },
              { type: "list", items: [
                "Block comments at the head of every subprogram (name, purpose, parameter list).",
                "Meaningful variable names � no nonstandard abbreviations.",
                "Brief comment next to every variable and constant declaration.",
                "Comments before or within complex sections of code.",
              ]},
              { type: "heading", text: "External Documentation" },
              { type: "list", items: [
                "Description of what the code does and who wrote it.",
                "Which common algorithms are used.",
                "Dependencies on other programs or libraries.",
                "Input and output format.",
                "Structure charts produced during design.",
              ]},
              { type: "callout", variant: "tip", text: "Write documentation as you write the code. Less is more: document what matters, not every trivial line." },
            ],
          },
          {
            title: "3.3 Software QA Principles",
            blocks: [
              { type: "table", headers: ["QA Attribute", "Description"], rows: [
                ["Effectiveness", "Satisfies user and organisational requirements."],
                ["Usability", "Ease with which intended users can use the system."],
                ["Efficiency", "How economically hardware resources are utilised."],
                ["Reliability", "Probability that the IS will operate correctly over time."],
                ["Maintainability", "Ease of understanding, modifying, and testing."],
                ["Understandability", "Achieved by readable code and comprehensive documentation."],
                ["Modifiability", "Easy to identify and change any part without affecting others."],
                ["Testability", "Ease of demonstrating that a modification produced a quality system."],
              ]},
            ],
          },
          {
            title: "3.4 Verification vs Validation",
            blocks: [
              { type: "table", headers: ["Concept", "Key Question", "Description"], rows: [
                ["Verification", "Are we building the product right?", "Checks that the program conforms to its specification."],
                ["Validation", "Are we building the right product?", "Checks that the program meets the expectations of the customer."],
              ]},
            ],
          },
          {
            title: "3.5 Files, Records, and Fields",
            blocks: [
              { type: "table", headers: ["Term", "Definition", "Analogy"], rows: [
                ["Field", "A single item of data in a record (e.g., Date of Birth)", "The labelled box on a record card"],
                ["Field Name", "The label identifying the field (e.g., 'Phone No.')", "The label next to the box"],
                ["Record", "The set of all data associated with a single object or person", "One filled record card"],
                ["Database", "A collection of records", "A whole box of record cards"],
              ]},
            ],
          },
        ],
      },
      {
        id: "session-4",
        label: "Session 4",
        title: "Describe the Principles Used in Designing a Computer Program",
        summary: "Explore structure charts, decision tools, batch/online processing, and UML techniques for program design.",
        body: "Learn how to design program solutions using structure charts, decision trees and tables, and understand when to use batch versus online processing.",
        outcomes: [
          "Identify methods of specifying problems.",
          "Explain techniques used to research problems in terms of inputs and outputs.",
          "Evaluate the viability of developing computer programs to solve problems.",
          "Explain the features of a computer program that could solve a given problem.",
        ],
        sections: [
          {
            title: "4.1 Structure Charts",
            blocks: [
              { type: "paragraph", text: "A Structure Chart shows the breakdown of a system to its lowest manageable levels. It arranges program modules into a tree � each module represented by a box, lines showing connections and ownership." },
              { type: "list", items: [
                "Top-down design tool � constructed of squares (modules) connected by lines.",
                "Visualises the relationships between modules and subsystems.",
                "Used for structured programming to understand how code is organised.",
              ]},
            ],
          },
          {
            title: "4.2 Decision Trees and Decision Tables",
            blocks: [
              { type: "paragraph", text: "A decision tree is a graphical representation for making a decision or series of decisions. A decision table organises conditions and actions into a four-quadrant table." },
              { type: "table", headers: ["Tool", "Structure", "Best For"], rows: [
                ["Decision Tree", "Tree shape with branches for each condition/action", "Complex decisions with cascading conditions; easier for others to read"],
                ["Decision Table", "Four-quadrant: conditions above, actions below", "Systematic coverage of all condition combinations"],
              ]},
              { type: "callout", variant: "tip", text: "Decision trees are more readable than decision tables and better as a communication tool. Unbalanced Decision Tables offer a compromise between the two." },
            ],
          },
          {
            title: "4.3 Batch vs Online Processing",
            blocks: [
              { type: "paragraph", text: "When designing a program, one of the key choices is whether it should operate as a batch or an online/interactive program." },
              { type: "table", headers: ["Feature", "Batch Processing", "Online Processing"], rows: [
                ["Input method", "Pre-selected via scripts or job control language", "User provides input at runtime"],
                ["Execution", "Runs to completion without manual intervention", "Responds to user requests interactively"],
                ["Best for", "Large-volume data processing, scheduled tasks", "Real-time transactions, user-facing systems"],
              ]},
            ],
          },
          {
            title: "4.4 UML Techniques",
            blocks: [
              { type: "table", headers: ["Diagram", "Purpose"], rows: [
                ["Use Case Diagram", "Models actors and the functionality they interact with; used in requirement analysis."],
                ["Sequence Diagram", "Shows how objects interact in time sequence; depicts messages exchanged to carry out a scenario."],
                ["Structure Chart", "Shows the static breakdown of a system into modules and their relationships."],
              ]},
            ],
          },
        ],
      },
      {
        id: "facilitator-activities",
        label: "Facilitator Notes",
        title: "Facilitator Activities � Block 1, Day 3",
        summary: "Delivery guide, timing, and formative assessment for ITSD-14918 Block 1 Day 3.",
        body: "Total delivery time: 300 minutes (5 hours). Status: Active.",
        sections: [
          {
            title: "Planned Activities",
            blocks: [
              { type: "ordered-list", items: [
                "Interactive pseudocode demonstration (whiteboard or projected IDE).",
                "Live Python coding example using offline environment (VS Code + Python).",
                "Debugging exercise: provide code containing 2�3 deliberate errors for learners to find and fix.",
                "Group discussion: how programming logic applies to teaching in a CET classroom context.",
                "Distribute Programming Quick-Start Toolkit (pseudocode reference card, flowchart templates).",
              ]},
              { type: "callout", variant: "warning", text: "Ensure VS Code and Python are installed and tested on all training laptops before the session. Distribute printed pseudocode reference and flowchart materials as offline backup." },
            ],
          },
          {
            title: "Formative Assessment",
            blocks: [
              { type: "list", items: [
                "Observation checklist: participation and engagement with coding activities.",
                "Completed worksheets: Activities 1�7.",
                "Peer feedback on pseudocode exercises.",
                "Exit reflection ticket.",
              ]},
            ],
          },
        ],
      },
      {
        id: "learner-activities",
        label: "Activities",
        title: "Learner Activities � Block 1, Day 3",
        summary: "Structured activities mapped to SAQA 14918 assessment criteria.",
        body: "Complete all activities in your workbook. Submit as part of your Portfolio of Evidence.",
        sections: [
          {
            title: "Activity Schedule",
            blocks: [
              { type: "table", headers: ["Activity", "Focus"], rows: [
                ["Activity 1", "List and explain the steps in the program maintenance cycle."],
                ["Activity 2", "Write pseudocode for a given simple problem using correct conventions."],
                ["Activity 3", "Identify and distinguish between at least three data types."],
                ["Activity 4", "Explain and apply arithmetic and logical operators in expressions."],
                ["Activity 5", "Describe the three algorithmic control structures (sequence, selection, iteration) with examples."],
                ["Activity 6", "Identify at least three program documentation and QA principles."],
                ["Activity 7", "Distinguish between validation and verification with examples."],
              ]},
            ],
          },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        title: "Resources � Block 1, Day 3",
        summary: "Materials required for the Block 1 Day 3 session.",
        body: "Prepare and print all resources before the session begins.",
        sections: [
          {
            title: "Resource List",
            blocks: [
              { type: "list", items: [
                "Offline development tools: VS Code + Python (pre-installed on training laptops).",
                "Printed pseudocode reference card (one per learner).",
                "Flowchart symbol reference sheet.",
                "Bilingual glossary (Sepedi/Tshivenda key terms).",
                "Printed backup materials (offline contingency).",
                "Facilitator and Learner Guides (SAQA 14918).",
              ]},
              { type: "callout", variant: "tip", text: "Duration: 300 minutes (5 hours) | Status: Active" },
            ],
          },
        ],
      },
    ],
  },
  "14927": {
    moduleId: "14927",
    saqa: "14927",
    introTitle: "Apply Problem Solving Strategies",
    introSummary: "Develop a systematic approach to defining, evaluating and implementing solutions to workplace and personal problems.",
    introBody: "This module provides a structured framework for solving problems: defining and analysing the problem, evaluating possible solutions, and implementing the chosen solution with monitoring and review.",
    aboutGuide: "This learner guide covers problem-solving strategies for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It is designed to develop your ability to systematically tackle problems in any context.",
    unitPurpose: "People credited with this unit standard are able to: Define and analyse the problem; Evaluate solutions; Implement the solution.",
    quizPlacement: "end",
    quizSummary: "Test your understanding of problem definition, Ishikawa diagrams, the SFF matrix, and solution implementation strategies.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all session content before attempting this quiz.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Provide a practical example showing how you have applied the problem-solving process to a real workplace or academic situation.",
    lessons: [
      {
        id: "unit-1",
        label: "Block 1 � Day 4",
        title: "Problem-Solving Strategies: Analyse, Evaluate and Implement",
        summary: "Lesson plan for ITSD-14927 Block 1, Day 4 � CET Lecturers Systems Development Training. Duration: 300 minutes (5 hours).",
        body: "UNIT STANDARD: 14927 | NQF LEVEL: 4 | CREDITS: 4 | Block 1 � Day 4 of 5 | Duration: 300 min",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Define and Analyse the Problem",
        summary: "Identify root causes, create process maps, and use the Ishikawa (fishbone) diagram to analyse workplace problems.",
        body: "Apply structured techniques to define problems clearly, identify contributing factors across people, processes, resources, and environment, and trace causes before jumping to solutions.",
        outcomes: [
          "Define and analyse a workplace problem in terms of its type, parameters, and possible causes.",
          "Identify contributing factors using process mapping and fishbone analysis.",
          "Collect and evaluate relevant facts and data to support problem definition.",
          "Analyse the problem for cross-cultural and contextual implications.",
        ],
        sections: [
          {
            title: "1.1 Defining the Problem",
            blocks: [
              { type: "paragraph", text: "Before solving a problem you must clearly define it. Prepare a statement of the problem and review it with a trusted colleague or supervisor." },
              { type: "heading", text: "Key Questions to Ask" },
              { type: "list", items: [
                "What is the problem?",
                "Is it my problem? Can I solve it?",
                "Is this the real problem, or merely a symptom of a larger one?",
                "If this is an old problem, what is wrong with the previous solution?",
                "Does it need an immediate solution, or can it wait?",
                "What conditions must the solution satisfy?",
              ]},
              { type: "callout", variant: "warning", text: "Be careful not to confuse symptoms with underlying causes. The real problem may be very different from the one you initially think you have." },
            ],
          },
          {
            title: "1.2 The Ishikawa (Fishbone) Diagram",
            blocks: [
              { type: "paragraph", text: "The Ishikawa diagram (also called the fishbone or cause-and-effect diagram) was developed by Kaoru Ishikawa in 1968. It maps potential causes of a problem along lines that connect to a box identifying the problem � the 'fishhead'." },
              { type: "heading", text: "Common Categories of Causes" },
              { type: "table", headers: ["Category", "Example Questions"], rows: [
                ["People", "Are there enough participants? Are their skills adequate?"],
                ["Resources", "Is there adequate funding? Are resources being used effectively?"],
                ["Environment", "Is the environment conducive to problem solving? Is there too much stress?"],
                ["Processes/Procedures", "Are procedures understood? Are they seen as obstacles?"],
                ["Vocabulary/Terminology", "Is there an agreed-upon understanding of key terms?"],
              ]},
              { type: "callout", variant: "tip", text: "Use post-it notes for each cause, then arrange them along the 'spine' of the diagram. Identify/map all causes before considering any solutions." },
            ],
          },
          {
            title: "1.3 Gathering Information",
            blocks: [
              { type: "heading", text: "Key Information Sources" },
              { type: "table", headers: ["Source", "Description"], rows: [
                ["Stakeholders", "Individuals, groups, or organisations affected by the problem or its solution."],
                ["Facts & Data", "Research, experimental results, expert interviews, observed events."],
                ["Boundaries", "Constraints (lack of funds, limited resources) that are difficult to change."],
                ["Opinions & Assumptions", "Recognise bias and prejudice; discard assumptions when proven wrong."],
              ]},
              { type: "paragraph", text: "Map the problem-solving process by examining the time, place, sequence, other people, and personal factors related to the problem. This helps identify patterns that point toward root causes." },
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Evaluate Possible Solutions",
        summary: "Develop alternative solutions, evaluate them against set criteria using the SFF matrix, and select the best option.",
        body: "Generate alternatives through brainstorming, weigh each option against suitability, feasibility, and flexibility criteria, and apply adaptive decision-making strategies when resources or information are limited.",
        outcomes: [
          "Develop alternative solutions using structured brainstorming techniques.",
          "Establish evaluation criteria appropriate to the problem type.",
          "Evaluate alternatives against the SFF matrix (Suitability, Feasibility, Flexibility).",
          "Select the solution that best meets the established criteria and problem requirements.",
        ],
        sections: [
          {
            title: "2.1 Developing Alternatives",
            blocks: [
              { type: "paragraph", text: "Look at the problem from different angles. Brainstorming � rapid noting of alternatives regardless of how silly they seem � is an excellent discovery process." },
              { type: "heading", text: "When Evaluating Alternatives, Note Those That:" },
              { type: "list", items: [
                "Need more information",
                "Are new and untested solutions",
                "Can be combined or eliminated",
                "Will meet opposition from stakeholders",
                "Seem the most promising or exciting",
              ]},
            ],
          },
          {
            title: "2.2 Weighing Alternatives",
            blocks: [
              { type: "heading", text: "SFF Matrix: Suitability, Feasibility & Flexibility" },
              { type: "table", headers: ["Dimension", "What It Assesses"], rows: [
                ["Suitability", "Whether the alternative is ethical, practical, and an adequate response."],
                ["Feasibility", "Resources needed; likelihood of solving the problem and affordability."],
                ["Flexibility", "Ability to respond to unintended consequences or change course once begun."],
              ]},
              { type: "paragraph", text: "Rate each alternative on a scale of 1�3 for each dimension. The alternative with the highest total score is recommended." },
            ],
          },
          {
            title: "2.3 Adaptive Decision Making",
            blocks: [
              { type: "paragraph", text: "Adaptive techniques combine logic and common sense for situations where time, resources, or information are limited." },
              { type: "table", headers: ["Strategy", "Description"], rows: [
                ["Managing by exception", "Focus on critical matters; leave off what is not important."],
                ["Decision staggering", "Make incremental decisions to avoid total commitment to an irreversible choice."],
                ["Exploration", "Probe for a solution with small cautious steps; manage risk through tentative trial."],
                ["Hedging", "Spread risk by avoiding decisions that lock you into a single choice."],
                ["Intuition", "Use gut feelings and experience, but verify with logic before committing."],
                ["Delay", "Postpone committing if an immediate decision is not necessary; sometimes doing nothing is best."],
              ]},
            ],
          },
        ],
      },
      {
        id: "session-3",
        label: "Session 3",
        title: "Implement and Monitor the Solution",
        summary: "Develop an implementation plan, communicate changes to stakeholders, monitor outcomes, and review effectiveness.",
        body: "Create a step-by-step implementation plan with resource allocation and milestones. Monitor progress, consult stakeholders, and review outcomes � modifying the solution if needed.",
        outcomes: [
          "Develop an implementation plan with tasks, timeline, and resource allocation.",
          "Consult affected stakeholders throughout the implementation process.",
          "Trial and monitor the solution for effectiveness and unintended consequences.",
          "Review outcomes and standardise improved practices where required.",
        ],
        sections: [
          {
            title: "3.1 Developing an Implementation Plan",
            blocks: [
              { type: "heading", text: "Key Elements of an Implementation Plan" },
              { type: "list", items: [
                "Step-by-step process or actions for solving the problem.",
                "Communications strategy for notifying stakeholders affected by the change.",
                "Resource identification and allocation (time, money, personnel).",
                "Timeline and milestones for implementation.",
              ]},
            ],
          },
          {
            title: "3.2 Monitoring Progress",
            blocks: [
              { type: "paragraph", text: "Your implementation will only be successful if you monitor the solution, its effects on resources and stakeholders, the timeline, and your overall progress. If results are not as expected, review your options and alternatives." },
              { type: "callout", variant: "tip", text: "Problem-solving is a cycle: if the solution did not work, start the process again. Modify or replace the solution rather than accepting a failed outcome." },
            ],
          },
          {
            title: "3.3 Review Questions",
            blocks: [
              { type: "ordered-list", items: [
                "How effective is the solution?",
                "Did it achieve what I wanted?",
                "What consequences � both good and bad � did it have in my situation?",
              ]},
              { type: "paragraph", text: "Whether or not you achieved your goals, reflect on what you have learned: about yourself, about what you consider important, and how you approach problems in the future." },
            ],
          },
        ],
      },
      {
        id: "facilitator-activities",
        label: "Facilitator Notes",
        title: "Facilitator Activities � Block 1, Day 4",
        summary: "Delivery guide, timing, and formative assessment for ITSD-14927 Block 1 Day 4.",
        body: "Total delivery time: 300 minutes (5 hours). Status: Active.",
        sections: [
          {
            title: "Planned Activities",
            blocks: [
              { type: "ordered-list", items: [
                "Icebreaker discussion: describe a workplace problem you recently encountered.",
                "Mini-lecture: the problem-solving cycle and root-cause identification techniques.",
                "Process mapping activity: map the steps of a common CET administrative process.",
                "Fishbone diagram exercise: identify causes for a given CET lab management problem.",
                "Peer review: exchange and evaluate each other's implementation plans.",
              ]},
              { type: "callout", variant: "warning", text: "Distribute fishbone diagram templates and problem-solving worksheets at the start of the session. Ensure all learners have access to the bilingual glossary." },
            ],
          },
          {
            title: "Formative Assessment",
            blocks: [
              { type: "list", items: [
                "Observation checklist: participation in fishbone and process mapping activities.",
                "Submitted problem analysis plans and worksheets (Activities 1�6).",
                "Peer review feedback session.",
                "Exit reflection ticket.",
              ]},
            ],
          },
        ],
      },
      {
        id: "learner-activities",
        label: "Activities",
        title: "Learner Activities � Block 1, Day 4",
        summary: "Structured activities mapped to SAQA 14927 assessment criteria.",
        body: "Complete all activities in your workbook. Submit as part of your Portfolio of Evidence.",
        sections: [
          {
            title: "Activity Schedule",
            blocks: [
              { type: "table", headers: ["Activity", "Focus"], rows: [
                ["Activity 1", "Identify and explain the root causes of a given workplace problem (people, process, resources, environment)."],
                ["Activity 2", "Create a process map for a given CET administrative scenario."],
                ["Activity 3", "Identify contributing factors to a problem using the Ishikawa (fishbone) diagram."],
                ["Activity 4", "Evaluate two alternative solutions against the SFF matrix criteria."],
                ["Activity 5", "Develop two alternative solutions for a given problem."],
                ["Activity 6", "Create an implementation plan for your chosen solution including timeline and resources."],
                ["Group Task", "Develop a Problem Analysis and Implementation Plan for a CET lab management issue."],
              ]},
            ],
          },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        title: "Resources � Block 1, Day 4",
        summary: "Materials required for the Block 1 Day 4 session.",
        body: "Prepare and print all resources before the session begins.",
        sections: [
          {
            title: "Resource List",
            blocks: [
              { type: "list", items: [
                "Problem-solving process templates.",
                "Fishbone (Ishikawa) diagram templates.",
                "SFF evaluation matrix template.",
                "Bilingual glossary (Sepedi/Tshivenda key terms).",
                "Printed offline backup materials.",
                "Facilitator and Learner Guides (SAQA 14927).",
              ]},
              { type: "callout", variant: "tip", text: "Duration: 300 minutes (5 hours) | Status: Active" },
            ],
          },
        ],
      },
    ],
  },
  "14915": {
    moduleId: "14915",
    saqa: "14915",
    introTitle: "Design a Computer Program",
    introSummary: "Apply fundamental program design techniques and demonstrate an understanding of computer program features and documentation tools.",
    introBody: "This module covers applying program design principles � structure diagrams, decision trees, decision tables, UML techniques, and development tools � to design programs that solve specified problems.",
    aboutGuide: "This learner guide covers computer program design for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It targets learners who can apply programming principles to design complete program solutions.",
    unitPurpose: "Qualifying learners are able to: Apply fundamental principles of procedural programming design techniques; Demonstrate an understanding of the features of a procedural computer program; Operate procedural computer program development tools.",
    quizPlacement: "end",
    quizSummary: "Test your knowledge of decision trees, decision tables, structure charts, UML diagrams, batch/online processing, and development tools.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all session content before attempting this quiz.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Submit design outputs (structure diagram, decision table, pseudocode) for a simple program solving a given specification.",
    lessons: [
      {
        id: "unit-1",
        label: "Block 1 � Day 5",
        title: "Program Design: From Specifications to Structured Solutions",
        summary: "Lesson plan for ITSD-14915 Block 1, Day 5 � CET Lecturers Systems Development Training. Duration: 300 minutes (5 hours).",
        body: "UNIT STANDARD: 14915 | NQF LEVEL: 4 | CREDITS: 8 | Block 1 � Day 5 of 5 | Duration: 300 min",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Structured Program Design Techniques",
        summary: "Apply structure diagrams, decision trees, decision tables, desk-checking, and pseudocode to design programs from specifications.",
        body: "Learn the key design tools used to represent program logic before coding begins. Understand modular decomposition, design verification through desk-checking, and how to document program flow.",
        outcomes: [
          "Apply structured program design techniques including structure diagrams and modular decomposition.",
          "Draw decision trees and create decision tables for a given specification.",
          "Document program designs using pseudocode and flowcharts.",
          "Desk-check design outputs to verify logical accuracy before implementation.",
        ],
        sections: [
          {
            title: "1.1 Program Structure Diagrams",
            blocks: [
              { type: "paragraph", text: "A program structure diagram shows the breakdown of a system to its lowest manageable levels using a top-down, modular design approach. Each module is represented by a box; lines represent relationships between modules." },
              { type: "heading", text: "Key Design Considerations" },
              { type: "list", items: [
                "Determine the application type: mobile, rich client, web, service, or internet application.",
                "Define the deployment strategy: distributed vs non-distributed, firewall configurations.",
                "Choose appropriate technologies based on application requirements and organisational policies.",
              ]},
              { type: "callout", variant: "info", text: "Structure diagrams are a top-down design tool � start with the big picture and decompose into smaller, independent modules." },
            ],
          },
          {
            title: "1.2 Decision Trees",
            blocks: [
              { type: "paragraph", text: "A decision tree is a graphical representation of a decision or series of decisions. It uses a tree-like model with branches for each possible option, allowing visualisation of the consequences of each choice." },
              { type: "heading", text: "Key Points" },
              { type: "list", items: [
                "Clearly lay out the problem so all options can be challenged.",
                "Allow full analysis of possible consequences.",
                "Provide a framework to quantify values of outcomes and their probabilities.",
                "Help make informed decisions based on existing information.",
              ]},
              { type: "heading", text: "How to Build a Decision Tree" },
              { type: "ordered-list", items: [
                "Brainstorm and list all variables/conditions involved in the decision.",
                "Prioritise variables: chronologically, by importance, or both.",
                "Draw the tree with the first condition as the root; add branches for each possible answer.",
                "Continue until all decisions are mapped.",
              ]},
            ],
          },
          {
            title: "1.3 Decision Tables",
            blocks: [
              { type: "paragraph", text: "A decision table is divided into four quadrants: conditions (upper-left), condition combinations (upper-right), possible actions (lower-left), and action selections (lower-right)." },
              { type: "heading", text: "Steps to Develop a Decision Table" },
              { type: "ordered-list", items: [
                "Draw boxes for the four quadrants.",
                "List conditions in the upper-left quadrant (phrased as Y/N questions for a limited entry table).",
                "List possible actions in the lower-left quadrant.",
                "Count possible condition values and multiply to determine number of columns.",
                "Enter all possible condition combinations in upper-right columns.",
                "Mark X in lower-right for each action required by each combination.",
              ]},
              { type: "callout", variant: "tip", text: "Decision tables are excellent for systematic testing: every combination of conditions can be verified against expected actions." },
            ],
          },
          {
            title: "1.4 Desk-Checking for Accuracy",
            blocks: [
              { type: "paragraph", text: "Desk-checking means mentally tracing through the logic of a design to verify it is correct before implementation. Quality attributes to consider during review:" },
              { type: "table", headers: ["Quality Attribute", "What to Check"], rows: [
                ["Security", "Does the design protect data and prevent unauthorised access?"],
                ["Performance", "Will it handle expected volumes within acceptable time?"],
                ["Usability", "Is the interface appropriate for intended users?"],
                ["Interoperability", "Does it integrate with required existing systems?"],
              ]},
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Demonstrate an Understanding of Features of a Computer Program",
        summary: "Model program inputs/outputs using UML, and determine whether batch or online processing best fits the problem.",
        body: "Explore how UML diagrams model program features, and understand the distinction between batch and online program types.",
        outcomes: [
          "Research a problem in terms of inputs and outputs.",
          "Understand the features of a procedural computer program that will solve the given problem.",
          "Outline why a batch or online program will be the best solution to the problem.",
        ],
        sections: [
          {
            title: "2.1 UML Diagrams for Inputs and Outputs",
            blocks: [
              { type: "paragraph", text: "UML (Unified Modelling Language) provides standard diagrams for understanding and communicating how a system or program behaves." },
              { type: "table", headers: ["Diagram Type", "Used By", "Purpose"], rows: [
                ["Use Case Diagram", "Analysts, developers", "Model actors and the functionality they can access; used for requirement analysis."],
                ["Sequence Diagram", "Developers, architects", "Show how objects interact over time; depict messages exchanged to carry out a scenario."],
                ["Structure Chart", "Software architects", "Show the breakdown of a system into modules and the connections between them."],
              ]},
            ],
          },
          {
            title: "2.2 Top-Down vs Bottom-Up Design",
            blocks: [
              { type: "table", headers: ["Approach", "How It Works", "When to Use"], rows: [
                ["Top-Down", "Start with the big picture; decompose into sub-systems layer by layer.", "Systems with complex requirements; when full spec is known upfront."],
                ["Bottom-Up", "Start with detailed base elements; assemble them progressively into larger systems.", "When using existing off-the-shelf components; minimise cost."],
              ]},
            ],
          },
          {
            title: "2.3 Batch vs Online Programs",
            blocks: [
              { type: "paragraph", text: "Choosing between batch and online processing is a key program design decision." },
              { type: "table", headers: ["Feature", "Batch", "Online"], rows: [
                ["Input", "Pre-selected from files/scripts", "Entered by user at runtime"],
                ["Execution", "Runs to completion autonomously", "Responds interactively to user requests"],
                ["Scheduling", "Can run during off-peak hours", "Must run whenever users need it"],
                ["Best for", "Payroll, bulk data, reports", "Banking transactions, order entry, queries"],
              ]},
            ],
          },
        ],
      },
      {
        id: "session-3",
        label: "Session 3",
        title: "Document Program Designs Using Development Tools",
        summary: "Use development tool editors, syntax checkers, and compilers to produce and validate procedural program source code.",
        body: "Learn to use editor commands, understand syntax error messages, and trace how source code is compiled into an executable program.",
        outcomes: [
          "Use the editor of development tools to produce program source code.",
          "Use the syntax checker to identify and correct syntax errors.",
          "Use the tool to compile the procedural source code produced.",
        ],
        sections: [
          {
            title: "3.1 Text Editors",
            blocks: [
              { type: "paragraph", text: "A programming tool or text editor enables developers to create and edit source code. Editors fall into two categories: line editors (primitive, require line-number specification) and screen-oriented / full-screen editors (modern, cursor-based editing)." },
              { type: "heading", text: "Common Editor Commands" },
              { type: "table", headers: ["Command", "Description"], rows: [
                ["Ctrl-A / Home", "Moves cursor to beginning of current line."],
                ["Ctrl-E / End", "Moves cursor to end of current line."],
                ["Ctrl-B / Left Arrow", "Moves cursor backwards one character."],
                ["Ctrl-C", "Copies highlighted text to clipboard."],
                ["Ctrl-D / Delete", "Deletes character to the right of cursor."],
                ["Ctrl-F", "Find a sequence of characters (prompts for search string)."],
                ["Ctrl-G", "Find next occurrence of the last search string."],
              ]},
            ],
          },
          {
            title: "3.2 Syntax Checking",
            blocks: [
              { type: "paragraph", text: "A syntax error is an error in the syntax of a sequence of characters intended to be written in a particular programming language. For compiled languages, syntax errors occur at compile-time and must ALL be fixed before the program will run." },
              { type: "code", text: "[Line of source code]\nnnnn-s code**** (mmmm)**\nmessage\n\nWhere:\n  nnnn = message number\n  mmmm = page where previous error occurred\n  message = description of the error" },
              { type: "callout", variant: "info", text: "For compiled languages, ALL syntax errors must be corrected before a program will compile. For interpreted languages, some errors may only be detected at runtime." },
            ],
          },
          {
            title: "3.3 Compilation Process",
            blocks: [
              { type: "paragraph", text: "A compiler translates the entire source program at one time through the following stages:" },
              { type: "ordered-list", items: [
                "Source module � your original source code (checked for syntax errors).",
                "Object module � the translated machine-language code produced by the compiler.",
                "Link/load phase � pre-written library programs are added to the object module.",
                "Load module � the final executable that can be run by the computer.",
              ]},
            ],
          },
        ],
      },
      {
        id: "facilitator-activities",
        label: "Facilitator Notes",
        title: "Facilitator Activities � Block 1, Day 5",
        summary: "Delivery guide, timing, and formative assessment for ITSD-14915 Block 1 Day 5.",
        body: "Total delivery time: 300 minutes (5 hours). Status: Active.",
        sections: [
          {
            title: "Planned Activities",
            blocks: [
              { type: "ordered-list", items: [
                "Icebreaker discussion: what is the most complex program or system you have encountered?",
                "Mini-lecture: introduction to structured program design techniques.",
                "Decision table group activity: build a decision table for a CET learner grading rule.",
                "Desk-checking exercise: trace through a given pseudocode solution to find logic errors.",
                "Syntax checker demonstration using VS Code offline environment.",
                "Peer review: exchange and evaluate Programme Design Documents.",
              ]},
              { type: "callout", variant: "warning", text: "Ensure offline development tools are installed before the session. Distribute design templates and decision tree/table example sheets at the start." },
            ],
          },
          {
            title: "Formative Assessment",
            blocks: [
              { type: "list", items: [
                "Observation checklist: participation in design and desk-checking activities.",
                "Completed design documents (Activities 1�9).",
                "Peer review feedback session.",
                "Exit reflection ticket.",
              ]},
            ],
          },
        ],
      },
      {
        id: "learner-activities",
        label: "Activities",
        title: "Learner Activities � Block 1, Day 5",
        summary: "Structured activities mapped to SAQA 14915 assessment criteria.",
        body: "Complete all activities in your workbook. Submit your Program Design Document as part of your Portfolio of Evidence.",
        sections: [
          {
            title: "Activity Schedule",
            blocks: [
              { type: "table", headers: ["Activity", "Focus"], rows: [
                ["Activity 1", "Identify and explain key architecture considerations for a given application type."],
                ["Activity 2", "Draw a decision tree for a given business rule scenario."],
                ["Activity 3", "Create a sequence diagram for a simple interaction (e.g., user login flow)."],
                ["Activity 4", "Determine whether batch or online processing is most appropriate for two given scenarios."],
                ["Activity 5", "Identify syntax errors in a given code snippet using a syntax checker."],
                ["Activity 6", "Write a user-defined function for a given specification in pseudocode."],
                ["Activity 7", "List and explain the stages of the program maintenance cycle."],
                ["Activity 8", "Desk-check a given design output and document all errors found."],
                ["Activity 9", "Explain the difference between desk-checking and compiling."],
                ["Group Task", "Develop a Program Design Document for a CET Lab Booking Tool."],
              ]},
            ],
          },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        title: "Resources � Block 1, Day 5",
        summary: "Materials required for the Block 1 Day 5 session.",
        body: "Prepare and print all resources before the session begins.",
        sections: [
          {
            title: "Resource List",
            blocks: [
              { type: "list", items: [
                "Program design templates (structure diagram, decision table, pseudocode).",
                "Decision tree and decision table example sheets.",
                "Offline development tools: VS Code (pre-installed).",
                "Bilingual glossary (Sepedi/Tshivenda key terms).",
                "Printed backup design materials.",
                "Facilitator and Learner Guides (SAQA 14915).",
              ]},
              { type: "callout", variant: "tip", text: "Duration: 300 minutes (5 hours) | Status: Active" },
            ],
          },
        ],
      },
    ],
  },
  "14908": {
    moduleId: "14908",
    saqa: "14908",
    introTitle: "Testing IT Systems",
    introSummary: "Select, apply, and document test procedures to verify that IT systems meet given specifications.",
    introBody: "This module covers the full testing lifecycle: selecting an appropriate test procedure, applying it, collecting and recording data, and preparing formal test documentation.",
    aboutGuide: "This learner guide covers testing IT systems for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It targets learners involved in software and hardware testing and quality assurance.",
    unitPurpose: "Qualifying learners are able to: Select an appropriate test procedure; Apply the test procedure; Collect and record data; Prepare the testing.",
    quizPlacement: "end",
    quizSummary: "Test your understanding of test phases, test types, diagnostic tools, and test documentation.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all session content before attempting this quiz.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Submit a completed test plan and test results for a system tested against given specifications.",
    lessons: [
      {
        id: "unit-1",
        label: "Unit 1",
        title: "Demonstrate an Understanding of Testing IT Systems Against Given Specifications",
        summary: "Overview of IT systems testing principles and procedures.",
        body: "UNIT STANDARD: 14908 | NQF LEVEL: 4 | CREDITS: 6 | FIELD: Physical, Mathematical, Computer and Life Sciences",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Select an Appropriate Test Procedure",
        summary: "Understand the purpose of testing and identify the correct test procedure depending on the mode of testing required.",
        body: "Testing is the process of exercising a product to identify differences between expected and actual behaviour. Learn how to select the right approach for hardware and software testing.",
        outcomes: [
          "Explain the purpose of testing an IT system.",
          "Identify the correct test procedure for a given hardware testing scenario.",
          "Identify the correct test procedure for a given software testing scenario.",
          "Identify factors that affect the selection of a test procedure.",
        ],
        sections: [
          {
            title: "1.1 Purpose of Testing",
            blocks: [
              { type: "paragraph", text: "Testing is the process of exercising a product to identify differences between expected and actual behaviour, commonly called bugs or defects. The fundamental purpose of testing is to find defects." },
              { type: "callout", variant: "info", text: "Testing does not prove that no errors exist � it can only show that errors exist. A system that passes all tests may still contain defects not covered by test cases." },
              { type: "heading", text: "Why Testing Matters" },
              { type: "list", items: [
                "Verifies the system meets its specification before users depend on it.",
                "Reduces the cost of fixing defects (catching them early is cheaper than post-deployment fixes).",
                "Builds confidence in the system being delivered.",
                "Protects business reputation and supports contractual obligations.",
              ]},
            ],
          },
          {
            title: "1.2 Hardware Test Phases",
            blocks: [
              { type: "paragraph", text: "Hardware goes through multiple test phases during development and deployment:" },
              { type: "table", headers: ["Test Phase", "Description"], rows: [
                ["Prototype Testing", "Testing of early hardware models to identify fundamental design issues."],
                ["Development Acceptance Testing (DAT)", "Testing by the development team to validate the hardware meets design specifications."],
                ["Factory Acceptance Testing (FAT)", "Formal testing at the factory before shipment to verify against customer requirements."],
                ["Site Acceptance Testing", "Testing after delivery to the customer's site to verify hardware functions in its intended environment."],
                ["Burn-In Testing", "Running hardware continuously for a period to detect early-life failures."],
                ["Final Acceptance Testing", "Final verification by the customer that all requirements are met before going live."],
              ]},
            ],
          },
          {
            title: "1.3 Software Test Procedures",
            blocks: [
              { type: "paragraph", text: "Software test procedures determine how software is exercised to find defects. The main types are:" },
              { type: "list", items: [
                "Black-box testing � tests functionality without knowledge of internal code structure.",
                "White-box testing � uses knowledge of internal code to design test cases.",
                "Grey-box testing � tests with partial knowledge of internals.",
                "Regression testing � repeats previous tests after changes to confirm no existing functionality is broken.",
              ]},
            ],
          },
          {
            title: "1.4 Factors Affecting Test Selection",
            blocks: [
              { type: "paragraph", text: "When selecting a test procedure, consider:" },
              { type: "list", items: [
                "Available time and resources.",
                "Risk level: higher-risk components require more rigorous testing.",
                "System complexity and size.",
                "Whether the test environment mirrors the production environment.",
                "Skills available in the testing team.",
              ]},
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Apply the Test Procedure",
        summary: "Follow the steps of a test approach, understand test phases, and categorise testing types.",
        body: "Learn to execute a structured test approach and apply the appropriate phase (SIT, parallel, load, model office) for a given scenario.",
        outcomes: [
          "Follow the steps of the test approach for a given scenario.",
          "Apply the appropriate test phase for a given scenario.",
          "Explain the testing types used to verify an IT system.",
        ],
        sections: [
          {
            title: "2.1 Test Approach Steps",
            blocks: [
              { type: "paragraph", text: "A structured test approach ensures thorough coverage. The steps are:" },
              { type: "ordered-list", items: [
                "Define the test objectives and scope.",
                "Design test cases that cover all requirements.",
                "Prepare the test environment (hardware, software, test data).",
                "Execute the test cases.",
                "Record actual results and compare with expected results.",
                "Log and track all defects found.",
                "Retest fixed defects (regression testing).",
                "Report test results and obtain sign-off.",
              ]},
            ],
          },
          {
            title: "2.2 Test Phases",
            blocks: [
              { type: "table", headers: ["Test Phase", "Description"], rows: [
                ["System Integration Test 1 (SIT1)", "Test individual components and modules in isolation."],
                ["System Integration Test 2 (SIT2)", "Test how integrated components interact as a system."],
                ["Parallel Testing", "Run the new system alongside the old system; compare outputs to validate."],
                ["Load Testing", "Test the system under expected and peak load conditions."],
                ["Model Office Testing", "Simulate real business environment with end users to validate usability and workflows."],
              ]},
            ],
          },
          {
            title: "2.3 Testing Types",
            blocks: [
              { type: "table", headers: ["Test Type", "What It Checks"], rows: [
                ["Functional Testing", "Whether the system performs its intended functions."],
                ["Performance Testing", "System responsiveness, throughput, and scalability under load."],
                ["Security Testing", "Vulnerabilities, unauthorised access, data exposure risks."],
                ["Usability Testing", "Ease of use, learnability, and satisfaction from end-user perspective."],
                ["Compatibility Testing", "Whether system works across different browsers, OS, devices."],
                ["Regression Testing", "That previously working features still work after changes."],
              ]},
            ],
          },
        ],
      },
      {
        id: "session-3",
        label: "Session 3",
        title: "Collect and Record Data",
        summary: "Use diagnostic tools and understand the resources needed to collect test data in a lab environment.",
        body: "Learn about diagnostic data adapters and the resource types required to set up a controlled test environment.",
        outcomes: [
          "Explain what a diagnostic data adapter is and how it is used.",
          "Identify the resource types used in test data collection.",
          "Describe the characteristics of a lab testing environment.",
        ],
        sections: [
          {
            title: "3.1 Diagnostic Data Adapters",
            blocks: [
              { type: "paragraph", text: "A diagnostic data adapter (DDA) attaches additional information to a test run in Microsoft Test Manager. A DDA can affect the performance of the machine being tested and collect data about the test environment." },
              { type: "heading", text: "Common Diagnostic Data Adapters" },
              { type: "list", items: [
                "System Information � collects details about the test machine's hardware and OS.",
                "IntelliTrace � records program execution steps for post-test analysis.",
                "Event Log � captures Windows event log entries during the test.",
                "Screen Recorder � records screen activity during the test run.",
                "Code Coverage � measures which lines of code were executed by the tests.",
              ]},
            ],
          },
          {
            title: "3.2 Resource Types for Test Data Collection",
            blocks: [
              { type: "table", headers: ["Resource Type", "Description"], rows: [
                ["Test Machines", "Physical or virtual machines matching the target environment specifications."],
                ["Test Data", "Realistic input data sets including boundary values, invalid data, and production-like data."],
                ["Test Tools", "Automated test runners, defect tracking systems, test management tools."],
                ["Personnel", "Test engineers, business analysts, end users (for UAT)."],
                ["Documentation", "Test plans, test cases, requirement specifications as reference."],
              ]},
            ],
          },
          {
            title: "3.3 Lab Testing Environment",
            blocks: [
              { type: "paragraph", text: "A lab environment is a controlled space dedicated to testing, separate from production. Key characteristics:" },
              { type: "list", items: [
                "Mirrors production hardware, OS, and network topology as closely as possible.",
                "Can be reset to a known baseline state between test runs.",
                "Access controlled to prevent unauthorised changes during testing.",
                "Contains all required software versions (system under test + dependencies).",
              ]},
              { type: "callout", variant: "tip", text: "Always document the exact lab configuration used for each test run � this allows defects to be reliably reproduced." },
            ],
          },
        ],
      },
      {
        id: "session-4",
        label: "Session 4",
        title: "Prepare the Testing",
        summary: "Plan and document the testing process using appropriate testing documentation types.",
        body: "Understand the planning categories and documentation required to prepare a formal test before execution.",
        outcomes: [
          "Identify the planning categories for preparing a test.",
          "Produce the appropriate test documentation for a given scenario.",
        ],
        sections: [
          {
            title: "4.1 Planning Categories",
            blocks: [
              { type: "table", headers: ["Planning Category", "What It Covers"], rows: [
                ["Scope Definition", "What will and will not be tested; boundaries of the testing effort."],
                ["Resource Planning", "Staff, hardware, software, and test tool requirements."],
                ["Schedule Planning", "Timeline for each test phase; entry and exit criteria."],
                ["Risk Management", "Identify testing risks and mitigation strategies."],
                ["Environmental Planning", "Test lab setup, configurations, and access management."],
              ]},
            ],
          },
          {
            title: "4.2 Test Documentation Types",
            blocks: [
              { type: "paragraph", text: "The following documents are typically produced when preparing and conducting a formal test:" },
              { type: "list", items: [
                "Test Plan � master document describing scope, approach, resources, schedule, and responsibilities.",
                "Test Case Specification � detailed inputs, execution steps, expected outputs, and pass/fail criteria for each test.",
                "Test Script � step-by-step instructions for executing each test case.",
                "Test Data � the specific data values to be used during test execution.",
                "Test Log � a record of all test activities during execution (what ran, when, who ran it).",
                "Defect Report � documents each defect found, its severity, steps to reproduce, and resolution status.",
                "Test Summary Report � final document summarising test results, coverage, and sign-off recommendations.",
              ]},
            ],
          },
        ],
      },
    ],
  },
  "120379": {
    moduleId: "120379",
    saqa: "120379",
    introTitle: "Work as a Project Team Member",
    introSummary: "Build and function effectively as a member of a project team in an IT environment.",
    introBody: "This module covers how project teams are formed and function, how team members communicate, resolve conflict, and stay motivated throughout a project.",
    aboutGuide: "This learner guide covers project team membership for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It targets learners who work in project-based environments and need to collaborate effectively.",
    unitPurpose: "Qualifying learners are able to: Explain the purpose and characteristics of a project team; Select and work effectively as a team member; Communicate, resolve conflict, and apply motivation strategies within a team.",
    quizPlacement: "end",
    quizSummary: "Test your knowledge of team formation, team member roles, communication, conflict resolution, and motivation.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all session content before attempting this quiz.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Submit evidence of contributing to a project team: meeting notes, role descriptions, or a reflection on team dynamics.",
    lessons: [
      {
        id: "unit-1",
        label: "Unit 1",
        title: "Work as a Project Team Member",
        summary: "Overview of project team membership principles.",
        body: "UNIT STANDARD: 120379 | NQF LEVEL: 4 | CREDITS: 8 | FIELD: Business, Commerce and Management Studies � Project Management",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Build and Function in a Project Team",
        summary: "Understand the difference between groups and teams, select team members, communicate effectively, resolve conflict, and maintain motivation.",
        body: "Effective project teams do not form accidentally. Learn how team membership is selected, how communication works, how conflict is resolved, and how motivation is sustained.",
        outcomes: [
          "Distinguish between a group and a team.",
          "Explain why specific individuals are selected for a project team.",
          "Describe effective communication strategies within a team.",
          "Apply conflict resolution steps in a team setting.",
          "Discuss motivation strategies for project team members.",
        ],
        sections: [
          {
            title: "1.1 Groups vs Teams",
            blocks: [
              { type: "paragraph", text: "A group is two or more people who interact with one another, share similar characteristics, and collectively have a sense of unity. A team is a group that works interdependently toward a shared goal." },
              { type: "table", headers: ["Characteristic", "Group", "Team"], rows: [
                ["Goal", "Individual goals; may be different", "Shared, common goal"],
                ["Accountability", "Individual", "Mutual and individual"],
                ["Output", "Sum of individual contributions", "Collective work product"],
                ["Skills", "Random or varied", "Complementary skills by design"],
                ["Leadership", "Single, appointed leader", "Shared or rotating leadership"],
              ]},
            ],
          },
          {
            title: "1.2 Selecting Team Members",
            blocks: [
              { type: "paragraph", text: "Project team members should be selected based on the skills needed to accomplish the project objectives. Key selection criteria and benefits:" },
              { type: "table", headers: ["Selection Criterion", "Why It Matters"], rows: [
                ["Technical skills match", "Ensures the team has the capability to deliver the technical work."],
                ["Availability", "Member can commit adequate time to the project."],
                ["Prior experience", "Reduces learning curve and improves quality of output."],
                ["Interpersonal skills", "Enables effective collaboration and communication."],
                ["Diversity of perspective", "Brings varied viewpoints that improve decision-making and innovation."],
              ]},
            ],
          },
          {
            title: "1.3 Team Communication",
            blocks: [
              { type: "paragraph", text: "Effective communication is the foundation of successful teamwork. Common communication barriers and strategies to overcome them:" },
              { type: "table", headers: ["Barrier", "Strategy to Overcome"], rows: [
                ["Language differences", "Use plain language; provide written summaries."],
                ["Information overload", "Prioritise messages; use structured agendas for meetings."],
                ["Poor listening", "Practice active listening; summarise what was heard."],
                ["Hierarchical hesitation", "Create a safe environment where all voices are encouraged."],
                ["Remote/distributed teams", "Use regular video check-ins and shared collaboration tools."],
              ]},
              { type: "callout", variant: "tip", text: "A simple rule for team meetings: one person speaks at a time, and everyone must leave with a clear understanding of their next actions." },
            ],
          },
          {
            title: "1.4 Conflict Resolution",
            blocks: [
              { type: "paragraph", text: "Conflict is a normal part of team dynamics. Unresolved conflict reduces performance; constructively managed conflict can improve team outcomes." },
              { type: "heading", text: "Conflict Resolution Steps" },
              { type: "ordered-list", items: [
                "Acknowledge that a conflict exists and that it needs to be addressed.",
                "Identify the needs and concerns of all parties involved.",
                "Look for common ground and shared interests.",
                "Generate multiple possible solutions collaboratively.",
                "Agree on the best solution and document the outcome.",
                "Follow up to verify the solution is working.",
              ]},
              { type: "callout", variant: "warning", text: "Avoiding conflict does not resolve it. Unaddressed conflict escalates and can damage team relationships permanently." },
            ],
          },
          {
            title: "1.5 Motivation Strategies",
            blocks: [
              { type: "paragraph", text: "Motivated team members are more productive and deliver higher quality. Four basic human needs that drive motivation in a workplace:" },
              { type: "table", headers: ["Basic Need", "How to Address It"], rows: [
                ["Achievement", "Set clear, attainable goals and celebrate successes."],
                ["Recognition", "Acknowledge contributions publicly and sincerely."],
                ["Responsibility", "Give team members ownership of meaningful tasks."],
                ["Growth", "Provide opportunities to learn new skills and take on challenges."],
              ]},
              { type: "heading", text: "Coaching and Loyalty" },
              { type: "paragraph", text: "A team leader who coaches rather than commands builds loyalty. Coaching involves listening, asking questions, and helping team members discover their own solutions � rather than simply giving orders. Loyal team members are more likely to go beyond the minimum requirement and support the team through challenges." },
            ],
          },
        ],
      },
    ],
  },
  "14930": {
    moduleId: "14930",
    saqa: "14930",
    introTitle: "Internet Software Development",
    introSummary: "Understand the principles of developing software for the internet, including network protocols, user interface methods, copyright, and security.",
    introBody: "This module covers network issues of internet applications, user interface technologies (ASP, browser-based vs rich clients), copyright and ownership, and internet security and version control.",
    aboutGuide: "This learner guide covers internet software development for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It targets learners working in or entering the web application development space.",
    unitPurpose: "Qualifying learners are able to: Explain network issues related to internet applications; Demonstrate user interface methods for internet applications; Show awareness of copyright and ownership; Explain version control and security issues.",
    quizPlacement: "end",
    quizSummary: "Test your knowledge of TCP/IP, session IDs, ASP, browser vs rich clients, copyright, and internet security.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all session content before attempting this quiz.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Submit a web application design document addressing network, UI, copyright, and security considerations.",
    lessons: [
      {
        id: "unit-1",
        label: "Unit 1",
        title: "Demonstrate an Understanding of the Principles of Developing Software for the Internet",
        summary: "Overview of internet software development principles.",
        body: "UNIT STANDARD: 14930 | NQF LEVEL: 4 | CREDITS: 3 | FIELD: Physical, Mathematical, Computer and Life Sciences",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Explain Network Issues Related to Internet Applications",
        summary: "Understand session-less HTTP, TCP/IP, session IDs, and bandwidth limitations affecting web application design.",
        body: "Internet applications operate over stateless HTTP. Learn what this means for developers, how session IDs manage state, and how limited bandwidth influences application design decisions.",
        outcomes: [
          "Identify that the Internet uses a session-less network protocol.",
          "List the implications of session-less application development.",
          "Identify that the Internet uses limited bandwidth.",
          "List the implications of limited bandwidth on application design.",
        ],
        sections: [
          {
            title: "1.1 Network Protocols and TCP/IP",
            blocks: [
              { type: "paragraph", text: "A protocol is a set of rules or language used by computers and networking devices to communicate. TCP/IP (Transmission Control Protocol/Internet Protocol) is the suite of communications protocols used to connect hosts on the Internet." },
              { type: "table", headers: ["Protocol Model", "Layers", "Use"], rows: [
                ["TCP/IP", "4 layers (Application, Transport, Internet, Network Access)", "Used for the Internet; de facto standard."],
                ["ISO OSI", "7 layers (Application, Presentation, Session, Transport, Network, Data Link, Physical)", "International standard reference model."],
              ]},
              { type: "callout", variant: "info", text: "TCP/IP and ISO OSI are very similar at the Network and Transport layers. TCP/IP largely delegates the link and physical layers to ISO OSI protocols." },
            ],
          },
          {
            title: "1.2 Session-Less HTTP and Session Management",
            blocks: [
              { type: "paragraph", text: "HTTP is stateless � there is no built-in facility to identify or track a particular user between requests. Application developers must manage state explicitly using session IDs." },
              { type: "heading", text: "Three Methods to Deliver Session IDs" },
              { type: "table", headers: ["Method", "Advantage", "Risk"], rows: [
                ["URL-embedded session ID", "Works even with cookies disabled; easy to share.", "Exposed in browser history, logs, and referrer headers."],
                ["Hidden form POST field", "Less obvious than URL; safer to share URLs.", "Requires JavaScript; more complex pages."],
                ["Cookie", "Broad timeout control; not logged by intermediaries.", "Users can disable cookies; persistent cookies can be copied."],
              ]},
              { type: "heading", text: "Session ID Requirements" },
              { type: "list", items: [
                "Must look random and pass statistical tests of randomness.",
                "Must be unpredictable � cannot be derived from time, date, or IP address.",
                "Should be at least 50 characters long to resist brute-force attacks.",
              ]},
            ],
          },
          {
            title: "1.3 Bandwidth and Application Design",
            blocks: [
              { type: "paragraph", text: "Bandwidth is the amount of data that passes through a network connection over time, measured in bits per second (bps). It directly affects perceived application performance." },
              { type: "heading", text: "Implications of Limited Bandwidth" },
              { type: "list", items: [
                "Large images and pages cause long load times, especially for dial-up users.",
                "Pages with large amounts of code have bigger file sizes � reduce code where possible.",
                "Some browsers on slower hardware can struggle to process heavy pages.",
                "User perceived performance suffers � design for acceptable experience on slow connections.",
              ]},
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Demonstrate User Interface Methods for Internet Applications",
        summary: "Identify and explain ASP, browser-based clients, and rich clients as internet application UI approaches.",
        body: "Understand the technologies and trade-offs involved in choosing between server-side scripting (ASP) and different client types for web application delivery.",
        outcomes: [
          "Identify different user interface methods used for internet application development.",
          "Explain each method and its implications.",
        ],
        sections: [
          {
            title: "2.1 Active Server Pages (ASP)",
            blocks: [
              { type: "paragraph", text: "ASP (Active Server Pages) is a Microsoft technology for producing dynamic web content. ASP pages execute on the server side � the server processes the ASP code and returns HTML to the client browser." },
              { type: "heading", text: "The Seven Core ASP Objects" },
              { type: "table", headers: ["Object", "Purpose"], rows: [
                ["Application", "Stores information shared by all visitors connected to the application."],
                ["Session", "Maintains user-specific state across multiple page requests."],
                ["Request", "Retrieves information sent to the server in the HTTP request."],
                ["Response", "Creates and sends the HTTP response to the client browser."],
                ["Server", "Contains web server-specific information and utilities."],
                ["ObjectContext", "Controls transactions with Microsoft Transaction Server (MTS)."],
                ["ASPError", "Retrieves and sets errors encountered during ASP script execution."],
              ]},
            ],
          },
          {
            title: "2.2 Browser-Based vs Rich Clients",
            blocks: [
              { type: "table", headers: ["Feature", "Browser Client", "Rich Client"], rows: [
                ["Deployment", "No installation required; runs in any browser.", "Must be installed on the client machine."],
                ["Updates", "Server-side changes only; browser unaffected.", "Client software must be updated."],
                ["Functionality", "Limited by HTML/JavaScript; relies on server for complex logic.", "Full desktop capabilities; can render graphs locally."],
                ["Offline use", "Generally not possible.", "Can function with delayed server sync."],
                ["Responsiveness", "Every interaction may require a server round-trip.", "Most interactions are local; lower latency."],
                ["Security", "Firewall-friendly � uses HTTP.", "May require specific port configuration."],
              ]},
              { type: "callout", variant: "tip", text: "Validate user inputs on the client side (with JavaScript) for better UX � but ALWAYS re-validate on the server. Never rely solely on client-side validation." },
            ],
          },
        ],
      },
      {
        id: "session-3",
        label: "Session 3",
        title: "Copyright, Ownership and Royalties in Internet Development",
        summary: "Understand the copyright rules that apply to web content, who owns internet resources, and how royalties work for software.",
        body: "Internet developers must respect copyright law. Almost everything on the web is copyright protected. Know what you can and cannot do when building web applications.",
        outcomes: [
          "Show awareness of copyright issues related to internet development.",
          "Show awareness of ownership issues related to internet development.",
          "Show awareness of royalty issues related to internet development.",
        ],
        sections: [
          {
            title: "3.1 Copyright on the Internet",
            blocks: [
              { type: "paragraph", text: "Copyright is legal protection for original works of authorship. On the Internet, almost everything is automatically copyright protected once it is created � you do not need a copyright notice for protection to apply." },
              { type: "heading", text: "What Is Protected on the Web" },
              { type: "list", items: [
                "Original text, graphics, audio, and video on web pages.",
                "Unique HTML/markup language sequences and page design.",
                "Lists of web sites compiled by an individual or organisation.",
                "Links, if compiled in a sufficiently original way.",
              ]},
              { type: "heading", text: "When Creating a Web Page � What You CANNOT Do" },
              { type: "list", items: [
                "Copy content from another person's website onto your own.",
                "Copy-paste text from multiple sources to create a 'new' document without attribution.",
                "Copy logos, icons, or graphics from other sites (unless clearly labelled freeware).",
                "Forward someone's email without permission.",
                "Edit someone's digital correspondence in a way that changes its meaning.",
              ]},
            ],
          },
          {
            title: "3.2 Ownership and Royalties",
            blocks: [
              { type: "paragraph", text: "Ownership of internet content and software must be clearly defined in contracts before development begins. The more important the content or technology is to a business, the more crucial it is to secure broad ownership or licensing rights." },
              { type: "paragraph", text: "Royalty-free (RF) means the right to use copyrighted material without paying royalties per use or per unit sold. Many technology standards (e.g. IEEE 1394, H.264) require per-device royalties � these costs can amount to millions of dollars for large manufacturers." },
              { type: "callout", variant: "warning", text: "Software royalty arrangements must be clearly defined at the start of a contract � including what happens when the contractual period expires and who owns the adapted source code." },
            ],
          },
        ],
      },
      {
        id: "session-4",
        label: "Session 4",
        title: "Version Control and Security Issues for Internet Applications",
        summary: "Identify version control practices and explain common internet security threats and countermeasures.",
        body: "Security is a critical concern in internet development. Understand threats including session hijacking, denial of service, and data tampering � and the technical measures that address them.",
        outcomes: [
          "Identify version control issues related to internet development.",
          "Identify security issues related to internet development and explain ways of handling each.",
        ],
        sections: [
          {
            title: "4.1 Internet Security Overview",
            blocks: [
              { type: "paragraph", text: "Internet security aims to establish rules and measures to protect against attacks over the Internet. Key areas of vulnerability include:" },
              { type: "table", headers: ["Security Area", "Risk"], rows: [
                ["Information Privacy", "Disclosure of personal/medical/financial records; identity theft."],
                ["Provision of Services", "Denial-of-service (DoS) attacks disrupt communications and transactions."],
                ["Electronic Commerce", "Fraud, extortion, and breaches in financial transactions."],
                ["Critical Infrastructure", "Attacks on power grids, communications, or transport systems."],
              ]},
            ],
          },
          {
            title: "4.2 Security Mechanisms",
            blocks: [
              { type: "table", headers: ["Mechanism", "How It Works"], rows: [
                ["Firewall", "Controls access between networks; blocks unauthorized incoming/outgoing traffic at defined choke points."],
                ["HTTPS", "Encrypts HTTP traffic to prevent sniffing of session IDs and credentials."],
                ["Security Token", "Generates a random 6-digit code every 30�60 seconds; only valid for that window � prevents reuse of stolen credentials."],
                ["JIT Compiler", "Compiles bytecode at runtime; not a security measure directly but relevant to application performance and deployment."],
              ]},
              { type: "callout", variant: "info", text: "Using HTTPS prevents attackers from sniffing session IDs transmitted over the network � one of the simplest and most effective session security measures." },
            ],
          },
          {
            title: "4.3 Version Control for Internet Development",
            blocks: [
              { type: "paragraph", text: "Version control tracks changes to source code over time. For internet applications, this is important because:" },
              { type: "list", items: [
                "Multiple developers may work on the same codebase simultaneously.",
                "Rollback to a previous working version is possible if a deployment introduces bugs.",
                "An audit trail of what changed, when, and by whom is maintained.",
                "Branching allows features to be developed in isolation before merging to production.",
              ]},
            ],
          },
        ],
      },
    ],
  },
  "14919": {
    moduleId: "14919",
    saqa: "14919",
    introTitle: "Resolve Computer User Problems",
    introSummary: "Receive, investigate, implement, close, and escalate computer user problems using structured troubleshooting and support techniques.",
    introBody: "This module covers the full support lifecycle: defining and receiving problems, investigating root causes, implementing and monitoring solutions, closing resolved issues, and escalating unresolved ones.",
    aboutGuide: "This learner guide covers resolving computer user problems for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It targets IT support learners who handle user-reported problems.",
    unitPurpose: "Qualifying learners are able to: Receive computer user problems; Investigate problems; Implement solutions; Close resolved problems; Forward unresolved problems to the appropriate area.",
    quizPlacement: "end",
    quizSummary: "Test your knowledge of problem definition, troubleshooting steps, solution monitoring, and escalation procedures.",
    quizPageTitle: "Module Quiz",
    quizPageBody: "Complete all session content before attempting this quiz.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody: "Submit a support log documenting how you received, investigated, resolved or escalated a real or simulated computer user problem.",
    lessons: [
      {
        id: "unit-1",
        label: "Unit 1",
        title: "Resolve Computer User Problems",
        summary: "Overview of the IT support problem-resolution lifecycle.",
        body: "UNIT STANDARD: 14919 | NQF LEVEL: 4 | CREDITS: 5 | FIELD: Physical, Mathematical, Computer and Life Sciences",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Receive Computer User Problems",
        summary: "Identify the user, gather sufficient information, set priority and timeframe, and apply communication techniques to instil confidence.",
        body: "The first step in support is receiving the problem correctly. How you define and record the problem determines how effectively you can solve it.",
        outcomes: [
          "Identify users and their terms of support to determine the response procedure.",
          "Record sufficient information about the problem to begin an investigation.",
          "Employ personal communication techniques that make users feel the problem will be resolved.",
          "Assign a timeframe and priority according to organisation standards and support agreement.",
        ],
        sections: [
          {
            title: "1.1 Defining a Problem",
            blocks: [
              { type: "paragraph", text: "All problems have three components: a type, parameters, and possible causes. Before attempting to solve any problem, define it clearly in terms of these three components." },
              { type: "table", headers: ["Component", "Description", "Example"], rows: [
                ["Problem Type", "The category of constraint causing the problem.", "A space-and-time problem: new computers arriving before storage is available."],
                ["Problem Parameters", "The fixed limits within which any solution must fit.", "The company will not pay for external storage; the move date cannot change."],
                ["Possible Causes", "What might have led to the problem.", "Poor scheduling between the delivery and the move date."],
              ]},
            ],
          },
          {
            title: "1.2 Common PC Problems",
            blocks: [
              { type: "table", headers: ["Problem", "Possible Cause"], rows: [
                ["Slow performance", "Insufficient RAM, fragmented hard drive, or overtaxed CPU."],
                ["Random pop-ups", "Adware installed on the system."],
                ["Weird noises", "Loose component or pending mechanical failure."],
                ["Sudden shutdown", "Failing power supply or overheating."],
                ["Won't boot", "Bad sectors on hard drive or boot device issue."],
                ["Unauthorised access", "Rootkit giving remote user control of the machine."],
                ["Private data stolen", "Spyware recording keystrokes and exporting data."],
              ]},
            ],
          },
          {
            title: "1.3 Communication with Users",
            blocks: [
              { type: "paragraph", text: "Personal communication at the point of receiving a problem sets the user's expectations. Key techniques:" },
              { type: "list", items: [
                "Listen actively � let the user fully describe the problem before asking questions.",
                "Use plain, non-technical language when speaking to non-technical users.",
                "Acknowledge the problem and confirm you understand it correctly.",
                "Give a realistic timeframe for resolution and communicate it clearly.",
                "Follow up to show the user the problem is being actively worked on.",
              ]},
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Investigate Computer User Problems",
        summary: "Use information sources and structured troubleshooting procedures to identify the root cause of a problem.",
        body: "Effective investigation separates symptoms from root causes. Follow a structured troubleshooting approach to find the actual cause rather than just treating the symptom.",
        outcomes: [
          "Use information sources to identify known problems.",
          "Use industry-recommended procedures to identify the cause of the problem.",
          "Record symptoms of unresolved problems for escalation.",
          "Advise users of investigation progress.",
        ],
        sections: [
          {
            title: "2.1 Problem Categories",
            blocks: [
              { type: "table", headers: ["Category", "Description"], rows: [
                ["Hardware failure", "A failed component (motherboard, hard drive) or a physical issue (unplugged cable, router needing restart)."],
                ["Software issue", "Operating system bug, Windows update side-effect, or application error."],
                ["User-created problem", "Unintentional change � something deleted, disabled, or misconfigured by the user."],
                ["Training/documentation", "No real technical fault; user needs guidance or documentation is outdated."],
                ["Outside vendor issue", "Third-party software or supported hardware with its own support obligation."],
              ]},
            ],
          },
          {
            title: "2.2 Troubleshooting Steps",
            blocks: [
              { type: "ordered-list", items: [
                "Reboot � try this before escalating; many issues resolve with a restart.",
                "Replicate the problem � reproduce the error yourself to understand it firsthand.",
                "Retrace user steps � ask what changed or was installed before the problem appeared.",
                "Check Device Manager � look for yellow or red warning indicators on hardware.",
                "Review error logs � identify frequency and source of the problem.",
                "Isolate the problem � determine if it affects one machine or multiple users.",
                "Seek obvious solutions � check cables, connections, and simple physical causes first.",
              ]},
              { type: "callout", variant: "tip", text: "Identifying the problem category early (hardware / software / user / vendor) helps you know which diagnostic path to follow and avoids wasting time." },
            ],
          },
        ],
      },
      {
        id: "session-3",
        label: "Session 3",
        title: "Implement Solutions to Computer User Problems",
        summary: "Design and apply solutions, monitor their effectiveness, and modify them if they do not fully resolve the problem.",
        body: "Implementing a solution is not the end of the process. Trail, review, and if necessary modify the solution to ensure it is genuinely effective.",
        outcomes: [
          "Ensure the user's system is returned to service as soon as possible.",
          "Use reference sources to identify known solutions.",
          "Design solutions for new problems.",
          "Record actions taken in sufficient detail to allow them to be repeated.",
          "Monitor solution progress and advise users.",
        ],
        sections: [
          {
            title: "3.1 Making Solutions Effective",
            blocks: [
              { type: "paragraph", text: "A solution is only effective if it resolves the problem permanently. After implementing a fix, follow up with the user to confirm the problem has not recurred." },
              { type: "heading", text: "Review � Modify � Standardise" },
              { type: "table", headers: ["Step", "What It Means"], rows: [
                ["Review", "Evaluate the solution against the original problem requirement � did it achieve the goal?"],
                ["Modify", "If the solution is not fully working, adjust it. Example: move items to a more accessible location."],
                ["Standardise", "If the solution works well, document it as the standard approach for all similar problems."],
              ]},
            ],
          },
          {
            title: "3.2 Problem-Solving Techniques",
            blocks: [
              { type: "list", items: [
                "Compare to previous problems � draw on your experience of similar faults to find the solution faster.",
                "Troubleshooting (process of elimination) � methodically eliminate possible causes until the actual cause is found.",
                "Seek expert help � use the internet, software vendors, hardware manufacturers, or colleagues for guidance on unfamiliar problems.",
              ]},
            ],
          },
        ],
      },
      {
        id: "session-4",
        label: "Session 4",
        title: "Close Resolved Computer User Problems",
        summary: "Report the resolution to the user and record the solution according to organisational standards.",
        body: "Closing a problem properly ensures the user is satisfied and the resolution is documented for future reference.",
        outcomes: [
          "Present a report on the resolution to the user so they can judge that the problem is satisfactorily resolved.",
          "Record the resolution according to organisation standards and procedures.",
        ],
        sections: [
          {
            title: "4.1 Reporting a Resolution",
            blocks: [
              { type: "paragraph", text: "When closing a problem, tell the user exactly what was done to fix it � which parts were replaced, what was repaired or reconfigured, and how the actions taken have resolved the original issue." },
              { type: "callout", variant: "info", text: "Think of it like a workshop handing back a repaired car with a job card � the users needs to be able to verify that everything they reported has been addressed." },
            ],
          },
          {
            title: "4.2 Recording the Resolution",
            blocks: [
              { type: "paragraph", text: "A complete resolution record should include:" },
              { type: "list", items: [
                "The original problem description.",
                "A description of all symptoms observed.",
                "When the problem was first reported.",
                "All troubleshooting steps taken.",
                "Whether the problem was fixed locally or forwarded to technical support.",
                "Dates and details of progress updates provided to the user.",
                "When and how the system was returned to the user.",
              ]},
            ],
          },
        ],
      },
      {
        id: "session-5",
        label: "Session 5",
        title: "Forward Unresolved Problems to the Appropriate Area",
        summary: "Escalate problems you cannot resolve, communicate progress to the user, and document the escalation.",
        body: "Not every problem can be resolved at first-line support. Escalating promptly and professionally, while keeping the user informed, is a critical support skill.",
        outcomes: [
          "Report the extension of the problem to the user according to their support agreement.",
          "Advise third parties of progress according to the support agreement.",
          "Record additional information on unresolved problems for the receiving area.",
        ],
        sections: [
          {
            title: "5.1 Escalating Unresolved Problems",
            blocks: [
              { type: "paragraph", text: "If you cannot resolve a problem within your capability or the agreed timeframe, escalate it. Before contacting the user, identify who can fix it and arrange the next steps � so you can give the user maximum information when you call." },
              { type: "list", items: [
                "Find out who can resolve the problem before telling the user you cannot.",
                "If possible, arrange expert attention before phoning the user.",
                "If resolution will take longer than the support agreement allows, arrange a loaner device.",
                "Approach escalated problems as joint problems to be solved together, not passed away.",
              ]},
              { type: "callout", variant: "warning", text: "Never tell a user to find their own solution � even if it is a vendor issue. Always remain involved until the problem is resolved to the user's satisfaction." },
            ],
          },
          {
            title: "5.2 Documentation for Escalation",
            blocks: [
              { type: "paragraph", text: "When forwarding a problem to technical support or a third party, provide:" },
              { type: "list", items: [
                "Full problem description and all symptoms.",
                "All troubleshooting steps already attempted and their outcomes.",
                "Any error codes, log entries, or diagnostic results collected.",
                "The user's support agreement terms and escalation timeframe.",
                "Contact details and communication history with the user.",
              ]},
            ],
          },
        ],
      },
    ],
  },
};
