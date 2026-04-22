import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, KeyRound, RefreshCw, Trash2, Copy, CheckCircle2, Circle, Users, ClipboardCheck, Download, Printer
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BLOCK_INTERACTIVE_SECTIONS_MAP } from "@/data/blockAssessmentQuestions";
import { autoMarkBlock1Submission, type AutoMarkItem, type AutoMarkResult } from "@/lib/blockAssessmentAutoMark";
import { useAuth } from "@/hooks/useAuth";
import { useAssessmentControl } from "@/hooks/useAssessmentControl";

type ReviewItem = AutoMarkItem & {
  confirmed: boolean;
  manualAwarded: number;
  reviewNote: string;
};

type AssessmentCaptureMode = "auto" | "manual";

type ManualMarkItem = {
  questionId: string;
  label: string;
  prompt: string;
  sectionId: string;
  sectionTitle: string;
  sectionModule: string;
  maxMarks: number;
  markedCorrect: boolean | null;
  awarded: number;
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
  const [assessmentMode, setAssessmentMode] = useState<AssessmentCaptureMode>("auto");
  const [correctCount, setCorrectCount] = useState("");
  const [wrongCount, setWrongCount] = useState("");
  const [bonusB3Marks, setBonusB3Marks] = useState("0");
  const [correctQuestionRefs, setCorrectQuestionRefs] = useState("");
  const [incorrectQuestionRefs, setIncorrectQuestionRefs] = useState("");
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [portfolioCaptured, setPortfolioCaptured] = useState(true);
  const [savingGrade, setSavingGrade] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [answerbookFile, setAnswerbookFile] = useState<File | null>(null);
  const [attachedAnswerbookPath, setAttachedAnswerbookPath] = useState<string | null>(null);

  const db = supabase as unknown as any;
  const supportsAutoMark = blockKey === "block-1";
  const blockNumber = blockKey.replace("block-", "");
  const manualSections = useMemo(() => BLOCK_INTERACTIVE_SECTIONS_MAP[blockNumber] ?? [], [blockNumber]);
  const [manualMarkItems, setManualMarkItems] = useState<ManualMarkItem[]>([]);

  const seedManualMarkItems = useMemo<ManualMarkItem[]>(() => {
    return manualSections.flatMap((section) =>
      section.questions.map((question) => ({
        questionId: question.id,
        label: question.label,
        prompt: question.prompt,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionModule: section.module,
        maxMarks: question.marks,
        markedCorrect: null,
        awarded: 0,
      }))
    );
  }, [manualSections]);

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

  const manualSummary = useMemo(() => {
    const score = manualMarkItems.reduce((sum, item) => sum + item.awarded, 0);
    const maxScore = manualMarkItems.reduce((sum, item) => sum + item.maxMarks, 0);
    const correct = manualMarkItems.filter((item) => item.markedCorrect === true).length;
    const incorrect = manualMarkItems.filter((item) => item.markedCorrect === false).length;
    const pending = manualMarkItems.filter((item) => item.markedCorrect === null).length;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    return {
      score,
      maxScore,
      correct,
      incorrect,
      pending,
      percentage,
    };
  }, [manualMarkItems]);

  const manualSectionSummaries = useMemo(() => {
    const sectionOrder = manualSections.map((section) => section.id);
    const bySection = new Map<string, {
      sectionId: string;
      sectionTitle: string;
      module: string;
      awarded: number;
      max: number;
      correct: number;
      incorrect: number;
      pending: number;
    }>();

    manualMarkItems.forEach((item) => {
      if (!bySection.has(item.sectionId)) {
        bySection.set(item.sectionId, {
          sectionId: item.sectionId,
          sectionTitle: item.sectionTitle,
          module: item.sectionModule,
          awarded: 0,
          max: 0,
          correct: 0,
          incorrect: 0,
          pending: 0,
        });
      }

      const section = bySection.get(item.sectionId)!;
      section.awarded += item.awarded;
      section.max += item.maxMarks;
      if (item.markedCorrect === true) section.correct += 1;
      else if (item.markedCorrect === false) section.incorrect += 1;
      else section.pending += 1;
    });

    return sectionOrder
      .map((id) => bySection.get(id))
      .filter((section): section is NonNullable<typeof section> => Boolean(section));
  }, [manualMarkItems, manualSections]);

  useEffect(() => {
    if (assessmentMode === "manual") {
      if (!manualMarkItems.length) return;
      setCorrectCount(String(manualSummary.correct));
      setWrongCount(String(manualSummary.incorrect));
      setGrade(String(manualSummary.percentage));
      return;
    }

    if (!reviewItems.length) return;
    setCorrectCount(String(reviewSummary.confirmedCorrect));
    setWrongCount(String(reviewSummary.needsAttention));
    setGrade(String(reviewSummary.percentage));
  }, [assessmentMode, manualMarkItems.length, manualSummary.correct, manualSummary.incorrect, manualSummary.percentage, reviewItems.length, reviewSummary.confirmedCorrect, reviewSummary.needsAttention, reviewSummary.percentage]);

  useEffect(() => {
    if (assessmentMode !== "manual") return;
    setReviewItems([]);
    setAutoResult(null);
    if (!manualMarkItems.length && seedManualMarkItems.length) {
      setManualMarkItems(seedManualMarkItems);
    }
  }, [assessmentMode, manualMarkItems.length, seedManualMarkItems]);

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
    setAssessmentMode("auto");
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
    setAssessmentMode("manual");
    setReviewItems([]);
    setManualMarkItems(seedManualMarkItems);
    setCorrectCount("");
    setWrongCount("");
    setBonusB3Marks("0");
    setCorrectQuestionRefs("");
    setIncorrectQuestionRefs("");
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
      setAssessmentMode(supportsAutoMark && loadedText.trim() ? "auto" : "manual");

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

  const markManualQuestion = (questionId: string, isCorrect: boolean) => {
    setManualMarkItems((prev) =>
      prev.map((item) =>
        item.questionId === questionId
          ? {
              ...item,
              markedCorrect: isCorrect,
              awarded: isCorrect ? item.maxMarks : 0,
            }
          : item
      )
    );
  };

  const markManualSection = (sectionId: string, isCorrect: boolean) => {
    setManualMarkItems((prev) =>
      prev.map((item) =>
        item.sectionId === sectionId
          ? {
              ...item,
              markedCorrect: isCorrect,
              awarded: isCorrect ? item.maxMarks : 0,
            }
          : item
      )
    );
  };

  const printManualMarkSheet = () => {
    if (!selectedLearner || !manualSectionSummaries.length) return;

    const sectionsHtml = manualSectionSummaries
      .map((section) => {
        const rows = manualMarkItems
          .filter((item) => item.sectionId === section.sectionId)
          .map((item) => `
            <tr>
              <td>${item.label}</td>
              <td>${item.prompt}</td>
              <td>${item.markedCorrect === true ? "Correct" : item.markedCorrect === false ? "Incorrect" : "Pending"}</td>
              <td>${item.awarded}/${item.maxMarks}</td>
            </tr>
          `)
          .join("");

        return `
          <h3>${section.sectionTitle} - ${section.module}</h3>
          <p><strong>Section Total:</strong> ${section.awarded}/${section.max} | Correct: ${section.correct} | Incorrect: ${section.incorrect} | Pending: ${section.pending}</p>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Prompt</th>
                <th>Marking</th>
                <th>Awarded</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        `;
      })
      .join("<hr />");

    const win = window.open("", "_blank", "noopener,noreferrer,width=960,height=900");
    if (!win) return;

    win.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Manual Mark Sheet - ${selectedLearner.full_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
            h1, h2, h3 { margin: 0 0 8px; }
            p { margin: 4px 0 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 6px; vertical-align: top; text-align: left; }
            thead th { background: #f3f4f6; }
            hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
            @media print {
              body { padding: 8px; }
              hr { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Block Assessment Manual Mark Sheet</h1>
          <p><strong>Learner:</strong> ${selectedLearner.full_name} (${selectedLearner.learner_code})</p>
          <p><strong>Block:</strong> ${blockKey}</p>
          <p><strong>Overall:</strong> ${manualSummary.score}/${manualSummary.maxScore} (${manualSummary.percentage}%)</p>
          ${sectionsHtml}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const saveAssessorGrade = async () => {
    if (!selectedLearner) return;

    const isManualCapture = assessmentMode === "manual";
    const parsedCorrect = Number(correctCount);
    const parsedWrong = Number(wrongCount);
    const parsedBonusB3 = Number(bonusB3Marks || "0");

    if (isManualCapture) {
      if (!manualMarkItems.length) {
        toast({
          title: "Manual paper not loaded",
          description: "No manual question paper is available for this block yet.",
          variant: "destructive",
        });
        return;
      }

      if (manualSummary.pending > 0) {
        toast({
          title: "Manual marking incomplete",
          description: `Please mark all questions as correct or incorrect before saving. Pending: ${manualSummary.pending}.`,
          variant: "destructive",
        });
        return;
      }
    }

    const derivedGrade = isManualCapture ? manualSummary.percentage : (reviewItems.length ? reviewSummary.percentage : undefined);
    const manualDerivedGrade = isManualCapture && !Number.isNaN(parsedCorrect) && !Number.isNaN(parsedWrong) && (parsedCorrect + parsedWrong) > 0
      ? Math.round(((parsedCorrect + (Number.isNaN(parsedBonusB3) ? 0 : parsedBonusB3)) / (parsedCorrect + parsedWrong)) * 100)
      : undefined;
    const resolvedGrade = grade || (derivedGrade ?? manualDerivedGrade ?? "");
    const gradeNum = Number(resolvedGrade);
    if (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 125) {
      toast({
        title: "Invalid grade",
        description: "Please enter or confirm a grade between 0 and 125.",
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

      const manualValidationNotes = [
        isManualCapture ? `Manual marking score: ${manualSummary.score}/${manualSummary.maxScore}` : `B3 bonus marks: ${Number.isNaN(parsedBonusB3) ? 0 : parsedBonusB3}/5`,
        correctQuestionRefs.trim() ? `Correct question refs: ${correctQuestionRefs.trim()}` : "",
        incorrectQuestionRefs.trim() ? `Incorrect question refs: ${incorrectQuestionRefs.trim()}` : "",
      ].filter(Boolean);

      const compiledFeedback = [
        feedback.trim(),
        "",
        "[Assessor Capture]",
        `Mode: ${isManualCapture ? "Manual question-by-question marking" : reviewItems.length ? "Item-by-item verified" : autoResult ? "Auto-mark verified" : submissionText ? "Digital submission manual review" : "Paper-based manual capture"}`,
        `Verified score: ${isManualCapture ? `${manualSummary.score}/${manualSummary.maxScore} (${manualSummary.percentage}%)` : reviewItems.length ? `${reviewSummary.score}/${reviewSummary.maxScore} (${reviewSummary.percentage}%)` : `${gradeNum}%`}`,
        `Correct checks: ${correctCount || "not recorded"}`,
        `Incorrect checks: ${wrongCount || "not recorded"}`,
        ...manualValidationNotes,
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

      const assessmentAnswersPayload: Record<string, unknown> = isManualCapture
        ? Object.fromEntries(manualMarkItems.map((item) => [item.questionId, {
            label: item.label,
            prompt: item.prompt,
            sectionId: item.sectionId,
            sectionTitle: item.sectionTitle,
            markedCorrect: item.markedCorrect,
            awarded: item.awarded,
            maxMarks: item.maxMarks,
          }]))
        : reviewItems.length
        ? Object.fromEntries(reviewItems.map((item) => [item.key, {
            learnerAnswer: item.learnerAnswer,
            expected: item.expected,
            confirmed: item.confirmed,
            awarded: item.manualAwarded,
            maxMarks: item.maxMarks,
            reviewNote: item.reviewNote,
          }]))
        : {};

      if (isManualCapture || correctQuestionRefs.trim() || incorrectQuestionRefs.trim()) {
        assessmentAnswersPayload.__assessor_validation = {
          correct_question_refs: correctQuestionRefs.trim() || null,
          incorrect_question_refs: incorrectQuestionRefs.trim() || null,
          b3_bonus_marks: Number.isNaN(parsedBonusB3) ? 0 : parsedBonusB3,
          manual_score: isManualCapture ? manualSummary.score : null,
          manual_max_score: isManualCapture ? manualSummary.maxScore : null,
        };
      }

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
              portfolio_capture: {
                correct_question_refs: correctQuestionRefs.trim() || null,
                incorrect_question_refs: incorrectQuestionRefs.trim() || null,
                b3_bonus_marks: Number.isNaN(parsedBonusB3) ? 0 : parsedBonusB3,
              },
            },
            assessment_answers: assessmentAnswersPayload,
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <Label>Answer review</Label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setAssessmentMode("manual")}
                        className={`rounded-lg px-3 py-2 text-xs border transition-colors min-h-[40px] ${assessmentMode === "manual" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                      >
                        Manual marking mode
                      </button>
                      <button
                        type="button"
                        onClick={() => setAssessmentMode("auto")}
                        className={`rounded-lg px-3 py-2 text-xs border transition-colors min-h-[40px] ${assessmentMode === "auto" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                        disabled={!supportsAutoMark || !selectedLearner.assessment_submitted || !submissionText.trim()}
                      >
                        Auto-assisted mode
                      </button>
                      <Button type="button" variant="outline" size="sm" className="min-h-[40px]" onClick={runAutoMark} disabled={loadingSubmission || !supportsAutoMark || !selectedLearner.assessment_submitted || !submissionText.trim()}>
                        Auto-mark online answers
                      </Button>
                      {assessmentMode === "manual" && (
                        <Button type="button" variant="outline" size="sm" className="min-h-[40px] gap-1.5" onClick={printManualMarkSheet}>
                          <Printer size={12} /> Print mark sheet
                        </Button>
                      )}
                      {attachedAnswerbookPath && (
                        <Button type="button" variant="outline" size="sm" className="min-h-[40px]" onClick={() => openSubmissionFile(attachedAnswerbookPath)}>
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
                      ) : assessmentMode === "manual" ? (
                        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                          {manualSectionSummaries.map((section) => {
                            const sectionItems = manualMarkItems.filter((item) => item.sectionId === section.sectionId);
                            return (
                              <div key={section.sectionId} className="rounded-md border border-border bg-background px-3 py-3 space-y-2.5">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="font-semibold text-foreground">{section.sectionTitle}</p>
                                    <p className="text-[11px] text-muted-foreground">{section.module}</p>
                                  </div>
                                  <div className="text-[11px] text-muted-foreground flex flex-col sm:items-end gap-1">
                                    <span className="font-semibold text-foreground">{section.awarded}/{section.max}</span>
                                    <span className="ml-2">Correct: {section.correct} · Incorrect: {section.incorrect}</span>
                                    <div className="flex gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => markManualSection(section.sectionId, true)}
                                        className="rounded-md border border-border bg-secondary/50 px-2 py-1 text-[10px] text-foreground hover:bg-secondary"
                                      >
                                        Mark all correct
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => markManualSection(section.sectionId, false)}
                                        className="rounded-md border border-border bg-secondary/50 px-2 py-1 text-[10px] text-foreground hover:bg-secondary"
                                      >
                                        Mark all incorrect
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  {sectionItems.map((item) => (
                                    <div key={item.questionId} className="rounded-md border border-border/70 bg-muted/20 px-2.5 py-2.5">
                                      <div className="flex flex-col gap-1">
                                        <p className="text-foreground font-medium">{item.label} ({item.maxMarks} marks)</p>
                                        <p className="text-[11px] text-muted-foreground">{item.prompt}</p>
                                      </div>
                                      <div className="mt-2 flex flex-wrap gap-3 text-[12px]">
                                        <label className="inline-flex items-center gap-1.5 text-foreground">
                                          <input
                                            type="radio"
                                            name={`manual-${item.questionId}`}
                                            checked={item.markedCorrect === true}
                                            onChange={() => markManualQuestion(item.questionId, true)}
                                          />
                                          <span className="leading-none">Correct</span>
                                        </label>
                                        <label className="inline-flex items-center gap-1.5 text-foreground">
                                          <input
                                            type="radio"
                                            name={`manual-${item.questionId}`}
                                            checked={item.markedCorrect === false}
                                            onChange={() => markManualQuestion(item.questionId, false)}
                                          />
                                          <span className="leading-none">Incorrect</span>
                                        </label>
                                        <span className="text-muted-foreground">Awarded: <span className="font-semibold text-foreground">{item.awarded}/{item.maxMarks}</span></span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
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
                      <span className="text-right font-medium text-foreground">{assessmentMode === "manual" ? manualMarkItems.length : reviewItems.length || 0}</span>
                      <span>Confirmed correct</span>
                      <span className="text-right font-medium text-foreground">{assessmentMode === "manual" ? manualSummary.correct : reviewSummary.confirmedCorrect}</span>
                      <span>Needs attention</span>
                      <span className="text-right font-medium text-foreground">{assessmentMode === "manual" ? manualSummary.incorrect : reviewSummary.needsAttention}</span>
                      {assessmentMode === "manual" && (
                        <>
                          <span>Pending marks</span>
                          <span className="text-right font-medium text-foreground">{manualSummary.pending}</span>
                        </>
                      )}
                      <span>Verified score</span>
                      <span className="text-right font-medium text-foreground">{assessmentMode === "manual" ? `${manualSummary.score}/${manualSummary.maxScore || 0}` : `${reviewSummary.score}/${reviewSummary.maxScore || 0}`}</span>
                      <span>Verified %</span>
                      <span className="text-right font-medium text-foreground">{assessmentMode === "manual" ? `${manualSummary.percentage}%` : `${reviewSummary.percentage}%`}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="correctCount">Correct items</Label>
                      <Input id="correctCount" value={correctCount} onChange={(e) => setCorrectCount(e.target.value)} placeholder="e.g. 42" disabled={assessmentMode === "manual"} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="wrongCount">Incorrect items</Label>
                      <Input id="wrongCount" value={wrongCount} onChange={(e) => setWrongCount(e.target.value)} placeholder="e.g. 8" disabled={assessmentMode === "manual"} />
                    </div>
                  </div>

                  {assessmentMode !== "manual" && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="bonusB3Marks">Section B3 bonus marks (0-5)</Label>
                        <Input
                          id="bonusB3Marks"
                          type="number"
                          min="0"
                          max="5"
                          step="1"
                          value={bonusB3Marks}
                          onChange={(e) => setBonusB3Marks(e.target.value)}
                          placeholder="0 - 5"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Paper/manual flow: Section A + B1/B2 are base counts, and Section B3 is an optional bonus (/5). Grade is validated against counts plus bonus.
                      </p>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="correctQuestionRefs">Correct question refs (optional)</Label>
                    <Input
                      id="correctQuestionRefs"
                      value={correctQuestionRefs}
                      onChange={(e) => setCorrectQuestionRefs(e.target.value)}
                      placeholder="e.g. 1A1, 1A3, 2B2"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="incorrectQuestionRefs">Incorrect question refs (optional)</Label>
                    <Input
                      id="incorrectQuestionRefs"
                      value={incorrectQuestionRefs}
                      onChange={(e) => setIncorrectQuestionRefs(e.target.value)}
                      placeholder="e.g. 1B1, 2A3"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="grade">Final grade (%)</Label>
                    <Input id="grade" type="number" min="0" max="125" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="0 - 125" disabled={assessmentMode === "manual"} />
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
                <Button type="button" onClick={saveAssessorGrade} disabled={savingGrade || (assessmentMode === "manual" ? manualSummary.pending > 0 : (!grade.trim() && reviewItems.length === 0))}>
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
