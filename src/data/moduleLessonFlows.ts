// --- Content block types -----------------------------------------------------

import { module14924LessonFlow } from "./block1/module14924LessonFlow";

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
    quizSummary:
      "After completing the sessions you will take a practical knowledge-check quiz based on the same guided tasks done in class, such as editor use, syntax correction, data understanding, and simple pseudocode.",
    quizPageTitle: "Practical Knowledge Check",
    quizPageBody:
      "This quiz checks whether you understand the practical steps from the learner guide and presentation. It focuses on explaining what you did and why it works, not on speed or memorising difficult terms.",
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
        summary:
          "Follow the beginner-friendly Write → Check → Build journey: use an editor, understand syntax errors, and see how code becomes a working program.",
        body:
          "This first session is about confidence and orientation. Learners explore the editor as a creative space, the syntax checker as a quality filter, and the compiler as the tool that helps turn source code into a runnable program.",
        outcomes: [
          "The operation demonstrates the use of the editor of the development tools to produce program source code.",
          "The operation includes the use of the syntax checker of the tools to check for syntax errors.",
          "The operation uses the tool to compile the program source code produced.",
        ],
        sections: [
          {
            title: "1.1 The Developer's Roadmap: Write → Check → Build",
            blocks: [
              {
                type: "paragraph",
                text: "Think of programming as a three-stage journey. First you write the code, then you check for mistakes, and finally you build or run the program.",
              },
              {
                type: "table",
                headers: ["Phase", "Tool", "Purpose"],
                rows: [
                  ["Writing", "Editor", "Create source code"],
                  ["Checking", "Syntax Checker", "Find and fix errors"],
                  ["Building", "Compiler", "Turn code into something executable"],
                ],
              },
              {
                type: "callout",
                variant: "info",
                text: "This roadmap helps learners remember the order: Write → Check → Build.",
              },
            ],
          },
          {
            title: "1.2 The Creative Space (Editor)",
            blocks: [
              {
                type: "paragraph",
                text: "A programming development tool is any software that helps a developer create, check, and improve programs. The editor is the place where your ideas become source code.",
              },
              {
                type: "list",
                items: [
                  "Line editors are older and require line-by-line editing.",
                  "Screen-oriented editors allow you to move the cursor freely and edit anywhere on screen.",
                  "Modern tools like Visual Studio Code and IntelliJ IDEA are screen-oriented editors.",
                ],
              },
              {
                type: "callout",
                variant: "tip",
                text: "Think of the editor as your digital workbook for coding — open, type, save, and improve.",
              },
            ],
          },
          {
            title: "1.3 Essential Commands and Writing Example",
            blocks: [
              {
                type: "paragraph",
                text: "You do not need dozens of shortcuts on Day 1. Focus on the few that save time and reduce mistakes.",
              },
              {
                type: "table",
                headers: ["Shortcut", "Use"],
                rows: [
                  ["Ctrl + C", "Copy"],
                  ["Ctrl + X", "Cut"],
                  ["Ctrl + V", "Paste"],
                  ["Ctrl + S", "Save"],
                ],
              },
              {
                type: "code",
                text: "INPUT \"Enter a number: \", num\nresult = SQR(num)\nPRINT \"The square root is: \"; result",
              },
              {
                type: "paragraph",
                text: "This is source code — human-readable instructions that tell the computer what to do.",
              },
            ],
          },
          {
            title: "1.4 The Quality Filter (Syntax Checking)",
            blocks: [
              {
                type: "paragraph",
                text: "Programming languages follow strict rules called syntax. A syntax error happens when those rules are broken.",
              },
              {
                type: "list",
                items: [
                  "Missing brackets or parentheses",
                  "Incorrect keywords",
                  "Wrong punctuation such as a missing colon",
                ],
              },
              {
                type: "table",
                headers: ["Code", "Meaning", "Action"],
                rows: [
                  ["U", "Unrecoverable", "Program stops completely"],
                  ["S", "Severe", "Must fix before compiling"],
                  ["E", "Error", "Compiler may guess, but it is risky"],
                  ["W", "Warning", "Not always wrong, but suspicious"],
                  ["I", "Information", "Suggestion or note"],
                ],
              },
              {
                type: "callout",
                variant: "warning",
                text: "Start with S and E errors first. They usually stop the program from working properly.",
              },
            ],
          },
          {
            title: "1.5 The Assembly Line (Compiling and Functions)",
            blocks: [
              {
                type: "paragraph",
                text: "After fixing errors, the compiler translates your source code into a form the computer can run.",
              },
              {
                type: "ordered-list",
                items: [
                  "Read the code",
                  "Check syntax",
                  "Combine with libraries",
                  "Produce an executable result",
                ],
              },
              {
                type: "table",
                headers: ["Concept", "Simple Meaning", "Example"],
                rows: [
                  ["Library Function", "Built-in function provided by the language", "SQR(), LEN(), ABS()"],
                  ["User-Defined Function", "Function created by the programmer", "CalculateAverage()"],
                  ["Subroutine", "Performs an action but does not return a value", "DisplayMenu()"],
                  ["Function", "Returns a result", "GetTotal()"],
                  ["Local Variable", "Only exists inside one procedure or function", "tempMark"],
                  ["Global Variable", "Can be accessed more widely", "schoolName"],
                ],
              },
            ],
          },
          {
            title: "1.6 Session 1 Checklist and Practice",
            blocks: [
              {
                type: "list",
                items: [
                  "Can you write a simple line of code in the editor?",
                  "Can you use Save, Copy, and Paste?",
                  "Can you identify a syntax error?",
                  "Can you explain the difference between a built-in function and one you create yourself?",
                  "Can you describe what compiling does?",
                ],
              },
              {
                type: "code",
                text: "result = SQR((num",
              },
              {
                type: "callout",
                variant: "info",
                text: "Practice question: What error will appear, what severity might it have, and how would you fix it?",
              },
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
      {
        id: "facilitator-activities",
        label: "Facilitator Notes",
        title: "Facilitator Activities — 14910 Practical Track",
        summary:
          "Workbook-aligned practical delivery for editor use, data work, pseudocode, and debugging.",
        body:
          "The facilitator guide expects this unit to be taught practically, with short demonstrations followed by learner participation and evidence collection.",
        sections: [
          {
            title: "Planned Practical Flow",
            blocks: [
              {
                type: "ordered-list",
                items: [
                  "Activity 1: Define a text editor and syntax using simple everyday examples.",
                  "Activity 2: Let learners create a file, use the syntax checker, and try one simple built-in function or output statement.",
                  "Activity 3: Practise number conversion, data types, ASCII ideas, and logical operators with quick whiteboard or workbook tasks.",
                  "Activity 5: Write short pseudocode for sequence, selection, and loop structures and desk-check it with a partner.",
                  "Activity 6: Compare good and bad documentation using comments, pseudocode, and test notes.",
                  "Activities 7–9: Use variables and operators, explain modular programming, and debug a small program with test data.",
                ],
              },
              {
                type: "callout",
                variant: "tip",
                text: "Keep the cycle practical: explain briefly, demonstrate live, let learners try, then review the output together.",
              },
            ],
          },
          {
            title: "PoE Evidence to Collect",
            blocks: [
              {
                type: "list",
                items: [
                  "Completed workbook answers for Activities 1–9.",
                  "A saved sample code file or screenshot showing syntax correction.",
                  "Short pseudocode or algorithm trace completed by the learner.",
                  "Notes on one debugging example using test data.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "learner-activities",
        label: "Activities",
        title: "Learner Activities — 14910 Practical Workbook Tasks",
        summary:
          "Practical exercises aligned to the facilitator guide and presentation coverage.",
        body:
          "These activities help learners move from definitions to doing. Keep the completed work as part of the learner’s PoE evidence.",
        sections: [
          {
            title: "Activity Schedule",
            blocks: [
              {
                type: "table",
                headers: ["Activity", "Focus"],
                rows: [
                  ["Activity 1", "Define a text editor and explain what syntax means in programming."],
                  ["Activity 2", "Use the editor, syntax checker, and one simple built-in function or code statement."],
                  ["Activity 3", "Convert values between number systems and compare data representations such as text, numeric, and ASCII."],
                  ["Activity 4", "Differentiate logical data types and logical operators using short examples."],
                  ["Activity 5", "Write pseudocode that demonstrates sequence, selection, and iteration."],
                  ["Activity 6", "Identify good vs bad program documentation principles and QA habits."],
                  ["Activity 7–9", "Use variables and expressions, explain modular programming, and demonstrate a simple debugging process."],
                ],
              },
            ],
          },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        title: "Resources — Programming Principles Practical Session",
        summary:
          "Materials required to keep 14910 hands-on and visible.",
        body:
          "Prepare the environment before class so learners can practise immediately rather than wait for setup.",
        sections: [
          {
            title: "Resource List",
            blocks: [
              {
                type: "list",
                items: [
                  "VS Code and Python or the chosen language installed on all machines.",
                  "Projector for live demos of the editor, syntax errors, and debugging steps.",
                  "Learner Workbook and Facilitator Guide for activity references.",
                  "Printed shortcut and pseudocode quick-reference sheets.",
                  "Sample code snippets with one or two deliberate mistakes for correction practice.",
                ],
              },
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
  "14933": {
    moduleId: "14933",
    saqa: "14933",
    introTitle: "Create Multimedia / Web-Based Applications with Scripting",
    introSummary:
      "Use the SAQA 14933 learner guide to plan, design, script, and assemble a simple multimedia or web-based application from an outlined brief.",
    introBody:
      "This in-app learner guide follows the 14933 markdown material and takes learners through the full process: understand web-based multimedia, plan the application, design it for real users, choose and save suitable media, create scripts, and test the final assembled product.",
    aboutGuide:
      "This learner guide covers Unit Standard 14933 for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It is designed to help learners create, test, and gain user approval for multimedia / web-based computer applications with scripting in a practical, evidence-based way.",
    unitPurpose:
      "People credited with this unit standard are able to plan the use of a multimedia/web-based authoring application with scripting, design the application, identify and save text/graphic/animation elements, create scripts, and assemble a multimedia/web-based application including scripts.",
    quizPlacement: "end",
    quizSummary:
      "Use the quiz to check understanding of planning, design, multimedia elements, scripting, testing, and final assembly for a simple web-based application.",
    quizPageTitle: "Module Quiz",
    quizPageBody:
      "Complete the learner guide sessions first, then use the quiz to confirm that you can explain and apply the main 14933 concepts clearly.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody:
      "Submit a design brief, storyboard/flowchart, saved media elements, simple script evidence, and the assembled application or screenshots as PoE evidence.",
    lessons: [
      {
        id: "unit-1",
        label: "Unit 1",
        title: "Learning Unit 1: Create Multimedia / Web-Based Applications with Scripting",
        summary:
          "Overview of Unit Standard 14933, the purpose of the unit, and the end-to-end process from planning to testing and final assembly.",
        body:
          "UNIT STANDARD: 14933 | NQF LEVEL: 4 | CREDITS: 6. This unit focuses on creating, testing, and gaining user approval for multimedia / web-based computer applications with scripting from an outlined development brief.",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Session 1: Plan the use of a multimedia / web-based authoring application",
        summary:
          "Start with the brief: identify the topic, purpose, target audience, objectives, tools, and environment needed for the application.",
        body:
          "Session 1 focuses on planning. Learners first understand what web-based multimedia is, then think carefully about the audience, objectives, tools, hardware, software, and development plan before any design or coding begins.",
        outcomes: [
          "Identify the user-specified topic, purpose, target audience, and objectives of the application.",
          "Justify the tools selected to create the multimedia / web-based application with scripting.",
          "Identify the hardware, software, and configuration needed to create and run the application.",
          "Outline a realistic plan for the creation of the application according to project planning principles.",
        ],
        sections: [
          {
            title: "1.1 What Web-Based Multimedia Means",
            blocks: [
              {
                type: "paragraph",
                text: "Web-based multimedia refers to websites or online applications that use more than one type of media — usually text, images, sound, video, or animation — and often allow the user to interact directly with the content.",
              },
              {
                type: "list",
                items: [
                  "Hyperlinks help control the order in which information is viewed.",
                  "Modern computers and faster internet connections make multimedia use more practical than in the past.",
                  "Many multimedia sites are interactive, not only informational.",
                ],
              },
            ],
          },
          {
            title: "1.2 Advantages and Disadvantages of Multimedia",
            blocks: [
              {
                type: "list",
                items: [
                  "Advantages: supports different learning styles, keeps users interested, and explains some ideas more clearly than text alone.",
                  "Disadvantages: often costs more, takes longer to create, may load slowly, and may not work the same on all devices or browsers.",
                ],
              },
              {
                type: "callout",
                variant: "tip",
                text: "Good multimedia should support the message, not distract from it.",
              },
            ],
          },
          {
            title: "1.3 Audience, Objectives, Tools, and Environment",
            blocks: [
              {
                type: "ordered-list",
                items: [
                  "Identify the topic and overall purpose of the application.",
                  "Describe the target audience and how they will access the site or application.",
                  "Decide which tools, hardware, software, and plug-ins are realistic for that audience.",
                  "Write clear objectives before moving forward to design.",
                ],
              },
              {
                type: "paragraph",
                text: "If the audience and objectives are still unclear, the learner should not continue deeper into the design process until the application purpose makes sense.",
              },
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Session 2: Design a multimedia / web-based computer application",
        summary:
          "Translate the brief into a usable design using planning principles, flowcharts, page layouts, storyboards, navigation rules, and access considerations.",
        body:
          "Session 2 is about design thinking. Learners generate the application design from the user specification and use flowcharts, page layouts, and storyboards to communicate clearly between the developer and the user.",
        outcomes: [
          "Generate the multimedia / web-based application design according to user specifications.",
          "Design a storyboard and flow-diagram that supports effective communication and shared understanding.",
          "Apply effective multimedia communication principles so the design is interesting, usable, and clear.",
        ],
        sections: [
          {
            title: "2.1 Multimedia Web Site Design Principles",
            blocks: [
              {
                type: "paragraph",
                text: "Web site design is the process of planning what the application will look like and how it will work. Time spent planning on paper before development saves time and reduces redesign later.",
              },
              {
                type: "list",
                items: [
                  "Make the application interesting and valuable to the target audience.",
                  "Make the application easy to use, intuitive, and quick enough to load.",
                  "Refresh content regularly so the site does not become stale or boring.",
                ],
              },
            ],
          },
          {
            title: "2.2 Performance, Devices, and Compatibility",
            blocks: [
              {
                type: "table",
                headers: ["Design Issue", "Good Practice"],
                rows: [
                  ["Large media files", "Optimise them, use thumbnails, and stream audio/video where possible"],
                  ["Different devices", "Design for the intended device or optimise for multiple delivery methods"],
                  ["Browser-specific features", "Avoid them unless they do not block basic functionality for other users"],
                  ["Uncommon plug-ins", "Prefer widely used tools and avoid forcing unusual downloads"],
                ],
              },
              {
                type: "callout",
                variant: "warning",
                text: "High-bandwidth items should be used in moderation and only when they add real value to the application.",
              },
            ],
          },
          {
            title: "2.3 Flowcharts, Page Layouts, and Storyboards",
            blocks: [
              {
                type: "paragraph",
                text: "After identifying the audience, objectives, and main content, the structure and layout of the site can be designed using planning tools such as flowcharts, page layouts, and storyboards.",
              },
              {
                type: "list",
                items: [
                  "A flowchart shows how pages in the site relate to one another.",
                  "A page layout shows where menus, text, images, and other elements will appear on the page.",
                  "A storyboard shows the sequence of screens or scenes for a multimedia component.",
                ],
              },
            ],
          },
          {
            title: "2.4 Navigation and Access Considerations",
            blocks: [
              {
                type: "list",
                items: [
                  "Users should be able to reach most pages within about three clicks.",
                  "Use clear navigation bars, hyperlinks, site maps, search tools, and back-to-top aids where needed.",
                  "Include identifying information and a route back to the home page on all pages.",
                  "Consider both device compatibility and accessibility for users with disabilities.",
                ],
              },
              {
                type: "callout",
                variant: "info",
                text: "Accessible design includes alt text, meaningful links, and layouts that reduce unnecessary clicking and scrolling.",
              },
            ],
          },
        ],
      },
      {
        id: "session-3",
        label: "Session 3",
        title: "Session 3: Identify and save text, graphic elements, and animation",
        summary:
          "Choose, prepare, and save multimedia elements in forms that suit the design, the user, and the legal requirements of the project.",
        body:
          "Session 3 focuses on the actual content elements that go into the application: text, graphics, animation, audio, and video. Learners also consider suitable file formats, compression, copyright, privacy, and practical saving choices.",
        outcomes: [
          "Use text that aligns with the agreed topic, purpose, and target audience.",
          "Identify and save graphics and animation according to the design specification and legal requirements.",
          "Save text and media in forms that can be integrated into the multimedia / web-based application.",
        ],
        sections: [
          {
            title: "3.1 Text and Readability",
            blocks: [
              {
                type: "list",
                items: [
                  "Text is used for content, menus, instructions, buttons, and hyperlinks.",
                  "Choose typefaces and font sizes that match the purpose and remain easy to read.",
                  "High contrast between text and background improves readability.",
                  "When a consistent text appearance is essential, text can be rendered as a graphic instead.",
                ],
              },
            ],
          },
          {
            title: "3.2 Graphics, Formats, and Thumbnails",
            blocks: [
              {
                type: "table",
                headers: ["Format", "Best Use"],
                rows: [
                  ["GIF / PNG", "Line art, logos, buttons, and simple graphics"],
                  ["JPEG", "Photographs and rich images where compression is useful"],
                  ["Thumbnail image", "Small preview linked to a larger full-size version"],
                ],
              },
              {
                type: "paragraph",
                text: "Images should be saved at an appropriate display size before being inserted into a web page so that they do not make the page unnecessarily slow.",
              },
            ],
          },
          {
            title: "3.3 Animation, Audio, Video, and Legal Care",
            blocks: [
              {
                type: "list",
                items: [
                  "Animation can be created with animated GIFs, JavaScript, DHTML, Flash-style tools, or other development tools.",
                  "Audio and video often need compression or streaming to reduce waiting time for the user.",
                  "All selected media should support the agreed design and audience needs.",
                  "Respect copyright and privacy when choosing text, images, audio, or video for the application.",
                ],
              },
              {
                type: "callout",
                variant: "warning",
                text: "Only use media that you are allowed to use, and save it in a format that the project can actually integrate and display.",
              },
            ],
          },
        ],
      },
      {
        id: "session-4",
        label: "Session 4",
        title: "Session 4: Create multimedia / web-based application scripts",
        summary:
          "Move from design into development by using markup languages and scripting languages to create structure, behaviour, and interactivity.",
        body:
          "Session 4 introduces the development stage: create the page structure, insert the planned media, write scripts using standard language features, and test them under likely conditions.",
        outcomes: [
          "Demonstrate the logic of the scripts through a simple logic diagram or explanation.",
          "Configure the working environment so the planned tools and software can be used correctly.",
          "Write scripts using standard features of the scripting language.",
          "Test the scripts and correct likely errors or failures.",
        ],
        sections: [
          {
            title: "4.1 Multimedia Web Site Development",
            blocks: [
              {
                type: "ordered-list",
                items: [
                  "Create the multimedia elements needed by the application.",
                  "Create the website or application pages themselves.",
                  "Test and maintain the finished site or application.",
                ],
              },
            ],
          },
          {
            title: "4.2 Markup Languages for Web Development",
            blocks: [
              {
                type: "list",
                items: [
                  "HTML is the most common markup language for web pages.",
                  "Other markup options include DHTML, XML, XHTML, and WML for specific needs or devices.",
                  "Markup tags identify headings, paragraphs, links, images, tables, frames, and other page elements.",
                ],
              },
              {
                type: "code",
                text: "<h1>Welcome</h1>\n<p>This is my practice page.</p>\n<img src=\"photo.jpg\" alt=\"Photo description\">\n<a href=\"contact.html\">Contact Us</a>",
              },
            ],
          },
          {
            title: "4.3 Scripting Languages and Testing Scripts",
            blocks: [
              {
                type: "paragraph",
                text: "Scripting languages add dynamic content and interactivity. Popular examples mentioned in the guide include JavaScript, VBScript, and Perl.",
              },
              {
                type: "list",
                items: [
                  "JavaScript is commonly used to add interaction to web pages.",
                  "Important scripted features should not depend on one browser only.",
                  "Test scripts against the most likely conditions and correct identified errors.",
                ],
              },
              {
                type: "callout",
                variant: "tip",
                text: "Keep early scripts small and clear so the learner can explain what each one does.",
              },
            ],
          },
        ],
      },
      {
        id: "session-5",
        label: "Session 5",
        title: "Session 5: Assemble the multimedia / web-based application including scripts",
        summary:
          "Bring all saved text, graphics, animation, and scripts together into one coherent application, then test and refine it.",
        body:
          "The final session is about assembly, testing, maintenance, and professionalism. The learner combines the planned content and scripts, checks that the result matches the specification, and improves it based on testing results.",
        outcomes: [
          "Assemble the multimedia / web-based application using the saved elements and planned specification.",
          "Ensure that the function and content of the application remain consistent with the design specification and system environment.",
        ],
        sections: [
          {
            title: "5.1 Authoring Software and Final Build",
            blocks: [
              {
                type: "paragraph",
                text: "Web site authoring software can make the work easier by generating markup, managing navigation, applying consistent styles, and helping tie all elements together into one site.",
              },
              {
                type: "list",
                items: [
                  "Authoring tools can speed up page creation and improve consistency.",
                  "They often include support for forms, media, hyperlinks, and site-wide styling.",
                  "Even when tools are used, the developer still needs to check quality carefully.",
                ],
              },
            ],
          },
          {
            title: "5.2 Testing and Maintaining the Site",
            blocks: [
              {
                type: "ordered-list",
                items: [
                  "Click every hyperlink and test every likely user action.",
                  "Check spelling, grammar, layout, readability, and general professionalism.",
                  "Test on different browsers, devices, and screen sizes where possible.",
                  "Update and maintain the site regularly so the content stays useful and current.",
                ],
              },
              {
                type: "callout",
                variant: "warning",
                text: "A multimedia site is not finished just because it is online; it must still be tested, monitored, and improved over time.",
              },
            ],
          },
          {
            title: "5.3 Final Learner Checklist",
            blocks: [
              {
                type: "list",
                items: [
                  "Does the final application still match the original topic, purpose, audience, and objectives?",
                  "Are the text, graphics, and other media saved in suitable formats and used lawfully?",
                  "Do the scripts work under normal conditions?",
                  "Is the final result easy to use, readable, and consistent with the design plan?",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "learner-activities",
        label: "Activities",
        title: "Learner Activities — 14933 Workbook Tasks",
        summary:
          "Practical learner activities mapped to the markdown guide and the main assessment criteria.",
        body:
          "Complete each activity stage and keep your notes, sketches, saved media, screenshots, and final files as part of your PoE evidence.",
        sections: [
          {
            title: "Activity Schedule",
            blocks: [
              {
                type: "table",
                headers: ["Activity", "Focus"],
                rows: [
                  ["Activity 1", "Identify the topic, purpose, target audience, objectives, and tools for the application."],
                  ["Activity 2", "Create a flowchart, page layout, or storyboard to communicate the design clearly."],
                  ["Activity 3", "Select and save text, graphics, and animation elements in suitable formats while respecting copyright and privacy rules."],
                  ["Activity 4", "Write and test a short script using standard features of the scripting language."],
                  ["Activity 5", "Assemble the final application, test it, and present the result."],
                ],
              },
            ],
          },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        title: "Resources — 14933 Learner Guide Support",
        summary:
          "Materials needed to teach and complete the 14933 in-app learner guide effectively.",
        body:
          "Prepare the design, build, and testing resources in advance so the session time stays practical and productive.",
        sections: [
          {
            title: "Resource List",
            blocks: [
              {
                type: "list",
                items: [
                  "Learner Guide, Learner Workbook, Practical Assessment, and Assessment Guide for SAQA 14933.",
                  "VS Code or similar editor, plus a browser such as Chrome or Edge for previewing pages.",
                  "Storyboard / wireframe sheets and planning templates.",
                  "Copyright-safe sample images, audio, and video examples.",
                  "A simple testing checklist for links, layout, browser/device compatibility, and accessibility.",
                ],
              },
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
    introSummary:
      "Learn how testers plan checks, run them carefully, capture evidence, and report whether a system is ready for use.",
    introBody:
      "This unit introduces the full testing journey in a practical way: decide what must be tested, choose the right procedure, execute the test, record the evidence, and prepare the documents that prove what happened.",
    aboutGuide:
      "This learner guide covers testing IT systems for the FETC: IT Systems Development qualification (SAQA 78965, NQF Level 4). It supports learners entering software support, QA, or systems environments where evidence, accuracy, and clear reporting matter.",
    unitPurpose:
      "Qualifying learners are able to select an appropriate test procedure, apply the test procedure, collect and record data, and prepare the testing process in a structured way.",
    quizPlacement: "end",
    quizSummary:
      "Test your understanding of test purpose, phases, evidence collection, defect logging, and the main documents used in a formal test cycle.",
    quizPageTitle: "Module Quiz",
    quizPageBody:
      "Complete the sessions first, then use the quiz to check whether you can explain testing clearly and apply the ideas to a simple scenario.",
    assessmentPageTitle: "Portfolio of Evidence",
    assessmentPageBody:
      "Submit a simple test plan, executed test cases, and clear test results for a system checked against a given specification.",
    lessons: [
      {
        id: "unit-1",
        label: "Unit 1",
        title: "Demonstrate an Understanding of Testing IT Systems Against Given Specifications",
        summary:
          "Overview of why testing matters, what evidence testers collect, and how quality is checked against requirements.",
        body:
          "UNIT STANDARD: 14908 | NQF LEVEL: 4 | CREDITS: 6 | FIELD: Physical, Mathematical, Computer and Life Sciences",
      },
      {
        id: "session-1",
        label: "Session 1",
        title: "Select an Appropriate Test Procedure",
        summary:
          "Start with the big idea of testing, then match the correct procedure to the system, risk, and environment.",
        body:
          "Testing compares what a system should do with what it actually does. In this session, learners see how to choose a sensible testing method for both hardware and software scenarios.",
        outcomes: [
          "Explain the purpose of testing an IT system.",
          "Identify the correct test procedure for a given hardware testing scenario.",
          "Identify the correct test procedure for a given software testing scenario.",
          "Identify factors that affect the selection of a test procedure.",
        ],
        sections: [
          {
            title: "1.1 What Testing Really Means",
            blocks: [
              {
                type: "paragraph",
                text: "Testing is the disciplined process of checking whether a system behaves the way the specification says it should behave. The tester looks for gaps between the expected result and the actual result.",
              },
              {
                type: "callout",
                variant: "info",
                text: "A passed test does not prove the whole system is perfect. It only proves that the system behaved correctly for that specific check at that time.",
              },
              {
                type: "table",
                headers: ["Term", "Simple meaning"],
                rows: [
                  ["Expected result", "What should happen according to the requirement"],
                  ["Actual result", "What really happened when the test was run"],
                  ["Defect / bug", "A problem where actual and expected results do not match"],
                  ["Test evidence", "Notes, screenshots, logs, or data that prove what happened"],
                ],
              },
            ],
          },
          {
            title: "1.2 Why Testing Matters in Real Life",
            blocks: [
              {
                type: "list",
                items: [
                  "It protects users from broken or unsafe systems.",
                  "It reduces expensive fixes after deployment.",
                  "It builds trust that the solution meets the specification.",
                  "It helps teams sign off work using evidence instead of guesswork.",
                ],
              },
              {
                type: "callout",
                variant: "tip",
                text: "A simple memory rule: test to protect the user, the business, and the quality of the system.",
              },
            ],
          },
          {
            title: "1.3 Hardware Test Programmes",
            blocks: [
              {
                type: "paragraph",
                text: "Physical equipment is usually tested in stages before it is trusted in the real environment.",
              },
              {
                type: "table",
                headers: ["Test phase", "Purpose", "Easy example"],
                rows: [
                  ["Prototype Testing", "Find early design problems", "Testing the first version of a device"],
                  ["Development Acceptance Testing (DAT)", "Check the build meets design goals", "Engineers confirm the hardware works as planned"],
                  ["Factory Acceptance Testing (FAT)", "Verify before shipping", "Customer checks the machine at the factory"],
                  ["Site Acceptance Testing", "Check it works where it will actually be used", "Testing a server after installation on site"],
                  ["Burn-In Testing", "Expose early-life failures by running continuously", "Leaving equipment on for hours or days"],
                  ["Final Acceptance Testing", "Formal sign-off before go-live", "Customer confirms all agreed checks are complete"],
                ],
              },
            ],
          },
          {
            title: "1.4 Software Test Procedures",
            blocks: [
              {
                type: "table",
                headers: ["Procedure", "Meaning", "Simple example"],
                rows: [
                  ["Black-box testing", "Test from the user side without looking at the code", "Enter data in a login form and check the outcome"],
                  ["White-box testing", "Design tests using knowledge of the internal logic", "Check whether all important code paths were executed"],
                  ["Grey-box testing", "Test with partial knowledge of the internals", "Know the database exists, but test mainly through the interface"],
                  ["Regression testing", "Repeat older tests after a change", "Re-test login after a password-reset feature was added"],
                ],
              },
              {
                type: "callout",
                variant: "warning",
                text: "Choose the procedure that fits the risk, time, and type of system. One method is rarely enough for every situation.",
              },
            ],
          },
          {
            title: "1.5 Factors That Affect Test Selection",
            blocks: [
              {
                type: "list",
                items: [
                  "Risk level of the feature or device being tested",
                  "Available time, people, and test tools",
                  "Size and complexity of the system",
                  "How closely the test environment matches production",
                  "Skills and experience of the testing team",
                ],
              },
              {
                type: "paragraph",
                text: "High-risk areas such as security, payment, or large data handling normally need deeper and more formal testing than low-risk cosmetic changes.",
              },
            ],
          },
        ],
      },
      {
        id: "session-2",
        label: "Session 2",
        title: "Apply the Test Procedure",
        summary:
          "Turn the plan into action by following a clear test approach, using the right phase, and recording results properly.",
        body:
          "A good test is not random. It follows a planned sequence so that the team can explain what was checked, what failed, and what must happen next.",
        outcomes: [
          "Follow the steps of the test approach for a given scenario.",
          "Apply the appropriate test phase for a given scenario.",
          "Explain the testing types used to verify an IT system.",
        ],
        sections: [
          {
            title: "2.1 A Structured Test Approach Description",
            blocks: [
              {
                type: "paragraph",
                text: "A structured Test Approach Description explains how testing will be carried out so that everyone on the project follows the same method.",
              },
              {
                type: "table",
                headers: ["Part of the approach", "What it explains"],
                rows: [
                  ["Methodology", "The testing method, phases, and order of work"],
                  ["Scope", "What is included and excluded from testing"],
                  ["Contacts and roles", "Who prepares, executes, reviews, and signs off"],
                  ["Issue tracking", "How defects are logged, prioritised, and followed up"],
                  ["Entry and exit criteria", "What must be true before testing starts and before it finishes"],
                ],
              },
            ],
          },
          {
            title: "2.2 Test Approach Steps",
            blocks: [
              {
                type: "ordered-list",
                items: [
                  "Define the test objective and scope.",
                  "Design test cases from the requirements.",
                  "Prepare the environment, users, and test data.",
                  "Run the test cases carefully.",
                  "Compare actual results with expected results.",
                  "Log any defects with clear evidence.",
                  "Retest fixes and run regression checks if needed.",
                  "Summarise the findings and request sign-off.",
                ],
              },
              {
                type: "callout",
                variant: "info",
                text: "The order matters: plan first, execute second, report last. Skipping the plan usually creates confusion later.",
              },
            ],
          },
          {
            title: "2.3 Common Test Phases",
            blocks: [
              {
                type: "table",
                headers: ["Phase", "What it checks", "When it helps most"],
                rows: [
                  ["SIT1", "Individual modules or components", "Early integration stage"],
                  ["SIT2", "How integrated parts work together", "When the full process starts joining up"],
                  ["Parallel Testing", "Compare old and new system outputs", "When replacing an existing system"],
                  ["Load Testing", "Performance under expected or peak traffic", "When speed and volume matter"],
                  ["Model Office Testing", "Real-world workflows with end users", "Before business sign-off"],
                ],
              },
            ],
          },
          {
            title: "2.4 Testing Types You Must Recognise",
            blocks: [
              {
                type: "table",
                headers: ["Test type", "What it checks", "Example"],
                rows: [
                  ["Functional", "Does the feature work correctly?", "Can a learner submit a form successfully?"],
                  ["Performance", "Is it fast enough under load?", "How long does the page take to open with many users?"],
                  ["Security", "Can unauthorised access or data leaks occur?", "Can one learner view another learner's record?"],
                  ["Usability", "Is it easy for the user to understand and use?", "Can a new user follow the screen without help?"],
                  ["Compatibility", "Does it work across devices and browsers?", "Does the page still work in Chrome and Edge?"],
                  ["Regression", "Did a recent change break older features?", "After a fix, does the login still work?"],
                ],
              },
            ],
          },
          {
            title: "2.5 Mini Example: Pass or Fail?",
            blocks: [
              {
                type: "table",
                headers: ["Check", "Expected result", "Actual result", "Status"],
                rows: [
                  ["Login with correct password", "Dashboard opens", "Dashboard opens", "Pass"],
                  ["Login with blank password", "Validation message appears", "Page freezes", "Fail"],
                ],
              },
            ],
          },
        ],
      },
      {
        id: "session-3",
        label: "Session 3",
        title: "Collect and Record Data",
        summary:
          "Capture the right evidence so that defects can be understood, reproduced, and fixed.",
        body:
          "Good testers do more than say 'it failed'. They collect the information that explains what happened, where it happened, and how it can be repeated.",
        outcomes: [
          "Explain what a diagnostic data adapter is and how it is used.",
          "Identify the resource types used in test data collection.",
          "Describe the characteristics of a lab testing environment.",
        ],
        sections: [
          {
            title: "3.1 What Diagnostic Information Is",
            blocks: [
              {
                type: "paragraph",
                text: "Diagnostic information is the technical evidence collected while a test is running. It helps the team understand why a problem happened and how to reproduce it.",
              },
              {
                type: "list",
                items: [
                  "Error messages or event logs",
                  "Screenshots or screen recordings",
                  "System information such as OS, memory, or browser version",
                  "Steps performed just before the failure happened",
                ],
              },
            ],
          },
          {
            title: "3.2 Common Diagnostic Data Adapters and Tools",
            blocks: [
              {
                type: "table",
                headers: ["Tool / adapter", "What it captures", "Why it helps"],
                rows: [
                  ["System Information", "Machine and operating-system details", "Shows the environment where the issue happened"],
                  ["Event Log", "Important system events and errors", "Helps trace hidden technical failures"],
                  ["Screen Recorder", "Video of the test run", "Shows exactly what the tester saw and clicked"],
                  ["Code Coverage", "Which lines of code were executed", "Shows whether key logic was actually tested"],
                  ["IntelliTrace / trace logs", "Execution steps and debugging detail", "Supports deeper analysis after a failure"],
                ],
              },
            ],
          },
          {
            title: "3.3 Resource Types Needed for Testing",
            blocks: [
              {
                type: "table",
                headers: ["Resource type", "Purpose"],
                rows: [
                  ["Test machines", "Computers or virtual machines that match the target environment"],
                  ["Test data", "Realistic valid, invalid, and boundary input values"],
                  ["Test tools", "Applications for running tests, tracking issues, or recording evidence"],
                  ["People", "Testers, analysts, developers, and sometimes end users"],
                  ["Documents", "Requirements, test plan, cases, logs, and defect reports"],
                ],
              },
            ],
          },
          {
            title: "3.4 Characteristics of a Good Lab Environment",
            blocks: [
              {
                type: "list",
                items: [
                  "It is separate from live production work.",
                  "It can be reset to a known starting state.",
                  "It matches the real environment as closely as possible.",
                  "It uses controlled access so unexpected changes do not spoil the test.",
                ],
              },
              {
                type: "callout",
                variant: "tip",
                text: "If the environment is not documented, the team may struggle to reproduce the same failure later.",
              },
            ],
          },
          {
            title: "3.5 Example Defect Log Entry",
            blocks: [
              {
                type: "code",
                text: "Defect ID: BUG-014\nTitle: Blank password freezes login page\nEnvironment: Chrome on Windows 11\nSteps: Open login -> leave password blank -> click Sign In\nExpected: Validation message appears\nActual: Page freezes and no message is shown\nSeverity: High",
              },
            ],
          },
        ],
      },
      {
        id: "session-4",
        label: "Session 4",
        title: "Prepare the Testing",
        summary:
          "Bring the whole module together by planning the work, organising documents, and getting ready for sign-off.",
        body:
          "Before a formal test begins, the team needs a clear plan, the right environment, the correct evidence templates, and an agreed way to report results.",
        outcomes: [
          "Identify the planning categories for preparing a test.",
          "Produce the appropriate test documentation for a given scenario.",
        ],
        sections: [
          {
            title: "4.1 Planning Categories for Formal Testing",
            blocks: [
              {
                type: "table",
                headers: ["Planning category", "What it covers"],
                rows: [
                  ["Scope definition", "What will and will not be tested"],
                  ["Resource planning", "People, tools, devices, and data needed"],
                  ["Schedule planning", "Dates, sequence, and timing for each phase"],
                  ["Risk management", "Known testing risks and how they will be reduced"],
                  ["Environment planning", "Lab setup, access, configuration, and reset process"],
                ],
              },
            ],
          },
          {
            title: "4.2 The Main Test Documents",
            blocks: [
              {
                type: "list",
                items: [
                  "Test Plan - the master guide for scope, roles, schedule, and approach",
                  "Test Case Specification - the exact steps, inputs, and expected results",
                  "Test Script - step-by-step instructions followed during execution",
                  "Test Data - the values used to run the checks",
                  "Test Log - the running record of what happened during the test",
                  "Defect Report - details of each problem found",
                  "Test Summary Report - final view of coverage, failures, and sign-off recommendation",
                ],
              },
            ],
          },
          {
            title: "4.3 Preparing for System Integration Testing (SIT)",
            blocks: [
              {
                type: "ordered-list",
                items: [
                  "Confirm the environment matches the intended system configuration.",
                  "Check the test hierarchy and know whether you are in SIT1, SIT2, or a later phase.",
                  "Prepare the required accounts, permissions, and test data.",
                  "Review the test plan, cases, and defect-report template before execution starts.",
                  "Make sure contacts and escalation paths are known if issues block progress.",
                ],
              },
            ],
          },
          {
            title: "4.4 Guided Practice: Write a Tiny Test Case",
            blocks: [
              {
                type: "table",
                headers: ["Field", "Example entry"],
                rows: [
                  ["Test Case ID", "TC-LOGIN-01"],
                  ["Objective", "Check that valid user login opens the dashboard"],
                  ["Steps", "Enter username and password, then click Sign In"],
                  ["Expected Result", "Dashboard opens successfully"],
                  ["Actual Result", "To be completed during testing"],
                  ["Status", "Pass / Fail"],
                ],
              },
              {
                type: "callout",
                variant: "info",
                text: "This small format is enough to teach the discipline of testing: objective, steps, expected result, actual result, and status.",
              },
            ],
          },
        ],
      },
      {
        id: "facilitator-activities",
        label: "Facilitator Notes",
        title: "Facilitator Activities - 14908 Testing Practice",
        summary:
          "Guide learners through short demonstrations that show how test evidence is planned, captured, and reported.",
        body:
          "The strongest delivery method for this unit is practical discussion around a simple system such as a login form, browser page, or support tool, rather than theory only.",
        sections: [
          {
            title: "Suggested Class Flow",
            blocks: [
              {
                type: "ordered-list",
                items: [
                  "Begin with one familiar example such as logging in to a portal or opening a form.",
                  "Ask learners to state the expected result before anyone clicks the button.",
                  "Run the test and compare the actual result with the expected result.",
                  "Capture a simple defect log entry if the test fails.",
                  "End by asking which test document should be updated and why.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "learner-activities",
        label: "Activities",
        title: "Learner Activities - Testing Workbook Tasks",
        summary:
          "Short tasks that help learners practise selecting procedures, running checks, and writing evidence clearly.",
        body:
          "Keep all notes, screenshots, and written answers as part of the learner's PoE evidence for this unit.",
        sections: [
          {
            title: "Activity Schedule",
            blocks: [
              {
                type: "table",
                headers: ["Activity", "Focus"],
                rows: [
                  ["Activity 1", "Explain the purpose of testing and match a test procedure to a hardware or software scenario."],
                  ["Activity 2", "Describe factors that affect the level of testing effort required in a project."],
                  ["Activity 3", "Draft a simple Test Approach Description showing methodology, contacts, and issue tracking."],
                  ["Activity 4", "Capture a small defect log with expected result, actual result, and severity."],
                  ["Activity 5", "Prepare a basic test case and identify the documents needed before SIT begins."],
                ],
              },
            ],
          },
        ],
      },
      {
        id: "resources",
        label: "Resources",
        title: "Resources - Testing IT Systems Session",
        summary:
          "Materials that support a simple but realistic classroom testing exercise.",
        body:
          "Prepare the environment and templates before class so learners spend more time practising and less time waiting.",
        sections: [
          {
            title: "Resource List",
            blocks: [
              {
                type: "list",
                items: [
                  "A simple demo system to test, such as a login form or basic web page.",
                  "Printed or digital test case templates.",
                  "A defect log template with severity and reproduction steps.",
                  "Sample screenshots or logs for evidence discussion.",
                  "A checklist for environment setup and sign-off.",
                ],
              },
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
            title: "1.1 Introduction to Network Protocols",
            blocks: [
              {
                type: "paragraph",
                text: "Just as diplomats follow diplomatic protocol when they meet, computers also need agreed rules so that they can understand one another. In networking, those rules are called protocols.",
              },
              {
                type: "callout",
                variant: "info",
                text: "Easy definition: a protocol is a set of rules or a language used by computers and network devices to communicate with one another.",
              },
              {
                type: "table",
                headers: ["Word", "Simple meaning", "Example"],
                rows: [
                  ["Protocol", "Rules for communication", "HTTP, TCP/IP"],
                  ["Service", "A function shared over the network", "File service, print service"],
                  ["TCP/IP", "The main family of internet communication protocols", "Used when websites and apps send data across the internet"],
                ],
              },
              {
                type: "paragraph",
                text: "TCP/IP stands for Transmission Control Protocol / Internet Protocol. It is the best-known family of networking protocols used on the Internet, and the two main parts are TCP and IP.",
              },
            ],
          },
          {
            title: "1.2 Internet Standards and Figure 1.1",
            blocks: [
              {
                type: "paragraph",
                text: "The learner guide explains that network rules are written down as standards. Internet standards are often called RFCs (Requests for Comment). Other important standards bodies include ISO, which standardised the ISO OSI model, and the ITU in Geneva, which also issues communication standards.",
              },
              {
                type: "table",
                headers: ["Standard / body", "What learners should know"],
                rows: [
                  ["RFC", "Written internet standards used to describe how internet protocols should work"],
                  ["ISO OSI", "A 7-layer reference model used to explain network communication"],
                  ["ITU", "An international body that also publishes communication standards"],
                ],
              },
              {
                type: "code",
                text: "Figure 1.1 idea (easy version)\nPerson A -> Translator -> Message travels -> Translator -> Person B\nComputer A -> Protocol layers -> Network media -> Protocol layers -> Computer B",
              },
              {
                type: "callout",
                variant: "tip",
                text: "Use the translator picture when teaching: people need interpreters to understand each other, and computers use protocol layers for the same reason.",
              },
            ],
          },
          {
            title: "1.3 Session-Less HTTP and Session Management",
            blocks: [
              {
                type: "paragraph",
                text: "The Internet mainly uses HTTP for web pages, and HTTP is session-less (also called stateless). This means the server treats each request as new and does not automatically remember the user from the previous click.",
              },
              {
                type: "callout",
                variant: "warning",
                text: "Simple idea: when you click one page and then another, the website must use extra methods to remember who you are.",
              },
              {
                type: "heading",
                text: "Why this matters in web development",
              },
              {
                type: "list",
                items: [
                  "The system must find a way to remember the user between requests.",
                  "Developers often use session IDs to keep track of a visitor safely.",
                  "If session handling is weak, the site can become confusing or insecure.",
                ],
              },
              {
                type: "table",
                headers: ["Method", "Simple meaning", "Risk to remember"],
                rows: [
                  ["Cookie", "A small piece of data stored by the browser", "Can be disabled or stolen if security is poor"],
                  ["URL session ID", "The session code appears in the web address", "Can leak in history or shared links"],
                  ["Hidden form field", "The session code is passed quietly in a form", "Needs careful implementation"],
                ],
              },
            ],
          },
          {
            title: "1.4 Bandwidth and Application Design",
            blocks: [
              {
                type: "paragraph",
                text: "Bandwidth is the amount of data that can move through the network in a certain time. Slow bandwidth means the user waits longer for pages, images, and scripts to load.",
              },
              {
                type: "heading",
                text: "Implications of limited bandwidth",
              },
              {
                type: "list",
                items: [
                  "Large pictures and heavy pages take longer to load.",
                  "Too much code can make the page slow on older computers and phones.",
                  "Users may leave the page if it feels too slow or confusing.",
                  "Good web design keeps pages light, clear, and easy to open.",
                ],
              },
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
