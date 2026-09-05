import { create } from 'zustand';
import api from '../lib/api.js';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    register: async (data) => {
        const response = await api.post('/auth/register', data);

        return response.data;
    },

    login: async (data) => {
        const response = await api.post('/auth/login', data);

        set({
            user: response.data.user,
            isAuthenticated: true,
        })

        return response.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
        set({
            user: null,
            isAuthenticated: false,
        });
    },

    checkAuth: async () => {
        try {
            const response = await api.get("/auth/me");

            set({
                user: response.data.user,
                isAuthenticated: true,
                loading: false,
            });
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    }
}));

export default useAuthStore;