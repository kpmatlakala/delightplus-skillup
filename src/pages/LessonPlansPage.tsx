import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function LessonPlansPage() {
  return (
    <AppLayout title="Lesson Plans" subtitle={`LMIS-Ready Lesson Plans for All ${modules.length} Unit Standards`}>
      <div className="space-y-3">
        {modules.map((mod, i) => (
          <Link
            key={mod.id}
            to={`/modules/${mod.id}`}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card card-hover"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-card-foreground truncate">{mod.title}</h3>
              <p className="text-xs text-muted-foreground">{mod.code} • {mod.days} • Block {mod.block}</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
              <span className="flex items-center gap-1"><Award size={12} />{mod.credits}cr</span>
              <span className="flex items-center gap-1"><Clock size={12} />{mod.duration / 60}h</span>
            </div>
            <Badge
              variant={mod.type === "Knowledge" ? "secondary" : "default"}
              className={`shrink-0 ${mod.type === "Practical" ? "bg-accent text-accent-foreground" : ""}`}
            >
              {mod.type}
            </Badge>
            <Badge variant="outline" className="text-success border-success/30 bg-success/10 shrink-0 hidden sm:inline-flex">
              ✓ Ready
            </Badge>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
