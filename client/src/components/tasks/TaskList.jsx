import { CheckSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Avatar from "../../utils/Avatar";
import { getRelativeEstimatedTime } from "../../utils/getRelativeTime";
import { useState } from "react";
import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-info-surface text-info",
    Todo: "bg-primary-light text-primary",
    Done: "bg-success-surface text-success",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${
        styles[status] || "bg-surface text-text-secondary"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-danger-surface text-danger",
    Medium: "bg-warning-surface text-warning",
    Low: "bg-success-surface text-success",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${
        styles[priority] || "bg-surface text-text-secondary"
      }`}
    >
      {priority}
    </span>
  );
}

function TaskList({ projects, requirements, tasks, selectedTask, setSelectedTask, insightFilter, loading, error, hasWorkspaceTasks, hasScopeTasks, onClearFilters, onEdit, onDelete }) {

  const [openMenuId, setOpenMenuId] = useState(null);

  const isDueThisWeek = (date) => {
    if (!date) return false;

    const taskDate = new Date(date);

    if (Number.isNaN(taskDate.getTime())) {
      return false;
    }

    const now = new Date();

    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  };

  const filteredTasks = tasks?.filter((task) => {
    switch (insightFilter) {
      case "high-priority":
        return (
          task.priority === "High" &&
          task.status !== "Done"
        );

      case "overdue":
        return (
          task.status !== "Done" &&
          task.dueDate &&
          new Date(task.dueDate) < new Date()
        );

      case "unassigned":
        return (
          task.status !== "Done" &&
          !task.assignee
        );

      case "due-this-week":
        return (
          task.status !== "Done" &&
          isDueThisWeek(task.dueDate)
        );

      default:
        return true;
    }
  });

  const isAdmin = isWorkspaceAdmin();
  return (
    <div className="max-h-220 overflow-auto scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-card">

      {/* Header */}
      <div className="hidden border-b border-border bg-surface px-5 py-3 lg:grid lg:grid-cols-[28px_minmax(210px,1.65fr)_minmax(145px,1.15fr)_minmax(95px,.75fr)_minmax(85px,.75fr)_minmax(70px,.65fr)_minmax(110px,.85fr)_55px_90px_36px] lg:items-center lg:gap-3">
        <div />

        <span className="text-xs font-medium text-text-secondary">
          Task
        </span>

        <span className="text-xs font-medium text-text-secondary">
          Project/Requirement
        </span>

        <span className="text-xs font-medium text-text-secondary">
          Assignee
        </span>

        <span className="text-xs font-medium text-text-secondary">
          Status
        </span>

        <span className="text-xs font-medium text-text-secondary">
          Priority
        </span>

        <span className="text-xs font-medium text-text-secondary">
          Due Date
        </span>

        <span className="text-xs font-medium text-text-secondary">
          Est. Effort
        </span>

        <span className="text-xs font-medium text-text-secondary mr-3">
          Actions
        </span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader color="text-primary" /></div>
      ) : error ? (
        <EmptyState icon={CheckSquare} title="Tasks are unavailable" description={error} compact />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={!hasWorkspaceTasks ? "No tasks yet" : insightFilter || !hasScopeTasks ? "No matching tasks" : "No tasks in this view"}
          description={!hasWorkspaceTasks ? "Tasks created across your workspace will appear here." : "Try another task view or clear the current filter."}
          actionLabel={hasWorkspaceTasks ? "Clear filters" : undefined}
          onAction={hasWorkspaceTasks ? onClearFilters : undefined}
          compact
        />
      ) : filteredTasks.map((task) => {
        return (
          <div
          role="button"
          onClick={() => setSelectedTask(task)}
          key={task._id}
          className="border-b border-border px-4 py-3 last:border-b-0 hover:bg-surface/40"
        >
          <div className="hidden lg:grid lg:grid-cols-[28px_minmax(210px,1.65fr)_minmax(145px,1.15fr)_minmax(95px,.75fr)_minmax(85px,.75fr)_minmax(70px,.65fr)_minmax(110px,.85fr)_55px_90px_36px] lg:items-center lg:gap-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedTask?._id === task._id}
              onChange={() => setSelectedTask(task)}
              className="h-4 w-4 cursor-pointer accent-green-600"
            />

            {/* Task */}
            <div className="min-w-0">
              <p className="text-xs text-text-secondary">
                {task._id.slice(task._id.length-4).toUpperCase()}
              </p>

              <h3 className="mt-0.5 truncate text-sm font-semibold text-text-primary">
                {task.title}
              </h3>

              <p className="mt-0.5 truncate text-xs text-text-secondary">
                {task.description}
              </p>
            </div>

            {/* Project */}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {projects.find(project => project._id === task.projectId)?.name}
              </p>

              <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-text-secondary">
                {requirements.find(requirement => requirement._id === task.requirementId)?.name || "No Requirement"}
              </p>
            </div>

            {/* Assignee */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                <Avatar user={task.assignee}/>
              </div>

              <span className="truncate text-xs text-text-primary">
                {task.assignee?.name || "Unassigned"}
              </span>
            </div>

            {/* Status */}
            <StatusBadge status={task.status} />

            {/* Priority */}
            <PriorityBadge priority={task.priority} />

            {/* Due Date */}
            <div>
              <p className="text-xs font-medium text-text-primary">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-- -- --"}
              </p>
            </div>

            {/* Effort */}
            <span className="text-xs font-medium text-text-primary">
              {getRelativeEstimatedTime(task.estimatedEffortMinutes)}
            </span>

            {/* Actions */}
            <div className="relative flex items-center justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(
                    openMenuId === task._id ? null : task._id
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-surface"
              >
                <MoreVertical size={16} />
              </button>

              {openMenuId === task._id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
                >
                  {/* Admin Actions */}
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onEdit(task);
                        }}
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-text-primary transition hover:bg-subtle"
                      >
                        <div className="flex justify-center items-center gap-3">
                          <Pencil size={15} />
                          <span> Edit Task</span>
                        </div>
                      </button>

                      <div className="my-1.5 h-px bg-border" />

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onDelete(task);
                        }}
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition hover:bg-danger-surface"
                      >
                        <div className="flex justify-center items-center gap-3">
                          <Trash2 size={15} />
                          <span>Delete Task</span>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <div className="flex items-start gap-3">
              <CheckSquare
                size={16}
                className="mt-1 shrink-0 text-text-secondary"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-secondary">
                  {task._id}
                </p>

                <h3 className="mt-1 text-sm font-semibold text-text-primary">
                  {task.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {task.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text-secondary">
                      Project
                    </p>
                    <p className="mt-1 text-xs font-medium">
                      {projects.find(project => project._id === task.projectId)?.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">
                      Assignee
                    </p>
                    <p className="mt-1 text-xs font-medium">
                      {task.assignee?.name || "Unassigned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">
                      Due
                    </p>
                    <p className="mt-1 text-xs font-medium">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-- -- --"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label={`Actions for ${task.title}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenMenuId(openMenuId === task._id ? null : task._id);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-surface"
              >
                <MoreVertical size={16} />
              </button>
            </div>

            {openMenuId === task._id && (
              <div
                onClick={(event) => event.stopPropagation()}
                className="mt-3 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg"
              >
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onEdit(task);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-subtle"
                    >
                      <Pencil size={15} /> Edit Task
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onDelete(task);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger-surface"
                    >
                      <Trash2 size={15} /> Delete Task
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        )
      })}
    </div>
  );
}

export default TaskList;
