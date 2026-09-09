import { create } from 'zustand';
import api from '../lib/api';

const useProjectStore = create((set, get) => ({
    projects: [],
    activeProject: null,
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
    
    addProjectMembers: async (workspaceId, projectId, members) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.post(
                `/workspaces/${workspaceId}/projects/${projectId}/members`,
                {
                    members,
                }
            );

            // Refresh project so team is immediately updated
            await get().fetchProject(workspaceId, projectId);

            set({
                isLoading: false,
                error: null,
            });

            return response.data;

        } catch (error) {
            set({
                error:
                    error.response?.data?.message ||
                    "Failed to add project members.",
                isLoading: false,
            });

            throw error;
        }
    },

    removeProjectMember: async (workspaceId, projectId, userId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/members/${userId}`);

            set((state) => ({
                activeProject:
                    state.activeProject?._id === projectId ?
                        {
                            ...state.activeProject,
                            team: state.activeProject.team?.filter(
                                member => member.userId?._id !== userId                                         
                            ),
                        }

                        : state.activeProject,
                isLoading: false,
                error: null,
            }));

            return response.data;

        } catch (error) {
            set({
                error: error.response?.data?.message ||
                    "Failed to remove project member. Try again.",
                isLoading: false,
            });

            throw error;
        }
    }
}));


export default useProjectStore;
