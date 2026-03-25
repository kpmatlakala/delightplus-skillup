import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center [filter:blur(1px)] scale-110"
        style={{ backgroundImage: "url('/auth/landing-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card/95 backdrop-blur-sm p-6 shadow-lg">
        <h1 className="font-display text-2xl font-bold text-foreground">DSA Student Portal</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue your learning journey.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="pt-1">
              <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          New learner?{" "}
          <Link to="/auth/signup" className="text-primary hover:underline">
            Create account
          </Link>
        </p>

        <div className="mt-4 flex justify-center">
          <img src="/logos/dsa-logo.png" alt="The Data Science Academy" className="h-10 w-auto object-contain" />
        </div>
      </div>
    </div>
  );
}
