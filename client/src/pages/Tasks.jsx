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
import useToastStore from "../stores/toastStore";

import TaskDetailsModal from "../components/projects/tasks/TasksDetailsModal";
import DeleteTaskModal from "../components/projects/tasks/DeleteTaskModal";
import Toast from "../components/common/Toast";

function Tasks() {
  const { projects, fetchProjects } = useProjectStore();
  const { workspaceRequirements, fetchWorkspaceRequirements } = useRequirementStore();
  const { user } = useAuthStore();
  const { 
    allTasks, 
    fetchAllTasks,
    updateTask,
    deleteTask: removeTask,
    isLoading,
    error,
  } = useTaskStore();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { showToast } = useToastStore();

  const [selectedTask, setSelectedTask] = useState(null);
  const [searchParams] = useSearchParams();
  const insightFilter = searchParams.get("filter");

  const [taskScope, setTaskScope] = useState("all");
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditTask = (task) => {
    setEditTask(task);
  };

  const handleDeleteTask = (task) => {
    setDeleteTask(task);
  };

  const handleSaveTask = async (editedTask) => {
    try {
      const projectId =
        typeof editedTask.projectId === "object"
          ? editedTask.projectId?._id
          : editedTask.projectId;

      await updateTask(
        currentWorkspaceId,
        projectId,
        editedTask._id,
        {
          title: editedTask.title,
          description: editedTask.description,
          status: editedTask.status,
          priority: editedTask.priority,
          assignee:
            typeof editedTask.assignee === "object"
              ? editedTask.assignee?._id
              : editedTask.assignee || null,
          dueDate: editedTask.dueDate || null,
          estimatedEffortMinutes: editedTask.estimatedEffortMinutes,
          type: editedTask.type,
          complexity: editedTask.complexity,
          tags: editedTask.tags || [],
        }
      );

      setEditTask(null);
      showToast("Task Edited Successfully!", "success");

    } catch  {
      showToast(error || "Error editing task!", "error");
    }
  };

  const handleConfirmDelete = async () => {
      if (!deleteTask) return;

      const projectId =
        typeof deleteTask.projectId === "object"
          ? deleteTask.projectId?._id
          : deleteTask.projectId;

      if (!projectId) {
        showToast("Unable to determine the task project.", "error");
        return;
      }

      try {
        setIsDeleting(true);

        await removeTask(
          currentWorkspaceId,
          projectId,
          deleteTask._id
        );

        // If the deleted task was currently open,
        // close the details panel as well.
        if (selectedTask?._id === deleteTask._id) {
          setSelectedTask(null);
        }

        setDeleteTask(null);

        showToast("Task deleted successfully!", "success");
      } catch (error) {
        showToast(
          error.response?.data?.message ||
            "Failed to delete task. Please try again.",
          "error"
        );
      } finally {
        setIsDeleting(false);
      }
    };


  const scopedTasks = allTasks.filter((task) => {
    switch (taskScope) {
      case "mine":
        return task.assignee?._id === user?._id;

      case "unassigned":
        return !task.assignee;

      case "all":
      default:
        return true;
    }
  });

  useEffect(() => {
    if (!selectedTask) return;

    const updatedTask = allTasks.find(
      (task) => task._id === selectedTask._id
    );


    if (updatedTask) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTask(updatedTask);
    }
  }, [allTasks, selectedTask?._id, selectedTask]);

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

  useEffect(() => {
    if (!selectedTask) return;

    const existsInScope = scopedTasks.some(
      (task) => task._id === selectedTask._id
    );

    if (!existsInScope) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTask(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskScope, selectedTask?._id]);

  return (
    <div className="space-y-6 px-8">
      <Header
        title="Tasks"
        description="Track, manage and execute all engineering tasks across projects."
        showBack={true}
        user={user}
      />    

      <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1 w-fit">
        <button
          type="button"
          onClick={() => setTaskScope("all")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            taskScope === "all"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          All Tasks
        </button>

        <button
          type="button"
          onClick={() => setTaskScope("mine")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            taskScope === "mine"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          My Tasks
        </button>

        <button
          type="button"
          onClick={() => setTaskScope("unassigned")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            taskScope === "unassigned"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          Unassigned
        </button>
      </div>

      <TaskStats tasks={scopedTasks}/>

      <div className={`grid gap-4 ${selectedTask === null ? "xl:grid-cols-[minmax(1,1fr)_480px]" : "xl:grid-cols-[minmax(0,1fr)_480px]"}`}>
        <div className="min-w-0">
            <TaskToolbar />
            <TaskList
              projects={projects || []}
              requirements={workspaceRequirements || []}
              tasks={scopedTasks}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              insightFilter={insightFilter}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
        </div>

        <div>
            <TaskDetailsPanel 
              task={selectedTask}
              projects={projects || []}
              requirements={workspaceRequirements}
              setSelectedTask={setSelectedTask}  
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
        </div>
        </div>


        <Toast />
        <TaskDetailsModal 
          task={editTask}
          open={!!editTask}
          editMode={true}
          cancelEditMode={() => setEditTask(null)}
          onEdit={() => {}}
          onClose={() => setEditTask(null)}
          projectMembers={
            projects.find((project) => {
              const projectId = typeof editTask?.projectId === "object"
                    ? editTask?.projectId?._id
                    : editTask?.projectId;
                    
              return project._id === projectId;
            })?.team || []
          }
          onSave={handleSaveTask}
          loading={isLoading}
          error={error}
        />
        <DeleteTaskModal 
          task={deleteTask}
          open={!!deleteTask}
          onClose={() => setDeleteTask(null)}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
        />
    </div>
  );
}

export default Tasks;