import { create } from "zustand";
import api from "../lib/api";

const useRequirementStore = create((set) => ({
    isLoading: false,
    error: null,
    requirements: [],
    currentRequirement: null,

    fetchRequirements: async (workspaceId, projectId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get(`workspaces/${workspaceId}/projects/${projectId}/requirements`);

            set(({
                isLoading: false,
                requirements: response.data.requirements,
            }));

        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch requirements. Try again.",
                isLoading: false,
            });

            throw error;
        }
    },

    createRequirement: async (workspaceId, projectId, requirementData) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.post(`workspaces/${workspaceId}/projects/${projectId}/requirements`, requirementData);

            set((state) => ({
                isLoading: false,
                requirements: [...state.requirements, response.data.requirement],
            }));

            return response.data;
        
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to create requirement. Try again.",
                isLoading: false,
            });

            throw error;
        }
    }
}));

export default useRequirementStore;