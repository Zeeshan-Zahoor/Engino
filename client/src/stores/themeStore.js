import { create } from "zustand";

const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
};

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
};

const useThemeStore = create((set) => ({
    theme: getInitialTheme(),

    initializeTheme: () => {
        const theme = getInitialTheme();
        applyTheme(theme);
        set({ theme });
    },

    toggleTheme: () => {
        set((state) => {
            const theme = state.theme === "light" ? "dark" : "light";

            localStorage.setItem("theme", theme);
            applyTheme(theme);

            return { theme };
        });
    },

    setTheme: (theme) => {
        if (theme !== "light" && theme !== "dark") return;

        localStorage.setItem("theme", theme);
        applyTheme(theme);
        set({ theme });
    },
}));

export default useThemeStore;