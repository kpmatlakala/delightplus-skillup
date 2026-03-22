import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type AnyRpc = {
  rpc: (fn: string) => Promise<{ data: unknown; error: { message: string } | null }>;
};

interface ConvRow {
  unread_count: number;
}

/**
 * Lightweight hook that returns the total unread direct-message count for the
 * current user.  Updates in real-time whenever a new message is inserted.
 */
export function useUnreadCount(myUserId: string | null): number {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!myUserId) { setCount(0); return; }
    const rpc = supabase as unknown as AnyRpc;
    const { data } = await rpc.rpc("dsa_get_my_conversations");
    if (Array.isArray(data)) {
      const total = (data as ConvRow[]).reduce((s, c) => s + (c.unread_count ?? 0), 0);
      setCount(total);
    }
  }, [myUserId]);

  // Initial fetch
  useEffect(() => { void refresh(); }, [refresh]);

  // Realtime: new message → re-fetch
  useEffect(() => {
    if (!myUserId) return;

    const channel = supabase
      .channel(`dsa-unread-count-${myUserId}`)
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "postgres_changes" as any,
        { event: "INSERT", schema: "dsa", table: "messages" },
        () => { void refresh(); }
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [myUserId, refresh]);

  return count;
}
