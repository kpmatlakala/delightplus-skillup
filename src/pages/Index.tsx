import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import ModuleCard from "@/components/ModuleCard";
import { modules, program, learners } from "@/data/courseData";
import { BookOpen, Users, Award, CalendarCheck, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [enrolledCount, setEnrolledCount] = useState<number>(learners.length);
  const totalModules = modules.length;
  const readyModules = modules.filter((m) => m.status === "Ready").length;
  const totalCredits = modules.reduce((sum, m) => sum + m.credits, 0);

  useEffect(() => {
    const loadEnrolledCount = async () => {
      const rpc = supabase as unknown as {
        rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: Array<{ id: string }> | null; error: { message: string } | null }>;
      };

      const { data, error } = await rpc.rpc("cet_enrolled_learners");
      if (!error) {
        setEnrolledCount((data ?? []).length);
      }
    };

    loadEnrolledCount();
  }, []);

  return (
    <AppLayout title="Dashboard" subtitle="FET Certificate: IT Systems Development — SAQA 78965">
      {/* Program banner */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display font-semibold text-sm text-foreground leading-tight">{program.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              NQF Level {program.nqfLevel} • {program.totalCredits} Total Credits • {program.provider}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-accent">{totalCredits}/{program.totalCredits} credits</span>
            <Progress value={(totalCredits / program.totalCredits) * 100} className="w-24 h-1.5" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Modules" value={totalModules} icon={<BookOpen size={16} />} variant="accent" />
        <StatCard label="Modules Ready" value={readyModules} icon={<CheckCircle size={16} />} variant="success" />
        <StatCard label="Total Credits" value={totalCredits} icon={<Award size={16} />} />
        <StatCard label="Enrolled Learners" value={enrolledCount} icon={<Users size={16} />} variant="warning" />
      </div>

      {/* Block overview */}
      {[1, 2, 3].map((block) => {
        const blockModules = modules.filter((m) => m.block === block);
        if (blockModules.length === 0) return null;
        return (
          <div key={block} className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
              <CalendarCheck size={13} className="text-accent" />
              Block {block}
              <span className="font-normal normal-case">
                — {blockModules.length} modules · {blockModules.reduce((s, m) => s + m.credits, 0)} credits
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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
