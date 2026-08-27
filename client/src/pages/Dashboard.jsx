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
import TeamActivity from "../components/dashboard/TeamActivity";
import QuickActions from "../components/dashboard/QuickActions";
import RepositoryStatus from "../components/dashboard/RepositoryStatus";
import useProjectStore from "../stores/projectStore";
import { tasks } from "../data/tasks";


function Dashboard() {
    const projects = useProjectStore(state => state.projects);
    const activeProjects = projects.filter((project) => project.status === "In Progress");
    
    const inProgressTasks = () =>
        tasks.filter((task) => task.status === "In Progress").length;

    const completedTasks = () =>
        tasks.filter((task) => task.status === "Completed").length;

    const dueTodayTasks = () => {
        const today = new Date();

        return tasks.filter((task) => {
            const dueDate = new Date(task.dueDate);

            return (
                dueDate.getFullYear() === today.getFullYear() &&
                dueDate.getMonth() === today.getMonth() &&
                dueDate.getDate() === today.getDate()
            );
        }).length;
    };

  return (
    <div className="space-y-6 px-8">
        <Header 
            title="Dashboard"
            description="Welcome back, Zeeshan. Here's what's happening with your workspace."
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
                value={projects.length}
                description={`${activeProjects.length} active`}
            />

            <StatsCard
                icon={Sparkles}
                iconClassName="bg-orange-50 text-warning"
                title="AI Plans"
                value="12"  // keep it static for now
                description="3 pending review"
            />

            <StatsCard
                icon={ListChecks}
                iconClassName="bg-blue-50 text-info"
                title="Tasks In Progress"
                value={inProgressTasks()}
                description="8 more than yesterday" // keep it static for now
                trend="8"
            />

            <StatsCard
                icon={CircleCheck}
                iconClassName="bg-green-50 text-success"
                title="Tasks Completed"
                value={completedTasks()}
                description="12 more than yesterday" // keep it static for now
                trend="12"
            />

            <StatsCard
                icon={Clock3}
                iconClassName="bg-red-50 text-danger"
                title="Tasks Due Today"
                value={dueTodayTasks()}
                description="2 high priority" // keep it static for now
                trend="2"
                trendType="negative"
            />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
            <RequirementsOverview />
            <MyTasks />

            <ProjectProgress />
            <TeamActivity />

            <div className="lg:col-span-2">
                <RepositoryStatus />
            </div>
        </div>

        <QuickActions />

    </div>
  )
}

export default Dashboard