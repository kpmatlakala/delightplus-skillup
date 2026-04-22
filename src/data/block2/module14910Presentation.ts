export type Module14910SpeakerNotes = {
  title: string;
  objectives: string;
  activityIndividual: string;
  activityGroup: string;
  summary: string;
};

export type Module14910SlideListItem = {
  slideNumber: number;
  id: string;
  title: string;
  type: "title" | "content" | "activity" | "summary" | "qa";
  content: string;
  notes: string;
  duration: number;
  phaseCards?: string[];
  cards?: string[];
  imageUrl?: string;
  imageAlt?: string;
  quiz?: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
};

export const module14910SpeakerNotes: Module14910SpeakerNotes = {
  title:
    "Session 1 — Tools, Editors, and Syntax Basics.\n\n" +
    "Open with reassurance: today is about confidence, not speed. Tell the class that programmers follow a simple journey — Write → Check → Build — and Session 1 is where that journey begins.\n\n" +
    "Start with a quick tech check so the editor and language are working before teaching new ideas.",
  objectives:
    "Keep the session simple, visual, and practical:\n\n" +
    "• Learners should understand what an editor is and why it matters.\n" +
    "• They should recognise syntax as the grammar of code.\n" +
    "• They should see that syntax checking helps us fix mistakes before running.\n" +
    "• They should understand that compiling/building turns code into something the computer can use.\n\n" +
    "Assess understanding through guided explanation and small actions, not typing speed.",
  activityIndividual:
    "Model the full workflow slowly on the projector.\n\n" +
    "• Let learners open the editor and create one simple file.\n" +
    "• Type a short example together, save it, and run or check it.\n" +
    "• Introduce one syntax error deliberately, then fix it together.\n" +
    "• Demonstrate one built-in function such as SQR() or LEN() and explain what it does.\n\n" +
    "The practical is successful when the learner can describe what happened and why.",
  activityGroup:
    "Use a light explanation-based pair activity.\n\n" +
    "Pairs can identify a small syntax error, explain the likely problem, suggest the fix, and then describe whether the issue would be found while checking or while running.",
  summary:
    "End Session 1 with a short knowledge-check quiz, then continue into the next sessions of the module.\n\n" +
    "Close by asking: 'What is the job of an editor?', 'What does syntax mean?', and 'What happens after we fix the errors?' Keep the saved file or screenshot as early PoE evidence.",
};

export const module14910SlideList: Module14910SlideListItem[] = [
  {
    slideNumber: 1,
    id: "14910-title",
    title: "Session 1 — Tools, Editors, and Syntax Basics",
    type: "title",
    content: "Operate Computer Programming Development Tools — a gentle first step into coding for non-technical learners.",
    notes: module14910SpeakerNotes.title,
    duration: 5,
    phaseCards: ["Write", "Check", "Build"],
  },
  {
    slideNumber: 2,
    id: "14910-outcomes",
    title: "Learning Outcomes",
    type: "content",
    content:
      "By the end of Session 1 you should be able to:\n" +
      "• Use an editor to write program source code\n" +
      "• Use a syntax checker to identify and understand errors\n" +
      "• Compile source code into an executable program",
    notes: module14910SpeakerNotes.objectives,
    duration: 6,
    cards: ["Use an editor", "Check syntax", "Build and run"],
  },
  {
    slideNumber: 3,
    id: "14910-roadmap",
    title: "The Developer's Roadmap",
    type: "content",
    content:
      "Think of programming as a 3-stage journey\n" +
      "• Write → use the editor to create source code\n" +
      "• Check → use the syntax checker to find and fix errors\n" +
      "• Build → use the compiler to turn code into something the computer can run",
    notes:
      "Keep returning to this Write → Check → Build roadmap throughout the session so learners see the bigger picture before details.",
    duration: 6,
    phaseCards: ["✍️ Writing — Editor", "🔍 Checking — Syntax Checker", "⚙️ Building — Compiler"],
  },
  {
    slideNumber: 4,
    id: "14910-editor",
    title: "Tools, IDE, and the Editor",
    type: "content",
    content:
      "A programming tool is software that helps developers create, debug, maintain, or support other programs\n" +
      "• A text editor is a simple program used to create and edit text files\n" +
      "• In programming, that text becomes source code\n" +
      "• Tools can be used together, just like hand tools are used together to fix something physical\n" +
      "• Your current Python setup already gives you the main tool you need to begin",
    notes:
      "Start with the formal idea of a software development tool, then make it simple: an editor helps you create and change code, while other tools help you run and debug it.",
    duration: 6,
    cards: ["Programming tool", "Text editor", "Source code", "Support tools"],
  },
  {
    slideNumber: 5,
    id: "14910-editor-compare",
    title: "Side-by-Side Comparison — Editor, IDE, and IDLE",
    type: "content",
    content:
      "Use this quick comparison to understand the tools you may hear about in class\n" +
      "• Editor — good for writing code, but may need extra setup to run or debug\n" +
      "• IDE — includes writing, running, and debugging tools together\n" +
      "• IDLE — a simple Python-focused environment that already works well for beginner practice",
    notes:
      "Use the table on screen to compare the tools directly. Emphasise that IDLE is enough to start, while bigger IDEs add more features as learners grow.",
    duration: 7,
    cards: [
      "Editor: write code ✔ | run code ❌ | debugging ❌ | many languages | Example: VS Code",
      "IDE: write code ✔ | run code ✔ | debugging ✔ | many languages | Example: IntelliJ IDEA",
      "IDLE: write code ✔ | run code ✔ | basic debugging ✔ | Python only | Example: IDLE",
    ],
  },
  {
    slideNumber: 6,
    id: "14910-live-demo-output",
    title: "Live Demo — From Code to Output",
    type: "content",
    content:
      "Type and run this simple Python example in the IDE\n" +
      "• x = 5\n" +
      "• y = 6\n" +
      "• print(\"sum:\", x + y)\n" +
      "• Ask: what output do you expect before you run it?\n" +
      "• Output: sum: 11",
    notes:
      "Use this as a calm live demonstration. Type the code exactly as shown, ask learners to predict the result, then run it so they see how code becomes output immediately.",
    duration: 6,
    cards: ["Type it", "Predict it", "Run it", "See the output"],
  },
  {
    slideNumber: 7,
    id: "14910-syntax-intro",
    title: "Syntax Basics and Error Checking",
    type: "content",
    content:
      "Before a program can run properly, its instructions must be written in a form the computer understands.",
    notes:
      "Keep this slide visually light. Use it as the entry into Part 2, with the image doing most of the work and only a short body line on screen.",
    duration: 6,
    imageUrl:
      "/docs/SAQA_78965_CET_Training/01_Core_UnitStandards/US 14910/14910 - Learner Workbook_images/image-003.jpeg",
    imageAlt: "Programming discussion visual",
  },
  {
    slideNumber: 8,
    id: "14910-syntax-checking-support",
    title: "How the Editor Helps You Check Your Work",
    type: "content",
    content:
      "The editor gives you useful clues while you work\n" +
      "• It can highlight mistakes using colour, underlines, and messages\n" +
      "• Syntax checking asks: 'Did I write this instruction in the correct format?'\n" +
      "• Fixing small mistakes early saves time and reduces frustration later",
    notes:
      "This is the detailed follow-up to the lighter image slide. Let learners see that the editor is supportive, not scary.",
    duration: 7,
    cards: ["Notice", "Check", "Fix"],
  },
  {
    slideNumber: 9,
    id: "14910-what-is-syntax",
    title: "What Syntax Means in Programming",
    type: "content",
    content:
      "Syntax is the set of writing rules a programming language expects\n" +
      "• Keywords must be spelled correctly\n" +
      "• Brackets, quotation marks, and punctuation must open and close properly\n" +
      "• Statements must follow the correct order and format\n" +
      "• Good syntax helps the computer understand exactly what you want it to do",
    notes:
      "Compare syntax to grammar in English: the message only makes sense when the words and symbols are in the right place.",
    duration: 7,
    cards: ["Correct words", "Correct symbols", "Correct order"],
  },
  {
    slideNumber: 10,
    id: "14910-syntax-example-correct",
    title: "Example of Correct Syntax",
    type: "content",
    content:
      "Here is a simple Python example written with correct syntax\n" +
      "• age = 18\n" +
      "• if age >= 18:\n" +
      "•     print(\"Adult\")\n" +
      "• The keyword is correct, the colon is present, and the brackets and quotes are complete\n" +
      "• This means the computer can read the instruction properly",
    notes:
      "Use this slide to show what 'good syntax' actually looks like before showing the broken version.",
    duration: 7,
  },
  {
    slideNumber: 11,
    id: "14910-what-is-syntax-error",
    title: "What a Syntax Error Is",
    type: "content",
    content:
      "A syntax error happens when a rule of the language is broken\n" +
      "• A bracket may be missing\n" +
      "• A colon or semicolon may be forgotten\n" +
      "• A command may be misspelled\n" +
      "• The editor or checker usually points to the line where the problem starts\n" +
      "• A syntax error usually stops the program from working until it is corrected",
    notes:
      "Explain that syntax errors are different from logical errors: syntax errors stop understanding, while logical errors allow the program to run but produce the wrong answer.",
    duration: 8,
  },
  {
    slideNumber: 12,
    id: "14910-fix-the-error",
    title: "Broken Demo — Spot the Error",
    type: "activity",
    content:
      "Now break the working code and try to run this version\n" +
      "• x = 5\n" +
      "• y = 6\n" +
      "• print(\"sum:\" x + y)\n" +
      "• Ask yourself: what is missing between \"sum:\" and x + y?\n" +
      "• Do not fix it yet — answer the quiz first",
    notes:
      "Paste only the broken code into the Python IDE, let learners see the error, and pause before revealing the fix. This builds curiosity before the quiz slide.",
    duration: 7,
  },
  {
    slideNumber: 13,
    id: "14910-quiz-session-1",
    title: "Quick Syntax Check",
    type: "qa",
    content: "Answer this quick syntax question, then continue with the rest of Session 1.",
    notes: module14910SpeakerNotes.summary,
    duration: 4,
    quiz: {
      question: "Why does `print(\"sum:\" x + y)` cause an error?",
      options: [
        "A comma is missing between \"sum:\" and x + y",
        "The code must use a semicolon instead of print",
        "Python does not allow addition inside print",
        "The numbers 5 and 6 must be written as strings",
      ],
      answerIndex: 0,
      explanation:
        "Correct code: `x = 5`, `y = 6`, then `print(\"sum:\", x + y)`. The comma separates the text label from the calculation so Python can print both parts correctly.",
    },
  },
  {
    slideNumber: 14,
    id: "14910-error-messages",
    title: "List of Syntax Checking Error Messages",
    type: "content",
    content:
      "Some syntax checkers show short codes or labels to describe the problem\n" +
      "• 0001 / 0002 = undefined or unexpected system error — save your work and inform technical support\n" +
      "• 0003 = illegal format or literal — check numbers, signs, decimal points, or quotation marks\n" +
      "• 0004 = illegal character — replace a symbol that the language does not accept\n" +
      "• 0009 = a full stop or period is missing where the language expects one\n" +
      "• 0011 = a reserved word is missing or used incorrectly",
    notes:
      "These examples come from formal syntax-checking tools. The key lesson is that error messages are clues: they usually tell you what kind of rule has been broken.",
    duration: 7,
    cards: ["0001/0002 = support", "0003 = format", "0004 = character", "0009/0011 = punctuation or keyword"],
  },
  {
    slideNumber: 15,
    id: "14910-error-resolution",
    title: "How to Respond to Error Messages",
    type: "content",
    content:
      "When an error message appears, work through it calmly and step by step\n" +
      "• Read the message carefully before changing anything\n" +
      "• Go to the line shown by the checker\n" +
      "• Check punctuation, spelling, keywords, and quote marks\n" +
      "• Fix one issue at a time, then save and run again\n" +
      "• If the tool says the system itself failed unexpectedly, report it to support",
    notes:
      "Keep learners focused on process: read, locate, fix, test. This helps them respond confidently instead of guessing wildly.",
    duration: 6,
  },
  {
    slideNumber: 16,
    id: "14910-compile-tool",
    title: "What the Compile or Build Tool Uses",
    type: "content",
    content:
      "The tool that prepares a program to run works with several ingredients\n" +
      "• User-written code = the instructions created by the programmer\n" +
      "• Standard or library functions = ready-made functions already provided by the language\n" +
      "• The tool checks syntax, processes the code, and prepares it for execution\n" +
      "• This is why correct syntax matters before running a program",
    notes:
      "Use this slide to connect the idea of writing code with the build or compile step. Learners should see that their work combines with built-in tools from the language.",
    duration: 6,
    cards: ["User code", "Built-in functions", "Syntax check", "Execution"],
  },
  {
    slideNumber: 17,
    id: "14910-what-is-a-function",
    title: "What a Function Is",
    type: "content",
    content:
      "A function is a small reusable block of code that performs a task\n" +
      "• You give it some information if needed\n" +
      "• It processes that information\n" +
      "• It usually gives back a result\n" +
      "• Functions help avoid repeating the same work again and again",
    notes:
      "Define the idea first before splitting it into library and user-defined functions. Keep the explanation plain and practical.",
    duration: 6,
    cards: ["Small task", "Reusable", "May return a value", "Saves time"],
  },
  {
    slideNumber: 18,
    id: "14910-library-functions",
    title: "Library Functions — Ready-Made Helpers",
    type: "content",
    content:
      "Library functions are built-in commands that save time\n" +
      "• String examples: LEFT$, LEN, MID$, LCASE$\n" +
      "• Numeric examples: ABS, SQR, INT, VAL\n" +
      "• Different languages may use different names, but the idea is the same\n" +
      "• You use them when a common task has already been solved for you",
    notes:
      "Explain that a library function is like using a ready-made tool instead of rebuilding the same solution every time.",
    duration: 6,
    cards: ["String functions", "Numeric functions", "Built in", "Saves time"],
  },
  {
    slideNumber: 19,
    id: "14910-user-defined-functions",
    title: "User-Defined Functions — Functions You Create",
    type: "content",
    content:
      "A programmer can also create a custom function for a repeated task\n" +
      "FUNCTION name(parameter list)\n" +
      "    REM body of function\n" +
      "END FUNCTION\n" +
      "• A user-defined function normally returns one value\n" +
      "• Parameters send information into the function\n" +
      "• A clear name makes the function easier to understand and reuse",
    notes:
      "This slide introduces the idea of creating your own reusable function. Keep the explanation simple: it is your own mini tool inside the program.",
    duration: 7,
  },
  {
    slideNumber: 20,
    id: "14910-subroutines-functions",
    title: "Subroutines and Functions",
    type: "content",
    content:
      "Both help break a big program into smaller parts\n" +
      "• A subroutine or SUB is a mini-program that performs an action\n" +
      "• A function is similar, but it returns a value\n" +
      "• Subroutines are useful for repeated steps such as showing a menu\n" +
      "• Functions are useful for repeated calculations such as totals or averages",
    notes:
      "Keep the contrast clear: SUB does a job; FUNCTION does a job and gives back a result.",
    duration: 6,
    cards: ["SUB = action", "FUNCTION = returns value", "Smaller parts", "Reuse"],
  },
  {
    slideNumber: 21,
    id: "14910-what-is-a-variable",
    title: "What a Variable Is",
    type: "content",
    content:
      "A variable is a named place where a program stores information\n" +
      "• The value inside it can change while the program runs\n" +
      "• For example, a learner mark, total price, or user name can be stored in a variable\n" +
      "• Variables help programs remember and use information when needed",
    notes:
      "Define the idea of a variable first before moving to local and global types. Keep it concrete and simple.",
    duration: 6,
    cards: ["Named value", "Can change", "Stores information", "Used later"],
  },
  {
    slideNumber: 22,
    id: "14910-local-global-variables",
    title: "Local and Global Variables",
    type: "content",
    content:
      "Variables can be available in one place or across many parts of a program\n" +
      "• A local variable is used only inside one module, SUB, or FUNCTION\n" +
      "• A global variable can be shared more widely across the program\n" +
      "• Local variables reduce confusion because they stay in one place\n" +
      "• Global variables are useful when many parts of the program need the same value",
    notes:
      "Use a simple classroom example: a learner mark used inside one calculation is local; a school name used across the whole program could be global.",
    duration: 6,
    cards: ["Local = limited scope", "Global = shared scope"],
  },
  {
    slideNumber: 23,
    id: "14910-variables-functions-demo",
    title: "Example — Bringing It All Together",
    type: "content",
    content:
      "This simple Python example shows several Session 1 ideas in one place\n" +
      "• `name = \"cet class\"` and `number = -25` are global variables\n" +
      "• `def SQR(n): return n ** 0.5` is a user-defined function\n" +
      "• `len(name)` and `abs(number)` are ready-made library functions\n" +
      "• `def process_data():` behaves like a subroutine because it performs actions\n" +
      "• `local_text = \"LOCAL ONLY\"` inside that block is a local variable",
    notes:
      "Keep the example simple and readable. In Python, a `def` with no returned value behaves like a subroutine, while a `def` with `return` behaves like a function. This gives learners one concrete example before the final recap quiz.",
    duration: 7,
    cards: ["Global variable", "Local variable", "Library function", "User-defined function"],
  },
  {
    slideNumber: 24,
    id: "14910-session-1-recap-quiz",
    title: "Session 1 Recap Quiz",
    type: "qa",
    content: "Final quiz from the beginning of Session 1 before moving to Session 2.",
    notes: module14910SpeakerNotes.summary,
    duration: 5,
    quiz: {
      question: "Which option best summarises the main ideas from Session 1?",
      options: [
        "Use the IDE/editor to write and save code, check syntax errors, use built-in or custom functions, and understand local vs global variables",
        "Programming starts only after memorising every error code and shortcut",
        "An editor, an IDE, and IDLE all do exactly the same thing in every language",
        "Syntax errors should be ignored until the final test",
      ],
      answerIndex: 0,
      explanation:
        "Session 1 moved from tools and editors, to syntax and checking, to functions and variables. The correct idea is to write, check, understand, and then improve your program step by step.",
    },
  },
  {
    slideNumber: 25,
    id: "14910-session-2-title",
    title: "Session 2 — Number Systems and Conversions",
    type: "title",
    content: "Computers understand numbers differently from us. We use decimal every day, but computers mainly work in binary.",
    notes:
      "Start Session 2 in a human way: decimal is our everyday system, binary is the computer's main system, and octal and hexadecimal are just shorter ways to write binary values.",
    duration: 4,
    phaseCards: ["Decimal", "Binary", "Octal", "Hex"],
  },
  {
    slideNumber: 26,
    id: "14910-session-2-number-systems",
    title: "What Number Systems Are",
    type: "content",
    content:
      "A number system is simply a way of writing and organising numbers\n" +
      "• Decimal uses 10 symbols: 0 to 9\n" +
      "• Binary uses only 0 and 1\n" +
      "• Octal uses 0 to 7\n" +
      "• Hexadecimal uses 0 to 9 and A to F\n" +
      "• The value can stay the same even when the writing style changes",
    notes:
      "Define the concept first before showing the different types. Keep it simple: a number system is just a way of writing numbers using a certain set of symbols.",
    duration: 6,
    cards: ["Way of writing numbers", "Uses symbols", "Different bases", "Same value possible"],
  },
  {
    slideNumber: 27,
    id: "14910-session-2-number-types",
    title: "The 4 Number Systems (With Easy Examples)",
    type: "content",
    content:
      "Here are the four number systems learners should recognise first\n" +
      "• Decimal (base 10): 1, 2, 5, 10\n" +
      "• Binary (base 2): 1, 10, 11, 1010\n" +
      "• Octal (base 8): 1, 7, 10, 12\n" +
      "• Hexadecimal (base 16): 1, 9, A, F, 10\n" +
      "• Decimal is what we use daily, while binary is the computer's main language",
    notes:
      "Use several small examples instead of just one so learners can recognise the patterns without getting overloaded.",
    duration: 6,
    cards: ["Decimal = daily use", "Binary = 0 and 1", "Octal = shorter form", "Hex = 0–9 and A–F"],
  },
  {
    slideNumber: 28,
    id: "14910-session-2-python-demo",
    title: "Practical Demonstration — Convert 10 in Python",
    type: "content",
    content:
      "Use one number only so the conversion stays easy to follow\n" +
      "• number = 10\n" +
      "• print(\"Decimal:\", number)\n" +
      "• print(\"Binary:\", bin(number))\n" +
      "• print(\"Octal:\", oct(number))\n" +
      "• print(\"Hexadecimal:\", hex(number))\n" +
      "• Output: Decimal 10, Binary 0b1010, Octal 0o12, Hexadecimal 0xa",
    notes:
      "Use the same number everywhere: 10. Ask learners what they notice, especially that the value is still the same but the representation changes.",
    duration: 7,
    cards: ["Use 10", "Run it", "Compare outputs", "Same value, different form"],
  },
  {
    slideNumber: 29,
    id: "14910-session-2-convert-back",
    title: "Convert Back to Decimal",
    type: "content",
    content:
      "Python can also turn those forms back into decimal\n" +
      "• int(\"1010\", 2) gives 10\n" +
      "• int(\"12\", 8) gives 10\n" +
      "• int(\"A\", 16) gives 10\n" +
      "• This proves the number has not changed — only the representation has",
    notes:
      "This slide satisfies the conversion-back requirement clearly. Keep it visual and avoid manual conversion steps at this level.",
    duration: 6,
  },
  {
    slideNumber: 30,
    id: "14910-session-2-data-logic",
    title: "What Data Types and Operators Mean",
    type: "content",
    content:
      "A data type tells the program what kind of value it is working with\n" +
      "• Integer = whole number, for example 25\n" +
      "• Float or real = decimal number, for example 12.5\n" +
      "• String = text, for example \"CET Class\"\n" +
      "• Boolean = TRUE or FALSE\n" +
      "• Operators are symbols used to calculate, compare, or combine values",
    notes:
      "Define the idea first: data types describe the kind of information, while operators help the program work with that information.",
    duration: 6,
    cards: ["Integer", "Float", "String", "Boolean", "Operators"],
  },
  {
    slideNumber: 31,
    id: "14910-session-2-operators-demo",
    title: "Python Example — Data Types and Operators",
    type: "content",
    content:
      "A small Python demo can show all these ideas together\n" +
      "• age = 25\n" +
      "• name = \"Lebo\"\n" +
      "• passed = age >= 18\n" +
      "• print(type(age), type(name), type(passed))\n" +
      "• print(5 + 3, 10 - 2, 4 * 2, 8 / 2)\n" +
      "• print(age > 18 and passed)",
    notes:
      "This one example brings together integer, string, Boolean, mathematical operators, comparison, and logical operators without making the lesson too abstract.",
    duration: 7,
    cards: ["Math operators", "Comparison", "Logical operators", "Real code example"],
  },
  {
    slideNumber: 32,
    id: "14910-session-3-title",
    title: "Session 3 — Planning How a Program Thinks",
    type: "title",
    content: "This session is about planning steps clearly before writing more code.",
    notes:
      "Keep the tone practical: Session 3 is not about difficult theory. It is about showing learners that programs follow steps, make choices, and sometimes repeat actions.",
    duration: 4,
    phaseCards: ["Plan", "Sequence", "Choose", "Repeat"],
  },
  {
    slideNumber: 33,
    id: "14910-session-3-algorithms",
    title: "Algorithms and Pseudocode",
    type: "content",
    content:
      "An algorithm is simply a step-by-step way to solve a problem\n" +
      "• Example: make tea → boil water → add tea → pour → drink\n" +
      "• Pseudocode is writing those steps in simple structured language\n" +
      "• It helps you plan before real coding begins\n" +
      "• Good planning saves time during coding and testing",
    notes:
      "Use everyday tasks like making tea or logging into a phone app. Learners should feel that algorithms are already part of daily life.",
    duration: 6,
    cards: ["Problem", "Steps", "Pseudocode", "Code later"],
  },
  {
    slideNumber: 34,
    id: "14910-session-3-pseudocode-demo",
    title: "Mini Demo — Pseudocode Example",
    type: "content",
    content:
      "A simple school example can be written like this\n" +
      "• START\n" +
      "• Enter learner mark\n" +
      "• If mark is 50 or more, display PASS\n" +
      "• Else, display NOT YET COMPETENT\n" +
      "• END\n" +
      "• This is planning logic without worrying about perfect programming syntax yet",
    notes:
      "This slide helps bridge the gap between plain English and real code. Emphasise that pseudocode is for thinking clearly, not for worrying about punctuation.",
    duration: 6,
  },
  {
    slideNumber: 35,
    id: "14910-session-3-structures",
    title: "Sequence, Selection, and Looping",
    type: "content",
    content:
      "Most programs use three basic patterns\n" +
      "• Sequence = do steps in order\n" +
      "• Selection = choose between options, such as PASS or FAIL\n" +
      "• Looping = repeat a task until the condition changes\n" +
      "• Once learners recognise these patterns, real code becomes easier to understand",
    notes:
      "Keep using real-life examples: sequence for a recipe, selection for choosing an umbrella, and looping for asking for a password again until it is correct.",
    duration: 6,
    cards: ["Sequence = order", "Selection = choice", "Looping = repeat"],
  },
  {
    slideNumber: 36,
    id: "14910-session-3-documentation-intro",
    title: "Why Program Documentation Matters",
    type: "content",
    content:
      "Documentation is the written explanation of what the program is, how it works, and how it was tested\n" +
      "• It supports memory during design, development, and testing\n" +
      "• It helps other programmers understand the program later\n" +
      "• It is useful when fixing errors or improving the system in future\n" +
      "• Good documentation should grow as the program grows",
    notes:
      "Introduce documentation as a normal part of programming, not an extra burden. The key message is that good programs should be understandable by more than one person.",
    duration: 6,
    cards: ["Remember", "Explain", "Support others", "Improve later"],
  },
  {
    slideNumber: 37,
    id: "14910-session-3-documentation-types",
    title: "Good Documentation vs Poor Documentation",
    type: "content",
    content:
      "Good documentation makes a program easier to use, test, and maintain\n" +
      "• Good: clear program purpose, comments, pseudocode, test results, and readable notes\n" +
      "• Good: explains inputs, outputs, and important decisions\n" +
      "• Poor: missing comments, no test record, unclear variable names, and no explanation of the logic\n" +
      "• Poor documentation makes errors harder to trace and changes harder to make",
    notes:
      "This slide directly supports the 'good and bad documentation principles' outcome. Use examples learners can recognise from their own work.",
    duration: 6,
    cards: ["Clear purpose", "Comments", "Testing notes", "Readable logic"],
  },
  {
    slideNumber: 38,
    id: "14910-session-3-quality",
    title: "Programming Quality Assurance Principles",
    type: "content",
    content:
      "Quality assurance means checking that the program is useful, reliable, and easy to improve\n" +
      "• Effectiveness = does it meet the user's need?\n" +
      "• Usability = is it easy for people to use?\n" +
      "• Reliability = does it work correctly again and again?\n" +
      "• Maintainability = can it be updated or fixed without confusion?\n" +
      "• Testability = can we clearly check whether a change worked?",
    notes:
      "Keep the quality ideas simple and practical. Learners do not need to memorise every formal label, but they should understand what 'good quality' looks like in a real program.",
    duration: 7,
    cards: ["Effective", "Usable", "Reliable", "Maintainable", "Testable"],
  },
  {
    slideNumber: 39,
    id: "14910-session-3-quality-culture",
    title: "Quality Culture and Standards",
    type: "content",
    content:
      "High-quality systems do not happen by accident\n" +
      "• Teams improve quality by focusing on users and reducing avoidable mistakes\n" +
      "• Continuous checking and feedback help keep standards high\n" +
      "• International quality ideas such as ISO 9000 encourage organisations to build reliable processes\n" +
      "• In simple terms: quality means doing the work carefully, consistently, and with evidence",
    notes:
      "This slide translates the broader quality-management discussion into something accessible for learners. Keep it big-picture and non-technical.",
    duration: 6,
  },
  {
    slideNumber: 40,
    id: "14910-session-4-title",
    title: "Session 4 — Using Variables, Expressions, and Debugging",
    type: "title",
    content: "The final session shows how programs store values, make calculations, and get fixed when something goes wrong.",
    notes:
      "Keep the session practical and reassuring. Learners do not need advanced theory here — they need clear examples of how variables, operators, and debugging appear in real code.",
    duration: 4,
    phaseCards: ["Store", "Calculate", "Organise", "Fix"],
  },
  {
    slideNumber: 41,
    id: "14910-session-4-variables",
    title: "Constants and Variables — A Quick Recap",
    type: "content",
    content:
      "Programs need places to store information while they work\n" +
      "• A variable stores a value that can change, such as a learner mark or total price\n" +
      "• A constant stores a value that should stay the same\n" +
      "• Example: `mark` may change, but `SCHOOL_NAME` usually stays fixed\n" +
      "• Using names makes the program easier to read and understand",
    notes:
      "This is a recap slide, but it should still define the ideas clearly. Use simple examples from school or everyday life so the concepts stay grounded.",
    duration: 6,
    cards: ["Variable = can change", "Constant = stays fixed"],
  },
  {
    slideNumber: 42,
    id: "14910-session-4-variables-demo",
    title: "Python Example — Constants and Variables",
    type: "content",
    content:
      "A tiny Python example makes the difference visible\n" +
      "• SCHOOL_NAME = \"CET Connect\"\n" +
      "• mark = 72\n" +
      "• print(\"School:\", SCHOOL_NAME)\n" +
      "• print(\"Mark:\", mark)\n" +
      "• mark = 80\n" +
      "• print(\"Updated Mark:\", mark)",
    notes:
      "Show that `mark` changes while `SCHOOL_NAME` stays the same. This helps learners see the idea, not just hear the definition.",
    duration: 7,
  },
  {
    slideNumber: 43,
    id: "14910-session-4-expressions",
    title: "Operators and Expressions",
    type: "content",
    content:
      "Programs use operators to calculate, compare, and make decisions\n" +
      "• Arithmetic operators: +, -, *, /\n" +
      "• Comparison operators: >, <, ==, !=\n" +
      "• Logical operators: and, or, not\n" +
      "• An expression is a line that uses values and operators to produce an answer",
    notes:
      "Keep the focus on meaning rather than labels. An expression is simply a useful statement that gives a result.",
    duration: 6,
    cards: ["Calculate", "Compare", "Combine conditions", "Produce an answer"],
  },
  {
    slideNumber: 44,
    id: "14910-session-4-operators-demo",
    title: "Python Example — Operators in Action",
    type: "content",
    content:
      "Here is a simple demo using mathematical and logical operators\n" +
      "• a = 10\n" +
      "• b = 3\n" +
      "• print(a + b)      # 13\n" +
      "• print(a > b)      # True\n" +
      "• print(a > 5 and b < 5)  # True\n" +
      "• This shows calculation, comparison, and decision-making in one example",
    notes:
      "This slide reinforces the recap with one clean example. Learners should be able to point to which line is doing maths and which line is making a logical decision.",
    duration: 7,
  },
  {
    slideNumber: 45,
    id: "14910-session-4-modular",
    title: "Breaking a Program into Smaller Parts",
    type: "content",
    content:
      "Large programs are easier to manage when split into smaller pieces\n" +
      "• One part can collect input\n" +
      "• Another part can calculate results\n" +
      "• Another part can display the answer\n" +
      "• Smaller parts are easier to test, fix, and reuse",
    notes:
      "Avoid heavy terminology first. Show the value of modularity through organisation and clarity.",
    duration: 6,
    cards: ["Smaller steps", "Clear roles", "Easier testing", "Reusable work"],
  },
  {
    slideNumber: 46,
    id: "14910-session-4-debugging",
    title: "Debugging Techniques",
    type: "content",
    content:
      "Debugging means finding and fixing problems in a calm, step-by-step way\n" +
      "• Read the error message carefully\n" +
      "• Test with simple sample data\n" +
      "• Check one line or one section at a time\n" +
      "• If stuck, explain the code out loud or ask for help\n" +
      "• Bugs are normal — fixing them is part of programming",
    notes:
      "End on encouragement. Learners should leave knowing that errors are expected and manageable.",
    duration: 6,
  },
  {
    slideNumber: 47,
    id: "14910-summary",
    title: "14910 Module Path — Wrap-Up",
    type: "summary",
    content:
      "The module now has full coverage across all four sessions\n" +
      "• Session 1 = Tools, syntax, functions, and variables\n" +
      "• Session 2 = Number systems, data types, and operators\n" +
      "• Session 3 = Planning, documentation, and quality checks\n" +
      "• Session 4 = Constants, expressions, modular work, and debugging",
    notes: module14910SpeakerNotes.summary,
    duration: 4,
  },
];
