import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import ModuleCard from "@/components/ModuleCard";
import { modules, program, learners } from "@/data/courseData";
import { BookOpen, Users, Award, CalendarCheck, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const totalModules = modules.length;
  const readyModules = modules.filter((m) => m.status === "Ready").length;
  const totalCredits = modules.reduce((sum, m) => sum + m.credits, 0);

  return (
    <AppLayout title="Dashboard" subtitle="FET Certificate: IT Systems Development — SAQA 78965">
      {/* Program banner */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-foreground">{program.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              NQF Level {program.nqfLevel} • {program.totalCredits} Total Credits • {program.provider}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-medium text-accent">{totalCredits}/{program.totalCredits} credits covered</span>
            <Progress value={(totalCredits / program.totalCredits) * 100} className="w-32 h-2" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Modules" value={totalModules} icon={<BookOpen size={20} />} variant="accent" />
        <StatCard label="Modules Ready" value={readyModules} icon={<CheckCircle size={20} />} variant="success" />
        <StatCard label="Total Credits" value={totalCredits} icon={<Award size={20} />} />
        <StatCard label="Enrolled Learners" value={learners.length} icon={<Users size={20} />} variant="warning" />
      </div>

      {/* Block overview */}
      {[1, 2, 3].map((block) => {
        const blockModules = modules.filter((m) => m.block === block);
        if (blockModules.length === 0) return null;
        return (
          <div key={block} className="mb-8">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarCheck size={18} className="text-accent" />
              Block {block}
              <span className="text-sm font-normal text-muted-foreground">
                ({blockModules.length} modules • {blockModules.reduce((s, m) => s + m.credits, 0)} credits)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blockModules.map((mod) => (
                <ModuleCard key={mod.id} module={mod} />
              ))}
            </div>
          </div>
        );
      })}
    </AppLayout>
  );
}
