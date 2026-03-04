import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { moduleDownloadsById } from "@/data/moduleDownloads";
import { useModuleFlow } from "@/hooks/useModuleFlow";
import { useAuth } from "@/hooks/useAuth";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Clock, Award, BookOpen, Target, FileText, Download, CheckCircle2, Circle, ChevronRight, DatabaseZap, RefreshCw, Play } from "lucide-react";
import { PresentationMode } from "@/components/PresentationMode";
import { AssessmentForm, type AssessmentPayload } from "@/components/AssessmentForm";

interface ContentLinks {
  modules?: Record<string, Array<{ label: string; href: string }>>;
}

interface ExtractedIndex {
  files: Array<{ source_path: string; file_name?: string }>;
}

interface ExtractedDoc {
  file_name: string;
  sections: Array<{ heading: string; text: string }>;
  raw_text?: string;
  download_href?: string;
}

interface MarkdownDoc {
  file_name: string;
  raw_text: string;
  sections: Array<{ heading: string; text: string }>;
  download_href?: string;
}

function docxToMarkdownHref(href: string) {
  return href.replace(/\.docx$/i, ".md");
}

function encodePathSegments(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function getDisplayDocName(fileName: string) {
  return fileName.replace(/\.docx$/i, "").replace(/\.md$/i, "").replace(/\.json$/i, "");
}

function isLearnerGuideFile(fileName: string) {
  const normalized = fileName.toLowerCase();
  return normalized.includes("learner guide") || normalized.includes("leaner guide");
}

function getDocCategory(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("learner guide")) return "Learner Guide";
  if (normalized.includes("learner workbook")) return "Workbook";
  if (normalized.includes("assessment") || normalized.includes("summative")) return "Assessment";
  if (normalized.includes("facilitator")) return "Facilitator Guide";
  return "Study Document";
}

function isLearnerGuideLabel(label: string) {
  return label.toLowerCase().includes("learner guide");
}

function isAssessmentTaskLabel(label: string) {
  const normalized = label.toLowerCase();
  return normalized.includes("summative assessment") || normalized.includes("practical assessment") || normalized.includes("practical assesement");
}

function isWorkbookLabel(label: string) {
  return label.toLowerCase().includes("workbook");
}

function isFacilitatorLabel(label: string) {
  return label.toLowerCase().includes("facilitator");
}

function isRestrictedForLearner(label: string) {
  const normalized = label.toLowerCase();
  return normalized.includes("facilitator") || normalized.includes("memo") || normalized.includes("memorandum") || normalized.includes("assessment guide") || normalized.includes("assesement guide") || normalized.includes("assessement guide");
}

function getLeafName(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] ?? path;
}

function normalizeDocName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.(docx|md|json)$/i, "")
    .replace(/[^a-z0-9]/g, "");
}

function toSafeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot !== -1 ? name.slice(dot) : "";
  const base = dot !== -1 ? name.slice(0, dot) : name;
  const safeBase = base.replace(/[^a-z0-9-_]/gi, "-").replace(/-+/g, "-").toLowerCase();
  return `${safeBase || "submission"}${ext}`;
}

function stripMarkdownText(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeLearnerGuideMarkdown(markdown: string) {
  let cleaned = markdown.replace(/\r\n/g, "\n");

  cleaned = cleaned.replace(/\*\*Learner Information:?\*\*[\s\S]*?(?=#\s*Learner Guide Introduction)/i, "");
  cleaned = cleaned.replace(/\*\*Copyright\*\*[\s\S]*?(?=\n#\s|$)/i, "");
  cleaned = cleaned.replace(/#\s*Key to Icons[\s\S]*?(?=#\s*Learner Guide Introduction|#\s*SESSION|#\s*Learning|$)/i, "");

  cleaned = cleaned.replace(/!\[[^\]]*\]\([^\)]+\)/g, "");
  cleaned = cleaned.replace(/^\*\*\s*\*\*$/gm, "");

  const lines = cleaned.split("\n").map((line) => {
    const trimmed = line.trim();

    if (/^\|\s*:?-{2,}.*\|\s*$/i.test(trimmed)) {
      return "";
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .split("|")
        .map((cell) => stripMarkdownText(cell))
        .filter((cell) => cell.length > 0);

      if (cells.length === 0) return "";
      if (cells.length === 1) return cells[0];

      const [left, right] = cells;
      if (!left && !right) return "";
      if (!right) return left;
      return `- **${left}**: ${right}`;
    }

    return line;
  });

  cleaned = lines.join("\n");

  cleaned = cleaned.replace(/^\s*-\s*$/gm, "");
  cleaned = cleaned.replace(/^\s*Learning Unit\s*\d+\s*$/gim, "## Learning Unit");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

  return cleaned;
}

function sanitizeGenericMarkdown(markdown: string) {
  let cleaned = markdown.replace(/\r\n/g, "\n");

  cleaned = cleaned.replace(/!\[[^\]]*\]\([^\)]+\)/g, "");
  cleaned = cleaned.replace(/^\s*\|\s*$/gm, "");
  cleaned = cleaned.replace(/^\s*\*\*\s*\*\*\s*$/gm, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

function extractLearnerGuideHeader(markdown: string, fallbackTitle: string, fallbackSaqa: string) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized
    .split("\n")
    .map((line) => line.replace(/\|/g, "").replace(/\*\*/g, "").trim())
    .filter((line) => line.length > 0);

  const programmeLine = lines.find((line) => /FURTHER EDUCATION AND TRAINING CERTIFICATE/i.test(line));
  const idLine = lines.find((line) => /ID\s*\d+.*LEVEL.*CREDITS/i.test(line));
  const saqaLine = lines.find((line) => /SAQA\s*:\s*\d+/i.test(line));
  const guideLabel = lines.find((line) => /LEARNER GUIDE/i.test(line));
  const moduleLine = lines.find((line) => !/LEARNER GUIDE|SAQA\s*:|FURTHER EDUCATION AND TRAINING CERTIFICATE|ID\s*\d+/i.test(line) && line.length > 12);

  return {
    programme: programmeLine ?? "FURTHER EDUCATION AND TRAINING CERTIFICATE: INFORMATION TECHNOLOGY: SYSTEMS DEVELOPMENT",
    programmeMeta: idLine ?? "ID 78965 LEVEL 4 – CREDITS 165",
    guide: guideLabel ?? "LEARNER GUIDE",
    saqa: saqaLine ?? `SAQA: ${fallbackSaqa}`,
    moduleTitle: moduleLine ?? fallbackTitle.toUpperCase(),
  };
}

function buildModuleQuiz(moduleTitle: string, objectives: string[], activities: string[]) {
  const objective1 = objectives[0] ?? `Understand key principles in ${moduleTitle}`;
  const objective2 = objectives[1] ?? `Apply practical skills related to ${moduleTitle}`;
  const activity1 = activities[0] ?? "Complete guided practical activities";

  return [
    {
      id: 0,
      question: "What should you do first in this module?",
      options: [
        "Read the learner guide and module overview",
        "Open memo documents first",
        "Skip directly to final assessment",
      ],
      answer: "Read the learner guide and module overview",
    },
    {
      id: 1,
      question: "Which outcome best matches this module?",
      options: [objective1, objective2, "Ignore module objectives"],
      answer: objective1,
    },
    {
      id: 2,
      question: "What is the best practice before assessment?",
      options: [activity1, "Only read assessment memo", "Submit without practice"],
      answer: activity1,
    },
  ];
}

const staticQuizByModule: Record<
  string,
  {
    id: number;
    question: string;
    options: string[];
    answer: string;
  }[]
> = {
  /* ── US 14924 — Information Systems Analysis ── */
  "14924": [
    {
      id: 0,
      question: "Which phase of the SDLC involves studying the existing system and identifying user requirements?",
      options: [
        "Analysis phase",
        "Design phase",
        "Development phase",
      ],
      answer: "Analysis phase",
    },
    {
      id: 1,
      question: "Which fact-finding technique involves watching users perform their tasks in their actual work environment?",
      options: [
        "Observation",
        "Questionnaire",
        "Document review",
      ],
      answer: "Observation",
    },
    {
      id: 2,
      question: "What is the primary role of a systems analyst compared to a software developer?",
      options: [
        "A systems analyst investigates problems and recommends solutions; a developer writes the code to implement them",
        "A systems analyst writes code; a developer analyses requirements",
        "They perform the same tasks at different stages of the project",
      ],
      answer: "A systems analyst investigates problems and recommends solutions; a developer writes the code to implement them",
    },
  ],
  /* ── US 14920 — Team Collaboration and Problem Solving ── */
  "14920": [
    {
      id: 0,
      question: "What is the Nominal Group Technique (NGT)?",
      options: [
        "A structured approach where members independently generate ideas then the group discusses and ranks them",
        "A method where the team leader decides all ideas alone",
        "A technique for writing software requirements",
      ],
      answer: "A structured approach where members independently generate ideas then the group discusses and ranks them",
    },
    {
      id: 1,
      question: "In the Problem-Solving Process, what step comes directly after 'Define the Problem'?",
      options: [
        "Implement a Solution",
        "Build the Team",
        "Plan the process",
      ],
      answer: "Implement a Solution",
    },
    {
      id: 2,
      question: "Which behaviour is NOT a characteristic of an effective team member?",
      options: [
        "Keeping all information to themselves",
        "Being flexible and adaptable",
        "Taking initiative when needed",
      ],
      answer: "Keeping all information to themselves",
    },
  ],
  /* ── US 14918 — Programming Principles Introduction ── */
  "14918": [
    {
      id: 0,
      question: "Which algorithm control structure repeats a block of code while a given condition remains true?",
      options: [
        "Iteration (loop)",
        "Sequence",
        "Selection (if/else)",
      ],
      answer: "Iteration (loop)",
    },
    {
      id: 1,
      question: "Which data type is most appropriate to store a student's mark as a whole number?",
      options: [
        "Integer",
        "Real (float)",
        "Boolean",
      ],
      answer: "Integer",
    },
    {
      id: 2,
      question: "What is the difference between validation and verification?",
      options: [
        "Validation checks that data meets defined rules (e.g. range); verification confirms data was entered correctly by comparing two inputs",
        "Validation compiles the code; verification tests it",
        "They mean exactly the same thing",
      ],
      answer: "Validation checks that data meets defined rules (e.g. range); verification confirms data was entered correctly by comparing two inputs",
    },
  ],
  /* ── US 14927 — Apply Problem-Solving Strategies ── */
  "14927": [
    {
      id: 0,
      question: "In the Problem-Solving Cycle, what comes immediately after identifying the problem?",
      options: [
        "Analyse the problem",
        "Implement the solution",
        "Define success criteria",
      ],
      answer: "Analyse the problem",
    },
    {
      id: 1,
      question: "Which tool visually maps contributing factors to a workplace problem using categories like People, Process, Resources, and Environment?",
      options: [
        "Fishbone (Ishikawa) diagram",
        "Decision table",
        "Data Flow Diagram (DFD)",
      ],
      answer: "Fishbone (Ishikawa) diagram",
    },
    {
      id: 2,
      question: "What is the purpose of creating an implementation plan after choosing a solution?",
      options: [
        "To define the tasks, timelines, and resources required to carry out the solution",
        "To document the original problem only",
        "To select a different problem to solve",
      ],
      answer: "To define the tasks, timelines, and resources required to carry out the solution",
    },
  ],
  /* ── US 14915 — Design a Computer Program to Specification ── */
  "14915": [
    {
      id: 0,
      question: "What is the purpose of desk-checking a program design?",
      options: [
        "To manually trace through the logic step-by-step to find errors before coding begins",
        "To test the compiled and running program",
        "To write the user manual",
      ],
      answer: "To manually trace through the logic step-by-step to find errors before coding begins",
    },
    {
      id: 1,
      question: "Which design diagram shows the hierarchical breakdown of a program into modules and sub-modules?",
      options: [
        "Structure diagram",
        "Data Flow Diagram",
        "Decision table",
      ],
      answer: "Structure diagram",
    },
    {
      id: 2,
      question: "What is a user-defined function in programming?",
      options: [
        "A reusable block of code created by the programmer to perform a specific task, called by name whenever needed",
        "A built-in function provided by the programming language runtime",
        "A function that only the end-user, not the programmer, can run",
      ],
      answer: "A reusable block of code created by the programmer to perform a specific task, called by name whenever needed",
    },
  ],
  /* ── US 14910 — Apply Programming Principles ── */
  "14910": [
    {
      id: 0,
      question: "According to Learning Unit 1, what is the main purpose of Unit Standard 14910?",
      options: [
        "To apply the principles of computer programming in systems development",
        "To design and install computer hardware",
        "To manage financial accounting systems for a company",
      ],
      answer: "To apply the principles of computer programming in systems development",
    },
    {
      id: 1,
      question: "Which prior learning is assumed before starting this unit standard?",
      options: [
        "Fundamental mathematics and English at least NQF Level 2 plus basic PC competency and knowledge of programming principles",
        "Advanced calculus and network engineering at university level",
        "No prior knowledge is required; this unit is fully introductory",
      ],
      answer: "Fundamental mathematics and English at least NQF Level 2 plus basic PC competency and knowledge of programming principles",
    },
    {
      id: 2,
      question: "In the discussion of Boolean (logical) data, which of the following are mentioned as equivalent ways of showing TRUE and FALSE?",
      options: [
        "YES / NO",
        "ON / OFF",
        "Ticked / unticked checkbox",
        "All of the above",
      ],
      answer: "All of the above",
    },
  ],
  /* ── US 14933 — Web Scripting ── */
  "14933": [
    {
      id: 0,
      question: "Which language is responsible for the visual layout and styling of a web page?",
      options: [
        "CSS (Cascading Style Sheets)",
        "HTML",
        "JavaScript",
      ],
      answer: "CSS (Cascading Style Sheets)",
    },
    {
      id: 1,
      question: "What does the Document Object Model (DOM) allow JavaScript to do?",
      options: [
        "Dynamically access and manipulate the content, structure, and style of a web page",
        "Compile web scripts into machine code",
        "Connect the web page directly to a database",
      ],
      answer: "Dynamically access and manipulate the content, structure, and style of a web page",
    },
    {
      id: 2,
      question: "What is the core principle of responsive web design?",
      options: [
        "The page layout adapts automatically to different screen sizes and devices",
        "A website that loads and responds quickly to user clicks",
        "A design that requires no CSS styling",
      ],
      answer: "The page layout adapts automatically to different screen sizes and devices",
    },
  ],
  /* ── US 14908 — Testing IT Systems ── */
  "14908": [
    {
      id: 0,
      question: "What is the key difference between black-box and white-box testing?",
      options: [
        "Black-box tests functionality without knowledge of internal code; white-box testing examines the internal logic and structure",
        "Black-box testing is done by clients; white-box testing is done after deployment",
        "They are the same testing method with different names",
      ],
      answer: "Black-box tests functionality without knowledge of internal code; white-box testing examines the internal logic and structure",
    },
    {
      id: 1,
      question: "A test case must specify:",
      options: [
        "The input data, expected output, and steps to execute a specific test scenario",
        "Only the programming language used to build the system",
        "The hardware specifications of the server",
      ],
      answer: "The input data, expected output, and steps to execute a specific test scenario",
    },
    {
      id: 2,
      question: "Which type of testing verifies that the complete integrated system meets its specified requirements?",
      options: [
        "System (acceptance) testing",
        "Unit testing",
        "Regression testing",
      ],
      answer: "System (acceptance) testing",
    },
  ],
  /* ── US 14919 — Resolve User Problems ── */
  "14919": [
    {
      id: 0,
      question: "According to the troubleshooting methodology, what should you do FIRST when a user reports a problem?",
      options: [
        "Gather information and define the problem clearly",
        "Immediately reinstall the software",
        "Escalate directly to senior support",
      ],
      answer: "Gather information and define the problem clearly",
    },
    {
      id: 1,
      question: "Why is documenting a resolved IT problem important?",
      options: [
        "It creates a knowledge base that helps resolve similar issues faster in the future",
        "Documentation is only required for hardware problems",
        "It is optional if the user confirms they are satisfied",
      ],
      answer: "It creates a knowledge base that helps resolve similar issues faster in the future",
    },
    {
      id: 2,
      question: "Which communication principle is most important when dealing with a frustrated user?",
      options: [
        "Listen actively and empathise with the user before proposing a solution",
        "Use as much technical jargon as possible to sound credible",
        "Fix the technical issue first and explain it only if asked",
      ],
      answer: "Listen actively and empathise with the user before proposing a solution",
    },
  ],
  /* ── US 120379 — Work as Project Team Member ── */
  "120379": [
    {
      id: 0,
      question: "What is the primary responsibility of a project manager in a team?",
      options: [
        "To plan, coordinate, monitor progress, and ensure the project meets its objectives within scope, time, and budget",
        "To write all the code for the project",
        "To approve the project budget only",
      ],
      answer: "To plan, coordinate, monitor progress, and ensure the project meets its objectives within scope, time, and budget",
    },
    {
      id: 1,
      question: "In agile project management, what does a sprint backlog contain?",
      options: [
        "The specific tasks the team commits to completing during the current sprint",
        "A record of the entire project history",
        "Only the defects found during testing",
      ],
      answer: "The specific tasks the team commits to completing during the current sprint",
    },
    {
      id: 2,
      question: "What does 'delivering within constraints' mean in a project context?",
      options: [
        "Completing the project within the agreed scope, time, and budget limitations",
        "Ignoring deadlines in order to guarantee quality",
        "Working without a project plan",
      ],
      answer: "Completing the project within the agreed scope, time, and budget limitations",
    },
  ],
};

function toMarkdownBody(doc: ExtractedDoc | MarkdownDoc) {
  if (doc.raw_text && doc.raw_text.trim().length > 0) {
    if (isLearnerGuideFile(doc.file_name)) {
      return sanitizeLearnerGuideMarkdown(doc.raw_text);
    }
    return sanitizeGenericMarkdown(doc.raw_text);
  }

  const sectionMarkdown = doc.sections
    .map((section) => {
      const heading = section.heading?.trim();
      const body = section.text?.trim() ?? "";
      if (!heading) return body;
      return `## ${heading}\n\n${body}`;
    })
    .join("\n\n");

  if (isLearnerGuideFile(doc.file_name)) {
    return sanitizeLearnerGuideMarkdown(sectionMarkdown);
  }

  return sanitizeGenericMarkdown(sectionMarkdown);
}

function hasDocForCategory(downloads: Array<{ label: string; href: string }>, category: "guide" | "workbook" | "assessment") {
  if (category === "guide") {
    return downloads.some((item) => item.label.toLowerCase().includes("learner guide"));
  }
  if (category === "workbook") {
    return downloads.some((item) => item.label.toLowerCase().includes("workbook"));
  }
  return downloads.some((item) => {
    const label = item.label.toLowerCase();
    return label.includes("assessment") || label.includes("summative");
  });
}

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role, user } = useAuth();
  const {
    progressMap,
    markGuideCompleted,
    markQuizPassed,
    recordSubmission,
    markAssessmentSubmitted,
  } = useModuleProgress();
  const {
    flow: moduleLessonFlow,
    source: flowSource,
    loading: flowLoading,
    upsertFlow,
    seedAllFlows,
  } = useModuleFlow(id);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const mod = modules.find((m) => m.id === id);
  const navigate = useNavigate();
  const modIndex = modules.findIndex((m) => m.id === id);
  const nextModule = modIndex >= 0 && modIndex < modules.length - 1 ? modules[modIndex + 1] : undefined;
  const [jsonLinksByModule, setJsonLinksByModule] = useState<ContentLinks["modules"]>({});
  const [studyDocs, setStudyDocs] = useState<Array<ExtractedDoc | MarkdownDoc>>([]);
  const [loadingStudyDocs, setLoadingStudyDocs] = useState(false);
  const [activeDocName, setActiveDocName] = useState<string>("");
  const [assessmentUnlocked, setAssessmentUnlocked] = useState(false);
  const [guideCompleted, setGuideCompleted] = useState(false);
  const [workspaceView, setWorkspaceView] = useState<"guide" | "quiz" | "assessment">("guide");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizEnabled, setQuizEnabled] = useState(true);
  const [guidePageIndex, setGuidePageIndex] = useState(0);
  const [guideMode, setGuideMode] = useState<"intro" | "sessions">("intro");
  const [adminDocCategory, setAdminDocCategory] = useState<"guide" | "workbook" | "facilitator" | "assessment">("guide");
  const [isPresenting, setIsPresenting] = useState(false);
  const [sessionIndex, setSessionIndex] = useState(0);
  // Tracks the highest session index ever visited — never decrements when learner goes back
  const [highestSessionReached, setHighestSessionReached] = useState(-1);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionPath, setSubmissionPath] = useState<string>("");
  const [submissionUploadedAt, setSubmissionUploadedAt] = useState<string>("");
  const [isUploadingSubmission, setIsUploadingSubmission] = useState(false);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [assessmentSubmitMessage, setAssessmentSubmitMessage] = useState<string>("");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [assessmentChecklist, setAssessmentChecklist] = useState({ read: false, criteria: false, own: false });
  const [onlineAnswers, setOnlineAnswers] = useState<Record<number, string>>({});
  const [pendingSubmissionText, setPendingSubmissionText] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  useEffect(() => {
    const loadContentLinks = async () => {
      try {
        const response = await fetch("/docs/SAQA_78965_CET_Training/content.links.json");
        if (!response.ok) return;
        const payload = (await response.json()) as ContentLinks;
        setJsonLinksByModule(payload.modules ?? {});
      } catch {
        setJsonLinksByModule({});
      }
    };

    loadContentLinks();
  }, []);

  useEffect(() => {
    if (!id || role !== "learner") {
      setAssessmentUnlocked(false);
      setGuideCompleted(false);
      return;
    }

    const prog = progressMap[id];
    setAssessmentUnlocked(prog?.assessment_unlocked ?? false);
    setGuideCompleted(prog?.guide_completed ?? false);
  }, [id, role, progressMap]);

  useEffect(() => {
    const loadStudyContent = async () => {
      if (!id) {
        setStudyDocs([]);
        return;
      }

      setLoadingStudyDocs(true);

      try {
        const mappedUnit = id === "14933" ? "14930" : id;
        const allModuleDownloads = (jsonLinksByModule?.[id] ?? moduleDownloadsById[id] ?? []).filter((item) =>
          item.href.includes(`/US ${mappedUnit}/`)
        );

        const learnerVisibleDownloads = allModuleDownloads.filter((download) => {
          if (isRestrictedForLearner(download.label)) return false;
          if (isLearnerGuideLabel(download.label)) return true;
          // Workbook hidden from learner view — guide + quiz + summative assessment only
          return assessmentUnlocked && isAssessmentTaskLabel(download.label);
        });

        const moduleDownloads = role === "learner" ? learnerVisibleDownloads : allModuleDownloads;

        const markdownDocs = await Promise.all(
          moduleDownloads.map(async (download) => {
            const markdownHref = docxToMarkdownHref(download.href);
            const response = await fetch(markdownHref);
            if (!response.ok) {
              return null;
            }

            const markdown = await response.text();
            const cleaned = markdown.replace(/\r\n/g, "\n").trim();
            if (!cleaned) {
              return null;
            }

            return {
              file_name: markdownHref.split("/").pop() ?? download.label,
              raw_text: cleaned,
              sections: [{ heading: "Document", text: cleaned }],
              download_href: download.href,
            } as MarkdownDoc;
          })
        );

        const directMarkdownDocs = markdownDocs.filter((doc): doc is MarkdownDoc => doc !== null);
        if (directMarkdownDocs.length > 0) {
          setStudyDocs(directMarkdownDocs);
          setLoadingStudyDocs(false);
          return;
        }

        const indexResponse = await fetch("/docs/SAQA_78965_CET_Training/_extracted/index.json");
        if (!indexResponse.ok) {
          setStudyDocs([]);
          setLoadingStudyDocs(false);
          return;
        }

        const indexData = (await indexResponse.json()) as ExtractedIndex;
        const moduleFiles = (indexData.files ?? []).filter((file) => {
          if (!file.source_path.includes(`US ${mappedUnit}/`)) return false;
          if (role !== "learner") return true;

          const sourcePath = file.source_path.toLowerCase();
          if (sourcePath.includes("facilitator") || sourcePath.includes("memo") || sourcePath.includes("memorandum") || sourcePath.includes("assessment guide") || sourcePath.includes("assesement guide") || sourcePath.includes("assessement guide")) {
            return false;
          }

          if (sourcePath.includes("learner guide")) return true;
          return assessmentUnlocked && (sourcePath.includes("summative assessment") || sourcePath.includes("practical assessment") || sourcePath.includes("practical assesement"));
        });

        const priority = [
          "Learner Guide",
          "Learner Workbook",
          "Facilitator Guide",
          "Assessment Guide",
          "Summative Assessment",
          "Practical Assesement",
        ];

        moduleFiles.sort((a, b) => {
          const aRank = priority.findIndex((term) => a.source_path.includes(term));
          const bRank = priority.findIndex((term) => b.source_path.includes(term));
          const safeARank = aRank === -1 ? 999 : aRank;
          const safeBRank = bRank === -1 ? 999 : bRank;
          return safeARank - safeBRank;
        });

        const selectedFiles = moduleFiles.slice(0, 6);
        const loadedDocs = await Promise.all(
          selectedFiles.map(async (file) => {
            const extractedFilePath = file.file_name?.trim().length
              ? file.file_name
              : `${file.source_path.replaceAll("/", "__")}.json`;
            const fileResponse = await fetch(`/docs/SAQA_78965_CET_Training/_extracted/${encodePathSegments(extractedFilePath)}`);
            if (!fileResponse.ok) return null;
            const payload = (await fileResponse.json()) as ExtractedDoc;
            const sourceLeaf = getLeafName(file.source_path);
            const sourceName = normalizeDocName(sourceLeaf);
            const matchingDownload = allModuleDownloads.find((download) => {
              const downloadLeaf = getLeafName(download.href);
              const markdownLeaf = getLeafName(docxToMarkdownHref(download.href));
              return normalizeDocName(downloadLeaf) === sourceName || normalizeDocName(markdownLeaf) === sourceName;
            });

            return {
              ...payload,
              download_href: matchingDownload?.href ?? `/docs/SAQA_78965_CET_Training/${encodePathSegments(file.source_path)}`,
            } as ExtractedDoc;
          })
        );

        setStudyDocs(loadedDocs.filter((doc): doc is ExtractedDoc => doc !== null));
      } catch {
        setStudyDocs([]);
      }

      setLoadingStudyDocs(false);
    };

    loadStudyContent();
  }, [id, jsonLinksByModule, role, assessmentUnlocked, guideCompleted]);

  // Reset workspace navigation state only when the module changes (id), not on every doc reload
  useEffect(() => {
    setActiveDocName("");
    setWorkspaceView("guide");
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setGuidePageIndex(0);
    setGuideMode("intro");
    setSessionIndex(0);
    setHighestSessionReached(-1);
    setSubmissionFile(null);
    setSubmissionPath("");
    setSubmissionUploadedAt("");
    setAssessmentSubmitMessage("");
    setOnlineAnswers({});
    setAssessmentChecklist({ read: false, criteria: false, own: false });
    setPendingSubmissionText("");
    setSubmittedText("");
    setAdminDocCategory("guide");
  }, [id]);

  // ── Print submission ──────────────────────────────────────────────────────
  const openPrintWindow = (text: string) => {
    const mod = modules.find((m) => m.id === id);
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Assessment — ${mod?.title ?? id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;font-size:11.5px;color:#111;padding:40px 48px}
    .hdr{background:#111;color:#fff;padding:14px 20px;text-align:center;margin-bottom:20px}
    .hdr h1{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
    .hdr p{font-size:10px;margin-top:3px;opacity:.8}
    pre{white-space:pre-wrap;word-break:break-word;line-height:1.75;font-family:Arial,sans-serif;font-size:11.5px}
    .actions{display:flex;gap:10px;margin-bottom:20px}
    button{padding:7px 20px;background:#111;color:#fff;border:none;cursor:pointer;font-size:11px;border-radius:4px}
    button:hover{background:#333}
    .note{font-size:10px;color:#666;margin-bottom:16px}
    @media print{.actions{display:none!important}body{padding:20px}}
  </style>
</head>
<body>
  <div class="hdr">
    <h1>Further Education and Training Certificate: IT Systems Development</h1>
    <p>SAQA ID: 78965 &nbsp;·&nbsp; NQF Level 4 &nbsp;·&nbsp; 165 Credits</p>
  </div>
  <div class="actions">
    <button onclick="window.print()">🖨&nbsp; Print / Save as PDF</button>
    <button onclick="window.close()">✕&nbsp; Close</button>
  </div>
  <p class="note">Tip: In the print dialog choose <strong>Save as PDF</strong> to generate a PDF copy for your portfolio.</p>
  <pre>${escaped}</pre>
</body>
</html>`;
    const win = window.open("", "_blank", "width=900,height=700,scrollbars=yes");
    if (win) { win.document.write(html); win.document.close(); }
  };

  // Restore learner to their furthest-reached step after the reset above fires.
  // Declared AFTER the reset effect so it always runs second and wins.
  useEffect(() => {
    if (!id || role !== "learner") return;
    const prog = progressMap[id];
    if (!prog) return; // no saved progress yet — reset defaults are fine

    if (prog.assessment_submitted) {
      // Already submitted — restore the submitted state so the success screen shows
      setWorkspaceView("assessment");
      setHighestSessionReached(999);
      setAssessmentSubmitMessage("Assessment submitted successfully.");
      setSubmissionUploadedAt(prog.assessment_submitted_at ?? "");
      setSubmissionPath(prog.submission_path ?? "");
    } else if (prog.assessment_unlocked || prog.quiz_passed) {
      // Furthest confirmed step: assessment — mark all guide sessions as visited
      setWorkspaceView("assessment");
      setHighestSessionReached(999);
    } else if (prog.guide_completed) {
      // Guide done, quiz not yet passed — mark all guide sessions as visited
      setWorkspaceView("quiz");
      setHighestSessionReached(999);
    } else {
      // Still working through the guide — restore the session tab and progress markers
      const saved = localStorage.getItem(`cet_sess_${user?.id}_${id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { mode?: string; sessionIdx?: number; maxSessionIdx?: number };
          if (typeof parsed.maxSessionIdx === "number") setHighestSessionReached(parsed.maxSessionIdx);
          if (parsed.mode === "sessions" && typeof parsed.sessionIdx === "number") {
            setGuideMode("sessions");
            setSessionIndex(parsed.sessionIdx);
          }
        } catch { /* corrupted entry — ignore */ }
      }
    }
  }, [id, role, progressMap, user?.id]);

  // Advance highestSessionReached whenever the learner moves forward — never decrements
  useEffect(() => {
    if (!id || role !== "learner" || guideMode !== "sessions") return;
    setHighestSessionReached((prev) => Math.max(prev, sessionIndex));
  }, [id, role, guideMode, sessionIndex]);

  // Hydrate submittedText from storage when revisiting a completed assessment.
  // submittedText is session-only; submissionPath persists in the DB.
  useEffect(() => {
    if (!submissionPath || submittedText) return;
    supabase.storage
      .from("assessment-submissions")
      .download(submissionPath)
      .then(({ data, error }) => {
        if (error || !data) return;
        data.text().then((t) => setSubmittedText(t));
      });
  }, [submissionPath, submittedText]);

  // Persist current guide position so the learner can resume within the guide.
  // Only written while the guide is in progress (not after guide_completed).
  useEffect(() => {
    if (!id || role !== "learner" || !user?.id || guideCompleted) return;
    if (workspaceView !== "guide") return;
    localStorage.setItem(
      `cet_sess_${user.id}_${id}`,
      JSON.stringify({ mode: guideMode, sessionIdx: sessionIndex, maxSessionIdx: highestSessionReached })
    );
  }, [id, role, user?.id, guideMode, sessionIndex, guideCompleted, workspaceView]);

  // Keep active doc pointer in sync when studyDocs are (re)loaded
  useEffect(() => {
    setActiveDocName((prev) => prev || (studyDocs[0]?.file_name ?? ""));
  }, [studyDocs]);

  useEffect(() => {
    if (!id || role !== "learner") return;

    const prog = progressMap[id];
    if (!prog?.submission_path) return;

    setSubmissionPath(prog.submission_path);
    if (prog.submission_uploaded_at) setSubmissionUploadedAt(prog.submission_uploaded_at);
    if (prog.assessment_submitted) {
      setAssessmentSubmitMessage("Assessment already submitted for this module.");
    }
  }, [id, role, progressMap]);

  const downloads = id ? jsonLinksByModule?.[id] ?? moduleDownloadsById[id] ?? [] : [];
  const learnerGuideDownloads = downloads.filter((doc) => isLearnerGuideLabel(doc.label));
  const learnerWorkbookDownloads = downloads.filter((doc) => isWorkbookLabel(doc.label));
  const learnerAssessmentDownloads = downloads.filter((doc) => isAssessmentTaskLabel(doc.label));
  const learnerVisibleDownloads = [
    ...learnerGuideDownloads,
    ...(guideCompleted ? learnerWorkbookDownloads : []),
    ...(assessmentUnlocked ? learnerAssessmentDownloads : []),
  ];
  const isLearnerView = role === "learner";
  const backHref = isLearnerView ? "/learner" : "/modules";
  const backLabel = isLearnerView ? "Back to Learner Portal" : "Back to Modules";
  const visibleDownloads = isLearnerView ? learnerVisibleDownloads : downloads;
  const activeDoc = studyDocs.find((doc) => doc.file_name === activeDocName) ?? studyDocs[0] ?? null;
  const learnerGuideDoc = studyDocs.find((doc) => isLearnerGuideFile(doc.file_name)) ?? activeDoc;
  const assessmentDoc = studyDocs.find((doc) => isAssessmentTaskLabel(getDisplayDocName(doc.file_name))) ?? null;
  const workbookDoc = studyDocs.find((doc) => isWorkbookLabel(getDisplayDocName(doc.file_name))) ?? null;
  const facilitatorDoc = studyDocs.find((doc) => isFacilitatorLabel(getDisplayDocName(doc.file_name))) ?? null;
  const assessmentDownloadHref = learnerAssessmentDownloads[0]?.href ?? assessmentDoc?.download_href;
  const quizItems = mod
    ? (id && staticQuizByModule[id]) || buildModuleQuiz(mod.title, mod.objectives, mod.activities)
    : [];
  const learnerGuideHeader = extractLearnerGuideHeader(learnerGuideDoc?.raw_text ?? "", mod?.title ?? "MODULE", id ?? "");
  const missionSteps = [
    {
      key: "guide",
      label: "Recon",
      detail: "Read learner guide in Study Content",
      completed: hasDocForCategory(downloads, "guide"),
    },
    {
      key: "workbook",
      label: "Practice",
      detail: "Work through activities and workbook",
      completed: hasDocForCategory(downloads, "workbook"),
    },
    {
      key: "assessment",
      label: "Validate",
      detail: "Prepare assessment and memo review",
      completed: isLearnerView ? assessmentUnlocked : hasDocForCategory(downloads, "assessment"),
    },
  ];
  const missionCompleted = missionSteps.filter((step) => step.completed).length;
  const missionPercent = Math.round((missionCompleted / missionSteps.length) * 100);
  const quizPassed = quizScore !== null ? quizScore >= 2 : assessmentUnlocked;
  const quizStepAvailable = !isLearnerView || guideCompleted;
  const assessmentStepAvailable = !isLearnerView || (guideCompleted && assessmentUnlocked);
  const guidePages = moduleLessonFlow
    ? [
        {
          id: "intro",
          label: "Intro",
          title: moduleLessonFlow.introTitle,
          summary: moduleLessonFlow.introSummary,
          body: moduleLessonFlow.introBody,
        },
        ...moduleLessonFlow.lessons.map((lesson) => ({
          id: lesson.id,
          label: lesson.label,
          title: lesson.title,
          summary: lesson.summary,
          body: lesson.body,
        })),
      ]
    : [];
  const sessionLessons = moduleLessonFlow
    ? moduleLessonFlow.lessons.filter((lesson) => lesson.label.toLowerCase().startsWith("session"))
    : [];
  const lecturerNotes = [
    `Focus on applying this module outcome: ${mod?.objectives[0] ?? "core module objective"}.`,
    "Your submission should include clear structure, comments, and evidence of testing.",
    "Before submitting, verify that all required tasks in the assessment brief are addressed.",
  ];
  const markdownArticleClass = "prose prose-sm max-w-none text-foreground dark:prose-invert prose-headings:font-display prose-pre:bg-muted prose-pre:text-foreground prose-pre:whitespace-pre-wrap prose-code:text-foreground prose-a:text-primary prose-li:my-1 prose-p:my-2 prose-table:w-full prose-table:border-collapse prose-table:text-xs prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:px-2 prose-th:py-1 prose-th:text-left prose-td:border prose-td:border-border prose-td:px-2 prose-td:py-1";

  useEffect(() => {
    if (!isLearnerView) return;

    if (workspaceView === "quiz" && !guideCompleted) {
      setWorkspaceView("guide");
      return;
    }

    if (workspaceView === "assessment" && !assessmentStepAvailable) {
      setWorkspaceView(guideCompleted ? "quiz" : "guide");
    }
  }, [isLearnerView, workspaceView, guideCompleted, assessmentStepAvailable]);

  if (!mod) {
    return (
      <AppLayout title="Module Not Found">
        <p className="text-muted-foreground">Module not found.</p>
        <Link to={backHref} className="text-accent hover:underline mt-2 inline-block">← {backLabel}</Link>
      </AppLayout>
    );
  }

  // ── helpers for the redesigned layout ──────────────────────────────────────
  const hasStructuredFlow = !!moduleLessonFlow;

  return (
    <AppLayout title={mod.title} subtitle={`${mod.code} • Block ${mod.block} • ${mod.days}`}>
      {/* ── back link ─────────────────────────────────────────────────────── */}
      <Link
        to={backHref}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft size={13} /> {backLabel}
      </Link>

      {/* ── module hero banner ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            {moduleLessonFlow && (
              <p className="text-xs text-muted-foreground mb-0.5">SAQA {moduleLessonFlow.saqa}</p>
            )}
            <h1 className="text-lg font-display font-bold text-foreground leading-tight">{mod.title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              FETC: IT: Systems Development (ID 78965 · Level 4) · {mod.code} · Block {mod.block} · {mod.days}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {!isLearnerView && (
              <>
                <button
                  onClick={() => setIsPresenting(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <Play size={12} /> Present
                </button>
                <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-600 dark:text-amber-400">
                  {role === "admin" ? "Admin" : "Facilitator"}
                </Badge>
              </>
            )}
            <Badge variant={mod.type === "Knowledge" ? "secondary" : "default"} className={mod.type === "Practical" ? "bg-accent text-accent-foreground" : ""}>
              {mod.type}
            </Badge>
            <Badge variant="outline" className="text-success border-success/30">{mod.status}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground border-t border-border pt-3">
          <span className="flex items-center gap-1.5"><Award size={13} className="text-accent" /> {mod.credits} Credits</span>
          <span className="flex items-center gap-1.5"><Clock size={13} className="text-accent" /> {mod.duration / 60} hrs</span>
          <span className="flex items-center gap-1.5 font-medium text-foreground/70">Block {mod.block} · {mod.days}</span>
          <span className="flex items-center gap-1.5"><BookOpen size={13} className="text-accent" /> {mod.activities.length} Activities</span>
          <span className="flex items-center gap-1.5"><FileText size={13} className="text-accent" /> {visibleDownloads.length} Documents</span>
        </div>
      </div>

      {/* ── two-column body ───────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_280px] items-start">

        {/* ── MAIN: study content ─────────────────────────────────────────── */}
        <div className="space-y-4">

          {loadingStudyDocs && (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading study content…</div>
          )}

          {!loadingStudyDocs && studyDocs.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No extracted study content found for this unit yet.</div>
          )}

          {!loadingStudyDocs && studyDocs.length > 0 && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">

              {/* ── Admin doc-category switcher ─────────────────────────────── */}
              {!isLearnerView && (
                <div className="flex flex-wrap gap-1.5 border-b border-border bg-muted/20 px-4 py-2.5">
                  {([
                    { key: "guide", label: "Module Content", available: !!moduleLessonFlow || !!learnerGuideDoc },
                    { key: "workbook", label: "Learner Workbook", available: !!workbookDoc },
                    { key: "facilitator", label: "Facilitator Guide", available: !!facilitatorDoc },
                    { key: "assessment", label: "Assessment Task", available: !!assessmentDoc },
                  ] as const).map(({ key, label, available }) => available && (
                    <button
                      key={key}
                      onClick={() => setAdminDocCategory(key)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors border ${
                        adminDocCategory === key
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Raw doc rendering for admin non-guide tabs ─────────────── */}
              {!isLearnerView && adminDocCategory !== "guide" && (() => {
                const docToShow =
                  adminDocCategory === "workbook" ? workbookDoc
                  : adminDocCategory === "facilitator" ? facilitatorDoc
                  : adminDocCategory === "assessment" ? assessmentDoc
                  : null;
                if (!docToShow) return (
                  <div className="p-6 text-sm text-muted-foreground">No document available for this category.</div>
                );
                return (
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-foreground">{getDisplayDocName(docToShow.file_name)}</p>
                      {docToShow.download_href && (
                        <a href={docToShow.download_href} download className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <Download size={12} /> Download
                        </a>
                      )}
                    </div>
                    <div className="max-h-[52rem] overflow-auto pr-1">
                      <article className={markdownArticleClass}>
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                          {toMarkdownBody(docToShow)}
                        </ReactMarkdown>
                      </article>
                    </div>
                  </div>
                );
              })()}

              {/* ── Guide + Quiz + Assessment stepper (learner & admin guide tab) */}
              {(isLearnerView || adminDocCategory === "guide") && (
              <>
              {workspaceView === "guide" && (
                <>
                  {hasStructuredFlow ? (
                    <>
                      {guideMode === "intro" && (
                        <div>
                          {/* ── intro / about ─ */}
                          <div className="border-b border-border bg-muted/30 px-5 py-4">
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Learner Guide Introduction</p>
                            <h2 className="text-base font-display font-semibold text-foreground mb-2">{moduleLessonFlow!.introTitle}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{moduleLessonFlow!.aboutGuide}</p>
                          </div>

                          {/* ── unit overview ─ */}
                          <div className="px-5 py-4 space-y-3">
                            {/* unit meta block */}
                            <div className="rounded-lg border border-border bg-background/60 p-4 space-y-1">
                              <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Unit Standard {moduleLessonFlow!.saqa}</p>
                              <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                              <p className="text-xs text-muted-foreground">{mod.code} · NQF Level 4 · {mod.credits} Credits · {mod.type}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs font-medium text-foreground">Purpose</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{moduleLessonFlow!.unitPurpose}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs font-medium text-foreground">Assumed prior learning</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{guidePages[1]?.body}</p>
                            </div>
                          </div>

                          <div className="border-t border-border px-5 py-3 flex justify-end bg-muted/20">
                            <button
                              onClick={() => { setGuideMode("sessions"); setSessionIndex(0); }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90 transition-colors"
                            >
                              Begin sessions <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      )}

                      {guideMode === "sessions" && sessionLessons.length > 0 && (
                        <div>
                          {/* session tab bar */}
                          <div className="flex overflow-x-auto border-b border-border bg-muted/20">
                            {sessionLessons.map((session, index) => (
                              <button
                                key={session.id}
                                onClick={() => setSessionIndex(index)}
                                className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                                  sessionIndex === index
                                    ? "border-primary text-foreground bg-background"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                                }`}
                              >
                                {session.label}
                              </button>
                            ))}
                          </div>

                          {/* session content */}
                          <div className="px-5 py-5 space-y-6">
                            {/* label + title + summary */}
                            <div>
                              <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">{sessionLessons[sessionIndex].label}</p>
                              <h2 className="text-base font-display font-semibold text-foreground mb-2">{sessionLessons[sessionIndex].title}</h2>
                              <p className="text-sm text-accent font-medium">{sessionLessons[sessionIndex].summary}</p>
                            </div>

                            {/* learning outcomes */}
                            {sessionLessons[sessionIndex].outcomes && sessionLessons[sessionIndex].outcomes!.length > 0 && (
                              <div className="rounded-lg border border-border bg-muted/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Learning Outcomes</p>
                                <ol className="space-y-1.5">
                                  {sessionLessons[sessionIndex].outcomes!.map((outcome, i) => (
                                    <li key={i} className="flex gap-2.5 text-sm text-foreground leading-snug">
                                      <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold mt-0.5">{i + 1}</span>
                                      <span>{outcome}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            {/* rich sections */}
                            {sessionLessons[sessionIndex].sections?.map((section, si) => (
                              <div key={si} className="space-y-3">
                                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-1.5">{section.title}</h3>
                                {section.blocks.map((block, bi) => {
                                  if (block.type === "paragraph") {
                                    return (
                                      <p key={bi} className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{block.text}</p>
                                    );
                                  }
                                  if (block.type === "heading") {
                                    return (
                                      <p key={bi} className="text-sm font-semibold text-foreground mt-3">{block.text}</p>
                                    );
                                  }
                                  if (block.type === "subheading") {
                                    return (
                                      <p key={bi} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-2">{block.text}</p>
                                    );
                                  }
                                  if (block.type === "list") {
                                    return (
                                      <ul key={bi} className="space-y-1.5 pl-1">
                                        {block.items.map((item, ii) => (
                                          <li key={ii} className="flex gap-2 text-sm text-muted-foreground leading-snug">
                                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60" />
                                            <span>{item}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    );
                                  }
                                  if (block.type === "ordered-list") {
                                    return (
                                      <ol key={bi} className="space-y-1.5 pl-1">
                                        {block.items.map((item, ii) => (
                                          <li key={ii} className="flex gap-2.5 text-sm text-muted-foreground leading-snug">
                                            <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-foreground text-[10px] font-bold mt-0.5">{ii + 1}</span>
                                            <span>{item}</span>
                                          </li>
                                        ))}
                                      </ol>
                                    );
                                  }
                                  if (block.type === "table") {
                                    return (
                                      <div key={bi} className="overflow-x-auto rounded-lg border border-border">
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="border-b border-border bg-muted/50">
                                              {block.headers.map((h, hi) => (
                                                <th key={hi} className="text-left px-3 py-2 font-semibold text-foreground whitespace-nowrap">{h}</th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {block.rows.map((row, ri) => (
                                              <tr key={ri} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                                {row.map((cell, ci) => (
                                                  <td key={ci} className={`px-3 py-2 text-muted-foreground align-top ${ci === 0 ? "font-medium text-foreground whitespace-nowrap" : ""}`}>{cell}</td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  }
                                  if (block.type === "code") {
                                    return (
                                      <pre key={bi} className="rounded-lg bg-muted border border-border px-4 py-3 text-xs text-foreground font-mono overflow-x-auto whitespace-pre leading-relaxed">{block.text}</pre>
                                    );
                                  }
                                  if (block.type === "callout") {
                                    const styles = {
                                      tip: "bg-green-500/8 border-green-500/30 text-green-700 dark:text-green-400",
                                      info: "bg-blue-500/8 border-blue-500/30 text-blue-700 dark:text-blue-400",
                                      warning: "bg-amber-500/8 border-amber-500/30 text-amber-700 dark:text-amber-400",
                                    };
                                    const labels = { tip: "💡 Tip", info: "ℹ Info", warning: "⚠ Note" };
                                    return (
                                      <div key={bi} className={`rounded-lg border px-4 py-3 text-xs leading-relaxed ${styles[block.variant]}`}>
                                        <span className="font-semibold mr-1.5">{labels[block.variant]}:</span>{block.text}
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-border px-5 py-3 flex justify-between items-center bg-muted/20">
                            <button
                              onClick={() => setGuideMode("intro")}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border text-muted-foreground px-3 py-2 text-xs hover:bg-secondary/40 transition-colors"
                            >
                              <ArrowLeft size={12} /> Back to intro
                            </button>
                            <button
                              onClick={() => {
                                if (sessionIndex < sessionLessons.length - 1) {
                                  setSessionIndex(sessionIndex + 1);
                                } else {
                                  if (id) void markGuideCompleted(id);
                                  setGuideCompleted(true);
                                  setWorkspaceView("quiz");
                                  setHighestSessionReached(999); // all sessions done
                                  // Guide complete — no need to persist navigation state
                                  if (user?.id && id) localStorage.removeItem(`cet_sess_${user.id}_${id}`);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90 transition-colors"
                            >
                              {sessionIndex === sessionLessons.length - 1 ? "Take quiz" : "Next session"} <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* fallback: raw markdown for non-flow modules */
                    learnerGuideDoc && (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-foreground">{getDisplayDocName(learnerGuideDoc.file_name)}</p>
                          {learnerGuideDoc.download_href && (
                            <a href={learnerGuideDoc.download_href} download className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                              <Download size={12} /> Download
                            </a>
                          )}
                        </div>
                        <div className="max-h-[40rem] overflow-auto pr-1">
                          <article className={markdownArticleClass}>
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                              {toMarkdownBody(learnerGuideDoc)}
                            </ReactMarkdown>
                          </article>
                        </div>
                        {isLearnerView && (
                          <div className="pt-3 mt-3 border-t border-border flex justify-end">
                            <button
                              onClick={() => {
                                if (id) void markGuideCompleted(id);
                                setGuideCompleted(true);
                                setWorkspaceView("quiz");
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90"
                            >
                              Next: Quiz <ChevronRight size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </>
              )}

              {/* ===== QUIZ VIEW ===== */}
              {workspaceView === "quiz" && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        {isLearnerView ? "Lesson Checkpoint" : "Quiz Management"}
                      </p>
                      <h2 className="text-base font-semibold text-foreground">Knowledge Check</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isLearnerView && (
                        <>
                          <Badge variant={quizEnabled ? "default" : "secondary"} className="text-xs">
                            {quizEnabled ? "Quiz On" : "Quiz Off"}
                          </Badge>
                          <button
                            onClick={() => setQuizEnabled((prev) => !prev)}
                            className={`rounded-md px-3 py-1 text-xs font-medium border transition-colors ${
                              quizEnabled
                                ? "border-red-400/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                                : "border-green-400/50 text-green-600 dark:text-green-400 hover:bg-green-500/10"
                            }`}
                          >
                            {quizEnabled ? "Disable" : "Enable"}
                          </button>
                          <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-600 dark:text-amber-400">
                            Answer Key
                          </Badge>
                        </>
                      )}
                      {isLearnerView && (
                        <Badge variant="outline" className="text-xs">Pass 2/{quizItems.length} to unlock</Badge>
                      )}
                    </div>
                  </div>

                  {!isLearnerView && !quizEnabled && (
                    <div className="rounded-lg border border-border bg-muted/40 p-4 text-center space-y-1">
                      <p className="text-sm font-medium text-foreground">Quiz is currently disabled</p>
                      <p className="text-xs text-muted-foreground">Learners will not see the quiz step until you re-enable it.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {quizItems.map((item, idx) => (
                      <div key={item.id} className="rounded-lg border border-border bg-background/50 p-4">
                        <div className="flex gap-3 mb-3">
                          <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold">{idx + 1}</span>
                          <p className="text-sm font-medium text-foreground leading-snug">{item.question}</p>
                        </div>
                        <div className="space-y-2">
                          {item.options.map((option) => {
                            const selected = quizAnswers[item.id] === option;
                            const showAnswer = !isLearnerView || quizSubmitted;
                            const isCorrect = showAnswer && option === item.answer;
                            const isWrong = quizSubmitted && selected && option !== item.answer;
                            return (
                              <button
                                key={option}
                                onClick={() => !quizSubmitted && setQuizAnswers((prev) => ({ ...prev, [item.id]: option }))}
                                className={`w-full text-left flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                                  isCorrect ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400" :
                                  isWrong ? "border-red-400 bg-red-400/10 text-red-600 dark:text-red-400" :
                                  selected ? "border-primary bg-primary/10 text-foreground" :
                                  "border-border text-muted-foreground hover:bg-secondary/40"
                                }`}
                              >
                                <span className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${
                                  isCorrect ? "border-green-500 bg-green-500 text-white" :
                                  isWrong ? "border-red-400 bg-red-400 text-white" :
                                  selected ? "border-primary bg-primary text-primary-foreground" :
                                  "border-border"
                                }`}>{isCorrect ? "✓" : isWrong ? "✗" : selected ? "✓" : ""}</span>
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        {/* Per-question feedback shown after submit */}
                        {isLearnerView && quizSubmitted && quizAnswers[item.id] !== undefined && (
                          <p className={`text-xs mt-2.5 font-medium ${
                            quizAnswers[item.id] === item.answer
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-500 dark:text-red-400"
                          }`}>
                            {quizAnswers[item.id] === item.answer
                              ? "✓ Correct!"
                              : `✗ Incorrect — the correct answer is: "${item.answer}"`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {isLearnerView ? (
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        {!quizSubmitted ? (
                          <button
                            onClick={() => {
                              const score = quizItems.reduce((total, q) => (quizAnswers[q.id] === q.answer ? total + 1 : total), 0);
                              setQuizSubmitted(true);
                              setQuizScore(score);
                              if (score >= 2 && id) {
                                setAssessmentUnlocked(true);
                                void markQuizPassed(id);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90"
                          >
                            Submit Quiz
                          </button>
                        ) : (
                          <button
                            onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null); }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border text-muted-foreground px-4 py-2 text-xs font-medium hover:bg-secondary/50"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                      {quizSubmitted && (
                        <div className="flex items-center gap-3">
                          <p className={`text-xs font-semibold ${quizScore !== null && quizScore >= 2 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                            Score: {quizScore}/{quizItems.length} — {quizScore !== null && quizScore >= 2 ? "Passed ✓" : "Try again"}
                          </p>
                          {quizPassed && (
                            <button
                              onClick={() => setWorkspaceView("assessment")}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90"
                            >
                              Assessment <ChevronRight size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end pt-2 border-t border-border">
                      <button
                        onClick={() => setWorkspaceView("assessment")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90"
                      >
                        Continue to Assessment <ChevronRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ===== ASSESSMENT VIEW ===== */}
              {workspaceView === "assessment" && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-5" id="assessment-view">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Final Step</p>
                      <h2 className="text-base font-semibold text-foreground">
                        {moduleLessonFlow?.assessmentPageTitle ?? "Assessment"}
                      </h2>
                    </div>
                    <Badge variant={assessmentUnlocked ? "default" : "outline"} className="text-xs">
                      {assessmentUnlocked ? "Unlocked" : "Locked"}
                    </Badge>
                  </div>

                  {isLearnerView && !assessmentUnlocked ? (
                    <div className="rounded-lg border border-border bg-muted/30 p-5 text-center space-y-2">
                      <p className="text-sm font-medium text-foreground">Assessment Locked</p>
                      <p className="text-xs text-muted-foreground">Complete and pass the quiz to unlock this assessment.</p>
                      <button
                        onClick={() => setWorkspaceView("quiz")}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary/10 text-foreground px-4 py-2 text-xs font-medium hover:bg-primary/20"
                      >
                        Go to Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {moduleLessonFlow?.assessmentPageBody && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{moduleLessonFlow.assessmentPageBody}</p>
                      )}

                      {/* Assessment preview — admin only; learner gets the inline form below */}
                      {assessmentDoc && !isLearnerView && (
                        <details className="rounded-lg border border-border bg-background/40 p-4">
                          <summary className="cursor-pointer text-sm font-medium text-foreground">Assessment Preview</summary>
                          <div className="max-h-72 overflow-auto pr-1 mt-3">
                            <article className={markdownArticleClass}>
                              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                {toMarkdownBody(assessmentDoc)}
                              </ReactMarkdown>
                            </article>
                          </div>
                        </details>
                      )}

                      {!isLearnerView && lecturerNotes.length > 0 && (
                        <div className="rounded-lg border border-amber-400/30 bg-amber-50/30 dark:bg-amber-900/10 p-4">
                          <p className="text-sm font-medium text-foreground mb-2">Facilitator Notes</p>
                          <ul className="space-y-1">
                            {lecturerNotes.map((note) => (
                              <li key={note} className="text-xs text-muted-foreground">• {note}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isLearnerView && (
                      <>
                        {/* ── Success state ── */}
                        {(progressMap[id ?? ""]?.assessment_submitted || assessmentSubmitMessage.includes("successfully")) ? (
                          <div className="space-y-4">
                            <div className="rounded-lg border border-green-500/40 bg-green-50/40 dark:bg-green-900/10 p-5 flex items-start gap-4">
                              <CheckCircle2 size={28} className="shrink-0 text-green-500 mt-0.5" />
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Assessment Submitted</p>
                                <p className="text-xs text-muted-foreground">Your responses have been saved and submitted to your facilitator. Well done for completing this unit!</p>
                                {submissionUploadedAt && (
                                  <p className="text-xs text-muted-foreground">Submitted: <span className="font-medium text-foreground">{new Date(submissionUploadedAt).toLocaleString()}</span></p>
                                )}
                              </div>
                            </div>
                            {/* Print & Email actions */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => openPrintWindow(submittedText)}
                                disabled={!submittedText}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground px-4 py-2.5 hover:bg-secondary/50 disabled:opacity-40 transition-colors"
                              >
                                <span>🖨</span> Print / Save as PDF
                              </button>
                            </div>
                          </div>
                        ) : (
                          <AssessmentForm
                            moduleId={id ?? ""}
                            answers={onlineAnswers}
                            onAnswerChange={(idx, val) => setOnlineAnswers((prev) => ({ ...prev, [idx]: val }))}
                            downloadHref={assessmentDownloadHref}
                            learnerName={
                              user?.user_metadata?.display_name ??
                              user?.user_metadata?.full_name ??
                              user?.email ??
                              ""
                            }
                            onRequestSubmit={(payload: AssessmentPayload) => {
                              setPendingSubmissionText(payload.submissionText);
                              setShowSubmitConfirm(true);
                            }}
                            isSubmitting={isSubmittingAssessment}
                            submitError={
                              assessmentSubmitMessage && !assessmentSubmitMessage.includes("successfully")
                                ? assessmentSubmitMessage
                                : undefined
                            }
                          />
                        )}

                        {/* ── Confirm dialog ── */}
                        <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                              <AlertDialogDescription>
                                Your answers will be saved and submitted to your facilitator for review. Make sure you have answered all required activities before confirming.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Go Back</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  if (!id || !user?.id) return;
                                  // Guard: never submit twice
                                  if (progressMap[id]?.assessment_submitted) {
                                    setShowSubmitConfirm(false);
                                    setAssessmentSubmitMessage("Assessment submitted successfully.");
                                    return;
                                  }
                                  setIsSubmittingAssessment(true);
                                  const blob = new Blob([pendingSubmissionText], { type: "text/plain" });
                                  const safeName = `${Date.now()}-online-assessment.txt`;
                                  const path = `learner-${user.id}/module-${id}/${safeName}`;
                                  const { error } = await supabase.storage.from("assessment-submissions").upload(path, blob, { upsert: true });
                                  if (error) {
                                    setAssessmentSubmitMessage(`Submission failed: ${error.message}`);
                                    setIsSubmittingAssessment(false);
                                    return;
                                  }
                                  const submittedAt = new Date().toISOString();
                                  setSubmissionPath(path);
                                  setSubmissionUploadedAt(submittedAt);
                                  setSubmittedText(pendingSubmissionText);
                                  void recordSubmission(id, path, submittedAt);
                                  await markAssessmentSubmitted(id, submittedAt);
                                  setIsSubmittingAssessment(false);
                                  setAssessmentSubmitMessage("Assessment submitted successfully.");
                                }}
                              >
                                Confirm &amp; Submit
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                      )}{/* end isLearnerView submit wrapper */}
                    </div>
                  )}
                </div>
              )}
              </>)}
            </div>
          )}
        </div>{/* end main column */}

        {/* ===== SIDEBAR ===== */}
        <aside className="hidden lg:block w-[280px] shrink-0 space-y-4 self-start sticky top-6">

              {/* Progress card — shown when on guide/quiz/assessment stepper */}
              {(isLearnerView || adminDocCategory === "guide") && (
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {isLearnerView ? "Your Progress" : "Module Navigation"}
                </p>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>
                      {workspaceView === "guide"
                        ? guideMode === "intro" ? "Introduction" : `Session ${sessionIndex + 1}`
                        : workspaceView === "quiz" ? "Quiz" : "Assessment"}
                    </span>
                    <span>
                      {workspaceView === "guide"
                        ? guideMode === "intro" ? 1 : sessionIndex + 2
                        : workspaceView === "quiz"
                          ? (hasStructuredFlow ? sessionLessons.length + 2 : 2)
                          : (hasStructuredFlow ? sessionLessons.length + 3 : 3)}
                      /{hasStructuredFlow ? sessionLessons.length + 3 : 3}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${
                          workspaceView === "guide"
                            ? guideMode === "intro" ? 5 : Math.round(((sessionIndex + 1) / (hasStructuredFlow ? sessionLessons.length + 1 : 1)) * 75)
                            : workspaceView === "quiz" ? 82
                            : 100
                        }%`
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-0.5">
                  {/* Intro step */}
                  <button
                    onClick={() => { setWorkspaceView("guide"); setGuideMode("intro"); }}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors ${
                      workspaceView === "guide" && guideMode === "intro"
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {/* Intro is "done" once the learner has ever advanced past it */}
                    <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      highestSessionReached >= 0 || guideCompleted
                        ? "bg-primary text-primary-foreground"
                        : workspaceView === "guide" && guideMode === "intro"
                          ? "border border-primary"
                          : "border border-border"
                    }`}>
                      {(highestSessionReached >= 0 || guideCompleted) ? "✓" : ""}
                    </span>
                    Introduction
                  </button>

                  {/* Session steps */}
                  {hasStructuredFlow && sessionLessons.map((lesson, idx) => {
                    // isDone persists regardless of where the learner is now browsing
                    const isDone = highestSessionReached > idx || guideCompleted;
                    const isActive = workspaceView === "guide" && guideMode === "sessions" && sessionIndex === idx;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => { setWorkspaceView("guide"); setGuideMode("sessions"); setSessionIndex(idx); }}
                        className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors ${
                          isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          isDone ? "bg-primary text-primary-foreground" : isActive ? "border border-primary" : "border border-border"
                        }`}>
                          {isDone ? "✓" : ""}
                        </span>
                        {lesson.title}
                      </button>
                    );
                  })}

                  {/* Quiz step */}
                  <button
                    onClick={() => (!isLearnerView || guideCompleted) && setWorkspaceView("quiz")}
                    disabled={isLearnerView && !guideCompleted}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors ${
                      workspaceView === "quiz" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary/50"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      assessmentUnlocked ? "bg-primary text-primary-foreground" : "border border-border"
                    }`}>
                      {assessmentUnlocked ? "✓" : ""}
                    </span>
                    Quiz
                  </button>

                  {/* Assessment step */}
                  <button
                    onClick={() => (!isLearnerView || assessmentUnlocked) && setWorkspaceView("assessment")}
                    disabled={isLearnerView && !assessmentUnlocked}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors ${
                      workspaceView === "assessment" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary/50"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <span className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                      progressMap[id ?? ""]?.assessment_submitted
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border"
                    }`}>
                      {progressMap[id ?? ""]?.assessment_submitted ? "✓" : ""}
                    </span>
                    Assessment
                  </button>
                </div>
              </div>
              )}{/* end progress card */}



              {/* Resources / Downloads card */}
              {visibleDownloads.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Documents</p>
                  {visibleDownloads.map((dl) => (
                    <a
                      key={dl.href}
                      href={dl.href}
                      download
                      className="flex items-center gap-2 text-xs text-primary hover:underline"
                    >
                      <Download size={12} />
                      <span className="truncate">{getDisplayDocName(dl.label)}</span>
                    </a>
                  ))}
                  {!isLearnerView && (
                    <p className="text-[10px] text-muted-foreground pt-1">
                      Admin view — all documents visible.
                    </p>
                  )}
                  {isLearnerView && !guideCompleted && learnerWorkbookDownloads.length > 0 && (
                    <p className="text-[10px] text-muted-foreground pt-1">Complete the guide to unlock the workbook.</p>
                  )}
                  {isLearnerView && !assessmentUnlocked && learnerAssessmentDownloads.length > 0 && (
                    <p className="text-[10px] text-muted-foreground">Pass the quiz to unlock the assessment.</p>
                  )}
                </div>
              )}

              {/* ── Content sync card (admin / lecturer only) ─────────────── */}
              {!isLearnerView && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-50/20 dark:bg-amber-900/10 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                      <DatabaseZap size={13} className="text-amber-500" /> Content Sync
                    </p>
                    <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${
                      flowSource === "db"
                        ? "bg-green-500/15 text-green-600 dark:text-green-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}>
                      {flowLoading ? "loading…" : flowSource === "db" ? "DB ✓" : "static (not seeded)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {flowSource === "db"
                      ? "Module content is loaded from the database. Both admin and learner see the same source."
                      : "Content is using the bundled static file. Seed to the database to enable a single source of truth for all roles."}
                  </p>

                  <div className="flex flex-col gap-1.5">
                    {/* Seed this module */}
                    {id && moduleLessonFlow && (
                      <button
                        disabled={seeding}
                        onClick={async () => {
                          setSeeding(true);
                          setSeedStatus(null);
                          const { error } = await upsertFlow(id, moduleLessonFlow);
                          setSeeding(false);
                          setSeedStatus(error ? `Error: ${error}` : "This module synced to DB ✓");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 text-amber-700 dark:text-amber-300 bg-amber-50/40 dark:bg-amber-900/20 px-3 py-1.5 text-xs font-medium hover:bg-amber-100/60 dark:hover:bg-amber-900/30 disabled:opacity-50 transition-colors"
                      >
                        <RefreshCw size={11} className={seeding ? "animate-spin" : ""} />
                        {seeding ? "Syncing…" : "Sync this module"}
                      </button>
                    )}

                    {/* Seed all modules */}
                    <button
                      disabled={seeding}
                      onClick={async () => {
                        setSeeding(true);
                        setSeedStatus(null);
                        const { seeded, errors } = await seedAllFlows();
                        setSeeding(false);
                        setSeedStatus(
                          errors.length > 0
                            ? `${seeded} seeded, ${errors.length} failed: ${errors[0]}`
                            : `All ${seeded} modules synced to DB ✓`
                        );
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border text-muted-foreground px-3 py-1.5 text-xs font-medium hover:bg-secondary/50 disabled:opacity-50 transition-colors"
                    >
                      <DatabaseZap size={11} />
                      {seeding ? "Seeding all…" : "Seed all modules"}
                    </button>
                  </div>

                  {seedStatus && (
                    <p className={`text-[11px] font-medium ${seedStatus.startsWith("Error") || seedStatus.includes("failed") ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
                      {seedStatus}
                    </p>
                  )}
                </div>
              )}
        </aside>
      </div>{/* end two-column grid */}

      {/* ── Presentation mode ──────────────────────────────────────────────── */}
      {isPresenting && (
        <PresentationMode
          module={mod}
          flow={moduleLessonFlow}
          isAdmin={role === "admin" || role === "moderator"}
          onClose={() => setIsPresenting(false)}
          nextUnitId={nextModule?.id}
          nextUnitTitle={nextModule?.title}
          routePrefix={role === "user" ? "/learner/modules" : "/modules"}
        />
      )}
    </AppLayout>
  );
}
