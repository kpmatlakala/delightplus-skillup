import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const ensurePublicUserRow = async (
    userId: string,
    displayName: string,
    userEmail: string,
    phone: string,
    idNumber: string,
    department: string,
    school: string
  ) => {
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
        phone: phone,
        id_number: idNumber,
        department: department,
        school: school,
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
          id_number: idNumber,
          department: department,
          school: school,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.user) {
      await ensurePublicUserRow(
        data.user.id,
        fullName,
        email,
        phoneNumber,
        idNumber,
        department,
        school
      );
    }

    setLoading(false);
    setSuccessMessage("Account created. If email confirmation is enabled, confirm your email before login.");
    setFullName("");
    setPhoneNumber("");
    setIdNumber("");
    setDepartment("");
    setSchool("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Create Learner Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Learners can sign up to track progress and submit assessments.</p>


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
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="school">School/Institution</Label>
            <Input
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
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
      </div>
    </div>
  );
}
