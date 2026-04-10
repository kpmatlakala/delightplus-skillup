import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  FolderOpen,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/learner", icon: LayoutDashboard },
  { title: "My Modules", url: "/learner/modules", icon: BookOpen },
  { title: "Assessments", url: "/learner/assessments", icon: ShieldCheck },
  { title: "PoE", url: "/poe", icon: FolderOpen },
  { title: "Messages", url: "/communications?tab=messages", icon: MessageSquare },
  { title: "Profile", url: "/profile", icon: User },
];

export default function LearnerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (url: string) => {
    if (url.includes("?")) {
      const [path, query] = url.split("?");
      return location.pathname === path && location.search.includes(query);
    }
    // Exact match for dashboard, prefix for others
    if (url === "/learner") return location.pathname === "/learner";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4">
          <img
            src="/logos/dsa-logo.png"
            alt="DSA"
            className="h-8 w-8 object-contain shrink-0"
          />
          {!collapsed && (
            <span className="font-display text-sm font-bold text-sidebar-foreground truncate">
              CET Connect
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Learning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/learner"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
