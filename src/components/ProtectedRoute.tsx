import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, role, loading } = useAuth();

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

  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Resolving your permissions...
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    if (role === "learner") {
      return <Navigate to="/learner" replace />;
    }
    return <Navigate to="/lmis" replace />;
  }

  return <Outlet />;
}
