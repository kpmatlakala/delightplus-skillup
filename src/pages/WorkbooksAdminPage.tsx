import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpenCheck, CheckCircle2, Circle, Eye } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { buildAssessmentMarkTemplate } from "@/lib/assessmentMarking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type WorkbookMarkItem = {
  id: string;
  label: string;
  prompt: string;
  maxMarks: number;
  sectionTitle?: string;
  sectionModule?: string;
  optionHints?: string[];
  awarded: number;
  isMarked: boolean;
  note: string;
};

export default function WorkbooksAdminPage() {
  const navigate = useNavigate();
  const { unitId, userId } = useParams<{ unitId?: string; userId?: string }>();
  const { toast } = useToast();

  const unitIndex = Math.max(0, modules.findIndex((m) => m.id === unitId));
  const [activeIndex, setActiveIndex] = useState(unitIndex);
  const [learners, setLearners] = useState<LearnerRow[]>([]);
  const [progressRows, setProgressRows] = useState<WorkbookProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const [selectedLearner, setSelectedLearner] = useState<LearnerRow | null>(null);
  const [markItems, setMarkItems] = useState<WorkbookMarkItem[]>([]);
  const [feedback, setFeedback] = useState("");
  const [savingCapture, setSavingCapture] = useState(false);

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

  const summary = useMemo(() => {
    const score = markItems.reduce((sum, item) => sum + (item.isMarked ? item.awarded : 0), 0);
    const max = markItems.reduce((sum, item) => sum + item.maxMarks, 0);
    const fullMarks = markItems.filter((item) => item.isMarked && item.awarded === item.maxMarks).length;
    const partial = markItems.filter((item) => item.isMarked && item.awarded > 0 && item.awarded < item.maxMarks).length;
    const noMarks = markItems.filter((item) => item.isMarked && item.awarded === 0).length;
    const pending = markItems.filter((item) => !item.isMarked).length;
    const percentage = max > 0 ? Math.round((score / max) * 100) : 0;
    return { score, max, fullMarks, partial, noMarks, pending, percentage };
  }, [markItems]);

  const seedMarkItems = () => {
    return buildAssessmentMarkTemplate(activeUnit.id, activeUnit.activities).map((item) => ({
      id: item.id,
      label: item.label,
      prompt: item.prompt,
      maxMarks: item.maxMarks,
      sectionTitle: item.sectionTitle,
      sectionModule: item.sectionModule,
      optionHints: item.optionHints,
      awarded: 0,
      isMarked: false,
      note: "",
    }));
  };

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

  const setWorkbookCompletion = async (userIdValue: string, completed: boolean) => {
    const key = `${userIdValue}::${activeUnit.id}`;
    setSavingKey(key);
    const db = supabase as unknown as any;

    try {
      const now = new Date().toISOString();
      const { error } = await db
        .from("learner_progress")
        .upsert(
          {
            user_id: userIdValue,
            module_unit_standard_id: activeUnit.id,
            guide_completed: completed,
            updated_at: now,
          },
          { onConflict: "user_id,module_unit_standard_id" }
        );

      if (error) throw error;

      setProgressRows((prev) => {
        const withoutCurrent = prev.filter((item) => !(item.user_id === userIdValue && item.module_unit_standard_id === activeUnit.id));
        return [
          ...withoutCurrent,
          {
            user_id: userIdValue,
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

  const markItem = (itemId: string, marks: number) => {
    setMarkItems((prev) => prev.map((item) => (
      item.id === itemId
        ? {
            ...item,
            isMarked: true,
            awarded: Math.max(0, Math.min(item.maxMarks, marks)),
          }
        : item
    )));
  };

  const setPending = (itemId: string) => {
    setMarkItems((prev) => prev.map((item) => (
      item.id === itemId
        ? {
            ...item,
            isMarked: false,
            awarded: 0,
          }
        : item
    )));
  };

  const openCapture = async (learner: LearnerRow) => {
    setSelectedLearner(learner);
    setMarkItems(seedMarkItems());
    setFeedback("");

    const db = supabase as unknown as any;
    try {
      const { data: detailRow } = await db
        .from("assessment_submissions_detailed")
        .select("assessment_answers, assessment_feedback")
        .eq("learner_id", learner.id)
        .eq("module_unit_standard_id", activeUnit.id)
        .maybeSingle();

      if (detailRow?.assessment_answers && typeof detailRow.assessment_answers === "object") {
        setMarkItems((prev) => prev.map((item) => {
          const row = detailRow.assessment_answers[item.id] as { awarded?: number; note?: string } | undefined;
          if (!row) return item;
          const awarded = Number(row.awarded ?? 0);
          return {
            ...item,
            awarded: Number.isFinite(awarded) ? Math.max(0, Math.min(item.maxMarks, awarded)) : item.awarded,
            isMarked: row.awarded != null,
            note: typeof row.note === "string" ? row.note : item.note,
          };
        }));
      }

      if (typeof detailRow?.assessment_feedback === "string") {
        setFeedback(detailRow.assessment_feedback);
      }
    } catch (error) {
      console.warn("Workbook detail preload skipped:", error);
    }

    navigate(`/assessments/workbooks/${activeUnit.id}/capture/${learner.user_id}`);
  };

  useEffect(() => {
    if (!userId) {
      setSelectedLearner(null);
      return;
    }

    const found = learners.find((learner) => learner.user_id === userId);
    if (found && selectedLearner?.user_id !== userId) {
      void openCapture(found);
    }
  }, [userId, learners, selectedLearner?.user_id]);

  const closeCapture = () => {
    setSelectedLearner(null);
    setMarkItems([]);
    setFeedback("");
    navigate(`/assessments/workbooks/${activeUnit.id}`);
  };

  const saveCapture = async () => {
    if (!selectedLearner) return;

    if (!markItems.length || summary.pending > 0) {
      toast({
        title: "Workbook marking incomplete",
        description: `Please award marks for every question part before saving. Pending: ${summary.pending}.`,
        variant: "destructive",
      });
      return;
    }

    setSavingCapture(true);
    const db = supabase as unknown as any;

    try {
      const now = new Date().toISOString();
      const reviewLines = markItems.map((item) =>
        `- ${item.label}: ${item.awarded}/${item.maxMarks}${item.note ? ` (${item.note})` : ""}`
      );

      const mergedFeedback = [
        feedback.trim(),
        "",
        "[Workbook Assessor Capture]",
        `Score: ${summary.score}/${summary.max} (${summary.percentage}%)`,
        `Full marks: ${summary.fullMarks}, Partial: ${summary.partial}, No marks: ${summary.noMarks}`,
        ...reviewLines,
      ].filter(Boolean).join("\n");

      const { error: progressError } = await db
        .from("learner_progress")
        .upsert(
          {
            user_id: selectedLearner.user_id,
            module_unit_standard_id: activeUnit.id,
            guide_completed: true,
            updated_at: now,
          },
          { onConflict: "user_id,module_unit_standard_id" }
        );

      if (progressError) throw progressError;

      try {
        await db
          .from("assessment_submissions_detailed")
          .upsert({
            learner_id: selectedLearner.id,
            module_unit_standard_id: activeUnit.id,
            submission_content: "Workbook assessor capture",
            learner_info: {
              full_name: selectedLearner.full_name,
              learner_code: selectedLearner.learner_code,
              captured_by_admin: true,
              capture_type: "workbook",
            },
            assessment_answers: Object.fromEntries(markItems.map((item) => [item.id, {
              label: item.label,
              prompt: item.prompt,
              sectionTitle: item.sectionTitle,
              sectionModule: item.sectionModule,
              optionHints: item.optionHints,
              awarded: item.awarded,
              maxMarks: item.maxMarks,
              note: item.note,
            }])),
            submitted_at: now,
            assessment_feedback: mergedFeedback,
            updated_at: now,
          }, { onConflict: "learner_id,module_unit_standard_id" });
      } catch (detailErr) {
        console.warn("Workbook detailed save skipped:", detailErr);
      }

      toast({
        title: "Workbook capture saved",
        description: `${selectedLearner.full_name}'s workbook marking has been captured successfully.`,
      });

      await loadData();
      closeCapture();
    } catch (error) {
      console.error("Failed to save workbook capture:", error);
      toast({
        title: "Save failed",
        description: "Could not save workbook capture.",
        variant: "destructive",
      });
    } finally {
      setSavingCapture(false);
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

      {!selectedLearner ? (
        <>
          <Card className="mb-5">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">{activeUnit.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeUnit.code} · Block {activeUnit.block} · Workbook review now supports per-question-part relative marking.
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
                        <TableHead className="w-[320px]">Actions</TableHead>
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
                                <Button size="sm" variant="outline" onClick={() => void openCapture(learner)}>
                                  <Eye size={12} /> View / Capture
                                </Button>
                                <Button
                                  size="sm"
                                  variant={completed ? "outline" : "default"}
                                  disabled={busy}
                                  onClick={() => setWorkbookCompletion(learner.user_id, !completed)}
                                >
                                  {busy ? "Saving..." : completed ? "Mark Pending" : "Mark Complete"}
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
        </>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Workbook Capture for {selectedLearner.full_name}</p>
              <p className="text-xs text-muted-foreground">
                Review each question part, award relative marks, and save workbook completion.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={closeCapture} className="gap-2 self-start">
              <ArrowLeft size={14} /> Back to learner list
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              {markItems.map((item) => (
                <div key={item.id} className="rounded-md border border-border bg-muted/20 px-3 py-2.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                      {(item.sectionTitle || item.sectionModule) ? (
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.sectionTitle} · {item.sectionModule}</p>
                      ) : null}
                      <p className="text-[11px] text-muted-foreground">{item.prompt}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{item.awarded}/{item.maxMarks}</span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[120px_auto] sm:items-end">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Awarded</Label>
                      <Input
                        type="number"
                        min="0"
                        max={item.maxMarks}
                        step="0.5"
                        value={item.awarded}
                        onChange={(e) => markItem(item.id, Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Button type="button" variant="outline" size="sm" onClick={() => markItem(item.id, item.maxMarks)}>Full</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => markItem(item.id, 0)}>Zero</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setPending(item.id)}>Pending</Button>
                    </div>
                  </div>

                  {item.optionHints?.length ? (
                    <details className="rounded-md border border-border/70 bg-background px-2.5 py-1.5">
                      <summary className="cursor-pointer select-none text-[10px] uppercase tracking-wide text-muted-foreground font-semibold list-none flex items-center gap-1">
                        <span className="inline-block transition-transform [details[open]>summary>&]:rotate-90">▶</span>
                        Options to verify
                      </summary>
                      <ul className="mt-1 list-disc pl-4 text-[11px] text-muted-foreground space-y-0.5">
                        {item.optionHints.map((option) => (
                          <li key={`${item.id}-${option}`}>{option}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}

                  <div className="space-y-1">
                    <Label className="text-[11px]">Assessor note (optional)</Label>
                    <Input
                      value={item.note}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMarkItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, note: value } : row)));
                      }}
                      placeholder="Assessor note"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                <p className="text-sm font-semibold text-foreground">Capture summary</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Question parts</span>
                  <span className="text-right font-medium text-foreground">{markItems.length}</span>
                  <span>Full marks</span>
                  <span className="text-right font-medium text-foreground">{summary.fullMarks}</span>
                  <span>Partial</span>
                  <span className="text-right font-medium text-foreground">{summary.partial}</span>
                  <span>No marks</span>
                  <span className="text-right font-medium text-foreground">{summary.noMarks}</span>
                  <span>Pending</span>
                  <span className="text-right font-medium text-foreground">{summary.pending}</span>
                  <span>Total</span>
                  <span className="text-right font-medium text-foreground">{summary.score}/{summary.max}</span>
                  <span>Derived %</span>
                  <span className="text-right font-medium text-foreground">{summary.percentage}%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="feedback">Workbook review notes</Label>
                <Textarea id="feedback" rows={12} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Capture workbook moderation notes..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeCapture} disabled={savingCapture}>Cancel</Button>
            <Button type="button" onClick={() => void saveCapture()} disabled={savingCapture || !markItems.length || summary.pending > 0}>
              {savingCapture ? "Saving..." : "Save workbook capture"}
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
