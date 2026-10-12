
import { create } from "zustand";
import api from "../lib/api";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get("/notifications");

      set({
        notifications: response.data.notifications || [],
        unreadCount: response.data.unreadCount || 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch notifications.",
        isLoading: false,
      });
      console.log(error.response);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    const notification = get().notifications.find(
      (item) => item._id === notificationId
    );

    if (!notification || notification.isRead) return;

    try {
      await api.patch(`/notifications/${notificationId}/read`);

      set((state) => ({
        notifications: state.notifications.map((item) =>
          item._id === notificationId
            ? { ...item, isRead: true }
            : item
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to mark notification as read.",
      });
      console.log(error.response);
      throw error;
    }
  },

  markAllAsRead: async () => {
    if (get().unreadCount === 0) return;

    try {
      await api.patch("/notifications/read-all");

      set((state) => ({
        notifications: state.notifications.map((item) => ({
          ...item,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to mark all notifications as read.",
      });
      console.log(error.response);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useNotificationStore;
