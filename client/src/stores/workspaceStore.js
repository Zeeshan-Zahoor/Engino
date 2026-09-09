import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

const useWorkspaceStore = create(
    persist((set, get) => ({
        workspaces: [],
        currentWorkspaceId: null,
        isLoading: false,
        error: null,
        workspaceMembers: [],

        fetchWorkspaces: async () => {
            try {
                set({ isLoading: true, error: null });
                const response = await api.get('/workspaces');
            
                const workspaces = response.data.workspaces;

                set({
                    workspaces,
                    isLoading: false,
                });

                return response.data;

            } catch (error) {
                set({
                    error: error.response?.data?.message || "Failed to load worspaces",
                    isLoading: false,
                })

                throw error;
            }
        },

        setCurrentWorkspace: (id) => {
            const { workspaces } = get();

            const exists = workspaces.find((workspace) => 
                workspace._id === id
            );

            set({
                currentWorkspaceId: exists
                    ? id 
                    : workspaces[0]?._id || null,
            });
        },

        clearWorkspaces: () => {
            set({
                workspaces: [],
                currentWorkspaceId: null,
                error: null,
            });
        },

        getWorkspaceMembers: async () => {
            const { currentWorkspaceId } = get();

            try {
                set({ isLoading: true, error: null });
                const response = await api.get(`workspaces/${currentWorkspaceId}/team`);

                set({
                    workspaceMembers: response.data.workspaceMembers,
                    isLoading: false,
                });
            
                return response.data;
                
            } catch (error) {
                set({
                    error: error.response?.data?.message || "Failed to load workspace members",
                    isLoading: false,
                });

                throw error;
            }
        }
    }),
 
    {
        name: "workspace-storage",
        partialize: (state)=> ({
            currentWorkspaceId: state.currentWorkspaceId,
        }),
    }
));

export default useWorkspaceStore;