import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, KeyRound, Calendar, ChevronRight, FolderOpen } from "lucide-react";
import { modules } from "@/data/courseData";
import { useModuleProgress } from "@/hooks/useModuleProgress";

interface BlockAssessment {
  block: number;
  title: string;
  date: string;
  unitCount: number;
}

const blockAssessments: BlockAssessment[] = [
  { block: 1, title: "Foundations of Systems Development", date: "06 April 2026 (AM)", unitCount: 5 },
  { block: 2, title: "Applied Programming and Systems Design", date: "04 May 2026 (AM)", unitCount: 2 },
  { block: 3, title: "Testing, Support and Integrated Assessment", date: "07/08 May 2026 (AM)", unitCount: 3 },
];

export default function AssessmentsPage() {
  const { progressMap } = useModuleProgress();

  const blockProgress = (blockNum: number) => {
    const blockMods = modules.filter((m) => m.block === blockNum);
    if (blockMods.length === 0) return 0;
    const done = blockMods.filter((m) => !!progressMap[m.id]?.guide_completed).length;
    return Math.round((done / blockMods.length) * 100);
  };

  return (
    <>
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="text-accent mt-0.5" size={20} />
          <div>
            <h1 className="font-display font-bold text-foreground text-base sm:text-lg">
              Assessments
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Block summative assessments cover all unit standards in that block. Your facilitator will issue an OTP at the start of the session to unlock your assessment.
            </p>
          </div>
        </div>
      </div>

      {/* PoE quick link */}
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
              <FolderOpen size={18} className="text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Portfolio of Evidence (PoE)</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Upload your declarations, formative tasks and assessment artefacts here.
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/poe">
              Open PoE <ChevronRight size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Block assessments */}
      <div className="space-y-3">
        {blockAssessments.map((b) => {
          const progress = blockProgress(b.block);
          const ready = progress === 100;
          return (
            <div
              key={b.block}
              className={`rounded-lg border p-4 ${ready ? "border-accent/40 bg-accent/5" : "border-border bg-card"}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Block {b.block}</p>
                    {ready ? (
                      <Badge className="text-[10px]">Ready</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">In progress</Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] inline-flex items-center gap-1">
                      <KeyRound size={10} /> Requires OTP
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm mt-1.5">{b.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                    <Calendar size={11} /> {b.date} · {b.unitCount} units
                  </p>
                </div>
                <Button asChild size="sm" variant={ready ? "default" : "outline"}>
                  <Link to={`/learner/assessment/block/${b.block}`}>
                    {ready ? "Begin" : "View"} <ChevronRight size={14} className="ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Block readiness</span>
                  <span className="font-medium text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
