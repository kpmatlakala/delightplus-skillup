import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Audience = "All" | "Block 1" | "Block 2" | "Block 3" | "Admin Only";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: Audience;
  date: string;
  pinned: boolean;
  author: string;
}

// ── Shape returned by cet_get_announcements() ─────────────────────────────────
interface DbRow {
  id: string;
  title: string;
  message: string;
  audience: string;
  pinned: boolean;
  author: string;
  created_at: string;
}

function mapRow(row: DbRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    audience: row.audience as Audience,
    date: row.created_at.slice(0, 10),
    pinned: row.pinned,
    author: row.author,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"db" | "fallback">("fallback");
  const [error, setError] = useState<string | null>(null);
  const [rpcUnavailable, setRpcUnavailable] = useState(false);

  const isRpcMissingError = (message: string) => {
    const normalized = message.toLowerCase();
    return (
      normalized.includes("404") ||
      normalized.includes("not found") ||
      normalized.includes("could not find") ||
      normalized.includes("cet_get_announcements")
    );
  };

  const load = useCallback(async () => {
    if (rpcUnavailable) {
      setLoading(false);
      return;
    }

    try {
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny.rpc("cet_get_announcements");
      
      if (!error && Array.isArray(data)) {
        setItems((data as DbRow[]).map(mapRow));
        setError(null);
        setSource("db");
        setLoading(false);
        return;
      }

      if (error?.message) {
        if (isRpcMissingError(error.message)) {
          setRpcUnavailable(true);
          setError("Announcements RPC is missing in Supabase. Run supabase/sql/fix_announcements_rpc.sql.");
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      console.error("Error loading announcements:", err);
      setError("Unable to load announcements right now.");
    }

    setItems([]);
    setSource("fallback");
    setLoading(false);
  }, [rpcUnavailable]);

  useEffect(() => {
    void load();

    if (rpcUnavailable) {
      return;
    }

    // Realtime: re-fetch whenever the cet.announcements table changes
    const supabaseAny = supabase as any;
    const channel = supabaseAny
      .channel("announcements-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "cet", table: "announcements" },
        () => { void load(); }
      )
      .subscribe();

    return () => { supabaseAny.removeChannel(channel); };
  }, [load, rpcUnavailable]);

  // ── Admin mutations ──────────────────────────────────────────────────────────

  const post = useCallback(
    async (title: string, message: string, audience: Audience): Promise<{ error: { message: string } | null }> => {
      if (rpcUnavailable) {
        return { error: { message: "Announcements RPC is missing in Supabase." } };
      }

      const supabaseAny = supabase as any;
      // Optimistic insert
      const tempId = `temp-${Date.now()}`;
      setItems((prev) => [
        {
          id: tempId,
          title,
          message,
          audience,
          date: new Date().toISOString().slice(0, 10),
          pinned: false,
          author: "Admin",
        },
        ...prev,
      ]);
      
      const { error } = await supabaseAny.rpc("cet_post_announcement", {
        p_title: title,
        p_message: message,
        p_audience: audience,
      });

      if (error?.message && isRpcMissingError(error.message)) {
        setRpcUnavailable(true);
        setError("Announcements RPC is missing in Supabase. Run supabase/sql/fix_announcements_rpc.sql.");
      }

      void load(); // reconcile with DB (replaces temp id with real uuid)
      return { error: error as { message: string } | null };
    },
    [load, rpcUnavailable]
  );

  const togglePin = useCallback(
    async (id: string) => {
      if (rpcUnavailable) return;

      const current = items.find((a) => a.id === id);
      if (!current) return;
      const newPinned = !current.pinned;
      
      // Optimistic update
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: newPinned } : a)));
      
      const supabaseAny = supabase as any;
      const { error } = await supabaseAny.rpc("cet_pin_announcement", { p_id: id, p_pinned: newPinned });
      
      if (error) {
        if (isRpcMissingError(error.message)) {
          setRpcUnavailable(true);
          setError("Announcements RPC is missing in Supabase. Run supabase/sql/fix_announcements_rpc.sql.");
        }
        // Revert on failure
        setItems((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !newPinned } : a)));
      }
    },
    [items, rpcUnavailable]
  );

  const remove = useCallback(
    async (id: string) => {
      if (rpcUnavailable) return;

      // Optimistic remove
      setItems((prev) => prev.filter((a) => a.id !== id));
      
      const supabaseAny = supabase as any;
      const { error } = await supabaseAny.rpc("cet_delete_announcement", { p_id: id });
      
      if (error) {
        if (isRpcMissingError(error.message)) {
          setRpcUnavailable(true);
          setError("Announcements RPC is missing in Supabase. Run supabase/sql/fix_announcements_rpc.sql.");
        }
        void load(); // reload if it failed
      }
    },
    [load, rpcUnavailable]
  );

  return { items, loading, source, error, post, togglePin, remove };
}