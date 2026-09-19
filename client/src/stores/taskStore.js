import { create } from 'zustand';
import api from '../lib/api';

const useTaskStore = create((set) => ({
    tasks: null,
    isLoading: false,
    error: null,

    fetchTasks: async(workspaceId, projectId) => {
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
    }
}));

export default useTaskStore;