import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitted(false);
    setLoading(true);

    const redirectTo = `${window.location.origin}/auth/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center [filter:blur(1px)] scale-110"
        style={{ backgroundImage: "url('/auth/landing-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card/95 backdrop-blur-sm p-6 shadow-lg">
        <h1 className="font-display text-2xl font-bold text-foreground">Forgot Password</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your email and we’ll send you a reset link.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {submitted && (
            <p className="text-sm text-muted-foreground">
              If an account exists for this email, a password reset link has been sent.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Back to{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
