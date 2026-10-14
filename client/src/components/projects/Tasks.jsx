import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  MoreHorizontal,
  ListTodo,
  Circle,
  Clock3,
  Eye,
  Pencil,
  UserRound,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import useTaskStore from "../../stores/taskStore";
import useWorkspaceStore from "../../stores/workspaceStore";
import useProjectStore from "../../stores/projectStore";
import useToastStore from "../../stores/toastStore";
import { useParams } from "react-router-dom";

import Avatar from "../../utils/Avatar";
import CreateTaskModal from "../tasks/CreateTaskModal";
import Toast from "../common/Toast";

import { getRelativeEstimatedTime } from "../../utils/getRelativeTime";
import TaskDetailsModal from "./tasks/TasksDetailsModal";
import DeleteTaskModal from "./tasks/DeleteTaskModal";
import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";
import EmptyState from "../common/EmptyState";

function Tasks({ project }) {
    const { currentWorkspaceId } = useWorkspaceStore();
    const { projectId } = useParams();
    const { fetchProject } = useProjectStore();
    const { showToast } = useToastStore();
    const {  
      updateTask,
      deleteTask: removeTask,
      fetchTask,
      isLoading,
      error, 
    } = useTaskStore();

    const [openMenuId, setOpenMenuId] = useState(null);
    const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [deleteTask, setDeleteTask] = useState(null);

    const isAdmin = isWorkspaceAdmin();

    const tasks = project?.tasks || [];

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(task => task.status === "Todo");
    const inProgressTasks = tasks.filter(task => task.status === "In Progress");
    const completedTasks = tasks.filter(task => task.status === "Done");

    const getStatusClass = (status) => {
        switch (status) {
        case "Done":
            return "bg-success/10 text-success";

        case "In Progress":
            return "bg-primary/10 text-primary";

        case "Todo":
        default:
            return "bg-surface text-text-secondary";
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
        case "High":
            return "bg-danger/10 text-danger";

        case "Medium":
            return "bg-warning/10 text-warning";

        case "Low":
            return "bg-success/10 text-success";

        default:
            return "bg-muted text-muted-foreground";
        }
    };

    const handleFetchTask = async (taskId) => {
      try {
        const response = await fetchTask(currentWorkspaceId, projectId, taskId);
        setSelectedTask(response?.task);

      } catch  {
        showToast(error || "Error fetching task.", "error");
      }
    }

    const handleUpdateTask = async (updatedTask) => {
      if (!currentWorkspaceId || !projectId || !updateTask) return;

      try {
        await updateTask(currentWorkspaceId, projectId, updatedTask._id, updatedTask);
        await fetchProject(currentWorkspaceId, projectId);

        setEditMode(false);
        setSelectedTask(null);
        showToast("Task Updated Successfully!", "success");

      } catch  {
          showToast("Failed to update task. Try again.", "error");
      }
    }

    const handleDeleteTask = async (taskId) => {
      try {
        await removeTask(currentWorkspaceId, projectId, taskId);
        await fetchProject(currentWorkspaceId, projectId);
        
        setDeleteTask(null);
        showToast("Task Deleted Successfully!", "success");

      } catch {
        showToast("Error Deleting Task!", "error");
      }
    }

  return (
    <div className="rounded-2xl border border-border bg-background p-5">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Tasks ({totalTasks})
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Plan, track and manage project tasks.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setOpenCreateTaskModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={18} />
            Add Task
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ListTodo size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground">
              {totalTasks}
            </p>
            <p className="text-xs text-muted-foreground">
              Total Tasks
            </p>
          </div>
        </div>

        {/* To Do */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text-secondary">
            <Circle size={16} />
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground">
              {todoTasks.length}
            </p>
            <p className="text-xs text-muted-foreground">
              To Do
            </p>
          </div>
        </div>

        {/* In Progress */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock3 size={17} />
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground">
              {inProgressTasks.length}
            </p>
            <p className="text-xs text-muted-foreground">
              In Progress
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 size={17} />
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground">
              {completedTasks.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Completed
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}
        <div className="relative w-full lg:max-w-xs">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search tasks..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground hover:bg-muted"
          >
            Status
            <ChevronDown size={15} />
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground hover:bg-muted"
          >
            Priority
            <ChevronDown size={15} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 hidden overflow-x-auto rounded-lg border border-border lg:block">
        <table className="w-full min-w-[950px] text-left">

          {/* Table Head */}
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-3 text-xs font-medium text-muted-foreground">
                No.
              </th>

              <th className="px-3 py-3 text-xs font-medium text-muted-foreground">
                Task
              </th>

              <th className="px-3 py-3 text-xs font-medium text-muted-foreground">
                Status
              </th>

              <th className="px-3 py-3 text-xs font-medium text-muted-foreground">
                Priority
              </th>

              <th className="px-3 py-3 text-xs font-medium text-muted-foreground">
                Assignee
              </th>

              <th className="px-3 py-3 text-xs font-medium text-muted-foreground">
                Due Date
              </th>

              <th className="px-3 py-3 text-xs font-medium text-muted-foreground">
                Estimated
              </th>

              <th className="w-16 px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <EmptyState icon={ListTodo} title="No tasks yet" description="Create a task to start tracking execution for this project." actionLabel={isAdmin ? "New task" : undefined} onAction={isAdmin ? () => setOpenCreateTaskModal(true) : undefined} compact />
                </td>
              </tr>
            ) : tasks.map((task, index) => (
              <tr
                key={task._id}
                onClick={() => {
                  setEditMode(false);
                  setSelectedTask(task);
                }}
                className="border-b border-border last:border-b-0 hover:bg-surface"
              >
                {/* task number */}
                <td className="px-4 py-4">
                  <p className="truncate text-sm font-medium text-foreground">{index + 1}</p>
                </td>

                {/* Task */}
                <td className="max-w-[300px] px-3 py-4">
                  <p className="truncate text-sm font-medium text-foreground">
                    {task.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {task.description}
                  </p>
                </td>

                {/* Status */}
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>

                {/* Priority */}
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>

                {/* Assignee */}
                <td className="px-3 py-4">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        <Avatar user={task.assignee}/>
                      </div>

                      <span className="whitespace-nowrap text-sm text-foreground">
                        {task.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-border">
                        <UserRound size={13} />
                      </div>

                      Unassigned
                    </div>
                  )}
                </td>

                {/* Due Date */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                  {task?.dueDate 
                    ? (new Date(task.dueDate).toLocaleDateString()) 
                    : (
                      <span className="text-text-secondary text-sm">Not Set</span>
                    )}
                </td>

                {/* Estimated */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                  {getRelativeEstimatedTime(task.estimatedEffortMinutes)}
                </td>

                {/* Actions */}
                <td className="relative px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === task._id ? null : task._id
                        )
                      }
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-surface hover:cursor-pointer"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === task._id && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-4 top-12 z-30 w-44 rounded-lg border border-border bg-background p-1.5 text-left shadow-lg">

                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          handleFetchTask(task._id);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary cursor-pointer hover:bg-surface"
                      >
                        <Eye size={15} />
                        View Details
                      </button>

                      {isAdmin && (
                        <button
                        type="button"
                        onClick={() => {
                            handleFetchTask(task._id);
                            setOpenMenuId(null);
                            setEditMode(true);
                          }
                        }
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary cursor-pointer hover:bg-surface"
                      >
                        <Pencil size={15} />
                        Edit Task
                      </button>
                      )}


                      {isAdmin && (
                        <>
                          <div className="my-1 border-t border-border" />
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              setDeleteTask(task)
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger cursor-pointer hover:bg-danger/10"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-3 lg:hidden">
        {tasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="No tasks yet"
            description="Create a task to start tracking execution for this project."
            actionLabel={isAdmin ? "New task" : undefined}
            onAction={isAdmin ? () => setOpenCreateTaskModal(true) : undefined}
            compact
          />
        ) : (
          tasks.map((task) => (
            <article key={task._id} className="rounded-xl border border-border bg-card p-4">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setSelectedTask(task);
                }}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Task</p>
                    <h3 className="mt-1 break-words text-sm font-semibold text-foreground">{task.title}</h3>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 break-words text-xs leading-5 text-muted-foreground">{task.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}>{task.priority}</span>
                  <span className="rounded-full bg-surface px-2 py-1 text-xs text-text-secondary">
                    {task.assignee?.name || "Unassigned"}
                  </span>
                  <span className="rounded-full bg-surface px-2 py-1 text-xs text-text-secondary">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                  </span>
                </div>
              </button>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    handleFetchTask(task._id);
                  }}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface"
                >
                  <Eye size={14} /> View
                </button>
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleFetchTask(task._id);
                        setEditMode(true);
                      }}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTask(task)}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-danger/20 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/10"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </div>


      <CreateTaskModal 
        open={openCreateTaskModal}
        onClose={() => setOpenCreateTaskModal(false)}
      />

      <TaskDetailsModal 
        task={selectedTask}
        open={!!selectedTask}
        editMode={editMode}
        cancelEditMode={() => setEditMode(false)}
        onEdit={() => {
          setSelectedTask(selectedTask);
          setEditMode(true);
        }}
        onClose={() => {
          setSelectedTask(null);
          setEditMode(false);
        }}
        projectMembers={project?.team || []}
        onSave={handleUpdateTask}
        loading={isLoading}
        error={error}
      />

      <DeleteTaskModal 
          task={deleteTask}
          open={!!deleteTask}
          onClose={() => setDeleteTask(null)}
          onConfirm={() => handleDeleteTask(deleteTask._id)}
          loading={isLoading}
      />

      <Toast />

    </div>
  );
}

export default Tasks;
