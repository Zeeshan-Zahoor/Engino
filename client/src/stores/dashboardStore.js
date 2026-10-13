import { create } from "zustand";
import api from "../lib/api";

const useDashboardStore = create((set) => ({
  insights: [],
  isLoading: false,
  error: null,
  insightsFetched: false,

  fetchInsights: async (workspaceId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await api.get(
        `/workspaces/${workspaceId}/insights`
      );

      set({
        insights: response.data.insights || [],
        isLoading: false,
        error: null,
        insightsFetched: true,
      });

      return response.data;
    } catch (error) {
      set({
        insights: [],
        isLoading: false,
        error:
          error.response?.data?.message ||
          "Failed to load dashboard insights.",
        insightsFetched: true,
      });
      console.log(error.response);
      throw error;
    }
  },
}));

export default useDashboardStore;
