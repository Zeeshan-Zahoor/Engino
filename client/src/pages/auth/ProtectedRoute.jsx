import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../stores/authStore";


function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuthStore();

  if(loading) {
    return (
            <div className="h-screen w-screen flex items-center justify-center">
                Loading...
            </div>
        );
  }

  if(!isAuthenticated) {
    return <Navigate to="/login" replace/>
  }

  return <Outlet />;
}

export default ProtectedRoute
