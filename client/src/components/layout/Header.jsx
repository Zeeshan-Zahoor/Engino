import { Bell, SunIcon, MoonIcon, ArrowLeft, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../utils/Avatar";
import { useEffect, useRef, useState } from "react";
import useNotificationStore from "../../stores/notificationStore";
import useThemeStore from "../../stores/themeStore";

export function HeaderUtilities({ user, className = "", fetchOnMount = true }) {
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
    if (fetchOnMount) {
      fetchNotifications();
    }
  }, [fetchNotifications, fetchOnMount]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
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
  };

  

return (
  <div className={`flex items-center gap-1 sm:gap-3 lg:gap-4 ${className}`}>
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
        <div
          className="
            fixed inset-x-3 top-16 z-50
            max-h-[calc(100dvh-5rem)] overflow-hidden
            rounded-xl border border-border bg-card shadow-lg
            sm:inset-x-auto sm:right-4
            sm:w-[min(24rem,calc(100vw-2rem))]
            lg:absolute lg:inset-x-auto lg:right-0 lg:top-12
            lg:max-h-none lg:w-96
          "
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-text-primary">
                Notifications
              </h3>
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
                className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-surface lg:max-h-[calc(100dvh-8rem)]">
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
                  className={`flex w-full min-w-0 gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface ${
                    !notification.isRead
                      ? "bg-info-surface/60"
                      : "bg-card"
                  }`}
                >
                  <div className="m-1 h-7 w-7 shrink-0">
                    <Avatar user={notification.actor} />
                  </div>

                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm text-text-primary">
                      {notification.message}
                    </span>

                    <span className="mt-1 block break-words text-xs text-text-secondary">
                      {notification.projectId?.name || "Project"} ·{" "}
                      {notification.taskId?.title || "Task"}
                    </span>

                    <span className="mt-1 block break-words text-xs text-text-secondary">
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

    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
    >
      {theme === "light" ? (
        <SunIcon size={19} strokeWidth={1.8} />
      ) : (
        <MoonIcon size={19} strokeWidth={1.8} />
      )}
    </button>

    <button
      type="button"
      className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
        <Avatar user={user} />
      </div>
    </button>
  </div>
);


}

function Header({ title, description, showBack = false, user }) {
  const navigate = useNavigate();

  return (
    <header className="m-0 bg-background py-3 lg:flex lg:min-h-20 lg:items-center lg:justify-between lg:gap-3 lg:py-0">
      <div className="flex w-full min-w-0 flex-1 items-start gap-2 sm:gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-surface">
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-semibold text-text-primary">{title}</h1>
          <p className="mt-1 break-words text-sm text-text-secondary lg:line-clamp-2">{description}</p>
        </div>
      </div>

      <HeaderUtilities user={user} fetchOnMount={false} className="hidden lg:flex" />
    </header>
  );
}

export default Header;
