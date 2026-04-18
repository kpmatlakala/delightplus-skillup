import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

          <div className="relative py-2">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>

          <Button type="button" variant="outline" className="w-full justify-center gap-2" disabled>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
              <path
                d="M21.805 10.023h-9.8v3.955h5.617c-.242 1.273-.967 2.351-2.06 3.076v2.55h3.327c1.947-1.793 3.071-4.433 3.071-7.572 0-.68-.061-1.333-.155-2.01Z"
                fill="#4285F4"
              />
              <path
                d="M12.005 22c2.777 0 5.106-.92 6.884-2.496l-3.327-2.55c-.92.618-2.104.983-3.557.983-2.731 0-5.045-1.84-5.874-4.311H2.695v2.63A10.39 10.39 0 0 0 12.005 22Z"
                fill="#34A853"
              />
              <path
                d="M6.131 13.626A6.24 6.24 0 0 1 5.803 11.9c0-.6.109-1.182.328-1.726V7.544H2.695A10.39 10.39 0 0 0 1.605 11.9c0 1.674.4 3.259 1.09 4.356l3.436-2.63Z"
                fill="#FBBC05"
              />
              <path
                d="M12.005 5.863c1.512 0 2.87.52 3.939 1.542l2.95-2.95C17.11 2.8 14.782 1.8 12.005 1.8a10.39 10.39 0 0 0-9.31 5.744l3.436 2.63c.829-2.471 3.143-4.311 5.874-4.311Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
          <p className="text-center text-xs text-muted-foreground">Google sign-in will be enabled next.</p>
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
