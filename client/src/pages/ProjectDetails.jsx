import Header from "../components/layout/Header"
import ProjectActivity from "../components/projects/ProjectActivity"
import ProjectDescription from "../components/projects/ProjectDescription"
import ProjectOverviewHeader from "../components/projects/ProjectOverviewHeader"
import ProjectOverviewStats from "../components/projects/ProjectOverviewStats"
import ProjectRequirements from "../components/projects/ProjectRequirements"
import ProjectTabs from "../components/projects/ProjectTabs"
import ProjectTasks from "../components/projects/ProjectTasks"


function ProjectDetails() {
  return (
    <div className="space-y-6 px-8">
        <Header 
            title="Student Portal"
            showBack={true}
        />

        <ProjectOverviewHeader />

        <ProjectTabs />

        <ProjectOverviewStats />

        <div className="grid gap-4 lg:grid-cols-[1fr_1.8fr_0.9fr]">
            <ProjectRequirements />
            <ProjectTasks />
            <ProjectActivity />
        </div>

        <ProjectDescription />

    </div>
  )
}

export default ProjectDetails