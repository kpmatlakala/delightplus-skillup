import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setHasRecoverySession(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setHasRecoverySession(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Password updated successfully. Redirecting to login...");
    setTimeout(() => {
      navigate("/auth/login", { replace: true });
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center [filter:blur(1px)] scale-110"
        style={{ backgroundImage: "url('/auth/landing-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card/95 backdrop-blur-sm p-6 shadow-lg">
        <h1 className="font-display text-2xl font-bold text-foreground">Reset Password</h1>
        <p className="text-sm text-muted-foreground mt-1">Create a new password for your account.</p>

        {!hasRecoverySession && (
          <div className="mt-4 rounded-md border border-border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">
              Open this page from your email reset link. If your link expired, request a new one.
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-muted-foreground">{success}</p>}

          <Button type="submit" className="w-full" disabled={loading || !hasRecoverySession}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Need a new link?{" "}
          <Link to="/auth/forgot-password" className="text-primary hover:underline">
            Request reset email
          </Link>
        </p>
      </div>
    </div>
  );
}
