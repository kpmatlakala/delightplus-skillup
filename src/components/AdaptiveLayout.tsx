import { ReactNode } from "react";
import LearnerLayout from "@/learner/components/LearnerLayout";

interface AdaptiveLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * On the learner branch, every authenticated user is treated as a learner.
 * All shared pages (Profile, Communications, PoE) render inside LearnerLayout
 * regardless of the user's actual DB role. The LMIS shell is intentionally
 * not used here — it lives in a separate dedicated app.
 */
export default function AdaptiveLayout({ children, title: _title, subtitle: _subtitle }: AdaptiveLayoutProps) {
  return <LearnerLayout>{children}</LearnerLayout>;
}
