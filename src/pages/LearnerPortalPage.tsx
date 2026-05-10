import { modules, program } from "@/data/courseData";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, MessageSquare, Bell, Clock3, ChevronRight, RefreshCw, ArrowRight, Layers, Compass, Hourglass } from "lucide-react";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export default function LearnerPortalPage() {
  const { progressMap } = useModuleProgress();
  const modulePath = modules;
  const completedModules = modulePath.filter((m) => !!progressMap[m.id]?.guide_completed).length;
  const overallProgress = Math.round((completedModules / modules.length) * 100);
  const unreadMessages = 3;
  const upcomingCheckIn = "Friday, 09:00";
  const { items: liveAnnouncements, loading: announcementsLoading, source: announcementsSource } = useAnnouncements();
  const feedItems = liveAnnouncements
    .filter((a) => a.audience !== "Admin Only")
    .slice(0, 3);

  // ── Course catalog (assumption-driven, not yet DB-backed) ────────
  // Active emulated course = SAQA 78965 (the one we currently have content for).
  // Everything else from the catalog is shown as "Coming soon".
  const enrolledCourses = [
    {
      id: program.saqaId,
      title: program.title,
      saqaId: program.saqaId,
      nqfLevel: program.nqfLevel,
      moduleCount: modules.length,
      progress: overallProgress,
      status: "Active" as const,
    },
    {
      id: "SP-230375",
      title: "Occupational Certificate: Python Programmer",
      saqaId: "SP-230375",
      nqfLevel: 4,
      moduleCount: 5,
      progress: 0,
      status: "Planned" as const,
    },
  ];
  const enrolledCount = enrolledCourses.length;
  const availableCount = 0;
  const inProgressCount = enrolledCourses.filter((c) => c.progress > 0 && c.progress < 100).length;

  return (
    <>
      {/* ── Welcome / overview ──────────────────────────────── */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base sm:text-lg">
              Welcome to TDSA Learning
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track your enrolled courses, browse the catalog, and continue where you left off.
            </p>
          </div>
          <div className="flex items-center justify-start lg:justify-end">
            <img
              src="/logos/dsa-logo.png"
              alt="The Data Science Academy"
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* ── Enrollment stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Enrolled courses</p>
            <BookOpen size={14} className="text-accent" />
          </div>
          <p className="font-display text-xl font-bold mt-1">{enrolledCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">In progress</p>
            <Hourglass size={14} className="text-accent" />
          </div>
          <p className="font-display text-xl font-bold mt-1">{inProgressCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Available</p>
            <Compass size={14} className="text-accent" />
          </div>
          <p className="font-display text-xl font-bold mt-1">{availableCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Unread</p>
            <MessageSquare size={14} className="text-accent" />
          </div>
          <p className="font-display text-xl font-bold mt-1">{unreadMessages}</p>
        </div>
      </div>

      {/* ── My Courses ────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Layers size={16} className="text-accent" /> My Courses
          </h3>
          <span className="text-[11px] text-muted-foreground">{enrolledCount} enrolled</span>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">You're not enrolled in any courses yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Check the "Coming soon" list below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="rounded-md border border-border p-3 hover:bg-secondary/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">{course.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {course.saqaId ? `SAQA ${course.saqaId} • ` : ""}{course.nqfLevel ? `NQF ${course.nqfLevel} • ` : ""}{course.moduleCount} modules
                    </p>
                  </div>
                  <Badge variant={course.status === "Active" ? "default" : "secondary"} className="shrink-0 text-[10px]">{course.status}</Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <Link
                    to={`/learner/programs/${course.saqaId}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    {course.status === "Active" ? "Continue" : "View modules"} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Ops Feed ───────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
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
            <p className="text-muted-foreground">Next check-in</p>
            <p className="font-medium text-foreground mt-1">{upcomingCheckIn}</p>
          </div>
        </div>
      </div>
    </>
  );
}
