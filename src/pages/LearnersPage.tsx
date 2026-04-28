import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface EnrolledLearner {
  id: string;
  user_id: string | null;
  learner_code: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  id_number: string | null;
  school: string | null;
  department: string | null;
  status: string;
  progress: number;
}

interface LearnerFormState {
  full_name: string;
  email: string;
  phone: string;
  id_number: string;
  school: string;
  department: string;
  status: "Active" | "Inactive" | "Graduated";
}

const EMPTY_FORM: LearnerFormState = {
  full_name: "",
  email: "",
  phone: "",
  id_number: "",
  school: "",
  department: "",
  status: "Active",
};

const DEFAULT_LOGIN_PASSWORD = "CET@12345";
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://ebzsvbbmahvqlshydkxg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVienN2YmJtYWh2cWxzaHlka3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTc5NzUsImV4cCI6MjA3MDU5Mzk3NX0.EFQwVou0CxxnJ_lLYJo71V-lVn_mzB4YKO23nEVbJxM";

const isValidEmail = (value: string) => {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const normalizeName = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ");

const normalizeIdNumber = (value: string) => value.replace(/\s+/g, "").trim();

export default function LearnersPage() {
  const [learners, setLearners] = useState<EnrolledLearner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [creatingLogin, setCreatingLogin] = useState(false);
  const [defaultPassword, setDefaultPassword] = useState(DEFAULT_LOGIN_PASSWORD);
  const [useIdAsPassword, setUseIdAsPassword] = useState(true);
  const [editLearnerId, setEditLearnerId] = useState<string | null>(null);
  const [editLearnerHasAccount, setEditLearnerHasAccount] = useState(false);
  const [resetPasswordOnSave, setResetPasswordOnSave] = useState(false);
  const [form, setForm] = useState<LearnerFormState>(EMPTY_FORM);
  const showPasswordDefaults = !editLearnerId || !editLearnerHasAccount || resetPasswordOnSave;

  const loadLearners = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: directError } = await (supabase as unknown as any)
        .from("learners")
        .select("id, user_id, learner_code, full_name, email, phone, id_number, school, department, status, progress")
        .order("full_name", { ascending: true });

      if (!directError && Array.isArray(data)) {
        setLearners(
          data.map((learner: any) => ({
            id: learner.id,
            user_id: learner.user_id ?? null,
            learner_code: learner.learner_code,
            full_name: learner.full_name || "Learner",
            email: learner.email ?? null,
            phone: learner.phone ?? null,
            id_number: learner.id_number ?? null,
            school: learner.school ?? null,
            department: learner.department ?? null,
            status: learner.status || "Active",
            progress: Number(learner.progress ?? 0),
          }))
        );
        setLoading(false);
        return;
      }
    } catch (directReadError) {
      console.warn("Direct learner management read failed, falling back to RPC:", directReadError);
    }

    const rpc = supabase as unknown as {
      rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: EnrolledLearner[] | null; error: { message: string } | null }>;
    };

    const { data, error: fetchError } = await rpc.rpc("cet_enrolled_learners");

    if (fetchError) {
      setError(fetchError.message);
      setLearners([]);
      setLoading(false);
      return;
    }

    const enrolledLearners = (data ?? []).sort((a, b) => a.full_name.localeCompare(b.full_name));
    setLearners(enrolledLearners);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLearners();
  }, [loadLearners]);

  const startCreate = () => {
    setEditLearnerId(null);
    setEditLearnerHasAccount(false);
    setResetPasswordOnSave(false);
    setForm(EMPTY_FORM);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const startEdit = (learner: EnrolledLearner) => {
    setEditLearnerId(learner.id);
    setEditLearnerHasAccount(!!learner.user_id);
    setResetPasswordOnSave(false);
    setForm({
      full_name: learner.full_name ?? "",
      email: learner.email ?? "",
      phone: learner.phone ?? "",
      id_number: learner.id_number ?? "",
      school: learner.school ?? "",
      department: learner.department ?? "",
      status: (learner.status as LearnerFormState["status"]) || "Active",
    });
    setSaveError(null);
    setSaveSuccess(null);
  };

  const saveLearner = async () => {
    const cleanName = normalizeName(form.full_name);
    const cleanEmail = form.email.trim();
    const cleanPhone = form.phone.trim();
    const cleanId = normalizeIdNumber(form.id_number);
    const cleanSchool = form.school.trim();
    const cleanDepartment = form.department.trim();

    if (!cleanName) {
      setSaveError("Full name is required.");
      return;
    }
    if (cleanName.includes("@")) {
      setSaveError("Full name cannot contain an email address. Please enter a proper name.");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setSaveError("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      if (editLearnerId) {
        const updatePayload: Record<string, unknown> = {
            full_name: cleanName,
            phone: cleanPhone || null,
            id_number: cleanId || null,
            school: cleanSchool || null,
            department: cleanDepartment || null,
            status: form.status,
          };
          // Never overwrite email for learners who already have a login account
          if (!editLearnerHasAccount) {
            updatePayload.email = cleanEmail || null;
          }
          const { error: updateError } = await (supabase as unknown as any)
          .from("learners")
          .update(updatePayload)
          .eq("id", editLearnerId);

        if (updateError) {
          throw updateError;
        }

        if (editLearnerHasAccount && resetPasswordOnSave) {
          if (!cleanEmail) {
            throw new Error("Email is required to send a password reset link.");
          }
          const redirectTo = `${window.location.origin}/auth/reset-password`;
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo });
          if (resetError) {
            throw resetError;
          }
        }

        setSaveSuccess(
          editLearnerHasAccount && resetPasswordOnSave
            ? "Learner updated and password reset email sent."
            : "Learner updated successfully."
        );
      } else {
        const { error: insertError } = await (supabase as unknown as any)
          .from("learners")
          .insert({
            full_name: cleanName,
            email: cleanEmail || null,
            phone: cleanPhone || null,
            id_number: cleanId || null,
            school: cleanSchool || null,
            department: cleanDepartment || null,
            status: form.status,
            progress: 0,
          });

        if (insertError) {
          throw insertError;
        }

        setSaveSuccess("Learner added successfully.");
        setForm(EMPTY_FORM);
      }

      await loadLearners();
    } catch (saveErr: any) {
      console.error("Learner save failed:", saveErr);
      setSaveError(saveErr?.message || "Unable to save learner.");
    } finally {
      setSaving(false);
    }
  };

  const createLoginAccount = async () => {
    const cleanName = normalizeName(form.full_name);
    const cleanEmail = form.email.trim();
    const cleanPhone = form.phone.trim();
    const cleanId = normalizeIdNumber(form.id_number);
    const cleanSchool = form.school.trim();
    const cleanDepartment = form.department.trim();

    if (!cleanName) {
      setSaveError("Full name is required before creating a login account.");
      return;
    }
    if (cleanName.includes("@")) {
      setSaveError("Full name cannot contain an email address. Please correct the learner name.");
      return;
    }
    if (!cleanEmail) {
      setSaveError("Email is required to create a login account.");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setSaveError("Please enter a valid email address.");
      return;
    }
    const effectivePassword = useIdAsPassword ? cleanId : defaultPassword.trim();

    if (useIdAsPassword && !cleanId) {
      setSaveError("ID Number is required when using ID number as default password.");
      return;
    }

    if (!effectivePassword || effectivePassword.length < 6) {
      setSaveError("Default password must be at least 6 characters.");
      return;
    }

    setCreatingLogin(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const signupClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data: signUpData, error: signUpError } = await signupClient.auth.signUp({
        email: cleanEmail,
        password: effectivePassword,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone || null,
            id_number: cleanId || null,
            school: cleanSchool || null,
            department: cleanDepartment || null,
            role: "user",
          },
        },
      });

      if (signUpError) {
        const msg = signUpError.message || "Unable to create login account.";
        if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exists")) {
          setSaveError("This email already has a login account. You can still edit learner details below.");
        } else {
          setSaveError(msg);
        }
        return;
      }

      if (signUpData.user?.id) {
        const { error: profileSyncError } = await (supabase as unknown as any)
          .from("learners")
          .upsert(
            {
              user_id: signUpData.user.id,
              full_name: cleanName,
              email: cleanEmail,
              phone: cleanPhone || null,
              id_number: cleanId || null,
              school: cleanSchool || null,
              department: cleanDepartment || null,
              status: form.status,
              progress: 0,
            },
            { onConflict: "user_id" }
          );

        if (profileSyncError) {
          console.warn("Profile sync warning after account creation:", profileSyncError);
        }
      }

      if (editLearnerId) {
        await (supabase as unknown as any)
          .from("learners")
          .update({
            full_name: cleanName,
            email: cleanEmail,
            phone: cleanPhone || null,
            id_number: cleanId || null,
            school: cleanSchool || null,
            department: cleanDepartment || null,
            status: form.status,
          })
          .eq("id", editLearnerId);
      }

      await loadLearners();
      setSaveSuccess(
        `Login account created for ${cleanName}. Default password: ${effectivePassword}. Ask learner to change password at first login via Profile or Forgot Password.`
      );
    } catch (err: any) {
      console.error("Create login account failed:", err);
      setSaveError(err?.message || "Unable to create login account.");
    } finally {
      setCreatingLogin(false);
    }
  };

  const filteredLearners = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return learners;

    return learners.filter((learner) =>
      [
        learner.full_name,
        learner.learner_code,
        learner.email ?? "",
        learner.phone ?? "",
        learner.id_number ?? "",
        learner.school ?? "",
        learner.department ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [learners, searchTerm]);

  const subtitle = useMemo(() => {
    if (loading) return "Loading learner management...";
    return `${learners.length} Learners Registered`;
  }, [learners.length, loading]);

  return (
    <AppLayout title="Learners" subtitle={subtitle}>
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm px-4 py-3 mb-4">
          Unable to load enrolled learners: {error}
        </div>
      )}

      {!loading && !error && learners.length === 0 && (
        <div className="rounded-lg border border-border bg-card text-muted-foreground text-sm px-4 py-3 mb-4">
          No active enrollments found yet.
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4 mb-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Learner Management</p>
            <p className="text-xs text-muted-foreground">Search, add, and correct learner details before testing.</p>
          </div>
          <div className="w-full md:w-80">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, code, email, phone, ID, school..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">Total: {learners.length}</Badge>
          <Badge variant="outline">Showing: {filteredLearners.length}</Badge>
          <Badge variant="outline">Active: {learners.filter((learner) => (learner.status || "").toLowerCase() === "active").length}</Badge>
        </div>

        <div className="rounded-lg border border-border bg-background p-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-foreground">
              {editLearnerId ? "Edit Learner" : "Add Learner"}
            </p>
            {editLearnerId ? (
              <Button type="button" variant="ghost" size="sm" onClick={startCreate}>
                Cancel edit
              </Button>
            ) : null}
          </div>

          {saveError ? (
            <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {saveError}
            </div>
          ) : null}

          {saveSuccess ? (
            <div className="rounded border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-700 dark:text-green-400">
              {saveSuccess}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <Input
              value={form.full_name}
              onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
              placeholder="Full name"
            />
            <div className="flex flex-col gap-1">
              <Input
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email — optional now, needed for login"
                disabled={editLearnerHasAccount}
                title={editLearnerHasAccount ? "Email is locked — learner already has a login account" : undefined}
              />
              {editLearnerHasAccount && (
                <p className="text-xs text-muted-foreground">Email locked — learner has a login account</p>
              )}
            </div>
            <Input
              value={form.id_number}
              onChange={(e) => setForm((prev) => ({ ...prev, id_number: e.target.value }))}
              placeholder="ID Number"
            />
            <Input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Input
              value={form.school}
              onChange={(e) => setForm((prev) => ({ ...prev, school: e.target.value }))}
              placeholder="School"
            />
            <Input
              value={form.department}
              onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
              placeholder="Department"
            />
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as LearnerFormState["status"] }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>

          {editLearnerId && editLearnerHasAccount ? (
            <label className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={resetPasswordOnSave}
                onChange={(e) => setResetPasswordOnSave(e.target.checked)}
              />
              Reset password on save (send reset link to learner email)
            </label>
          ) : null}

          {showPasswordDefaults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={useIdAsPassword}
                  onChange={(e) => setUseIdAsPassword(e.target.checked)}
                />
                Use ID Number as default password
              </label>
              <Input
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                placeholder="Manual default password (used when checkbox is off)"
                type="text"
                disabled={useIdAsPassword}
              />
            </div>
          ) : null}

          {showPasswordDefaults ? (
            <p className="text-xs text-muted-foreground">
              Default login password will be {useIdAsPassword ? "the learner's ID Number" : "the manual password above"}. Learners should change it on first login.
            </p>
          ) : null}

          <div className="flex gap-2">
            <Button type="button" onClick={saveLearner} disabled={saving}>
              {saving ? "Saving..." : editLearnerId ? "Save Changes" : "Add Learner"}
            </Button>
            <Button type="button" variant="secondary" onClick={createLoginAccount} disabled={creatingLogin}>
              {creatingLogin ? "Creating Login..." : "Create Login Account"}
            </Button>
            <Button type="button" variant="outline" onClick={startCreate} disabled={saving}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Learner Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Progress</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Loading enrolled learners...
                </TableCell>
              </TableRow>
            )}

            {filteredLearners.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.learner_code}</TableCell>
                <TableCell className="font-medium">{l.full_name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{l.email || "—"}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{l.phone || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    {l.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={l.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-8">{l.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button type="button" variant="outline" size="sm" onClick={() => startEdit(l)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {!loading && filteredLearners.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No learners match your search yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
