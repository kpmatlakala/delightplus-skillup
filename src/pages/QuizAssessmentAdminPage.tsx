import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, ClipboardCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { modules } from "@/data/courseData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  quiz_completed?: boolean;
  quiz_passed?: boolean;
  quiz_score?: number | null;
};

const quizUnits = modules;

function toOutOfThree(score?: number | null) {
  if (score == null) return null;
  const clipped = Math.max(0, Math.min(100, score));
  const outOf3 = Math.round((clipped / 100) * 3);
  return `${outOf3}/3`;
}

export default function QuizAssessmentAdminPage() {
  const navigate = useNavigate();
  const { unitId, userId } = useParams<{ unitId?: string; userId?: string }>();
  const { toast } = useToast();

  const defaultIndex = Math.max(0, quizUnits.findIndex((unit) => unit.id === unitId));
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const [learners, setLearners] = useState<Learner[]>([]);
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [quizScore, setQuizScore] = useState("");
  const [saving, setSaving] = useState(false);

  const activeUnit = quizUnits[activeIndex];

  useEffect(() => {
    if (!unitId) return;
    const next = quizUnits.findIndex((unit) => unit.id === unitId);
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
      const completed = Boolean(progress?.quiz_completed || progress?.quiz_passed || progress?.quiz_score != null);
      return {
        learner,
        progress,
        completed,
      };
    });
  }, [learners, progressMap, activeUnit.id]);

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
        quiz_completed: Boolean(row.quiz_completed),
        quiz_passed: Boolean(row.quiz_passed),
        quiz_score: row.quiz_score ?? null,
      })) as ProgressRow[];

      setProgressRows(normalizedProgress);
    } catch (error) {
      console.error("Failed to load quiz tracker:", error);
      toast({
        title: "Load failed",
        description: "Could not load learner tracking data for quizzes.",
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

  const openCapture = (learner: Learner) => {
    const progress = progressMap.get(`${learner.user_id}::${activeUnit.id}`);
    setSelectedLearner(learner);
    setQuizScore(progress?.quiz_score != null ? String(progress.quiz_score) : "");
    navigate(`/assessments/quizzes/${activeUnit.id}/capture/${learner.user_id}`);
  };

  useEffect(() => {
    if (!userId) {
      setSelectedLearner(null);
      return;
    }

    const found = learners.find((learner) => learner.user_id === userId);
    if (found && selectedLearner?.user_id !== userId) {
      openCapture(found);
    }
  }, [userId, learners, selectedLearner?.user_id]);

  const closeCapture = () => {
    setSelectedLearner(null);
    setQuizScore("");
    navigate(`/assessments/quizzes/${activeUnit.id}`);
  };

  const saveCapture = async () => {
    if (!selectedLearner) return;

    const scoreValue = Number(quizScore);
    if (!Number.isFinite(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      toast({
        title: "Invalid score",
        description: "Quiz score must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const db = supabase as unknown as any;

    try {
      const now = new Date().toISOString();
      const passed = scoreValue >= 70;

      const { error: saveError } = await db
        .from("learner_progress")
        .upsert({
          user_id: selectedLearner.user_id,
          module_unit_standard_id: activeUnit.id,
          quiz_completed: true,
          quiz_passed: passed,
          quiz_score: scoreValue,
          updated_at: now,
        }, {
          onConflict: "user_id,module_unit_standard_id",
        });

      if (saveError) throw saveError;

      toast({
        title: "Quiz captured",
        description: `${selectedLearner.full_name}'s quiz score was saved successfully.`,
      });

      await loadData();
      closeCapture();
    } catch (error: any) {
      console.error("Failed to save quiz capture:", error);
      toast({
        title: "Save failed",
        description: error?.message || "Could not save this quiz capture.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!activeUnit) {
    return (
      <AppLayout title="Quiz Management" subtitle="No modules found">
        <p className="text-sm text-muted-foreground">No modules found in course data.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Quiz Management" subtitle="Learner-by-learner quiz completion and score capture">
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {quizUnits.map((unit, idx) => (
          <button
            key={unit.id}
            onClick={() => {
              setActiveIndex(idx);
              navigate(`/assessments/quizzes/${unit.id}`);
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
              <ClipboardCheck size={15} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">Learner Quiz Tracking</p>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {learnerRows.filter((row) => row.completed).length} / {learnerRows.length} completed
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
                    <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Score</th>
                    <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Status</th>
                    <th className="pb-2 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {learnerRows.map(({ learner, progress, completed }) => (
                    <tr key={`${learner.user_id}-${activeUnit.id}`} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4 font-medium text-foreground">{learner.full_name}</td>
                      <td className="py-2 pr-4 text-muted-foreground font-mono">{learner.learner_code}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {progress?.quiz_score != null ? `${progress.quiz_score}% (${toOutOfThree(progress.quiz_score)})` : "-"}
                      </td>
                      <td className="py-2 pr-4">
                        {completed ? (
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                            <CheckCircle2 size={11} /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                            <Circle size={11} /> Not completed
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => openCapture(learner)} className="gap-1 h-7 text-[10px] px-2.5">
                          <ClipboardCheck size={11} /> View / Capture
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 max-w-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Quiz Capture for {selectedLearner.full_name}</p>
              <p className="text-xs text-muted-foreground">
                Capture final quiz score as a percentage. Pass is calculated at 70% and above.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={closeCapture} className="gap-2 self-start">
              <ArrowLeft size={14} /> Back to learner list
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quizScore">Final score (%)</Label>
            <Input
              id="quizScore"
              type="number"
              min="0"
              max="100"
              value={quizScore}
              onChange={(e) => setQuizScore(e.target.value)}
              placeholder="e.g. 75"
              disabled={saving}
            />
            <p className="text-[11px] text-muted-foreground">
              {quizScore.trim() && Number.isFinite(Number(quizScore))
                ? `Equivalent score: ${toOutOfThree(Number(quizScore))}`
                : "Enter a percentage score to continue."}
            </p>
          </div>

          <div className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground space-y-1">
            <p>Pass threshold: 70%</p>
            <p>
              Current outcome:{" "}
              <span className="font-semibold text-foreground">
                {quizScore.trim() && Number(quizScore) >= 70 ? "Passed" : "Not yet passed"}
              </span>
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeCapture} disabled={saving}>Cancel</Button>
            <Button type="button" onClick={() => void saveCapture()} disabled={saving || !quizScore.trim()}>
              {saving ? "Saving..." : "Save quiz capture"}
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
