import { ArrowRight, Check, Circle } from "lucide-react";

const tasks = [
  {
    name: "Setup project architecture",
    assignee: "Zeeshan",
    initials: "ZZ",
    priority: "High",
    dueDate: "May 12, 2025",
    completed: true,
  },
  {
    name: "Implement authentication",
    assignee: "Ganga",
    initials: "GA",
    priority: "High",
    dueDate: "May 14, 2025",
    completed: true,
  },
  {
    name: "Design student dashboard",
    assignee: "Areeb",
    initials: "AR",
    priority: "Medium",
    dueDate: "May 16, 2025",
    completed: true,
  },
  {
    name: "Attendance module",
    assignee: "Zeeshan",
    initials: "ZZ",
    priority: "Medium",
    dueDate: "May 26, 2025",
    completed: false,
  },
  {
    name: "Assignment submission",
    assignee: "Ganga",
    initials: "GA",
    priority: "Medium",
    dueDate: "May 28, 2025",
    completed: false,
  },
  {
    name: "Notification system",
    assignee: "Areeb",
    initials: "AR",
    priority: "Low",
    dueDate: "Jun 02, 2025",
    completed: false,
  },
];

const priorityStyles = {
  High: "bg-red-50 text-danger",
  Medium: "bg-orange-50 text-warning",
  Low: "bg-green-50 text-success",
};

function ProjectTasks() {
  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-text-primary">
          Tasks
        </h2>

        <button
          type="button"
          className="flex items-center gap-1 text-[10px] font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Task list */}
      <div className="divide-y divide-border">
        {tasks.map((task) => (
          <div
            key={task.name}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-5 py-3.5 sm:grid-cols-[auto_minmax(0,1fr)_90px_75px_90px] sm:items-center"
          >
            {/* Completion */}
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                task.completed
                  ? "bg-success text-white"
                  : "border-2 border-info text-transparent"
              }`}
            >
              {task.completed ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <Circle size={7} fill="currentColor" />
              )}
            </div>

            {/* Task name */}
            <p className="min-w-0 truncate text-[11px] font-medium text-text-primary">
              {task.name}
            </p>

            {/* Assignee */}
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-[8px] font-semibold text-primary">
                {task.initials}
              </div>

              <span className="truncate text-[10px] text-text-secondary">
                {task.assignee}
              </span>
            </div>

            {/* Priority */}
            <span
              className={`hidden w-fit rounded-md px-2 py-1 text-[9px] font-medium sm:inline-flex ${
                priorityStyles[task.priority]
              }`}
            >
              {task.priority}
            </span>

            {/* Due date */}
            <span className="hidden text-right text-[9px] text-text-secondary sm:block">
              {task.dueDate}
            </span>

            {/* Mobile metadata */}
            <div className="col-start-2 flex items-center gap-3 sm:hidden">
              <span className="text-[9px] text-text-secondary">
                {task.assignee}
              </span>

              <span
                className={`rounded-md px-2 py-1 text-[9px] font-medium ${
                  priorityStyles[task.priority]
                }`}
              >
                {task.priority}
              </span>

              <span className="text-[9px] text-text-secondary">
                {task.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectTasks;