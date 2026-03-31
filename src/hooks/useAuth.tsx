import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "lecturer" | "learner";

export interface LearnerProfile {
  id: string;
  user_id: string;
  learner_code: string | null;
  full_name: string | null;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  id_number: string | null;
  department: string | null;
  school: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  website: string | null;
  role: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface UnifiedProfile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  phone: string | null;
  id_number: string | null;
  department: string | null;
  school: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  website: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdates {
  p_full_name?: string;
  p_display_name?: string;
  p_phone?: string;
  p_id_number?: string;
  p_department?: string;
  p_school?: string;
  p_bio?: string;
  p_avatar_url?: string;
  p_location?: string;
  p_website?: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  profile: LearnerProfile | null;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: unknown; data?: unknown }>;
  signUp: (email: string, password: string) => Promise<{ error?: unknown; data?: unknown }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  getUnifiedProfile: () => Promise<{ data?: UnifiedProfile; error?: string }>;
  updateProfile: (updates: ProfileUpdates) => Promise<{ data?: UnifiedProfile; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Typed helper to bypass generated-types restrictions ───────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const mapPublicRole = (rawRole: string | null | undefined): AppRole => {
  if (rawRole === "admin") return "admin";
  if (rawRole === "moderator") return "lecturer";
  return "learner";
};

/**
 * Fetch role from the appropriate table based on user type.
 * First check public.users for admin role, then check cet.learners for learner role.
 * Falls back to "learner" on any error so the app never hangs.
 */
async function fetchRoleForUser(userId: string): Promise<AppRole> {
  try {
    // First, check if user is admin in public.users table
    const { data: publicUserData, error: publicUserError } = await db
      .from("users")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    // If user exists in public.users and has admin role, return admin
    if (!publicUserError && publicUserData?.role === "admin") {
      return "admin";
    }
    
    // If user exists in public.users and has moderator role, return lecturer
    if (!publicUserError && publicUserData?.role === "moderator") {
      return "lecturer";
    }

    // Otherwise, check cet.learners table for learner role
    const { data: learnerData, error: learnerError } = await db
      .from("learners")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!learnerError && learnerData?.role) {
      // Map cet.learners.role to AppRole
      if (learnerData.role === "learner") return "learner";
      if (learnerData.role === "lecturer") return "lecturer";
      if (learnerData.role === "admin") return "admin";
    }

    // Default fallback to learner
    return "learner";
  } catch (err) {
    console.warn("fetchRoleForUser threw:", err);
    return "learner";
  }
}

/**
 * Auto-register a new learner via RPC (idempotent).
 * Never throws — errors are logged and swallowed.
 */
async function ensureLearnerRegistration(user: User): Promise<void> {
  try {
    const { error } = await db.rpc("cet_self_register_learner", {
      p_full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      p_email: user.email ?? null,
      p_phone: (user.user_metadata?.phone_number as string | undefined) ?? null,
    });
    if (error) console.warn("ensureLearnerRegistration:", error.message);
  } catch (err) {
    console.warn("ensureLearnerRegistration threw:", err);
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession]               = useState<Session | null>(null);
  const [user, setUser]                     = useState<User | null>(null);
  const [role, setRole]                     = useState<AppRole | null>(null);
  const [loading, setLoading]               = useState(true);
  const [profile, setProfile]               = useState<LearnerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Load learner profile via RPC (correct search_path already set) ────────
  const loadLearnerProfile = async (_userId: string) => {
    setProfileLoading(true);
    try {
      const { data, error } = await db.rpc("cet_get_my_profile_v2");
      if (!error && data) {
        const row = Array.isArray(data) ? data[0] : data;
        if (row) setProfile(row as LearnerProfile);
      }
    } catch (err) {
      console.warn("loadLearnerProfile threw:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Resolve role — NEVER awaited in bootstrap so it can't block loading ───
  const resolveRole = async (activeUser: User | null) => {
    if (!activeUser) {
      setRole(null);
      return;
    }
    const resolvedRole = await fetchRoleForUser(activeUser.id);
    setRole(resolvedRole);

    // Auto-register learners (fire-and-forget)
    if (resolvedRole === "learner") {
      void ensureLearnerRegistration(activeUser);
    }
  };

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    // Hard failsafe: force loading=false after 3 s no matter what
    const failsafe = setTimeout(() => {
      if (isMounted) {
        console.warn("Auth failsafe: forcing loading=false after 3 s");
        setLoading(false);
        setRole((prev) => prev ?? "learner");
      }
    }, 3000);

    const bootstrap = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;

        const activeUser = data.session?.user ?? null;
        setSession(data.session);
        setUser(activeUser);

        if (activeUser) {
          // Fire-and-forget: role + profile arrive after loading=false
          void resolveRole(activeUser);
          void loadLearnerProfile(activeUser.id);
        } else {
          setRole(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth bootstrap error:", err);
        if (isMounted) {
          setRole(null);
          setProfile(null);
        }
      } finally {
        // Always unblock the UI immediately
        if (isMounted) setLoading(false);
      }
    };

    void bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!isMounted) return;
        const nextUser = nextSession?.user ?? null;
        setSession(nextSession);
        setUser(nextUser);

        if (nextUser) {
          void resolveRole(nextUser);
          void loadLearnerProfile(nextUser.id);
        } else {
          setRole(null);
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(failsafe);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auth actions ──────────────────────────────────────────────────────────

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      return result;
    } catch (err) {
      console.error("signIn error:", err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signUp({ email, password });
      return result;
    } catch (err) {
      console.error("signUp error:", err);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setRole(null);
    } catch (err) {
      console.error("signOut error:", err);
    }
  };

  const refreshRole = async () => {
    if (user) await resolveRole(user);
  };

  const refreshProfile = async () => {
    if (user) await loadLearnerProfile(user.id);
  };

  // ── Profile RPCs ──────────────────────────────────────────────────────────

  const getUnifiedProfile = async (): Promise<{ data?: UnifiedProfile; error?: string }> => {
    if (!user) return { error: "No user logged in" };
    try {
      const { data, error } = await db.rpc("cet_get_my_profile_v2");
      if (error) return { error: error.message as string };
      const row = Array.isArray(data) && data.length > 0 ? data[0] : data;
      return { data: (row ?? undefined) as UnifiedProfile | undefined };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return { error: msg };
    }
  };

  const updateProfile = async (
    updates: ProfileUpdates
  ): Promise<{ data?: UnifiedProfile; error?: string }> => {
    if (!user) return { error: "No user logged in" };
    try {
      const { data, error } = await db.rpc("cet_update_my_profile_v2", updates);
      if (error) return { error: error.message as string };
      const row = Array.isArray(data) && data.length > 0 ? data[0] : data;
      if (row) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                full_name:    row.full_name,
                display_name: row.display_name,
                phone:        row.phone,
                id_number:    row.id_number,
                department:   row.department,
                school:       row.school,
                bio:          row.bio,
                avatar_url:   row.avatar_url,
                location:     row.location,
                website:      row.website,
              }
            : null
        );
      }
      return { data: (row ?? undefined) as UnifiedProfile | undefined };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return { error: msg };
    }
  };

  // ── Context value ─────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    user,
    session,
    role,
    loading,
    profile,
    profileLoading,
    signIn,
    signUp,
    signOut,
    refreshRole,
    refreshProfile,
    getUnifiedProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
