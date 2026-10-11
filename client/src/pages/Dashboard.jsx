import AIInsights from "../components/dashboard/AIInsights";
import AIWorkspace from "../components/dashboard/AIWorkspace";
import Header from "../components/layout/Header";
import {
    FolderKanban,
    Sparkles,
    ListChecks,
    CircleCheck,
    Clock3,
} from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import RequirementsOverview from "../components/dashboard/RequirementsOverview";
import MyTasks from "../components/dashboard/MyTasks";
import ProjectProgress from "../components/dashboard/ProjectProgress";
import RepositoryStatus from "../components/dashboard/RepositoryStatus";

import useProjectStore from "../stores/projectStore";
import useTaskStore from "../stores/taskStore";
import useAuthStore from '../stores/authStore';
import useWorkspaceStore from "../stores/workspaceStore";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import useAIPlanStore from "../stores/aiPlanStore";

function Dashboard() {
    const { user } = useAuthStore();
    const { allTasks, fetchAllTasks } = useTaskStore();
    const { currentWorkspaceId } = useWorkspaceStore();
    const { allAIPlans,  fetchAllPlans } = useAIPlanStore();
    const { projects, fetchProjects } = useProjectStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects(currentWorkspaceId);
        fetchAllPlans(currentWorkspaceId);
        fetchAllTasks(currentWorkspaceId);
    }, [currentWorkspaceId, fetchProjects, fetchAllPlans, fetchAllTasks]);

    const activeProjects = projects?.filter((project) => project.status === "In Progress");
    
    const inProgressTasks = allTasks?.filter((task) => task.status === "In Progress");

    const completedTasks = allTasks?.filter((task) => task.status === "Done");

    const dueTodayTasks = () => {
        const today = new Date();

        return allTasks?.filter((task) => {
            const dueDate = new Date(task.dueDate);

            return (
                dueDate.getFullYear() === today.getFullYear() &&
                dueDate.getMonth() === today.getMonth() &&
                dueDate.getDate() === today.getDate()
            );
        });
    };

  return (
    <div className="space-y-6 px-8">
        <Header 
            title="Dashboard"
            description="Welcome back, Zeeshan. Here's what's happening with your workspace."
            user={user}
        />
        
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)]">
            <AIWorkspace />
            <AIInsights />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard 
                icon={FolderKanban}
                iconClassName="bg-purple-50 text-primary"
                title="Projects"
                value={projects?.length}
                description={`${activeProjects.length} active`}
                onClick={() => navigate("/projects")}
            />

            <StatsCard
                icon={Sparkles}
                iconClassName="bg-orange-50 text-warning"
                title="AI Plans"
                value={allAIPlans?.length} 
                description="Workspace AI plans"
                onClick={() => navigate("/requirements")}
            />

            <StatsCard
                icon={ListChecks}
                iconClassName="bg-blue-50 text-info"
                title="Tasks In Progress"
                value={inProgressTasks?.length}
                description={`${allTasks.length} Total`}
                onClick={() => navigate("/tasks")}
            />

            <StatsCard
                icon={CircleCheck}
                iconClassName="bg-green-50 text-success"
                title="Tasks Completed"
                value={completedTasks?.length}
                description={`${allTasks.length} Total`}
                onClick={() => navigate("/tasks")}
            />

            <StatsCard
                icon={Clock3}
                iconClassName="bg-red-50 text-danger"
                title="Tasks Due Today"
                value={dueTodayTasks().length}
                description={`${dueTodayTasks().filter(task => task.priority === "High").length} high priority`}
                onClick={() => navigate("/tasks")}
            />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
            <RequirementsOverview />
            <MyTasks />

        </div>

        <ProjectProgress projects={projects || []}/>
        <RepositoryStatus />

        {/* <QuickActions /> */}

    </div>
  )
}

export default Dashboard