import { Bell, Search } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header({
  title,
  description,
  showBack = false,
}) {
  const navigate = useNavigate();
  return (
    <header className="flex h-20 items-center justify-between bg-white m-0">
      {/* Page Title */}
      <div className="flex gap-3">
        <div>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="flex justify-center items-center w-8 h-8 rounded hover:bg-surface"
            >
               <ArrowLeft size={22} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <div >
          <h1 className="text-2xl font-semibold text-text-primary">
            {title}
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            {description}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-64 rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
        >
          <Bell size={19} strokeWidth={1.8} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
            ZZ
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;
