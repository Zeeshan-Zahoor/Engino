import { useEffect, useState } from "react";

import Header from "../components/layout/Header";
import TaskStats from "../components/tasks/TaskStats";
import TaskToolbar from "../components/tasks/TaskToolbar";
import TaskList from "../components/tasks/TaskList";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";
import useTaskStore from "../stores/taskStore";
import { useSearchParams } from "react-router-dom";
import useWorkspaceStore from "../stores/workspaceStore";
import useAuthStore from "../stores/authStore";
import useProjectStore from "../stores/projectStore";
import useRequirementStore from "../stores/requirementStore";

function Tasks() {
  const { projects, fetchProjects } = useProjectStore();
  const { workspaceRequirements, fetchWorkspaceRequirements } = useRequirementStore();
  const { user } = useAuthStore();
  const { allTasks, fetchAllTasks } = useTaskStore();
  const { currentWorkspaceId } = useWorkspaceStore();

  const [selectedTask, setSelectedTask] = useState(null);
  const [searchParams] = useSearchParams();
  const insightFilter = searchParams.get("filter");

  useEffect(() => {
    if(!currentWorkspaceId) return;
    if(allTasks.length === 0) {
      fetchAllTasks(currentWorkspaceId);
    }
  }, [fetchAllTasks, currentWorkspaceId, allTasks.length]);

  useEffect(() => {
    if(!currentWorkspaceId) return;
    if(projects.length === 0) {
      fetchProjects(currentWorkspaceId);
    }
  }, [fetchProjects, currentWorkspaceId, projects.length]);

  useEffect(() => {
    if(!currentWorkspaceId) return;
    if(workspaceRequirements.length === 0) {
      fetchWorkspaceRequirements(currentWorkspaceId);
    }
  }, [fetchWorkspaceRequirements, currentWorkspaceId, workspaceRequirements.length]);

  return (
    <div className="space-y-6 px-8">
      <Header
        title="Tasks"
        description="Track, manage and execute all engineering tasks across projects."
        showBack={true}
        user={user}
      />    
      <TaskStats tasks={allTasks || []}/>

      <div className={`grid gap-4 ${selectedTask === null ? "xl:grid-cols-[minmax(1,1fr)_480px]" : "xl:grid-cols-[minmax(0,1fr)_480px]"}`}>
        <div className="min-w-0">
            <TaskToolbar />
            <TaskList 
              projects={projects || []}
              requirements={workspaceRequirements || []}
              tasks={allTasks || []}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              insightFilter={insightFilter}
            />
        </div>

        <div>
            <TaskDetailsPanel 
              task={selectedTask}
              requirements={workspaceRequirements}
              setSelectedTask={setSelectedTask}  
            />
        </div>
        </div>
    </div>
  );
}

export default Tasks;