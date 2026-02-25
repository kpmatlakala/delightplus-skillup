import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");

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
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-2">
              {role && <Badge variant="outline" className="uppercase text-xs">{role}</Badge>}

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
    </div>
  );
}
