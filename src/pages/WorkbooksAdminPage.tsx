import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, BookOpenCheck, CheckCircle2, Circle, Eye } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type LearnerRow = {
  id: string;
  user_id: string;
  full_name: string;
  learner_code: string;
  email?: string;
};

type WorkbookProgress = {
  user_id: string;
  module_unit_standard_id: string;
  guide_completed?: boolean;
  updated_at?: string | null;
  quiz_passed?: boolean;
  quiz_score?: number | null;
};

export default function WorkbooksAdminPage() {
  const navigate = useNavigate();
  const { unitId } = useParams<{ unitId?: string }>();
  const { toast } = useToast();

  const unitIndex = Math.max(0, modules.findIndex((m) => m.id === unitId));
  const [activeIndex, setActiveIndex] = useState(unitIndex);
  const [learners, setLearners] = useState<LearnerRow[]>([]);
  const [progressRows, setProgressRows] = useState<WorkbookProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!unitId) return;
    const next = modules.findIndex((m) => m.id === unitId);
    if (next >= 0 && next !== activeIndex) setActiveIndex(next);
  }, [unitId, activeIndex]);

  const activeUnit = modules[activeIndex];

  const progressMap = useMemo(() => {
    const map = new Map<string, WorkbookProgress>();
    progressRows.forEach((p) => {
      map.set(`${p.user_id}::${p.module_unit_standard_id}`, p);
    });
    return map;
  }, [progressRows]);

  const activeLearners = useMemo(() => {
    return learners.map((learner) => {
      const progress = progressMap.get(`${learner.user_id}::${activeUnit.id}`);
      return {
        learner,
        progress,
        completed: Boolean(progress?.guide_completed),
      };
    });
  }, [learners, progressMap, activeUnit.id]);

  const completedCount = activeLearners.filter((row) => row.completed).length;

  const loadData = async () => {
    setLoading(true);
    const db = supabase as unknown as any;

    try {
      const [{ data: learnerData, error: learnerError }, { data: progressData, error: progressError }] = await Promise.all([
        db
          .from("learners")
          .select("id, user_id, full_name, learner_code, email")
          .not("user_id", "is", null)
          .order("full_name", { ascending: true }),
        db
          .from("learner_progress")
          .select("*"),
      ]);

      if (learnerError) throw learnerError;
      if (progressError) throw progressError;

      setLearners((learnerData ?? []) as LearnerRow[]);
      const normalizedProgress = ((progressData ?? []) as any[]).map((row) => ({
        user_id: row.user_id,
        module_unit_standard_id: row.module_unit_standard_id,
        guide_completed: Boolean(row.guide_completed),
        updated_at: row.updated_at ?? row.submission_uploaded_at ?? null,
        quiz_passed: Boolean(row.quiz_passed),
        quiz_score: row.quiz_score ?? null,
      })) as WorkbookProgress[];

      setProgressRows(normalizedProgress);
    } catch (error) {
      console.error("Failed to load workbook review data:", error);
      toast({
        title: "Load failed",
        description: "Could not load workbook learner progress right now.",
        variant: "destructive",
      });
      setLearners([]);
      setProgressRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const setWorkbookCompletion = async (userId: string, completed: boolean) => {
    const key = `${userId}::${activeUnit.id}`;
    setSavingKey(key);
    const db = supabase as unknown as any;

    try {
      const now = new Date().toISOString();
      const { error } = await db
        .from("learner_progress")
        .upsert(
          {
            user_id: userId,
            module_unit_standard_id: activeUnit.id,
            guide_completed: completed,
            updated_at: now,
          },
          { onConflict: "user_id,module_unit_standard_id" }
        );

      if (error) throw error;

      setProgressRows((prev) => {
        const withoutCurrent = prev.filter((item) => !(item.user_id === userId && item.module_unit_standard_id === activeUnit.id));
        return [
          ...withoutCurrent,
          {
            user_id: userId,
            module_unit_standard_id: activeUnit.id,
            guide_completed: completed,
            updated_at: now,
          },
        ];
      });

      toast({
        title: completed ? "Workbook marked complete" : "Workbook marked pending",
        description: `${activeUnit.title} workbook status has been updated.`,
      });
    } catch (error) {
      console.error("Failed to update workbook status:", error);
      toast({
        title: "Update failed",
        description: "Could not update workbook completion status.",
        variant: "destructive",
      });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <AppLayout title="Workbook Review" subtitle="Unit-by-unit learner workbook moderation and completion tracking">
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {modules.map((unit, index) => (
          <button
            key={unit.id}
            onClick={() => {
              setActiveIndex(index);
              navigate(`/assessments/workbooks/${unit.id}`);
            }}
            className={[
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors border",
              activeIndex === index
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary/50",
            ].join(" ")}
          >
            {unit.code}
          </button>
        ))}
      </div>

      <Card className="mb-5">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">{activeUnit.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {activeUnit.code} · Block {activeUnit.block} · Workbook review flow mirrors block summative moderation style.
              </p>
            </div>
            <Badge variant="outline" className="w-fit">
              {completedCount}/{activeLearners.length} completed
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpenCheck size={15} className="text-primary" />
            Learner Workbook Access & Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading learners...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Workbook Status</TableHead>
                    <TableHead className="hidden md:table-cell">Quiz Signal</TableHead>
                    <TableHead className="w-[280px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeLearners.map(({ learner, progress, completed }) => {
                    const rowKey = `${learner.user_id}::${activeUnit.id}`;
                    const busy = savingKey === rowKey;

                    return (
                      <TableRow key={rowKey}>
                        <TableCell className="font-medium">{learner.full_name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{learner.learner_code}</TableCell>
                        <TableCell>
                          {completed ? (
                            <Badge className="gap-1" variant="default">
                              <CheckCircle2 size={12} /> Completed
                            </Badge>
                          ) : (
                            <Badge className="gap-1" variant="secondary">
                              <Circle size={12} /> Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {progress?.quiz_passed ? `Quiz passed (${progress?.quiz_score ?? "-"}%)` : "No quiz pass yet"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/modules/${activeUnit.id}?doc=workbook`}>
                                <Eye size={12} /> Open Workbook
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant={completed ? "outline" : "default"}
                              disabled={busy}
                              onClick={() => setWorkbookCompletion(learner.user_id, !completed)}
                            >
                              {busy ? "Saving..." : completed ? "Mark Pending" : "Mark Complete"}
                            </Button>
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/modules/${activeUnit.id}`}>
                                Unit View <ArrowRight size={12} />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
