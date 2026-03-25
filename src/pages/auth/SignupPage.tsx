import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const ensurePublicUserRow = async (userId: string, displayName: string, userEmail: string) => {
    const db = supabase as unknown as {
      from: (table: string) => {
        upsert: (payload: Record<string, unknown>, options?: { onConflict?: string }) => Promise<{ error: { message: string } | null }>;
      };
    };

    const usernameBase = userEmail.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") || "learner";
    const username = `${usernameBase}_${userId.slice(0, 6)}`.toLowerCase();

    const { error: upsertError } = await db.from("users").upsert(
      {
        id: userId,
        username,
        display_name: displayName,
        role: "user",
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.warn("Unable to seed public.users row from signup:", upsertError.message);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.user) {
      await ensurePublicUserRow(data.user.id, fullName, email);
    }

    setLoading(false);
    setSuccessMessage("Account created. If email confirmation is enabled, confirm your email before login.");
    setFullName("");
    setPhoneNumber("");
    setEmail("");
    setPassword("");
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

        <h1 className="font-display text-2xl font-bold text-foreground">Create Learner Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Learner Management Information System</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              autoComplete="tel"
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
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {successMessage && <p className="text-sm text-success">{successMessage}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <footer className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Learner Management Information System
        </footer>
      </div>
    </div>
  );
}
