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
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  website: string | null;
  role: string | null;
  reputation: number | null;
  phone: string | null;
}

const getInitials = (displayName: string, email: string) => {
  const source = displayName || email;
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

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const rpc = supabase as unknown as {
    rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: any; error: { message: string } | null }>;
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      const { data, error: loadError } = await rpc.rpc("dsa_get_my_profile_v2");

      if (loadError) {
        setError(loadError.message);
        setLoading(false);
        return;
      }

      const profile = ((data as UserProfile[] | null) ?? [])[0] ?? null;

      if (profile) {
        setUsername(profile.username ?? "");
        setDisplayName(profile.display_name ?? "");
        setBio(profile.bio ?? "");
        setAvatarUrl(profile.avatar_url ?? "");
        setLocation(profile.location ?? "");
        setWebsite(profile.website ?? "");
        setPhoneNumber(profile.phone ?? "");
      } else {
        const fallbackUsername = (user?.email?.split("@")[0] ?? "user").toLowerCase();
        setUsername(fallbackUsername);
      }

      setLoading(false);
    };

    loadProfile();
  }, [user?.email]);

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: updateError } = await rpc.rpc("dsa_update_my_profile_v2", {
      p_username: username,
      p_display_name: displayName,
      p_bio: bio,
      p_avatar_url: avatarUrl,
      p_location: location,
      p_website: website,
      p_phone: phoneNumber,
    });

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Profile updated successfully.");
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
  };

  const resolvedDisplayName = displayName || (user?.user_metadata?.full_name as string | undefined) || "My Profile";
  const resolvedEmail = user?.email ?? "";
  const initials = getInitials(resolvedDisplayName, resolvedEmail);
  const navigate = useNavigate();

  return (
    <AppLayout title="My Profile" subtitle="Manage your account profile and security">
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
              <AvatarImage src={avatarUrl} alt={resolvedDisplayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{resolvedDisplayName}</p>
              <p className="text-sm text-muted-foreground">{resolvedEmail}</p>
            </div>
          </div>

          <form onSubmit={onSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email ?? ""} disabled />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} autoComplete="tel" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
            </div>

            {loading && <p className="text-sm text-muted-foreground">Loading profile...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-success">{success}</p>}

            <Button type="submit" disabled={loading || saving}>
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
            {securitySuccess && <p className="text-sm text-success">{securitySuccess}</p>}

            <Button type="submit" disabled={changingPassword}>
              {changingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
