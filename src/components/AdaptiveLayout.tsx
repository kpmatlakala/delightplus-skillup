import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import LmisLayout from "@/lmis/components/LmisLayout";

interface AdaptiveLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * Picks LmisLayout for admin/lecturer, AppLayout for learner.
 * Used by shared pages (Profile, Communications, PoE) accessible to all roles.
 */
export default function AdaptiveLayout({ children, title, subtitle }: AdaptiveLayoutProps) {
  const { role } = useAuth();
  const Layout = role === "learner" ? AppLayout : LmisLayout;
  return <Layout title={title} subtitle={subtitle}>{children}</Layout>;
}
