import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import ModuleCard from "@/components/ModuleCard";
import { PresentationMode } from "@/components/PresentationMode";
import { modules, program, learners } from "@/data/courseData";
import { BookOpen, Users, Award, CheckCircle, GraduationCap, Play, CalendarCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const navigate = useNavigate();
  const [enrolledCount, setEnrolledCount] = useState<number>(learners.length);
  const [isPresentingBriefing, setIsPresentingBriefing] = useState(false);
  const totalModules = modules.length;
  const readyModules = modules.filter((m) => m.status === "Ready").length;
  const totalCredits = modules.reduce((sum, m) => sum + m.credits, 0);

  useEffect(() => {
    const loadEnrolledCount = async () => {
      const rpc = supabase as unknown as {
        rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: Array<{ id: string }> | null; error: { message: string } | null }>;
      };

      const { data, error } = await rpc.rpc("dsa_enrolled_learners");
      if (!error) {
        setEnrolledCount((data ?? []).length);
      }
    };

    loadEnrolledCount();
  }, []);

  return (
    <AppLayout title="Dashboard" subtitle="DSA Learning Management System">
      {/* Program banner */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display font-semibold text-sm text-foreground leading-tight">{program.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              NQF Level {program.nqfLevel} • {program.totalCredits} Total Credits • {program.provider}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPresentingBriefing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold transition-colors"
            >
              <Play size={11} className="fill-current" /> Present Briefing
            </button>
            <span className="text-xs font-medium text-accent">{totalCredits}/{program.totalCredits} credits</span>
            <Progress value={(totalCredits / program.totalCredits) * 100} className="w-24 h-1.5" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total Modules" value={totalModules} icon={<BookOpen size={16} />} variant="accent" />
        <StatCard label="Modules Ready" value={readyModules} icon={<CheckCircle size={16} />} variant="success" />
        <StatCard label="Total Credits" value={totalCredits} icon={<Award size={16} />} />
        <StatCard label="Enrolled Learners" value={enrolledCount} icon={<Users size={16} />} variant="warning" />
      </div>

      {/* Learner Portal QR Invite */}
      <div className="rounded-lg border border-border bg-card px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="shrink-0 p-1.5 bg-white rounded-xl">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=https%3A%2F%2Fcetconnect.netlify.app%2Fauth%2Fsignup&margin=3&color=1e1b4b&bgcolor=ffffff"
            alt="Learner portal signup QR code"
            width={96}
            height={96}
            className="block rounded-lg"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Learner Portal Access</p>
          <p className="font-semibold text-sm text-foreground">Invite learners to register on CET Connect</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Learners scan this QR code — or open the link below — to create their account and access course content.
          </p>
          <a
            href="https://cetconnect.netlify.app/auth/signup"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-1.5 text-xs text-accent hover:underline font-medium"
          >
            cetconnect.netlify.app/auth/signup
          </a>
        </div>
      </div>

      {/* Programme Introduction — facilitator briefing */}
      <Accordion type="single" collapsible className="mb-5">
        <AccordionItem value="programme-intro" className="rounded-lg border border-border bg-card">
          <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-accent shrink-0" />
              <span>FETC: IT Systems Development — Programme Introduction &amp; Facilitator Briefing</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-5 space-y-6 text-sm">

            {/* Facilitator intro */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-start gap-4">
              <div className="shrink-0 h-11 w-11 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                KM
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">Kabelo Matlakala — Your Facilitator</p>
                <p className="text-xs text-muted-foreground mt-0.5">Scrum Master &amp; Systems Development Facilitator · Data Science Academy · Starting March 2026</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  BSc Mathematical Sciences, University of Limpopo. Software Developer background (mLab CodeTribe Academy). Based in Limpopo Province.
                  Kabelo delivers this qualification and is the primary point of contact for learner support across all 3 blocks.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                  <span className="text-muted-foreground">📧 <a href="mailto:matlakalakabelo1@gmail.com" className="text-accent hover:underline">matlakalakabelo1@gmail.com</a></span>
                  <span className="text-muted-foreground">📱 <a href="tel:+27727138367" className="text-accent hover:underline">+27 72 713 8367</a></span>
                </div>
              </div>
            </div>

            {/* About the Programme */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">About the Programme</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border rounded-md overflow-hidden">
                  <tbody>
                    {([
                      ["Qualification title", "Further Education and Training Certificate: IT Systems Development"],
                      ["SAQA ID", "78965"],
                      ["NQF Level", "4"],
                      ["Total credits", "165"],
                      ["Programme duration", "15 delivery days across 3 blocks"],
                      ["Credits covered", `${totalCredits} credits across 10 modules (${Math.round((totalCredits / program.totalCredits) * 100)}% of qualification)`],
                      ["Provider", program.provider],
                    ] as [string, string][]).map(([label, value]) => (
                      <tr key={label} className="border-b last:border-0 odd:bg-muted/30">
                        <td className="py-1.5 px-3 text-muted-foreground w-44 font-medium">{label}</td>
                        <td className="py-1.5 px-3">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* What is IT? */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">What is Information Technology?</h4>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Information Technology (IT)</strong> is the combination of hardware and software products and services that organisations use to
                manage, access, communicate, and share information. IT is not just computers — it is the invisible infrastructure that underpins every
                business function, from student records and payroll to logistics and customer service.
              </p>
              <p className="text-xs font-semibold text-foreground mt-3 mb-1.5">Three Forces Shaping the Future of IT</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {([
                  "Changes in the world — globalisation, remote work, digital transformation, and the demand for real-time information access across every sector",
                  "Changes in technology — faster processors, cloud computing, artificial intelligence, mobile platforms, and exponential data growth (Moore's Law: processing power roughly doubles every two years)",
                  "Changes in client demand — organisations and end users expect systems that are faster, more intuitive, more accessible, and more secure than ever before",
                ] as string[]).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent shrink-0 mt-0.5">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-muted-foreground">
                As systems developers, learners will design, build and maintain the IT infrastructure that organisations depend on.
                Understanding <em>what IT is</em> — and why it must be carefully planned — is the foundation on which every other unit in this qualification rests.
              </div>
            </div>

            {/* What is a System? */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">What is a System?</h4>
              <p className="text-muted-foreground leading-relaxed">
                A <strong>system</strong> is an organised set of interrelated components that work together to achieve a defined goal. An{" "}
                <strong>information system</strong> specifically collects, processes, stores, and distributes information to support an organisation's
                operations and decision-making.
              </p>
              <p className="text-xs font-semibold text-foreground mt-3 mb-1.5">Information Systems Learners Already Interact With</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {([
                  "Student registration portal — captures enrolment data, checks eligibility, generates student numbers and timetables",
                  "Attendance tracking tool — records daily sign-ins, flags patterns, produces reports for the Department of Education",
                  "Results management system — stores marks, calculates averages, generates transcripts and certificates",
                  "Online banking portal — takes a transaction instruction, validates it, updates balances, sends a confirmation",
                ] as string[]).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent shrink-0 mt-0.5">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-muted-foreground">
                <strong>Input → Process → Storage → Output</strong> — every system takes in data, applies rules, retains records, and produces something
                people act on. This is the structural DNA of every information system in the field.
              </div>
            </div>

            {/* What is Systems Development? */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">What is Systems Development?</h4>
              <p className="text-muted-foreground leading-relaxed">
                Systems development is the end-to-end discipline of planning, analysing, designing, building, testing and maintaining information systems.
                It is not only about writing code — it is about ensuring the right system gets built in the first place, that it works correctly,
                and that it keeps working reliably after it is deployed.
              </p>
              <p className="text-xs font-semibold text-foreground mt-3 mb-1.5">The Six Phases of the Systems Development Life Cycle</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-1.5 px-3 text-left font-semibold whitespace-nowrap">Phase</th>
                      <th className="py-1.5 px-3 text-left font-semibold">Description</th>
                      <th className="py-1.5 px-3 text-left font-semibold">Key Deliverable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      ["1. Investigation", "Identify the business problem or opportunity; assess whether a system project is justified before committing resources", "Feasibility recommendation"],
                      ["2. Analysis", "Establish in detail WHAT the system must do: requirements, data flows, user needs, volume estimates, constraints", "Requirements specification"],
                      ["3. Design", "Specify HOW the system will work: architecture, data structures, module structure, user interfaces", "Logical and physical design documents"],
                      ["4. Development", "Write and unit-test the program code based on the approved design documents", "Tested, accepted system"],
                      ["5. Implementation", "Deploy the system, convert existing data, train users, manage transition from old to new", "Live operational system"],
                      ["6. Maintenance", "Monitor for defects, apply fixes and enhancements, plan future iterations or replacement", "Updated, supported system"],
                    ] as [string, string, string][]).map(([phase, desc, deliverable]) => (
                      <tr key={phase} className="border-b last:border-0 odd:bg-muted/30">
                        <td className="py-1.5 px-3 font-medium whitespace-nowrap">{phase}</td>
                        <td className="py-1.5 px-3 text-muted-foreground">{desc}</td>
                        <td className="py-1.5 px-3 text-muted-foreground">{deliverable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-muted-foreground">
                Notice that coding (phase 4) only appears more than halfway through. The Standish CHAOS Report consistently finds fewer than 30% of
                IT projects complete on time, on budget, to spec — the leading root cause is inadequate analysis, not bad code.
              </div>
            </div>

            {/* Systems Development vs Software Development */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Systems Development vs Software Development — Are They the Same?</h4>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These terms are often used interchangeably but they describe different scopes. <strong>Software development</strong> is a{" "}
                <em>subset</em> of systems development — it is the phase where code is written and tested. Clarifying this prevents the
                common misconception that this qualification is purely about programming.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-1.5 px-3 text-left font-semibold">Aspect</th>
                      <th className="py-1.5 px-3 text-left font-semibold">Systems Development</th>
                      <th className="py-1.5 px-3 text-left font-semibold">Software Development</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      ["Scope", "End-to-end: people, process, data, technology", "Primarily code — design, write, test, deploy"],
                      ["Starting point", "Business problem or organisational need", "Requirements spec handed to developers"],
                      ["Who is involved", "Analysts, users, managers, developers, QA, trainers", "Developers, testers, DevOps engineers"],
                      ["Key output", "A working solution that solves the business problem", "A software artefact — application, API, script"],
                      ["SDLC position", "Spans all 6 phases — investigation to maintenance", "Primarily phases 4–5 (development & implementation)"],
                      ["NQF framing", "Recognised SA qualification framing (SAQA 78965)", "Usually vendor-specific certifications"],
                    ] as [string, string, string][]).map(([aspect, sd, sw]) => (
                      <tr key={aspect} className="border-b last:border-0 odd:bg-muted/30">
                        <td className="py-1.5 px-3 text-muted-foreground font-medium">{aspect}</td>
                        <td className="py-1.5 px-3">{sd}</td>
                        <td className="py-1.5 px-3">{sw}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3">
                <strong>How they connect:</strong> every piece of software exists inside a larger organisational system. The analyst's work —
                understanding the problem, gathering requirements, modelling data flows, designing before coding — determines whether the software
                that gets built actually solves the right problem. In this qualification, learners do both: they think like analysts <em>and</em> write
                like developers.
              </p>
            </div>

            {/* Why It Matters */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Why Does This Matter?</h4>
              <ul className="space-y-2 text-muted-foreground">
                {([
                  ["Organisations run on systems", "Every business function — payroll, HR, logistics, student records — depends on reliable information systems. Understanding how they are built is foundational to any IT role."],
                  ["Poor analysis causes expensive failures", "Most IT project failures trace back not to bad code, but to misunderstood requirements. Teaching learners to analyse before they build prevents the most costly mistakes in the field."],
                  ["NQF Level 4 opens careers", "Competence in systems development creates pathways into junior analyst, developer, business analyst support and project coordination roles — all in high demand across South African industry."],
                  ["Modelling professional practice", "As CET lecturers, demonstrating structured thinking — breaking a problem down, gathering requirements, designing before coding — sets the standard your learners carry into the workplace."],
                ] as [string, string][]).map(([title, detail]) => (
                  <li key={title} className="flex gap-2">
                    <span className="text-accent mt-0.5 shrink-0">›</span>
                    <span><strong>{title}:</strong> {detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Module Roadmap */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Module Roadmap — All 10 Units</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-1.5 px-3 text-left font-semibold">#</th>
                      <th className="py-1.5 px-3 text-left font-semibold">Code</th>
                      <th className="py-1.5 px-3 text-left font-semibold">Title</th>
                      <th className="py-1.5 px-3 text-left font-semibold whitespace-nowrap">Block</th>
                      <th className="py-1.5 px-3 text-right font-semibold">Credits</th>
                      <th className="py-1.5 px-3 text-left font-semibold">What learners will be able to do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      [1, "ITSD-14924", "Information Systems Analysis", "Block 1 · Day 1", 3, "Describe the SDLC, the analyst's role, information-gathering techniques, DFDs, decision tables and CASE tools"],
                      [2, "ITSD-14920", "Team Collaboration & Problem Solving", "Block 1 · Day 2", 3, "Contribute effectively to team problem-solving using structured techniques and identify qualities of effective team members"],
                      [3, "ITSD-14918", "Programming Principles Introduction", "Block 1 · Day 3", 5, "Explain data types, control structures and write pseudocode for simple problems"],
                      [4, "ITSD-14927", "Apply Problem-Solving Strategies", "Block 1 · Day 4", 4, "Analyse workplace problems, evaluate solutions against criteria, and develop an implementation plan"],
                      [5, "ITSD-14915", "Design a Computer Program to Specification", "Block 1 · Day 5", 8, "Design programs using structure diagrams, decision tables, pseudocode and desk-checking"],
                      [6, "ITSD-14910", "Apply Programming Principles", "Block 2 · Days 6–7", 8, "Write, test and debug structured programs applying data types, functions, control structures and error handling"],
                      [7, "ITSD-14933", "Web Scripting", "Block 2 · Days 8–9", 6, "Build interactive web pages using HTML5, CSS3 and JavaScript with DOM manipulation and responsive design"],
                      [8, "ITSD-14908", "Testing IT Systems", "Block 3 · Day 11", 6, "Design test cases, execute test plans, log defects and apply quality assurance principles"],
                      [9, "ITSD-14919", "Resolve User Problems", "Block 3 · Day 12", 5, "Diagnose and resolve common IT user problems using structured troubleshooting methodology"],
                      [10, "ITSD-120379", "Work as Project Team Member", "Block 3 · Day 13", 8, "Participate effectively in a project team, manage deliverables and communicate with stakeholders"],
                    ] as [number, string, string, string, number, string][]).map(([num, code, title, block, credits, purpose]) => (
                      <tr key={code} className="border-b last:border-0 odd:bg-muted/30">
                        <td className="py-1.5 px-3 text-muted-foreground">{num}</td>
                        <td className="py-1.5 px-3 font-mono">{code}</td>
                        <td className="py-1.5 px-3 font-medium">{title}</td>
                        <td className="py-1.5 px-3 text-muted-foreground whitespace-nowrap">{block}</td>
                        <td className="py-1.5 px-3 text-right tabular-nums">{credits}</td>
                        <td className="py-1.5 px-3 text-muted-foreground">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                <strong>Note:</strong> Day 10 is a PoE consolidation day — no new content is delivered. Learners use this day to organise
                evidence, complete outstanding activities, and prepare questions for Block 3.
              </p>
            </div>

            {/* How the SA&D Course Unfolds */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">How the SA&amp;D Course Unfolds — Lecture to SDLC Mapping</h4>
              <p className="text-muted-foreground leading-relaxed mb-3 text-xs">
                The ten lectures in the Systems Analysis &amp; Design unit standard (ITSD-14924) map directly onto the SDLC. Every lecture from Day 1 onward builds on the analytical foundations established in Session 1.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-1.5 px-3 text-left font-semibold whitespace-nowrap">Lecture</th>
                      <th className="py-1.5 px-3 text-left font-semibold">Topic</th>
                      <th className="py-1.5 px-3 text-left font-semibold whitespace-nowrap">SDLC Phase</th>
                      <th className="py-1.5 px-3 text-left font-semibold">Builds on Day 1 by…</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      ["L1 — Today", "Introduction to Information Systems", "Analysis", "Establishing analyst roles, the SDLC, IS components, and information-gathering techniques"],
                      ["L2", "Systems Project Management", "All phases", "Scoping and planning the project your feasibility study defines"],
                      ["L3", "Requirements Modelling", "Analysis", "Deepening requirements gathering with JAD, RAD, and Agile iteration"],
                      ["L4", "Data & Process Modelling", "Analysis → Design", "Expanding DFD foundations into levelled diagrams and physical design"],
                      ["L5 & L6", "Object Modelling", "Analysis → Design", "Developing OO concepts into full UML: class diagrams, use cases, sequence diagrams"],
                      ["L7", "Data Design", "Design", "Converting data analysis outputs into ERDs, normalised tables, and referential integrity rules"],
                      ["L8", "Development Strategies & Implementation", "Design → Implementation", "Using analyst recommendation to drive acquisition and changeover strategy"],
                      ["L9", "User Interface Design", "Design", "Translating requirements into screens, forms, reports, and validation rules"],
                      ["L10", "System Support & Security", "Maintenance", "Enabling maintenance and security audits using documentation produced during analysis"],
                    ] as [string, string, string, string][]).map(([lecture, topic, phase, builds]) => (
                      <tr key={lecture} className="border-b last:border-0 odd:bg-muted/30">
                        <td className="py-1.5 px-3 font-mono whitespace-nowrap">{lecture}</td>
                        <td className="py-1.5 px-3 font-medium">{topic}</td>
                        <td className="py-1.5 px-3 text-muted-foreground whitespace-nowrap">{phase}</td>
                        <td className="py-1.5 px-3 text-muted-foreground">{builds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground mt-2 text-xs italic">
                Day 1 is the trunk of the tree — every lecture that follows is a branch growing from the analytical roots established in Session 1.
              </p>
            </div>

          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Block overview */}
      {[1, 2, 3].map((block) => {
        const blockModules = modules.filter((m) => m.block === block);
        if (blockModules.length === 0) return null;
        return (
          <div key={block} className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
              <CalendarCheck size={13} className="text-accent" />
              Block {block}
              <span className="font-normal normal-case">
                — {blockModules.length} modules · {blockModules.reduce((s, m) => s + m.credits, 0)} credits
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {blockModules.map((mod) => (
                <ModuleCard key={mod.id} module={mod} />
              ))}
            </div>
          </div>
        );
      })}
      {isPresentingBriefing && (
        <PresentationMode
          mode="briefing"
          isAdmin={true}
          onClose={() => setIsPresentingBriefing(false)}
          nextUnitId={modules[0]?.id}
          nextUnitTitle={modules[0]?.title}
          routePrefix="/modules"
        />
      )}
    </AppLayout>
  );
}
