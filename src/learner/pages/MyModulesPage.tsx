import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronRight, Lock, CheckCircle2, Layers } from "lucide-react";
import { modules as sdModules, program as sdProgram } from "@/data/courseData";
import { useModuleProgress } from "@/hooks/useModuleProgress";

type EnrolledProgram = {
  id: string;
  title: string;
  saqaId: string;
  nqfLevel: number;
  status: "Active" | "Planned";
  groups: { id: string; label: string; modules: EnrolledModule[] }[];
};

type EnrolledModule = {
  id: string;
  code: string;
  title: string;
  type: string;
  credits: number;
  meta: string;
  href?: string;
};

const sdGroups = [
  {
    id: "course-modules",
    label: "Course Modules",
    modules: sdModules.map<EnrolledModule>((m) => ({
      id: m.id,
      code: m.code,
      title: m.title,
      type: m.type,
      credits: m.credits,
      meta: `${m.code} • ${m.credits} credits`,
      href: `/learner/modules/${m.id}`,
    })),
  },
];

// Python Programmer (SP-230375) — sourced from public/courses/sp-230375-python/course.json
const pythonModules: EnrolledModule[] = [
  { id: "py-km-01", code: "KM-01", title: "Introduction to Python Programming", type: "Knowledge", credits: 2, meta: "KM-01 • 2 credits • Computers, IDE, Git, syntax" },
  { id: "py-km-02", code: "KM-02", title: "Python Data Types and Structures", type: "Knowledge", credits: 6, meta: "KM-02 • 6 credits • Strings, Lists, Tuples, Dicts, Sets" },
  { id: "py-km-03", code: "KM-03", title: "Principles of Programming with Python", type: "Knowledge", credits: 4, meta: "KM-03 • 4 credits • Decisions, Operators, Functions, I/O" },
  { id: "py-km-04", code: "KM-04", title: "Intermediate Programming Principles in Python", type: "Practical", credits: 6, meta: "KM-04 • 6 credits • OOP, Algorithms, File & Exception Handling" },
  { id: "py-km-05", code: "KM-05", title: "REST API and GUI in Python", type: "Practical", credits: 2, meta: "KM-05 • 2 credits • REST API, GUI Framework" },
];

const enrolledPrograms: EnrolledProgram[] = [
  {
    id: sdProgram.id,
    title: sdProgram.title,
    saqaId: sdProgram.saqaId,
    nqfLevel: sdProgram.nqfLevel,
    status: "Active",
    groups: sdGroups,
  },
  {
    id: "sp-230375-python",
    title: "Occupational Certificate: Python Programmer",
    saqaId: "SP-230375",
    nqfLevel: 4,
    status: "Planned",
    groups: [{ id: "knowledge-modules", label: "Knowledge Modules", modules: pythonModules }],
  },
];

export default function MyModulesPage() {
  const { progressMap } = useModuleProgress();

  return (
    <>
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4">
        <h1 className="font-display font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
          <Layers size={18} className="text-accent" /> My Modules
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          You're enrolled in {enrolledPrograms.length} programs.
        </p>
      </div>

      {enrolledPrograms.map((prog) => {
        const allMods = prog.groups.flatMap((g) => g.modules);
        const completed = allMods.filter((m) => !!progressMap[m.id]?.guide_completed).length;
        const overall = allMods.length ? Math.round((completed / allMods.length) * 100) : 0;
        const firstUndone = allMods.findIndex((m) => !progressMap[m.id]?.guide_completed);
        const currentIdx = firstUndone === -1 ? allMods.length : firstUndone;

        return (
          <section key={prog.id} className="rounded-lg border border-border bg-card p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-border">
              <div>
                <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                  {prog.title}
                  <Badge variant={prog.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                    {prog.status}
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  SAQA {prog.saqaId} • NQF {prog.nqfLevel}
                </p>
                <Link
                  to={`/learner/programs/${prog.saqaId}`}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                >
                  Open program path <ChevronRight size={12} />
                </Link>
              </div>
              <div className="min-w-[14rem]">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Path progress</span>
                  <span className="font-medium text-foreground">{overall}%</span>
                </div>
                <Progress value={overall} className="h-2" />
                <p className="text-[11px] text-muted-foreground mt-1 text-right">
                  {completed} of {allMods.length} complete
                </p>
              </div>
            </div>

            {prog.groups.map((group) => (
              <div key={group.id} className="mb-3 last:mb-0">
                <h3 className="text-sm font-display font-semibold mb-2 flex items-center gap-2">
                  <BookOpen size={14} className="text-accent" />
                  {group.label}
                  <span className="text-[11px] text-muted-foreground font-normal">
                    · {group.modules.length} {group.modules.length === 1 ? "module" : "modules"}
                  </span>
                </h3>
                <div className="space-y-2">
                  {group.modules.map((mod) => {
                    const globalIdx = allMods.findIndex((m) => m.id === mod.id);
                    const isCompleted = !!progressMap[mod.id]?.guide_completed;
                    const isCurrent = globalIdx === currentIdx;
                    const isLocked = globalIdx > currentIdx && !isCompleted;
                    const Wrapper: React.ElementType = mod.href ? Link : "div";
                    const wrapperProps = mod.href ? { to: mod.href } : {};

                    return (
                      <Wrapper
                        key={mod.id}
                        {...wrapperProps}
                        className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 transition-colors ${
                          isCurrent ? "border-primary bg-primary/10" : "border-border"
                        } ${mod.href ? "hover:bg-secondary/40" : "opacity-80"}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
                            ) : isLocked ? (
                              <Lock size={16} className="text-muted-foreground" />
                            ) : (
                              <div className="h-[18px] w-[18px] rounded-full border-2 border-primary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-foreground">{mod.title}</p>
                              <Badge variant="outline" className="text-[10px]">{mod.type}</Badge>
                              {isCompleted && <Badge variant="secondary" className="text-[10px]">Done</Badge>}
                              {isCurrent && <Badge className="text-[10px]">Current</Badge>}
                              {!mod.href && <Badge variant="outline" className="text-[10px]">Coming soon</Badge>}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{mod.meta}</p>
                          </div>
                        </div>
                        {mod.href && <ChevronRight size={16} className="text-muted-foreground shrink-0" />}
                      </Wrapper>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}
