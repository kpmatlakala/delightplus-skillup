import { Link } from "react-router-dom";
import { Module } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Award, BookOpen } from "lucide-react";

interface ModuleCardProps {
  module: Module;
  basePath?: string;
  orderNumber?: number;
}

export default function ModuleCard({ module, basePath = "/modules", orderNumber }: ModuleCardProps) {
  return (
    <Link
      to={`${basePath}/${module.id}`}
      className="block rounded-lg border border-border bg-card px-3 py-2.5 card-hover"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {orderNumber !== undefined && (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                {orderNumber}
              </AvatarFallback>
            </Avatar>
          )}
          <Badge
            variant={module.type === "Knowledge" ? "secondary" : "default"}
            className={`text-[10px] px-1.5 py-0 h-4 ${module.type === "Knowledge" ? "" : "bg-accent text-accent-foreground"}`}
          >
            {module.type}
          </Badge>
        </div>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-success border-success/30 bg-success/10">
          {module.status}
        </Badge>
      </div>

      <h3 className="font-display font-medium text-sm text-card-foreground leading-snug mb-0.5">{module.title}</h3>
      <p className="text-[11px] text-muted-foreground mb-2">{module.code} • Block {module.block} • {module.days}</p>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Award size={11} /> {module.credits} cr
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> {module.duration / 60}h
        </span>
        <span className="flex items-center gap-1">
          <BookOpen size={11} /> {module.activities.length} act
        </span>
      </div>
    </Link>
  );
}
