import Header from "../components/layout/Header"
import StatsCard from "../components/dashboard/StatsCard"
import { 
    Plus, 
    FolderKanban, 
    FolderCheck, 
    SquareStop, 
    CircleCheck
} from "lucide-react"

function Projects() {
  return (
    <div className="space-y-6 px-8">
        {/* Header */}
        <Header 
            title="Projects"
            description="Manage all your projects and their progress."
        />

        <div className="flex flex-col items-end gap-3">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    icon={FolderKanban}
                    iconClassName="bg-purple-50 text-primary"
                    title="Total Projects"
                    value="6"
                    description="2 active"
                />
                <StatsCard 
                    icon={FolderCheck}
                    iconClassName="bg-green-50 text-success"
                    title="Active Projects"
                    value="2"
                    description="1 from last month"
                    trend="1"
                />
                <StatsCard 
                    icon={SquareStop}
                    iconClassName="bg-red-50 text-danger"
                    title="On Hold Projects"
                    value="2"
                    description="1 from last month"
                    trend="1"
                    trendType="negative"
                />
                <StatsCard 
                    icon={CircleCheck}
                    iconClassName="bg-blue-50 text-success"
                    title="Avg. Progress"
                    value="78%"
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

        {/* Searchbar and filters */}

        {/* Projects */}

        {/* Result count */}
    </div>
  )
}

export default Projects