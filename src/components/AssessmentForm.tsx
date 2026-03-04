import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Download, CheckCircle2 } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Module assessment definitions — one entry per SAQA unit standard
   ───────────────────────────────────────────────────────────── */
interface Activity {
  n: number;
  question: string;
  marks: number;
}

interface AssessmentDef {
  saqa: string;
  unitTitle: string;
  activities: Activity[];
}

const DEFS: Record<string, AssessmentDef> = {
  "14924": {
    saqa: "14924",
    unitTitle: "Demonstrate an Understanding of Information Systems Analysis",
    activities: [
      { n: 1, question: "Describe Feasibility Study.", marks: 7 },
      { n: 2, question: "Outline the functions of the information systems analyst.", marks: 8 },
      { n: 3, question: "Describe the characteristics of questionnaires.", marks: 5 },
      { n: 4, question: "Describe and explain Techniques and Tools of Structured Systems Analysis.", marks: 8 },
      { n: 5, question: "Briefly distinguish between Decision Tables and Trees.", marks: 10 },
    ],
  },
  "14920": {
    saqa: "14920",
    unitTitle: "Demonstrate an Understanding of the Systems Development Team",
    activities: [
      { n: 1, question: "Describe the structure and roles within a systems development team.", marks: 7 },
      { n: 2, question: "Explain the Nominal Group Technique (NGT) and its use in team problem-solving.", marks: 6 },
      { n: 3, question: "List and describe the key steps in the Problem-Solving Process.", marks: 6 },
      { n: 4, question: "Describe the characteristics of an effective team member in a CET environment.", marks: 5 },
      { n: 5, question: "Explain two conflict resolution techniques used within development teams.", marks: 6 },
    ],
  },
  "14918": {
    saqa: "14918",
    unitTitle: "Demonstrate an Understanding of the Basic Principles of Programming",
    activities: [
      { n: 1, question: "Define an algorithm and explain the three fundamental control structures: sequence, selection, and iteration.", marks: 8 },
      { n: 2, question: "Describe five common data types and provide an example of each.", marks: 5 },
      { n: 3, question: "Distinguish between validation and verification in data handling, with practical examples.", marks: 6 },
      { n: 4, question: "Explain the concept of modularity and the role of user-defined functions in programming.", marks: 6 },
      { n: 5, question: "Describe the purpose of pseudocode and flowcharts as program design tools.", marks: 5 },
    ],
  },
  "14927": {
    saqa: "14927",
    unitTitle: "Apply Problem-Solving Techniques to Solve Problems",
    activities: [
      { n: 1, question: "Describe the Problem-Solving Cycle and explain what happens at each step.", marks: 8 },
      { n: 2, question: "Explain the purpose and construction of a Fishbone (Ishikawa) diagram.", marks: 7 },
      { n: 3, question: "Describe three decision-making tools used in problem analysis and explain when each is appropriate.", marks: 7 },
      { n: 4, question: "Outline the components of an implementation plan for a chosen solution.", marks: 6 },
      { n: 5, question: "Explain how to evaluate the effectiveness of an implemented solution and what action to take if it fails.", marks: 7 },
    ],
  },
  "14915": {
    saqa: "14915",
    unitTitle: "Design a Computer Program to Specification",
    activities: [
      { n: 1, question: "Explain the purpose of desk-checking and describe how it is performed before coding begins.", marks: 6 },
      { n: 2, question: "Describe the structure diagram and explain how it represents the design of a program.", marks: 6 },
      { n: 3, question: "Define a user-defined function and explain its role in modular program design.", marks: 6 },
      { n: 4, question: "Distinguish between top-down and bottom-up design approaches, giving advantages of each.", marks: 6 },
      { n: 5, question: "Explain how program specifications should be documented before coding begins and what must be included.", marks: 6 },
    ],
  },
  "14910": {
    saqa: "14910",
    unitTitle: "Apply the Principles of Computer Programming in the Development of a Computer Program",
    activities: [
      { n: 1, question: "Explain the purpose of Unit Standard 14910 and describe the role of programming principles in systems development.", marks: 6 },
      { n: 2, question: "Describe the three fundamental programming control structures with examples of each.", marks: 8 },
      { n: 3, question: "Explain the difference between Boolean, Integer, Real, and String data types with an example of each.", marks: 6 },
      { n: 4, question: "Distinguish between validation and verification, explaining both with practical programming examples.", marks: 7 },
      { n: 5, question: "Describe the importance of documentation in program development and list three types of documentation that should be produced.", marks: 8 },
    ],
  },
  "14933": {
    saqa: "14933",
    unitTitle: "Use a Scripting Language to Enhance a Website",
    activities: [
      { n: 1, question: "Describe the roles of HTML, CSS, and JavaScript in building a web page.", marks: 6 },
      { n: 2, question: "Explain the Document Object Model (DOM) and how JavaScript accesses and manipulates it.", marks: 7 },
      { n: 3, question: "Describe the principles of responsive web design and how they are implemented.", marks: 6 },
      { n: 4, question: "Explain the difference between client-side and server-side scripting with an example of each.", marks: 6 },
      { n: 5, question: "Describe three common JavaScript events and explain how event handlers are used.", marks: 5 },
    ],
  },
  "14908": {
    saqa: "14908",
    unitTitle: "Test IT Systems Against Specifications",
    activities: [
      { n: 1, question: "Describe six hardware test programmes and explain the purpose of each.", marks: 6 },
      { n: 2, question: "Identify and explain five factors that affect the level of testing effort required in a project.", marks: 5 },
      { n: 3, question: "Explain the components of a structured Test Approach Description, including methodology, contacts, and issue tracking.", marks: 6 },
      { n: 4, question: "Describe the procedures for configuring a system to collect diagnostic information and explain what data should be captured.", marks: 5 },
      { n: 5, question: "Explain the steps required to prepare for System Integration Testing, including environment, test hierarchy, and documentation.", marks: 8 },
    ],
  },
  "14919": {
    saqa: "14919",
    unitTitle: "Resolve Computer User Problems",
    activities: [
      { n: 1, question: "Define problem parameters and explain the steps you would take when first receiving a user problem.", marks: 6 },
      { n: 2, question: "Describe five common computer problems and their likely causes.", marks: 6 },
      { n: 3, question: "Explain the investigation and troubleshooting process used to diagnose hardware, software, and user-generated issues.", marks: 7 },
      { n: 4, question: "Draft a complete support ticket record for a fictional user problem. Include: problem description, symptoms, steps taken, solution, and timeline.", marks: 6 },
      { n: 5, question: "Discuss the standardisation of solutions for recurring problems and explain the escalation process when a problem cannot be resolved.", marks: 5 },
    ],
  },
  "120379": {
    saqa: "120379",
    unitTitle: "Work as a Project Team Member",
    activities: [
      { n: 1, question: "Identify five project team roles and explain the responsibilities of each.", marks: 6 },
      { n: 2, question: "Explain the importance of teamwork in CET project delivery and describe three benefits it provides.", marks: 6 },
      { n: 3, question: "Provide three examples of effective teamwork practices and explain why each contributes to project success.", marks: 6 },
      { n: 4, question: "Identify three disruptive team behaviours, explain their impact on team performance, and suggest how each can be addressed.", marks: 7 },
      { n: 5, question: "Discuss two strategies for managing diversity within a project team and explain two conflict-resolution techniques with examples.", marks: 10 },
    ],
  },
};

const COUNTDOWN_SECONDS = 120;

/* ─────────────────────────────────────────────────────────────
   AssessmentPayload — passed to parent's onRequestSubmit
   ───────────────────────────────────────────────────────────── */
export interface AssessmentPayload {
  submissionText: string;
}

/* ─────────────────────────────────────────────────────────────
   Props
   ───────────────────────────────────────────────────────────── */
interface Props {
  moduleId: string;
  answers: Record<number, string>;
  onAnswerChange: (idx: number, value: string) => void;
  downloadHref?: string;
  learnerName: string;
  onRequestSubmit: (payload: AssessmentPayload) => void;
  isSubmitting?: boolean;
  submitError?: string;
}

/* ─────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────── */
export function AssessmentForm({
  moduleId,
  answers,
  onAnswerChange,
  downloadHref,
  learnerName,
  onRequestSubmit,
  isSubmitting,
  submitError,
}: Props) {
  const def = DEFS[moduleId];
  const activities = def?.activities ?? [];
  const totalPages = 1 + activities.length + 1; // cover + questions + review

  /* page: 0=cover, 1..n=questions, n+1=review */
  const [page, setPage] = useState(0);

  /* Learner info fields (cover page) */
  const [info, setInfo] = useState({
    name: learnerName ?? "",
    idNumber: "",
    contactNumber: "",
    date: new Date().toLocaleDateString("en-ZA"),
    venue: "",
  });
  const setField = (key: keyof typeof info) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInfo((p) => ({ ...p, [key]: e.target.value }));

  /* Declarations (cover page) */
  const [declared, setDeclared] = useState({ instructions: false, integrity: false });

  /* Countdown */
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [countdownDone, setCountdownDone] = useState(false);

  useEffect(() => {
    if (page !== 0 || countdownDone) return;
    if (countdown <= 0) { setCountdownDone(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, page, countdownDone]);

  const mins = String(Math.floor(countdown / 60)).padStart(2, "0");
  const secs = String(countdown % 60).padStart(2, "0");

  const canStart = countdownDone && declared.instructions && declared.integrity;

  /* Build submission text */
  function buildSubmissionText(): string {
    const lines: string[] = [
      "═══════════════════════════════════════════════════════════",
      `SUMMATIVE ASSESSMENT — SAQA ${def?.saqa ?? moduleId}`,
      def?.unitTitle ?? "",
      "═══════════════════════════════════════════════════════════",
      "",
      "LEARNER INFORMATION",
      `Full Name:      ${info.name}`,
      `ID Number:      ${info.idNumber}`,
      `Contact Number: ${info.contactNumber}`,
      `Date:           ${info.date}`,
      `Venue:          ${info.venue}`,
      `Submitted:      ${new Date().toISOString()}`,
      "",
      "NOTE: The assessment instruments are summative and must be",
      "retained as part of the learner's portfolio of evidence.",
      "",
      "───────────────────────────────────────────────────────────",
      "ACTIVITIES AND RESPONSES",
      "───────────────────────────────────────────────────────────",
      "",
    ];
    activities.forEach((act, idx) => {
      lines.push(`Activity ${act.n}  [${act.marks} marks]`);
      lines.push(act.question);
      lines.push("");
      lines.push("RESPONSE:");
      lines.push(answers[idx]?.trim() || "(no answer provided)");
      lines.push("");
      lines.push("───────────────────────────────────────────────────────────");
      lines.push("");
    });
    lines.push("END OF ASSESSMENT");
    return lines.join("\n");
  }

  /* ── Cover page ── */
  if (page === 0) {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="rounded-lg border-2 border-foreground/20 bg-card overflow-hidden">
          <div className="bg-foreground text-background px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <img src="/logos/lcx-logo.png" alt="LCX" className="h-10 w-auto object-contain shrink-0" />
              <div className="text-center space-y-1 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest">Further Education and Training Certificate</p>
                <p className="text-sm font-bold uppercase tracking-wide">Information Technology: Systems Development</p>
                <p className="text-xs font-medium">ID 78965 · Level 4 · Credits 165</p>
              </div>
              <img src="/logos/dsa-logo.png" alt="DSA" className="h-10 w-auto object-contain shrink-0" />
            </div>
          </div>
          <div className="border-t-2 border-foreground/20 bg-primary/5 px-5 py-4 text-center space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Summative Assessment</p>
            <p className="text-xs font-semibold text-foreground">SAQA: {def?.saqa ?? moduleId}</p>
            <p className="text-sm font-bold text-foreground leading-snug">{def?.unitTitle ?? "Assessment"}</p>
          </div>
        </div>

        {/* Learner info grid */}
        <div className="rounded-lg border border-border bg-background/50 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">Section A — Learner Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Full Name & Surname", key: "name" as const, full: true },
              { label: "ID Number", key: "idNumber" as const },
              { label: "Contact Telephone No.", key: "contactNumber" as const },
              { label: "Date of Assessment", key: "date" as const },
              { label: "Venue", key: "venue" as const },
            ].map(({ label, key, full }) => (
              <div key={key} className={full ? "sm:col-span-2" : ""}>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</label>
                <input
                  type="text"
                  value={info[key]}
                  onChange={setField(key)}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Assessment instruments notice */}
        <div className="rounded-lg border border-amber-400/40 bg-amber-50/30 dark:bg-amber-900/10 px-4 py-3">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Take Note</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The assessment instruments in this assessment pack are <strong>summative</strong> and are to be read in conjunction with the formative assessment instruments in the Learner Workbook. Both assessments must be retained as part of the learner's <strong>portfolio of evidence</strong>.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            These are <strong>workplace knowledge-based questions</strong>. Complete each activity according to the instructions provided.
          </p>
        </div>

        {/* Activity index */}
        <div className="rounded-lg border border-border bg-background/50 overflow-hidden">
          <div className="bg-muted/40 px-4 py-2 grid grid-cols-[auto_1fr_auto] gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Activity</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Task</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Marks</span>
          </div>
          {activities.map((act) => (
            <div key={act.n} className="px-4 py-2.5 grid grid-cols-[auto_1fr_auto] gap-3 border-t border-border/60">
              <span className="text-xs font-bold text-primary w-5">{act.n}</span>
              <span className="text-xs text-foreground leading-snug">{act.question}</span>
              <span className="text-xs font-semibold text-foreground text-right">{act.marks}</span>
            </div>
          ))}
          <div className="px-4 py-2.5 border-t-2 border-foreground/20 bg-muted/20 grid grid-cols-[auto_1fr_auto] gap-3">
            <span className="text-xs font-bold col-span-2">Total</span>
            <span className="text-xs font-bold text-right">{activities.reduce((s, a) => s + a.marks, 0)}</span>
          </div>
        </div>

        {/* Countdown timer */}
        {!countdownDone && (
          <div className="rounded-lg border border-border bg-background/50 p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Read the instructions above carefully.</p>
              <p className="text-xs text-muted-foreground">The Start button enables after the reading timer expires.</p>
            </div>
            <div className="shrink-0 flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2">
              <Clock size={14} className="text-primary" />
              <span className="text-base font-bold font-mono text-primary tabular-nums">{mins}:{secs}</span>
            </div>
          </div>
        )}

        {/* Declarations */}
        <div className="rounded-lg border border-border bg-background/50 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">Learner Declaration</p>
          {([
            { key: "instructions" as const, label: "I have read and understood all the instructions and requirements of this assessment." },
            { key: "integrity" as const, label: "I declare that all work I submit is my own, and I have not received any unauthorised assistance." },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={declared[key]}
                onChange={(e) => setDeclared((p) => ({ ...p, [key]: e.target.checked }))}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors select-none">{label}</span>
            </label>
          ))}
        </div>

        {/* Download option + Start button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {downloadHref && (
            <a
              href={downloadHref}
              download
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border text-xs text-foreground font-medium px-4 py-2.5 hover:bg-secondary/50 transition-colors"
            >
              <Download size={13} /> Download as Word instead
            </a>
          )}
          <button
            onClick={() => setPage(1)}
            disabled={!canStart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {countdownDone ? "Start Assessment →" : `Wait ${mins}:${secs} to start`}
          </button>
        </div>
      </div>
    );
  }

  /* ── Review page ── */
  if (page === totalPages - 1) {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Review Your Answers</p>
          <p className="text-xs text-muted-foreground mt-0.5">Check each response before submitting. Click an activity to go back and edit.</p>
        </div>

        {activities.map((act, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-background/50 p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-xs font-bold text-primary uppercase tracking-wide">Activity {act.n} · {act.marks} marks</p>
                <p className="text-xs text-foreground leading-snug">{act.question}</p>
              </div>
              <button
                onClick={() => setPage(idx + 1)}
                className="shrink-0 text-[10px] font-medium text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-foreground whitespace-pre-wrap min-h-[3rem]">
              {answers[idx]?.trim() || <span className="italic text-muted-foreground">No answer provided</span>}
            </div>
          </div>
        ))}

        {submitError && (
          <p className="text-xs text-red-500 font-medium">{submitError}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage(activities.length)}
            className="inline-flex items-center gap-1 rounded-lg border border-border text-xs text-muted-foreground px-4 py-2.5 hover:bg-secondary/50 transition-colors"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <button
            onClick={() => {
              const text = buildSubmissionText();
              onRequestSubmit({ submissionText: text });
            }}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? "Submitting…" : "Submit Assessment"}
          </button>
        </div>
      </div>
    );
  }

  /* ── Activity question page ── */
  const actIdx = page - 1;
  const act = activities[actIdx];
  const answeredCount = activities.filter((_, i) => (answers[i] ?? "").trim().length > 0).length;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Activity {act.n} of {activities.length}</span>
          <span>{answeredCount}/{activities.length} answered</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(actIdx / activities.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Activity {act.n}</span>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
            {act.marks} {act.marks === 1 ? "mark" : "marks"}
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground leading-snug">{act.question}</p>
      </div>

      {/* Answer textarea */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Response</label>
        <textarea
          value={answers[actIdx] ?? ""}
          onChange={(e) => onAnswerChange(actIdx, e.target.value)}
          placeholder="Type your answer here…"
          rows={10}
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
        />
        <p className="text-right text-[10px] text-muted-foreground tabular-nums">
          {(answers[actIdx] ?? "").trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPage((p) => p - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-border text-xs text-muted-foreground px-4 py-2.5 hover:bg-secondary/50 transition-colors"
        >
          <ChevronLeft size={14} /> {page === 1 ? "Cover" : "Previous"}
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          {page === activities.length ? "Review & Submit" : "Next Activity"} <ChevronRight size={14} />
        </button>
      </div>

      {/* Jump to activity dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {activities.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`h-2 rounded-full transition-all ${
              i === actIdx ? "w-5 bg-primary" :
              (answers[i] ?? "").trim().length > 0 ? "w-2 bg-green-500" :
              "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
            title={`Activity ${i + 1}`}
          />
        ))}
        <button
          onClick={() => setPage(activities.length + 1)}
          className={`h-2 w-2 rounded-full transition-all ${
            page === totalPages - 1 ? "w-5 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
          }`}
          title="Review"
        />
      </div>
    </div>
  );
}
