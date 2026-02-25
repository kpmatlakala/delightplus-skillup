import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Award, BookOpen, Target, FileText, Users, Wrench } from "lucide-react";

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const mod = modules.find((m) => m.id === id);

  if (!mod) {
    return (
      <AppLayout title="Module Not Found">
        <p className="text-muted-foreground">Module not found.</p>
        <Link to="/modules" className="text-accent hover:underline mt-2 inline-block">← Back to Modules</Link>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={mod.title} subtitle={`${mod.code} • Block ${mod.block} • ${mod.days}`}>
      <Link to="/modules" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Modules
      </Link>

      {/* Header info */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={mod.type === "Knowledge" ? "secondary" : "default"} className={mod.type === "Practical" ? "bg-accent text-accent-foreground" : ""}>
            {mod.type}
          </Badge>
          <Badge variant="outline" className="text-success border-success/30">{mod.status}</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award size={15} className="text-accent" /> <span>{mod.credits} Credits</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={15} className="text-accent" /> <span>{mod.duration / 60} Hours</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen size={15} className="text-accent" /> <span>{mod.activities.length} Activities</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText size={15} className="text-accent" /> <span>{mod.resources.length} Resources</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
            <Target size={16} className="text-accent" /> Learning Objectives
          </h3>
          <ul className="space-y-2">
            {mod.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-accent" /> Lesson Content
          </h3>
          <ul className="space-y-2">
            {mod.content.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Activities */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
            <Users size={16} className="text-accent" /> Activities
          </h3>
          <ul className="space-y-2">
            {mod.activities.map((act, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                {act}
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
            <Wrench size={16} className="text-accent" /> Resources
          </h3>
          <ul className="space-y-2">
            {mod.resources.map((res, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText size={13} className="text-muted-foreground" />
                {res}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
