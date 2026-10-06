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

    fetchTask: async (workspaceId, projectId, taskId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);

            set({
                isLoading: false,
                error: null,
            });

            return response.data;

        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch task. Try Again.",
            });
            console.log(error.response);
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

            set((state) => ({
                isLoading: false,
                error: null,
                tasks: [...state.tasks, response.data.task],
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

            const updatedTaskData = response.data.updatedTask;

            set((state) => ({
                isLoading: false,
                error: null,

                tasks: state.tasks.map((task) => 
                    task._id === taskId ? updatedTaskData : task
                ),

                allTasks: state.allTasks.map((task) => 
                    task._id === taskId ? updatedTaskData : task
                ),
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

            set((state) => ({
                tasks: state.tasks.filter((task) => task._id !== taskId),
                allTasks: state.allTasks.filter((task) => task._id !== taskId),
                isLoading: false,
                error: null,
            }));

            return response.data;
            
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to delete task. Try again.",
            });
        }
    },

    claimTask: async (workspaceId, projectId, taskId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.post(`workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/claim`);

            set((state) => ({
                allTasks: state.allTasks.map((task) =>
                    task._id === taskId
                        ? response.data.task
                        : task
                ),
                tasks: state.tasks.map((task) =>
                    task._id === taskId
                        ? response.data.task
                        : task
                ),
                isLoading: false,
                error: null,
            }));

            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to claim task. Try again.",
            });
            console.log(error.response);
            throw error;
        }
    },

    unclaimTask: async (workspaceId, projectId, taskId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.patch(
                `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/unclaim`
            );

            set((state) => ({
                allTasks: state.allTasks.map((task) =>
                    task._id === taskId
                        ? response.data.task
                        : task
                ),
                tasks: state.tasks.map((task) =>
                    task._id === taskId
                        ? response.data.task
                        : task
                ),
                isLoading: false,
                error: null,
            }));

            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to unclaim task. Try again.",
            });
            console.log(error.response)
            throw error;
        }
},
}));

export default useTaskStore;