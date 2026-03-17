import { ReactNode, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();

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
        <header
          className={`sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border ${
            isMobile ? "px-3 py-2" : "px-6 py-4 md:px-8"
          }`}
        >
          <div className={`flex ${isMobile ? "flex-row items-center justify-between gap-2" : "flex-col gap-3 md:flex-row md:items-center md:justify-between"}`}>
            <div>
              <h1 className={`font-display ${isMobile ? "text-lg" : "text-xl"} font-bold text-foreground`}>{title}</h1>
              {!isMobile && subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>

            <div className={`flex items-center ${isMobile ? "gap-1" : "gap-2"}`}>
              {role && <Badge variant="outline" className={`uppercase ${isMobile ? "text-[10px]" : "text-xs"}`}>{role}</Badge>}

              {/* Comms shortcuts — visible for all roles */}
              {role && (
                <>
                  {/* Announcements / Bell */}
                  <Link
                    to="/communications"
                    className={`relative rounded-lg transition-colors ${isMobile ? "p-1" : "p-2"} ${
                      location.pathname === "/communications" && !location.search.includes("messages")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                    title="Updates & Announcements"
                  >
                    <Bell size={isMobile ? 14 : 16} />
                    {announcementCount > 0 && (
                      <span className={`absolute -top-0.5 -right-0.5 min-w-[12px] h-[12px] rounded-full bg-accent text-accent-foreground ${isMobile ? "text-[8px]" : "text-[9px]"} font-bold flex items-center justify-center px-0.5 leading-none`}>
                        {announcementCount > 9 ? "9+" : announcementCount}
                      </span>
                    )}
                  </Link>

                  {/* Messages / Mail */}
                  <Link
                    to="/communications?tab=messages"
                    className={`relative rounded-lg transition-colors ${isMobile ? "p-1" : "p-2"} ${
                      location.pathname === "/communications" && location.search.includes("messages")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                    title="Messages"
                  >
                    <Mail size={isMobile ? 14 : 16} />
                    {unreadMessages > 0 && (
                      <span className={`absolute -top-0.5 -right-0.5 min-w-[12px] h-[12px] rounded-full bg-destructive text-destructive-foreground ${isMobile ? "text-[8px]" : "text-[9px]"} font-bold flex items-center justify-center px-0.5 leading-none`}>
                        {unreadMessages > 9 ? "9+" : unreadMessages}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={`h-auto ${isMobile ? "py-1 px-1" : "py-1.5 px-2"}`}>
                    <div className="flex items-center gap-1">
                      <Avatar className={isMobile ? "h-6 w-6" : "h-8 w-8"}>
                        <AvatarImage src={avatarUrl} alt={displayName || email} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      {!isMobile && (
                        <div className="hidden sm:block text-left">
                          <p className="text-xs font-medium leading-tight">{displayName || "My Profile"}</p>
                          <p className="text-[11px] text-muted-foreground leading-tight">{email}</p>
                        </div>
                      )}
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
        <div className={isMobile ? "p-2 animate-fade-in" : "p-6 md:p-8 animate-fade-in"}>{children}</div>
      </main>
    </div>
  );
}
