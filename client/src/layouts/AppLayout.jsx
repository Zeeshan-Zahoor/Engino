import Sidebar from "../components/layout/Sidebar";
import { HeaderUtilities } from "../components/layout/Header";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";

function AppLayout() {
  const { user } = useAuthStore();
  const [sidebarOpenPath, setSidebarOpenPath] = useState(null);
  const location = useLocation();
  const isSidebarOpen = sidebarOpenPath === location.pathname;

  const closeSidebar = () => setSidebarOpenPath(null);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen w-screen min-w-0 overflow-hidden bg-background">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}

        <main className="min-w-0 flex-1 h-full overflow-y-auto pb-4">
            <div className="mx-auto w-full max-w-[1800px]">
                <div className="flex items-center justify-between border-b border-border px-4 py-2 lg:hidden">
                  <button
                    type="button"
                    aria-label="Open navigation menu"
                    aria-expanded={isSidebarOpen}
                    aria-controls="authenticated-navigation"
                    onClick={() => setSidebarOpenPath(location.pathname)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <Menu size={22} strokeWidth={2} />
                  </button>

                  <HeaderUtilities user={user} />
                </div>

                <Outlet />
            </div>
        </main>
    </div>
  )
}

export default AppLayout;
