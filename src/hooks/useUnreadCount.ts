import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    if (!myUserId) { 
      setCount(0); 
      return; 
    }
    
    try {
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny.rpc("cet_get_my_conversations");
      
      if (error) {
        console.error("Error fetching unread count:", error);
        return;
      }
      
      if (Array.isArray(data)) {
        const total = (data as ConvRow[]).reduce((s, c) => s + (c.unread_count ?? 0), 0);
        setCount(total);
      }
    } catch (err) {
      console.error("Error in unread count refresh:", err);
    }
  }, [myUserId]);

  // Initial fetch
  useEffect(() => { 
    void refresh(); 
  }, [refresh]);

  // Realtime: new message → re-fetch
  useEffect(() => {
    if (!myUserId) return;

    const supabaseAny = supabase as any;
    const channel = supabaseAny
      .channel(`cet-unread-count-${myUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "cet", table: "messages" },
        () => { void refresh(); }
      )
      .subscribe();

    return () => { 
      supabaseAny.removeChannel(channel); 
    };
  }, [myUserId, refresh]);

  return count;
}