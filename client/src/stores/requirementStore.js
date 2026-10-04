import { create } from "zustand";
import api from "../lib/api";

const useRequirementStore = create((set) => ({
    isLoading: false,
    error: null,
    requirements: [],
    workspaceRequirements: [],
    requirementsProjectId: null,
    currentRequirement: null,

    fetchWorkspaceRequirements: async (workspaceId) => {
        set({ isLoading: true, error: null, workspaceRequirements: [] });
        try {
            const response = await api.get(`workspaces/${workspaceId}/requirements`);
            set({
                isLoading: false,
                error: null,
                workspaceRequirements: response?.data?.requirements,
            });

            return response.data;
            
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch workspace requirements.",
                isLoading: false,
            });
            console.log(error.response);
            throw error;
        }
    },

    fetchRequirements: async (workspaceId, projectId) => {
        set({
            isLoading: true,
            error: null,
            currentRequirement: null,
            requirements: [],
            requirementsProjectId: null,
        });

        try {
            const response = await api.get(`workspaces/${workspaceId}/projects/${projectId}/requirements`);

            set(({
                isLoading: false,
                requirements: response.data.requirements,
                requirementsProjectId: projectId,
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
                    aiTasks: response.data.aiTasks || [],
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
    },

    approvePlan: async (workspaceId, projectId, requirementId, plan) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.patch(
                `workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}/ai/plan/review`,
                { plan }
            );

            set({ isLoading: false, error: null });

            return response.data;

        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to approve AI plan. Try again.",
            });

            console.log(error.response)
            throw error;
        }
    },

    generateAiTasks: async (workspaceId, projectId, requirementId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(
                `workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}/ai/generate`
            );

            set({ isLoading: false, error: null });
            return response.data;

        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error generating ai tasks. Try again.",
            });

            console.log(error.response);
            throw error;
        }
    },

    extractRequirement: async (workspaceId, prompt) => {
        set({isLoading: true, error: null});

        try {
            const response = await api.post(`workspaces/${workspaceId}/ai/extract-requirement`, { prompt });

            set({
                isLoading: false,
                error: null,
            })

            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to extract requirement. Try again.",
            });
            console.log(error.response)
            throw error;
        }
    },

    fetchAIConversation: async (workspaceId, projectId, requirementId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get(
                `workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}/ai/conversation`
            );

            set({
                isLoading: false,
                error: null,
            });

            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch AI conversation.",
            });
            console.log(error.response)
            throw error;
        }
    },

    updateRequirement: async (workspaceId, projectId, requirementId, requirementData) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.patch(
                `workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}`,
                requirementData
            );

            set((state) => ({
                isLoading: false,
                error: null,
                requirements: state.requirements.map((requirement) =>
                    requirement._id === requirementId
                        ? {
                            ...requirement,
                            ...response.data.requirement,
                        }
                        : requirement
                ),
                workspaceRequirements: state.workspaceRequirements.map(
                    (requirement) =>
                        requirement._id === requirementId
                            ? {
                                ...requirement,
                                ...response.data.requirement,
                            }
                            : requirement
                ),
            }));

            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to update requirement. Try again.",
            });
            console.log(error.response);
            throw error;
        }
    },

    deleteRequirement: async (workspaceId, projectId, requirementId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.delete(`workspaces/${workspaceId}/projects/${projectId}/requirements/${requirementId}`);

            set(state => ({
                isLoading: false,
                error: null,
                requirements: state.requirements.filter(requirement => requirement._id !== requirementId),
            }));

            return response.data;
            
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to delete requirement. Try again.",
            });
            console.log(error.response);
            throw error;
        }
    }
}));

export default useRequirementStore;
