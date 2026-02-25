import AppLayout from "@/components/AppLayout";
import { modules, program } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, Megaphone } from "lucide-react";

export default function LearnerPortalPage() {
  const practicalModules = modules.filter((m) => m.type === "Practical").length;
  const knowledgeModules = modules.filter((m) => m.type === "Knowledge").length;

  return (
    <AppLayout title="Learner Portal" subtitle="Track your progress and access course content">
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-5 mb-6">
        <h2 className="font-display font-bold text-foreground">{program.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          SAQA {program.saqaId} • NQF {program.nqfLevel} • Provider: {program.provider}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Overall Progress</p>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={0} className="h-2" />
            <span className="text-sm font-medium">0%</span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Knowledge Modules</p>
          <p className="font-display text-2xl font-bold mt-1">{knowledgeModules}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Practical Modules</p>
          <p className="font-display text-2xl font-bold mt-1">{practicalModules}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-accent" /> Learning Material
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {modules.slice(0, 5).map((mod) => (
              <li key={mod.id} className="flex items-center justify-between gap-3">
                <span>{mod.title}</span>
                <Badge variant="outline">Block {mod.block}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
            <FileText size={16} className="text-accent" /> Assessments
          </h3>
          <p className="text-sm text-muted-foreground">
            Assessment submission and result history will appear here once connected to CET assessment tables.
          </p>
          <h4 className="font-medium mt-4 mb-2 flex items-center gap-2 text-sm">
            <Megaphone size={14} className="text-accent" /> Announcements
          </h4>
          <p className="text-sm text-muted-foreground">Check with your facilitator for current block updates and deadlines.</p>
        </div>
      </div>
    </AppLayout>
  );
}
