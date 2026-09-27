import { create } from "zustand";
import api from "../lib/api";

const useAIPlanStore = create(set => ({
    allAIPlans: [],
    isLoading: false,
    error: null,
    
    fetchAllPlans: async (workspaceId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`workspaces/${workspaceId}/aiPlans`);
            set({
                allAIPlans: response?.data?.aiPlans,
                isLoading: false,
                error: null,
            });

            return response.data;

        } catch (error) {
            console.log(error.response);
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to fetch AI plans. Try again.",
            });

            throw error;
        }
    }
}));

export default useAIPlanStore;