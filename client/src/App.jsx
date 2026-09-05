import { useEffect } from "react";
import useAuthStore from "./stores/authStore";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router}/>
}

export default App;