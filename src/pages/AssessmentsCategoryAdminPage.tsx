import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Circle, ClipboardCheck, Eye, FileText } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type CategoryKey = "quizzes" | "summative" | "practical";

type LearnerRow = {
  user_id: string;
  full_name: string;
  learner_code: string;
};

type ProgressRow = {
  user_id: string;
  module_unit_standard_id: string;
  quiz_completed?: boolean;
  quiz_passed?: boolean;
  quiz_score?: number | null;
  assessment_submitted?: boolean;
  assessment_submitted_at?: string | null;
  assessment_grade?: number | null;
};

const categoryMeta: Record<CategoryKey, { title: string; subtitle: string }> = {
  quizzes: {
    title: "Quiz Management",
    subtitle: "Per-unit learner quiz completion and score tracking",
  },
  summative: {
    title: "Summative Assessment Management",
    subtitle: "Per-unit learner summative review and grading workflow",
  },
  practical: {
    title: "Practical Assessment Management",
    subtitle: "Per-unit learner practical assessment review and grading workflow",
  },
};

export default function AssessmentsCategoryAdminPage() {
  const { unitId } = useParams<{ unitId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const category = (location.pathname.split("/")[2] ?? "quizzes") as CategoryKey;

  const categoryUnits = useMemo(() => {
    if (category === "quizzes") return modules;
    if (category === "summative") return modules.filter((mod) => mod.block !== 3);
    return modules.filter((mod) => mod.type === "Practical");
  }, [category]);

  const initialIndex = Math.max(0, categoryUnits.findIndex((unit) => unit.id === unitId));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [learners, setLearners] = useState<LearnerRow[]>([]);
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadWarning, setLoadWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!unitId) return;
    const idx = categoryUnits.findIndex((unit) => unit.id === unitId);
    if (idx >= 0 && idx !== activeIndex) setActiveIndex(idx);
  }, [unitId, categoryUnits, activeIndex]);

  const activeUnit = categoryUnits[activeIndex] ?? categoryUnits[0];

  const progressMap = useMemo(() => {
    const map = new Map<string, ProgressRow>();
    progressRows.forEach((row) => {
      map.set(`${row.user_id}::${row.module_unit_standard_id}`, row);
    });
    return map;
  }, [progressRows]);

  const unitLearners = useMemo(() => {
    if (!activeUnit) return [] as Array<{ learner: LearnerRow; progress?: ProgressRow; completed: boolean }>;

    return learners.map((learner) => {
      const progress = progressMap.get(`${learner.user_id}::${activeUnit.id}`);
      const completed = category === "quizzes"
        ? Boolean(progress?.quiz_completed || progress?.quiz_passed || progress?.quiz_score != null)
        : Boolean(progress?.assessment_submitted);

      return {
        learner,
        progress,
        completed,
      };
    });
  }, [activeUnit, learners, progressMap, category]);

  const completedCount = unitLearners.filter((row) => row.completed).length;

  const getQuizOutOfThree = (score?: number | null) => {
    if (score == null) return null;
    if (score <= 3) return `${score}/3`;
    const clipped = Math.max(0, Math.min(100, score));
    return `${Math.round((clipped / 100) * 3)}/3`;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLoadWarning(null);
      const db = supabase as unknown as any;

      try {
        const { data: progressData, error: progressError } = await db
          .from("learner_progress")
          .select("*");

        if (progressError) throw progressError;

        const normalizedProgress = ((progressData ?? []) as any[]).map((row) => ({
          user_id: row.user_id,
          module_unit_standard_id: row.module_unit_standard_id,
          quiz_completed: Boolean(row.quiz_completed),
          quiz_passed: Boolean(row.quiz_passed),
          quiz_score: row.quiz_score ?? null,
          assessment_submitted: Boolean(row.assessment_submitted),
          assessment_submitted_at: row.assessment_submitted_at ?? row.submission_uploaded_at ?? null,
          assessment_grade: row.assessment_grade ?? null,
        })) as ProgressRow[];
        setProgressRows(normalizedProgress);

        const { data: learnerData, error: learnerError } = await db
          .from("learners")
          .select("user_id, full_name, learner_code")
          .not("user_id", "is", null)
          .order("full_name", { ascending: true });

        if (!learnerError && learnerData?.length) {
          setLearners(learnerData as LearnerRow[]);
        } else {
          const fallbackLearners = Array.from(
            new Set(
              normalizedProgress
                .map((row) => row.user_id)
                .filter((value): value is string => Boolean(value))
            )
          ).map((userId) => ({
            user_id: userId,
            full_name: `Learner ${userId.slice(0, 8)}`,
            learner_code: userId.slice(0, 8).toUpperCase(),
          }));

          setLearners(fallbackLearners);
          setLoadWarning(
            learnerError
              ? "Could not load learner profiles. Showing learner IDs from progress records instead."
              : "No learner profiles were returned. Showing learner IDs from progress records instead."
          );
        }
      } catch (error) {
        console.error("Failed to load category tracker:", error);
        toast({
          title: "Load failed",
          description: "Could not load learner tracking data for this category.",
          variant: "destructive",
        });
        setProgressRows([]);
        setLearners([]);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [toast]);

  if (!categoryMeta[category]) {
    navigate("/assessments", { replace: true });
    return null;
  }

  return (
    <AppLayout title={categoryMeta[category].title} subtitle={categoryMeta[category].subtitle}>
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {categoryUnits.map((unit, idx) => (
          <button
            key={unit.id}
            onClick={() => {
              setActiveIndex(idx);
              navigate(`/assessments/${category}/${unit.id}`);
            }}
            className={[
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors border",
              activeIndex === idx
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary/50",
            ].join(" ")}
          >
            {unit.code}
          </button>
        ))}
      </div>

      {activeUnit && (
        <Card className="mb-5">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">{activeUnit.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeUnit.code} · Block {activeUnit.block}
                </p>
              </div>
              <Badge variant="outline" className="w-fit">
                {completedCount}/{unitLearners.length} completed
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {category === "quizzes" ? <ClipboardCheck size={15} className="text-primary" /> : <FileText size={15} className="text-primary" />}
            Learner Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadWarning && (
            <div className="mb-4 rounded-md border border-amber-300/50 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {loadWarning}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading learners...</p>
          ) : unitLearners.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No learners found for tracking yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Code</TableHead>
                    {category === "quizzes" ? <TableHead>Score</TableHead> : <TableHead>Grade</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[280px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unitLearners.map(({ learner, progress, completed }) => (
                    <TableRow key={`${learner.user_id}::${activeUnit?.id ?? "unknown"}`}>
                      <TableCell className="font-medium">{learner.full_name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{learner.learner_code}</TableCell>
                      <TableCell className="text-xs">
                        {category === "quizzes"
                          ? (getQuizOutOfThree(progress?.quiz_score) ?? <span className="text-muted-foreground">-</span>)
                          : (progress?.assessment_grade != null ? `${progress.assessment_grade}%` : <span className="text-muted-foreground">-</span>)}
                      </TableCell>
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
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={category === "quizzes" ? `/modules/${activeUnit?.id}` : `/modules/${activeUnit?.id}?doc=assessment`}>
                              <Eye size={12} />
                              View
                            </Link>
                          </Button>
                          {category !== "quizzes" && (
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/assessments/grade/${activeUnit?.id}`}>
                                Grade
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
