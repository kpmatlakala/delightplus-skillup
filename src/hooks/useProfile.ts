import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  website: string | null;
  role: string | null;
  reputation: number | null;
  phone: string | null;
  id_number: string | null;
  department: string | null;
  school: string | null;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rpc = supabase as unknown as {
      rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: any; error: { message: string } | null }>;
    };
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      const { data, error } = await rpc.rpc("cet_get_my_profile_v2");
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const profile = ((data as UserProfile[] | null) ?? [])[0] ?? null;
      setProfile(profile);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  return { profile, loading, error };
}
