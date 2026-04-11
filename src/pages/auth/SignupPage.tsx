import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Phone number validation
const isValidPhoneNumber = (value: string): boolean => {
  const trimmed = value.trim();
  if (trimmed === '') return false;
  if (trimmed.includes('@')) return false;
  const digitsOnly = trimmed.replace(/[\s\-\(\)]/g, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    department: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    // Validation
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      setError("Please enter a valid phone number (e.g., 0721234567 or +27721234567)");
      setLoading(false);
      return;
    }

    try {
      // 1. Create auth user with metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phoneNumber,
            id_number: formData.idNumber,
            department: formData.department,
            school: formData.school,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // 2. Call self-registration to create cet.learners record
        const isValidPhone = formData.phoneNumber && isValidPhoneNumber(formData.phoneNumber);
        
        const { error: registerError } = await (supabase as any).rpc('cet_self_register_learner', {
          p_full_name: formData.fullName,
          p_email: formData.email,
          p_phone: isValidPhone ? formData.phoneNumber : null,
        });

        if (registerError) {
          console.error("Self-registration error:", registerError);
          setError("Failed to create learner profile. Please contact support.");
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      setSuccessMessage("Account created successfully! Please check your email to confirm your account, then sign in.");
      
      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        idNumber: "",
        department: "",
        school: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Account created! Please sign in." } 
        });
      }, 3000);
      
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Create Learner Account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign up to track progress and submit assessments.
        </p>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mt-4 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-300">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="072 123 4567"
              autoComplete="tel"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Format: 0721234567 or +27721234567
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="South African ID number"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="school">School/Institution</Label>
              <Input
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="School or Institution"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              required
              autoComplete="new-password"
              minLength={6}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              At least 6 characters
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              required
              autoComplete="new-password"
              minLength={6}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}