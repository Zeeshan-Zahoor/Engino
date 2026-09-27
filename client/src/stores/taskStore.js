import { create } from 'zustand';
import api from '../lib/api';

const useTaskStore = create((set) => ({
    tasks: [],
    allTasks: [],
    isLoading: false,
    error: null,

    fetchAllTasks: async (workspaceId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`workspaces/${workspaceId}/allTasks`);

            set({
                allTasks: response.data.allTasks,
                isLoading: false,
                error: null,
            });

            return response.data;

        } catch (error) {
            console.log(error.response);
            set({
                error: error.response?.data?.message || "Failed to fetch all tasks. Try Again.",
            });

            throw error;
        }
    },

    fetchTasks: async (workspaceId, projectId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`workspaces/${workspaceId}/projects/${projectId}/tasks`);

            set({
                tasks: response.data.tasks,
                isLoading: false,
                error: null,
            });

            return response.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch tasks. Try Again.",
            });

            throw error;
        }
    },

    createTask: async (workspaceId, projectId, taskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(
                `workspaces/${workspaceId}/projects/${projectId}/tasks`,
                taskData,
            );

            set(state => ({
                isLoading: false,
                error: null,
                tasks: [state.tasks, response.data.task],
            }));

            return response.data;

        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to create task. Try again.",
            });

            console.log(error.response);
            throw error;
        }
    },

    updateTask: async (workspaceId, projectId, taskId, updatedTask) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.patch(
                `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, 
                updatedTask,
            );

            set(({
                isLoading: false,
                error: null,
            }));

            return response.data;

        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to update task. Try again.",
            });
            console.log(error.response);
            throw error;
        }
    },

    deleteTask: async (workspaceId, projectId, taskId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.delete(
                `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
            );

            set({
                isLoading: false,
                error: null,
            });

            return response.data;
            
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to delete task. Try again.",
            });
        }
    }
}));

export default useTaskStore;