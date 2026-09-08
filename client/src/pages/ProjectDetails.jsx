import Header from "../components/layout/Header"
// import ProjectActivity from "../components/projects/ProjectActivity"
import ProjectDescription from "../components/projects/ProjectDescription"
import ProjectOverviewHeader from "../components/projects/ProjectOverviewHeader"
import ProjectOverviewStats from "../components/projects/ProjectOverviewStats"
import ProjectRequirements from "../components/projects/ProjectRequirements"
import ProjectTabs from "../components/projects/ProjectTabs"
import ProjectTasks from "../components/projects/ProjectTasks"
import CreateProjectModal from "../components/projects/CreateProjectModal"

import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import useWorkspaceStore from "../stores/workspaceStore"
import useProjectStore from '../stores/projectStore'
import useAuthStore from "../stores/authStore"

function ProjectDetails() {
  const { projectId } = useParams();
  const { activeProject, fetchProject } = useProjectStore();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { user } = useAuthStore();


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchProject(currentWorkspaceId, projectId);

  }, [fetchProject, projectId, currentWorkspaceId]);

  const handleEditProject = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  }

  return (
    <div className="space-y-6 px-8">
        <Header 
            title={activeProject?.name}
            showBack={true}
            user={user}
        />

        <ProjectOverviewHeader 
          project={activeProject}
          onEdit={handleEditProject}
        />

        <ProjectTabs />

        <ProjectOverviewStats 
          project={activeProject}
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_1.8fr_0.9fr]">
            <ProjectRequirements project={activeProject}/>
            <ProjectTasks project={activeProject}/>
            {/* <ProjectActivity project={activeProject}/> */}
        </div>

        <ProjectDescription project={activeProject}/>


        <CreateProjectModal 
          key={activeProject?._id}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          project={activeProject}
        />
    </div>
  )
}

export default ProjectDetails