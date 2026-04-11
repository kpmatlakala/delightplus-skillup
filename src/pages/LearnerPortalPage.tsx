import AppLayout from "@/components/AppLayout";
import { modules, program } from "@/data/courseData";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  PlayCircle,
  Lock,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { BLOCK_ASSESSMENTS } from "@/data/blockAssessments";

export default function LearnerPortalPage() {
  const { user } = useAuth();
  const { progressMap } = useModuleProgress();
  const unreadMessages = useUnreadCount(user?.id ?? null);

  const modulePath = modules;
  const completedModules = modulePath.filter(
    (m) => !!progressMap[m.id]?.guide_completed,
  ).length;
  const firstUndoneIndex = modulePath.findIndex(
    (m) => !progressMap[m.id]?.guide_completed,
  );
  const currentModuleIndex =
    firstUndoneIndex === -1 ? modulePath.length : firstUndoneIndex;
  const practicalModules = modules.filter((m) => m.type === "Practical").length;
  const knowledgeModules = modules.filter((m) => m.type === "Knowledge").length;

  const [orientationOpen, setOrientationOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <AppLayout title="Learner Portal" subtitle="Mission-based learning path">
      <div className="space-y-4 px-2 sm:px-0">
        {/* Stats cards - Single row on all devices */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-lg border border-border bg-card p-2 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between sm:block">
              <p className="text-[10px] sm:text-sm text-muted-foreground whitespace-nowrap">
                Knowledge
              </p>
              <BookOpen size={16} className="text-accent sm:hidden" />
            </div>
            <p className="font-display text-lg sm:text-3xl font-bold mt-0.5 sm:mt-1">
              {knowledgeModules}
            </p>
            <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block">
              Theoretical
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-2 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between sm:block">
              <p className="text-[10px] sm:text-sm text-muted-foreground whitespace-nowrap">
                Practical
              </p>
              <Trophy size={16} className="text-accent sm:hidden" />
            </div>
            <p className="font-display text-lg sm:text-3xl font-bold mt-0.5 sm:mt-1">
              {practicalModules}
            </p>
            <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block">
              Labs
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-2 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between sm:block">
              <p className="text-[10px] sm:text-sm text-muted-foreground whitespace-nowrap">
                Unread
              </p>
              <MessageSquare size={16} className="text-accent sm:hidden" />
            </div>
            <div className="flex items-center justify-between mt-0.5 sm:mt-1">
              <p className="font-display text-lg sm:text-3xl font-bold">
                {unreadMessages}
              </p>
              <MessageSquare
                size={14}
                className="text-accent hidden sm:block"
              />
            </div>
            <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block">
              {unreadMessages === 0
                ? "No new"
                : `${unreadMessages} msg${unreadMessages > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Progress Bar - Right after stats */}
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="w-full sm:w-auto">
              <p className="text-xs text-muted-foreground">Overall Progress</p>
              <p className="text-sm font-semibold text-foreground sm:hidden">
                {completedModules} of {modules.length} modules
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${Math.round((completedModules / modules.length) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs font-semibold text-foreground whitespace-nowrap">
                  {Math.round((completedModules / modules.length) * 100)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {completedModules} of {modules.length} completed
            </p>
          </div>
        </div>

        {/* Block Assessments */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-accent" />
              <h3 className="font-display font-semibold text-sm sm:text-base">
                Block Assessments
              </h3>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Access your summative block tests here. Block 1 is currently open for in-app testing.
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
            {BLOCK_ASSESSMENTS.map((block) => {
              const isReady = block.status === "ready";
              const blockProgress = progressMap[`block-${block.blockNum}`];
              const isSubmitted = Boolean(
                blockProgress?.assessment_submitted ||
                blockProgress?.assessment_submitted_at ||
                blockProgress?.submission_uploaded_at ||
                blockProgress?.submission_path
              );

              return (
                <div
                  key={block.blockNum}
                  className={`rounded-lg border p-3 ${
                    isReady
                      ? "border-primary/30 bg-primary/5"
                      : "border-dashed border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Block {block.blockNum}
                      </p>
                      <p className="text-sm font-semibold text-foreground leading-snug mt-1">
                        {block.label.replace(/^Block\s\d+\s—\s/, "")}
                      </p>
                    </div>
                    <Badge
                      variant={isSubmitted ? "default" : "outline"}
                      className="text-[10px] whitespace-nowrap"
                    >
                      {isSubmitted ? "Submitted" : isReady ? "Ready" : "Soon"}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-2">
                    {block.date}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {block.units.length} units • {block.totalMarks} marks
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-2 line-clamp-3">
                    {block.units.join(" • ")}
                  </p>

                  {isReady ? (
                    <Link
                      to={block.route}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {isSubmitted ? "View Submission" : block.ctaLabel}
                      <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <span className="mt-3 inline-flex items-center rounded-md border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                      Placeholder for now
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Path */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PlayCircle size={18} className="text-accent" />
              <h3 className="font-display font-semibold text-sm sm:text-base">
                Learning Path
              </h3>
            </div>
            {completedModules > 0 && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 size={12} className="mr-1" />
                {completedModules}/{modules.length} Done
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Select a module to continue your mission path.
          </p>

          <div className="space-y-2 max-h-[calc(100vh-450px)] sm:max-h-[19rem] overflow-auto pr-1">
            {/* Orientation button - Mobile optimized */}
            <button
              onClick={() => setOrientationOpen(true)}
              className="w-full text-left flex items-start gap-2 sm:gap-3 rounded-md border-2 border-accent/40 bg-accent/5 px-2 sm:px-3 py-2 sm:py-3 transition-colors hover:bg-accent/10 group"
            >
              <div className="shrink-0 mt-0.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-accent/20 flex items-center justify-center">
                <GraduationCap size={14} className="text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start sm:items-center gap-1 sm:gap-2 flex-wrap">
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    Welcome to IT: Systems Development
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-accent whitespace-nowrap">
                    <Sparkles size={8} className="sm:size-9" /> Start Here
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Before you begin your 11-module journey — understand what a
                  system is, what systems development means, and how this
                  qualification connects to your IT career.
                </p>
                <span className="mt-2 inline-flex items-center gap-1 sm:gap-1.5 rounded-md bg-accent px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-accent-foreground shadow-sm group-hover:bg-accent/90 transition-colors">
                  Open Programme Orientation →
                </span>
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Your {modules.length} Modules
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Module list - Mobile optimized */}
            <div className="space-y-2">
              {modulePath.map((mod, index) => {
                const isCompleted = !!progressMap[mod.id]?.guide_completed;
                const isCurrent = index === currentModuleIndex;
                const isLocked = index > currentModuleIndex && !isCompleted;
                return (
                  <Link
                    key={mod.id}
                    to={`/learner/modules/${mod.id}`}
                    className={`flex items-center justify-between gap-2 sm:gap-3 rounded-md border px-2 sm:px-3 py-2 transition-colors ${
                      isCurrent
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-secondary/40"
                    }`}
                  >
                    <div className="min-w-0 flex items-center gap-2 sm:gap-2.5 flex-1">
                      <Avatar className="h-6 w-6 sm:h-7 sm:w-7 shrink-0">
                        <AvatarFallback className="text-[10px] sm:text-[11px] font-bold bg-primary/10 text-primary">
                          {index + 1}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[140px] sm:max-w-none">
                            {mod.title}
                          </p>
                          <div className="flex gap-1">
                            {isCompleted && (
                              <Badge
                                variant="outline"
                                className="text-[9px] sm:text-xs px-1 sm:px-2"
                              >
                                ✓
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge className="text-[9px] sm:text-xs px-1 sm:px-2">
                                Current
                              </Badge>
                            )}
                            {isLocked && (
                              <Badge
                                variant="secondary"
                                className="text-[9px] sm:text-xs px-1 sm:px-2"
                              >
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 hidden xs:block">
                          {mod.code} • Block {mod.block} • {mod.credits} credits
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 xs:hidden">
                          {mod.code} • {mod.credits}c
                        </p>
                      </div>
                    </div>
                    {isLocked ? (
                      <Lock
                        size={12}
                        className="text-muted-foreground shrink-0 sm:size-14"
                      />
                    ) : (
                      <ChevronRight
                        size={12}
                        className="text-muted-foreground shrink-0 sm:size-14"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Programme Orientation Modal - Fixed Footer Visibility */}
      <Dialog open={orientationOpen} onOpenChange={setOrientationOpen}>
        <DialogContent className="max-w-3xl w-[95vw] p-0 gap-0 overflow-hidden rounded-lg max-h-[96vh] sm:max-h-[96vh] flex flex-col">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-border shrink-0 bg-background">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <GraduationCap size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-sm sm:text-base font-bold leading-tight">
                  Welcome to IT: Systems Development
                </DialogTitle>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 break-words">
                  FETC: IT Systems Development · SAQA 78965 · NQF Level 4
                </p>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto min-h-0">
            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-5 sm:space-y-7 pb-6">
              {/* Facilitator Card - Mobile optimized */}
              <section className="rounded-lg border border-border bg-muted/30 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm sm:text-base mx-auto sm:mx-0">
                    KM
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      Kabelo Matlakala
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your Facilitator · Scrum Master & Systems Development
                      Facilitator
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                      BSc Mathematical Sciences, University of Limpopo. Software
                      Developer background (mLab CodeTribe Academy). Based in
                      Limpopo Province.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 text-xs">
                      <span className="text-muted-foreground break-all flex items-center gap-1 justify-center sm:justify-start">
                        <span className="text-base">📧</span>
                        <a
                          href="mailto:matlakalakabelo1@gmail.com"
                          className="text-accent hover:underline break-all"
                        >
                          matlakalakabelo1@gmail.com
                        </a>
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
                        <span className="text-base">📱</span>
                        <a
                          href="tel:+27727138367"
                          className="text-accent hover:underline"
                        >
                          +27 72 713 8367
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* About Programme - Responsive layout */}
              <section>
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="h-px flex-1 bg-border sm:hidden"></span>
                  About the Programme
                  <span className="h-px flex-1 bg-border sm:hidden"></span>
                </h4>
                <div className="space-y-2">
                  {[
                    ["Qualification", "FETC: IT Systems Development"],
                    ["SAQA ID", "78965"],
                    ["NQF Level", "4"],
                    ["Total credits", "165"],
                    ["Duration", "15 delivery days / 3 blocks"],
                    ["Provider", "Data Science Academy"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row py-2 border-b border-border last:border-0"
                    >
                      <div className="sm:w-32 sm:flex-shrink-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          {label}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Module Roadmap - Enhanced responsive */}
              <section>
                <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="h-px flex-1 bg-border sm:hidden"></span>
                  Module Roadmap — All 11 Units
                  <span className="h-px flex-1 bg-border sm:hidden"></span>
                </h4>

                {/* Mobile Card View (visible on mobile) */}
                <div className="block sm:hidden space-y-3">
                  {[
                    [
                      1,
                      "ITSD-14924",
                      "Information Systems Analysis",
                      "B1 · D1",
                      3,
                    ],
                    [2, "ITSD-14920", "Team Collaboration", "B1 · D2", 3],
                    [
                      3,
                      "ITSD-14918",
                      "Programming Principles Intro",
                      "B1 · D3",
                      5,
                    ],
                    [
                      4,
                      "ITSD-14927",
                      "Problem-Solving Strategies",
                      "B1 · D4",
                      4,
                    ],
                    [
                      5,
                      "ITSD-14915",
                      "Design a Computer Program",
                      "B1 · D5",
                      8,
                    ],
                    [
                      6,
                      "ITSD-14910",
                      "Apply Programming Principles",
                      "B2 · D6-7",
                      8,
                    ],
                    [
                      7,
                      "ITSD-14930",
                      "Developing Software for the Internet",
                      "B2 · Integrated",
                      3,
                    ],
                    [8, "ITSD-14933", "Web Scripting", "B2 · D8-9", 6],
                    [9, "ITSD-14908", "Testing IT Systems", "B3 · D11", 6],
                    [10, "ITSD-14919", "Resolve User Problems", "B3 · D12", 5],
                    [
                      11,
                      "ITSD-120379",
                      "Work as Project Team Member",
                      "B3 · D13",
                      8,
                    ],
                  ].map(([num, code, title, block, credits]) => (
                    <div
                      key={code}
                      className="rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {num}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">
                            {code}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {credits} credits
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {title}
                      </p>
                      <p className="text-xs text-muted-foreground">{block}</p>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (hidden on mobile) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-xs border rounded-md overflow-hidden">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-2 px-3 text-left font-semibold">#</th>
                        <th className="py-2 px-3 text-left font-semibold">
                          Code
                        </th>
                        <th className="py-2 px-3 text-left font-semibold">
                          Title
                        </th>
                        <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">
                          Block
                        </th>
                        <th className="py-2 px-3 text-right font-semibold">
                          Credits
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          1,
                          "ITSD-14924",
                          "Information Systems Analysis",
                          "B1 · D1",
                          3,
                        ],
                        [2, "ITSD-14920", "Team Collaboration", "B1 · D2", 3],
                        [
                          3,
                          "ITSD-14918",
                          "Programming Principles Intro",
                          "B1 · D3",
                          5,
                        ],
                        [
                          4,
                          "ITSD-14927",
                          "Problem-Solving Strategies",
                          "B1 · D4",
                          4,
                        ],
                        [
                          5,
                          "ITSD-14915",
                          "Design a Computer Program",
                          "B1 · D5",
                          8,
                        ],
                        [
                          6,
                          "ITSD-14910",
                          "Apply Programming Principles",
                          "B2 · D6-7",
                          8,
                        ],
                        [
                          7,
                          "ITSD-14930",
                          "Developing Software for the Internet",
                          "B2 · Integrated",
                          3,
                        ],
                        [8, "ITSD-14933", "Web Scripting", "B2 · D8-9", 6],
                        [9, "ITSD-14908", "Testing IT Systems", "B3 · D11", 6],
                        [
                          10,
                          "ITSD-14919",
                          "Resolve User Problems",
                          "B3 · D12",
                          5,
                        ],
                        [
                          11,
                          "ITSD-120379",
                          "Work as Project Team Member",
                          "B3 · D13",
                          8,
                        ],
                      ].map(([num, code, title, block, credits]) => (
                        <tr
                          key={code}
                          className="border-b last:border-0 odd:bg-muted/30"
                        >
                          <td className="py-2 px-3 text-muted-foreground">
                            {num}
                          </td>
                          <td className="py-2 px-3 font-mono text-xs">
                            {code}
                          </td>
                          <td className="py-2 px-3 font-medium">{title}</td>
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {block}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums">
                            {credits}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-muted-foreground mt-3 text-[10px] sm:text-xs text-center sm:text-left bg-muted/30 p-2 rounded-md">
                  <strong className="text-foreground">📌 Note:</strong> Day 10
                  is PoE consolidation — no new content.
                </p>
              </section>
            </div>
          </ScrollArea>

          {/* Footer - Fixed with better mobile visibility */}
          <DialogFooter className="px-4 sm:px-6 py-4 border-t border-border bg-background shrink-0 mt-auto">
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full">
              
              <Button
                className="gap-2 w-full sm:w-auto order-1 sm:order-2"
                onClick={() => {
                  setOrientationOpen(false);
                  navigate("/learner/modules/14924");
                }}
              >
                Begin Learning
                <ArrowRight size={15} />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
