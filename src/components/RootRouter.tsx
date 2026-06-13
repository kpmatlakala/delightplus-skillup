// src/components/RootRouter.tsx
import { useAuth } from "@/hooks/useAuth";
import LandingPage from "@/pages/Home/LandingPage";
import Index from "@/pages/Index";

const RootRouter = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // If user is logged in and has admin/lecturer/moderator role, show dashboard
    if (user && ['admin', 'lecturer', 'moderator'].includes(user.role)) {
        return <Index />;
    }

    // Otherwise show public landing page
    return <LandingPage />;
};

export default RootRouter;