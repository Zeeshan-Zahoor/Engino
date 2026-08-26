import { useState } from "react"
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

import useProjectStore from "../stores/projectStore"

function Projects() {
    
    const [searchInput, setSearchInput] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All")
    const [sortBy, setSortBy] = useState("Recently Updated");

    const projects = useProjectStore((state) => state.projects);

    const statusFilteredProjects = projects.filter((project) => {
        if(selectedStatus === "All") {
            return true;
        }
        return project.status === selectedStatus;
    })

    const filteredProjects = statusFilteredProjects.filter((project) => {
        const nameMatches = project.name.toLowerCase().includes(searchInput.toLowerCase());
        const projectCodeMatches = project.code.toLowerCase().includes(searchInput.toLowerCase());

        return nameMatches || projectCodeMatches;
     })

     const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case "Recently Updated":
                return new Date(b.updatedDate) - new Date(a.updatedDate);

            case "Oldest Updated":
                return new Date(a.updatedDate) - new Date(b.updatedDate);

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

    const totalProjects = projects.length;
    const activeProjects = projects.filter((project) => 
        project.status === "In Progress"
    )
    const onHoldProjects = projects.filter((project) => 
        project.status === "On Hold"
    )

    const avgProgress = () => {
        const sum = projects.reduce((acc, curr) => {
            acc += curr.progress;
            return acc;
        }, 0);

        const avg = Math.round(sum / projects.length);
        return avg;
    }

  return (
    <div className="space-y-6 px-8">
        {/* Header */}
        <Header 
            title="Projects"
            description="Manage all your projects and their progress."
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
                    description="1 from last month"
                    trend="1"
                />
                <StatsCard 
                    icon={SquareStop}
                    iconClassName="bg-red-50 text-danger"
                    title="On Hold Projects"
                    value={onHoldProjects.length}
                    description="1 from last month"
                    trend="1"
                    trendType="negative"
                />
                <StatsCard 
                    icon={CircleCheck}
                    iconClassName="bg-blue-50 text-success"
                    title="Avg. Progress"
                    value={`${avgProgress()}%`}
                    description="8% from last month"
                    trend="8"
                />
            </div>
            <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
                <Plus size={17} strokeWidth={2.8} />
                New Project
            </button>
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
        />
    </div>
  )
}

export default Projects