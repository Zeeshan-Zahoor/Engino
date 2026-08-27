import Header from "../components/layout/Header"
import ProjectActivity from "../components/projects/ProjectActivity"
import ProjectDescription from "../components/projects/ProjectDescription"
import ProjectOverviewHeader from "../components/projects/ProjectOverviewHeader"
import ProjectOverviewStats from "../components/projects/ProjectOverviewStats"
import ProjectRequirements from "../components/projects/ProjectRequirements"
import ProjectTabs from "../components/projects/ProjectTabs"
import ProjectTasks from "../components/projects/ProjectTasks"


import { useParams } from "react-router-dom"

import useProjectStore from '../stores/projectStore'

function ProjectDetails() {
  const { projectId } = useParams();
  const { projects } = useProjectStore();
  const activeProject = projects.find((project) => project.id === projectId);
  

  return (
    <div className="space-y-6 px-8">
        <Header 
            title={activeProject.name}
            showBack={true}
        />

        <ProjectOverviewHeader 
          project={activeProject}
        />

        <ProjectTabs />

        <ProjectOverviewStats 
          project={activeProject}
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_1.8fr_0.9fr]">
            <ProjectRequirements projectId={activeProject.id}/>
            <ProjectTasks projectId={activeProject.id}/>
            <ProjectActivity projectId={activeProject.id}/>
        </div>

        <ProjectDescription project={activeProject}/>

    </div>
  )
}

export default ProjectDetails