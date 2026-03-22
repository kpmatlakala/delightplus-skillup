import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "lecturer" | "learner";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapPublicRole = (rawRole: string | null | undefined): AppRole => {
  if (rawRole === "admin") return "admin";
  if (rawRole === "moderator") return "lecturer";
  return "learner";
};

async function fetchRoleForUser(userId: string): Promise<AppRole> {
  const db = supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{ data: { role?: string | null } | null; error: { message: string } | null }>;
        };
      };
    };
  };

  const { data, error } = await db
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("Unable to fetch role from public.users:", error.message);
  }

  return mapPublicRole(data?.role);
}

async function ensureLearnerRegistration(user: User): Promise<void> {
  const rpc = supabase as unknown as {
    rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: string | null; error: { message: string } | null }>;
  };

  const { error } = await rpc.rpc("dsa_self_register_learner", {
    p_full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
    p_email: user.email ?? null,
    p_phone: (user.user_metadata?.phone_number as string | undefined) ?? null,
  });

  if (error) {
    console.warn("Unable to auto-register learner profile/enrollment:", error.message);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveRole = async (activeUser: User | null) => {
    if (!activeUser) {
      setRole(null);
      return;
    }

    const resolvedRole = await fetchRoleForUser(activeUser.id);
    if (resolvedRole === "learner") {
      await ensureLearnerRegistration(activeUser);
    }
    setRole(resolvedRole);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      setSession(data.session);
      setUser(data.session?.user ?? null);
      await resolveRole(data.session?.user ?? null);
      if (isMounted) setLoading(false);
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      resolveRole(nextSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      role,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
      },
      refreshRole: async () => {
        await resolveRole(user);
      },
    }),
    [user, session, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type { AppRole };
