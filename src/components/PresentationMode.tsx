import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  MessageSquare,
  Target,
  BookOpen,
  Zap,
  CheckCircle2,
  Lightbulb,
  Users,
  AlertCircle,
  Maximize2,
  HelpCircle,
  Trophy,
  Coffee,
  GraduationCap,
  ArrowRight,
  LayoutGrid,
  ChevronDown,
  Smartphone,
  Copy,
  Wifi,
  WifiOff,
  QrCode,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Module } from "@/types/course";
import type { ModuleLessonFlow, LessonSection } from "@/data/moduleLessonFlows";
import { supabase } from "@/integrations/supabase/client";
import {
  generateSessionCode,
  channelName,
  EV_SLIDE_STATE,
  EV_CMD,
  EV_PING,
  EV_REQUEST_SYNC,
  type SlideStatePayload,
  type RemoteCommand,
} from "@/lib/presentationSync";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
type SlideType = "title" | "objectives" | "content" | "activity" | "summary" | "quiz" | "end-deck";

interface Slide {
  type: SlideType;
  title: string;
  subtitle?: string;
  bullets?: string[];
  body?: string;
  highlight?: string;
  speakerNote?: string;
  badge?: string;
  /* Quiz fields */
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrect?: number;
  quizExplanation?: string;
  /* Session grouping (populated by buildFlowSlides) */
  sessionLabel?: string;
  isSessionStart?: boolean;
}

interface QuizState {
  selected: number | null;
  revealed: boolean;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Per-module quiz questions
───────────────────────────────────────────────────────────────────────────── */
type QuizQ = { question: string; options: string[]; correct: number; explanation: string };

const PRESENTATION_QUIZZES: Record<string, QuizQ[]> = {
  "14924": [
    {
      question: "What is the PRIMARY purpose of the Feasibility Study phase in the SDLC?",
      options: [
        "To write detailed code for the proposed system",
        "To determine whether the proposed system is desirable before committing full resources",
        "To train end users on how to use the new system",
        "To run final acceptance tests after development",
      ],
      correct: 1,
      explanation:
        "The feasibility study establishes whether the proposed system is feasible — desirable — before resources are committed to a full-scale project.",
    },
    {
      question: "A Data Flow Diagram (DFD) uses four symbols. Which represents a repository of data maintained by the system?",
      options: [
        "Circle — Process",
        "Directed arrow — Data Flow",
        "Square — External Entity",
        "Parallel lines — Data Store",
      ],
      correct: 3,
      explanation:
        "The Data Store (parallel lines) represents a repository where data is held. Circles = processes, arrows = data flows, squares = external entities.",
    },
    {
      question: "Which BEST describes the difference between Systems Analysis and Requirements Analysis?",
      options: [
        "They are the same thing with different names",
        "Systems Analysis produces code; Requirements Analysis produces documentation",
        "Systems Analysis establishes WHAT the system will do at high level; Requirements Analysis produces the detailed functional specifications",
        "Requirements Analysis happens before Systems Analysis in the SDLC",
      ],
      correct: 2,
      explanation:
        "Systems Analysis is the broader discipline covering objectives, costs and user needs. Requirements Analysis is the specific stage producing the detailed requirements specification.",
    },
  ],
  "14920": [
    {
      question: "In the 8-Discipline (8D) model, what is the purpose of D4?",
      options: [
        "Define the team and assign roles",
        "Identify and verify root causes",
        "Implement and validate corrective actions",
        "Recognise and reward the team",
      ],
      correct: 1,
      explanation: "D4 (Identify Root Causes) identifies all root causes that could explain why the problem occurred.",
    },
    {
      question: "The Nominal Group Technique (NGT) primarily achieves:",
      options: [
        "Assigning tasks based on seniority",
        "Generating and prioritising ideas while giving every team member an equal voice",
        "Tracking individual attendance and participation",
        "Evaluating team members' KPI performance",
      ],
      correct: 1,
      explanation:
        "NGT combines silent idea generation with group discussion and voting — ensuring equal participation regardless of seniority.",
    },
  ],
  "14918": [
    {
      question: "Which of the following is a BOOLEAN data type value?",
      options: ["42", '"Hello"', "True", "3.14"],
      correct: 2,
      explanation: "Boolean types hold only True or False (1 or 0), used in conditional expressions and control structures.",
    },
    {
      question: "What is the key difference between VALIDATION and VERIFICATION?",
      options: [
        "Validation checks that code compiles; Verification checks that it runs",
        "Validation checks that data is correct and reasonable; Verification checks the system was built correctly to its specification",
        "They are the same — both check syntax errors",
        "Verification runs first; Validation runs after deployment",
      ],
      correct: 1,
      explanation:
        "Validation: 'Are we building the right thing?' Verification: 'Are we building it right?' Both are necessary for quality software.",
    },
  ],
  "14927": [
    {
      question: "In the IDEAL problem-solving model, what does the 'A' stand for?",
      options: ["Analyse", "Act", "Assess", "Approve"],
      correct: 1,
      explanation: "IDEAL: Identify, Define, Explore, Act, Look back. 'A' = Act — implement and monitor the chosen solution.",
    },
    {
      question: "A fishbone (Ishikawa) diagram is used primarily to:",
      options: [
        "Track project timelines",
        "Identify and organise potential root causes of a problem",
        "Display the flow of data through a system",
        "Schedule team meetings",
      ],
      correct: 1,
      explanation: "The fishbone diagram organises potential root causes into categories to identify what drives a problem.",
    },
  ],
  "14915": [
    {
      question: "What is the purpose of DESK-CHECKING a program design?",
      options: [
        "Compiling the code to find syntax errors",
        "Running the program with test data on a computer",
        "Manually tracing through the logic with sample data to find design errors before coding",
        "Reviewing the design document with the client for approval",
      ],
      correct: 2,
      explanation:
        "Desk-checking is a manual walkthrough of the logic — tracing pseudocode with sample data to catch logical errors before coding begins.",
    },
    {
      question: "In structured design, COUPLING between modules describes:",
      options: [
        "How many lines of code each module contains",
        "The degree of interdependence between modules",
        "How many parameters a function accepts",
        "The order in which modules are called",
      ],
      correct: 1,
      explanation:
        "Low coupling means modules can be developed and maintained independently. High coupling creates fragile systems.",
    },
  ],
};

function getQuizSlides(moduleId: string, moduleTitle: string): Slide[] {
  const questions = PRESENTATION_QUIZZES[moduleId] ?? [];
  return questions.map((q, i) => ({
    type: "quiz" as const,
    title: `Knowledge Check ${i + 1} of ${questions.length}`,
    subtitle: `Session Quiz · ${moduleTitle}`,
    quizQuestion: q.question,
    quizOptions: q.options,
    quizCorrect: q.correct,
    quizExplanation: q.explanation,
    speakerNote:
      `Pause for the knowledge check. Do not read out the correct answer — wait for learners to respond. ` +
      `After the reveal, ask: "Can someone explain WHY the other options are incorrect?" This deepens understanding beyond rote recall.`,
  }));
}

/* ─────────────────────────────────────────────────────────────────────────────
   Per-module facilitator speaker notes
   These are the talking-point scripts displayed on the mobile remote.
───────────────────────────────────────────────────────────────────────────── */
interface ModuleSpeakerNotes {
  title: string;
  objectives: string;
  activityIndividual: string;
  activityGroup: string;
  summary: string;
}

const MODULE_SPEAKER_NOTES: Record<string, ModuleSpeakerNotes> = {
  /* ── Block 1 ── */
  "14924": {
    title:
      "Welcome to Information Systems Analysis — the analytical backbone of everything we build.\n\n" +
      "Before anything else: make sure the attendance register is signed and workbooks are distributed.\n\n" +
      "Opening hook → Ask the group: \"Has anyone here been affected by an IT system that went down or gave wrong results? What was disrupted?\" Take 2–3 answers. Use those examples throughout the day to anchor the theory.",
    objectives:
      "Walk through each outcome clearly — these are what learners will be assessed on in the Block assessment.\n\n" +
      "• Outcome 1 (SDLC roles): Ask — 'What does an analyst actually do on a team?' Most learners have never met one — build the picture.\n" +
      "• Outcome 3 (information gathering): Ask — 'If you needed to understand a business problem you'd never seen before, what's the first thing you'd do?'\n" +
      "• Outcome 4 (DFDs): Warn learners this is the hardest topic today — we'll spend extra time on it.\n\n" +
      "Gauge the room's baseline: 'Who has heard of a Data Flow Diagram before?' Adjust pacing accordingly.",
    activityIndividual:
      "Allow 5–10 minutes per activity. Circulate the room — do NOT give answers, ask leading questions instead.\n\n" +
      "• Activity 1 (Systems vs Requirements Analysis): Common trap — learners say they're the same. Prompt: 'Systems Analysis asks WHAT, Requirements Analysis asks HOW SPECIFICALLY.'\n" +
      "• Activity 3 (information gathering): Ask learners which technique they would use if the client is 3 hours away — this surfaces the practical trade-offs.\n" +
      "• Activity 4 (DFDs): Draw a live example on the whiteboard before learners attempt this. Start with: External Entity → arrow → Process → arrow → Data Store. Use the CET attendance system as your DFD subject.",
    activityGroup:
      "Stakeholder mapping group task — allow 20 minutes.\n\n" +
      "Each group maps stakeholders for the CET lab booking system. Roles: Scribe, Presenter, Timekeeper, Devil's Advocate.\n\n" +
      "What to look for: Do they identify both internal (admin, lecturers, IT) and external (learners, parents) stakeholders? Do they show communication lines?\n\n" +
      "Debrief: One group presents, others challenge. Ask: 'Who did they miss? Why does that matter?'",
    summary:
      "Verbal recall round — call on 3 learners by name:\n" +
      "1. 'Name two phases of the SDLC and what happens in each.'\n" +
      "2. 'What is one information-gathering technique and when would you use it?'\n" +
      "3. 'What does a DFD show that a flowchart doesn't?'\n\n" +
      "Remind learners:\n" +
      "• Workbook activities must be completed before Block assessment\n" +
      "• Next session: Participate in Groups/Teams (Day 2)\n" +
      "• Ensure attendance sign-out is done.",
  },

  "14920": {
    title:
      "Welcome to Participate in Groups/Teams — the human side of IT.\n\n" +
      "Before we start: attendance register, then ask — 'Raise your hand if you've ever worked in a team that wasn't functioning well.' Nearly every hand goes up.\n\n" +
      "Follow-up: 'Without naming anyone, what was the root cause of the problem?' Common answers: unclear roles, one person doing everything, conflict. Write these on the board — we'll revisit them at the end to see how today's content addresses them.",
    objectives:
      "Walk through all 4 outcomes. Key point to emphasise:\n\n" +
      "• This is a PRACTICAL unit — the Team Charter group task carries significant PoE marks. Take it seriously.\n" +
      "• Outcome 3 (NGT) is for teams that need structured idea generation without loud personalities dominating — very common in IT meetings.\n\n" +
      "Ask: 'Which of these outcomes is most relevant to your current work situation?' This personalises the learning.",
    activityIndividual:
      "Allow 8–10 minutes per activity.\n\n" +
      "• Activity 3 (NGT suitability): Give a realistic scenario — e.g., 'Your team needs to prioritise 10 bug fixes but two senior developers keep dominating the discussion.' Ask: would NGT help? Walk through the 5 NGT steps before they answer.\n" +
      "• Activity 5 (qualities of effective team member): Don't just list qualities — ask learners to rate themselves on each quality from 1–5. They don't share, but it builds self-awareness.\n" +
      "• Activity 6 (strategies for collaboration): Push for specifics, not platitudes. 'Have regular meetings' → 'What TIME and FREQUENCY? What's the agenda format?'",
    activityGroup:
      "Team Charter task — allow 25 minutes, then structured presentations.\n\n" +
      "Groups of 4. Each charter must include:\n" +
      "1. Team purpose statement (one sentence)\n" +
      "2. Assigned roles: Coordinator, Communicator, Analyst, Quality Checker\n" +
      "3. Communication agreement: how and how often they'll update each other\n" +
      "4. One team norm: what behaviour will NOT be tolerated\n\n" +
      "Each group has 3 minutes to present. Class votes (thumbs) on which charter they'd most want to work under.\n\n" +
      "Remind: this connects directly to SAQA 120379 (Block 3 — Work as a Project Team Member).",
    summary:
      "Round-robin verbal activity — each learner states ONE quality of an effective team member without repeating what was already said.\n\n" +
      "Go back to the board: 'Look at the team problems you described at the start. How many does today's content give you a tool to address?'\n\n" +
      "Remind learners:\n" +
      "• Workbook must be completed before Block 1 assessment\n" +
      "• Team Charter is a PoE artefact — keep it safe\n" +
      "• Tomorrow: Describe Principles of Computer Programming (Day 3).",
  },

  "14918": {
    title:
      "Day 3 — Describe Principles of Computer Programming.\n\n" +
      "Attendance register, then gauge the room: 'Who has written any code before, even a spreadsheet formula, a macro, or HTML?' This tells you your starting baseline.\n\n" +
      "Set expectations clearly: 'Today is about DESCRIBING and DESIGNING programs — not running them. We will WRITE code in Block 2. Today we learn the grammar of the language before we speak it.'",
    objectives:
      "Walk through all 4 outcomes:\n\n" +
      "• Outcome 2 (data types): Mention that most coding bugs are caused by type mismatches — understanding types prevents the most common class of errors.\n" +
      "• Outcome 3 (algorithm structures): This is the heart of the day. Sequence → Selection → Iteration. Every program ever written uses only these three.\n" +
      "• Outcome 4 (validation vs verification): Ask — 'What's the difference between checking whether data is correct and checking whether a system was built correctly?' Most learners conflate them.\n\n" +
      "Confirm: workbooks open to the correct unit before proceeding.",
    activityIndividual:
      "Allow 8–10 minutes per activity. This is a concept-heavy unit — pacing matters.\n\n" +
      "• Activity 2 (write pseudocode): The biggest hurdle. Do a LIVE demo on the whiteboard first. Write pseudocode for 'Calculate a learner's average mark for 3 tests.' Use IF/ELSE and a loop so both control structures appear.\n" +
      "• Pair struggling learners with stronger ones for Activity 2 — not for the answer, but for coaching.\n" +
      "• Activity 4 (arithmetic and logical operators): Remind them % is modulo (remainder), not percent. Walk through one example of each operator class.\n" +
      "• Activity 7 (validation vs verification): Use medical analogy — validation checks the right medicine; verification checks the medicine was made correctly.",
    activityGroup:
      "There is no dedicated group task for this unit — channel group energy into peer desk-checking.\n\n" +
      "After Activity 2: pair learners to swap pseudocode and trace each other's logic step by step. Each pair flags at least ONE logical error in their partner's code.\n\n" +
      "Debrief: put one pair's pseudocode on the board. Workshop it together — what would it produce? Where does it break?",
    summary:
      "Challenge round — ask 3–4 learners:\n" +
      "1. 'Give me an example of a Boolean expression in plain English.'\n" +
      "2. 'What control structure would you use to check if a mark is above 50%?' (Selection / if-else)\n" +
      "3. 'What control structure would you use to print all numbers from 1 to 10?' (Iteration / loop)\n" +
      "4. 'What is the difference between validation and verification?'\n\n" +
      "Remind:\n" +
      "• Pseudocode work should be kept — feeds directly into Day 5 (Design) and Block 2 (Apply)\n" +
      "• Tomorrow: Apply Problem-Solving Strategies (Day 4).",
  },

  "14927": {
    title:
      "Day 4 — Apply Problem-Solving Strategies.\n\n" +
      "Attendance register, then opening question: 'Tell me about a genuine workplace problem you had to solve in the last month. What did you do first?'\n\n" +
      "Take 2–3 answers. Write the steps they describe on the board. We'll compare them to the structured models at the end of the day.\n\n" +
      "Key message: 'You already solve problems every day. This unit gives you tools to do it more systematically and to document it for your PoE.'",
    objectives:
      "Walk through all 3 outcomes:\n\n" +
      "• Outcome 1 (define and analyse problems): Stress the word ANALYSE — most people jump to solutions before they've fully understood the problem.\n" +
      "• Outcome 2 (evaluate solutions): The SFF matrix (Suitability, Feasibility, Fit) is the evaluation framework — introduce it early so learners can reference it during activities.\n" +
      "• Outcome 3 (implement and monitor): Ask — 'What's the difference between implementing a solution and monitoring it?' Monitoring is the part most teams skip.",
    activityIndividual:
      "Allow 10 minutes per activity — this is the most activity-heavy unit (6 individual tasks).\n\n" +
      "• Activity 1 (root causes): Push beyond surface answers. 'Equipment failure' → Why did the equipment fail? 'Staff didn't know' → Why didn't they know? Keep asking WHY.\n" +
      "• Activity 3 (fishbone diagram): Model one live on the board BEFORE learners attempt it. Use this subject: 'Learners consistently submit workbook activities late.' Bones: People, Process, Environment, Technology, Resources, Communication.\n" +
      "• Activity 4 (SFF matrix): Walk through each criterion with a concrete example. Suitability = does it solve the right problem? Feasibility = can we actually do it with what we have? Fit = does it match the organisation's culture and constraints?\n" +
      "• Activity 6 (implementation plan): Must include: task, owner, deadline, resources needed, success measure.",
    activityGroup:
      "Group Problem Analysis and Implementation Plan — allow 25 minutes.\n\n" +
      "Subject: a recurring CET lab issue (no power, booking conflicts, printer failures — let groups choose a real one they know).\n\n" +
      "Deliverable: one A4 fishbone diagram + one implementation plan with at least 5 tasks, owners, and a timeline.\n\n" +
      "Each group presents in 3 minutes. Class challenge: 'What's the highest-risk step in their implementation plan?'\n\n" +
      "Collect these as PoE evidence — photograph or scan them.",
    summary:
      "Connect back to the opening answers: 'Look at what you said at the start. Did you follow a structured process or an intuitive one? What would the structured approach have changed?'\n\n" +
      "Closing question: 'If you had to implement your group's solution first thing tomorrow, what is literally the first action you would take?'\n\n" +
      "Remind:\n" +
      "• Workbook activities + fishbone diagrams are PoE artefacts\n" +
      "• Tomorrow is Day 5 (Design a Computer Program) — the final day of Block 1\n" +
      "• Block 1 assessment date and OTP process reminder.",
  },

  "14915": {
    title:
      "Day 5 — Design a Computer Program to Specification. Final day of Block 1.\n\n" +
      "Before we start: 'What happens when developers start coding without a design?' Take 2–3 answers.\n\n" +
      "Expected answers: bugs discovered late, features missing, rework, missed deadlines. These are not hypothetical — the Standish CHAOS Report consistently shows that poor design is the #1 cause of IT project failure.\n\n" +
      "8 credits today — the highest-credit unit in Block 1. The Group Task (Program Design Document) is a substantial PoE deliverable.",
    objectives:
      "Walk through all 4 outcomes:\n\n" +
      "• Outcome 1 (structured design): Connect to yesterday's problem-solving. Design is structured thinking applied to software.\n" +
      "• Outcome 3 (documentation tools): Emphasise that pseudocode written today is one step from real code. The investment in good pseudocode shrinks the coding effort in Block 2.\n" +
      "• Outcome 4 (maintenance cycle): Ask — 'After you deploy software, are you done?' (Never.) Maintenance is the longest and most expensive phase of any system's life.\n\n" +
      "Confirm: VS Code is installed and accessible for syntax checker exercises later.",
    activityIndividual:
      "This unit has the most activities (9). Prioritise Activities 8–9 (desk-checking & compile vs desk-check) — these are Assessment favourites.\n\n" +
      "• Activity 2 (decision tree): Do a live example first. Business rule: 'If a learner's attendance is below 80% AND their assignment mark is below 50%, they are at risk.' Draw the tree live.\n" +
      "• Activity 5 (syntax checker): Demo in VS Code live. Introduce a deliberate bug in a code snippet. Show how the syntax checker catches it — but remind them: syntax checkers don't catch LOGIC errors.\n" +
      "• Activity 8 (desk-check): Pair learners. One writes a 10-line pseudocode snippet, the other manually traces it with sample inputs. The tracer writes down the state of all variables at each step.\n" +
      "• Activity 9 (desk-check vs compile): Key distinction — desk-checking = manual logic trace, compiling = automated syntax check. You need BOTH.",
    activityGroup:
      "Program Design Document for a CET Lab Booking Tool — allow 30 minutes. Largest group task of Block 1.\n\n" +
      "Deliverable must include:\n" +
      "1. Module breakdown (structure diagram) showing at least 4 modules\n" +
      "2. One decision table for a booking rule\n" +
      "3. Pseudocode for at least one module\n" +
      "4. Data dictionary: list at least 6 data items with type and description\n\n" +
      "Quality check before presentations: Does the design have enough detail to actually code from? If not, it's not a design — it's just a list of ideas.\n\n" +
      "Collect for PoE. Photograph the whiteboard/flip chart work.",
    summary:
      "Block 1 complete — CELEBRATE this milestone.\n\n" +
      "Go round the room (quick round-robin): 'What is ONE thing from Block 1 that you need to revisit or practice before Block 2?'\n\n" +
      "Write the answers on the board. This becomes your revision list and shows you where to spend extra support time.\n\n" +
      "Reminders:\n" +
      "• Block 1 assessment → OTP will be provided → submit via the portal\n" +
      "• Block 2 starts [Date — insert here]. Location: [confirm venue].\n" +
      "• Between now and Block 2: install Python and VS Code at home if possible\n" +
      "• Ensure all workbook activities from Days 1–5 are complete.",
  },

  /* ── Block 2 ── */
  "14910": {
    title:
      "Block 2, Day 1 — Apply Principles of Computer Programming. We move from designing to doing.\n\n" +
      "Welcome back! Ask: 'What revision did you do between Block 1 and Block 2?'\n\n" +
      "Then: 'Who feels nervous about coding today?' Normalise it — every developer was once a complete beginner. Learning to code is like learning a new language: you will feel lost at first, and then one day it clicks.\n\n" +
      "TECH CHECK FIRST (10 minutes): Ensure Python + VS Code is working on every machine before loading the first slide. Do not skip this — one broken environment can derail the day.",
    objectives:
      "Walk through all 3 outcomes. Key messages:\n\n" +
      "• Outcome 1 (write structured programs): We use Python as the primary language. JavaScript is the alternative. The concepts transfer to any language.\n" +
      "• Outcome 2 (control structures and functions): This is where pseudocode from Day 3 becomes real code. Use their own pseudocode from the workbook as the starting point.\n" +
      "• Outcome 3 (test and debug): Debugging is not optional. Every learner must be able to READ error messages. Run a deliberate error on screen — show how to read the traceback.\n\n" +
      "Pair programming works best for this unit: one learner writes, one navigates. Switch every 30 minutes.",
    activityIndividual:
      "Guided coding sessions — keep all learners at roughly the same point. Use the projector to live-code alongside learners.\n\n" +
      "• OOP section: Use the class diagram analogy — 'A class is a blueprint; an object is the building built from it.' Draw a simple class on the whiteboard: class Dog with attributes name, breed and method bark().\n" +
      "• File I/O: Ask — 'Where does data go when your program closes?' (Nowhere — unless you save it.) Writing to a file = persistence. Read from file = data loading.\n" +
      "• Error handling: Show the difference between a program that CRASHES with an unhandled exception and one that catches it and gives a meaningful user message. Learners should see both.\n\n" +
      "Key principle: if learners are stuck for more than 5 minutes, they should ask. Sitting stuck silently is the fastest way to fall behind.",
    activityGroup:
      "Mini-project development — assign projects at the start of Day 6.\n\n" +
      "Project options: simple student grade calculator, basic inventory tracker, or simple contact book. Each group picks one.\n\n" +
      "Day 6 goal: have a working prototype with input, processing, and output.\n" +
      "Day 7 goal: add file I/O and basic error handling.\n\n" +
      "Code review workshop (Day 7 afternoon): Each group shares their screen. Class identifies:\n" +
      "1. Something that works well\n" +
      "2. One potential bug or improvement\n\n" +
      "Celebrate working code — even small wins build confidence and momentum.",
    summary:
      "Live demo: ask one pair to project their code and walk the class through it.\n\n" +
      "Closing questions:\n" +
      "1. 'What was the hardest concept today?'\n" +
      "2. 'What is one debugging technique you'll use tomorrow?'\n\n" +
      "Reminders:\n" +
      "• Save all code — it will be used in Block 3 testing unit\n" +
      "• Mini-project must be complete by end of Day 7\n" +
      "• Next: Create Web Applications with Scripting (Days 8–9).",
  },

  "14933": {
    title:
      "Days 8–9 — Create Web Applications with Scripting.\n\n" +
      "Opening: 'Open your phone. Name the last app or website you used in the last 5 minutes.'\n\n" +
      "Take 4–5 answers out loud. Then: 'By the end of tomorrow, you'll understand the technology behind every one of those things — and you'll have built a small one yourself.'\n\n" +
      "Check: does everyone have a browser with DevTools accessible? In Chrome/Edge: F12 or right-click → Inspect. Do a 2-minute DevTools orientation before starting.",
    objectives:
      "Walk through all 3 outcomes:\n\n" +
      "• Outcome 1 (interactive web pages): HTML = structure, CSS = styling, JavaScript = behaviour. Draw this on the board as three layers: house frame, paint, plumbing.\n" +
      "• Outcome 2 (DOM manipulation): The DOM is the bridge between JavaScript and the HTML you see. Ask — 'Has anyone ever used inspect element to change something on a website?' Most learners have. That IS DOM manipulation.\n" +
      "• Outcome 3 (responsive design): Ask — 'What happens to a website designed only for desktop when you open it on a phone?' Use a real example. This is why responsive design exists.\n\n" +
      "IMPORTANT: The portfolio page they build is the PoE assessment artefact. They KEEP it. Ensure they save their work at the end of each session.",
    activityIndividual:
      "Build the portfolio page incrementally — add one section per activity slot.\n\n" +
      "• Start with provided starter HTML file. Ask learners to name the page with their own name immediately — ownership increases engagement.\n" +
      "• DOM manipulation demo: Open DevTools console. Type document.querySelector('h1').textContent = 'Hello World'; Learners see the change instantly. Magic moment. Then show it resets on refresh — that's why we link JavaScript files.\n" +
      "• Responsive design challenge: give learners a non-responsive layout and ask them to make it mobile-friendly using media queries. Test by resizing the browser window.\n" +
      "• Accessibility reminder: every image needs an alt attribute. Every form input needs a label. This is not optional — it's standard professional practice.\n\n" +
      "Learners who finish early: add a contact form with JavaScript validation to their portfolio page.",
    activityGroup:
      "Interactive form validation group challenge — allow 30 minutes.\n\n" +
      "Groups build a registration form with client-side validation:\n" +
      "• Name: required, min 3 characters\n" +
      "• Email: must contain @ and .\n" +
      "• Password: at least 8 characters\n" +
      "• Confirm password: must match\n\n" +
      "Display a clear error message per field. On success: show a confirmation message.\n\n" +
      "Presentations: each group demos their form. The class tries to break it by submitting invalid data.\n\n" +
      "Observe: is error messaging friendly and specific, or just 'Error'? Professional UX starts here.",
    summary:
      "Display 3–4 learner portfolio pages on the projector (with permission). Celebrate diversity of designs.\n\n" +
      "Close Block 2:\n" +
      "1. 'What is one thing you built this week that you didn't think you could?'\n" +
      "2. 'What technology question are you most curious about for Block 3?'\n\n" +
      "Reminders:\n" +
      "• Save all code from Block 2 — used in the Block 3 testing unit\n" +
      "• Block 2 assessment OTP → submit via portal\n" +
      "• Block 3 starts [Date — insert here].",
  },

  /* ── Block 3 ── */
  "14908": {
    title:
      "Block 3, Day 11 — Testing IT Systems Against Specifications.\n\n" +
      "Welcome back. Opening: 'How many of you have ever used software that crashed or gave a wrong result? What do you think caused it?'\n\n" +
      "Take 3–4 answers. Most errors trace to insufficient testing — not bad code. Today we learn to test properly.\n\n" +
      "Strong connection to Block 2 work: 'The programs you built in Block 2 will be your test subjects today.' If they brought their code, open it. If not, use the class starter file.",
    objectives:
      "Walk through all 3 outcomes:\n\n" +
      "• Outcome 1 (testing methodologies): Distinguish the four levels — use a 2×2 on the whiteboard: unit / integration / system / acceptance. Ask: 'Which level would catch a bug where two modules pass correct data to each other but produce a wrong final result?' (Integration test.)\n" +
      "• Outcome 2 (test case design): A test case is NOT just 'run the program and see what happens.' It has: ID, input description, expected output, actual output, pass/fail. Walk through the format explicitly.\n" +
      "• Outcome 3 (QA principles): Quality Assurance is not the same as testing. QA is the PROCESS; testing is one ACTIVITY within it.\n\n" +
      "Ask: 'Is it possible to test a program completely?' (No — you can't test every possible input. Discuss why.)",
    activityIndividual:
      "Test case writing workshop — give learners the starter code with 5 seeded bugs.\n\n" +
      "• Step 1: Write test cases BEFORE running any code. Force the discipline.\n" +
      "• Step 2: Run the tests. Mark each case pass or fail.\n" +
      "• Step 3: Log each bug with: bug ID, severity (low/medium/high/critical), affected module, steps to reproduce, expected vs actual behaviour.\n\n" +
      "Bug hunting game: keep a leaderboard on the whiteboard — who found the most bugs? This makes defect detection satisfying rather than intimidating.\n\n" +
      "QA checklist creation: groups build a QA checklist for a simple login system. Categories: functionality, security, usability, performance, accessibility.",
    activityGroup:
      "Cross-team code review (connects to software craftsmanship).\n\n" +
      "Each pair from Block 2 swaps their mini-project code with another pair.\n\n" +
      "The reviewing pair must:\n" +
      "1. Write at least 5 test cases covering key functions\n" +
      "2. Run the tests\n" +
      "3. Log any bugs found\n" +
      "4. Write a 1-paragraph test report: overall quality, number of bugs found, recommendation\n\n" +
      "Present findings back to the original authors. Ask the authors: 'Did your tester find bugs you didn't know about?'\n\n" +
      "This is the most realistic real-world exercise in the qualification — treat it seriously.",
    summary:
      "Testing trivia close (rapid-fire, hands up wins):\n" +
      "1. 'Which test type checks a single function in isolation?' (Unit test)\n" +
      "2. 'Which test involves the actual end-users trying the system?' (UAT / Acceptance test)\n" +
      "3. 'What does a test case need that just running the program doesn't give you?' (Expected output, documented result)\n\n" +
      "Reminders:\n" +
      "• Test reports are PoE artefacts — collect them now\n" +
      "• Tomorrow: Resolve Computer Users' Problems (Day 12)\n" +
      "• Day 13 is the final day — capstone project; come prepared.",
  },

  "14919": {
    title:
      "Day 12 — Resolve Computer Users' Problems.\n\n" +
      "Opening: 'When a user phones IT and says: \"The computer is broken\" — what is the actual problem?'\n\n" +
      "Take 3–4 answers. The answer is almost never the computer itself — it's usually: can't access a specific file, software won't open, printer not responding, forgotten password.\n\n" +
      "Key message: 'IT support is 80% communication and 20% technical. The most important skill today is asking the right question.'",
    objectives:
      "Walk through all 3 outcomes:\n\n" +
      "• Outcome 1 (diagnose and resolve): Frame the troubleshooting framework early — Ask → Reproduce → Isolate → Fix → Verify → Document. Write this on the board. It stays there all day.\n" +
      "• Outcome 2 (troubleshooting methodologies): Distinguish Top-Down (start from the application layer) vs Bottom-Up (start from hardware/network). Experienced technicians develop intuition about which to use when.\n" +
      "• Outcome 3 (communicate solutions): Ask — 'How do you explain a technical fix to someone who has never used a computer before?' This is a real skill. It requires translating — not talking down.",
    activityIndividual:
      "Troubleshooting simulations — pre-prepare 5 scenario cards (or use the workbook scenarios).\n\n" +
      "Scenarios to include:\n" +
      "• 'I can't send emails' — network connectivity vs email client vs account issue?\n" +
      "• 'The program is running slowly' — RAM/CPU vs storage vs background processes?\n" +
      "• 'My document disappeared' — save vs sync vs deleted?\n" +
      "• 'I can see the Wi-Fi but can't connect' — password vs DNS vs firewall?\n\n" +
      "Learners must write the troubleshooting steps they'd follow and the questions they'd ask the user. Do NOT let them jump to a solution without documenting their process.\n\n" +
      "Documentation activity: after resolving each scenario, write a resolution note — this is what goes in the helpdesk ticket.",
    activityGroup:
      "Role-play user support exercise — the most important activity of this unit.\n\n" +
      "Setup: Facilitator (or a volunteer learner) plays the user. 'Support agent' learner faces AWAY from the projector — must gather info only through questions.\n\n" +
      "Rules:\n" +
      "• No guessing. Every action must be based on information the user confirmed.\n" +
      "• Class evaluates: did they ask clarifying questions? Did they communicate clearly? Did they document?\n\n" +
      "Run at least 3 rounds with different 'agents'. Rotate.\n\n" +
      "Debrief: 'What's the most common mistake we saw?' (Assuming they know the problem. Always listen first.)",
    summary:
      "Walk back through the framework on the board: Ask → Reproduce → Isolate → Fix → Verify → Document.\n\n" +
      "Ask the group: 'Which of these 6 steps do most IT people skip?' (Verify and Document — and that's why the same problem recurs.)\n\n" +
      "Closing question: 'What is one thing about user communication that you will do differently starting tomorrow?'\n\n" +
      "Reminders:\n" +
      "• Role-play documentation is a PoE artefact\n" +
      "• Tomorrow is Day 13 — final day, capstone project, CELEBRATION\n" +
      "• Ensure EVERYTHING in the workbook is complete before the Block 3 assessment.",
  },

  "120379": {
    title:
      "Final unit — Work as a Project Team Member. Day 13.\n\n" +
      "Welcome to the last delivery day of this qualification (well done — 14 days in!). This is also the most integrative unit: everything from the previous 9 units feeds into this one.\n\n" +
      "Opening: 'Think about this 15-day programme as a project. What has been well-managed? What would you have done differently as the project manager?'\n\n" +
      "Take 3–4 answers. This exercise simultaneously reviews content from the whole qualification AND introduces the project lifecycle. Strong entry point.",
    objectives:
      "Walk through all 3 outcomes:\n\n" +
      "• Outcome 1 (participate effectively): Participating effectively means contributing to DELIVERABLES, not just attending meetings. Ask: 'What is the difference between being PRESENT in a project team and being ENGAGED?'\n" +
      "• Outcome 2 (project management fundamentals): PMBOK 5 process groups — Initiating, Planning, Executing, Monitoring/Controlling, Closing. Ask: 'Which phase do most IT projects underinvest in?' (Planning — they rush to start coding.)\n" +
      "• Outcome 3 (deliver outputs within constraints): The triple constraint — Scope, Time, Cost. If any one increases, at least one of the others must flex. The client wants all three: fast, cheap, complete. They get to pick two.\n\n" +
      "8 credits — significant weight. The capstone project kickoff IS the assessment deliverable.",
    activityIndividual:
      "Pre-capstone work:\n\n" +
      "• Each learner individually identifies their role in their capstone project team using the RACI matrix (Responsible, Accountable, Consulted, Informed).\n" +
      "• Each learner writes their 2 strongest contributions and 1 area they'll need team support on.\n\n" +
      "Stakeholder communication exercise:\n" +
      "• Given a project progress update, learners write TWO versions: one for the technical team, one for a non-technical client.\n" +
      "• Compare the two in class — what changed? What must stay consistent? (The facts. What changes is the language and level of detail.)",
    activityGroup:
      "Sprint planning exercise (40 minutes).\n\n" +
      "Groups receive a fictional product backlog for an 'IT Learning Management System'.\n\n" +
      "Task: Prioritise the backlog and plan a 1-week sprint:\n" +
      "1. Assign 5–7 user stories to the sprint\n" +
      "2. Estimate each story in hours or story points\n" +
      "3. Assign stories to team members by skill match\n" +
      "4. Identify the biggest risk in the sprint\n" +
      "5. Present a simple sprint board (To Do / In Progress / Done)\n\n" +
      "Each group presents their sprint plan (3 minutes). Class question: 'What would you cut first if you were 2 days behind midway through the sprint?'\n\n" +
      "Connect: this is how real development teams at CET, government and private sector work — daily standups, sprint reviews, retrospectives.",
    summary:
      "Programme complete — CELEBRATE!\n\n" +
      "Full-circle moment: 'On Day 1 I asked you about an IT system that failed. Now you know where failures come from — and what to do about them.'\n\n" +
      "Round-robin close — every person in the room states:\n" +
      "1. ONE thing they will do differently at work because of this qualification\n" +
      "2. ONE unit standard they'd like to explore further\n\n" +
      "Final reminders:\n" +
      "• Block 3 assessment OTP → submit via portal\n" +
      "• All workbook activities must be complete for the full PoE\n" +
      "• PoE submission deadline: confirm with your institution\n" +
      "• Any questions about certification or RPL — email Kabelo: matlakalakabelo1@gmail.com",
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Flow-based (session-structured) slide builders
───────────────────────────────────────────────────────────────────────────── */

/** Converts one LessonSection into 1+ content slides, chunking bullets to ≤5 */
function sectionToSlides(
  section: LessonSection,
  sessionLabel: string,
  sessionShortTitle: string,
  moduleId?: string
): Slide[] {
  const bullets: string[] = [];
  let body = "";
  let highlight = "";
  const speakerExtras: string[] = [];

  for (const block of section.blocks) {
    switch (block.type) {
      case "paragraph":
        if (!body) body = block.text;
        break;
      case "list":
      case "ordered-list":
        bullets.push(...block.items);
        break;
      case "callout":
        if (!highlight) highlight = block.text;
        break;
      case "table": {
        const rows = block.rows.slice(0, 5).map((row) =>
          block.headers.length === 2
            ? `${row[0] ?? ""}: ${row[1] ?? ""}`
            : row.join(" · ")
        );
        bullets.push(...rows);
        break;
      }
      case "heading":
      case "subheading":
        speakerExtras.push(block.text);
        break;
      case "code":
        speakerExtras.push(`Code example: ${block.text.split("\n")[0]}`);
        break;
    }
  }

  /* Build a contextual discussion prompt from the section title */
  const topicDiscussionPrompts: Record<string, string> = {
    "sdlc": "Ask: 'Which SDLC phase do you think is most commonly skipped by developers under pressure?' (Implementation / Testing.) Discuss the consequences.",
    "analysis": "Ask: 'If you had to analyse a system you've never seen before, what is the first question you would ask?' Take 3 answers before presenting the content.",
    "requirements": "Ask: 'What is the difference between what a user ASKS for and what they actually NEED?' Use a relatable example — an email system that sends perfectly but notifies the wrong person.",
    "data flow": "Draw the DFD notation key on the whiteboard before explaining. Learners often confuse the symbols. Reference: circle=process, arrow=data flow, parallel lines=data store, rectangle=external entity.",
    "team": "Ask: 'In your experience, what is the single biggest reason teams fail?' Collect answers and map them to the content points.",
    "problem": "Emphasise: defining the problem correctly is more valuable than having the answer quickly. A well-defined problem is 50% solved.",
    "pseudocode": "Write a simple pseudocode example live on the board before learners attempt any activity. Use real numbers. Trace through it step by step.",
    "algorithm": "Use physical analogy — a recipe IS an algorithm. It has inputs (ingredients), sequence (steps), decisions (if crispy, add more time), and loops (stir every 2 minutes).",
    "data type": "Ask: 'What goes wrong if you store a phone number as an integer?' (You lose the leading zero. That is a real data type bug with real consequences.)",
    "validation": "Key distinction: Validation checks the DATA is correct. Verification checks the SYSTEM was built correctly. You need both — separately.",
    "design": "Ask learners to critique a real design artefact (pseudocode or flowchart on the board). What is clear? What is ambiguous? Good design leaves no room for interpretation.",
    "testing": "Ask: 'Can you test a program completely?' (No.) Then: 'So how do you know when testing is enough?' (When risk is acceptably low and all requirements are verified.)",
    "function": "Ask: 'What is the benefit of breaking code into functions instead of writing one long block?' (Reusability, readability, easier testing, easier maintenance.)",
    "project": "Connect to something they know: 'The organisation and planning we did for this 15-day programme — that IS project management. What would have gone wrong without it?'",
    "web": "Open DevTools live in the browser (F12). Show the HTML structure of a real page. Learners immediately see the connection between code and the screen.",
    "loop": "Ask: 'Without a loop, how would you write code to add up 100 numbers?' (100 lines.) 'With a loop? 3 lines.' That is why loops exist.",
  };

  /* Match section title keywords to a contextual prompt (case-insensitive) */
  const titleLower = section.title.toLowerCase();
  const matchedPrompt = Object.entries(topicDiscussionPrompts).find(([key]) =>
    titleLower.includes(key)
  )?.[1];

  const moduleName = moduleId ? `(Module ${moduleId}) ` : "";
  const subTopicNote = speakerExtras.length > 0 ? `Sub-topics covered: ${speakerExtras.join(" | ")}.\n\n` : "";
  const baseNote =
    `${subTopicNote}TOPIC: ${section.title}. ${moduleName}` +
    "Use the Learner Guide to expand on each bullet. Ask learners to annotate their workbooks as you present.\n\n" +
    (matchedPrompt ?? `Ask: 'Can someone give a real-world example of "${section.title}" from their own workplace or study?'`);

  if (bullets.length === 0) {
    return [{
      type: "content",
      title: section.title,
      subtitle: `${sessionLabel} · ${sessionShortTitle}`,
      body: body || undefined,
      highlight: highlight || undefined,
      sessionLabel,
      speakerNote: baseNote,
    }];
  }

  const CHUNK = 5;
  const result: Slide[] = [];
  for (let i = 0; i < bullets.length; i += CHUNK) {
    const chunk = bullets.slice(i, i + CHUNK);
    const isFirst = i === 0;
    result.push({
      type: "content",
      title: isFirst ? section.title : `${section.title} (cont.)`,
      subtitle: `${sessionLabel} · ${sessionShortTitle}`,
      bullets: chunk,
      body: isFirst ? body || undefined : undefined,
      highlight: isFirst ? highlight || undefined : undefined,
      sessionLabel,
      speakerNote: isFirst ? baseNote : `Continued. ${baseNote}`,
    });
  }
  return result;
}

/** Build session-structured slides from a ModuleLessonFlow */
export function buildFlowSlides(flow: ModuleLessonFlow, mod?: Module): Slide[] {
  const slides: Slide[] = [];
  const mn = MODULE_SPEAKER_NOTES[flow.moduleId];

  /* 1 — Title */
  if (mod) {
    slides.push({
      type: "title",
      title: mod.title,
      subtitle: `SAQA ${mod.id}  ·  Block ${mod.block}  ·  ${mod.days}  ·  ${mod.credits} Credits`,
      body: mod.type,
      speakerNote:
        mn?.title ??
        `Welcome to ${mod.title} (SAQA ${mod.id}). Remind learners to sign the attendance register and ensure workbooks are distributed before we begin.`,
      badge: mod.type,
    });
  }

  /* 2 — Unit purpose & outcomes */
  slides.push({
    type: "objectives",
    title: "Unit Purpose & Learning Outcomes",
    subtitle: flow.introTitle,
    body: flow.unitPurpose,
    bullets: mod?.objectives ?? [],
    speakerNote:
      mn?.objectives ??
      `Walk through the unit purpose and each learning outcome clearly. Ask: "Which of these topics do you already know something about?" This activates prior knowledge and shows where to pace more carefully.`,
  });

  /* 3 — Sessions */
  const sessions = flow.lessons.filter((l) => /^session-\d/.test(l.id));

  for (const session of sessions) {
    /* Session header slide */
    slides.push({
      type: "objectives",
      title: session.label,
      subtitle: session.title,
      bullets: session.outcomes ?? [],
      body: session.summary,
      isSessionStart: true,
      sessionLabel: session.label,
      speakerNote:
        `📍 ${session.label}: ${session.title}\n\n` +
        (session.summary ? `${session.summary}\n\n` : "") +
        "Walk through the session outcomes before diving into content. " +
        `Ask: "What do you already know about ${session.title}?"`,
    });

    /* Sections → content slides */
    for (const section of session.sections ?? []) {
      slides.push(...sectionToSlides(section, session.label, session.label, flow.moduleId));
    }
  }

  /* 4 — Quiz check-in */
  slides.push(...getQuizSlides(flow.moduleId, flow.introTitle));

  /* 5 — Summary */
  const allOutcomes = sessions.flatMap((s) => s.outcomes ?? []).slice(0, 6);
  slides.push({
    type: "summary",
    title: "Session Wrap-Up",
    subtitle: "Key takeaways from today",
    bullets: allOutcomes.map((o) => `✓  ${o}`),
    highlight: "Before leaving: make sure you can address each outcome above. Flag anything unclear with the facilitator.",
    speakerNote:
      mn?.summary ??
      "Quick verbal check — call on learners to summarise one concept each.\n" +
      "• Remind learners of their assessment task and workbook activities\n" +
      "• Ensure attendance sign-out is completed.",
  });

  return slides;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Programme briefing slides
───────────────────────────────────────────────────────────────────────────── */
export function buildBriefingSlides(): Slide[] {
  return [
    {
      type: "title",
      title: "Welcome to Information Technology:\nSystems Development",
      subtitle: "FETC · SAQA 78965 · NQF Level 4 · 165 Credits · 15 Days · 3 Blocks",
      body: "Programme Briefing",
      speakerNote:
        "Welcome everyone to this programme. Before we open any unit standard content, we'll spend a few minutes orienting ourselves — what this qualification is, what you'll be able to do by the end, and why it matters. Ensure attendance registers are signed and PoE folders are distributed.",
    },
    {
      type: "content",
      title: "Meet Your Facilitator",
      subtitle: "Who you'll be learning with",
      bullets: [
        "Kabelo Matlakala — Scrum Master & Systems Development Facilitator, Data Science Academy",
        "BSc Mathematical Sciences, University of Limpopo",
        "Software Developer background — mLab CodeTribe Academy (2024–2025)",
        "Based in Limpopo Province, South Africa",
        "Email: matlakalakabelo1@gmail.com  ·  Mobile: +27 72 713 8367",
      ],
      highlight:
        "Kabelo will deliver all 3 blocks of this qualification. Reach out directly for support between sessions.",
      speakerNote:
        "Briefly introduce yourself. Mention your background in both software development and systems analysis. This builds credibility — learners need to see that systems development knowledge is grounded in real professional practice.",
    },
    {
      type: "content",
      title: "What is Information Technology?",
      subtitle: "The invisible infrastructure every organisation depends on",
      bullets: [
        "IT is the combination of hardware and software products and services organisations use to manage, access, communicate, and share information",
        "IT is not just computers — it underpins every business function: student records, payroll, logistics, customer service",
        "Force 1 — Changes in the world: globalisation, remote work, digital transformation, real-time information demand",
        "Force 2 — Changes in technology: cloud computing, AI, mobile platforms, exponential data growth (Moore's Law)",
        "Force 3 — Changes in client demand: systems must be faster, more intuitive, more accessible, and more secure than ever before",
      ],
      highlight:
        "As systems developers, learners will design, build and maintain the IT infrastructure organisations depend on. Understanding what IT is — and why it must be planned — is the foundation of every unit in this qualification.",
      speakerNote:
        "Ask: 'Name one IT system your organisation runs on that would cause serious disruption if it went down.' Use the answer to anchor the three forces. Stress that IT planning is not a technical problem — it is a business problem.",
    },
    {
      type: "content",
      title: "What is a System?",
      subtitle: "The foundation of everything we build",
      bullets: [
        "A system is an organised set of interrelated components working together toward a defined goal",
        "An information system collects, processes, stores and distributes data to support operations and decisions",
        "Student registration portal — captures enrolment data, checks eligibility, generates student numbers and timetables",
        "Attendance tracking tool — records sign-ins, flags patterns, produces DoE compliance reports",
        "Results management system — stores marks, calculates averages, generates transcripts and certificates",
        "Every information system follows one structural pattern: Input → Process → Storage → Output",
      ],
      highlight:
        "Think of one IT system you interact with at your college every day. What does it take in? What does it produce? What happens to the data in between?",
      speakerNote:
        "Ask learners: 'Name one IT system you use at CET. What problem does it solve?' Collect 3–4 answers. Use their examples throughout the session — it grounds the theory in something they already know.",
    },
    {
      type: "content",
      title: "What is Systems Development?",
      subtitle: "6 phases — coding is only phase 4",
      bullets: [
        "Investigation — Identify the business problem; establish whether a system project is justified before spending money",
        "Analysis — Establish exactly WHAT the system must do: requirements, data flows, user needs, constraints",
        "Design — Specify HOW it will work: architecture, data structures, module structure, user interfaces",
        "Development — Write and unit-test the code based on the approved design documents",
        "Implementation — Deploy, convert existing data, train users, manage the transition to live",
        "Maintenance — Monitor for defects, apply fixes and enhancements, plan future iterations",
      ],
      highlight:
        "Coding (phase 4) only appears more than halfway through. The analysis and design work before it determines whether what gets built is actually useful. A technically perfect system that solves the wrong problem is still a failure.",
      speakerNote:
        "Emphasise: most expensive IT failures happen in phases 1–2. The CHAOS Report consistently finds fewer than 30% of IT projects complete on time, on budget, to spec — the leading root cause is inadequate analysis, not bad code.",
    },
    {
      type: "content",
      title: "Systems Development vs Software Development",
      subtitle: "Different scopes — deeply connected",
      bullets: [
        "Software Development — the coding subset: design, write, test, deploy software artefacts",
        "Systems Development — end-to-end: people, process, data, technology AND code",
        "Software development is a SUBSET that sits inside systems development",
        "The analyst determines WHAT to build and WHY · The developer determines HOW to build it",
        "In this qualification: you will think like an analyst AND write like a developer — both skills are required",
      ],
      highlight:
        "SAQA 78965 is the recognised SA pathway to analyst, developer, business analyst support and project coordination roles across SA government and industry.",
      speakerNote:
        "Clear up this misconception early. Some learners arrive expecting a pure coding course. Frame the expectation: approximately 40% is analysis and design thinking; 60% is implementation. Both halves make you a complete professional.",
    },
    {
      type: "content",
      title: "Why Does This Qualification Matter?",
      subtitle: "Four reasons anchored in South African IT",
      bullets: [
        "Organisations run on systems — every business function depends on reliable information systems",
        "Poor analysis = expensive failures — most IT project failures trace to misunderstood requirements (Standish CHAOS Report)",
        "NQF Level 4 opens careers — analyst, developer, BA support and project coordination roles are in high demand across SA",
        "Professional practice modelling — structured thinking (analyse → design → build) is the standard the workplace expects",
      ],
      highlight:
        "As CET lecturers, you model the standard your learners will carry into the field. Demonstrating structured systems thinking sets the bar for the next generation of SA IT professionals.",
      speakerNote:
        "This is the motivational slide. Pause and ask: 'Who here has experienced an IT system that didn't do what was expected?' Then: 'That is the problem this qualification trains you to prevent.'",
    },
    {
      type: "content",
      title: "Your 10-Module Roadmap",
      subtitle: "15 days · 3 blocks · 56 credits delivered",
      bullets: [
        "Block 1 · Days 1–5 · Foundations (23 credits): Systems Analysis, Team Collaboration, Programming Principles, Problem Solving, Design",
        "Block 2 · Days 6–9 · Applied Programming (14 credits): Apply Programming Principles, Web Scripting",
        "Block 3 · Days 11–13 · Systems in Practice (19 credits): Testing IT Systems, Resolve User Problems, Work as Project Team Member",
        "Each unit ends with a formative quiz (self-check) and an assessment task for your Portfolio of Evidence",
      ],
      highlight:
        "56 credits are delivered across these 15 days. The remaining credits toward the full 165-credit qualification are achieved through workplace evidence in your PoE.",
      speakerNote:
        "Distribute the printed module roadmap now if available. Run through the colour-coded block overview briefly — this helps learners see the sequencing logic.",
    },
    {
      type: "summary",
      title: "Ready to Begin",
      subtitle: "Orientation complete — Unit 1 awaits",
      bullets: [
        "✓  You understand what Information Technology is and the three forces shaping it",
        "✓  You understand what an information system is and how it works",
        "✓  You can describe the 6 phases of the Systems Development Life Cycle",
        "✓  You can distinguish systems development from software development",
        "✓  You know your 10-module roadmap across 3 blocks",
        "✓  You know how to reach your facilitator for support",
      ],
      highlight:
        "Any questions before we open Unit 1: Information Systems Analysis (ITSD-14924, Block 1 · Day 1)?",
      speakerNote:
        "Pause for genuine Q&A — 5 minutes now pays dividends throughout the programme. Then navigate to Unit 1 in the LMS and begin the session.",
    },
  ];
}

/* ─────────────────────────────────────────────────────────────────────────────
   Module slide builder
───────────────────────────────────────────────────────────────────────────── */

export function buildSlides(mod: Module): Slide[] {
  const slides: Slide[] = [];
  const mn = MODULE_SPEAKER_NOTES[mod.id];

  /* 1 ── Title slide */
  slides.push({
    type: "title",
    title: mod.title,
    subtitle: `SAQA ${mod.id}  ·  Block ${mod.block}  ·  ${mod.days}  ·  ${mod.credits} Credits`,
    body: mod.type,
    speakerNote:
      mn?.title ??
      `Welcome learners to ${mod.title}. ` +
      `Today covers SAQA unit standard ${mod.id}. ` +
      `Remind learners to sign the attendance register before the session starts. ` +
      `Distribute the learner workbook and ensure all resources are accessible.`,
    badge: mod.type,
  });

  /* 2 ── Learning objectives */
  slides.push({
    type: "objectives",
    title: "What You Will Be Able To Do",
    subtitle: "Learning Outcomes",
    bullets: mod.objectives,
    highlight:
      "These outcomes align with the unit standard's specific outcomes. Learners will be assessed against these at the end of the block.",
    speakerNote:
      mn?.objectives ??
      `Walk through each objective clearly. Ask learners: "Which of these do you already know something about?" ` +
      `This activates prior knowledge and gives you a sense of the group's baseline.`,
  });

  /* 3 ── Content slides — group into chunks of 3 items */
  const chunkSize = 3;
  for (let i = 0; i < mod.content.length; i += chunkSize) {
    const chunk = mod.content.slice(i, i + chunkSize);
    const isFirst = i === 0;
    slides.push({
      type: "content",
      title: isFirst ? "Core Concepts" : "Core Concepts (continued)",
      subtitle: `Topic ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(mod.content.length / chunkSize)}`,
      bullets: chunk,
      speakerNote:
        `Use the learner guide to expand on each point. ` +
        `Encourage learners to annotate their workbooks as you present. ` +
        chunk
          .map((item) => {
            const key = item.split(":")[0].trim();
            return `For "${key}": draw a real-world example on the board before moving on.`;
          })
          .join(" "),
    });
  }

  /* 4 ── Activities */
  if (mod.activities.length > 0) {
    const individual = mod.activities.filter((a) => !a.toLowerCase().includes("group"));
    const group = mod.activities.filter((a) => a.toLowerCase().includes("group"));

    if (individual.length > 0) {
      slides.push({
        type: "activity",
        title: "Individual Activities",
        subtitle: "Work through these in your learner workbook",
        bullets: individual,
        highlight:
          "Allow 5–10 minutes per activity. Circulate the room. Do not give answers — ask leading questions.",
        speakerNote:
          mn?.activityIndividual ??
          `Set a timer for each activity. ` +
          `While learners work, check understanding by asking: "Can you explain your reasoning?" ` +
          `Debrief each activity before moving to the next — do not rush.`,
      });
    }

    if (group.length > 0) {
      slides.push({
        type: "activity",
        title: "Group Activity",
        subtitle: "Collaborative task — assign roles before starting",
        bullets: group,
        highlight:
          "Suggested roles: Scribe, Presenter, Timekeeper, Devil's Advocate. Groups should be 3–4 learners.",
        speakerNote:
          mn?.activityGroup ??
          `Ensure group diversity — mix strong and developing learners. ` +
          `Group outputs should be presented to the class. ` +
          `Award marks or verbal recognition for strong group contributions.`,
      });
    }
  }

  /* 5 ── Resources */
  slides.push({
    type: "content",
    title: "Resources for This Session",
    subtitle: "Documents & tools you need",
    bullets: mod.resources,
    speakerNote:
      `Confirm all resources are available before the session runs. ` +
      `Physical copies should be distributed. Digital copies are in the portal under this module. ` +
      `The bilingual glossary is especially important for learners whose first language is Sepedi or Tshivenda.`,
  });

  /* 6 ── Session quiz slides */
  const quizSlides = getQuizSlides(mod.id, mod.title);
  slides.push(...quizSlides);

  /* 7 ── Summary */
  slides.push({
    type: "summary",
    title: "Session Wrap-Up",
    subtitle: "Key takeaways",
    bullets: mod.objectives.map((o) => `✓  ${o}`),
    highlight:
      "Before leaving: make sure you understand each learning outcome. If unsure, flag it with the facilitator.",
    speakerNote:
      mn?.summary ??
      `Run a quick verbal check: call on individual learners to summarise one concept each. ` +
      `Remind learners of:\n` +
      `• Any upcoming quiz or assessment\n` +
      `• Documents to complete in their workbook before next session\n` +
      `• Attendance — ensure sign-out is done.`,
  });

  return slides;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Slide type config
───────────────────────────────────────────────────────────────────────────── */
const SLIDE_CONFIG: Record<
  SlideType,
  { bg: string; accent: string; label: string; Icon: React.ElementType }
> = {
  title: {
    bg: "from-indigo-950 via-indigo-900 to-violet-900",
    accent: "text-violet-300 border-violet-500/40",
    label: "Introduction",
    Icon: Maximize2,
  },
  objectives: {
    bg: "from-sky-950 via-sky-900 to-cyan-900",
    accent: "text-cyan-300 border-cyan-500/40",
    label: "Objectives",
    Icon: Target,
  },
  content: {
    bg: "from-slate-950 via-slate-900 to-slate-800",
    accent: "text-emerald-300 border-emerald-600/40",
    label: "Content",
    Icon: BookOpen,
  },
  activity: {
    bg: "from-amber-950 via-orange-950 to-amber-900",
    accent: "text-amber-300 border-amber-500/40",
    label: "Activity",
    Icon: Zap,
  },
  summary: {
    bg: "from-green-950 via-emerald-950 to-teal-900",
    accent: "text-teal-300 border-teal-500/40",
    label: "Summary",
    Icon: CheckCircle2,
  },
  quiz: {
    bg: "from-purple-950 via-violet-950 to-indigo-900",
    accent: "text-purple-300 border-purple-500/40",
    label: "Quiz",
    Icon: HelpCircle,
  },
  "end-deck": {
    bg: "from-emerald-950 via-teal-950 to-cyan-900",
    accent: "text-emerald-300 border-emerald-500/40",
    label: "Complete",
    Icon: Trophy,
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
interface PresentationModeProps {
  module?: Module;
  /** Structured lesson flow — when provided, uses session-based slides instead of flat module slides */
  flow?: ModuleLessonFlow;
  mode?: "briefing" | "module";
  isAdmin?: boolean;
  onClose: () => void;
  nextUnitId?: string;
  nextUnitTitle?: string;
  /** Route prefix: /modules (admin) or /learner/modules (learner) */
  routePrefix?: string;
  /**
   * When the presentation is launched remotely from the facilitator's phone,
   * the phone pre-generates the session code and sends it via EV_LAUNCH so
   * both sides use the same channel without extra coordination.
   * If omitted, a random code is generated as usual.
   */
  initialSessionCode?: string;
}

export function PresentationMode({
  module: mod,
  flow,
  mode = "module",
  isAdmin = false,
  onClose,
  nextUnitId,
  nextUnitTitle,
  routePrefix = "/modules",
  initialSessionCode,
}: PresentationModeProps) {
  const navigate = useNavigate();
  const slides = useMemo(
    () =>
      mode === "briefing"
        ? buildBriefingSlides()
        : flow
        ? buildFlowSlides(flow, mod)
        : buildSlides(mod!),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, flow?.moduleId, mod?.id]
  );
  const [current, setCurrent] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [animating, setAnimating] = useState<"in" | "out" | null>(null);
  const [quizStates, setQuizStates] = useState<Record<number, QuizState>>({});
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [sessionPickerOpen, setSessionPickerOpen] = useState(false);

  /* ── Remote-control state */
  // If launched remotely the phone sends a pre-agreed code so both sides join the same channel
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sessionCode = useMemo(() => initialSessionCode ?? generateSessionCode(), []);
  const remoteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/present/remote/${sessionCode}`
      : `/present/remote/${sessionCode}`;
  const [remoteOpen, setRemoteOpen] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  /* Refs to escape stale-closure in the channel handler */
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastPingRef = useRef(0);
  const currentRef = useRef(current);
  const slidesRef = useRef(slides);
  // Initialised with typed no-ops; updated via useEffect once go/jumpTo are defined below
  const goRef = useRef<(dir: "next" | "prev") => void>(() => {});
  const jumpToRef = useRef<(i: number) => void>(() => {});

  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { slidesRef.current = slides; }, [slides]);
  // goRef and jumpToRef are synced after go/jumpTo are declared below

  const buildPayload = useCallback((): SlideStatePayload => {
    const ss = slidesRef.current;
    const i = currentRef.current;
    const s = ss[i];
    return {
      index: i,
      total: ss.length,
      type: s?.type ?? "content",
      title: s?.title ?? "",
      subtitle: s?.subtitle,
      badge: s?.badge,
      sessionLabel: s?.sessionLabel,
      speakerNote: s?.speakerNote,
      nextTitle: ss[i + 1]?.title,
      prevTitle: i > 0 ? ss[i - 1]?.title : undefined,
      isQuiz: s?.type === "quiz",
    };
  }, []);

  /* ── Supabase broadcast channel (set up once per session code) */
  useEffect(() => {
    const ch = supabase.channel(channelName(sessionCode), {
      config: { broadcast: { self: false } },
    } as Parameters<typeof supabase.channel>[1]);

    const sendState = () =>
      ch.send({ type: "broadcast", event: EV_SLIDE_STATE, payload: buildPayload() });

    ch
      .on("broadcast", { event: EV_REQUEST_SYNC }, () => {
        setRemoteConnected(true);
        lastPingRef.current = Date.now();
        sendState();
      })
      .on("broadcast", { event: EV_PING }, () => {
        setRemoteConnected(true);
        lastPingRef.current = Date.now();
        sendState();
      })
      .on("broadcast", { event: EV_CMD }, ({ payload }: { payload: RemoteCommand }) => {
        if (payload?.action === "next") goRef.current("next");
        else if (payload?.action === "prev") goRef.current("prev");
        else if (payload?.action === "goto") jumpToRef.current(payload.index);
      })
      .subscribe((subStatus) => {
        // Broadcast current state immediately so a waiting remote gets it
        // as soon as this desktop channel becomes active.
        if (subStatus === "SUBSCRIBED") sendState();
      });

    channelRef.current = ch;

    /* Mark remote as disconnected when ping stops */
    const staleTimer = setInterval(() => {
      if (lastPingRef.current > 0 && Date.now() - lastPingRef.current > 15_000) {
        setRemoteConnected(false);
      }
    }, 5_000);

    return () => {
      clearInterval(staleTimer);
      supabase.removeChannel(ch);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionCode]);

  /* ── Broadcast current slide whenever it changes */
  useEffect(() => {
    channelRef.current?.send({
      type: "broadcast",
      event: EV_SLIDE_STATE,
      payload: buildPayload(),
    });
  }, [current, buildPayload]);

  /** Ordered list of session entry-points derived from the slide array */
  const sessionMap = useMemo(() => {
    const result: Array<{ label: string; title: string; startIdx: number }> = [];
    slides.forEach((s, i) => {
      if (s.isSessionStart)
        result.push({ label: s.sessionLabel!, title: s.subtitle ?? "", startIdx: i });
    });
    return result;
  }, [slides]);

  const currentSessionLabel = slides[current]?.sessionLabel;

  const total = slides.length;
  const slide = slides[current];
  const config = SLIDE_CONFIG[slide.type] ?? SLIDE_CONFIG["content"];
  const isLastSlide = current === total - 1;

  /* ── Quiz helpers */
  const qState = quizStates[current] ?? { selected: null, revealed: false };
  const isQuizSlide = slide.type === "quiz";
  const quizAnswered = isQuizSlide && qState.revealed;
  const nextBlocked = isQuizSlide && !quizAnswered;

  const handleQuizSelect = (optionIndex: number) => {
    if (qState.revealed) return;
    setQuizStates((prev) => ({
      ...prev,
      [current]: { selected: optionIndex, revealed: true },
    }));
  };

  /* ── Navigation */
  const go = useCallback(
    (dir: "next" | "prev") => {
      if (dir === "next" && nextBlocked) return;
      const next = dir === "next" ? current + 1 : current - 1;
      if (next < 0 || next >= total) return;
      setDirection(dir);
      setAnimating("out");
      setTimeout(() => {
        setCurrent(next);
        setAnimating("in");
        setTimeout(() => setAnimating(null), 250);
      }, 180);
    },
    [current, total, nextBlocked]
  );

  const jumpTo = useCallback((i: number) => {
    if (i === current) return;
    setDirection(i > current ? "next" : "prev");
    setAnimating("out");
    setTimeout(() => {
      setCurrent(i);
      setAnimating("in");
      setTimeout(() => setAnimating(null), 250);
    }, 180);
  }, [current]);

  // Keep go/jumpTo refs fresh for the channel handler
  useEffect(() => { goRef.current = go; }, [go]);
  useEffect(() => { jumpToRef.current = jumpTo; }, [jumpTo]);

  const handleNavigateToUnit = () => {
    if (!nextUnitId) return;
    onClose();
    navigate(`${routePrefix}/${nextUnitId}`);
  };

  const nextLabel = nextUnitTitle
    ? `Begin: ${nextUnitTitle}`
    : mode === "briefing"
    ? "Open Unit 1"
    : "Next Unit";

  /* ── Keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go("next");
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go("prev");
      if (e.key === "Escape") {
        // Only dismiss sub-panels via Escape; exit requires the close buttons
        if (sessionPickerOpen) setSessionPickerOpen(false);
        if (notesOpen) setNotesOpen(false);
      }
      if (e.key.toLowerCase() === "n" && isAdmin) setNotesOpen((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, isAdmin, sessionPickerOpen, notesOpen]);

  /* ── Block browser back-button while presentation is open */
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handler = () => {
      // Re-push so back button never actually leaves the page
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  /* ── Scroll wheel (throttled) — up = next, down = prev */
  useEffect(() => {
    let lastAt = 0;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastAt < 450) return; // throttle rapid scrolls
      lastAt = now;
      if (e.deltaY < 0) go("next"); // scroll up → advance
      else go("prev");              // scroll down → go back
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [go]);

  /* ── Slide content animation class */
  const contentClass =
    animating === "out"
      ? direction === "next"
        ? "opacity-0 translate-x-6"
        : "opacity-0 -translate-x-6"
      : animating === "in"
      ? direction === "next"
        ? "opacity-0 -translate-x-4"
        : "opacity-0 translate-x-4"
      : "opacity-100 translate-x-0";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "black" }}>
      {/* ── Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur border-b border-white/10 z-10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Badge
            variant="outline"
            className={`text-xs font-semibold uppercase tracking-widest shrink-0 ${config.accent}`}
          >
            <config.Icon size={11} className="mr-1" />
            {config.label}
          </Badge>
          <span className="text-white/60 text-sm truncate">
            {mode === "briefing" ? "FETC: IT Systems Development — Programme Briefing" : mod?.title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white/40 text-sm tabular-nums">
            {current + 1} / {total}
          </span>

          {/* Session jump picker */}
          {sessionMap.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setSessionPickerOpen((v) => !v)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  sessionPickerOpen
                    ? "bg-white/15 border-white/30 text-white"
                    : "border-white/15 text-white/50 hover:text-white/80"
                }`}
              >
                <LayoutGrid size={12} />
                <span className="hidden sm:inline">{currentSessionLabel ?? "Sessions"}</span>
                <ChevronDown size={11} />
              </button>

              {sessionPickerOpen && (
                <div className="absolute top-full mt-1 right-0 w-72 bg-gray-950 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-white/10 text-xs font-semibold uppercase tracking-widest text-white/40">
                    Jump to Session
                  </div>
                  {sessionMap.map((s, idx) => {
                    const isActive = s.label === currentSessionLabel;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          jumpTo(s.startIdx);
                          setSessionPickerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/10 transition-colors ${
                          isActive ? "bg-white/10" : ""
                        }`}
                      >
                        <span
                          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive ? "bg-white/20 text-white" : "bg-white/8 text-white/40"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className={`font-medium text-sm truncate ${isActive ? "text-white" : "text-white/70"}`}>
                            {s.label}
                          </p>
                          <p className="text-xs text-white/35 truncate">{s.title}</p>
                        </div>
                        {isActive && <CheckCircle2 size={13} className="shrink-0 text-emerald-400 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Remote-control button */}
          <button
            onClick={() => setRemoteOpen((v) => !v)}
            title={`Remote control · Code: ${sessionCode}`}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
              remoteOpen
                ? "bg-white/15 border-white/30 text-white"
                : "border-white/15 text-white/50 hover:text-white/80"
            }`}
          >
            {remoteConnected ? (
              <Wifi size={13} className="text-emerald-400" />
            ) : (
              <Smartphone size={13} />
            )}
            <span className="hidden sm:inline">{remoteConnected ? "Remote Active" : "Remote"}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setNotesOpen((v) => !v)}
              title="Toggle speaker notes (N)"
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                notesOpen
                  ? "bg-white/15 border-white/30 text-white"
                  : "border-white/15 text-white/50 hover:text-white/80"
              }`}
            >
              <MessageSquare size={13} />
              Notes
            </button>
          )}
          <button
            onClick={onClose}
            title="Exit (Esc)"
            className="ml-1 text-white/50 hover:text-white transition-colors p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Remote control panel (modal overlay) */}
      {remoteOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setRemoteOpen(false)}
        >
          <div
            className="bg-gray-950 border border-white/20 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <QrCode size={16} className="text-white/50" />
                <span className="text-white/70 text-sm font-semibold">Mobile Remote</span>
              </div>
              {remoteConnected ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <Wifi size={12} /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-white/35">
                  <WifiOff size={12} /> Waiting…
                </span>
              )}
            </div>

            {/* Session code */}
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Session Code</p>
            <p className="text-5xl font-black tracking-[0.3em] text-white mb-5 font-mono">
              {sessionCode}
            </p>

            {/* QR code */}
            <div className="inline-block p-2 bg-white rounded-xl mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(remoteUrl)}&margin=4`}
                alt={`QR code: ${remoteUrl}`}
                width={160}
                height={160}
                className="rounded-lg block"
              />
            </div>

            {/* URL copy row */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-lg px-3 py-2 mb-5">
              <span className="flex-1 text-xs text-white/50 truncate text-left">{remoteUrl}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(remoteUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="shrink-0 flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
              >
                <Copy size={12} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Instructions */}
            <p className="text-white/35 text-xs leading-relaxed">
              Open the link on your phone. The page gives you speaker notes and lets
              you control slides remotely — no login required.
            </p>

            <button
              onClick={() => setRemoteOpen(false)}
              className="mt-5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Progress bar */}
      <div className="h-1 bg-white/10 flex-shrink-0">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* ── Slide area */}
      <div
        className={`relative flex-1 bg-gradient-to-br ${config.bg} flex flex-col overflow-hidden`}
      >
        {/* Decorative grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Left / right click-to-navigate zones — sit below interactive content (z-[1] vs z-10) */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 z-[1]"
          style={{ cursor: current === 0 ? "default" : "w-resize" }}
          onClick={() => go("prev")}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 z-[1]"
          style={{ cursor: (isLastSlide || nextBlocked) ? "default" : "e-resize" }}
          onClick={() => { if (!nextBlocked && !isLastSlide) go("next"); }}
        />

        <div
          className={`relative z-10 flex-1 flex flex-col justify-center px-6 md:px-14 lg:px-24 py-3 transition-all duration-200 ease-in-out ${contentClass}`}
        >
          {slide.type === "title" && (
            /* ── Title slide layout */
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm mb-5">
                {mode === "briefing" ? <GraduationCap size={14} /> : <Lightbulb size={14} />}
                {mode === "briefing"
                  ? "Programme Orientation · SAQA 78965 · NQF Level 4"
                  : `SAQA ${mod?.id}  ·  NQF Level 4  ·  ${mod?.credits} Credits`}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="text-white/50 text-base mb-5">{slide.subtitle}</p>
              {mode === "module" && mod && (
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
                    Block {mod.block}
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
                    {mod.days}
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm font-medium capitalize">
                    {mod.type}
                  </span>
                </div>
              )}
              {/* Learner portal QR — shown on briefing title slide so learners can scan to register */}
              {mode === "briefing" && (
                <div className="mt-6 flex flex-col items-center gap-1.5">
                  <div className="p-2 bg-white rounded-xl inline-block">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https%3A%2F%2Fcetconnect.netlify.app%2Fauth%2Fsignup&margin=3&color=1e1b4b&bgcolor=ffffff"
                      alt="Scan to join the learner portal"
                      width={110}
                      height={110}
                      className="block rounded-lg"
                    />
                  </div>
                  <p className="text-white/40 text-xs tracking-wide">cetconnect.netlify.app · Scan to register</p>
                </div>
              )}
            </div>
          )}

          {/* ── Quiz slide layout */}
          {slide.type === "quiz" && slide.quizQuestion && slide.quizOptions && (
            <div className="max-w-3xl w-full mx-auto">
              <p className="text-xs uppercase tracking-widest font-semibold mb-2 text-purple-300">
                {slide.subtitle}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-5 leading-snug">
                {slide.quizQuestion}
              </h2>

              <div className="space-y-2 mb-4">
                {slide.quizOptions.map((opt, i) => {
                  const isSelected = qState.selected === i;
                  const isCorrect = slide.quizCorrect === i;
                  let optClass =
                    "flex items-start gap-3 w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ";
                  if (!qState.revealed) {
                    optClass += isSelected
                      ? "bg-purple-500/30 border-purple-400 text-white"
                      : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40";
                  } else {
                    if (isCorrect) {
                      optClass += "bg-emerald-500/25 border-emerald-400 text-emerald-100";
                    } else if (isSelected) {
                      optClass += "bg-red-500/20 border-red-400 text-red-200";
                    } else {
                      optClass += "bg-white/5 border-white/10 text-white/40 cursor-default";
                    }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleQuizSelect(i)}
                      disabled={qState.revealed}
                      className={optClass}
                    >
                      <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold mt-0.5">
                        {qState.revealed
                          ? isCorrect ? "✓" : isSelected ? "✗" : String.fromCharCode(65 + i)
                          : String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm md:text-base leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {qState.revealed && slide.quizExplanation && (
                <div className="flex gap-3 p-4 rounded-xl border border-purple-500/40 bg-purple-500/10">
                  <Lightbulb size={16} className="shrink-0 mt-0.5 text-purple-300" />
                  <p className="text-sm text-white/80 leading-relaxed">{slide.quizExplanation}</p>
                </div>
              )}
              {!qState.revealed && (
                <p className="text-white/30 text-xs mt-4">Select an answer to reveal the explanation.</p>
              )}
            </div>
          )}

          {/* ── Regular content slides (objectives, content, activity, summary) */}
          {slide.type !== "title" && slide.type !== "quiz" && (
            <div className="max-w-4xl w-full mx-auto">
              {slide.subtitle && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${config.accent.split(" ")[0]}`}>
                  {slide.subtitle}
                </p>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-snug">
                {slide.title}
              </h2>

              {slide.bullets && slide.bullets.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {slide.bullets.map((item, i) => {
                    const isCheckmark = item.startsWith("✓");
                    const cleaned = item.replace(/^✓\s*/, "");
                    const [label, detail] = cleaned.split(":").map((s) => s.trim());
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-1 shrink-0 ${isCheckmark ? "text-green-400" : config.accent.split(" ")[0]}`}>
                          {isCheckmark ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                              {i + 1}
                            </span>
                          )}
                        </span>
                        <span className="text-white/90 text-base md:text-lg leading-relaxed">
                          {detail ? (
                            <>
                              <span className="font-semibold text-white">{label}</span>
                              <span className="text-white/60"> — </span>
                              {detail}
                            </>
                          ) : (
                            cleaned
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {slide.body && (
                <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">{slide.body}</p>
              )}

              {slide.highlight && (
                <div className={`flex gap-3 p-4 rounded-xl border bg-white/5 ${config.accent}`}>
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base leading-relaxed opacity-90">{slide.highlight}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Speaker notes panel */}
      {isAdmin && notesOpen && slide.speakerNote && (
        <div className="flex-shrink-0 bg-black/90 border-t border-white/10 px-6 md:px-16 py-3 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Users size={13} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">
              Facilitator Notes
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{slide.speakerNote}</p>
        </div>
      )}

      {/* ── Bottom bar — transparent; only shows last-slide action buttons */}
      <div className="flex-shrink-0 flex items-center justify-end px-4 py-2 gap-3">
        {isLastSlide && (
          <>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/20"
            >
              <X size={15} /> End Presentation
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-sm font-medium transition-colors border border-amber-500/30"
            >
              <Coffee size={15} /> Take a Break
            </button>
            {nextUnitId && (
              <button
                onClick={handleNavigateToUnit}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition-colors"
              >
                {nextLabel} <ArrowRight size={15} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Keyboard / interaction hint */}
      <div className="absolute bottom-12 right-5 text-white/20 text-xs pointer-events-none select-none">
        click · scroll · ← →{isAdmin ? " · N notes" : ""}
      </div>
    </div>
  );
}
