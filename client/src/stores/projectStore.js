import { create } from 'zustand';
import { projects as initialProjects } from '../data/projects';

const useProjectStore = create((set) => ({
    projects: initialProjects,
    selectedProjectId: null,

    selectProject: (projectId) => set({
        selectedProjectId: projectId,
    }),

    clearSelectedProject: () => set({
        selectedProjectId: null,
    }),

    addProject: (projectData) => {
        const newProject = {
            ...projectData,
            id: crypto.randomUUID(),
            progress: 0,
            technologies: [],
            goals: [],
            stats: {
                totalTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                todoTasks: 0,
                reviewTasks: 0,
            },

            updatedDate: (new Date()).toDateString(),
            updated: "Just now",
        };

        set((state) => ({
            projects: [...state.projects, newProject],
        }))
    },

    updateProject: (projectId, updates) => set((state) => ({
        projects: state.projects.map((project) => (
            project.id === projectId 
                    ?  { 
                            ...project, 
                            ...updates
                       }   
                    : project

        )),
    })),

    deleteProject: (projectId) => set((state) => ({
        projects: state.projects.filter((project) => (
            project.id !== projectId
        )),

        selectedProjectId: 
            state.selectedProjectId === projectId
                        ? null
                        : state.selectedProjectId, 
    })),
}));


export default useProjectStore;