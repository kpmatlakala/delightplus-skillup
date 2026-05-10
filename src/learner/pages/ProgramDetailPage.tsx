import { Link, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlayCircle,
  Lock,
  ChevronRight,
  GraduationCap,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  Hourglass,
} from "lucide-react";
import { modules as sdModules, program as sdProgram } from "@/data/courseData";
import { useModuleProgress } from "@/hooks/useModuleProgress";

type PyModule = {
  id: string;
  code: string;
  title: string;
  type: "Knowledge" | "Practical";
  credits: number;
  meta: string;
};

const pythonModules: PyModule[] = [
  { id: "py-km-01", code: "KM-01", title: "Introduction to Python Programming", type: "Knowledge", credits: 2, meta: "Computers, IDE, Git, syntax" },
  { id: "py-km-02", code: "KM-02", title: "Python Data Types and Structures", type: "Knowledge", credits: 6, meta: "Strings, Lists, Tuples, Dicts, Sets" },
  { id: "py-km-03", code: "KM-03", title: "Principles of Programming with Python", type: "Knowledge", credits: 4, meta: "Decisions, Operators, Functions, I/O" },
  { id: "py-km-04", code: "KM-04", title: "Intermediate Programming Principles in Python", type: "Practical", credits: 6, meta: "OOP, Algorithms, File & Exception Handling" },
  { id: "py-km-05", code: "KM-05", title: "REST API and GUI in Python", type: "Practical", credits: 2, meta: "REST API, GUI Framework" },
];

export default function ProgramDetailPage() {
  const { programId } = useParams<{ programId: string }>();

  if (programId === sdProgram.saqaId || programId === "78965") {
    return <SystemsDevProgramView />;
  }
  if (programId === "SP-230375" || programId === "sp-230375-python") {
    return <PythonProgramView />;
  }
  return <Navigate to="/learner/modules" replace />;
}

function BackLink() {
  return (
    <Link
      to="/learner/modules"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
    >
      <ArrowLeft size={12} /> Back to My Modules
    </Link>
  );
}

function SystemsDevProgramView() {
  const { progressMap, clearMyModuleProgress } = useModuleProgress();
  const [clearingModuleId, setClearingModuleId] = useState<string | null>(null);
  const [orientationOpen, setOrientationOpen] = useState(false);

  const modulePath = sdModules;
  const completed = modulePath.filter((m) => !!progressMap[m.id]?.guide_completed).length;
  const firstUndoneIndex = modulePath.findIndex((m) => !progressMap[m.id]?.guide_completed);
  const currentModuleIndex = firstUndoneIndex === -1 ? modulePath.length : firstUndoneIndex;
  const overall = Math.round((completed / modulePath.length) * 100);

  return (
    <>
      <BackLink />
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Active course</p>
            <h3 className="font-display font-bold text-foreground text-sm sm:text-base mt-0.5">{sdProgram.title}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              SAQA {sdProgram.saqaId} • NQF {sdProgram.nqfLevel} • {modulePath.length} modules
            </p>
          </div>
          <div className="min-w-[14rem]">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Path progress</span>
              <span className="font-medium text-foreground">{overall}%</span>
            </div>
            <Progress value={overall} className="h-2" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
          <PlayCircle size={16} className="text-accent" /> Learning Path
        </h3>
        <p className="text-xs text-muted-foreground mb-3">Select a module to continue your mission path.</p>

        <div className="space-y-2">
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
              <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground shadow-sm group-hover:bg-accent/90 transition-colors">
                Open Programme Orientation →
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Your {modulePath.length} Modules
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {modulePath.map((mod, index) => {
            const isCompleted = !!progressMap[mod.id]?.guide_completed;
            const isCurrent = index === currentModuleIndex;
            const isLocked = index > currentModuleIndex && !isCompleted;
            const hasProgress = !!progressMap[mod.id];
            const isClearing = clearingModuleId === mod.id;

            return (
              <div
                key={mod.id}
                className={`group flex items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors ${
                  isCurrent ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/40"
                }`}
              >
                <Link to={`/learner/modules/${mod.id}`} className="min-w-0 flex items-center gap-2.5 flex-1">
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
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mod.code} • Block {mod.block} • {mod.credits} credits
                    </p>
                  </div>
                </Link>

                {hasProgress ? (
                  <button
                    title="Clear progress (retest)"
                    disabled={isClearing}
                    onClick={async () => {
                      setClearingModuleId(mod.id);
                      await clearMyModuleProgress(mod.id);
                      setClearingModuleId(null);
                    }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-50"
                  >
                    <RotateCcw size={13} className={isClearing ? "animate-spin" : ""} />
                  </button>
                ) : isLocked ? (
                  <Lock size={14} className="text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={orientationOpen} onOpenChange={setOrientationOpen}>
        <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden">
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
            <div className="px-6 py-5 text-sm space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This qualification builds you into a junior systems developer over 15 delivery days across 3 blocks.
                You'll learn analysis, design, programming and testing — not just how to write code, but how to build
                the right system in the first place.
              </p>
              <p>
                Use the module path on this page to work through each unit standard in order. Your facilitator,
                Kabelo Matlakala, is your primary point of contact for all learner support.
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PythonProgramView() {
  return (
    <>
      <BackLink />
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
              <Hourglass size={10} /> Planned course
            </p>
            <h3 className="font-display font-bold text-foreground text-sm sm:text-base mt-0.5">
              Occupational Certificate: Python Programmer
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              SAQA SP-230375 • NQF 4 • {pythonModules.length} knowledge modules • 20 credits
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px]">Coming soon</Badge>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
          <PlayCircle size={16} className="text-accent" /> Knowledge Modules
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Materials for this programme will unlock once content is published. The structure below mirrors the QCTO curriculum.
        </p>

        <div className="space-y-2">
          {pythonModules.map((mod, index) => (
            <div
              key={mod.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 opacity-90"
            >
              <div className="min-w-0 flex items-center gap-2.5 flex-1">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
                    {index + 1}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{mod.title}</p>
                    <Badge variant="outline" className="text-[10px]">{mod.type}</Badge>
                    <Badge variant="secondary" className="text-[10px]">Coming soon</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {mod.code} • {mod.credits} credits • {mod.meta}
                  </p>
                </div>
              </div>
              <Lock size={14} className="text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
