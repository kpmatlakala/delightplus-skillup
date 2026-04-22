import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  id_number: string | null;
  department: string | null;
  school: string | null;
  learner_code: string | null;
  status: string | null;
  progress: number | null;
  created_at: string;
  updated_at: string;
}

const isValidPhoneNumber = (value: string | null | undefined): boolean => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed === '') return false;
  if (trimmed.includes('@')) return false;
  const digitsOnly = trimmed.replace(/[\s\-\(\)]/g, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
};

const getInitials = (fullName: string | null, email: string) => {
  const source = fullName || email;
  if (!source) return "U";
  const parts = source.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);

  // Profile state - all from cet.learners
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [school, setSchool] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [learnerCode, setLearnerCode] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState<number | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch directly from cet.learners
      const { data, error } = await supabase
        .from('learners')
        .select('full_name, phone, id_number, department, school, learner_code, status, progress')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error("Profile load error:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log("profile loaded:", data);

      if (data) {
        setFullName(data.full_name ?? "");
        setIdNumber(data.id_number ?? "");
        setDepartment(data.department ?? "");
        setSchool(data.school ?? "");
        setLearnerCode(data.learner_code ?? "");
        setStatus(data.status ?? "");
        setProgress(data.progress ?? 0);
        
        // Only set phone if valid
        if (data.phone && isValidPhoneNumber(data.phone)) {
          setPhoneNumber(data.phone);
        } else {
          setPhoneNumber("");
        }
      }
    } catch (err) {
      console.error("Unexpected error loading profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validate phone number
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number (e.g., 0721234567 or +27721234567)");
      setSaving(false);
      return;
    }

    try {
      // Update cet.learners directly
      const { error: updateError } = await supabase
        .from('learners')
        .update({
          full_name: fullName || null,
          phone: phoneNumber || null,
          id_number: idNumber || null,
          department: department || null,
          school: school || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        setError(updateError.message);
        setSaving(false);
        return;
      }

      console.log("Update successful, reloading profile...");
      await loadProfile();
      
      setSuccess("Profile updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Unexpected error saving profile:", err);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    if (!user?.email) {
      setSecurityError("Unable to resolve your account email.");
      return;
    }

    if (!currentPassword) {
      setSecurityError("Enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setSecurityError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setSecurityError("New password must be different from current password.");
      return;
    }

    setChangingPassword(true);

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (reauthError) {
      setChangingPassword(false);
      setSecurityError("Current password is incorrect.");
      return;
    }

    const { error: updatePasswordError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setChangingPassword(false);

    if (updatePasswordError) {
      setSecurityError(updatePasswordError.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSecuritySuccess("Password changed successfully.");
    setTimeout(() => setSecuritySuccess(null), 3000);
  };

  const resolvedFullName = fullName || "My Profile";
  const resolvedEmail = user?.email ?? "";
  const initials = getInitials(resolvedFullName, resolvedEmail);
  const navigate = useNavigate();

  if (loading) {
    return (
      <AppLayout title="My Profile" subtitle="Loading...">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="My Profile" subtitle="Manage your learner profile">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        ← Back
      </button>
      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{resolvedFullName}</p>
              <p className="text-sm text-muted-foreground">{resolvedEmail}</p>
              {learnerCode && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Learner Code: {learnerCode}
                </p>
              )}
              {status && (
                <p className="text-xs text-muted-foreground">
                  Status: {status} {progress !== null && `• ${progress}% Complete`}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={onSave} className="space-y-4">
            {/* Email - Read Only */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>

            {/* Editable Learner Fields */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full legal name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="South African ID number"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                  placeholder="072 123 4567"
                />
                <p className="text-xs text-muted-foreground">
                  Format: 0721234567 or +27721234567
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Your school/institution"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Your department"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Security</h2>
          <p className="text-sm text-muted-foreground mt-1">Change your account password.</p>

          <form onSubmit={onChangePassword} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            {securityError && <p className="text-sm text-destructive">{securityError}</p>}
            {securitySuccess && <p className="text-sm text-green-600">{securitySuccess}</p>}

            <Button type="submit" disabled={changingPassword}>
              {changingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}