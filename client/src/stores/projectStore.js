import { create } from 'zustand';
import api from '../lib/api';

const useProjectStore = create((set, get) => ({
    projects: [],
    activeProject: null,
    team: [],
    selectedProjectId: null,
    isLoading: false,
    error: null,

    selectProject: (projectId) => set({
        selectedProjectId: projectId,
    }),

    clearSelectedProject: () => set({
        selectedProjectId: null,
    }),

    fetchProject: async (workspaceId, projectId) => {
        set({ isLoading: true, error: null });

        try { 
            const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}`);

            set({
                isLoading: false,
                activeProject: response?.data?.project,
            });

            return response?.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Error fetching project. Try again.",
                isLoading: false,
            });

            console.log(error.response)

            throw error;
        }
    },

    fetchProjects: async (workspaceId) => {
        set({ isLoading: true, error: null });

        try { 
            const response = await api.get(`/workspaces/${workspaceId}/projects`);

            set({
                isLoading: false,
                projects: response?.data?.projects,
            });

            return response?.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Error fetching projects. Try again.",
                isLoading: false,
            });

            throw error;
        }

    },

    fetchProjectMembers: async (workspaceId, projectId) => {
        set({ isLoading: true, error: null });

        try { 
            const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/members`);

            set({
                isLoading: false,
                team: response?.data?.projectMembers,
            });

            return response?.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Error fetching project members. Try again.",
                isLoading: false,
            });

            throw error;
        }
    },

    addProject: async (workspaceId, projectData) => {
        set({ isLoading: true, error: null });
        try { 
            const response = await api.post(`/workspaces/${workspaceId}/projects`, projectData);

            await get().fetchProjects(workspaceId);
            set({ isLoading: false, error: null });

            return response?.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to add project. Try again.",
                isLoading: false,
            });

            throw error;
        }
    },

    updateProject: async (workspaceId, projectId, projectData) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.put(
                `/workspaces/${workspaceId}/projects/${projectId}`,
                projectData
            );

            const updatedProject = response.data.updatedProject;

            await get().fetchProjects(workspaceId);
            await get().fetchProject(workspaceId, projectId);

            set((state) => ({
                projects: state.projects.map((project) =>
                    project._id === projectId
                        ? { ...project, ...updatedProject }
                        : project
                ),
                activeProject:
                state.activeProject?._id === projectId
                    ? { ...state.activeProject, ...updatedProject }
                    : state.activeProject,
                    
                isLoading: false,
            }));

            return response.data;
        } catch (error) {
            set({
                error:
                    error.response?.data?.message ||
                    "Failed to update project. Try again.",
                isLoading: false,
            });

            throw error;
        }
    },
    
}));


export default useProjectStore;
