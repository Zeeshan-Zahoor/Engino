import { create } from 'zustand';
import api from '../lib/api';

const useProjectStore = create((set, get) => ({
    projects: [],
    selectedProjectId: null,
    isLoading: false,
    error: null,

    selectProject: (projectId) => set({
        selectedProjectId: projectId,
    }),

    clearSelectedProject: () => set({
        selectedProjectId: null,
    }),

    addProject: async (workspaceId, projectData) => {
        set({ isLoading: true, error: null });
        const { projects } =  get();
        try { 
            const response = await api.post(`/workspaces/${workspaceId}/projects`, projectData);

            set({
                isLoading: false,
                projects: [...projects, response?.data?.newProject],
            });

            return response?.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to add project. Try again.",
                isLoading: false,
            });

            throw error;
        }
    },
    
}));


export default useProjectStore;