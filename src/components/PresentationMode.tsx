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
import {
  module14924SpeakerNotes,
  module14924SlideList,
  type Module14924SlideListItem,
} from "@/data/module14924Presentation";
import {
  module14920SpeakerNotes,
  module14920SlideList,
  type Module14920SlideListItem,
} from "@/data/module14920Presentation";
import {
  module14918SlideList,
  type Module14918SlideListItem,
} from "@/data/module14918Presentation";
import {
  module14927SlideList,
  type Module14927SlideListItem,
} from "@/data/module14927Presentation";
import {
  module14915SlideList,
  type Module14915SlideListItem,
} from "@/data/module14915Presentation";
import {
  module14910SpeakerNotes,
  module14910SlideList,
  type Module14910SlideListItem,
} from "@/data/module14910Presentation";
import {
  module14930SpeakerNotes,
  module14930SlideList,
  type Module14930SlideListItem,
} from "@/data/module14930Presentation";
import {
  module14933SpeakerNotes,
  module14933SlideList,
  type Module14933SlideListItem,
<<<<<<< Updated upstream
} from "@/data/module14933Presentation";
=======
} from "@/data/block2/module14933Presentation";
import {
  module14908SlideList,
  type Module14908SlideListItem,
} from "@/data/block3/module14908Presentation";
import {
  module14919SlideList,
  type Module14919SlideListItem,
} from "@/data/block3/module14919Presentation";
import {
  module14921SlideList,
  type Module14921SlideListItem,
} from "@/data/block3/module14921Presentation";
>>>>>>> Stashed changes
import { programmeBriefingSlides } from "@/data/programmeBriefing";
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
  diagram?: string;
  imageUrl?: string;
  imageAlt?: string;
  cards?: string[];
  phaseCards?: string[];
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
  "14910": [
    {
      question: "During the practical, which tool should a learner open to type and save code?",
      options: [
        "An editor or code editor",
        "A music player",
        "The printer settings window",
        "A slideshow only",
      ],
      correct: 0,
      explanation:
        "The editor is the main workspace where a learner types, saves, and corrects source code.",
    },
    {
      question: "A learner accidentally removes a word while typing code. Which shortcut helps undo that mistake?",
      options: [
        "Ctrl+Z",
        "Ctrl+P",
        "Alt+Tab",
        "Esc only",
      ],
      correct: 0,
      explanation:
        "Ctrl+Z is the common undo shortcut. It helps learners recover quickly from small mistakes.",
    },
    {
      question: "If the code is missing a colon or bracket, what kind of problem is it?",
      options: [
        "A syntax error",
        "A screen brightness problem",
        "A printer error",
        "A network password issue",
      ],
      correct: 0,
      explanation:
        "A syntax error happens when the code breaks the language rules, such as missing punctuation or brackets.",
    },
    {
      question: "What best shows understanding in this practical?",
      options: [
        "Explaining the mistake and correcting it step by step",
        "Typing the fastest in the room",
        "Memorising many shortcuts without using them",
        "Skipping the activity and reading only",
      ],
      correct: 0,
      explanation:
        "For this session, understanding is shown by doing the small task and explaining what changed and why.",
    },
  ],
  "14933": [
    {
      question: "Before building a simple web page, what should the learner decide first?",
      options: [
        "The topic, purpose, target audience, and objectives",
        "Only the wallpaper colour of the lab",
        "A random password for the site",
        "Nothing — planning is not needed",
      ],
      correct: 0,
      explanation:
        "The facilitator guide starts with planning the audience and purpose before any design or coding begins.",
    },
    {
      question: "If a learner sketches the page layout before coding, what are they doing?",
      options: [
        "Planning a simple storyboard or wireframe",
        "Installing a new operating system",
        "Deleting the browser",
        "Compiling Java into HTML",
      ],
      correct: 0,
      explanation:
        "A simple wireframe or storyboard helps the learner think about layout and communication before building.",
    },
    {
      question: "Which statement correctly explains HTML, CSS, and JavaScript?",
      options: [
        "HTML = structure, CSS = styling, JavaScript = behaviour",
        "HTML = behaviour, CSS = database, JavaScript = printing",
        "HTML = security, CSS = hosting, JavaScript = storage",
        "HTML = testing, CSS = browser, JavaScript = keyboard",
      ],
      correct: 0,
      explanation:
        "HTML builds the structure, CSS improves the appearance, and JavaScript adds interaction.",
    },
    {
      question: "A learner adds a button that shows a message when clicked. What does this demonstrate?",
      options: [
        "Basic scripting and page interaction",
        "Replacing the browser completely",
        "Saving passwords automatically",
        "Turning the page into a PDF",
      ],
      correct: 0,
      explanation:
        "JavaScript adds behaviour such as button clicks, messages, and form validation.",
    },
    {
      question: "Why do we resize the browser or test on another device during the practical?",
      options: [
        "To check whether the page still works on different screen sizes",
        "To remove the need for CSS",
        "To make the file size zero",
        "To disconnect the internet",
      ],
      correct: 0,
      explanation:
        "Responsive design makes a page easier to use across phones, tablets, and desktops.",
    },
  ],
  "14930": [
    {
      question: "Why is HTTP described as a stateless protocol?",
      options: [
        "Because it never sends data across the internet",
        "Because the server does not automatically remember the user between requests",
        "Because only images can be transferred over it",
        "Because it works only when the browser is offline",
      ],
      correct: 1,
      explanation:
        "HTTP is stateless because each request is treated independently unless the application manages state using sessions, cookies, or other mechanisms.",
    },
    {
      question: "Which security practice helps protect session IDs and login details while data is in transit?",
      options: [
        "Using HTTPS",
        "Turning CSS off",
        "Renaming the HTML file",
        "Removing all passwords from the site",
      ],
      correct: 0,
      explanation:
        "HTTPS encrypts traffic so attackers cannot easily sniff credentials or session identifiers over the network.",
    },
  ],
  "14908": [
    {
      question: "Which test type checks a single function or module in isolation?",
      options: [
        "Acceptance testing",
        "System testing",
        "Unit testing",
        "User training",
      ],
      correct: 2,
      explanation:
        "Unit testing focuses on one small component at a time before broader integration or system checks.",
    },
    {
      question: "What should a proper test case include besides the input?",
      options: [
        "Only the file name",
        "Expected result and pass/fail evidence",
        "The developer's lunch break",
        "A random screenshot with no notes",
      ],
      correct: 1,
      explanation:
        "A useful test case records expected output, actual output, and whether the result passed or failed.",
    },
  ],
  "14919": [
    {
      question: "What is usually the FIRST step when a user reports that 'the computer is broken'?",
      options: [
        "Replace the computer immediately",
        "Ask clarifying questions and define the actual problem",
        "Escalate without checking anything",
        "Install new software straight away",
      ],
      correct: 1,
      explanation:
        "Support starts by understanding the real problem clearly before diagnosing or fixing anything.",
    },
    {
      question: "Which troubleshooting sequence best reflects good support practice?",
      options: [
        "Guess -> Fix -> Hope",
        "Ask -> Reproduce -> Isolate -> Fix -> Verify -> Document",
        "Document -> Ignore -> Close",
        "Reboot -> Escalate -> Leave",
      ],
      correct: 1,
      explanation:
        "A structured troubleshooting method improves accuracy, communication, and repeatability in user support work.",
    },
  ],
  "120379": [
    {
      question: "What is the 'triple constraint' in project work?",
      options: [
        "Scope, time, and cost",
        "Code, browser, and printer",
        "Planning, lunch, and meetings",
        "Testing, colour, and attendance",
      ],
      correct: 0,
      explanation:
        "Project delivery is usually balanced across scope, time, and cost — if one changes, the others are often affected.",
    },
    {
      question: "What does effective participation in a project team mean most of all?",
      options: [
        "Just attending meetings quietly",
        "Contributing to deliverables, communication, and agreed responsibilities",
        "Waiting for others to finish the work",
        "Changing the scope alone without agreement",
      ],
      correct: 1,
      explanation:
        "Good team participation means active contribution, clear communication, and accountability for agreed tasks.",
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

function extractFacilitatorScript(notes: string): string {
  const marker = "Facilitator notes:\n";
  const markerIndex = notes.indexOf(marker);
  if (markerIndex === -1) return notes.trim();
  return notes.slice(markerIndex + marker.length).trim();
}

function toModule14924Slide(item: Module14924SlideListItem, quizIndexRef: { current: number }): Slide {
  const subtitle = item.learnerView.subtitle;
  const bullets = item.learnerView.onScreenContent;
  const body = item.learnerView.body;
  const speakerNote = extractFacilitatorScript(item.facilitatorNotes);
  const cards = item.learnerView.cards;
  const phaseCards = item.learnerView.phaseCards;

  if (item.slideNumber === 1) {
    return {
      type: "title",
      title: item.title,
      subtitle,
      body,
      badge: item.learnerView.badges?.[item.learnerView.badges.length - 1],
      speakerNote,
    };
  }

  if (/^Session\s+\d+$/i.test(item.title)) {
    return {
      type: "objectives",
      title: item.title,
      subtitle,
      bullets,
      body,
      speakerNote,
      isSessionStart: true,
      sessionLabel: item.title,
    };
  }

  if (/^Knowledge Check\b/i.test(item.title)) {
    const quiz = PRESENTATION_QUIZZES["14924"]?.[quizIndexRef.current++];
    if (quiz) {
      return {
        type: "quiz",
        title: item.title,
        subtitle: subtitle ?? "Session Quiz · Information Systems Analysis",
        quizQuestion: quiz.question,
        quizOptions: quiz.options,
        quizCorrect: quiz.correct,
        quizExplanation: quiz.explanation,
        speakerNote,
      };
    }
  }

  if (/^Session Wrap-Up$/i.test(item.title)) {
    return {
      type: "summary",
      title: item.title,
      subtitle,
      bullets,
      body,
      speakerNote,
    };
  }

  return {
    type: "content",
    title: item.title,
    subtitle,
    bullets,
    cards,
    body,
    phaseCards,
    speakerNote,
  };
}

function buildModule14924SlidesFromJson(): Slide[] {
  const quizIndexRef = { current: 0 };
  return module14924SlideList
    .slice()
    .sort((a, b) => a.slideNumber - b.slideNumber)
    .map((item) => toModule14924Slide(item, quizIndexRef));
}

function toModule14920Slide(item: Module14920SlideListItem, quizIndexRef: { current: number }): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  if (item.type === "qa" || /^Knowledge Check\b/i.test(item.title)) {
    const quiz = PRESENTATION_QUIZZES["14920"]?.[quizIndexRef.current++];
    if (quiz) {
      return {
        type: "quiz",
        title: item.title,
        subtitle: subtitle ?? "Session Quiz · Participate in Groups and/or Teams",
        quizQuestion: quiz.question,
        quizOptions: quiz.options,
        quizCorrect: quiz.correct,
        quizExplanation: quiz.explanation,
        speakerNote: item.notes,
      };
    }
  }

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    imageUrl: (item as Record<string, unknown>).imageUrl as string | undefined,
    imageAlt: (item as Record<string, unknown>).imageAlt as string | undefined,
    cards: item.cards,
    phaseCards: item.phaseCards,
    speakerNote: item.notes,
  };
}

function buildModule14920SlidesFromJson(): Slide[] {
  const quizIndexRef = { current: 0 };
  return module14920SlideList.map((item) => toModule14920Slide(item, quizIndexRef));
}

function toModule14918Slide(item: Module14918SlideListItem, quizIndexRef: { current: number }): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  if (item.type === "qa" || /^Knowledge Check\b/i.test(item.title)) {
    const quiz = PRESENTATION_QUIZZES["14918"]?.[quizIndexRef.current++];
    if (quiz) {
      return {
        type: "quiz",
        title: item.title,
        subtitle: subtitle ?? "Session Quiz · Describe Principles of Computer Programming",
        quizQuestion: quiz.question,
        quizOptions: quiz.options,
        quizCorrect: quiz.correct,
        quizExplanation: quiz.explanation,
        speakerNote: item.notes,
      };
    }
  }

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    cards: item.cards,
    phaseCards: item.phaseCards,
    speakerNote: item.notes,
  };
}

function buildModule14918SlidesFromJson(): Slide[] {
  const quizIndexRef = { current: 0 };
  return module14918SlideList.map((item) => toModule14918Slide(item, quizIndexRef));
}

function toModule14927Slide(item: Module14927SlideListItem, quizIndexRef: { current: number }): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  if (item.type === "qa" || /^Knowledge Check\b/i.test(item.title)) {
    const quiz = PRESENTATION_QUIZZES["14927"]?.[quizIndexRef.current++];
    if (quiz) {
      return {
        type: "quiz",
        title: item.title,
        subtitle: subtitle ?? "Session Quiz · Apply Problem-Solving Strategies",
        quizQuestion: quiz.question,
        quizOptions: quiz.options,
        quizCorrect: quiz.correct,
        quizExplanation: quiz.explanation,
        speakerNote: item.notes,
      };
    }
  }

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    cards: item.cards,
    phaseCards: item.phaseCards,
    speakerNote: item.notes,
  };
}

function buildModule14927SlidesFromJson(): Slide[] {
  const quizIndexRef = { current: 0 };
  return module14927SlideList.map((item) => toModule14927Slide(item, quizIndexRef));
}

function toModule14915Slide(item: Module14915SlideListItem, quizIndexRef: { current: number }): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  if (item.type === "qa" || /^Knowledge Check\b/i.test(item.title)) {
    const quiz = PRESENTATION_QUIZZES["14915"]?.[quizIndexRef.current++];
    if (quiz) {
      return {
        type: "quiz",
        title: item.title,
        subtitle: subtitle ?? "Session Quiz · Design a Computer Program to Specification",
        quizQuestion: quiz.question,
        quizOptions: quiz.options,
        quizCorrect: quiz.correct,
        quizExplanation: quiz.explanation,
        speakerNote: item.notes,
      };
    }
  }

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    cards: item.cards,
    phaseCards: item.phaseCards,
    speakerNote: item.notes,
  };
}

function buildModule14915SlidesFromJson(): Slide[] {
  const quizIndexRef = { current: 0 };
  return module14915SlideList.map((item) => toModule14915Slide(item, quizIndexRef));
}

function toModule14910Slide(item: Module14910SlideListItem): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  if (item.type === "qa" && item.quiz) {
    return {
      type: "quiz",
      title: item.title,
      subtitle: subtitle ?? "Knowledge Check · Session 1",
      quizQuestion: item.quiz.question,
      quizOptions: item.quiz.options,
      quizCorrect: item.quiz.answerIndex,
      quizExplanation: item.quiz.explanation,
      speakerNote: item.notes,
    };
  }

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    cards: item.cards,
    phaseCards: item.phaseCards,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    speakerNote: item.notes,
  };
}

function buildModule14910SlidesFromData(): Slide[] {
  const mapped = module14910SlideList.map((item) => toModule14910Slide(item));
  const summarySlides = mapped.filter((slide) => slide.type === "summary");
  const coreSlides = mapped.filter((slide) => slide.type !== "summary");
  return [
    ...coreSlides,
    ...getQuizSlides("14910", "Apply the Principles of Computer Programming"),
    ...summarySlides,
  ];
}

function toModule14930Slide(item: Module14930SlideListItem): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    cards: item.cards,
    phaseCards: item.phaseCards,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    speakerNote: item.notes,
  };
}

function buildModule14930SlidesFromData(): Slide[] {
  const mapped = module14930SlideList.map((item) => toModule14930Slide(item));
  const summarySlides = mapped.filter((slide) => slide.type === "summary");
  const coreSlides = mapped.filter((slide) => slide.type !== "summary");
  return [
    ...coreSlides,
    ...getQuizSlides("14930", "Developing Software for the Internet"),
    ...summarySlides,
  ];
}

function toModule14933Slide(item: Module14933SlideListItem): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    cards: item.cards,
    phaseCards: item.phaseCards,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    speakerNote: item.notes,
  };
}

function buildModule14933SlidesFromData(): Slide[] {
  const mapped = module14933SlideList.map((item) => toModule14933Slide(item));
  const summarySlides = mapped.filter((slide) => slide.type === "summary");
  const coreSlides = mapped.filter((slide) => slide.type !== "summary");
  return [
    ...coreSlides,
    ...getQuizSlides("14933", "Create Web Pages with Scripting"),
    ...summarySlides,
  ];
}

<<<<<<< Updated upstream
=======
function toModule14908Slide(item: Module14908SlideListItem): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    cards: item.cards,
    phaseCards: item.phaseCards,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    speakerNote: item.notes,
  };
}

function buildModule14908SlidesFromData(): Slide[] {
  const mapped = module14908SlideList.map((item) => toModule14908Slide(item));
  const summarySlides = mapped.filter((slide) => slide.type === "summary");
  const coreSlides = mapped.filter((slide) => slide.type !== "summary");
  return [
    ...coreSlides,
    ...getQuizSlides("14908", "Testing IT Systems Against Specifications"),
    ...summarySlides,
  ];
}

function toModule14919Slide(item: Module14919SlideListItem): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    cards: item.cards,
    phaseCards: item.phaseCards,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    speakerNote: item.notes,
  };
}

function buildModule14919SlidesFromData(): Slide[] {
  const mapped = module14919SlideList.map((item) => toModule14919Slide(item));
  const summarySlides = mapped.filter((slide) => slide.type === "summary");
  const coreSlides = mapped.filter((slide) => slide.type !== "summary");
  return [
    ...coreSlides,
    ...getQuizSlides("14919", "Resolve Computer Users' Problems"),
    ...summarySlides,
  ];
}

function toModule14921Slide(item: Module14921SlideListItem): Slide {
  const lines = item.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("• ")).map((line) => line.replace(/^•\s*/, ""));
  const nonBulletLines = lines.filter((line) => !line.startsWith("• "));
  const subtitle = nonBulletLines[0];
  const body = nonBulletLines.slice(1).join("\n") || undefined;

  const mappedType: SlideType =
    item.type === "title"
      ? "title"
      : item.type === "summary"
      ? "summary"
      : item.type === "activity"
      ? "activity"
      : "content";

  return {
    type: mappedType,
    title: item.title,
    subtitle,
    body,
    bullets: bulletLines.length ? bulletLines : undefined,
    cards: item.cards,
    phaseCards: item.phaseCards,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    speakerNote: item.notes,
  };
}

function buildModule14921SlidesFromData(): Slide[] {
  const mapped = module14921SlideList.map((item) => toModule14921Slide(item));
  const summarySlides = mapped.filter((slide) => slide.type === "summary");
  const coreSlides = mapped.filter((slide) => slide.type !== "summary");
  return [
    ...coreSlides,
    ...getQuizSlides("14921", "Types of Computer Systems and Hardware Configurations"),
    ...summarySlides,
  ];
}

>>>>>>> Stashed changes
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

const MODULE_SPEAKER_NOTES: Record<string, ModuleSpeakerNotes | Record<string, string>> = {
  /* ── Block 1 ── */
  "14924": module14924SpeakerNotes,
  "14920": module14920SpeakerNotes,

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
  "14910": module14910SpeakerNotes,

  "14930": module14930SpeakerNotes,

  "14933": module14933SpeakerNotes,
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
<<<<<<< Updated upstream
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
=======
      "Block 3, Day 11 — Types of Computer Systems and Hardware Configurations.\n\n" +
      "Opening prompt: 'Would you buy the same machine for a reception desk, a coding lab, and a server room?'\n\n" +
      "Set the expectation: learners must justify configuration decisions with user needs, compatibility, and support constraints.",
    objectives:
      "Walk through outcomes with applied framing:\n\n" +
      "• Identify and compare common system types by environment and task profile\n" +
      "• Explain the role of core components and key peripherals\n" +
      "• Recommend fit-for-purpose configurations and justify trade-offs\n\n" +
      "Keep learners focused on rationale, not only on naming hardware parts.",
>>>>>>> Stashed changes
    activityIndividual:
      "Workbook-first progression:\n\n" +
      "• Complete system-type comparison activities using realistic workplace scenarios\n" +
      "• Build a component-function mapping table (CPU, RAM, storage, motherboard, PSU, peripherals)\n" +
      "• Draft one short recommendation note for a selected user profile\n\n" +
      "Check that each answer includes both technical choice and reason.",
    activityGroup:
      "Practical assessment rehearsal (scenario-based, 30–40 minutes).\n\n" +
      "Each group receives a lab/office support scenario and must produce:\n" +
      "1. User need summary\n" +
      "2. Proposed configuration\n" +
      "3. Compatibility checks\n" +
      "4. Upgrade path and support notes\n\n" +
      "Groups present their rationale. Peer question: 'What would fail first if this configuration is under-specified?'.",
    summary:
      "Close with a four-point evidence check:\n" +
      "• Learner guide sections were covered with examples\n" +
      "• Workbook tasks are complete and reviewable\n" +
      "• Practical scenario responses are justified and documented\n" +
      "• Learners are ready for summative-style configuration questions\n\n" +
      "Reminder: quality of explanation matters as much as the final hardware list.",
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
  moduleId?: string,
  sessionOutcomes?: string[],
  nextSectionTitle?: string
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
        const rows = block.rows.slice(0, 4).map((row) =>
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

  const topicVisualPrompts: Record<string, string> = {
    "sdlc": "Visual: draw the 6 SDLC phases as a looped timeline and place one real task under each phase.",
    "analysis": "Visual: sketch an AS-IS vs TO-BE comparison with two columns on the board.",
    "requirements": "Visual: create a simple user story map (actor → need → value) with sticky notes.",
    "data flow": "Visual: draw a mini DFD live (external entity → process → data store → output).",
    "team": "Visual: map team roles in a responsibility matrix (who decides / who executes / who approves).",
    "problem": "Visual: use a fishbone diagram to break causes into People / Process / Tech / Environment.",
    "pseudocode": "Visual: run a line-by-line trace table (step, variable values, expected output).",
    "algorithm": "Visual: draw input → process → output blocks, then animate one example through the flow.",
    "data type": "Visual: build a quick table: field name | data type | reason | validation rule.",
    "validation": "Visual: compare validation vs verification in a two-column board chart.",
    "design": "Visual: present one good and one bad design artefact and ask learners to critique both.",
    "testing": "Visual: draw a test pyramid (unit, integration, system, acceptance) and place examples.",
    "function": "Visual: box a large program into smaller functions and label each function responsibility.",
    "project": "Visual: draw a simple Gantt strip for planning, execution, review.",
    "web": "Visual: split the screen into HTML (structure), CSS (style), JS (behaviour) and map each change.",
    "loop": "Visual: trace 3 loop iterations in a table so learners can see state changes clearly.",
  };

  /* Match section title keywords to a contextual prompt (case-insensitive) */
  const titleLower = section.title.toLowerCase();
  const matchedPrompt = Object.entries(topicDiscussionPrompts).find(([key]) =>
    titleLower.includes(key)
  )?.[1];
  const matchedVisual = Object.entries(topicVisualPrompts).find(([key]) =>
    titleLower.includes(key)
  )?.[1];

  const outcomeAnchor = sessionOutcomes?.[0]
    ? `Outcome focus: ${sessionOutcomes[0]}`
    : "Outcome focus: connect this concept directly to the session outcomes before moving on.";

  const moduleName = moduleId ? `(Module ${moduleId}) ` : "";
  const subTopicNote = speakerExtras.length > 0 ? `Sub-topics covered: ${speakerExtras.join(" | ")}.\n\n` : "";
  const transitionLine = nextSectionTitle
    ? `Transition line: \"Now that ${section.title} is clear, let's move into ${nextSectionTitle} so we can apply this practically.\"`
    : 'Transition line: "We have completed the section flow. Next, we consolidate through recap and quiz checks."';
  const baseNote =
    `${subTopicNote}TOPIC: ${section.title}. ${moduleName}\n\n` +
    `${outcomeAnchor}\n\n` +
    "Facilitation flow:\n" +
    "1) Explain the concept in plain language (no jargon first).\n" +
    "2) Demonstrate one concrete example step-by-step.\n" +
    "3) Check understanding with one short learner response.\n\n" +
    "Teaching pointers:\n" +
    `• ${matchedPrompt ?? `Ask: 'Can someone give a real-world example of "${section.title}" from their own workplace or study?'`}\n` +
    `• ${matchedVisual ?? "Visual: sketch the concept structure on the board before discussing bullets (diagram, mini-table, or flow)."}\n` +
    "• Ask learners to annotate their workbooks as you present and highlight one key term they must remember.\n" +
    "• End by restating the practical workplace implication of this concept.\n\n" +
    transitionLine;

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

  const CHUNK = 4;
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

function getModuleAnchorConfig(moduleId: string): {
  subtitle: string;
  roadmapLead: string;
  anchorTitle: string;
  anchorDiagram: string;
  anchorBullets: string[];
  anchorHighlight: string;
} {
  const defaults = {
    subtitle: "From foundation to application",
    roadmapLead: "Follow this sequence to keep understanding and execution aligned.",
    anchorTitle: "Learning Loop Visual Anchor",
    anchorDiagram:
      "Context -> Concepts -> Methods -> Practice -> Feedback -> Improve\n" +
      "   |          |           |           |           |\n" +
      "   v          v           v           v           v\n" +
      "why it matters  what it means  how we do it  try it now  refine approach",
    anchorBullets: [
      "Every section should answer: Why this matters before How to do it",
      "Practice and feedback are built into the flow, not left for the end",
      "This loop helps learners connect theory to workplace execution",
    ],
    anchorHighlight:
      "When a concept feels difficult, return to the loop: context first, then method, then guided practice.",
  };

  const moduleConfigs: Record<string, Partial<typeof defaults>> = {
    "14910": {
      subtitle: "Programming practice from logic to working code",
      roadmapLead: "We turn pseudocode, data handling, and control structures into runnable programs.",
      anchorTitle: "Programming Practice Anchor",
      anchorDiagram:
        "Problem -> Pseudocode -> Code -> Test -> Debug -> Improve\n" +
        "   |         |          |       |         |\n" +
        "   v         v          v       v         v\n" +
        "requirements logic flow  implementation correctness fixes  better version",
      anchorBullets: [
        "Structured logic becomes easier to code when the problem is broken down first",
        "Testing and debugging are part of programming, not a separate afterthought",
        "Each improvement cycle makes the program more reliable and maintainable",
      ],
      anchorHighlight: "Good programming is a cycle of logic, code, testing, and refinement.",
    },
    "14920": {
      subtitle: "Collaboration and communication progression",
      roadmapLead: "We move from team roles and communication to coordination, problem-solving, and review.",
      anchorTitle: "Team Collaboration Anchor",
      anchorDiagram:
        "Team Goal -> Roles -> Communication -> Coordination -> Review -> Improve\n" +
        "    |          |            |              |           |\n" +
        "    v          v            v              v           v\n" +
        "shared purpose  clear ownership  quality handoffs  delivery check  team learning",
      anchorBullets: [
        "Clarity of roles and communication is the base of team performance",
        "Coordination and review prevent avoidable delivery issues",
        "Continuous improvement turns teams into reliable systems",
      ],
      anchorHighlight: "If collaboration weakens, return to role clarity and communication rhythm first.",
    },
    "14918": {
      subtitle: "Programming logic from concepts to reliable code",
      roadmapLead: "We translate logic into code with validation at each step.",
      anchorTitle: "Programming Logic Anchor",
      anchorDiagram:
        "Understand Problem -> Design Logic -> Write Code -> Test -> Refine\n" +
        "       |               |            |         |\n" +
        "       v               v            v         v\n" +
        "requirements clarity  algorithm flow  implementation  correctness check",
      anchorBullets: [
        "Design before coding prevents avoidable implementation errors",
        "Testing verifies behavior, validation confirms input/data quality",
        "Refinement improves readability, maintainability and correctness",
      ],
      anchorHighlight: "Good code starts as clear logic, not as fast typing.",
    },
    "14927": {
      subtitle: "Applied problem-solving and decision quality",
      roadmapLead: "We structure reasoning so team decisions are evidence-based.",
      anchorTitle: "Decision Quality Anchor",
      anchorDiagram:
        "Situation -> Evidence -> Options -> Decision -> Action -> Reflection\n" +
        "    |          |           |           |          |\n" +
        "    v          v           v           v          v\n" +
        "context set   facts first  compare paths  commit plan  improve model",
      anchorBullets: [
        "Evidence should drive option selection, not assumptions",
        "Action plans must include ownership and monitoring",
        "Reflection improves future decision speed and quality",
      ],
      anchorHighlight: "Strong decisions come from structured thinking, not guesswork.",
    },
    "14915": {
      subtitle: "Design discipline before implementation",
      roadmapLead: "We move from design structure to quality checks before code finalization.",
      anchorTitle: "Program Design Anchor",
      anchorDiagram:
        "Requirements -> Design Artefacts -> Desk Check -> Improve -> Build\n" +
        "     |              |               |           |\n" +
        "     v              v               v           v\n" +
        "scope clarity     flow precision   logic validation  safer implementation",
      anchorBullets: [
        "Design artefacts reduce ambiguity before coding starts",
        "Desk-checking catches logic faults early and cheaply",
        "Improved design quality lowers downstream rework",
      ],
      anchorHighlight: "The cheapest bug is the one found in design, before code exists.",
    },
    "14908": {
      subtitle: "Testing IT systems from plan to evidence",
      roadmapLead: "We define test intent early and collect evidence systematically.",
      anchorTitle: "Testing Anchor",
      anchorDiagram:
        "Requirements -> Test Plan -> Test Cases -> Execute -> Log Defects -> Re-test\n" +
        "      |             |            |             |              |\n" +
        "      v             v            v             v              v\n" +
        "scope clarity   expected results  coverage check  defect trace  quality confidence",
      anchorBullets: [
        "Strong test cases link directly to requirements and risks",
        "Defect logging quality determines fix speed and re-test success",
        "Sign-off should follow evidence, not deadlines",
      ],
      anchorHighlight: "Testing quality is measured by evidence traceability, not just the number of tests run.",
    },
    "120379": {
      subtitle: "Project teamwork from planning to delivery control",
      roadmapLead: "We align scope, roles and timelines before execution pressure starts.",
      anchorTitle: "Project Teamwork Anchor",
      anchorDiagram:
        "Scope -> Plan -> Roles -> Execute -> Track -> Adapt -> Close\n" +
        "  |       |       |        |        |        |\n" +
        "  v       v       v        v        v        v\n" +
        "clear goals timeline tasks accountability progress control lessons captured",
      anchorBullets: [
        "Shared scope understanding reduces scope creep and confusion",
        "Tracking and adaptation protect delivery under changing conditions",
        "Closure and retrospectives improve the next project cycle",
      ],
      anchorHighlight: "Team projects succeed when planning discipline continues during execution.",
    },
    "14930": {
      subtitle: "Internet software from network principles to secure delivery",
      roadmapLead: "We connect internet architecture, UI methods, ownership, and security before full web scripting begins.",
      anchorTitle: "Internet Development Anchor",
      anchorDiagram:
        "Protocols -> Sessions -> UI Choice -> Security -> Ownership -> Release\n" +
        "    |           |            |            |             |\n" +
        "    v           v            v            v             v\n" +
        "reliable links  state control  user experience  safe delivery  professional practice",
      anchorBullets: [
        "Stateless web protocols directly affect application design",
        "Interface choices shape usability, speed, and accessibility",
        "Security, ownership, and version control are part of professional web delivery",
      ],
      anchorHighlight: "Strong internet applications balance usability, performance, ownership, and security.",
    },
    "14919": {
      subtitle: "User support from issue intake to closure",
      roadmapLead: "We diagnose accurately, resolve efficiently, then prevent recurrence.",
      anchorTitle: "User Support Anchor",
      anchorDiagram:
        "Receive Issue -> Diagnose -> Resolve -> Confirm -> Document -> Prevent\n" +
        "     |            |          |          |           |\n" +
        "     v            v          v          v           v\n" +
        "clear intake    root cause  fix action  user validation  knowledge base",
      anchorBullets: [
        "Accurate issue intake shortens total resolution time",
        "User confirmation is required before ticket closure",
        "Documentation turns one-off fixes into organisational learning",
      ],
      anchorHighlight: "Support maturity means solving issues and reducing future repeats.",
    },
  };

  return { ...defaults, ...(moduleConfigs[moduleId] ?? {}) };
}

function getModuleVisualExample(moduleId?: string): {
  title: string;
  subtitle: string;
  cards: string[];
  diagram?: string;
  imageUrl?: string;
  imageAlt?: string;
  highlight?: string;
} | null {
  const examples: Record<string, {
    title: string;
    subtitle: string;
    cards: string[];
    diagram?: string;
    imageUrl?: string;
    imageAlt?: string;
    highlight?: string;
  }> = {
    "14910": {
      title: "Worked Example & Code Flow",
      subtitle: "Example: learner marks calculator",
      cards: [
        "Input: capture three marks from the user",
        "Process: calculate total and average, then use if/else for pass or support needed",
        "Output: display the result clearly and optionally save it to a file",
      ],
      diagram: "Input Marks -> Calculate Average -> IF average >= 50 -> Pass / Else -> Support Needed",
      imageUrl: "/docs/SAQA_78965_CET_Training/01_Core_UnitStandards/US 14910/14910 - Learner Workbook_images/image-003.jpeg",
      imageAlt: "Programming discussion visual",
      highlight: "Use one concrete program from start to finish so learners can see why each coding concept matters.",
    },
    "14930": {
      title: "Internet Example in Practice",
      subtitle: "Example: simple secure login request",
      cards: [
        "Browser sends username and password over HTTPS",
        "Server validates details and creates a session ID",
        "User interface choice affects speed, usability, and security",
      ],
      diagram: "Browser Request -> Server Validation -> Session ID -> Secure Response",
      highlight: "This helps learners connect protocol theory to a real web interaction they already use every day.",
    },
    "14933": {
      title: "Portfolio Page Example",
      subtitle: "Example: plan, build, test, and present a small web page",
      cards: [
        "Plan: define the audience, purpose, and the sections the page must include",
        "Build: use HTML for structure, CSS for layout, and JavaScript for one useful interaction",
        "Test: check the page on different screen sizes and confirm links or form messages work",
      ],
      diagram: "Plan -> Storyboard -> Build Page -> Add Script -> Test -> Present",
      highlight: "This keeps the presentation aligned to the facilitator guide by showing that web development is a practical process from planning through testing.",
    },
    "14908": {
      title: "Testing Cycle Example",
      subtitle: "Example: login form with seeded bugs",
      cards: [
        "Write a test case with expected and actual results",
        "Run the test and log the bug clearly",
        "Retest after the fix and record the evidence",
      ],
      diagram: "Test Case -> Execute -> Defect Log -> Fix -> Re-test -> Sign-off",
      highlight: "Learners should see testing as a repeatable process, not a one-time guess.",
    },
    "14919": {
      title: "Support Ticket Example",
      subtitle: "Example: 'I can't print' troubleshooting flow",
      cards: [
        "Ask clarifying questions before guessing the problem",
        "Isolate whether the issue is printer, network, driver, or user access",
        "Fix, verify with the user, and document the resolution",
      ],
      diagram: "Ask -> Reproduce -> Isolate -> Fix -> Verify -> Document",
      highlight: "This gives learners a script they can reuse in real support situations.",
    },
    "120379": {
      title: "Project Board Example",
      subtitle: "Example: sprint planning in action",
      cards: [
        "Break the work into To Do, In Progress, and Done",
        "Assign owners and identify the main risk early",
        "Review progress daily and adjust when blockers appear",
      ],
      diagram: "Scope -> Plan -> Assign -> Track -> Adapt -> Deliver",
      highlight: "Make the project workflow visible so team roles and accountability are easy to understand.",
    },
  };

  return moduleId ? examples[moduleId] ?? null : null;
}

/** Build session-structured slides from a ModuleLessonFlow */
export function buildFlowSlides(flow: ModuleLessonFlow, mod?: Module): Slide[] {
  if (flow.moduleId === "14924") {
    // Module 14924 is authored as a full deck in JSON; render directly from that source of truth.
    return buildModule14924SlidesFromJson();
  }

  if (flow.moduleId === "14920") {
    // Module 14920 follows the same dedicated data-source pattern as 14924.
    return buildModule14920SlidesFromJson();
  }

  if (flow.moduleId === "14918") {
    // Module 14918 now follows the same dedicated data-source pattern.
    return buildModule14918SlidesFromJson();
  }

  if (flow.moduleId === "14927") {
    // Module 14927 follows the dedicated editable data-source pattern.
    return buildModule14927SlidesFromJson();
  }

  if (flow.moduleId === "14915") {
    // Module 14915 follows the dedicated editable data-source pattern.
    return buildModule14915SlidesFromJson();
  }

  if (flow.moduleId === "14910") {
    // Module 14910 now uses a dedicated authored presentation data file.
    return buildModule14910SlidesFromData();
  }

  if (flow.moduleId === "14930") {
    // Module 14930 now uses a dedicated authored presentation data file.
    return buildModule14930SlidesFromData();
  }

  if (flow.moduleId === "14933") {
    // Module 14933 now uses a dedicated authored presentation data file.
    return buildModule14933SlidesFromData();
  }

<<<<<<< Updated upstream
=======
  if (flow.moduleId === "14908") {
    // Module 14908 now uses a dedicated authored presentation data file.
    return buildModule14908SlidesFromData();
  }

  if (flow.moduleId === "14919") {
    // Module 14919 now uses a dedicated authored presentation data file.
    return buildModule14919SlidesFromData();
  }

  if (flow.moduleId === "14921") {
    // Module 14921 now uses a dedicated authored presentation data file.
    return buildModule14921SlidesFromData();
  }

>>>>>>> Stashed changes
  const slides: Slide[] = [];
  const mn = MODULE_SPEAKER_NOTES[flow.moduleId];
  const sessions = flow.lessons.filter((l) => /^session-\d/.test(l.id));
  const firstSession = sessions[0];
  const sectionTitles = (firstSession?.sections ?? [])
    .map((section) => section.title?.trim())
    .filter((title): title is string => Boolean(title));

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

  /* 2.5 — Flow bridge (clear path before session deep-dive) */
  const anchor = getModuleAnchorConfig(flow.moduleId);
  const roadmapItems = sectionTitles.length
    ? sectionTitles.slice(0, 5).map((title, idx) => `Step ${idx + 1}: ${title}`)
    : [
        "Step 1: Build core understanding of today's topic",
        "Step 2: Connect concepts to practical workplace use",
        "Step 3: Apply methods, tools, or frameworks",
        "Step 4: Validate understanding through examples",
        "Step 5: Consolidate and prepare for assessment tasks",
      ];

  slides.push({
    type: "content",
    title: "How This Unit Flows",
    subtitle: anchor.subtitle,
    bullets: roadmapItems,
    highlight:
      "This roadmap is our sequence contract: we move step-by-step so each section has context before complexity.",
    speakerNote:
      `${anchor.roadmapLead} Use this as a quick map before Session 1 starts. Tell learners where they are now, where they are going next, and what success looks like by the end of the day.`,
  });

  slides.push({
    type: "content",
    title: anchor.anchorTitle,
    subtitle: "Keep this structure in mind across all sections",
    diagram: anchor.anchorDiagram,
    bullets: anchor.anchorBullets,
    highlight: anchor.anchorHighlight,
    speakerNote:
      "Revisit this anchor whenever attention drops or a section feels dense. It recenters the class and keeps progression logical.",
  });

  const visualExample = getModuleVisualExample(flow.moduleId);
  if (visualExample) {
    slides.push({
      type: "content",
      title: visualExample.title,
      subtitle: visualExample.subtitle,
      cards: visualExample.cards,
      diagram: visualExample.diagram,
      imageUrl: visualExample.imageUrl,
      imageAlt: visualExample.imageAlt,
      highlight: visualExample.highlight,
      speakerNote:
        "Use this as the concrete classroom example before going deeper into the session content. Point to the diagram first, then connect each card back to the learner workbook.",
    });
  }

  /* 3 — Sessions */
  for (const session of sessions) {
    const sessionShortTitle = session.title.replace(/^Session\s*\d+\s*:\s*/i, "").trim();

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
        "Session opening script:\n" +
        "• Set context: what this session solves in the workplace.\n" +
        "• Walk through outcomes and define success criteria clearly.\n" +
        "• Prime participation: ask 2 learners to share prior experience.\n\n" +
        `Ask: "What do you already know about ${sessionShortTitle || session.title}?"\n` +
        "Visual-first strategy:\n" +
        "• Start with a board map (concept map or process flow) before text-heavy explanation.\n" +
        "• Keep referring back to the map so visual learners can anchor each new point.",
    });

    /* Sections → content slides */
    const sessionSections = session.sections ?? [];
    for (let i = 0; i < sessionSections.length; i++) {
      const section = sessionSections[i];
      const nextSection = sessionSections[i + 1];
      slides.push(
        ...sectionToSlides(
          section,
          session.label,
          sessionShortTitle || session.label,
          flow.moduleId,
          session.outcomes,
          nextSection?.title
        )
      );

      // Module-specific insertions are handled inside each module's own deck builder.
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
  return programmeBriefingSlides as Slide[];
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

  const visualExample = getModuleVisualExample(mod.id);
  if (visualExample) {
    slides.push({
      type: "content",
      title: visualExample.title,
      subtitle: visualExample.subtitle,
      cards: visualExample.cards,
      diagram: visualExample.diagram,
      imageUrl: visualExample.imageUrl,
      imageAlt: visualExample.imageAlt,
      highlight: visualExample.highlight,
      speakerNote:
        `Use this worked example to make the topic concrete before moving into the detailed content points.`,
    });
  }

  /* 3 ── Content slides — group into chunks of 3 items */
  // Projector-friendly pacing: fewer bullets per slide improves readability at distance.
  const chunkSize = 2;
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
  /**
   * When provided, tapping "Begin next unit" calls this instead of navigating.
   * Use from AppLayout to swap the presentation inline so the remote
   * connection stays alive (same session code, new module slides).
   */
  onLaunchUnit?: (unitId: string) => void;
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
  onLaunchUnit,
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

  /* Reset to slide 1 whenever the module/mode changes (e.g. inline unit swap) */
  useEffect(() => {
    setCurrent(0);
    setQuizStates({});
    setAnimating(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, flow?.moduleId, mod?.id]);

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
  const launchUnitRef = useRef<() => void>(() => {});
  const nextUnitIdRef = useRef(nextUnitId);
  const nextUnitTitleRef = useRef(nextUnitTitle);

  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { slidesRef.current = slides; }, [slides]);
  useEffect(() => { nextUnitIdRef.current = nextUnitId; nextUnitTitleRef.current = nextUnitTitle; }, [nextUnitId, nextUnitTitle]);
  // goRef, jumpToRef, and launchUnitRef are synced after their functions are declared below

  const buildPayload = useCallback((): SlideStatePayload => {
    const ss = slidesRef.current;
    const i = currentRef.current;
    const s = ss[i];
    const uid = nextUnitIdRef.current;
    const utitle = nextUnitTitleRef.current;
    return {
      index: i,
      total: ss.length,
      type: s?.type ?? "content",
      title: s?.title ?? "",
      subtitle: s?.subtitle,
      badge: s?.badge,
      sessionLabel: s?.sessionLabel,
      speakerNote: formatPresenterNote(s, i, ss.length),
      nextTitle: ss[i + 1]?.title,
      prevTitle: i > 0 ? ss[i - 1]?.title : undefined,
      isQuiz: s?.type === "quiz",
      isLastSlide: i === ss.length - 1,
      nextUnitId: uid,
      nextUnitLabel: uid
        ? (utitle ? `Begin: ${utitle}` : "Open next unit")
        : undefined,
    };
  }, [])

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
        else if (payload?.action === "launch-unit") launchUnitRef.current();
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

  const buildOnScreenSummary = (s?: Slide): string => {
    if (!s) return "";
    const lines: string[] = [];
    if (s.subtitle) lines.push(`Subtitle: ${s.subtitle}`);
    if (s.bullets && s.bullets.length > 0) {
      lines.push("On-screen content:");
      s.bullets.forEach((item, idx) => lines.push(`${idx + 1}. ${item}`));
    }
    if (s.phaseCards && s.phaseCards.length > 0) {
      lines.push(`Phase cards: ${s.phaseCards.join(" | ")}`);
    }
    if (s.cards && s.cards.length > 0) {
      lines.push(`Cards: ${s.cards.join(" | ")}`);
    }
    if (s.highlight) lines.push(`Highlight: ${s.highlight}`);
    return lines.join("\n");
  };

  const formatPresenterNote = (s: Slide | undefined, index: number, totalSlides: number): string | undefined => {
    if (!s) return undefined;
    const header = `Slide ${index + 1} of ${totalSlides}\nTitle: ${s.title}`;
    const facilitatorScript = s.speakerNote?.trim();

    return [
      header,
      facilitatorScript ? `\nFacilitator notes:\n${facilitatorScript}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const presenterNote = formatPresenterNote(slide, current, total);

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
    if (onLaunchUnit) {
      // Stay in presentation mode — caller swaps the module inline
      onLaunchUnit(nextUnitId);
    } else {
      onClose();
      navigate(`${routePrefix}/${nextUnitId}`);
    }
  };
  // Keep launchUnitRef fresh so the channel handler can call it
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { launchUnitRef.current = handleNavigateToUnit; }, [nextUnitId, onLaunchUnit]);

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
              <p className="text-white/70 text-sm md:text-base uppercase tracking-widest font-semibold mb-2">
                Slide {current + 1}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm mb-5">
                {mode === "briefing" ? <GraduationCap size={14} /> : <Lightbulb size={14} />}
                {mode === "briefing"
                  ? "Programme Orientation · SAQA 78965 · NQF Level 4"
                  : `SAQA ${mod?.id}  ·  NQF Level 4  ·  ${mod?.credits} Credits`}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="text-white/70 text-lg md:text-xl mb-5">{slide.subtitle}</p>
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
              <p className="text-white/70 text-sm md:text-base uppercase tracking-widest font-semibold mb-2">
                Slide {current + 1}
              </p>
              <p className="text-sm uppercase tracking-widest font-semibold mb-2 text-purple-300/90">
                {slide.subtitle}
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 leading-snug">
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
                      <span className="text-base md:text-lg lg:text-xl leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {qState.revealed && slide.quizExplanation && (
                <div className="flex gap-3 p-4 rounded-xl border border-purple-500/40 bg-purple-500/10">
                  <Lightbulb size={16} className="shrink-0 mt-0.5 text-purple-300" />
                  <p className="text-base md:text-lg text-white/85 leading-relaxed">{slide.quizExplanation}</p>
                </div>
              )}
              {!qState.revealed && (
                <p className="text-white/50 text-sm mt-4">Select an answer to reveal the explanation.</p>
              )}
            </div>
          )}

          {/* ── Regular content slides (objectives, content, activity, summary) */}
          {slide.type !== "title" && slide.type !== "quiz" && (
            <div className="max-w-4xl w-full mx-auto">
              <p className="text-white/70 text-sm md:text-base uppercase tracking-widest font-semibold mb-2">
                Slide {current + 1}
              </p>
              {slide.subtitle && (
                <p className={`text-sm uppercase tracking-widest font-semibold mb-2 ${config.accent.split(" ")[0]}`}>
                  {slide.subtitle}
                </p>
              )}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-snug">
                {slide.title}
              </h2>

              {slide.bullets && slide.bullets.length > 0 && (
                <ul className="space-y-3 md:space-y-4 mb-4">
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
                        <span className="text-white/95 text-lg md:text-xl lg:text-2xl leading-snug">
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

              {slide.diagram && (
                <div className="mb-4 p-5 rounded-xl border border-white/30 bg-black/40 overflow-x-auto">
                  <pre className="text-sm md:text-base text-white/95 leading-relaxed whitespace-pre font-mono">
                    {slide.diagram}
                  </pre>
                </div>
              )}

              {slide.imageUrl && (
                <div className="mb-4 rounded-xl border border-white/30 bg-black/40 p-2">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt ?? slide.title}
                    className="w-full max-h-[360px] object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              )}

              {slide.body && (
                <p className="text-white/85 text-base md:text-lg lg:text-xl leading-relaxed mb-4">{slide.body}</p>
              )}

              {slide.cards && slide.cards.length > 0 && (
                <div className="mb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slide.cards.map((card, i) => (
                    <div
                      key={`${card}-${i}`}
                      className="rounded-xl border border-white/30 bg-white/10 px-4 py-4"
                    >
                      <p className="text-base md:text-lg font-semibold text-white">{card}</p>
                    </div>
                  ))}
                </div>
              )}

              {!slide.cards && slide.phaseCards && slide.phaseCards.length > 0 && (
                <div className="mb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slide.phaseCards.map((phase, i) => (
                    <div
                      key={`${phase}-${i}`}
                      className="rounded-xl border border-white/30 bg-white/10 px-4 py-3"
                    >
                      <p className="text-sm uppercase tracking-wide text-white/60 mb-1">Step {i + 1}</p>
                      <p className="text-base md:text-lg font-semibold text-white">{phase}</p>
                    </div>
                  ))}
                </div>
              )}

              {slide.highlight && (
                <div className={`flex gap-3 p-4 rounded-xl border bg-white/5 ${config.accent}`}>
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed opacity-95">{slide.highlight}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Speaker notes panel */}
      {isAdmin && notesOpen && presenterNote && (
        <div className="flex-shrink-0 bg-black/90 border-t border-white/10 px-6 md:px-16 py-3 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Users size={13} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">
              Facilitator Notes
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{presenterNote}</p>
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
