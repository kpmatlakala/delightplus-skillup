import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Download, CheckCircle2, Circle, AlertCircle, BookOpen, ClipboardList, FileUp } from "lucide-react";
import { modules } from "@/data/courseData";

/* ── Types ── */
interface ModuleProgress {
  module_unit_standard_id: string;
  guide_completed: boolean;
  quiz_completed: boolean;
  assessment_submitted: boolean;
}

interface EnrolledLearner {
  id: string;
  learner_code: string;
  full_name: string;
  email: string | null;
  progress: number;
}

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

/* ── Helpers ── */
const TOTAL_MODULES = modules.length; // 10

function poeScore(rows: ModuleProgress[]): { guide: number; quiz: number; assessment: number; percent: number } {
  const guide = rows.filter((r) => r.guide_completed).length;
  const quiz = rows.filter((r) => r.quiz_completed).length;
  const assessment = rows.filter((r) => r.assessment_submitted).length;
  const percent = Math.round((assessment / TOTAL_MODULES) * 100);
  return { guide, quiz, assessment, percent };
}

function StatusDot({ done }: { done: boolean }) {
  return done ? (
    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
  ) : (
    <Circle size={15} className="text-white/25 shrink-0" />
  );
}

/* ══════════════════════════════════════════════════════════
   ADMIN / MODERATOR VIEW
═══════════════════════════════════════════════════════════ */
function AdminPoEView() {
  const [learners, setLearners] = useState<EnrolledLearner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error: directError } = await (supabase as unknown as any)
          .from("learners")
          .select("id, learner_code, full_name, email, progress")
          .order("full_name", { ascending: true });

        if (!directError && Array.isArray(data)) {
          setLearners(
            data.map((learner: any) => ({
              id: learner.id,
              learner_code: learner.learner_code,
              full_name: learner.full_name || "Learner",
              email: learner.email ?? null,
              progress: Number(learner.progress ?? 0),
            }))
          );
          setLoading(false);
          return;
        }
      } catch (directReadError) {
        console.warn("Direct PoE learner lookup failed, falling back to RPC:", directReadError);
      }

      const rpc = supabase as unknown as RpcClient;
      const { data, error: e } = await rpc.rpc("cet_enrolled_learners");
      if (e) { setError(e.message); setLoading(false); return; }
      setLearners(((data as EnrolledLearner[]) ?? []).sort((a, b) => a.full_name.localeCompare(b.full_name)));
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">

      {/* ── Admin overview */}
      <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/15 via-cyan-500/10 to-transparent p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-white">PoE Control Center</h2>
            <p className="text-sm text-white/65 mt-1">
              Monitor learner readiness, template usage, and pipeline automation from one place.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full border border-white/15 bg-white/10 text-white/80">
              {loading ? "Loading learners..." : `${learners.length} learners`}
            </span>
            <span className="px-2.5 py-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 text-emerald-300">
              Progress tracking active
            </span>
          </div>
        </div>
      </div>

      {/* ── Info card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <ClipboardList size={17} className="text-blue-400" />
          How the PoE System Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-1">
            <div className="font-semibold text-white/90 flex items-center gap-2"><BookOpen size={14} className="text-blue-400" /> 1. Learner completes modules</div>
            <p>Each module tracks three milestones: study guide read, in-portal quiz passed, and assessment submitted. These are stored automatically in the database as learners progress.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-1">
            <div className="font-semibold text-white/90 flex items-center gap-2"><FileUp size={14} className="text-amber-400" /> 2. Physical evidence compiled</div>
            <p>Learners use the PoE template (below) to compile their physical workbook activities, group tasks, and signed attendance register into a single folder for assessment.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-1">
            <div className="font-semibold text-white/90 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 3. Assessment &amp; moderation</div>
            <p>The assessor completes the decision boxes in the template. The moderator reviews a sample. Final PoEs are submitted to MICT SETA for certification under SAQA 78965.</p>
          </div>
        </div>
      </div>

      {/* ── Automation pipeline */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
          <AlertCircle size={15} /> LMS → PoE Automation Pipeline
        </h3>
        <div className="text-sm text-white/65 space-y-1">
          <p>✅ <strong className="text-white/85">Already automated:</strong> Guide completion, quiz results, and assessment submission flags are tracked per learner per module via <code className="text-amber-300 text-xs">cet_upsert_module_progress</code>.</p>
          <p>✅ <strong className="text-white/85">Already automated:</strong> Attendance check-in/check-out is recorded via <code className="text-amber-300 text-xs">cet_check_in</code> / <code className="text-amber-300 text-xs">cet_check_out</code> per session.</p>
          <p>🔧 <strong className="text-white/85">Next step — file upload:</strong> Wire the "Submit Assessment" button in each module to Supabase Storage so learners upload their evidence PDF directly. This sets <code className="text-amber-300 text-xs">assessment_submitted = true</code> automatically.</p>
          <p>🔧 <strong className="text-white/85">Next step — admin progress view:</strong> Add a <code className="text-amber-300 text-xs">cet_get_learner_progress</code> RPC so admins can see each learner's milestone status in the table below rather than the portal progress bar only.</p>
          <p>🔧 <strong className="text-white/85">Future — auto-fill export:</strong> Generate a pre-filled PoE PDF server-side (Edge Function) using learner profile + DB progress data, so the cover page and checklist ticks populate automatically.</p>
        </div>
      </div>

      {/* ── Template download */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-base font-semibold text-white">Blank PoE Template</div>
          <div className="text-sm text-white/55 mt-0.5">
            All 11 unit standards pre-populated · Evidence checklists · Assessment decision blocks · Moderator section
          </div>
        </div>
        <a
          href="/poe-template.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shrink-0"
        >
          <Download size={15} /> Open / Print Template
        </a>
      </div>

      {/* ── Learner list */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="text-sm font-semibold text-white/90">Enrolled Learners</div>
          <div className="text-xs text-white/40">{loading ? "Loading…" : `${learners.length} learners`}</div>
        </div>

        {error && (
          <div className="px-5 py-3 text-sm text-red-400">{error}</div>
        )}

        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/50 text-xs">Learner</TableHead>
                <TableHead className="text-white/50 text-xs">Code</TableHead>
                <TableHead className="text-white/50 text-xs">Email</TableHead>
                <TableHead className="text-white/50 text-xs text-center">Portal Progress</TableHead>
                <TableHead className="text-white/50 text-xs text-right">PoE Template</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learners.map((l) => (
                <TableRow key={l.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white/90 font-medium text-sm">{l.full_name}</TableCell>
                  <TableCell className="text-white/55 text-sm font-mono">{l.learner_code}</TableCell>
                  <TableCell className="text-white/55 text-sm">{l.email ?? "—"}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Progress value={l.progress} className="w-24 h-1.5" />
                      <span className="text-xs text-white/50">{l.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href="/poe-template.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/8 hover:bg-white/15 text-white/80 text-xs font-medium transition-colors border border-white/10"
                    >
                      <Download size={12} /> Template
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LEARNER VIEW
═══════════════════════════════════════════════════════════ */
function LearnerPoEView() {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const rpc = supabase as unknown as RpcClient;
      const { data, error: e } = await rpc.rpc("cet_get_all_module_progress");
      if (e) { setError(e.message); setLoading(false); return; }
      setProgress((data as ModuleProgress[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const progressMap = Object.fromEntries(progress.map((p) => [p.module_unit_standard_id, p]));
  const score = poeScore(progress);
  const isReady = score.assessment === TOTAL_MODULES;

  return (
    <div className="space-y-6">

      {/* ── Readiness banner */}
      <div className={`rounded-xl border p-5 flex items-center justify-between gap-4 flex-wrap ${isReady ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
        <div>
          <div className={`text-base font-semibold ${isReady ? "text-emerald-300" : "text-white"}`}>
            {isReady ? "Your PoE is ready for submission" : "PoE Readiness Status"}
          </div>
          <div className="text-sm text-white/55 mt-0.5">
            {score.assessment} of {TOTAL_MODULES} assessments submitted &nbsp;·&nbsp;
            {score.quiz} quizzes passed &nbsp;·&nbsp;
            {score.guide} guides completed
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={score.percent} className="w-56 h-1.5" />
            <span className="text-xs text-white/60">{score.percent}% complete</span>
          </div>
        </div>
        <a
          href="/poe-template.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shrink-0"
        >
          <Download size={15} /> Download My PoE Template
        </a>
      </div>

      {/* ── Three-pillar progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Study Guides", count: score.guide, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
          { label: "Quizzes Passed", count: score.quiz, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
          { label: "Assessments Submitted", count: score.assessment, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-4 text-center ${item.bg}`}>
            <div className={`text-3xl font-bold ${item.color}`}>{item.count}<span className="text-lg text-white/30">/{TOTAL_MODULES}</span></div>
            <div className="text-xs text-white/55 mt-1">{item.label}</div>
            <Progress value={(item.count / TOTAL_MODULES) * 100} className="mt-2 h-1" />
          </div>
        ))}
      </div>

      {/* ── Per-module breakdown */}
      {error && <div className="text-sm text-red-400 px-2">{error}</div>}

      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 text-sm font-semibold text-white/90">
          Module Evidence Checklist
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50 text-xs">Module</TableHead>
              <TableHead className="text-white/50 text-xs text-center">Guide</TableHead>
              <TableHead className="text-white/50 text-xs text-center">Quiz</TableHead>
              <TableHead className="text-white/50 text-xs text-center">Assessment</TableHead>
              <TableHead className="text-white/50 text-xs text-center">PoE Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: TOTAL_MODULES }).map((_, i) => (
                  <TableRow key={i} className="border-white/10">
                    <TableCell colSpan={5}>
                      <div className="h-4 bg-white/10 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              : modules.map((mod) => {
                  const p = progressMap[mod.id];
                  const guide = p?.guide_completed ?? false;
                  const quiz = p?.quiz_completed ?? false;
                  const assessment = p?.assessment_submitted ?? false;
                  const allDone = guide && quiz && assessment;
                  return (
                    <TableRow key={mod.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="text-white/90 text-sm font-medium">{mod.title}</div>
                        <div className="text-white/40 text-xs">US {mod.id} &nbsp;·&nbsp; {mod.credits} credits &nbsp;·&nbsp; {mod.days}</div>
                      </TableCell>
                      <TableCell className="text-center"><StatusDot done={guide} /></TableCell>
                      <TableCell className="text-center"><StatusDot done={quiz} /></TableCell>
                      <TableCell className="text-center"><StatusDot done={assessment} /></TableCell>
                      <TableCell className="text-center">
                        {allDone
                          ? <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">Ready</Badge>
                          : <Badge className="bg-white/5 text-white/40 border-white/10 text-xs">Pending</Badge>}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>

      {/* ── What to do next */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2 text-sm text-white/65">
        <div className="text-white font-semibold mb-1">What to do with this template</div>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>Open and print the template, or save it as a PDF from your browser.</li>
          <li>Fill in the cover page (your name, ID number, contact details, dates).</li>
          <li>Sign the Declaration of Authenticity.</li>
          <li>For each module, attach your completed workbook activities and group task evidence.</li>
          <li>Ensure all checklist items are ticked and initialled by your facilitator.</li>
          <li>Complete the Attendance Register Summary (get it signed by your facilitator).</li>
          <li>Hand the compiled folder to your facilitator on Day 10 (PoE Consolidation Day).</li>
        </ol>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════ */
export default function PoEPage() {
  const { role } = useAuth();
  const isAdmin = role === "admin" || role === "moderator";

  return (
    <AppLayout
      title="Portfolio of Evidence"
      subtitle={isAdmin ? "Manage learner PoE templates and track submission pipeline" : "Track your PoE readiness and download your template"}
    >
      {isAdmin ? <AdminPoEView /> : <LearnerPoEView />}
    </AppLayout>
  );
}
