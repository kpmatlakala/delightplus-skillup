import { useState } from "react";
import {
  KeyRound, RefreshCw, Trash2, Copy, CheckCircle2, Circle, Users
} from "lucide-react";
import LmisLayout from "@/_lmis/components/LmisLayout";
import { useAuth } from "@/hooks/useAuth";
import { useAssessmentControl } from "@/hooks/useAssessmentControl";

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
function OtpPanel({ blockKey, role }: { blockKey: string; role: string | null }) {
  const {
    otp, generating, revoking, loadingOtp,
    generateOtp, revokeOtp, refreshOtp,
    learnerStatuses, loadingStatuses, clearingLearnerId,
    clearLearnerProgress, refreshStatuses,
  } = useAssessmentControl(blockKey, role);

  const [copied, setCopied] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmClearId, setConfirmClearId] = useState<string | null>(null);

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

  return (
    <div className="space-y-5">
      {/* ── OTP Control ── */}
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

      {/* ── Learner Status Table ── */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">Learner Submissions</p>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {submittedCount} / {learnerStatuses.length} submitted
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
                          <CheckCircle2 size={11} /> Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Circle size={11} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {l.assessment_submitted_at
                        ? new Date(l.assessment_submitted_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
export default function BlockAssessmentAdminPage() {
  const { role } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = BLOCKS[activeIndex];

  return (
    <LmisLayout title="Block Assessments" subtitle="Manage OTPs and track submissions per block">
      {/* Tab bar */}
      <div className="flex gap-2 mb-5">
        {BLOCKS.map((b, i) => (
          <button
            key={b.key}
            onClick={() => setActiveIndex(i)}
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
      <OtpPanel key={active.key} blockKey={active.key} role={role} />
    </LmisLayout>
  );
}
