import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

function PublicRoute() {
    const { isAuthenticated, loading } = useAuthStore();

    if(loading) {
        return (
            <div className="h-dvh w-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if(isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}

export default PublicRoute;
