import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ── Types returned by RPCs ─────────────────────────────────────────────────────

export interface DbConversation {
  conversation_id: string;
  other_user_id: string;
  other_name: string;
  other_code: string | null;
  other_role: string;          // public.users.role e.g. "admin"|"moderator"|"user"
  last_body: string | null;
  last_sent_at: string | null;
  unread_count: number;
}

export interface DbMessage {
  id: string;
  sender_id: string;
  body: string;
  sent_at: string;
  read_at: string | null;
}

// ── Hook return shape ──────────────────────────────────────────────────────────

export interface UseMessagesReturn {
  conversations: DbConversation[];
  loadingConvs: boolean;
  messages: DbMessage[];
  loadingMsgs: boolean;
  newMessageSignal: number;
  facilitatorUserId: string | null;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (recipientUserId: string, body: string) => Promise<string | null>;
  markRead: (conversationId: string) => Promise<void>;
}

// ── Typed RPC wrapper ──────────────────────────────────────────────────────────

type AnyRpc = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useMessages(myUserId: string | null): UseMessagesReturn {
  const [conversations, setConversations] = useState<DbConversation[]>([]);
  const [loadingConvs, setLoadingConvs]   = useState(false);
  const [messages, setMessages]           = useState<DbMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [newMessageSignal, setNewMessageSignal] = useState(0);
  const [facilitatorUserId, setFacilitatorUserId] = useState<string | null>(null);

  const rpc = supabase as unknown as AnyRpc;

  // ── Fetch conversations ───────────────────────────────────────────────────

  const fetchConversations = useCallback(async () => {
    if (!myUserId) return;
    setLoadingConvs(true);
    try {
      const { data, error } = await rpc.rpc("cet_get_my_conversations");
      if (!error && Array.isArray(data)) {
        setConversations(data as DbConversation[]);
      }
    } finally {
      setLoadingConvs(false);
    }
  }, [myUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch messages for a conversation ─────────────────────────────────────

  const fetchMessages = useCallback(async (conversationId: string) => {
    setLoadingMsgs(true);
    try {
      const { data, error } = await rpc.rpc("cet_get_conversation_messages", {
        p_conversation_id: conversationId,
      });
      if (!error && Array.isArray(data)) {
        setMessages(data as DbMessage[]);
      }
    } finally {
      setLoadingMsgs(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Send a message (returns conversation_id or null on error) ─────────────

  const sendMessage = useCallback(
    async (recipientUserId: string, body: string): Promise<string | null> => {
      const { data, error } = await rpc.rpc("cet_send_message", {
        p_recipient_id: recipientUserId,
        p_body: body,
      });
      if (error) {
        console.error("cet_send_message:", error.message);
        return null;
      }
      return data as string;
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Mark conversation read (optimistic local update + DB) ─────────────────

  const markRead = useCallback(async (conversationId: string) => {
    // Optimistic update
    setConversations((prev) =>
      prev.map((c) =>
        c.conversation_id === conversationId ? { ...c, unread_count: 0 } : c
      )
    );
    await rpc.rpc("cet_mark_conversation_read", {
      p_conversation_id: conversationId,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch facilitator user ID on mount (learners use this) ────────────────

  useEffect(() => {
    if (!myUserId) return;
    rpc.rpc("cet_get_facilitator_user_id").then(({ data }) => {
      if (data) setFacilitatorUserId(data as string);
    });
  }, [myUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Initial conversations load ─────────────────────────────────────────────

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  // ── Realtime: new message → refresh conversations + signal active conv ─────

  useEffect(() => {
    if (!myUserId) return;

    const channel = supabase
      .channel("cet-messages-realtime")
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "postgres_changes" as any,
        { event: "INSERT", schema: "cet", table: "messages" },
        () => {
          void fetchConversations();
          setNewMessageSignal((n) => n + 1);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [myUserId, fetchConversations]);

  return {
    conversations,
    loadingConvs,
    messages,
    loadingMsgs,
    newMessageSignal,
    facilitatorUserId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markRead,
  };
}
