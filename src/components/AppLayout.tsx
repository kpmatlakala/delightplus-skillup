import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mail } from "lucide-react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PresentationMode } from "./PresentationMode";
import { modules as allModules } from "@/data/courseData";
import type { Module } from "@/types/course";
import {
  EV_LAUNCH,
  LAUNCHER_CHANNEL,
  type LaunchPayload,
} from "@/lib/presentationSync";

const getInitials = (displayName: string, email: string) => {
  const source = displayName || email;
  if (!source) return "U";
  const parts = source.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
};

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

interface RemoteLaunch {
  moduleId: string;
  sessionCode: string;
  module: Module | undefined;
  mode: "briefing" | "module";
  nextUnitId?: string;
  nextUnitTitle?: string;
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  // Announcements count (learner-only — hook no-ops for other roles via its internal guard)
  const { items: announcements } = useAnnouncements();
  // Announcement count — learners see public items; admin sees all (incl. Admin Only)
  const announcementCount = role === "learner"
    ? announcements.filter((a) => a.audience !== "Admin Only").length
    : announcements.length;
  // Unread messages — live from DB
  const unreadMessages = useUnreadCount(user?.id ?? null);

  /* ── Remote launch state — set when the facilitator's phone broadcasts EV_LAUNCH */
  const [remoteLaunch, setRemoteLaunch] = useState<RemoteLaunch | null>(null);

  /* ── Subscribe to the global launcher channel (admin/lecturer only) */
  useEffect(() => {
    if (role !== "admin" && role !== "lecturer") return;

    const ch = supabase.channel(LAUNCHER_CHANNEL, {
      config: { broadcast: { ack: false } },
    } as Parameters<typeof supabase.channel>[1]);

    ch
      .on("broadcast", { event: EV_LAUNCH }, ({ payload }: { payload: LaunchPayload }) => {
        const { moduleId, sessionCode } = payload;
        const isBriefing = moduleId === "briefing";
        const modIndex = isBriefing ? -1 : allModules.findIndex((m) => m.id === moduleId);
        const nextMod = allModules[modIndex + 1]; // undefined if last module
        setRemoteLaunch({
          moduleId,
          sessionCode,
          module: isBriefing ? undefined : allModules.find((m) => m.id === moduleId),
          mode: isBriefing ? "briefing" : "module",
          nextUnitId: nextMod?.id,
          nextUnitTitle: nextMod?.title,
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [role]);

  useEffect(() => {
    const loadProfileSummary = async () => {
      const rpc = supabase as unknown as {
        rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: Array<{ display_name: string | null; avatar_url: string | null }> | null; error: { message: string } | null }>;
      };

      const { data } = await rpc.rpc("cet_get_my_profile_v2");
      const row = (data ?? [])[0];
      setProfileDisplayName(row?.display_name ?? "");
      setProfileAvatarUrl(row?.avatar_url ?? "");
    };

    loadProfileSummary();
  }, [user?.id]);

  const displayName = profileDisplayName || ((user?.user_metadata?.full_name as string | undefined) ?? "");
  const avatarUrl = profileAvatarUrl || ((user?.user_metadata?.avatar_url as string | undefined) ?? "");
  const email = user?.email ?? "";
  const initials = getInitials(displayName, email);

  return (
    <div className="flex min-h-screen">
      {role !== "learner" && <AppSidebar />}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-2">
              {role && <Badge variant="outline" className="uppercase text-xs">{role}</Badge>}

              {/* Comms shortcuts — visible for all roles */}
              {role && (
                <>
                  {/* Announcements / Bell */}
                  <Link
                    to="/communications"
                    className={`relative p-2 rounded-lg transition-colors ${
                      location.pathname === "/communications" && !location.search.includes("messages")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                    title="Updates & Announcements"
                  >
                    <Bell size={16} />
                    {announcementCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                        {announcementCount > 9 ? "9+" : announcementCount}
                      </span>
                    )}
                  </Link>

                  {/* Messages / Mail */}
                  <Link
                    to="/communications?tab=messages"
                    className={`relative p-2 rounded-lg transition-colors ${
                      location.pathname === "/communications" && location.search.includes("messages")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                    title="Messages"
                  >
                    <Mail size={16} />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                        {unreadMessages > 9 ? "9+" : unreadMessages}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-auto py-1.5 px-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl} alt={displayName || email} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-xs font-medium leading-tight">{displayName || "My Profile"}</p>
                        <p className="text-[11px] text-muted-foreground leading-tight">{email}</p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{displayName || "My Profile"}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-8 animate-fade-in">{children}</div>
      </main>

      {/* ── Remote-launched presentation overlay ──────────────────────────── */}
      {remoteLaunch && (
        <PresentationMode
          module={remoteLaunch.module}
          mode={remoteLaunch.mode}
          isAdmin={true}
          initialSessionCode={remoteLaunch.sessionCode}
          nextUnitId={remoteLaunch.nextUnitId}
          nextUnitTitle={remoteLaunch.nextUnitTitle}
          onClose={() => setRemoteLaunch(null)}
        />
      )}
    </div>
  );
}
