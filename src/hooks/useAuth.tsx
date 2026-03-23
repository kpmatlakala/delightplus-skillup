// hooks/useAuth.tsx
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "lecturer" | "learner";

interface LearnerProfile {
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

interface UnifiedProfile {
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

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  profile: LearnerProfile | null;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any; data?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any; data?: any }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
  getUnifiedProfile: () => Promise<{ data?: UnifiedProfile; error?: string }>;
  updateProfile: (updates: ProfileUpdates) => Promise<{ data?: UnifiedProfile; error?: string }>;
  refreshProfile: () => Promise<void>;
}

interface ProfileUpdates {
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Map database roles to frontend AppRole types
 * Database: 'admin', 'moderator', 'learner'
 * Frontend: 'admin', 'lecturer', 'learner'
 */
export const mapDbRoleToAppRole = (dbRole: string | null | undefined): AppRole => {
  if (dbRole === "admin") return "admin";
  if (dbRole === "moderator") return "lecturer";
  if (dbRole === "learner") return "learner";
  // Default fallback for any unknown role
  console.warn(`Unknown role "${dbRole}" in database, defaulting to "learner"`);
  return "learner";
};

async function fetchRoleForUser(userId: string): Promise<AppRole> {
  try {
    const { data, error } = await supabase
      .from("learners")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Unable to fetch role from cet.learners:", error.message);
      return "learner";
    }

    console.log(`User ${userId} role from DB:`, data?.role);
    const mappedRole = mapDbRoleToAppRole(data?.role);
    console.log(`User ${userId} mapped role:`, mappedRole);
    return mappedRole;
  } catch (err) {
    console.error("Error fetching role:", err);
    return "learner";
  }
}

async function ensureLearnerRegistration(user: User): Promise<void> {
  try {
    // Check if learner record already exists
    const { data: existing } = await supabase
      .from("learners")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return; // Already registered
    }

    const { error } = await supabase.rpc("cet_self_register_learner", {
      p_full_name: (user.user_metadata?.full_name as string) || 
                   (user.user_metadata?.display_name as string) ||
                   user.email?.split('@')[0] || null,
      p_email: user.email ?? null,
    });

    if (error) {
      console.warn("Unable to auto-register learner profile:", error.message);
    }
  } catch (err) {
    console.error("Error in ensureLearnerRegistration:", err);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadLearnerProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("learners")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error loading learner profile:", error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error loading learner profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const resolveRole = async (activeUser: User | null) => {
    if (!activeUser) {
      setRole(null);
      return;
    }

    const resolvedRole = await fetchRoleForUser(activeUser.id);
    
    // Only auto-register if they're a learner and don't have a record
    if (resolvedRole === "learner") {
      await ensureLearnerRegistration(activeUser);
      // Reload profile after registration
      await loadLearnerProfile(activeUser.id);
    }
    
    setRole(resolvedRole);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await resolveRole(data.session.user);
          await loadLearnerProfile(data.session.user.id);
        } else {
          setProfileLoading(false);
        }
      } catch (error) {
        console.error("Bootstrap error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      
      if (nextSession?.user) {
        await resolveRole(nextSession.user);
        await loadLearnerProfile(nextSession.user.id);
      } else {
        setRole(null);
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
        await resolveRole(data.user);
        await loadLearnerProfile(data.user.id);
      }
      
      return { data, error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      // The trigger handle_new_user() will auto-create the learner profile
      if (!error && data.user) {
        // Wait a moment for the trigger to create the profile
        setTimeout(async () => {
          await resolveRole(data.user);
          await loadLearnerProfile(data.user.id);
        }, 1000);
      }
      
      return { data, error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setRole(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const refreshRole = async () => {
    if (user) {
      await resolveRole(user);
    }
  };

  const getUnifiedProfile = async (): Promise<{ data?: UnifiedProfile; error?: string }> => {
    if (!user) {
      return { error: "No user logged in" };
    }

    try {
      const { data, error } = await supabase.rpc("cet_get_my_profile_v2");
      
      if (error) {
        console.error("RPC error:", error);
        return { error: error.message };
      }
      
      const profileData = Array.isArray(data) && data.length > 0 ? data[0] : data;
      return { data: profileData as UnifiedProfile };
    } catch (error: any) {
      console.error("Error getting unified profile:", error);
      return { error: error.message || "Unknown error occurred" };
    }
  };

  const updateProfile = async (updates: ProfileUpdates): Promise<{ data?: UnifiedProfile; error?: string }> => {
    if (!user) {
      return { error: "No user logged in" };
    }

    try {
      const { data, error } = await supabase.rpc("cet_update_my_profile_v2", updates);
      
      if (error) {
        console.error("Update error:", error);
        return { error: error.message };
      }
      
      const updatedProfile = Array.isArray(data) && data.length > 0 ? data[0] : data;
      
      if (updatedProfile) {
        setProfile(prev => prev ? {
          ...prev,
          full_name: updatedProfile.full_name,
          display_name: updatedProfile.display_name,
          phone: updatedProfile.phone,
          id_number: updatedProfile.id_number,
          department: updatedProfile.department,
          school: updatedProfile.school,
          bio: updatedProfile.bio,
          avatar_url: updatedProfile.avatar_url,
          location: updatedProfile.location,
          website: updatedProfile.website,
        } : null);
      }
      
      return { data: updatedProfile as UnifiedProfile };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return { error: error.message || "Unknown error occurred" };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadLearnerProfile(user.id);
    }
  };

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
    getUnifiedProfile,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type { LearnerProfile, UnifiedProfile, ProfileUpdates };