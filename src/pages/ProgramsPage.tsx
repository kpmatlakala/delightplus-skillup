import LmisLayout from "@/lmis/components/LmisLayout";
import { program } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, Building2, Calendar } from "lucide-react";

export default function ProgramsPage() {
  return (
    <LmisLayout title="Programs" subtitle="Registered Qualifications">
      <div className="rounded-lg border border-border bg-card p-6 max-w-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg">{program.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">Full Qualification</p>
          </div>
          <Badge variant="outline" className="text-success border-success/30 bg-success/10 shrink-0">Active</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award size={15} className="text-accent" /> SAQA ID: {program.saqaId}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen size={15} className="text-accent" /> NQF Level {program.nqfLevel}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={15} className="text-accent" /> {program.totalCredits} Credits
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 size={15} className="text-accent" /> {program.provider}
          </div>
        </div>
      </div>
    </LmisLayout>
  );
}
