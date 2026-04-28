import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { KeyRound, CheckCircle2, ArrowLeft, ShieldCheck, ExternalLink } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import type { AssessmentPayload } from "@/components/AssessmentForm";
import BlockMarkdownAssessment from "@/components/BlockMarkdownAssessment";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { supabase } from "@/integrations/supabase/client";
import { fileUploadService } from "@/services/fileUploadService";
import { BLOCK_ASSESSMENT_MAP } from "@/data/blockAssessments";
import { BLOCK_INTERACTIVE_SECTIONS_MAP } from "@/data/blockAssessmentQuestions";

/* ─── Typed RPC helper ───────────────────────────────────────────────────── */
const rpc = supabase as unknown as {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

const OTP_SUSPENDED = import.meta.env.DEV || import.meta.env.VITE_SUSPEND_ASSESSMENT_OTP === "true";

/* ─────────────────────────────────────────────────────────────────────────── */
export default function BlockAssessmentPage() {
  const { blockNum } = useParams<{ blockNum: string }>();
  const { user } = useAuth();
  const { progressMap, markAssessmentSubmitted, loading } = useModuleProgress();

  const blockKey = `block-${blockNum}`;
  const meta = blockNum ? BLOCK_ASSESSMENT_MAP[blockNum] : undefined;

  /* OTP gate */
  const [otpValidated, setOtpValidated] = useState<boolean>(
    () => OTP_SUSPENDED || sessionStorage.getItem(`block_otp_${blockNum}`) === "true"
  );
  const [otpInput, setOtpInput]     = useState("");
  const [otpValidating, setOtpValidating] = useState(false);
  const [otpError, setOtpError]     = useState("");

  /* Submission state */
  const [pendingSubmission, setPendingSubmission] = useState<AssessmentPayload | null>(null);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [submitError, setSubmitError]       = useState<string | undefined>();
  const [submittedAt, setSubmittedAt]       = useState<string>("");
  const [submittedText, setSubmittedText]   = useState("");
  const [submissionPath, setSubmissionPath] = useState("");

  /* Hydrate submitted state from progressMap */
  useEffect(() => {
    const prog = progressMap[blockKey];
    if (!prog) return;

    const submittedTimestamp =
      prog.assessment_submitted_at ?? prog.submission_uploaded_at ?? "";
    if (submittedTimestamp) {
      setSubmittedAt(submittedTimestamp);
    }
    if (prog.submission_path) {
      setSubmissionPath(prog.submission_path);
    }
  }, [blockKey, progressMap]);

  /* Hydrate submitted text from storage on revisit */
  useEffect(() => {
    if (!submissionPath || submittedText) return;

    const lowerPath = submissionPath.toLowerCase();
    if (!(lowerPath.endsWith(".txt") || lowerPath.endsWith(".md"))) {
      setSubmittedText(`Assessment submitted via uploaded file: ${submissionPath.split("/").pop() ?? submissionPath}`);
      return;
    }

    supabase.storage
      .from("assessment-submissions")
      .download(submissionPath)
      .then(({ data }) => { if (data) data.text().then(setSubmittedText); });
  }, [submissionPath, submittedText]);

  /* ── Print window ── */
  const openPrintWindow = (text: string) => {
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${meta?.label ?? "Block Assessment"}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:11.5px;color:#111;padding:40px 48px}
.hdr{background:#111;color:#fff;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:16px}
.hdr-brand img{height:76px;width:auto;object-fit:contain;filter:brightness(0) invert(1)}
.hdr-text{flex:1;text-align:center}.hdr-text h1{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
.hdr-text p{font-size:10px;margin-top:3px;opacity:.8}pre{white-space:pre-wrap;word-break:break-word;line-height:1.75;font-family:Arial,sans-serif;font-size:11.5px}
.actions{display:flex;gap:10px;margin-bottom:20px}button{padding:7px 20px;background:#111;color:#fff;border:none;cursor:pointer;font-size:11px;border-radius:4px}
@media print{.actions{display:none!important}body{padding:20px}}</style></head><body>
<div class="hdr"><div class="hdr-brand"><img src="/logos/dsa-logo.png" alt="DSA"/></div>
<div class="hdr-text"><h1>Further Education and Training Certificate: IT Systems Development</h1><p>SAQA ID: 78965 &nbsp;·&nbsp; NQF Level 4 &nbsp;·&nbsp; 165 Credits</p></div></div>
<div class="actions"><button onclick="window.print()">🖨&nbsp; Print / Save as PDF</button><button onclick="window.close()">✕&nbsp; Close</button></div>
<pre>${escaped}</pre></body></html>`;
    const win = window.open("", "_blank", "width=900,height=700,scrollbars=yes");
    if (win) { win.document.write(html); win.document.close(); }
  };

  /* ── Guard: block not found ── */
  if (!meta || !blockNum) {
    return (
      <AppLayout title="Not Found">
        <p className="text-muted-foreground">Block not found.</p>
        <Link to="/learner" className="text-primary hover:underline mt-2 inline-block">← Back to Learner Portal</Link>
      </AppLayout>
    );
  }

  const blockProgress = progressMap[blockKey];
  const alreadySubmitted = Boolean(
    blockProgress?.assessment_submitted ||
    blockProgress?.assessment_submitted_at ||
    blockProgress?.submission_uploaded_at ||
    blockProgress?.submission_path
  );
  const isCheckingSubmission = loading && !blockProgress;

  return (
    <AppLayout
      title={`Block ${blockNum} Assessment`}
      subtitle={meta.label}
    >
      {/* Back link */}
      <Link
        to="/learner"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Learner Portal
      </Link>

      {/* Block info banner */}
      <div className="rounded-xl border border-border bg-card p-4 mb-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-1.5">
              <ShieldCheck size={13} /> Summative Assessment
            </p>
            <p className="text-sm font-semibold text-foreground">{meta.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Scheduled: {meta.date}</p>
          </div>
          {alreadySubmitted && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
              <CheckCircle2 size={12} /> Submitted
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {meta.units.map((u) => (
            <p key={u} className="text-[11px] text-muted-foreground">• {u}</p>
          ))}
        </div>
        {(meta.paperSourceHref || meta.memorandumHref) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {meta.paperSourceHref && (
              <a
                href={meta.paperSourceHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50"
              >
                <ExternalLink size={12} /> Open reference paper
              </a>
            )}
            {meta.memorandumHref && (
              <a
                href={meta.memorandumHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50"
              >
                <ExternalLink size={12} /> Open memorandum
              </a>
            )}
          </div>
        )}
      </div>

      {OTP_SUSPENDED && !alreadySubmitted && (
        <div className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 mb-5">
          OTP access is temporarily suspended for testing, so this block assessment is open directly until further notice.
        </div>
      )}

      {/* ── Submission / access state ── */}
      {isCheckingSubmission ? (
        <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
          Checking your latest submission status…
        </div>
      ) : alreadySubmitted ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-500/40 bg-green-50/40 dark:bg-green-900/10 p-5 flex items-start gap-4">
            <CheckCircle2 size={28} className="shrink-0 text-green-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Assessment Submitted</p>
              <p className="text-xs text-muted-foreground">Your responses have been saved and submitted to your facilitator.</p>
              {submittedAt && (
                <p className="text-xs text-muted-foreground">
                  Submitted: <span className="font-medium text-foreground">{new Date(submittedAt).toLocaleString()}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => openPrintWindow(submittedText)}
            disabled={!submittedText}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground px-4 py-2.5 hover:bg-secondary/50 disabled:opacity-40 transition-colors"
          >
            <span>🖨</span> Print / Save as PDF
          </button>
        </div>

      /* ── OTP gate ── */
      ) : !otpValidated ? (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-sm mx-auto">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound size={22} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">Assessment Access Required</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your facilitator will provide a 6-digit OTP at the start of the assessment session.
              Enter it below to unlock <strong>Block {blockNum}</strong>.
            </p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otpInput}
              onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.5em] text-foreground placeholder:text-muted-foreground/40 placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
            {otpError && <p className="text-xs text-red-500 text-center">{otpError}</p>}
            <button
              disabled={otpInput.length !== 6 || otpValidating}
              onClick={async () => {
                setOtpValidating(true);
                const { data } = await rpc.rpc("cet_validate_assessment_otp", {
                  p_module_id: blockKey,
                  p_otp: otpInput,
                });
                setOtpValidating(false);
                if (data === true) {
                  sessionStorage.setItem(`block_otp_${blockNum}`, "true");
                  setOtpValidated(true);
                } else {
                  setOtpError("Invalid or expired OTP. Please check with your facilitator.");
                }
              }}
              className="w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {otpValidating ? "Verifying…" : "Unlock Assessment"}
            </button>
          </div>
        </div>

      /* ── Assessment form ── */
      ) : (
        <>
          <BlockMarkdownAssessment
            title={`${meta.shortLabel} Interactive Test Paper`}
            blockNum={blockNum}
            markdown={meta.paperMarkdown}
            sections={BLOCK_INTERACTIVE_SECTIONS_MAP[blockNum] ?? []}
            onRequestSubmit={(payload: AssessmentPayload) => {
              setPendingSubmission(payload);
              setShowConfirm(true);
            }}
            isSubmitting={isSubmitting}
            submitError={submitError}
            disabled={meta.status !== "ready"}
          />

          {meta.status !== "ready" && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
              This block test is a placeholder for now. Block 1 is the active in-app assessment.
            </div>
          )}

          {/* Confirm dialog */}
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                <AlertDialogDescription>
                  Your Block {blockNum} assessment will be linked to your learner profile and submitted to your facilitator.
                  You can complete it directly on the platform or submit a PDF / Word file.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Go Back</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (!user?.id || !pendingSubmission) return;
                    if (alreadySubmitted || meta.status !== "ready") {
                      setShowConfirm(false);
                      return;
                    }

                    setIsSubmitting(true);
                    setSubmitError(undefined);

                    try {
                      const result = await fileUploadService.submitAssessment(
                        pendingSubmission.uploadFile ?? pendingSubmission.submissionText,
                        blockKey,
                        user.id,
                        {
                          fileName: pendingSubmission.fileName,
                          submissionText: pendingSubmission.submissionText,
                          metadata: pendingSubmission.metadata,
                        }
                      );

                      if (!result.success) {
                        throw new Error(result.error?.message || "Upload failed");
                      }

                      const now = new Date().toISOString();
                      setSubmissionPath(result.filePath || "");
                      setSubmittedAt(now);
                      setSubmittedText(
                        pendingSubmission.uploadMode === "upload"
                          ? `Uploaded file: ${pendingSubmission.fileName || "assessment file"}`
                          : pendingSubmission.submissionText
                      );
                      await markAssessmentSubmitted(blockKey, now, result.filePath || null);
                      setShowConfirm(false);
                      setPendingSubmission(null);
                    } catch (error: any) {
                      console.error("[Block Assessment Upload] Error:", error);
                      setSubmitError(`Submission failed: ${error.message}`);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  Confirm &amp; Submit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </AppLayout>
  );
}
