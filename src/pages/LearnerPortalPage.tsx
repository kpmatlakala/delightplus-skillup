import AppLayout from "@/components/AppLayout";
import { modules, program } from "@/data/courseData";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Bell, Clock3, PlayCircle, Lock, ChevronRight, RefreshCw, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export default function LearnerPortalPage() {
  const { progressMap } = useModuleProgress();
  const modulePath = modules;

  // Derive progress from DB data
  const completedModules = modulePath.filter((m) => !!progressMap[m.id]?.guide_completed).length;
  const firstUndoneIndex = modulePath.findIndex((m) => !progressMap[m.id]?.guide_completed);
  const currentModuleIndex = firstUndoneIndex === -1 ? modulePath.length : firstUndoneIndex;
  const overallProgress = Math.round((completedModules / modules.length) * 100);
  const practicalModules = modules.filter((m) => m.type === "Practical").length;
  const knowledgeModules = modules.filter((m) => m.type === "Knowledge").length;
  const unreadMessages = 3;
  const upcomingCheckIn = "Friday, 09:00";
  const navigate = useNavigate();
  const [orientationOpen, setOrientationOpen] = useState(false);
  const { items: liveAnnouncements, loading: announcementsLoading, source: announcementsSource } = useAnnouncements();
  // Show pinned first, max 3, exclude Admin Only (already filtered by RLS)
  const feedItems = liveAnnouncements
    .filter((a) => a.audience !== "Admin Only")
    .slice(0, 3);

  return (
    <AppLayout title="Learner Portal" subtitle="Mission-based learning path">
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base sm:text-lg">{program.title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              SAQA {program.saqaId} • NQF {program.nqfLevel} • {modules.length} modules
            </p>
          </div>
          <div className="min-w-[14rem]">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Path progress</span>
              <span className="font-medium text-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Knowledge</p>
          <p className="font-display text-xl font-bold mt-1">{knowledgeModules}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Practical</p>
          <p className="font-display text-xl font-bold mt-1">{practicalModules}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Unread</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-display text-xl font-bold">{unreadMessages}</p>
            <MessageSquare size={16} className="text-accent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="xl:col-span-2 rounded-lg border border-border bg-card p-4">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
            <PlayCircle size={16} className="text-accent" /> Learning Path
          </h3>
          <p className="text-xs text-muted-foreground mb-3">Select a module to continue your mission path.</p>

          <div className="space-y-2 max-h-[19rem] overflow-auto pr-1">
            {/* Step 0 — Programme orientation (always unlocked, opens modal) */}
            <button
              onClick={() => setOrientationOpen(true)}
              className="w-full text-left flex items-start gap-3 rounded-md border-2 border-accent/40 bg-accent/5 px-3 py-3 transition-colors hover:bg-accent/10 group"
            >
              <div className="shrink-0 mt-0.5 h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center">
                <GraduationCap size={14} className="text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">Welcome to Information Technology: Systems Development</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                    <Sparkles size={9} /> Start Here
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Before you begin your 10-module journey — understand what a system is, what systems development means,
                  and how this qualification connects to your IT career.
                </p>
                <p className="text-xs text-accent font-medium mt-1.5 group-hover:underline">
                  Open Programme Orientation →
                </p>
              </div>
            </button>

            {/* Divider between orientation and the numbered modules */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Your 10 Modules</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {modulePath.map((mod, index) => {
              const isCompleted = !!progressMap[mod.id]?.guide_completed;
              const isCurrent = index === currentModuleIndex;
              const isLocked = index > currentModuleIndex && !isCompleted;

              return (
                <Link
                  key={mod.id}
                  to={`/learner/modules/${mod.id}`}
                  className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors ${
                    isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary/40"
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
                        {index + 1}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
                        {isCompleted && <Badge variant="outline">Done</Badge>}
                        {isCurrent && <Badge>Current</Badge>}
                        {isLocked && <Badge variant="secondary">Locked</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.code} • Block {mod.block} • {mod.credits} credits</p>
                    </div>
                  </div>

                  {isLocked ? <Lock size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
            <Bell size={16} className="text-accent" /> Ops Feed
            {announcementsSource === "db" && (
              <RefreshCw size={10} className="ml-auto text-green-500 dark:text-green-400 animate-spin" style={{ animationDuration: "4s" }} />
            )}
          </h3>
          <div className="space-y-2 mb-3">
            {announcementsLoading && (
              <div className="rounded-md border border-border p-2">
                <p className="text-xs text-muted-foreground">Loading updates…</p>
              </div>
            )}
            {!announcementsLoading && feedItems.length === 0 && (
              <div className="rounded-md border border-border p-2">
                <p className="text-xs text-muted-foreground">No announcements yet.</p>
              </div>
            )}
            {feedItems.map((item) => (
              <div key={item.id} className={`rounded-md border p-2 ${item.pinned ? "border-accent/30 bg-accent/5" : "border-border"}`}>
                {item.pinned && <p className="text-[10px] font-semibold uppercase tracking-wide text-accent mb-0.5">Pinned</p>}
                <p className="text-xs font-medium text-foreground leading-snug">{item.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{item.message}</p>
              </div>
            ))}
          </div>
          <Link
            to="/communications"
            className="flex items-center justify-end gap-1 text-[11px] text-primary hover:underline mb-2 mt-1"
          >
            Show more <ChevronRight size={11} />
          </Link>
          <div className="rounded-md border border-border p-2">
            <p className="text-xs text-muted-foreground">Next check-in</p>
            <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1.5">
              <Clock3 size={14} className="text-accent" /> {upcomingCheckIn}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-accent" /> Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-border p-2">
            <p className="text-muted-foreground">Unread communication</p>
            <p className="font-medium text-foreground mt-1">{unreadMessages} messages</p>
          </div>
          <div className="rounded-md border border-border p-2">
            <p className="text-muted-foreground">Current mission</p>
            <p className="font-medium text-foreground mt-1">{modulePath[currentModuleIndex]?.title ?? "Set module"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-accent" /> Select a Module
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Open a module to start/continue learning, preview in-app docs, and download supporting documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {modulePath.map((mod) => (
          <Link
            key={mod.id}
            to={`/learner/modules/${mod.id}`}
            className="rounded-md border border-border bg-card px-3 py-2 hover:bg-secondary/40 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
              <Badge variant="outline">{mod.type}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{mod.code} • Block {mod.block} • {mod.duration / 60}h</p>
          </Link>
        ))}
      </div>
      {/* Programme Orientation Modal */}
      <Dialog open={orientationOpen} onOpenChange={setOrientationOpen}>
        <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <GraduationCap size={18} className="text-accent" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold leading-tight">
                  Welcome to Information Technology: Systems Development
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  FETC: IT Systems Development · SAQA 78965 · NQF Level 4
                </p>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[65vh]">
            <div className="px-6 py-5 space-y-7 text-sm">

              {/* Facilitator intro */}
              <section className="rounded-lg border border-border bg-muted/30 p-4 flex items-start gap-4">
                <div className="shrink-0 h-11 w-11 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                  KM
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">Kabelo Matlakala</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Scrum Master &amp; Systems Development Facilitator · Data Science Academy</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    BSc Mathematical Sciences (University of Limpopo) · Software Developer background · Based in Limpopo, South Africa.
                    Kabelo will guide you through all 3 blocks of this qualification.
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                    <span className="text-muted-foreground">📧 <a href="mailto:matlakalakabelo1@gmail.com" className="text-accent hover:underline">matlakalakabelo1@gmail.com</a></span>
                    <span className="text-muted-foreground">📱 <a href="tel:+27727138367" className="text-accent hover:underline">+27 72 713 8367</a></span>
                  </div>
                </div>
              </section>

              {/* About the Programme */}
              <section>
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3">About the Programme</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border rounded-md overflow-hidden">
                    <tbody>
                      {([
                        ["Qualification title", "Further Education and Training Certificate: IT Systems Development"],
                        ["SAQA ID", "78965"],
                        ["NQF Level", "4"],
                        ["Total credits", "165"],
                        ["Programme duration", "15 delivery days across 3 blocks"],
                        ["Credits covered", `${modules.reduce((s, m) => s + m.credits, 0)} credits across 10 modules`],
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
              </section>

              {/* What is a System? */}
              <section>
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3">What is a System?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  A <strong className="text-foreground">system</strong> is an organised set of interrelated components that work together to achieve a defined goal.
                  An <strong className="text-foreground">information system</strong> specifically collects, processes, stores, and distributes information to support
                  an organisation's operations and decision-making.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Examples you already interact with: a student registration portal, an attendance capture tool, a results management system —
                  each takes in data, applies rules, stores records, and produces outputs (reports, certificates, notifications) that people act on.
                </p>
                <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-muted-foreground">
                  <strong className="text-foreground">Input → Process → Storage → Output</strong> — this is the structural DNA of every information
                  system you will ever build or analyse. Understanding it is the first step to building, analysing or improving one.
                </div>
              </section>

              {/* Systems Development vs Software Development */}
              <section>
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3">Systems Development vs Software Development — Are They the Same?</h4>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  These terms are often used interchangeably but they describe different scopes.
                  <strong className="text-foreground"> Software development</strong> is a <em>subset</em> of systems development — it is the phase where code is written and tested.
                  Clarifying this prevents the common misconception that this qualification is purely about programming.
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
                  <strong className="text-foreground">How they connect:</strong> every piece of software exists inside a larger organisational system.
                  The analyst's work — understanding the problem, gathering requirements, modelling data flows, designing before coding — determines
                  whether the software that gets built actually solves the right problem. In this qualification, you will think like an analyst
                  <em> and</em> write like a developer.
                </p>
              </section>

              {/* Why It Matters */}
              <section>
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3">Why Does This Matter?</h4>
                <ul className="space-y-2.5">
                  {([
                    ["Organisations run on systems", "Every business function — payroll, HR, logistics, student records — depends on reliable information systems. Understanding how they are built is foundational to any IT role."],
                    ["Poor analysis causes expensive failures", "Most IT project failures trace back not to bad code, but to misunderstood requirements. Learning to analyse before you build prevents the most costly mistakes in the field."],
                    ["NQF Level 4 opens careers", "Competence in systems development creates pathways into junior analyst, developer, business analyst support and project coordination roles — all in high demand across South African industry."],
                    ["Modelling professional practice", "Demonstrating structured thinking — breaking a problem down, gathering requirements, designing before coding — is the professional standard you will carry into the workplace."],
                  ] as [string, string][]).map(([title, detail]) => (
                    <li key={title} className="flex gap-2 text-muted-foreground text-xs">
                      <span className="text-accent mt-0.5 shrink-0">›</span>
                      <span><strong className="text-foreground">{title}:</strong> {detail}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Module Roadmap */}
              <section>
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3">Module Roadmap — All 10 Units</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border rounded-md overflow-hidden">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-1.5 px-2 text-left font-semibold">#</th>
                        <th className="py-1.5 px-2 text-left font-semibold">Code</th>
                        <th className="py-1.5 px-2 text-left font-semibold">Title</th>
                        <th className="py-1.5 px-2 text-left font-semibold whitespace-nowrap">Block</th>
                        <th className="py-1.5 px-2 text-right font-semibold">Credits</th>
                        <th className="py-1.5 px-2 text-left font-semibold">What you will be able to do</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        [1, "ITSD-14924", "Information Systems Analysis", "Block 1 · Day 1", 3, "Describe the SDLC, the analyst's role, information-gathering techniques, DFDs, decision tables and CASE tools"],
                        [2, "ITSD-14920", "Team Collaboration & Problem Solving", "Block 1 · Day 2", 3, "Contribute effectively to team problem-solving using structured techniques"],
                        [3, "ITSD-14918", "Programming Principles Introduction", "Block 1 · Day 3", 5, "Explain data types, control structures and write pseudocode for simple problems"],
                        [4, "ITSD-14927", "Apply Problem-Solving Strategies", "Block 1 · Day 4", 4, "Analyse workplace problems, evaluate solutions and develop an implementation plan"],
                        [5, "ITSD-14915", "Design a Computer Program to Specification", "Block 1 · Day 5", 8, "Design programs using structure diagrams, decision tables, pseudocode and desk-checking"],
                        [6, "ITSD-14910", "Apply Programming Principles", "Block 2 · Days 6–7", 8, "Write, test and debug structured programs applying control structures and error handling"],
                        [7, "ITSD-14933", "Web Scripting", "Block 2 · Days 8–9", 6, "Build interactive web pages using HTML5, CSS3 and JavaScript"],
                        [8, "ITSD-14908", "Testing IT Systems", "Block 3 · Day 11", 6, "Design test cases, execute test plans and apply quality assurance principles"],
                        [9, "ITSD-14919", "Resolve User Problems", "Block 3 · Day 12", 5, "Diagnose and resolve common IT user problems using structured troubleshooting"],
                        [10, "ITSD-120379", "Work as Project Team Member", "Block 3 · Day 13", 8, "Participate effectively in a project team and manage deliverables"],
                      ] as [number, string, string, string, number, string][]).map(([num, code, title, block, credits, purpose]) => (
                        <tr key={code} className="border-b last:border-0 odd:bg-muted/30">
                          <td className="py-1.5 px-2 text-muted-foreground">{num}</td>
                          <td className="py-1.5 px-2 font-mono">{code}</td>
                          <td className="py-1.5 px-2 font-medium">{title}</td>
                          <td className="py-1.5 px-2 text-muted-foreground whitespace-nowrap">{block}</td>
                          <td className="py-1.5 px-2 text-right tabular-nums">{credits}</td>
                          <td className="py-1.5 px-2 text-muted-foreground">{purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  <strong className="text-foreground">Note:</strong> Day 10 is a PoE consolidation day — no new content is delivered.
                  Use this day to organise your portfolio evidence and prepare questions for Block 3.
                </p>
              </section>

            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                Ready to start your first unit? Module 1 covers information systems analysis — the foundation of everything that follows.
              </p>
            </div>
            <Button
              className="gap-2 shrink-0"
              onClick={() => { setOrientationOpen(false); navigate("/learner/modules/14924"); }}
            >
              Begin — Information Systems Analysis
              <ArrowRight size={15} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
