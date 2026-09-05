import { LogOut } from "lucide-react";
import { adminNavigation } from "../../config/navigation";
import { NavLink } from "react-router-dom";
import LogoutConfirmModal from "../common/LogoutConfirmationModal";
import { useState } from "react";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import WorkspaceSwitcher from "../common/WorkspaceSwitcher";

function Sidebar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setError("");
    setLoading(true);
    try {
      await logout();
      setIsModalOpen(false);
      navigate('/login');

    } catch (error) {
      setError(error.response?.data?.message || "Failed to log out. Try Again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-primary">Engino</h1>
      </div>

      {/* Workspace Switcher*/}
      <WorkspaceSwitcher />

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Workspace
        </p>

        <div className="space-y-1">
          {adminNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="flex justify-between items-center border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
            ZZ
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              Zeeshan Zahoor
            </p>

            <p className="text-xs text-text-secondary">Admin</p>
          </div>
        </div>

        <div
          role="button"
          onClick={() => setIsModalOpen(true)}
          className="text-primary cursor-pointer h-8 w-8 rounded-l hover:bg-surface flex justify-center items-center">
          <LogOut size={18} strokeWidth={2}  />
        </div>
      </div>

      <LogoutConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={loading}
        error={error}
      />
    </aside>
  );
}

export default Sidebar;