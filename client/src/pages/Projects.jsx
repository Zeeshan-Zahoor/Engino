import { useEffect, useState } from "react"
import Header from "../components/layout/Header"
import StatsCard from "../components/dashboard/StatsCard"
import { 
    Plus, 
    FolderKanban, 
    FolderCheck, 
    SquareStop, 
    CircleCheck
} from "lucide-react"
import ProjectFilters from "../components/projects/ProjectFilters"
import ProjectsList from "../components/projects/ProjectsList"
import CreateProjectModal from "../components/projects/CreateProjectModal"
import Toast from  "../components/common/Toast";
import DeleteProjectModal from "../components/projects/DeleteProjectModal"

import useProjectStore from "../stores/projectStore"
import useWorkspaceStore from "../stores/workspaceStore"
import useAuthStore from "../stores/authStore"

import { isWorkspaceAdmin } from "../utils/isWorkspaceAdmin"
function Projects() {
    const { projects, fetchProjects, isLoading, error } = useProjectStore();
    const { currentWorkspaceId } = useWorkspaceStore();
    const { user } = useAuthStore();

    const [searchInput, setSearchInput] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All")
    const [sortBy, setSortBy] = useState("Recently Updated");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const [selectedProject, setSelectedProject] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteProject = (project) => {
        setSelectedProject(project);
        setShowDeleteModal(true);
    }

    const handleCreateProject = () => {
        setEditingProject(null);
        setIsCreateModalOpen(true);
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setIsCreateModalOpen(true);
    };

    const handleCloseProjectModal = () => {
        setIsCreateModalOpen(false);
        setEditingProject(null);
    };

    const isAdmin = isWorkspaceAdmin();

    useEffect(() => {
        if(projects.length === 0) {
            fetchProjects(currentWorkspaceId);
        }
    }, [fetchProjects, currentWorkspaceId, projects.length]);

    const statusFilteredProjects = projects.filter((project) => {
        if(selectedStatus === "All") {
            return true;
        }
        return project.status === selectedStatus;
    })

    const filteredProjects = statusFilteredProjects.filter((project) => {
        const nameMatches = project?.name?.toLowerCase().includes(searchInput.toLowerCase());
        const projectCodeMatches = project?.code?.toLowerCase().includes(searchInput.toLowerCase());

        return nameMatches || projectCodeMatches;
     })

     

     const sortedProjects = [...filteredProjects]?.sort((a, b) => {
        switch (sortBy) {
            case "Recently Updated":
                return new Date(b.updatedAt) - new Date(a.updatedAt);

            case "Oldest Updated":
                return new Date(a.updatedAt) - new Date(b.updatedAt);

            case "Progress: High to Low":
                return b.progress - a.progress;

            case "Progress: Low to High":
                return a.progress - b.progress;

            case "Name: A-Z":
                return a.name.localeCompare(b.name);

            case "Name: Z-A":
                return b.name.localeCompare(a.name);

            default:
                return 0;
        }
    });

    const totalProjects = projects?.length || 0;
    const activeProjects = projects?.filter((project) => 
        project.status === "In Progress"
    )
    const onHoldProjects = projects?.filter((project) => 
        project.status === "On Hold"
    )

    const avgProgress = () => {
        const sum = projects?.reduce((acc, curr) => {
            const tasks = curr.tasks;
            const completedTasks = tasks.filter(task => task.status === "Done")
            const progress = ((completedTasks.length / tasks.length) * 100 ) || 0;
            
            acc += progress;
            return acc;
        }, 0);

        const avg = Math.round(sum / projects?.length);
        return avg;
    }

  return (
    <div className="space-y-6 px-8">
        {/* Header */}
        <Header 
            title="Projects"
            description="Manage all your projects and their progress."
            showBack={true}
            user={user}
        />

        {/* Statistics */}
        <div className="flex flex-col items-end gap-3">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    icon={FolderKanban}
                    iconClassName="bg-purple-50 text-primary"
                    title="Total Projects"
                    value={totalProjects}
                    description={`${activeProjects.length} active`}
                />
                <StatsCard 
                    icon={FolderCheck}
                    iconClassName="bg-green-50 text-success"
                    title="Active Projects"
                    value={activeProjects.length}
                />
                <StatsCard 
                    icon={SquareStop}
                    iconClassName="bg-red-50 text-danger"
                    title="On Hold Projects"
                    value={onHoldProjects.length}
                />
                <StatsCard 
                    icon={CircleCheck}
                    iconClassName="bg-blue-50 text-success"
                    title="Avg. Progress"
                    value={`${avgProgress()}%`}
                />
            </div>
            {isAdmin && (
                <button
                type="button"
                onClick={handleCreateProject}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
                <Plus size={17} strokeWidth={2.8} />
                New Project
            </button>
            )}
        </div>

        <ProjectFilters 
            searchInput={searchInput}
            selectedStatus={selectedStatus}
            sortBy={sortBy}
            setSearchInput={setSearchInput}
            setSelectedStatus={setSelectedStatus}
            setSortBy={setSortBy}
        />

        <ProjectsList 
            filteredProjects={sortedProjects}
            loading={isLoading}
            error={error}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
        />

        {/* Render Modal */}
        <CreateProjectModal 
            key={editingProject?._id}
            isOpen={isCreateModalOpen}
            onClose={handleCloseProjectModal}
            project={editingProject}
        />

        <Toast />

        {/* Delete Project Confirmation Modal */}
        <DeleteProjectModal 
            isOpen={showDeleteModal && selectedProject}
            onClose={() => {
                setShowDeleteModal(false);
                setSelectedProject(null);
            }}
            selectedProject={selectedProject}
            loading={isLoading}
        />
    </div>
  )
}

export default Projects