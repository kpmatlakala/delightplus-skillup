import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import { Megaphone, Pin, PinOff, Trash2, Plus, X, Send, ChevronDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useAnnouncements, type Audience, type Announcement } from "@/hooks/useAnnouncements";

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

export default function AnnouncementsPage() {
  const { role } = useAuth();
  const isAdmin = role !== "learner";
  const { items, loading, source, post: dbPost, togglePin, remove } = useAnnouncements();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", message: "", audience: "All" as Audience });
  const [posting, setPosting] = useState(false);

  const pinned = items.filter((a) => a.pinned);
  const regular = items.filter((a) => !a.pinned);

  const post = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    setPosting(true);
    await dbPost(form.title.trim(), form.message.trim(), form.audience);
    setPosting(false);
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
              {a.pinned && (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Pinned</span>
              )}
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${audienceColours[a.audience]}`}>
                {a.audience}
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground leading-snug">{a.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{fmtDate(a.date)} \u00b7 {a.author}</p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0 ml-1">
            {isAdmin && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); void togglePin(a.id); }}
                  title={a.pinned ? "Unpin" : "Pin"}
                  className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  {a.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); void remove(a.id); }}
                  title="Delete"
                  className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                >
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
    <AppLayout
      title="Announcements"
      subtitle={loading ? "Loading…" : source === "db" ? "Live — synced with database" : "Important updates for facilitators and learners"}
    >
      <div className="max-w-2xl space-y-5">
        {/* Live indicator */}
        {source === "db" && (
          <div className="flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400">
            <RefreshCw size={10} className="animate-spin" style={{ animationDuration: "4s" }} />
            Live — updates in real time
          </div>
        )}

        {/* Compose */}
        {isAdmin && (
          <div className="rounded-lg border border-border bg-card">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg"
              >
                <Plus size={14} className="text-accent" />
                Post a new announcement\u2026
              </button>
            ) : (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">New Announcement</p>
                  <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={13} />
                  </button>
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
                  placeholder="Message\u2026"
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
              </div>
            )}
          </div>
        )}

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-1">Pinned</p>
            {pinned.map((a) => <AnnouncementCard key={a.id} a={a} />)}
          </div>
        )}

        {/* Regular */}
        {regular.length > 0 && (
          <div className="space-y-2">
            {pinned.length > 0 && (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-1">Recent</p>
            )}
            {regular.map((a) => <AnnouncementCard key={a.id} a={a} />)}
          </div>
        )}

        {items.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-10 text-center">
            <Megaphone size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
