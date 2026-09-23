import { create } from 'zustand';
import api from '../lib/api';

const useTaskStore = create((set) => ({
    tasks: null,
    isLoading: false,
    error: null,

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
    }
}));

export default useTaskStore;