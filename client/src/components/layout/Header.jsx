import { Bell, SunIcon, MoonIcon, ArrowLeft, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../utils/Avatar";
import { useEffect, useRef, useState } from "react";
import useNotificationStore from "../../stores/notificationStore";
import useThemeStore from "../../stores/themeStore";

function Header({
  title,
  description,
  showBack = false,
  user,
}) {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearError,
  } = useNotificationStore();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markAsRead(notification._id);
      }
      setIsNotificationsOpen(false);
      if (notification.projectId?._id && notification.taskId?._id) {
        navigate(`/tasks/?taskId=${notification.taskId._id}`);
      }
    } catch {
      // store already records the error.
    }
  }

  return (
    <header className="flex h-20 items-center justify-between bg-background m-0">
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
        
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((open) => !open);
              clearError();
            }}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={isNotificationsOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
          >
            <Bell size={19} strokeWidth={1.8} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg sm:w-96">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <h3 className="font-semibold text-text-primary">Notifications</h3>
                  <p className="text-xs text-text-secondary">
                    {unreadCount} unread
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await markAllAsRead();
                      } catch {
                        // The store records the error.
                      }
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-surface">
                {isLoading ? (
                  <p className="p-6 text-center text-sm text-text-secondary">
                    Loading notifications...
                  </p>
                ) : error ? (
                  <div className="p-5 text-center">
                    <p className="text-sm text-danger">{error}</p>
                    <button
                      type="button"
                      onClick={fetchNotifications}
                      className="mt-2 text-sm font-medium text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="p-6 text-center text-sm text-text-secondary">
                    You're all caught up. No notifications yet.
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex w-full gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface ${
                        !notification.isRead ? "bg-info-surface/60" : "bg-card"
                      }`}
                    >
                      <div className="h-7 w-7 m-1">
                        <Avatar user={notification.actor}/>
                      </div>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-text-primary">
                          {notification.message}
                        </span>

                        <span className="mt-1 block text-xs text-text-secondary">
                          {notification.projectId?.name || "Project"} ·{" "}
                          {notification.taskId?.title || "Task"}
                        </span>

                        <span className="mt-1 block text-xs text-text-secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>


        {/* Theme */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
        >
          {theme === "light" ? (
            <SunIcon size={19} strokeWidth={1.8} />
          ) : (
            <MoonIcon size={19} strokeWidth={1.8}/>
          )}
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
            <Avatar user={user}/>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;
