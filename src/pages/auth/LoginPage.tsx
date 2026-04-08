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

    navigate("/lmis", { replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center [filter:blur(1px)] scale-110"
        style={{ backgroundImage: "url('/auth/landing-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card/95 backdrop-blur-sm p-6 shadow-lg">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex justify-center mb-5">
          <img src="/logos/dsa-logo.png" alt="DSA" className="h-20 w-auto object-contain" />
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-sm text-muted-foreground mt-1">Learner Management Information System</p>

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

        <footer className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Learner Management Information System
        </footer>
      </div>
    </div>
  );
}
