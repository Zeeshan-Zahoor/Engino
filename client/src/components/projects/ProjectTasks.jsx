import { ArrowRight, Check, Circle } from "lucide-react";
import Avatar from "../../utils/Avatar";

const priorityStyles = {
  High: "bg-red-50 text-danger",
  Medium: "bg-orange-50 text-warning",
  Low: "bg-green-50 text-success",
};

function ProjectTasks({ project }) {
  const projectTasks = project?.tasks || [];

  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-text-primary">
          Tasks
        </h2>

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Task list */}
      <div className="divide-y divide-border">
        {projectTasks.slice(0, 5).map((task) => (
          <div
            key={task._id}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 px-5 py-3.5 sm:grid-cols-[auto_minmax(0,1fr)_90px_75px_90px] sm:items-center"
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
            <p className="min-w-0 truncate text-sm font-medium text-text-primary">
              {task?.title}
            </p>

            {/* Assignee */}
            {task?.assignee && (
              <div className="hidden items-center gap-2 sm:flex">
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
              className={`hidden w-fit rounded-md px-2 py-1 text-xs font-medium sm:inline-flex ${
                priorityStyles[task?.priority]
              }`}
            >
              {task?.priority}
            </span>

            {/* Due date */}
            <span className="hidden text-right text-xs text-text-secondary sm:block">
              {task?.dueDate ? new Date(task.dueDate) : ""}
            </span>

            {/* Mobile metadata */}
            <div className="col-start-2 flex items-center gap-3 sm:hidden">
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
                {task?.dueDate ? new Date(task.dueDate) : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectTasks;
