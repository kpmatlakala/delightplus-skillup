import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, KeyRound, RefreshCw, Trash2, Copy, CheckCircle2, Circle, Users, ClipboardCheck, Download
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { autoMarkBlock1Submission, type AutoMarkItem, type AutoMarkResult } from "@/lib/blockAssessmentAutoMark";
import { useAuth } from "@/hooks/useAuth";
import { useAssessmentControl } from "@/hooks/useAssessmentControl";

type ReviewItem = AutoMarkItem & {
  confirmed: boolean;
  manualAwarded: number;
  reviewNote: string;
};

/* ─── Block metadata ─────────────────────────────────────────────────────── */
const BLOCKS = [
  {
    key: "block-1",
    label: "Block 1",
    full: "Block 1 — Foundations of Systems Development",
    date: "06 April 2026 (AM)",
    units: ["14924", "14920", "14918", "14927", "14915"],
  },
  {
    key: "block-2",
    label: "Block 2",
    full: "Block 2 — Applied Programming and Systems Design",
    date: "04 May 2026 (AM)",
    units: ["14910", "14933"],
  },
  {
    key: "block-3",
    label: "Block 3",
    full: "Block 3 — Testing, Support and Integrated Assessment",
    date: "07/08 May 2026 (AM)",
    units: ["14908", "14919", "120379"],
  },
];

/* ─── OTP Panel sub-component ────────────────────────────────────────────── */
function OtpPanel({
  blockKey,
  role,
  activeLearnerId,
  onOpenCapture,
  onCloseCapture,
}: {
  blockKey: string;
  role: string | null;
  activeLearnerId?: string;
  onOpenCapture: (learnerId: string) => void;
  onCloseCapture: () => void;
}) {
  const {
    otp, generating, revoking, loadingOtp,
    generateOtp, revokeOtp, refreshOtp,
    learnerStatuses, loadingStatuses, clearingLearnerId,
    clearLearnerProgress, refreshStatuses,
  } = useAssessmentControl(blockKey, role);
  const { user: authUser } = useAuth();
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmClearId, setConfirmClearId] = useState<string | null>(null);
  const [selectedLearner, setSelectedLearner] = useState<(typeof learnerStatuses)[number] | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [autoResult, setAutoResult] = useState<AutoMarkResult | null>(null);
  const [correctCount, setCorrectCount] = useState("");
  const [wrongCount, setWrongCount] = useState("");
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [portfolioCaptured, setPortfolioCaptured] = useState(true);
  const [savingGrade, setSavingGrade] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [answerbookFile, setAnswerbookFile] = useState<File | null>(null);
  const [attachedAnswerbookPath, setAttachedAnswerbookPath] = useState<string | null>(null);

  const db = supabase as unknown as any;
  const supportsAutoMark = blockKey === "block-1";

  const reviewSummary = useMemo(() => {
    const score = reviewItems.reduce((sum, item) => sum + (Number.isFinite(item.manualAwarded) ? item.manualAwarded : 0), 0);
    const maxScore = reviewItems.reduce((sum, item) => sum + item.maxMarks, 0);
    const confirmedCorrect = reviewItems.filter((item) => item.manualAwarded > 0).length;
    const needsAttention = reviewItems.filter((item) => item.manualAwarded <= 0).length;
    const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;

    return {
      score,
      maxScore,
      confirmedCorrect,
      needsAttention,
      percentage,
    };
  }, [reviewItems]);

  useEffect(() => {
    if (!reviewItems.length) return;
    setCorrectCount(String(reviewSummary.confirmedCorrect));
    setWrongCount(String(reviewSummary.needsAttention));
    setGrade(String(reviewSummary.percentage));
  }, [reviewItems, reviewSummary.confirmedCorrect, reviewSummary.needsAttention, reviewSummary.percentage]);

  useEffect(() => {
    if (!activeLearnerId) {
      setSelectedLearner(null);
      return;
    }

    const learner = learnerStatuses.find((item) => item.learner_id === activeLearnerId);
    if (learner && selectedLearner?.learner_id !== activeLearnerId) {
      void openAssessorDialog(learner);
    }
  }, [activeLearnerId, learnerStatuses, selectedLearner?.learner_id]);

  const copyOtp = () => {
    if (!otp) return;
    navigator.clipboard.writeText(otp.otp_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timeLeft = (expiresAt: string): string => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${m}m ${s}s`;
  };

  const submittedCount = learnerStatuses.filter((l) => l.assessment_submitted).length;

  const applyAutoMarkResult = (result: AutoMarkResult) => {
    setAutoResult(result);
    setReviewItems(
      result.results.map((item) => ({
        ...item,
        confirmed: item.awarded > 0,
        manualAwarded: item.awarded,
        reviewNote: item.note ?? "",
      }))
    );
    setCorrectCount(String(result.correctCount));
    setWrongCount(String(result.wrongCount));
    setGrade(String(result.percentage));
    setFeedback([
      result.summary,
      "",
      "Verification note:",
      "Review and confirm each answer below before finalising the capture.",
    ].join("\n"));
  };

  const updateReviewItem = (key: string, updates: Partial<ReviewItem>) => {
    setReviewItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...updates } : item)));
  };

  const loadSubmissionText = async (path: string | null) => {
    if (!path || !/\.(txt|md)$/i.test(path)) return "";
    const { data, error } = await supabase.storage.from("assessment-submissions").download(path);
    if (error || !data) return "";
    return data.text();
  };

  const openSubmissionFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("assessment-submissions").createSignedUrl(path, 300);
    if (error || !data?.signedUrl) {
      toast({
        title: "File unavailable",
        description: "The learner submission could not be opened right now.",
        variant: "destructive",
      });
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const openAssessorDialog = async (learner: (typeof learnerStatuses)[number]) => {
    setSelectedLearner(learner);
    setLoadingSubmission(true);
    setSubmissionText("");
    setAutoResult(null);
    setReviewItems([]);
    setCorrectCount("");
    setWrongCount("");
    setGrade("");
    setFeedback("");
    setPortfolioCaptured(true);
    setAnswerbookFile(null);
    setAttachedAnswerbookPath(learner.submission_path ?? null);

    try {
      const { data: learnerRow } = await db
        .from("learners")
        .select("user_id")
        .eq("id", learner.learner_id)
        .maybeSingle();

      if (learnerRow?.user_id) {
        const { data: progressRow } = await db
          .from("learner_progress")
          .select("assessment_grade, assessment_feedback")
          .eq("user_id", learnerRow.user_id)
          .eq("module_unit_standard_id", blockKey)
          .maybeSingle();

        if (progressRow?.assessment_grade != null) {
          setGrade(String(progressRow.assessment_grade));
        }
        if (progressRow?.assessment_feedback) {
          setFeedback(progressRow.assessment_feedback);
        }
      }

      const loadedText = await loadSubmissionText(learner.submission_path);
      setSubmissionText(loadedText);

      if (supportsAutoMark && loadedText.trim()) {
        applyAutoMarkResult(autoMarkBlock1Submission(loadedText));
      }
    } catch (error) {
      console.error("Failed to load submission for grading:", error);
    } finally {
      setLoadingSubmission(false);
    }
  };

  const runAutoMark = () => {
    if (!supportsAutoMark) {
      toast({
        title: "Manual review required",
        description: "Item-by-item auto-verification is currently configured for Block 1. You can still upload a scanned answerbook and capture the marks manually.",
      });
      return;
    }

    if (!submissionText.trim()) {
      toast({
        title: "Auto-mark unavailable",
        description: "This learner likely submitted a paper script or PDF. Attach the scanned answerbook and use the verification panel below.",
        variant: "destructive",
      });
      return;
    }

    applyAutoMarkResult(autoMarkBlock1Submission(submissionText));
  };

  const saveAssessorGrade = async () => {
    if (!selectedLearner) return;

    const derivedGrade = reviewItems.length ? reviewSummary.percentage : undefined;
    const resolvedGrade = grade || (derivedGrade ?? "");
    const gradeNum = Number(resolvedGrade);
    if (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast({
        title: "Invalid grade",
        description: "Please enter or confirm a grade between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    setSavingGrade(true);
    try {
      const { data: learnerRow, error: learnerError } = await db
        .from("learners")
        .select("user_id")
        .eq("id", selectedLearner.learner_id)
        .maybeSingle();

      if (learnerError || !learnerRow?.user_id) {
        throw new Error("Could not find the learner profile for grading.");
      }

      let resolvedSubmissionPath = selectedLearner.submission_path ?? null;
      if (answerbookFile) {
        const safeName = answerbookFile.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
        const uploadPath = `admin-reviewed/${blockKey}/${selectedLearner.learner_id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("assessment-submissions")
          .upload(uploadPath, answerbookFile, {
            upsert: false,
            contentType: answerbookFile.type || undefined,
          });

        if (uploadError) {
          throw new Error(uploadError.message || "The scanned answerbook could not be uploaded.");
        }

        resolvedSubmissionPath = uploadPath;
        setAttachedAnswerbookPath(uploadPath);
      }

      const reviewNotes = reviewItems
        .filter((item) => item.reviewNote.trim())
        .map((item) => `- ${item.label}: ${item.reviewNote.trim()}`);

      const compiledFeedback = [
        feedback.trim(),
        "",
        "[Assessor Capture]",
        `Mode: ${reviewItems.length ? "Item-by-item verified" : autoResult ? "Auto-mark verified" : submissionText ? "Digital submission manual review" : "Paper-based manual capture"}`,
        `Verified score: ${reviewItems.length ? `${reviewSummary.score}/${reviewSummary.maxScore} (${reviewSummary.percentage}%)` : `${gradeNum}%`}`,
        `Correct checks: ${correctCount || "not recorded"}`,
        `Incorrect checks: ${wrongCount || "not recorded"}`,
        `Answerbook attachment: ${resolvedSubmissionPath ?? "none attached"}`,
        `PoE capture: ${portfolioCaptured ? "Completed" : "Pending"}`,
        reviewNotes.length ? "Review notes:" : "",
        ...reviewNotes,
      ].filter(Boolean).join("\n");

      const timestamp = new Date().toISOString();
      const progressPayload = {
        user_id: learnerRow.user_id,
        module_unit_standard_id: blockKey,
        assessment_unlocked: true,
        assessment_submitted: true,
        submission_path: resolvedSubmissionPath,
        submission_uploaded_at: selectedLearner.assessment_submitted_at ?? timestamp,
        assessment_grade: gradeNum,
        assessment_feedback: compiledFeedback,
        assessment_graded_at: timestamp,
        updated_at: timestamp,
      };

      const { error: saveError } = await db
        .from("learner_progress")
        .upsert(progressPayload, { onConflict: "user_id,module_unit_standard_id" });

      if (saveError) throw saveError;

      try {
        await db
          .from("assessment_submissions_detailed")
          .upsert({
            learner_id: selectedLearner.learner_id,
            module_unit_standard_id: blockKey,
            submission_content: submissionText || "Assessor-captured paper submission.",
            submission_path: resolvedSubmissionPath,
            file_name: answerbookFile?.name ?? resolvedSubmissionPath?.split("/").pop() ?? null,
            learner_info: {
              full_name: selectedLearner.full_name,
              learner_code: selectedLearner.learner_code,
              captured_by_admin: true,
            },
            assessment_answers: reviewItems.length
              ? Object.fromEntries(reviewItems.map((item) => [item.key, {
                  learnerAnswer: item.learnerAnswer,
                  expected: item.expected,
                  confirmed: item.confirmed,
                  awarded: item.manualAwarded,
                  maxMarks: item.maxMarks,
                  reviewNote: item.reviewNote,
                }]))
              : {},
            submitted_at: selectedLearner.assessment_submitted_at ?? timestamp,
            assessment_grade: gradeNum,
            assessment_feedback: compiledFeedback,
            graded_at: timestamp,
            graded_by: authUser?.id ?? null,
            updated_at: timestamp,
          }, { onConflict: "learner_id,module_unit_standard_id" });
      } catch (detailError) {
        console.warn("Detailed assessment update skipped:", detailError);
      }

      toast({
        title: "Assessment captured",
        description: `${selectedLearner.full_name}'s Block assessment has been verified, captured, and the answerbook attachment has been saved.`,
      });

      onCloseCapture();
      await refreshStatuses();
    } catch (error: any) {
      console.error("Failed to save assessor grade:", error);
      toast({
        title: "Save failed",
        description: error?.message || "The grade could not be saved.",
        variant: "destructive",
      });
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="space-y-5">
      {!activeLearnerId && (
        <>
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound size={16} className="text-primary" />
                <p className="text-sm font-semibold text-foreground">Assessment OTP</p>
              </div>
              <button
                onClick={() => { refreshOtp(); refreshStatuses(); }}
                className="rounded-lg px-3 py-1.5 border border-border bg-background text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={11} /> Refresh
              </button>
            </div>

            {loadingOtp ? (
              <p className="text-xs text-muted-foreground">Loading…</p>
            ) : otp ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-3xl font-bold tracking-[0.35em] text-foreground bg-secondary/40 border border-border rounded-lg px-5 py-3 select-all">
                    {otp.otp_code}
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={copyOtp}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 transition-colors w-full"
                    >
                      <Copy size={11} />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    {confirmRevoke ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={async () => { await revokeOtp(); setConfirmRevoke(false); }}
                          disabled={revoking}
                          className="rounded-lg bg-red-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                          {revoking ? "Revoking…" : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmRevoke(false)}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRevoke(true)}
                        className="flex items-center gap-1.5 rounded-lg border border-red-300/60 bg-background px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                      >
                        <Trash2 size={11} /> Revoke
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Expires: <span className="font-medium text-foreground">{new Date(otp.expires_at).toLocaleTimeString()}</span>
                  &nbsp;({timeLeft(otp.expires_at)})
                  &nbsp;· Created: {new Date(otp.created_at).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">No active OTP. Generate one to allow learners to unlock this block assessment.</p>
                <button
                  onClick={generateOtp}
                  disabled={generating}
                  className="rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {generating ? "Generating…" : "Generate OTP"}
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-primary" />
                <p className="text-sm font-semibold text-foreground">Assessor Marking & Submission Capture</p>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {submittedCount} / {learnerStatuses.length} submitted online
              </span>
            </div>

            {loadingStatuses ? (
              <p className="text-xs text-muted-foreground">Loading learners…</p>
            ) : learnerStatuses.length === 0 ? (
              <p className="text-xs text-muted-foreground">No learner data. Make sure the OTP RPCs and progress RPCs are live in the DB.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Learner</th>
                      <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Code</th>
                      <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Status</th>
                      <th className="pb-2 pr-4 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Submitted At</th>
                      <th className="pb-2 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learnerStatuses.map((l) => (
                      <tr key={l.learner_id} className="border-b border-border/50 last:border-0">
                        <td className="py-2 pr-4 font-medium text-foreground">{l.full_name}</td>
                        <td className="py-2 pr-4 text-muted-foreground font-mono">{l.learner_code}</td>
                        <td className="py-2 pr-4">
                          {l.assessment_submitted ? (
                            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                              <CheckCircle2 size={11} /> Submitted online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                              <Circle size={11} /> Paper/manual capture only
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {l.assessment_submitted_at
                            ? new Date(l.assessment_submitted_at).toLocaleString()
                            : "—"}
                        </td>
                        <td className="py-2">
                          <div className="flex flex-wrap gap-1.5">
                            <Button type="button" variant="outline" size="sm" onClick={() => onOpenCapture(l.learner_id)} className="gap-1 h-7 text-[10px] px-2.5">
                              <ClipboardCheck size={11} /> Open Capture Page
                            </Button>
                            {l.assessment_submitted && l.submission_path && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-1 h-7 text-[10px] px-2.5"
                                onClick={() => openSubmissionFile(l.submission_path!)}
                              >
                                <Download size={11} /> File
                              </Button>
                            )}
                            {l.assessment_submitted && (
                              <>
                                {confirmClearId === l.learner_id ? (
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={async () => {
                                        await clearLearnerProgress(l.learner_id, blockKey);
                                        setConfirmClearId(null);
                                        refreshStatuses();
                                      }}
                                      disabled={clearingLearnerId === l.learner_id}
                                      className="rounded-md bg-red-600 text-white px-2 py-0.5 text-[10px] font-medium hover:bg-red-700 disabled:opacity-50"
                                    >
                                      {clearingLearnerId === l.learner_id ? "Clearing…" : "Confirm"}
                                    </button>
                                    <button
                                      onClick={() => setConfirmClearId(null)}
                                      className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmClearId(l.learner_id)}
                                    className="rounded-md border border-red-300/60 px-2 py-0.5 text-[10px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  >
                                    Clear
                                  </button>
                                )}
                              </>
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
        </>
      )}

      {activeLearnerId && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Assessor Grading & Capture</p>
              <p className="text-xs text-muted-foreground">
                Dedicated capture route for reviewing answers, confirming each response, and attaching the scanned answerbook.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={onCloseCapture} className="gap-2 self-start">
              <ArrowLeft size={14} /> Back to block submissions
            </Button>
          </div>

          {!selectedLearner ? (
            <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Loading learner capture details…
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
                <p className="font-semibold text-foreground">{selectedLearner.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedLearner.assessment_submitted
                    ? "Submitted answers are available for review. Confirm each answer below before saving the capture."
                    : "No digital answers detected yet — upload the scanned answerbook and capture the marks manually below."}
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Answer review</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={runAutoMark} disabled={loadingSubmission || !supportsAutoMark || !selectedLearner.assessment_submitted || !submissionText.trim()}>
                        Auto-mark online answers
                      </Button>
                      {attachedAnswerbookPath && (
                        <Button type="button" variant="outline" size="sm" onClick={() => openSubmissionFile(attachedAnswerbookPath)}>
                          Open attached answerbook
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background p-3 space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="answerbookUpload">Attach scanned answerbook</Label>
                      <Input
                        id="answerbookUpload"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,image/*"
                        onChange={(e) => setAnswerbookFile(e.target.files?.[0] ?? null)}
                        disabled={savingGrade}
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {answerbookFile
                          ? `Ready to upload: ${answerbookFile.name}`
                          : attachedAnswerbookPath
                            ? `Current attachment: ${attachedAnswerbookPath.split("/").pop()}`
                            : "No scanned answerbook attached yet."}
                      </p>
                    </div>

                    {submissionText.trim() && (
                      <details className="rounded-md border border-border/70 px-3 py-2 text-xs text-muted-foreground">
                        <summary className="cursor-pointer font-medium text-foreground">View raw submitted answer text</summary>
                        <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap text-[11px]">{submissionText}</pre>
                      </details>
                    )}

                    <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground min-h-[220px]">
                      {loadingSubmission ? (
                        <p>Loading submitted work…</p>
                      ) : reviewItems.length ? (
                        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                          {reviewItems.map((item) => (
                            <div key={item.key} className="rounded-md border border-border bg-background px-3 py-2 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-foreground">{item.label}</p>
                                  <p><span className="font-medium text-foreground">Learner:</span> {item.learnerAnswer}</p>
                                  <p><span className="font-medium text-foreground">Expected:</span> {item.expected}</p>
                                </div>
                                <div className="text-right text-[11px] text-muted-foreground">
                                  <div>Max: {item.maxMarks}</div>
                                  <div>Auto: {item.awarded}</div>
                                </div>
                              </div>

                              <div className="grid gap-2 md:grid-cols-[auto_96px_1fr] md:items-center">
                                <label className="flex items-center gap-2 text-foreground">
                                  <input
                                    type="checkbox"
                                    checked={item.confirmed}
                                    onChange={(e) => updateReviewItem(item.key, {
                                      confirmed: e.target.checked,
                                      manualAwarded: e.target.checked ? item.maxMarks : 0,
                                    })}
                                  />
                                  Confirm as correct
                                </label>

                                <div>
                                  <Label className="text-[11px]">Awarded</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max={item.maxMarks}
                                    value={item.manualAwarded}
                                    onChange={(e) => {
                                      const value = Math.max(0, Math.min(item.maxMarks, Number(e.target.value || 0)));
                                      updateReviewItem(item.key, {
                                        manualAwarded: value,
                                        confirmed: value > 0,
                                      });
                                    }}
                                  />
                                </div>

                                <div>
                                  <Label className="text-[11px]">Assessor note</Label>
                                  <Input
                                    value={item.reviewNote}
                                    onChange={(e) => updateReviewItem(item.key, { reviewNote: e.target.value })}
                                    placeholder="Optional verification note"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>
                          No structured answer data is available yet. For paper-based submissions, upload the scanned answerbook and enter the final grading summary on the right.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                    <p className="text-sm font-semibold text-foreground">Verification summary</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Items reviewed</span>
                      <span className="text-right font-medium text-foreground">{reviewItems.length || 0}</span>
                      <span>Confirmed correct</span>
                      <span className="text-right font-medium text-foreground">{reviewSummary.confirmedCorrect}</span>
                      <span>Needs attention</span>
                      <span className="text-right font-medium text-foreground">{reviewSummary.needsAttention}</span>
                      <span>Verified score</span>
                      <span className="text-right font-medium text-foreground">{reviewSummary.score}/{reviewSummary.maxScore || 0}</span>
                      <span>Verified %</span>
                      <span className="text-right font-medium text-foreground">{reviewSummary.percentage}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="correctCount">Correct items</Label>
                      <Input id="correctCount" value={correctCount} onChange={(e) => setCorrectCount(e.target.value)} placeholder="e.g. 42" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="wrongCount">Incorrect items</Label>
                      <Input id="wrongCount" value={wrongCount} onChange={(e) => setWrongCount(e.target.value)} placeholder="e.g. 8" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="grade">Final grade (%)</Label>
                    <Input id="grade" type="number" min="0" max="100" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="0 - 100" />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input type="checkbox" checked={portfolioCaptured} onChange={(e) => setPortfolioCaptured(e.target.checked)} />
                    Mark PoE / portfolio capture as completed
                  </label>

                  <div className="space-y-1.5">
                    <Label htmlFor="feedback">Assessor notes / verification</Label>
                    <Textarea id="feedback" rows={10} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Add verification notes, moderation comments, or paper-based marking observations..." />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCloseCapture} disabled={savingGrade}>Cancel</Button>
                <Button type="button" onClick={saveAssessorGrade} disabled={savingGrade || (!grade.trim() && reviewItems.length === 0)}>
                  {savingGrade ? "Saving…" : "Save grading capture"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
export default function BlockAssessmentAdminPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { blockKey: routeBlockKey, learnerId } = useParams<{ blockKey?: string; learnerId?: string }>();
  const defaultIndex = Math.max(0, BLOCKS.findIndex((block) => block.key === routeBlockKey));
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  useEffect(() => {
    if (!routeBlockKey) return;
    const nextIndex = BLOCKS.findIndex((block) => block.key === routeBlockKey);
    if (nextIndex >= 0 && nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  }, [routeBlockKey, activeIndex]);

  const active = BLOCKS[activeIndex];
  const openCaptureRoute = (targetLearnerId: string) => {
    navigate(`/assessments/blocks/${active.key}/capture/${targetLearnerId}`);
  };
  const closeCaptureRoute = () => {
    navigate("/assessments/blocks");
  };

  return (
    <AppLayout title="Block Assessments" subtitle="Manage OTPs and track submissions per block">
      {/* Tab bar */}
      <div className="flex gap-2 mb-5">
        {BLOCKS.map((b, i) => (
          <button
            key={b.key}
            onClick={() => {
              setActiveIndex(i);
              if (routeBlockKey || learnerId) {
                navigate("/assessments/blocks");
              }
            }}
            className={[
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors border",
              activeIndex === i
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary/50",
            ].join(" ")}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Block header */}
      <div className="rounded-xl border border-border bg-card px-5 py-4 mb-5 space-y-1">
        <p className="text-sm font-semibold text-foreground">{active.full}</p>
        <p className="text-xs text-muted-foreground">
          Summative Date: <span className="font-medium text-foreground">{active.date}</span>
          &nbsp;·&nbsp; Units: {active.units.join(", ")}
        </p>
      </div>

      {/* Panel — remount on tab switch so hook re-fetches */}
      <OtpPanel
        key={`${active.key}-${learnerId ?? "list"}`}
        blockKey={active.key}
        role={role}
        activeLearnerId={routeBlockKey === active.key ? learnerId : undefined}
        onOpenCapture={openCaptureRoute}
        onCloseCapture={closeCaptureRoute}
      />
    </AppLayout>
  );
}
