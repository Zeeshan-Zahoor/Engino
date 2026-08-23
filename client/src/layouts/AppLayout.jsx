import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex">
        <Sidebar />

        <main className="flex-1">
            <Outlet />
        </main>
    </div>
  )
}

export default AppLayout;