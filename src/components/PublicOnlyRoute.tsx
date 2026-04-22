import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PublicOnlyRoute() {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading portal...
      </div>
    );
  }

  if (!session) {
    return <Outlet />;
  }

  if (role === "learner" || role === "user") {
    return <Navigate to="/learner" replace />;
  }

  return <Navigate to="/" replace />;
}
