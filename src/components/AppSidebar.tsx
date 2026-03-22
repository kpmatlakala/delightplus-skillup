import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  Cast,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard",      icon: <LayoutDashboard size={18} />, href: "/" },
  {
    label: "Academics",
    icon: <GraduationCap size={18} />,
    children: [
      { label: "Learners",     href: "/learners",     icon: <Users         size={16} /> },
      { label: "Programs",     href: "/programs",     icon: <BookOpen      size={16} /> },
      { label: "Modules",      href: "/modules",      icon: <ClipboardList size={16} /> },
      { label: "Lesson Plans", href: "/lesson-plans", icon: <FileText      size={16} /> },
    ],
  },
  { label: "Communications", icon: <MessageSquare size={18} />, href: "/communications" },
  { label: "Portfolio (PoE)", icon: <FolderOpen    size={18} />, href: "/poe" },
  { label: "Assessments",        icon: <ClipboardList size={18} />, href: "/assessments" },
  { label: "Block Assessments", icon: <ShieldCheck   size={18} />, href: "/assessments/blocks" },
  { label: "Compliance",        icon: <ShieldCheck   size={18} />, href: "/compliance" },
  { label: "Remote Launch",     icon: <Cast          size={18} />, href: "/present/launch" },
];

const learnerNavItems: NavItem[] = [
  { label: "Learner Portal",  icon: <LayoutDashboard size={18} />, href: "/learner" },
  { label: "Portfolio (PoE)", icon: <FolderOpen      size={18} />, href: "/poe" },
];

export default function AppSidebar() {
  const { role } = useAuth();
  const location = useLocation();
  const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>({ Academics: true });
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [collapsed, setCollapsed]         = useState(false);

  const items    = role === "learner" ? learnerNavItems : navItems;
  const isActive = (href: string) => location.pathname === href;

  const toggleGroup = (label: string) =>
    setGroupExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  /* ── reusable nav link ─────────────────────────────────────────── */
  const NavLink = ({
    href,
    icon,
    label,
    isChild = false,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
    isChild?: boolean;
  }) => {
    const active = isActive(href);
    return (
      <Link
        to={href}
        title={collapsed ? label : undefined}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center rounded-md transition-colors text-sm
          ${collapsed
            ? "justify-center py-2.5 mx-1 px-0"
            : isChild
              ? "gap-2.5 px-3 py-1.5"
              : "gap-2.5 px-3 py-2"}
          ${active
            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
            : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
      >
        <span className="shrink-0">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    );
  };

  /* ── sidebar body ──────────────────────────────────────────────── */
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Logo */}
      <div
        className={`border-b border-sidebar-border transition-all duration-200
          ${collapsed ? "flex items-center justify-center py-5" : "px-5 py-5"}`}
      >
        {collapsed ? (
          <img src="/logos/dsa-logo.png" alt="DSA" className="h-8 w-8 rounded-sm object-contain" />
        ) : (
          <div className="flex items-center gap-3">
            <img src="/logos/dsa-logo.png" alt="DSA" className="h-9 w-9 rounded-sm object-contain" />
            <div>
              <h1 className="font-display text-lg font-bold text-sidebar-primary-foreground tracking-tight">
                DSA<span className="text-sidebar-primary"> LMS</span>
              </h1>
              <p className="text-xs text-sidebar-muted mt-0.5">
                {role === "learner" ? "Learner Portal" : "Learning Management System"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {items.map((item) =>
          item.children ? (
            <div key={item.label}>
              {collapsed ? (
                /* icon-only mode: divider + child icons with tooltips */
                <div className="py-1">
                  <div title={item.label} className="flex justify-center py-1">
                    <span className="h-px w-7 bg-sidebar-border" />
                  </div>
                  {item.children.map((child) => (
                    <NavLink key={child.href} href={child.href} icon={child.icon} label={child.label} isChild />
                  ))}
                </div>
              ) : (
                /* expanded mode: collapsible group */
                <div>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      {item.icon}
                      {item.label}
                    </span>
                    {groupExpanded[item.label]
                      ? <ChevronDown  size={14} />
                      : <ChevronRight size={14} />}
                  </button>
                  {groupExpanded[item.label] && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                      {item.children.map((child) => (
                        <NavLink key={child.href} href={child.href} icon={child.icon} label={child.label} isChild />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <NavLink key={item.href} href={item.href!} icon={item.icon} label={item.label} />
          )
        )}
      </nav>

      {/* Footer — only shown when expanded */}
      {!collapsed && (
        <div className="px-5 py-3 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-muted">Data Science Academy</p>
          <p className="text-xs text-sidebar-muted mt-0.5">
            {role === "learner" ? "Learner Access" : "Multi-Program LMS · Block 1–3"}
          </p>
          <a
            href="https://thedatascienceacademy.co.za/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-sidebar-muted mt-1 inline-block hover:text-sidebar-foreground"
          >
            thedatascienceacademy.co.za
          </a>
        </div>
      )}

      {/* Collapse / expand toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`flex items-center border-t border-sidebar-border py-3 text-sidebar-muted
          hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-xs font-medium
          ${collapsed ? "justify-center" : "gap-2 px-5"}`}
      >
        {collapsed
          ? <ChevronsRight size={16} />
          : <><ChevronsLeft size={16} /><span>Collapse</span></>
        }
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground md:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — width animates between icon-only (60 px) and full (224 px) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen sidebar-gradient flex-shrink-0
          transition-all duration-200 ease-in-out
          ${collapsed ? "w-[60px]" : "w-56"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
