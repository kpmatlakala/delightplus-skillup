import { Outlet } from "react-router-dom";
import LearnerLayout from "@/learner/components/LearnerLayout";

export default function LearnerRoot() {
  return (
    <LearnerLayout>
      <Outlet />
    </LearnerLayout>
  );
}
