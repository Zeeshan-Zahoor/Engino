import { ArrowRight, Check, Circle } from "lucide-react";
import Avatar from "../../utils/Avatar";
import EmptyState from "../common/EmptyState";

const priorityStyles = {
  High: "bg-danger-surface text-danger",
  Medium: "bg-warning-surface text-warning",
  Low: "bg-success-surface text-success",
};

function ProjectTasks({ project,onViewAll }) {
  const projectTasks = project?.tasks || [];

  return (
    <section className="rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-text-primary">
          Tasks
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Task list */}
      <div className="divide-y divide-border overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-surface">
        {projectTasks.length === 0 ? (
          <EmptyState icon={Circle} title="No tasks yet" description="Tasks for this project will appear here." actionLabel="View tasks" onAction={onViewAll} compact />
        ) : (
        projectTasks.slice(0, 5).map((task) => (
          <div
            key={task._id}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-5 py-3.5 sm:gap-5 sm:items-center xl:grid-cols-[auto_minmax(0,1fr)_90px_75px_90px]"
          >
            {/* Completion */}
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                task?.status === "Done"
                  ? "bg-success text-white"
                  : "border-2 border-info text-transparent"
              }`}
            >
              {task?.status === "Done" ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <Circle size={7} fill="currentColor" />
              )}
            </div>

            {/* Task name */}
            <p className="min-w-0 break-words text-sm font-medium text-text-primary">
              {task?.title}
            </p>

            {/* Assignee */}
            {task?.assignee && (
              <div className="hidden items-center gap-2 xl:flex">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                  <Avatar user={task?.assignee}/>
                </div>

                <span className="truncate text-xs text-text-secondary">
                  {task?.assignee?.name}
                </span>
              </div>
            )}

            {/* Priority */}
            <span
              className={`hidden w-fit rounded-md px-2 py-1 text-xs font-medium xl:inline-flex ${
                priorityStyles[task?.priority]
              }`}
            >
              {task?.priority}
            </span>

            {/* Due date */}
            <span className="hidden text-right text-xs text-text-secondary xl:block">
              {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
            </span>

            {/* Mobile metadata */}
            <div className="col-start-2 flex flex-wrap items-center gap-3 xl:hidden">
              <span className="text-xs text-text-secondary">
                {task?.assignee?.name}
              </span>

              <span
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  priorityStyles[task?.priority]
                }`}
              >
                {task?.priority}
              </span>

              <span className="text-xs text-text-secondary">
                {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
              </span>
            </div>
          </div>
        ))
        )}
      </div>
    </section>
  );
}

export default ProjectTasks;
