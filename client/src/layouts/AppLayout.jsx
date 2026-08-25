import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="h-screen w-screen bg-background flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 h-full overflow-y-auto pb-4">
            <div className="mx-auto w-full max-w-[1800px]">
                <Outlet />
            </div>
        </main>
    </div>
  )
}

export default AppLayout;