import {
  X,
  ChevronDown,
  MoreVertical,
  Clock3,
  CheckCircle2,
  Pencil,
  Trash2,
  UserMinus
} from "lucide-react";
import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";
import useAuthStore from "../../stores/authStore";
import useTaskStore from "../../stores/taskStore";
import useWorkspaceStore from "../../stores/workspaceStore";
import useToastStore from "../../stores/toastStore";
import Avatar from "../../utils/Avatar";
import { getRelativeEstimatedTime } from "../../utils/getRelativeTime";
import Loader from "../common/Loader";
import { useState } from "react";



const statusStyles = {
    "In Progress": "bg-blue-50 text-info",
    Todo: "bg-purple-50 text-primary",
    Done: "bg-green-50 text-success",
  };

const complexityStyles = {
  High: "text-danger",
  Medium: "text-warning",
  Low: "text-success",
};

const priorityStyles = {
  High: "text-danger",
  Medium: "text-warning",
  Low: "text-success",
};

function DetailRow({ label, children }) {
  
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-text-secondary">
        {label}
      </span>

      <div className="text-right text-sm font-medium text-text-primary">
        {children}
      </div>
    </div>
  );
}

function TaskDetailsPanel({ task, projects, requirements, setSelectedTask , onEdit, onDelete }) {
  
  const { user } = useAuthStore();
  const isAdmin = isWorkspaceAdmin();
  
  const { claimTask, unclaimTask, updateTask, isLoading } = useTaskStore();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { showToast } = useToastStore();

  const [isAssigneeMenuOpen, setIsAssigneeMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  if(!task) return null;

  const isAssignedToMe = task.assignee?._id === user?._id;
  const isUnassigned = !task.assignee;

  const projectId =
      typeof task.projectId === "object"
          ? task.projectId?._id
          : task.projectId;

  const currentProject = projects.find(
      (project) => project._id === projectId
  );

const projectMembers = currentProject?.team || [];


 const handleStatusChange = async (status) => {
    try {
        const projectId =
            typeof task.projectId === "object"
                ? task.projectId?._id
                : task.projectId;

        await updateTask(
            currentWorkspaceId,
            projectId,
            task._id,
            {
                status,
            }
        );

        setIsStatusMenuOpen(false);

        showToast(
            status === "Done"
                ? "Task marked as completed!"
                : "Task status updated!",
            "success"
        );
    } catch (error) {
        showToast(
            error.response?.data?.message ||
                "Failed to update task status.",
            "error"
        );
    }
};
  const handleAssigneeChange = async (assigneeId) => {
      try {
          await updateTask(
              currentWorkspaceId,
              projectId,
              task._id,
              {
                  assignee: assigneeId,
              }
          );

          setIsAssigneeMenuOpen(false);

          showToast(
              assigneeId
                  ? "Task assigned successfully!"
                  : "Task unassigned successfully!",
              "success"
          );
      } catch (error) {
          showToast(
              error.response?.data?.message ||
                  "Failed to update assignee.",
              "error"
          );
      }
  };

  const handleClaimTask = async () => {
    try {
      const projectId =
        typeof task.projectId === "object"
            ? task.projectId?._id
            : task.projectId;
      await claimTask(
        currentWorkspaceId,
        projectId,
        task._id
      );

      showToast("Task claimed successfully!", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to claim task.",
        "error"
      );
    }
  };

  const handleUnclaimTask = async () => {
    try {
      const projectId =
        typeof task.projectId === "object"
            ? task.projectId?._id
            : task.projectId;

      await unclaimTask(
        currentWorkspaceId,
        projectId,
        task._id
      );

      showToast("Task unclaimed successfully!", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to unclaim task.",
        "error"
      );
    }
  };
  
  
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-white">
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-secondary">
              {task._id.slice(task._id.length-4).toUpperCase()}
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-6 text-text-primary">
              {task.title}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
              <span className="text-primary text-lg">▣</span>
              <span>{requirements.find(requirement => requirement._id === task.requirementId)?.name || "No Linked Requirement"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTask(null)}
            className="shrink-0 text-text-secondary transition hover:text-text-primary"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status */}
        <div className="mt-3 flex justify-end">
            <span
                className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold ${statusStyles[task.status]}`}
            >
                {task.status}
            </span>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Description */}
        <section className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Description
          </h3>

          <p className="mt-3 text-sm leading-5 text-text-secondary">
            {task.description}
          </p> 
        
        </section>

        {/* Details */}
        <section className="space-y-4 border-b border-border p-4">
          <DetailRow label="Assignee">
            {isAdmin ? (
                <div className="relative">
                  <button
                      type="button"
                      onClick={() => setIsAssigneeMenuOpen((prev) => !prev)}
                      className="flex min-w-[170px] items-center justify-between gap-3 rounded-lg bg-white px-2.5 py-1.5 text-sm font-medium text-text-primary transition hover:bg-surface"
                  >
                      <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                              <Avatar user={task.assignee} />
                          </div>

                          <span className="truncate">
                              {task.assignee?.name || "Unassigned"}
                          </span>
                      </div>

                      <ChevronDown
                          size={14}
                          className="shrink-0 text-text-secondary"
                      />
                  </button>

                  {isAssigneeMenuOpen && (
                      <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-lg">
                          
                          {/* Unassigned */}
                          <button
                              type="button"
                              onClick={() => handleAssigneeChange(null)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface"
                          >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-text-secondary">
                                  ?
                              </div>

                              <span className="text-sm font-medium text-text-primary">
                                  Unassigned
                              </span>
                          </button>

                          {/* Project Members */}
                          {projectMembers.map((member) => (
                              <button
                                  key={member.userId._id}
                                  type="button"
                                  onClick={() =>
                                      handleAssigneeChange(member.userId._id)
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-surface"
                              >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                                      <Avatar user={member.userId} />
                                  </div>

                                  <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-text-primary">
                                          {member.userId.name}
                                      </p>

                                      {member.role && (
                                          <p className="truncate text-xs text-text-secondary">
                                              {member.role}
                                          </p>
                                      )}
                                  </div>
                              </button>
                          ))}
                      </div>
                  )}
              </div>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                        <Avatar user={task.assignee} />
                    </div>

                    {task.assignee?.name || "Unassigned"}
                </div>
            )}
        </DetailRow>

          <DetailRow label="Reporter">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                <Avatar user={task.reporter}/>
              </div>
              {task.reporter?.name || "Unknown"}
            </div>
          </DetailRow>

          <DetailRow label="Priority">
            <span className={`inline-flex rounded-md bg-red-50 px-2 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
          </DetailRow>

          <DetailRow label="Due Date">
            <div>
              <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-- -- --"}</span>
            </div>
          </DetailRow>

          <DetailRow label="Estimated Effort">
            {getRelativeEstimatedTime(task.estimatedEffortMinutes)}
          </DetailRow>

          <DetailRow label="Task Type">
            <span className="inline-flex rounded-md bg-purple-50 px-2 py-1 text-xs font-semibold text-primary">
              {task.type}
            </span>
          </DetailRow>

          <DetailRow label="Complexity">
            <div className="flex items-center gap-2">
                <ComplexityStyling 
                  complexity={task.complexity}
                  valueClassName={complexityStyles[task.complexity]}
                />
            </div>
          </DetailRow>
        </section>

        {/* Tags */}
        <section className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Tags
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {task.tags.map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ),
            )}

          </div>
        </section>

        <section className="border-b border-border p-4">
          <div className="mt-2 flex items-center justify-end gap-1 text-xs text-text-secondary">
            <Clock3 size={13} />
            {task.timeSpent} of {task.effort}
          </div>
        </section>

        {/* Linked Requirement */}
        <section className="p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Linked Requirement
          </h3>

          <div className="mt-3 rounded-lg bg-purple-50 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-primary">
                <CheckCircle2 size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  {requirements.find(requirement => requirement._id === task.requirementId)?.name || "No Linked Requirement"}
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  {requirements.find(requirement => requirement._id === task.requirementId)?._id.slice(task.requirementId.length-4).toUpperCase() || ""}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border p-3">

        {isUnassigned && !isAdmin && (
          <button
            type="button"
            onClick={handleClaimTask}
            className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center gap-3">
                <Loader />
                <span> Claiming..</span>
              </div>
            ) : "Claim Task"}
          </button>
        )}

        {(isAssignedToMe || isAdmin) && (
          <div className="flex gap-2">

            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setIsMoreActionsOpen((prev) => !prev)}
                className={`w-full flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                  isMoreActionsOpen
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-border bg-white text-text-primary hover:bg-gray-50"
                }`}
              >
                More Actions
                <MoreVertical
                  size={16}
                  className={`transition-transform ${
                    isMoreActionsOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isMoreActionsOpen && (
                <div className="w-full absolute bottom-full left-0 z-50 mb-2 w-52 overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.10)]">

                  {/* Admin Actions */}
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          onEdit(task);
                        }}
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-text-primary transition hover:bg-gray-50"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition group-hover:bg-gray-200">
                          <Pencil size={15} />
                        </span>

                        <div className="flex flex-col">
                          <span>Edit Task</span>
                          <span className="text-[11px] font-normal text-text-secondary">
                            Modify task details
                          </span>
                        </div>
                      </button>

                      <div className="my-1.5 h-px bg-border" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          onDelete(task);
                        }}
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-500 transition group-hover:bg-red-100">
                          <Trash2 size={15} />
                        </span>

                        <div className="flex flex-col">
                          <span>Delete Task</span>
                          <span className="text-[11px] font-normal text-red-400">
                            Permanently remove task
                          </span>
                        </div>
                      </button>
                    </>
                  )}

                  {/* Member Action */}
                  {!isAdmin && isAssignedToMe && (
                    <button
                      type="button"
                      onClick={handleUnclaimTask}
                      disabled={isLoading}
                      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-text-primary transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition group-hover:bg-gray-200">
                        {isLoading ? (
                          <Loader size={15} color="text-primary" />
                        ) : (
                          <UserMinus size={15} />
                        )}
                      </span>

                      <div className="flex flex-col">
                        <span>
                          {isLoading ? "Unclaiming..." : "Unclaim Task"}
                        </span>

                        <span className="text-[11px] font-normal text-text-secondary">
                          Release this task
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <button
                  type="button"
                  onClick={() =>
                      setIsStatusMenuOpen((prev) => !prev)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                  Update Status
                  <ChevronDown
                      size={15}
                      className={`transition-transform ${
                          isStatusMenuOpen ? "rotate-180" : ""
                      }`}
                  />
              </button>

              {isStatusMenuOpen && (
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-lg">
                      {["Todo", "In Progress", "Done"].map((status) => (
                          <button
                              key={status}
                              type="button"
                              disabled={status === task.status}
                              onClick={() => handleStatusChange(status)}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                                  status === task.status
                                      ? "cursor-default bg-surface font-semibold text-text-primary"
                                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                              }`}
                          >
                              <span>{status}</span>

                              {status === task.status && (
                                  <CheckCircle2
                                      size={15}
                                      className="text-primary"
                                  />
                              )}
                          </button>
                      ))}
                  </div>
              )}
          </div>

          </div>
        )}

      </div>
    </aside>
  );
}

function ComplexityStyling ({ complexity, valueClassName }) {
  return(
    <div className="flex gap-2 items-center">
      {complexity === "Medium"
          ? (
            <div className="mt-2 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
          )
          : complexity === "High"
                ? (
                  <div className="mt-2 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                )
                : (
                  <div className="mt-2 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                )
    
    }
      <span
        className={`mt-1 text-sm font-semibold ${valueClassName}`}
      >
        {complexity}
      </span>
    </div>
  )
}

export default TaskDetailsPanel;