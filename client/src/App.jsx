import { useEffect } from "react";
import useAuthStore from "./stores/authStore";
import useWorkspaceStore from "./stores/workspaceStore";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { fetchWorkspaces } = useWorkspaceStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    }
  }, [isAuthenticated, fetchWorkspaces]);

  return <RouterProvider router={router}/>
}

export default App;