import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Download, FileText, Sparkles } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Learner = {
  id: string;
  user_id: string;
  full_name: string;
  learner_code: string;
};

type ProgressRow = {
  user_id: string;
  module_unit_standard_id: string;
  assessment_submitted?: boolean;
  assessment_submitted_at?: string | null;
  submission_path?: string | null;
  assessment_grade?: number | null;
  assessment_feedback?: string | null;
};

type TaskMark = {
  id: string;
  label: string;
  prompt: string;
  maxMarks: number;
  markedCorrect: boolean | null;
  awarded: number;
  note: string;
};

const summativeUnits = modules.filter((mod) => mod.block !== 3);

function parseMarks(activity: string, fallback = 5) {
  const m = activity.match(/(\d+)\s*marks?/i);
  const parsed = m ? Number(m[1]) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4);
}

export default function SummativeAssessmentAdminPage() {
  const navigate = useNavigate();
  const { unitId, userId } = useParams<{ unitId?: string; userId?: string }>();
  const { toast } = useToast();

  const defaultIndex = Math.max(0, summativeUnits.findIndex((unit) => unit.id === unitId));
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const [learners, setLearners] = useState<Learner[]>([]);
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [attachedPath, setAttachedPath] = useState<string | null>(null);
  const [answerbookFile, setAnswerbookFile] = useState<File | null>(null);
  const [taskMarks, setTaskMarks] = useState<TaskMark[]>([]);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const activeUnit = summativeUnits[activeIndex];

  useEffect(() => {
    if (!unitId) return;
    const next = summativeUnits.findIndex((unit) => unit.id === unitId);
    if (next >= 0 && next !== activeIndex) {
      setActiveIndex(next);
    }
  }, [unitId, activeIndex]);

  const progressMap = useMemo(() => {
    const map = new Map<string, ProgressRow>();
    progressRows.forEach((row) => {
      map.set(`${row.user_id}::${row.module_unit_standard_id}`, row);
    });
    return map;
  }, [progressRows]);

  const learnerRows = useMemo(() => {
    return learners.map((learner) => {
      const progress = progressMap.get(`${learner.user_id}::${activeUnit.id}`);
      return {
        learner,
        progress,
        submitted: Boolean(progress?.assessment_submitted),
      };
    });
  }, [learners, progressMap, activeUnit.id]);

  const summary = useMemo(() => {
    const score = taskMarks.reduce((sum, item) => sum + item.awarded, 0);
    const max = taskMarks.reduce((sum, item) => sum + item.maxMarks, 0);
    const correct = taskMarks.filter((item) => item.markedCorrect === true).length;
    const incorrect = taskMarks.filter((item) => item.markedCorrect === false).length;
    const pending = taskMarks.filter((item) => item.markedCorrect === null).length;
    const percentage = max > 0 ? Math.round((score / max) * 100) : 0;

    return { score, max, correct, incorrect, pending, percentage };
  }, [taskMarks]);

  const openSubmissionFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("assessment-submissions").createSignedUrl(path, 300);
    if (error || !data?.signedUrl) {
      toast({
        title: "File unavailable",
        description: "Could not open attached submission file.",
        variant: "destructive",
      });
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const loadSubmissionText = async (path: string | null) => {
    if (!path || !/\.(txt|md)$/i.test(path)) return "";
    const { data, error } = await supabase.storage.from("assessment-submissions").download(path);
    if (error || !data) return "";
    return data.text();
  };

  const seedTaskMarks = () => {
    return activeUnit.activities.map((activity, index) => ({
      id: `task-${index + 1}`,
      label: `Task ${index + 1}`,
      prompt: activity,
      maxMarks: parseMarks(activity, 5),
      markedCorrect: null,
      awarded: 0,
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
          .select("id, user_id, full_name, learner_code")
          .not("user_id", "is", null)
          .order("full_name", { ascending: true }),
        db
          .from("learner_progress")
          .select("*"),
      ]);

      if (learnerError) throw learnerError;
      if (progressError) throw progressError;

      setLearners((learnerData ?? []) as Learner[]);
      const normalizedProgress = ((progressData ?? []) as any[]).map((row) => ({
        user_id: row.user_id,
        module_unit_standard_id: row.module_unit_standard_id,
        assessment_submitted: Boolean(row.assessment_submitted),
        assessment_submitted_at: row.assessment_submitted_at ?? row.submission_uploaded_at ?? null,
        submission_path: row.submission_path ?? null,
        assessment_grade: row.assessment_grade ?? null,
        assessment_feedback: row.assessment_feedback ?? null,
      })) as ProgressRow[];

      setProgressRows(normalizedProgress);
    } catch (error) {
      console.error("Failed to load summative tracker:", error);
      toast({
        title: "Load failed",
        description: "Could not load learner tracking data for summative assessments.",
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

  const openCapture = async (learner: Learner) => {
    const progress = progressMap.get(`${learner.user_id}::${activeUnit.id}`);
    setSelectedLearner(learner);
    setTaskMarks(seedTaskMarks());
    setAttachedPath(progress?.submission_path ?? null);
    setAnswerbookFile(null);
    setGrade(progress?.assessment_grade != null ? String(progress.assessment_grade) : "");
    setFeedback(progress?.assessment_feedback ?? "");

    const text = await loadSubmissionText(progress?.submission_path ?? null);
    setSubmissionText(text);

    navigate(`/assessments/summative/${activeUnit.id}/capture/${learner.user_id}`);
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
    setSubmissionText("");
    setAttachedPath(null);
    setAnswerbookFile(null);
    setTaskMarks([]);
    setGrade("");
    setFeedback("");
    navigate(`/assessments/summative/${activeUnit.id}`);
  };

  const markTask = (taskId: string, isCorrect: boolean) => {
    setTaskMarks((prev) => prev.map((task) => (
      task.id === taskId
        ? { ...task, markedCorrect: isCorrect, awarded: isCorrect ? task.maxMarks : 0 }
        : task
    )));
  };

  const autoMarkByKeywords = () => {
    if (!submissionText.trim()) {
      toast({
        title: "No online text found",
        description: "Upload hardcopy and mark tasks manually, or open a text submission first.",
        variant: "destructive",
      });
      return;
    }

    const lowerText = submissionText.toLowerCase();
    setTaskMarks((prev) => prev.map((task) => {
      const keywords = normalizeWords(task.prompt).slice(0, 4);
      const matched = keywords.some((keyword) => lowerText.includes(keyword));
      return {
        ...task,
        markedCorrect: matched,
        awarded: matched ? task.maxMarks : 0,
        note: matched ? "Auto-check matched task keywords. Verify before saving." : "Auto-check found no task keywords. Verify manually.",
      };
    }));

    toast({
      title: "Auto-check applied",
      description: "Task marks were pre-filled from online text; please verify each task before saving.",
    });
  };

  const saveCapture = async () => {
    if (!selectedLearner) return;

    if (taskMarks.length === 0 || summary.pending > 0) {
      toast({
        title: "Task grading incomplete",
        description: "Mark each task as correct or incorrect before saving.",
        variant: "destructive",
      });
      return;
    }

    const gradeValue = grade.trim() ? Number(grade) : summary.percentage;
    if (!Number.isFinite(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast({
        title: "Invalid grade",
        description: "Final grade must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const db = supabase as unknown as any;

    try {
      let submissionPath = attachedPath;
      if (answerbookFile) {
        const safeName = answerbookFile.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
        const uploadPath = `admin-reviewed/summative/${activeUnit.id}/${selectedLearner.user_id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("assessment-submissions")
          .upload(uploadPath, answerbookFile, {
            upsert: false,
            contentType: answerbookFile.type || undefined,
          });

        if (uploadError) throw uploadError;
        submissionPath = uploadPath;
        setAttachedPath(uploadPath);
      }

      const taskSummaryLines = taskMarks.map((task) =>
        `- ${task.label}: ${task.awarded}/${task.maxMarks}${task.note ? ` (${task.note})` : ""}`
      );

      const mergedFeedback = [
        feedback.trim(),
        "",
        "[Summative Assessor Capture]",
        `Task score: ${summary.score}/${summary.max}`,
        `Correct tasks: ${summary.correct}`,
        `Incorrect tasks: ${summary.incorrect}`,
        ...taskSummaryLines,
      ].filter(Boolean).join("\n");

      const now = new Date().toISOString();

      const { error: saveError } = await db
        .from("learner_progress")
        .upsert({
          user_id: selectedLearner.user_id,
          module_unit_standard_id: activeUnit.id,
          assessment_unlocked: true,
          assessment_submitted: true,
          assessment_submitted_at: now,
          submission_path: submissionPath,
          submission_uploaded_at: now,
          assessment_grade: gradeValue,
          assessment_feedback: mergedFeedback,
          assessment_graded_at: now,
          updated_at: now,
        }, {
          onConflict: "user_id,module_unit_standard_id",
        });

      if (saveError) throw saveError;

      try {
        await db
          .from("assessment_submissions_detailed")
          .upsert({
            learner_id: selectedLearner.id,
            module_unit_standard_id: activeUnit.id,
            submission_content: submissionText || "Assessor-captured summative submission.",
            submission_path: submissionPath,
            file_name: answerbookFile?.name ?? submissionPath?.split("/").pop() ?? null,
            learner_info: {
              full_name: selectedLearner.full_name,
              learner_code: selectedLearner.learner_code,
              captured_by_admin: true,
            },
            assessment_answers: Object.fromEntries(taskMarks.map((task) => [task.id, {
              label: task.label,
              prompt: task.prompt,
              markedCorrect: task.markedCorrect,
              awarded: task.awarded,
              maxMarks: task.maxMarks,
              note: task.note,
            }])),
            submitted_at: now,
            assessment_grade: gradeValue,
            assessment_feedback: mergedFeedback,
            graded_at: now,
            updated_at: now,
          }, { onConflict: "learner_id,module_unit_standard_id" });
      } catch (detailErr) {
        console.warn("Detailed submission save skipped:", detailErr);
      }

      toast({
        title: "Summative captured",
        description: `${selectedLearner.full_name}'s summative assessment was saved successfully.`,
      });

      await loadData();
      closeCapture();
    } catch (error: any) {
      console.error("Failed to save summative capture:", error);
      toast({
        title: "Save failed",
        description: error?.message || "Could not save this summative capture.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title="Summative Assessment Capture" subtitle="Learner-by-learner status, hardcopy upload, and task-level grading">
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {summativeUnits.map((unit, idx) => (
          <button
            key={unit.id}
            onClick={() => {
              setActiveIndex(idx);
              navigate(`/assessments/summative/${unit.id}`);
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

      {!selectedLearner ? (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">Learner Summative Tracking</p>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {learnerRows.filter((row) => row.submitted).length} / {learnerRows.length} submitted
            </span>
          </div>

          {loading ? (
            <p className="text-xs text-muted-foreground">Loading learners...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Learner</th>
                    <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Code</th>
                    <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Status</th>
                    <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Grade</th>
                    <th className="pb-2 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {learnerRows.map(({ learner, progress, submitted }) => (
                    <tr key={`${learner.user_id}-${activeUnit.id}`} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4 font-medium text-foreground">{learner.full_name}</td>
                      <td className="py-2 pr-4 text-muted-foreground font-mono">{learner.learner_code}</td>
                      <td className="py-2 pr-4">
                        {submitted ? (
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                            <CheckCircle2 size={11} /> Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                            <Circle size={11} /> Not completed
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {progress?.assessment_grade != null ? `${progress.assessment_grade}%` : "-"}
                      </td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1.5">
                          <Button type="button" variant="outline" size="sm" onClick={() => void openCapture(learner)} className="gap-1 h-7 text-[10px] px-2.5">
                            <FileText size={11} /> View / Capture
                          </Button>
                          {progress?.submission_path && (
                            <Button type="button" variant="outline" size="sm" className="gap-1 h-7 text-[10px] px-2.5" onClick={() => openSubmissionFile(progress.submission_path!)}>
                              <Download size={11} /> File
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Summative Capture for {selectedLearner.full_name}</p>
              <p className="text-xs text-muted-foreground">
                Upload hardcopy (if not completed on-platform), then grade each task/section before saving.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={closeCapture} className="gap-2 self-start">
              <ArrowLeft size={14} /> Back to learner list
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Label>Task/Section grading</Label>
                <Button type="button" size="sm" variant="outline" onClick={autoMarkByKeywords} disabled={!submissionText.trim()} className="gap-1">
                  <Sparkles size={12} /> Auto-check online text
                </Button>
                {attachedPath && (
                  <Button type="button" variant="outline" size="sm" onClick={() => openSubmissionFile(attachedPath)}>
                    Open attached file
                  </Button>
                )}
              </div>

              <div className="rounded-lg border border-border bg-background p-3 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="answerbookUpload">Upload hardcopy / scanned script</Label>
                  <Input
                    id="answerbookUpload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,image/*"
                    onChange={(e) => setAnswerbookFile(e.target.files?.[0] ?? null)}
                    disabled={saving}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {answerbookFile
                      ? `Ready to upload: ${answerbookFile.name}`
                      : attachedPath
                        ? `Current attachment: ${attachedPath.split("/").pop()}`
                        : "No hardcopy attached yet."}
                  </p>
                </div>

                {submissionText.trim() && (
                  <details className="rounded-md border border-border/70 px-3 py-2 text-xs text-muted-foreground">
                    <summary className="cursor-pointer font-medium text-foreground">View online submission text</summary>
                    <pre className="mt-2 max-h-44 overflow-y-auto whitespace-pre-wrap text-[11px]">{submissionText}</pre>
                  </details>
                )}

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {taskMarks.map((task) => (
                    <div key={task.id} className="rounded-md border border-border bg-muted/20 px-3 py-2 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{task.label}</p>
                          <p className="text-[11px] text-muted-foreground">{task.prompt}</p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{task.awarded}/{task.maxMarks}</span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-[11px]">
                        <label className="inline-flex items-center gap-1.5 text-foreground">
                          <input
                            type="radio"
                            name={`task-${task.id}`}
                            checked={task.markedCorrect === true}
                            onChange={() => markTask(task.id, true)}
                          />
                          Correct
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-foreground">
                          <input
                            type="radio"
                            name={`task-${task.id}`}
                            checked={task.markedCorrect === false}
                            onChange={() => markTask(task.id, false)}
                          />
                          Incorrect
                        </label>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px]">Task note (optional)</Label>
                        <Input
                          value={task.note}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTaskMarks((prev) => prev.map((item) => (item.id === task.id ? { ...item, note: value } : item)));
                          }}
                          placeholder="Assessor note"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                <p className="text-sm font-semibold text-foreground">Capture summary</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Tasks</span>
                  <span className="text-right font-medium text-foreground">{taskMarks.length}</span>
                  <span>Correct</span>
                  <span className="text-right font-medium text-foreground">{summary.correct}</span>
                  <span>Incorrect</span>
                  <span className="text-right font-medium text-foreground">{summary.incorrect}</span>
                  <span>Pending</span>
                  <span className="text-right font-medium text-foreground">{summary.pending}</span>
                  <span>Total</span>
                  <span className="text-right font-medium text-foreground">{summary.score}/{summary.max}</span>
                  <span>Derived %</span>
                  <span className="text-right font-medium text-foreground">{summary.percentage}%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="grade">Final grade (%)</Label>
                <Input id="grade" type="number" min="0" max="100" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder={`Default: ${summary.percentage}`} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="feedback">Assessor notes</Label>
                <Textarea id="feedback" rows={10} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Capture moderation notes and learner feedback..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeCapture} disabled={saving}>Cancel</Button>
            <Button type="button" onClick={() => void saveCapture()} disabled={saving || summary.pending > 0 || taskMarks.length === 0}>
              {saving ? "Saving..." : "Save summative capture"}
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
