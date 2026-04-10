import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LearnerSidebar from "./LearnerSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useUnreadCount } from "@/hooks/useUnreadCount";

interface LearnerLayoutProps {
  children: ReactNode;
}

const getInitials = (name: string, email: string) => {
  const source = name || email;
  if (!source) return "U";
  return source.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "U";
};

export default function LearnerLayout({ children }: LearnerLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const { items: announcements } = useAnnouncements();
  const unreadMessages = useUnreadCount(user?.id ?? null);
  const announcementCount = announcements.filter((a) => a.audience !== "Admin Only").length;

  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? "";
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? "";
  const email = user?.email ?? "";
  const initials = getInitials(displayName, email);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <LearnerSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border h-14 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>

            <div className="flex items-center gap-2">
              {/* Announcements */}
              <Link
                to="/communications"
                className={`relative p-2 rounded-lg transition-colors ${
                  location.pathname === "/communications" && !location.search.includes("messages")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
                title="Updates"
              >
                <Bell size={16} />
                {announcementCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                    {announcementCount > 9 ? "9+" : announcementCount}
                  </span>
                )}
              </Link>

              {/* Messages */}
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

              {/* Avatar */}
              <Link to="/profile" className="ml-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={displayName || email} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
