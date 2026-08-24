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


function Dashboard() {
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
                value="6"
                description="2 active"
            />

            <StatsCard
                icon={Sparkles}
                iconClassName="bg-orange-50 text-warning"
                title="AI Plans"
                value="12"
                description="3 pending review"
            />

            <StatsCard
                icon={ListChecks}
                iconClassName="bg-blue-50 text-info"
                title="Tasks In Progress"
                value="28"
                description="8 more than yesterday"
                trend="8"
            />

            <StatsCard
                icon={CircleCheck}
                iconClassName="bg-green-50 text-success"
                title="Tasks Completed"
                value="45"
                description="12 more than yesterday"
                trend="12"
            />

            <StatsCard
                icon={Clock3}
                iconClassName="bg-red-50 text-danger"
                title="Tasks Due Today"
                value="5"
                description="2 high priority"
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