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

    fetchRequirement: async (workspaceId, projectId, requirementId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get(`workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}`);

            set({
                currentRequirement: {
                    ...response.data.requirement,
                    aiPlan: response.data.aiPlan || null,
                },
                isLoading: false,
                error: null,
            });

            return response.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch requirement. Try again.",
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
    },

    analyzeRequirement: async (workspaceId, projectId, requirementId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.post(`workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}/ai/analyze`);

            set({
                isLoading: false,
                error: null,
            });

            return response.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to       analyze requirement. Try again.",

                isLoading: false,
            });
            console.log("Error: ", error.response)

            throw error;
        }
    },

    clarifyRequirement: async (workspaceId, projectId, requirementId, answer) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.post(
                `workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}/ai/clarify`, 
                {
                    answer,
                }
            );
            
             set({
                isLoading: false,
            });

            return response.data;

        } catch (error) {
            set({
                error: 
                    error.response?.data?.message || "Failed to submit clarification. Try again.",
                isLoading: false,
            });

            console.log(error.response);

            throw error;
        }
    },

    generatePlan: async (workspaceId, projectId, requirementId) => {
        set ({ isLoading: true, error: null });

        try {
            const response = await api.post(`workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}/ai/plan`);
        
            set({ isLoading: false, error: null });

            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to generate AI plan. Try again.",
            });
            console.log(error.response)
            throw error;
        }
    }
}));

export default useRequirementStore;