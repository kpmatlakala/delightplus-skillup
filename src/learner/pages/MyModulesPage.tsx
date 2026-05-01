import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronRight, Lock, CheckCircle2, Layers } from "lucide-react";
import { modules, program } from "@/data/courseData";
import { useModuleProgress } from "@/hooks/useModuleProgress";

export default function MyModulesPage() {
  const { progressMap } = useModuleProgress();

  const completedCount = modules.filter((m) => !!progressMap[m.id]?.guide_completed).length;
  const overall = Math.round((completedCount / modules.length) * 100);
  const firstUndoneIndex = modules.findIndex((m) => !progressMap[m.id]?.guide_completed);
  const currentIndex = firstUndoneIndex === -1 ? modules.length : firstUndoneIndex;

  const blocks = [1, 2, 3].map((b) => ({
    id: b,
    modules: modules.filter((m) => m.block === b),
  }));

  return (
    <>
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
              <Layers size={18} className="text-accent" /> My Modules
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {program.title} — SAQA {program.saqaId} • NQF {program.nqfLevel}
            </p>
          </div>
          <div className="min-w-[14rem]">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Path progress</span>
              <span className="font-medium text-foreground">{overall}%</span>
            </div>
            <Progress value={overall} className="h-2" />
            <p className="text-[11px] text-muted-foreground mt-1 text-right">
              {completedCount} of {modules.length} complete
            </p>
          </div>
        </div>
      </div>

      {blocks.map((block) => (
        <section key={block.id} className="rounded-lg border border-border bg-card p-4 mb-4">
          <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-accent" />
            Block {block.id}
            <span className="text-[11px] text-muted-foreground font-normal">
              · {block.modules.length} {block.modules.length === 1 ? "module" : "modules"}
            </span>
          </h2>

          <div className="space-y-2">
            {block.modules.map((mod) => {
              const globalIndex = modules.findIndex((m) => m.id === mod.id);
              const isCompleted = !!progressMap[mod.id]?.guide_completed;
              const isCurrent = globalIndex === currentIndex;
              const isLocked = globalIndex > currentIndex && !isCompleted;

              return (
                <Link
                  key={mod.id}
                  to={`/learner/modules/${mod.id}`}
                  className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 transition-colors ${
                    isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary/40"
                  }`}
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
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {mod.code} • {mod.credits} credits • {mod.days}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
