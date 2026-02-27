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
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/" },
  {
    label: "Academics",
    icon: <GraduationCap size={18} />,
    children: [
      { label: "Learners", href: "/learners", icon: <Users size={16} /> },
      { label: "Programs", href: "/programs", icon: <BookOpen size={16} /> },
      { label: "Modules", href: "/modules", icon: <ClipboardList size={16} /> },
      { label: "Lesson Plans", href: "/lesson-plans", icon: <FileText size={16} /> },
    ],
  },
  { label: "Communications", icon: <MessageSquare size={18} />, href: "/communications" },
  { label: "Assessments", icon: <ClipboardList size={18} />, href: "/assessments" },
  { label: "Compliance", icon: <ShieldCheck size={18} />, href: "/compliance" },
];

const learnerNavItems: NavItem[] = [
  { label: "Learner Portal", icon: <LayoutDashboard size={18} />, href: "/learner" },
];

export default function AppSidebar() {
  const { role } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Academics: true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = role === "learner" ? learnerNavItems : navItems;

  const toggleSection = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => location.pathname === href;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <h1 className="font-display text-lg font-bold text-sidebar-primary-foreground tracking-tight">
          DSA<span className="text-sidebar-primary"> Tracker</span>
        </h1>
        <p className="text-xs text-sidebar-muted mt-0.5">
          {role === "learner" ? "Learner Portal" : "Course Management System"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => toggleSection(item.label)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
                {expanded[item.label] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {expanded[item.label] && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                        isActive(child.href)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      {child.icon}
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.href}
              to={item.href!}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive(item.href!)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-muted">
          <p>SAQA 78965 • NQF Level 4</p>
          <p className="mt-0.5">{role === "learner" ? "Learner Access" : "CET Venda • Block 1–3"}</p>
        </div>
      </div>
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

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 sidebar-gradient transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
