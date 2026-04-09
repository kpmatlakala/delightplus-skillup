import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import { Mail, Send, Plus, X, Search, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

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
}

const SEED_THREADS: Thread[] = [
  {
    id: "t1",
    contact: "Site Coordinator",
    role: "Coordinator",
    initials: "SC",
    preview: "Block 1 venue confirmed for 02 March.",
    time: "09:15",
    unread: 2,
    messages: [
      { id: "m1", from: "Site Coordinator", text: "Good morning. Block 1 venue has been confirmed for 02 March at CET Venda Main Hall.", time: "08:47", mine: false },
      { id: "m2", from: "Admin", text: "Thanks! Will the projector and flipchart be set up by 08:30?", time: "08:52", mine: true },
      { id: "m3", from: "Site Coordinator", text: "Yes. AV is booked from 08:00. Backup printed materials will also be ready.", time: "09:01", mine: false },
      { id: "m4", from: "Site Coordinator", text: "Block 1 venue confirmed for 02 March.", time: "09:15", mine: false },
    ],
  },
  {
    id: "t2",
    contact: "Facilitator \u2014 T. Mokoena",
    role: "Facilitator",
    initials: "TM",
    preview: "Can I get the Day 3 facilitator guide?",
    time: "Yesterday",
    unread: 1,
    messages: [
      { id: "m5", from: "T. Mokoena", text: "Hi, I noticed the Day 3 facilitator guide for 14918 is not on my USB. Can you send it?", time: "Yesterday 14:20", mine: false },
      { id: "m6", from: "Admin", text: "It\u2019s available in the portal under Module 14918 > Facilitator Guide tab. You can also download it from there directly.", time: "Yesterday 14:35", mine: true },
      { id: "m7", from: "T. Mokoena", text: "Can I get the Day 3 facilitator guide?", time: "Yesterday 14:55", mine: false },
    ],
  },
  {
    id: "t3",
    contact: "PoE Moderator",
    role: "Moderator",
    initials: "PM",
    preview: "Assessment evidence alignment confirmed.",
    time: "Mon",
    unread: 0,
    messages: [
      { id: "m8", from: "PoE Moderator", text: "I\u2019ve reviewed the assessment briefs for Block 1. All 5 units align with SAQA requirements.", time: "Mon 10:00", mine: false },
      { id: "m9", from: "Admin", text: "Great, thank you. We\u2019ll keep the current structure then.", time: "Mon 10:15", mine: true },
      { id: "m10", from: "PoE Moderator", text: "Assessment evidence alignment confirmed.", time: "Mon 10:22", mine: false },
    ],
  },
];

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function MessagesPage() {
  const { user } = useAuth();
  const senderName = (user?.user_metadata?.full_name as string | undefined) ?? "Admin";

  const [threads, setThreads] = useState<Thread[]>(SEED_THREADS);
  const [activeId, setActiveId] = useState<string>(SEED_THREADS[0].id);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeText, setComposeText] = useState("");

  const active = threads.find((t) => t.id === activeId)!;
  const filtered = threads.filter((t) =>
    t.contact.toLowerCase().includes(search.toLowerCase()) ||
    t.preview.toLowerCase().includes(search.toLowerCase())
  );

  const markRead = (id: string) =>
    setThreads((prev) => prev.map((t) => t.id === id ? { ...t, unread: 0 } : t));

  const selectThread = (id: string) => {
    setActiveId(id);
    markRead(id);
  };

  const sendReply = () => {
    if (!reply.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      from: senderName,
      text: reply.trim(),
      time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
      mine: true,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, msg], preview: msg.text, time: msg.time }
          : t
      )
    );
    setReply("");
  };

  const startThread = () => {
    if (!composeTo.trim() || !composeText.trim()) return;
    const id = Date.now().toString();
    const msg: Message = {
      id: `${id}-m`,
      from: senderName,
      text: composeText.trim(),
      time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
      mine: true,
    };
    const thread: Thread = {
      id,
      contact: composeTo.trim(),
      role: "Contact",
      initials: getInitials(composeTo.trim()),
      preview: msg.text,
      time: msg.time,
      unread: 0,
      messages: [msg],
    };
    setThreads((prev) => [thread, ...prev]);
    setActiveId(id);
    setComposeTo("");
    setComposeText("");
    setShowCompose(false);
  };

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <AppLayout
      title="Messages"
      subtitle={totalUnread > 0 ? `${totalUnread} unread message${totalUnread !== 1 ? "s" : ""}` : "Direct messages between facilitators and coordinators"}
    >
      {/* Compose new thread modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl p-5 space-y-3 mx-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">New Message</p>
              <button onClick={() => setShowCompose(false)} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="To (name or role)"
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
            />
            <textarea
              rows={4}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Message\u2026"
              value={composeText}
              onChange={(e) => setComposeText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCompose(false)}
                className="rounded-lg border border-border text-muted-foreground px-3 py-1.5 text-xs hover:bg-secondary/40"
              >
                Cancel
              </button>
              <button
                onClick={startThread}
                disabled={!composeTo.trim() || !composeText.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                <Send size={11} /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ height: "calc(100vh - 13rem)" }}>
        <div className="flex h-full">

          {/* Thread list */}
          <div className="w-72 shrink-0 flex flex-col border-r border-border">
            {/* List header */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
              <div className="flex-1 flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5">
                <Search size={12} className="text-muted-foreground shrink-0" />
                <input
                  className="flex-1 bg-transparent text-xs placeholder:text-muted-foreground focus:outline-none"
                  placeholder="Search\u2026"
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

            {/* Threads */}
            <div className="flex-1 overflow-y-auto">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectThread(t.id)}
                  className={`w-full flex items-start gap-2.5 px-3 py-3 border-b border-border text-left transition-colors ${
                    activeId === t.id ? "bg-primary/8" : "hover:bg-secondary/40"
                  }`}
                >
                  <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-medium truncate ${t.unread > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                        {t.contact}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{t.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="text-[11px] text-muted-foreground truncate">{t.preview}</p>
                      {t.unread > 0 && (
                        <Badge className="shrink-0 h-4 min-w-4 text-[9px] px-1 rounded-full bg-primary text-primary-foreground">
                          {t.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">No conversations found.</p>
              )}
            </div>
          </div>

          {/* Conversation panel */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Conversation header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/20">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                  {active.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">{active.contact}</p>
                <p className="text-[11px] text-muted-foreground">{active.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {active.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.mine ? "flex-row-reverse" : ""}`}>
                  {!msg.mine && (
                    <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                      <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">{active.initials}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] space-y-0.5 ${msg.mine ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.mine
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] text-muted-foreground ${msg.mine ? "flex-row-reverse" : ""}`}>
                      <span>{msg.time}</span>
                      {msg.mine && <CheckCheck size={11} className="text-primary" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <div className="px-4 py-3 border-t border-border bg-background">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Reply\u2026"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim()}
                  className="shrink-0 p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">Press Enter to send \u00b7 Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
