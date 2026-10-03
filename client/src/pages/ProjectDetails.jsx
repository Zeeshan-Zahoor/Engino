import Header from "../components/layout/Header"
import ProjectDescription from "../components/projects/ProjectDescription"
import ProjectOverviewHeader from "../components/projects/ProjectOverviewHeader"
import ProjectOverviewStats from "../components/projects/ProjectOverviewStats"
import ProjectRequirements from "../components/projects/ProjectRequirements"
import ProjectTasks from "../components/projects/ProjectTasks"
import CreateProjectModal from "../components/projects/CreateProjectModal"
import ProjectTeam from "../components/projects/ProjectTeam"
import Tasks from "../components/projects/Tasks";

import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import useWorkspaceStore from "../stores/workspaceStore"
import useProjectStore from '../stores/projectStore'
import useAuthStore from "../stores/authStore"
import Requirements from "../components/projects/Requirements"
import DeleteProjectModal from "../components/projects/DeleteProjectModal"
import { useNavigate } from "react-router-dom"

const tabs = ["Overview", "AI Requirements", "Tasks", "Team"];

function ProjectDetails() {
  const { projectId } = useParams();
  const { activeProject, fetchProject, selectedTabIndex, setTabIndex } = useProjectStore();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(tabs[selectedTabIndex] || tabs[0]);

  useEffect(() => {
    fetchProject(currentWorkspaceId, projectId);

  }, [fetchProject, projectId, currentWorkspaceId]);

  const handleEditProject = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = () => {
    setIsDeleteModalOpen(true);
  }

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
          onDelete={handleDeleteProject}
        />

        {/* tabs */}
        <div className="overflow-x-auto border-b border-border">
          <div className="flex min-w-max items-center gap-7">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab)
                  setTabIndex(index)
                }}
                className={`relative py-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary transition-all"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <TabBody tab={activeTab} activeProject={activeProject}/>

        <CreateProjectModal 
          key={activeProject?._id}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          project={activeProject}
        />

        <DeleteProjectModal 
          selectedProject={activeProject}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          navigateBack={() => navigate(-1)}
        />
    </div>
  )
}

const TabBody = ({ tab, activeProject }) => {
  switch (tab) {
      case "Overview":
        return <>
          <ProjectOverviewStats 
            project={activeProject}
          />

          <div className="grid gap-4 lg:grid-cols-[1fr_1.8fr_0.9fr]">
              <ProjectRequirements project={activeProject}/>
              <ProjectTasks project={activeProject}/>
          </div>

          <ProjectDescription project={activeProject}/>
          </>
        
      case "AI Requirements":
        return <Requirements 
            project={activeProject}
          />;
       
      case "Tasks":
        return <Tasks 
          project={activeProject}
        />; 
       
      case "Team":
        return <ProjectTeam 
            project={activeProject}
        />; 

      default:
        break;
    }
}

export default ProjectDetails;