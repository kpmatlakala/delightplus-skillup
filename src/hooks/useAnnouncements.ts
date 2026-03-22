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

// ── Shape returned by dsa_get_announcements() ─────────────────────────────────
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

// Generic RPC helper type
type Rpc = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

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
      normalized.includes("dsa_get_announcements")
    );
  };

  const load = useCallback(async () => {
    if (rpcUnavailable) {
      setLoading(false);
      return;
    }

    try {
      const rpc = supabase as unknown as Rpc;
      const { data, error } = await rpc.rpc("dsa_get_announcements");
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
    } catch {
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
    const channel = supabase
      .channel("announcements-live")
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "postgres_changes" as any,
        { event: "*", schema: "dsa", table: "announcements" },
        () => { void load(); }
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [load, rpcUnavailable]);

  // ── Admin mutations ──────────────────────────────────────────────────────────

  const post = useCallback(
    async (title: string, message: string, audience: Audience): Promise<{ error: { message: string } | null }> => {
      if (rpcUnavailable) {
        return { error: { message: "Announcements RPC is missing in Supabase." } };
      }

      const rpc = supabase as unknown as Rpc;
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
      const { error } = await rpc.rpc("dsa_post_announcement", {
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
      const rpc = supabase as unknown as Rpc;
      const { error } = await rpc.rpc("dsa_pin_announcement", { p_id: id, p_pinned: newPinned });
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
      const rpc = supabase as unknown as Rpc;
      const { error } = await rpc.rpc("dsa_delete_announcement", { p_id: id });
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
