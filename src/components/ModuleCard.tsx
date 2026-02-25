import { Link } from "react-router-dom";
import { Module } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, BookOpen } from "lucide-react";

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link
      to={`/modules/${module.id}`}
      className="block rounded-lg border border-border bg-card p-5 card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge
          variant={module.type === "Knowledge" ? "secondary" : "default"}
          className={module.type === "Knowledge" ? "" : "bg-accent text-accent-foreground"}
        >
          {module.type}
        </Badge>
        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
          {module.status}
        </Badge>
      </div>

      <h3 className="font-display font-semibold text-card-foreground mb-1">{module.title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{module.code} • Block {module.block} • {module.days}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Award size={13} /> {module.credits} credits
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} /> {module.duration / 60}h
        </span>
        <span className="flex items-center gap-1">
          <BookOpen size={13} /> {module.activities.length} activities
        </span>
      </div>
    </Link>
  );
}
