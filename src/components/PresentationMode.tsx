import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
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
   Flow-based (session-structured) slide builders
───────────────────────────────────────────────────────────────────────────── */

/** Converts one LessonSection into 1+ content slides, chunking bullets to ≤5 */
function sectionToSlides(
  section: LessonSection,
  sessionLabel: string,
  sessionShortTitle: string
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

  const baseNote =
    (speakerExtras.length > 0 ? `Sub-topics: ${speakerExtras.join(" | ")}. ` : "") +
    "Expand on each point using the Learner Guide. Ask learners to annotate their workbooks as you present.";

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

  /* 1 — Title */
  if (mod) {
    slides.push({
      type: "title",
      title: mod.title,
      subtitle: `SAQA ${mod.id}  ·  Block ${mod.block}  ·  ${mod.days}  ·  ${mod.credits} Credits`,
      body: mod.type,
      speakerNote: `Welcome to ${mod.title} (SAQA ${mod.id}). Remind learners to sign the attendance register and ensure workbooks are distributed before we begin.`,
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
    speakerNote: `Walk through the unit purpose and each learning outcome clearly. Ask: "Which of these topics do you already know something about?" This activates prior knowledge and shows where to pace more carefully.`,
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
      speakerNote: `Starting ${session.label}. ${session.summary}. Walk through the session outcomes before diving into content. Ask: "What do you already know about this topic?"`,
    });

    /* Sections → content slides */
    for (const section of session.sections ?? []) {
      slides.push(...sectionToSlides(section, session.label, session.label));
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
        "Day 10 is a PoE consolidation day — no new content; organise evidence and prepare for Block 3",
        "Each unit ends with a formative quiz (self-check) and an assessment task for your Portfolio of Evidence",
      ],
      highlight:
        "56 credits are delivered across these 15 days. The remaining credits toward the full 165-credit qualification are achieved through workplace evidence in your PoE.",
      speakerNote:
        "Distribute the printed module roadmap now if available. Run through the colour-coded block overview briefly — this helps learners see the sequencing logic.",
    },
    {
      type: "content",
      title: "How the SA&D Course Unfolds",
      subtitle: "Every lecture builds on the analytical foundations of Day 1",
      bullets: [
        "L1 Today — Introduction to IS: analyst roles, SDLC, IS components, information-gathering techniques",
        "L2 — Systems Project Management: scoping, WBS, scheduling — begins where your feasibility study ends",
        "L3 — Requirements Modelling: JAD, RAD, Agile — deepening the fact-finding plan from Session 1",
        "L4 — Data & Process Modelling: levelled DFDs and physical design from today's context diagrams",
        "L5 & L6 — Object Modelling: full UML from today's OO analysis foundations",
        "L7 — Data Design: ERDs and normalisation from today's data identification work",
        "L8 — Development Strategies: build-vs-buy decision from today's analyst recommendation",
        "L9 — UI Design: screens, forms and validation rules from today's requirements specification",
        "L10 — System Support & Security: maintenance and audits from today's documentation",
      ],
      highlight:
        "Day 1 is the trunk of the tree. Every lecture that follows is a branch growing from the analytical roots established in Session 1.",
      speakerNote:
        "Show this slide AFTER the module roadmap. It answers the question learners always have: 'why does analysis come first?' This slide makes the dependency chain visible. Refer back to it at the start of each subsequent lecture.",
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
        "✓  You know your 10-module roadmap and how each SA&D lecture connects to Day 1",
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

  /* 1 ── Title slide */
  slides.push({
    type: "title",
    title: mod.title,
    subtitle: `SAQA ${mod.id}  ·  Block ${mod.block}  ·  ${mod.days}  ·  ${mod.credits} Credits`,
    body: mod.type,
    speakerNote:
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sessionCode = useMemo(() => generateSessionCode(), []);
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
      .subscribe();

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
        if (sessionPickerOpen) setSessionPickerOpen(false);
        else onClose();
      }
      if (e.key.toLowerCase() === "n" && isAdmin) setNotesOpen((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, onClose, isAdmin]);

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
        className={`flex-1 bg-gradient-to-br ${config.bg} flex flex-col overflow-hidden`}
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

        <div
          className={`relative flex-1 flex flex-col justify-center px-6 md:px-14 lg:px-24 py-3 transition-all duration-200 ease-in-out ${contentClass}`}
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

      {/* ── Bottom navigation */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur border-t border-white/10 gap-3">
        {/* Dot nav */}
        <div className="flex gap-1.5 overflow-x-auto max-w-[40%]">
          {slides.map((s, i) => {
            const isCurrent = i === current;
            const isCurrentSess = s.sessionLabel && s.sessionLabel === currentSessionLabel;
            return (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                className={`shrink-0 rounded-full transition-all duration-200 ${
                  isCurrent
                    ? "w-6 h-2 bg-white"
                    : s.isSessionStart
                    ? "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                    : isCurrentSess
                    ? "w-2 h-2 bg-white/45 hover:bg-white/65"
                    : "w-2 h-2 bg-white/18 hover:bg-white/40"
                }`}
                title={s.isSessionStart ? `▶ ${s.title ?? s.sessionLabel}` : s.title}
              />
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={() => go("prev")}
            disabled={current === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors border border-white/15"
          >
            <ChevronLeft size={16} /> Prev
          </button>

          {isLastSlide ? (
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
          ) : (
            <button
              onClick={() => go("next")}
              disabled={nextBlocked}
              title={nextBlocked ? "Answer the question to continue" : undefined}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {nextBlocked ? "Answer to continue" : "Next"} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-16 right-5 text-white/20 text-xs pointer-events-none select-none">
        ← → navigate · Esc exit{isAdmin ? " · N notes" : ""}
      </div>
    </div>
  );
}
