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

// ── Fallback seed (shown while DB is unreachable or migration not run) ─────────
const FALLBACK: Announcement[] = [
  {
    id: "seed-1",
    title: "Block 1 Schedule Confirmed",
    message:
      "Block 1 training begins 02 March 2026 at CET Venda. All 5 modules (Days 1–5) are confirmed. Facilitator guides and learner workbooks will be distributed via USB on Day 1.",
    audience: "All",
    date: "2026-02-25",
    pinned: true,
    author: "Admin",
  },
  {
    id: "seed-2",
    title: "Offline Portal Available",
    message:
      "The CET Connect portal is available offline. Connect to the local Wi-Fi hotspot and navigate to http://192.168.1.100:5173 to access all materials without internet.",
    audience: "All",
    date: "2026-02-25",
    pinned: true,
    author: "Admin",
  },
  {
    id: "seed-3",
    title: "Assessment Submissions Open",
    message:
      "Summative assessment briefs for Block 1 are now available in each module's Assessment tab. Learners must complete the quiz before the assessment unlocks.",
    audience: "Block 1",
    date: "2026-02-26",
    pinned: false,
    author: "Admin",
  },
  {
    id: "seed-4",
    title: "Facilitator Resource Pack Updated",
    message:
      "Updated Facilitator Guides and Lesson Plan packs for Block 1 are available under each module's Facilitator Guide tab.",
    audience: "Admin Only",
    date: "2026-02-26",
    pinned: false,
    author: "Admin",
  },
];

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

  const load = useCallback(async () => {
    try {
      const rpc = supabase as unknown as Rpc;
      const { data, error } = await rpc.rpc("cet_get_announcements");
      if (!error && Array.isArray(data) && data.length > 0) {
        setItems((data as DbRow[]).map(mapRow));
        setSource("db");
        setLoading(false);
        return;
      }
    } catch {
      // fall through to empty
    }
    setItems([]);
    setSource("fallback");
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();

    // Realtime: re-fetch whenever the cet.announcements table changes
    const channel = supabase
      .channel("announcements-live")
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "postgres_changes" as any,
        { event: "*", schema: "cet", table: "announcements" },
        () => { void load(); }
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [load]);

  // ── Admin mutations ──────────────────────────────────────────────────────────

  const post = useCallback(
    async (title: string, message: string, audience: Audience): Promise<{ error: { message: string } | null }> => {
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
      const { error } = await rpc.rpc("cet_post_announcement", {
        p_title: title,
        p_message: message,
        p_audience: audience,
      });
      void load(); // reconcile with DB (replaces temp id with real uuid)
      return { error: error as { message: string } | null };
    },
    [load]
  );

  const togglePin = useCallback(
    async (id: string) => {
      const current = items.find((a) => a.id === id);
      if (!current) return;
      const newPinned = !current.pinned;
      // Optimistic update
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: newPinned } : a)));
      const rpc = supabase as unknown as Rpc;
      const { error } = await rpc.rpc("cet_pin_announcement", { p_id: id, p_pinned: newPinned });
      if (error) {
        // Revert on failure
        setItems((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !newPinned } : a)));
      }
    },
    [items]
  );

  const remove = useCallback(
    async (id: string) => {
      // Optimistic remove
      setItems((prev) => prev.filter((a) => a.id !== id));
      const rpc = supabase as unknown as Rpc;
      const { error } = await rpc.rpc("cet_delete_announcement", { p_id: id });
      if (error) void load(); // reload if it failed
    },
    [load]
  );

  return { items, loading, source, post, togglePin, remove };
}
