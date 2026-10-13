import { useEffect } from "react";
import useAuthStore from "./stores/authStore";
import useWorkspaceStore from "./stores/workspaceStore";
import useThemeStore from "./stores/themeStore";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { fetchWorkspaces } = useWorkspaceStore();
  const { initializeTheme } = useThemeStore();
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

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
