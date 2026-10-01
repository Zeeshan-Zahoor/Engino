import { create } from "zustand";
import api from "../lib/api";

const useAIStore = create((set) => ({
    isLoading: false,
    error: null,

    exploreWithAI: async (workspaceId, prompt, conversation = []) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await api.post(
                `/workspaces/${workspaceId}/ai/explore`,
                {
                prompt,
                conversation,
                }
            );

            set({
                isLoading: false,
                error: null,
            });

            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message ||
                "Failed to explore with AI. Try again.",
            });

            console.log(error.response);
            throw error;
        }
    }
}));

export default useAIStore;