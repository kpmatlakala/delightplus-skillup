import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mail, Menu, X } from "lucide-react";
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
import { useModuleFlow } from "@/hooks/useModuleFlow";
import type { Module } from "@/types/course";
import {
  EV_LAUNCH,
  LAUNCHER_CHANNEL,
  type LaunchPayload,
} from "@/lib/presentationSync";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

// Mobile navigation for learner portal
const MobileNav = ({ role, announcements, unreadMessages }: { role: string | null; announcements: any[]; unreadMessages: number }) => {
  const [open, setOpen] = useState(false);
  
  if (role !== "learner") return null;
  
  const announcementCount = announcements.filter((a) => a.audience !== "Admin Only").length;
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <img
              src="/logos/dsa-logo.png"
              alt="DSA"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/learner"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/learner/modules"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              My Modules
            </Link>
            <Link
              to="/communications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <span className="flex items-center gap-3">
                <Bell className="h-4 w-4" />
                Announcements
              </span>
              {announcementCount > 0 && (
                <Badge variant="destructive" className="h-5 px-1 text-xs">
                  {announcementCount}
                </Badge>
              )}
            </Link>
            <Link
              to="/communications?tab=messages"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <span className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                Messages
              </span>
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="h-5 px-1 text-xs">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </Badge>
              )}
            </Link>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              Profile
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const { items: announcements } = useAnnouncements();
  const announcementCount = role === "learner"
    ? announcements.filter((a) => a.audience !== "Admin Only").length
    : announcements.length;
  const unreadMessages = useUnreadCount(user?.id ?? null);

  const [remoteLaunch, setRemoteLaunch] = useState<RemoteLaunch | null>(null);
  const remoteModuleId = remoteLaunch?.mode === "module" ? remoteLaunch.moduleId : undefined;
  const { flow: remoteFlow } = useModuleFlow(remoteModuleId);

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
        const nextMod = allModules[modIndex + 1];
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

  const handleLaunchUnit = (unitId: string) => {
    const newMod = allModules.find((m) => m.id === unitId);
    if (!newMod || !remoteLaunch) return;
    const newIndex = allModules.findIndex((m) => m.id === unitId);
    const nextMod = allModules[newIndex + 1];
    setRemoteLaunch({
      moduleId: unitId,
      sessionCode: remoteLaunch.sessionCode,
      module: newMod,
      mode: "module",
      nextUnitId: nextMod?.id,
      nextUnitTitle: nextMod?.title,
    });
  };

  const displayName = profileDisplayName || ((user?.user_metadata?.full_name as string | undefined) ?? "");
  const avatarUrl = profileAvatarUrl || ((user?.user_metadata?.avatar_url as string | undefined) ?? "");
  const email = user?.email ?? "";
  const initials = getInitials(displayName, email);
  const isLearnerRoute = role === "learner" && location.pathname.startsWith("/learner");

  return (
    <div className="flex min-h-screen">
      {role !== "learner" && <AppSidebar />}
      <main className="flex-1 min-w-0">
        <header
          className={`sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-all ${
            isLearnerRoute 
              ? "px-3 py-2 md:px-4 md:py-2.5 shadow-sm" 
              : "px-3 py-2 md:px-6 md:py-4"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Left section - Logo and Title */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isLearnerRoute && (
                <>
                  <MobileNav role={role} announcements={announcements} unreadMessages={unreadMessages} />
                  <img
                    src="/logos/dsa-logo.png"
                    alt="The Data Science Academy"
                    className="h-6 w-auto object-contain md:h-7"
                  />
                </>
              )}
              <div className="flex flex-col min-w-0">
                <h1 className={`font-display font-bold text-foreground truncate ${
                  isLearnerRoute ? "text-sm md:text-base" : "text-base md:text-xl"
                }`}>
                  {title}
                </h1>
                {subtitle && (
                  <p className={`text-muted-foreground truncate ${
                    isLearnerRoute ? "text-[11px] md:text-xs" : "text-xs md:text-sm"
                  }`}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              {/* Role badge - hide on learner mobile */}
              {role && !isLearnerRoute && (
                <Badge variant="outline" className="hidden sm:inline-flex uppercase text-xs">
                  {role}
                </Badge>
              )}
              
              {/* Comms icons - hide on learner mobile */}
              {role && !isLearnerRoute && (
                <>
                  <Link
                    to="/communications"
                    className={`relative p-1.5 md:p-2 rounded-lg transition-colors ${
                      location.pathname === "/communications" && !location.search.includes("messages")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                    title="Updates & Announcements"
                  >
                    <Bell className="h-4 w-4 md:h-4 md:w-4" />
                    {announcementCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                        {announcementCount > 9 ? "9+" : announcementCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/communications?tab=messages"
                    className={`relative p-1.5 md:p-2 rounded-lg transition-colors ${
                      location.pathname === "/communications" && location.search.includes("messages")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                    title="Messages"
                  >
                    <Mail className="h-4 w-4 md:h-4 md:w-4" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                        {unreadMessages > 9 ? "9+" : unreadMessages}
                      </span>
                    )}
                  </Link>
                </>
              )}
              
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`hover:bg-secondary/80 transition-colors ${
                      isLearnerRoute 
                        ? "h-8 px-1.5 md:px-2 gap-1.5" 
                        : "h-8 md:h-9 px-2 gap-2"
                    }`}
                  >
                    <Avatar className={`${isLearnerRoute ? "h-7 w-7" : "h-7 w-7 md:h-8 md:w-8"}`}>
                      <AvatarImage src={avatarUrl} alt={displayName || email} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    {!isLearnerRoute && (
                      <div className="hidden sm:block text-left">
                        <p className="text-xs font-medium leading-tight line-clamp-1 max-w-[120px]">
                          {displayName || "My Profile"}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight truncate max-w-[120px]">
                          {email}
                        </p>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium truncate">{displayName || "My Profile"}</p>
                    <p className="text-xs text-muted-foreground truncate">{email}</p>
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
        <div className={`p-3 md:p-6 animate-fade-in ${isLearnerRoute ? "max-w-7xl mx-auto" : ""}`}>
          {children}
        </div>
      </main>

      {remoteLaunch && (
        <PresentationMode
          module={remoteLaunch.module}
          flow={remoteFlow}
          mode={remoteLaunch.mode}
          isAdmin={true}
          initialSessionCode={remoteLaunch.sessionCode}
          nextUnitId={remoteLaunch.nextUnitId}
          nextUnitTitle={remoteLaunch.nextUnitTitle}
          onLaunchUnit={handleLaunchUnit}
          onClose={() => setRemoteLaunch(null)}
        />
      )}
    </div>
  );
}