import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useLocation } from "react-router-dom";
import { Eye, ClipboardCheck, GraduationCap, NotebookPen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const assessments = modules.map((mod) => ({
  moduleId: mod.id,
  moduleTitle: mod.title,
  moduleCode: mod.code,
  formative: `Activity Workbook — ${mod.activities.length} tasks`,
  summative: mod.type === "Practical" ? "Practical Assessment Task (PAT)" : "Knowledge Test",
  weight: mod.credits,
  status: "Ready",
}));

type TrackerLearner = {
  user_id: string;
  full_name: string;
  learner_code: string;
  email?: string;
};

type TrackerProgress = {
  user_id: string;
  module_unit_standard_id: string;
  guide_completed?: boolean;
  quiz_completed?: boolean;
  quiz_passed?: boolean;
  quiz_score?: number | null;
  assessment_submitted?: boolean;
  assessment_submitted_at?: string | null;
  assessment_grade?: number | null;
};

export default function AssessmentsPage() {
  const { role } = useAuth();
  const isAdminView = role === "admin" || role === "moderator" || role === "lecturer";
  const location = useLocation();
  const routeCategory = location.pathname.split("/")[2] ?? "all";
  const [learners, setLearners] = useState<TrackerLearner[]>([]);
  const [progressRows, setProgressRows] = useState<TrackerProgress[]>([]);
  const [trackerLoading, setTrackerLoading] = useState(false);

  const headingMap: Record<string, string> = {
    all: "Formative & Summative Assessments per Module",
    quizzes: "Quizzes across all modules",
    summative: "Summative assessments across all modules",
    practical: "Practical assessments (PAT-focused modules)",
    workbooks: "Workbook and formative activities",
  };

  const filteredAssessments = assessments.filter((item) => {
    if (routeCategory === "quizzes") return item.formative.toLowerCase().includes("workbook") || item.formative.toLowerCase().includes("task");
    if (routeCategory === "summative") return true;
    if (routeCategory === "practical") return item.summative.toLowerCase().includes("practical");
    if (routeCategory === "workbooks") return item.formative.toLowerCase().includes("workbook");
    return true;
  });

  useEffect(() => {
    if (!isAdminView) return;

    const loadTracker = async () => {
      setTrackerLoading(true);
      const db = supabase as unknown as any;
      try {
        const [{ data: learnerData, error: learnerError }, { data: progressData, error: progressError }] = await Promise.all([
          db
            .from("learners")
            .select("user_id, full_name, learner_code, email")
            .not("user_id", "is", null)
            .order("full_name", { ascending: true }),
          db
            .from("learner_progress")
            .select("*"),
        ]);

        if (learnerError) throw learnerError;
        if (progressError) throw progressError;

        setLearners((learnerData ?? []) as TrackerLearner[]);
        const normalizedProgress = ((progressData ?? []) as any[]).map((row) => ({
          user_id: row.user_id,
          module_unit_standard_id: row.module_unit_standard_id,
          guide_completed: Boolean(row.guide_completed),
          quiz_completed: Boolean(row.quiz_completed),
          quiz_passed: Boolean(row.quiz_passed),
          quiz_score: row.quiz_score ?? null,
          assessment_submitted: Boolean(row.assessment_submitted),
          assessment_submitted_at: row.assessment_submitted_at ?? row.submission_uploaded_at ?? null,
          assessment_grade: row.assessment_grade ?? null,
        })) as TrackerProgress[];

        setProgressRows(normalizedProgress);
      } catch (error) {
        console.error("Failed to load assessment tracker data:", error);
        setLearners([]);
        setProgressRows([]);
      } finally {
        setTrackerLoading(false);
      }
    };

    void loadTracker();
  }, [isAdminView]);

  const progressMap = useMemo(() => {
    const map = new Map<string, TrackerProgress>();
    progressRows.forEach((row) => {
      map.set(`${row.user_id}::${row.module_unit_standard_id}`, row);
    });
    return map;
  }, [progressRows]);

  const categoryModules = useMemo(() => {
    if (routeCategory === "quizzes") return modules;
    if (routeCategory === "summative") return modules.filter((mod) => mod.block !== 3);
    if (routeCategory === "practical") return modules.filter((mod) => mod.type === "Practical");
    if (routeCategory === "workbooks") return modules;
    return [] as typeof modules;
  }, [routeCategory]);

  const isTrackerCategory = routeCategory === "quizzes" || routeCategory === "summative" || routeCategory === "practical" || routeCategory === "workbooks";

  const getQuizOutOfThree = (score?: number | null) => {
    if (score == null) return null;
    if (score <= 3) return `${score}/3`;
    const clipped = Math.max(0, Math.min(100, score));
    return `${Math.round((clipped / 100) * 3)}/3`;
  };

  return (
    <AppLayout title="Assessments" subtitle={headingMap[routeCategory] ?? headingMap.all}>
      <div className="grid gap-4 mb-5 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck size={16} className="text-primary" />
              Assessment Types
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Quizzes</p>
            <p>Summative assessments</p>
            <p>Block assessments</p>
            <p>Practical assessments</p>
            <p>Workbooks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap size={16} className="text-primary" />
              Block Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Capture and grade block submissions, including online and manual paper-based completion.
            </p>
            <Button asChild className="gap-2 min-h-[42px]">
              <Link to="/assessments/blocks">
                <NotebookPen size={14} />
                Open Block Assessment Capture
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-2 mb-4 sm:grid-cols-2 lg:grid-cols-5">
        <Link to="/assessments" className={`rounded-lg border px-3 py-2 text-sm transition-colors ${routeCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary/50"}`}>
          Overview
        </Link>
        <Link to="/assessments/quizzes" className={`rounded-lg border px-3 py-2 text-sm transition-colors ${routeCategory === "quizzes" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary/50"}`}>
          Quizzes
        </Link>
        <Link to="/assessments/summative" className={`rounded-lg border px-3 py-2 text-sm transition-colors ${routeCategory === "summative" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary/50"}`}>
          Summative
        </Link>
        <Link to="/assessments/practical" className={`rounded-lg border px-3 py-2 text-sm transition-colors ${routeCategory === "practical" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary/50"}`}>
          Practical
        </Link>
        <Link to="/assessments/workbooks" className={`rounded-lg border px-3 py-2 text-sm transition-colors ${routeCategory === "workbooks" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary/50"}`}>
          Workbooks
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead className="hidden md:table-cell">Formative</TableHead>
              <TableHead className="hidden md:table-cell">Summative</TableHead>
              <TableHead className="w-20">Credits</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssessments.map((a) => (
              <TableRow key={a.moduleId}>
                <TableCell>
                  <p className="font-medium">{a.moduleTitle}</p>
                  <p className="text-xs text-muted-foreground">{a.moduleCode}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{a.formative}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{a.summative}</TableCell>
                <TableCell className="font-mono text-sm">{a.weight}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    {a.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <Link to={`/assessments/grade/${a.moduleId}`}>
                        <Eye size={12} />
                        Grade
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredAssessments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No assessments found for this category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isAdminView && isTrackerCategory && (
        <div className="space-y-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Learner Completion Tracker</CardTitle>
              <p className="text-sm text-muted-foreground">
                {routeCategory === "quizzes"
                  ? "Quizzes are completed on-platform and tracked per learner with optional score view."
                  : "For this category, learners can download and complete at home. Capture completion status the same way as block assessment moderation."}
              </p>
            </CardHeader>
          </Card>

          {trackerLoading ? (
            <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading learner tracker...</div>
          ) : categoryModules.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">No units configured for this category yet.</div>
          ) : (
            categoryModules.map((unit) => {
              const unitRows = learners.map((learner) => {
                const progress = progressMap.get(`${learner.user_id}::${unit.id}`);
                const quizDone = Boolean(progress?.quiz_completed || progress?.quiz_passed || progress?.quiz_score != null);
                const quizScoreText = getQuizOutOfThree(progress?.quiz_score);
                const workbookDone = Boolean(progress?.guide_completed);
                const assessmentDone = Boolean(progress?.assessment_submitted);

                return {
                  learner,
                  progress,
                  quizDone,
                  quizScoreText,
                  workbookDone,
                  assessmentDone,
                };
              });

              const completedCount = unitRows.filter((row) => {
                if (routeCategory === "quizzes") return row.quizDone;
                if (routeCategory === "workbooks") return row.workbookDone;
                return row.assessmentDone;
              }).length;

              return (
                <Card key={`${routeCategory}-${unit.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-base">{unit.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{unit.code} · Block {unit.block}</p>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {completedCount}/{unitRows.length} completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Learner</TableHead>
                            <TableHead>Code</TableHead>
                            {routeCategory === "quizzes" && <TableHead>Score</TableHead>}
                            {routeCategory !== "quizzes" && routeCategory !== "workbooks" && <TableHead>Grade</TableHead>}
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[120px]">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {unitRows.map(({ learner, progress, quizDone, quizScoreText, workbookDone, assessmentDone }) => {
                            const isDone = routeCategory === "quizzes"
                              ? quizDone
                              : routeCategory === "workbooks"
                                ? workbookDone
                                : assessmentDone;

                            return (
                              <TableRow key={`${unit.id}-${learner.user_id}`}>
                                <TableCell className="font-medium">{learner.full_name}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{learner.learner_code}</TableCell>
                                {routeCategory === "quizzes" && (
                                  <TableCell className="text-xs">
                                    {quizScoreText ?? <span className="text-muted-foreground">-</span>}
                                  </TableCell>
                                )}
                                {routeCategory !== "quizzes" && routeCategory !== "workbooks" && (
                                  <TableCell className="text-xs">
                                    {progress?.assessment_grade != null
                                      ? `${progress.assessment_grade}%`
                                      : <span className="text-muted-foreground">-</span>}
                                  </TableCell>
                                )}
                                <TableCell>
                                  <Badge variant={isDone ? "default" : "secondary"}>
                                    {isDone ? "Completed" : "Pending"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link to={`/modules/${unit.id}`}>
                                      <Eye size={12} />
                                    </Link>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </AppLayout>
  );
}
