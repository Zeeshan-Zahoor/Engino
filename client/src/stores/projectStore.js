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

    addProject: (project) => set((state) => ({
        projects: [...state.projects, project],
    })),

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