import {
  LayoutDashboard,
  Compass,
  BookOpen,
  ShieldCheck,
  FolderOpen,
  Bell,
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

type NavItem = { title: string; url: string; icon: typeof LayoutDashboard };

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Learning",
    items: [
      { title: "Dashboard", url: "/learner", icon: LayoutDashboard },
      { title: "Catalog", url: "/learner/catalog", icon: Compass },
      { title: "My Modules", url: "/learner/modules", icon: BookOpen },
      { title: "Assessments", url: "/learner/assessments", icon: ShieldCheck },
      { title: "PoE", url: "/poe", icon: FolderOpen },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Updates", url: "/communications", icon: Bell },
      { title: "Messages", url: "/communications?tab=messages", icon: MessageSquare },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", url: "/profile", icon: User },
    ],
  },
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
    if (url === "/communications") {
      return location.pathname === "/communications" && !location.search.includes("messages");
    }
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
              TDSA Learning
            </span>
          )}
        </div>

        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={collapsed ? item.title : undefined}
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
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              tooltip={collapsed ? "Sign Out" : undefined}
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
