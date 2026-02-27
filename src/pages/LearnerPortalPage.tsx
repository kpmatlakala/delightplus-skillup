import AppLayout from "@/components/AppLayout";
import { modules, program } from "@/data/courseData";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, MessageSquare, Bell, Clock3, PlayCircle, Lock, ChevronRight, RefreshCw } from "lucide-react";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export default function LearnerPortalPage() {
  const { progressMap } = useModuleProgress();
  const modulePath = modules;

  // Derive progress from DB data
  const completedModules = modulePath.filter((m) => !!progressMap[m.id]?.guide_completed).length;
  const firstUndoneIndex = modulePath.findIndex((m) => !progressMap[m.id]?.guide_completed);
  const currentModuleIndex = firstUndoneIndex === -1 ? modulePath.length : firstUndoneIndex;
  const overallProgress = Math.round((completedModules / modules.length) * 100);
  const practicalModules = modules.filter((m) => m.type === "Practical").length;
  const knowledgeModules = modules.filter((m) => m.type === "Knowledge").length;
  const unreadMessages = 3;
  const upcomingCheckIn = "Friday, 09:00";
  const { items: liveAnnouncements, loading: announcementsLoading, source: announcementsSource } = useAnnouncements();
  // Show pinned first, max 3, exclude Admin Only (already filtered by RLS)
  const feedItems = liveAnnouncements
    .filter((a) => a.audience !== "Admin Only")
    .slice(0, 3);

  return (
    <AppLayout title="Learner Portal" subtitle="Mission-based learning path">
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base sm:text-lg">{program.title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              SAQA {program.saqaId} • NQF {program.nqfLevel} • {modules.length} modules
            </p>
          </div>
          <div className="min-w-[14rem]">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Path progress</span>
              <span className="font-medium text-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Knowledge</p>
          <p className="font-display text-xl font-bold mt-1">{knowledgeModules}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Practical</p>
          <p className="font-display text-xl font-bold mt-1">{practicalModules}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Unread</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-display text-xl font-bold">{unreadMessages}</p>
            <MessageSquare size={16} className="text-accent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="xl:col-span-2 rounded-lg border border-border bg-card p-4">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
            <PlayCircle size={16} className="text-accent" /> Learning Path
          </h3>
          <p className="text-xs text-muted-foreground mb-3">Select a module to continue your mission path.</p>

          <div className="space-y-2 max-h-[19rem] overflow-auto pr-1">
            {modulePath.map((mod, index) => {
              const isCompleted = !!progressMap[mod.id]?.guide_completed;
              const isCurrent = index === currentModuleIndex;
              const isLocked = index > currentModuleIndex && !isCompleted;

              return (
                <Link
                  key={mod.id}
                  to={`/learner/modules/${mod.id}`}
                  className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors ${
                    isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary/40"
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
                        {index + 1}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
                        {isCompleted && <Badge variant="outline">Done</Badge>}
                        {isCurrent && <Badge>Current</Badge>}
                        {isLocked && <Badge variant="secondary">Locked</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.code} • Block {mod.block} • {mod.credits} credits</p>
                    </div>
                  </div>

                  {isLocked ? <Lock size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
            <Bell size={16} className="text-accent" /> Ops Feed
            {announcementsSource === "db" && (
              <RefreshCw size={10} className="ml-auto text-green-500 dark:text-green-400 animate-spin" style={{ animationDuration: "4s" }} />
            )}
          </h3>
          <div className="space-y-2 mb-3">
            {announcementsLoading && (
              <div className="rounded-md border border-border p-2">
                <p className="text-xs text-muted-foreground">Loading updates…</p>
              </div>
            )}
            {!announcementsLoading && feedItems.length === 0 && (
              <div className="rounded-md border border-border p-2">
                <p className="text-xs text-muted-foreground">No announcements yet.</p>
              </div>
            )}
            {feedItems.map((item) => (
              <div key={item.id} className={`rounded-md border p-2 ${item.pinned ? "border-accent/30 bg-accent/5" : "border-border"}`}>
                {item.pinned && <p className="text-[10px] font-semibold uppercase tracking-wide text-accent mb-0.5">Pinned</p>}
                <p className="text-xs font-medium text-foreground leading-snug">{item.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{item.message}</p>
              </div>
            ))}
          </div>
          <Link
            to="/communications"
            className="flex items-center justify-end gap-1 text-[11px] text-primary hover:underline mb-2 mt-1"
          >
            Show more <ChevronRight size={11} />
          </Link>
          <div className="rounded-md border border-border p-2">
            <p className="text-xs text-muted-foreground">Next check-in</p>
            <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1.5">
              <Clock3 size={14} className="text-accent" /> {upcomingCheckIn}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-accent" /> Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-border p-2">
            <p className="text-muted-foreground">Unread communication</p>
            <p className="font-medium text-foreground mt-1">{unreadMessages} messages</p>
          </div>
          <div className="rounded-md border border-border p-2">
            <p className="text-muted-foreground">Current mission</p>
            <p className="font-medium text-foreground mt-1">{modulePath[currentModuleIndex]?.title ?? "Set module"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-accent" /> Select a Module
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Open a module to start/continue learning, preview in-app docs, and download supporting documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {modulePath.map((mod) => (
          <Link
            key={mod.id}
            to={`/learner/modules/${mod.id}`}
            className="rounded-md border border-border bg-card px-3 py-2 hover:bg-secondary/40 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
              <Badge variant="outline">{mod.type}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{mod.code} • Block {mod.block} • {mod.duration / 60}h</p>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
