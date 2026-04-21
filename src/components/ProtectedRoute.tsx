import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading portal...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  // LMS-only branch: all authenticated users go to the learner portal,
  // regardless of their role on other systems (e.g. LMIS admin/lecturer).
  if (allowedRoles && allowedRoles.length > 0) {
    return <Navigate to="/learner" replace />;
  }

  return <Outlet />;
}
