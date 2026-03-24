import AppLayout from "@/components/AppLayout";
import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bell, Mail, Megaphone, Pin, PinOff, Trash2, Plus, X, Send,
  ChevronDown, RefreshCw, Search, CheckCheck, Loader2, Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useAnnouncements, type Audience, type Announcement } from "@/hooks/useAnnouncements";
import { supabase } from "@/integrations/supabase/client";
import { useMessages } from "@/hooks/useMessages";
import { useUnreadCount } from "@/hooks/useUnreadCount";

// ─── shared helpers ────────────────────────────────────────────────────────────

const audienceColours: Record<Audience, string> = {
  All: "bg-primary/10 text-primary border-primary/30",
  "Block 1": "bg-accent/10 text-accent border-accent/30",
  "Block 2": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-400/30",
  "Block 3": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-400/30",
  "Admin Only": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-400/30",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-ZA", { weekday: "short" });
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

// ─── Messages types & contacts ──────────────────────────────────────────────

interface Contact {
  name: string;
  role: string;
  initials: string;
}

interface LearnerContact {
  id: string;
  user_id: string;
  full_name: string;
  learner_code: string;
}

// Learner → they only need to reach their Facilitator/Admin (same person) + Coordinator
const LEARNER_CONTACTS: Contact[] = [
  { name: "Facilitator",       role: "Facilitator / Admin", initials: "TM" },
  { name: "Site Coordinator",  role: "Coordinator",         initials: "SC" },
];

// Admin/Facilitator → operational peers; excludes self (admin IS the facilitator)
const ADMIN_CONTACTS: Contact[] = [
  { name: "Site Coordinator",  role: "Coordinator",  initials: "SC" },
  { name: "PoE Moderator",     role: "Moderator",    initials: "PM" },
  { name: "Lead Assessor",     role: "Assessor",     initials: "LA" },
  { name: "All Learners",      role: "Broadcast",    initials: "LG" },
];

interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  mine: boolean;
}

interface Thread {
  id: string;
  contact: string;
  role: string;
  initials: string;
  preview: string;
  time: string;
  unread: number;
  messages: Message[];
  otherUserId?: string; // auth.users.id — set for DB-backed threads
}

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

// ─── Announcements panel ───────────────────────────────────────────────────────

function AnnouncementsPanel({ isAdmin }: { isAdmin: boolean }) {
  const { items, loading, source, error, post: dbPost, togglePin, remove } = useAnnouncements();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", message: "", audience: "All" as Audience });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const pinned = items.filter((a) => a.pinned);
  const regular = items.filter((a) => !a.pinned);

  const post = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    setPosting(true);
    setPostError(null);
    const result = await dbPost(form.title.trim(), form.message.trim(), form.audience);
    setPosting(false);

    if (result.error) {
      setPostError(result.error.message ?? "Unable to post announcement.");
      return;
    }

    setForm({ title: "", message: "", audience: "All" });
    setShowForm(false);
  };

  const AnnouncementCard = ({ a }: { a: Announcement }) => {
    const expanded = expandedId === a.id;
    return (
      <div className={`rounded-lg border bg-card transition-colors ${a.pinned ? "border-accent/30" : "border-border"}`}>
        <div
          className="flex items-start gap-3 px-4 py-3 cursor-pointer select-none"
          onClick={() => setExpandedId(expanded ? null : a.id)}
        >
          <div className={`shrink-0 mt-0.5 p-1.5 rounded-md ${a.pinned ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
            <Megaphone size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              {a.pinned && <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Pinned</span>}
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${audienceColours[a.audience]}`}>
                {a.audience}
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground leading-snug">{a.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{fmtDate(a.date)} · {a.author}</p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0 ml-1">
            {isAdmin && (
              <>
                <button onClick={(e) => { e.stopPropagation(); void togglePin(a.id); }} title={a.pinned ? "Unpin" : "Pin"} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  {a.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); void remove(a.id); }} title="Delete" className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 size={12} />
                </button>
              </>
            )}
            <ChevronDown size={13} className={`text-muted-foreground transition-transform ml-1 ${expanded ? "rotate-180" : ""}`} />
          </div>
        </div>
        {expanded && (
          <div className="px-4 pb-4 pt-1 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{a.message}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Live indicator */}
      {source === "db" && (
        <div className="flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400">
          <RefreshCw size={10} className="animate-spin" style={{ animationDuration: "4s" }} />
          Live — updates in real time
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Compose (admin/lecturer only) */}
      {isAdmin && (
        <div className="rounded-lg border border-border bg-card">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg">
              <Plus size={14} className="text-accent" /> Post a new announcement…
            </button>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">New Announcement</p>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>
              </div>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <textarea
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="Message…"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Audience:</label>
                  <select
                    value={form.audience}
                    onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value as Audience }))}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {(["All", "Block 1", "Block 2", "Block 3", "Admin Only"] as Audience[]).map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => { void post(); }}
                  disabled={!form.title.trim() || !form.message.trim() || posting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send size={11} /> {posting ? "Posting…" : "Post"}
                </button>
              </div>
              {postError && <p className="text-xs text-destructive">{postError}</p>}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 rounded-lg border border-border bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {pinned.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-1">Pinned</p>
              {pinned.map((a) => <AnnouncementCard key={a.id} a={a} />)}
            </div>
          )}
          {regular.length > 0 && (
            <div className="space-y-2">
              {pinned.length > 0 && <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-1">Recent</p>}
              {regular.map((a) => <AnnouncementCard key={a.id} a={a} />)}
            </div>
          )}
          {items.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <Megaphone size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Messages panel ────────────────────────────────────────────────────────────

function MessagesPanel({
  role,
  userName,
  myUserId,
}: {
  role: string | null;
  userName: string;
  myUserId: string | null;
}) {
  const isLearner = role === "learner";
  const {
    conversations,
    loadingConvs,
    messages: dbMessages,
    loadingMsgs,
    newMessageSignal,
    facilitatorUserId,
    fetchConversations,
    fetchMessages,
    sendMessage: dbSendMessage,
    markRead: dbMarkRead,
  } = useMessages(myUserId);

  const [localThreads, setLocalThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeRole, setComposeRole] = useState("");
  const [composeToCustom, setComposeToCustom] = useState("");
  const [composeText, setComposeText] = useState("");
  const [selectedOtherUserId, setSelectedOtherUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Learner directory for "Other" picker
  const [learnerList, setLearnerList] = useState<LearnerContact[]>([]);
  const [learnerLoadState, setLearnerLoadState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [learnerSearch, setLearnerSearch] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  const contacts = isLearner ? LEARNER_CONTACTS : ADMIN_CONTACTS;
  const resolvedTo   = composeTo === "__other__" ? composeToCustom.trim() : composeTo;
  const resolvedRole = composeTo === "__other__"
    ? (selectedOtherUserId ? "Learner" : "Contact")
    : composeRole;

  // ── Derived: DB conversations + local-only threads ──────────────────────────
  const dbThreads: Thread[] = conversations.map((c) => ({
    id: c.conversation_id,
    contact: c.other_name,
    role:
      c.other_code
        ? "Learner"
        : c.other_role === "admin" || c.other_role === "moderator"
        ? "Facilitator / Admin"
        : c.other_role === "user"
        ? "Learner"
        : "Staff",
    initials: getInitials(c.other_name),
    preview: c.last_body ?? "No messages yet",
    time: c.last_sent_at ? fmtTime(c.last_sent_at) : "",
    unread: c.unread_count,
    messages: [],
    otherUserId: c.other_user_id,
  }));
  const threads = [...dbThreads, ...localThreads];
  const active = threads.find((t) => t.id === activeId) ?? null;

  // Messages to display: DB fetch for DB-backed threads, local state for offline
  const isDbActive = conversations.some((c) => c.conversation_id === activeId);
  const displayMessages: Message[] = isDbActive
    ? dbMessages.map((m) => ({
        id: m.id,
        from: m.sender_id === myUserId ? userName : (active?.contact ?? ""),
        text: m.body,
        time: new Date(m.sent_at).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
        mine: m.sender_id === myUserId,
      }))
    : localThreads.find((t) => t.id === activeId)?.messages ?? [];

  // ── Effects ───────────────────────────────────────────────────────────────
  // Fetch learner directory when "Other" tile is selected
  useEffect(() => {
    if (composeTo !== "__other__") return;
    if (learnerLoadState !== "idle") return;
    setLearnerLoadState("loading");
    const rpc = supabase as unknown as {
      rpc: (fn: string) => Promise<{ data: LearnerContact[] | null; error: { message: string } | null }>;
    };
    rpc.rpc("cet_list_learners_for_messaging")
      .then(({ data, error }) => {
        if (!error && data) setLearnerList(data);
        setLearnerLoadState(error ? "error" : "done");
      });
  }, [composeTo, learnerLoadState]);

  // Realtime: new message signal → reload active DB conversation messages
  useEffect(() => {
    if (!activeId || !isDbActive || newMessageSignal === 0) return;
    void fetchMessages(activeId);
  }, [newMessageSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages.length, activeId]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const filtered = threads.filter((t) =>
    t.contact.toLowerCase().includes(search.toLowerCase()) ||
    t.preview.toLowerCase().includes(search.toLowerCase())
  );

  const selectThread = async (id: string) => {
    setActiveId(id);
    const isDb = conversations.some((c) => c.conversation_id === id);
    if (isDb) {
      await fetchMessages(id);
      await dbMarkRead(id);
    } else {
      setLocalThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
    }
  };

  const sendReply = async () => {
    if (!reply.trim() || !activeId) return;
    const trimmed = reply.trim();
    setReply("");
    if (isDbActive && active?.otherUserId) {
      await dbSendMessage(active.otherUserId, trimmed);
      await fetchMessages(activeId);
      await fetchConversations();
    } else {
      const msg: Message = {
        id: Date.now().toString(),
        from: userName,
        text: trimmed,
        time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
        mine: true,
      };
      setLocalThreads((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, messages: [...t.messages, msg], preview: msg.text, time: msg.time } : t
        )
      );
    }
  };

  const resetCompose = () => {
    setComposeTo(""); setComposeRole(""); setComposeToCustom(""); setComposeText("");
    setSelectedOtherUserId(null); setLearnerSearch(""); setShowManualInput(false);
    setLearnerLoadState("idle"); setShowCompose(false);
  };

  const startThread = async () => {
    if (!resolvedTo || !composeText.trim()) return;
    let recipientUserId: string | null = null;
    if (composeTo === "Facilitator" && facilitatorUserId) {
      recipientUserId = facilitatorUserId;
    } else if (composeTo === "__other__" && selectedOtherUserId) {
      recipientUserId = selectedOtherUserId;
    }
    if (recipientUserId) {
      const convId = await dbSendMessage(recipientUserId, composeText.trim());
      if (convId) {
        await fetchConversations();
        await fetchMessages(convId);
        setActiveId(convId);
      }
    } else {
      const id = Date.now().toString();
      const msg: Message = {
        id: `${id}-m`, from: userName, text: composeText.trim(),
        time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
        mine: true,
      };
      setLocalThreads((prev) => [{
        id, contact: resolvedTo, role: resolvedRole, initials: getInitials(resolvedTo),
        preview: msg.text, time: msg.time, unread: 0, messages: [msg],
      }, ...prev]);
      setActiveId(id);
    }
    resetCompose();
  };

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);
  const hasThreads = threads.length > 0;

  return (
    <>
      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl p-5 space-y-3 mx-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">New Message</p>
              <button onClick={resetCompose} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
            </div>

            {/* Recipient picker */}
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-1.5">To</p>
              <div className="grid grid-cols-2 gap-1.5">
                {contacts.map((c) => {
                  const selected = composeTo === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => { setComposeTo(c.name); setComposeRole(c.role); setComposeToCustom(""); setSelectedOtherUserId(null); }}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary/8 text-foreground"
                          : "border-border bg-background hover:bg-secondary/40 text-muted-foreground"
                      }`}
                    >
                      <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>{c.initials}</span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium leading-tight truncate">{c.name.replace(" — ", "\n").split("\n")[0]}</p>
                        <p className="text-[10px] leading-tight opacity-70">{c.role}</p>
                      </div>
                      {selected && <div className="ml-auto shrink-0 w-3 h-3 rounded-full bg-primary" />}
                    </button>
                  );
                })}
                {/* Other */}
                <button
                  type="button"
                  onClick={() => { setComposeTo("__other__"); setComposeRole("Contact"); setSelectedOtherUserId(null); }}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                    composeTo === "__other__"
                      ? "border-primary bg-primary/8 text-foreground"
                      : "border-border bg-background hover:bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">…</span>
                  <div>
                    <p className="text-[11px] font-medium leading-tight">Other</p>
                    <p className="text-[10px] leading-tight opacity-70">Type a name</p>
                  </div>
                  {composeTo === "__other__" && <div className="ml-auto shrink-0 w-3 h-3 rounded-full bg-primary" />}
                </button>
              </div>

              {composeTo === "__other__" && (
                <div className="mt-2 rounded-lg border border-border bg-background overflow-hidden">
                  {/* Search bar */}
                  <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-border">
                    <Search size={11} className="text-muted-foreground shrink-0" />
                    <input
                      autoFocus
                      className="flex-1 bg-transparent text-xs placeholder:text-muted-foreground focus:outline-none"
                      placeholder="Search learners…"
                      value={learnerSearch}
                      onChange={(e) => { setLearnerSearch(e.target.value); setComposeToCustom(""); setSelectedOtherUserId(null); }}
                    />
                    {learnerLoadState === "loading" && <Loader2 size={11} className="text-muted-foreground animate-spin shrink-0" />}
                  </div>

                  {/* Learner list */}
                  <div className="overflow-y-auto" style={{ maxHeight: "11rem" }}>
                    {learnerLoadState === "loading" && (
                      <div className="flex items-center justify-center gap-2 py-5 text-xs text-muted-foreground">
                        <Loader2 size={12} className="animate-spin" /> Loading registered learners…
                      </div>
                    )}
                    {learnerLoadState === "error" && (
                      <p className="text-xs text-destructive text-center py-4">Could not load learners. Type a name below.</p>
                    )}
                    {(learnerLoadState === "done") && (() => {
                      const filtered = learnerList.filter((l) =>
                        l.full_name.toLowerCase().includes(learnerSearch.toLowerCase()) ||
                        l.learner_code.toLowerCase().includes(learnerSearch.toLowerCase())
                      );
                      if (filtered.length === 0) {
                        return (
                          <p className="text-xs text-muted-foreground text-center py-4">No match. Use the field below.</p>
                        );
                      }
                      return filtered.map((l) => {
                        const sel = composeToCustom === l.full_name;
                        const ini = getInitials(l.full_name);
                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => { setComposeToCustom(l.full_name); setSelectedOtherUserId(l.user_id); setLearnerSearch(""); setShowManualInput(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors border-b border-border last:border-0 ${
                              sel ? "bg-primary/8" : "hover:bg-secondary/40"
                            }`}
                          >
                            <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              sel ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>{ini}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium truncate ${sel ? "text-foreground" : "text-muted-foreground"}`}>{l.full_name}</p>
                              <p className="text-[10px] text-muted-foreground">{l.learner_code}</p>
                            </div>
                            {sel && <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-primary" />}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Manual fallback */}
                  <div className="border-t border-border">
                    {!showManualInput ? (
                      <button
                        type="button"
                        onClick={() => setShowManualInput(true)}
                        className="w-full flex items-center gap-1.5 px-3 py-2 text-[11px] text-muted-foreground hover:bg-secondary/40 transition-colors"
                      >
                        <Users size={11} /> Not listed? Type a name manually
                      </button>
                    ) : (
                      <input
                        autoFocus
                        className="w-full bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none"
                        placeholder="Type recipient name…"
                        value={composeToCustom}
                        onChange={(e) => { setComposeToCustom(e.target.value); setSelectedOtherUserId(null); }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <textarea
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Message…"
              value={composeText}
              onChange={(e) => setComposeText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={resetCompose} className="rounded-lg border border-border text-muted-foreground px-3 py-1.5 text-xs hover:bg-secondary/40">Cancel</button>
              <button
                onClick={() => { void startThread(); }}
                disabled={!resolvedTo || !composeText.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                <Send size={11} /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ height: "calc(100vh - 17rem)" }}>
        <div className="flex h-full">
          {/* Thread list */}
          <div className="w-64 shrink-0 flex flex-col border-r border-border">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
              <div className="flex-1 flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5">
                <Search size={12} className="text-muted-foreground shrink-0" />
                <input
                  className="flex-1 bg-transparent text-xs placeholder:text-muted-foreground focus:outline-none"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowCompose(true)}
                title="New message"
                className="shrink-0 p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>

            {totalUnread > 0 && (
              <div className="px-3 py-1.5 border-b border-border bg-primary/5">
                <p className="text-[11px] text-primary font-medium">{totalUnread} unread</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {loadingConvs && threads.length === 0 && (
                <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                  <Loader2 size={12} className="animate-spin" /> Loading…
                </div>
              )}
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { void selectThread(t.id); }}
                  className={`w-full flex items-start gap-2.5 px-3 py-3 border-b border-border text-left transition-colors ${activeId === t.id ? "bg-primary/8" : "hover:bg-secondary/40"}`}
                >
                  <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">{t.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-medium truncate ${t.unread > 0 ? "text-foreground" : "text-muted-foreground"}`}>{t.contact}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{t.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="text-[11px] text-muted-foreground truncate">{t.preview}</p>
                      {t.unread > 0 && (
                        <Badge className="shrink-0 h-4 min-w-4 text-[9px] px-1 rounded-full bg-primary text-primary-foreground">{t.unread}</Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {!loadingConvs && filtered.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">No conversations found.</p>
              )}
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 min-w-0 flex flex-col">
            {!hasThreads || !active ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Mail size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tap the <span className="font-semibold">+</span> button to start a new message</p>
                </div>
                <button
                  onClick={() => setShowCompose(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus size={12} /> New Message
                </button>
              </div>
            ) : (
              <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/20">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">{active.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">{active.contact}</p>
                <p className="text-[11px] text-muted-foreground">{active.role}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              ) : displayMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.mine ? "flex-row-reverse" : ""}`}>
                  {!msg.mine && (
                    <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                      <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">{active.initials}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] space-y-0.5 flex flex-col ${msg.mine ? "items-end" : "items-start"}`}>
                    <div className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${msg.mine ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] text-muted-foreground ${msg.mine ? "flex-row-reverse" : ""}`}>
                      <span>{msg.time}</span>
                      {msg.mine && <CheckCheck size={11} className="text-primary" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-border bg-background">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Reply…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendReply(); } }}
                />
                <button
                  onClick={() => { void sendReply(); }}
                  disabled={!reply.trim()}
                  className="shrink-0 p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">Enter to send · Shift+Enter for new line</p>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function CommunicationsPage() {
  const { role, user } = useAuth();
  const isAdmin = role !== "learner";
  const userName = (user?.user_metadata?.full_name as string | undefined) ?? (isAdmin ? "Admin" : "Me");

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") ?? "updates") as "updates" | "messages";

  const { items: announcements } = useAnnouncements();
  const announcementCount = isAdmin
    ? announcements.length
    : announcements.filter((a) => a.audience !== "Admin Only").length;
  // Live unread message count from DB
  const unreadMessages = useUnreadCount(user?.id ?? null);

  const switchTab = (tab: "updates" | "messages") => {
    setSearchParams({ tab });
  };

  return (
    <AppLayout
      title="Communications"
      subtitle={activeTab === "updates" ? "Announcements & updates" : "Direct messages"}
    >
      {!isAdmin && (
        <Link
          to="/learner"
          className="inline-flex items-center text-xs text-primary hover:underline mb-3"
        >
          ← Back to Learner Portal
        </Link>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit mb-5">
        <button
          onClick={() => switchTab("updates")}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "updates"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell size={14} />
          Updates
          {announcementCount > 0 && (
            <span className="min-w-[18px] h-[18px] rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center px-1 leading-none">
              {announcementCount > 9 ? "9+" : announcementCount}
            </span>
          )}
        </button>

        <button
          onClick={() => switchTab("messages")}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "messages"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail size={14} />
          Messages
          {unreadMessages > 0 && (
            <span className="min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1 leading-none">
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* Panel */}
      {activeTab === "updates" ? (
        <div className="max-w-2xl">
          <AnnouncementsPanel isAdmin={isAdmin} />
        </div>
      ) : (
        <MessagesPanel role={role} userName={userName} myUserId={user?.id ?? null} />
      )}
    </AppLayout>
  );
}
