import {
  ArrowRight,
  CalendarDays,
  Circle,
  Clock3,
  UserRound,
} from "lucide-react";

const tasks = [
  {
    title: "Attendance API Integration",
    project: "Student Portal · Attendance Module",
    assignee: "ZZ",
    priority: "High",
    priorityClass: "bg-red-50 text-danger",
    status: "In Progress",
    statusClass: "bg-blue-50 text-info",
    due: "Due today",
    dueClass: "text-danger",
  },
  {
    title: "Student Login UI",
    project: "Student Portal · Authentication",
    assignee: "GA",
    priority: "Medium",
    priorityClass: "bg-orange-50 text-warning",
    status: "In Progress",
    statusClass: "bg-blue-50 text-info",
    due: "Due tomorrow",
    dueClass: "text-text-secondary",
  },
  {
    title: "Assignment Submission API",
    project: "Student Portal · Assignment System",
    assignee: null,
    priority: "High",
    priorityClass: "bg-red-50 text-danger",
    status: "Todo",
    statusClass: "bg-surface text-text-secondary",
    due: "Due Aug 25",
    dueClass: "text-text-secondary",
  },
  {
    title: "Notification Settings",
    project: "Student Portal · Notifications",
    assignee: "AR",
    priority: "Low",
    priorityClass: "bg-green-50 text-success",
    status: "In Progress",
    statusClass: "bg-blue-50 text-info",
    due: "Due Aug 27",
    dueClass: "text-text-secondary",
  },
];

function MyTasks() {
  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            My Tasks
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Tasks currently assigned to you
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Tasks */}
      <div className="divide-y divide-border">
        {tasks.map((task) => (
          <button
            key={task.title}
            type="button"
            className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
          >
            {/* Status Icon */}
            <div className="shrink-0">
              {task.status === "In Progress" ? (
                <Clock3
                  size={18}
                  className="text-info"
                  strokeWidth={1.8}
                />
              ) : (
                <Circle
                  size={18}
                  className="text-text-secondary"
                  strokeWidth={1.8}
                />
              )}
            </div>

            {/* Task Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">
                {task.title}
              </p>

              <p className="mt-1 truncate text-xs text-text-secondary">
                {task.project}
              </p>
            </div>

            {/* Assignee */}
            <div className="flex w-20 items-center gap-2">
              {task.assignee ? (
                <>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-[10px] font-semibold text-primary">
                    {task.assignee}
                  </div>

                  <span className="hidden text-[10px] text-text-secondary xl:block">
                    Assigned
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <UserRound size={14} />
                  <span className="text-[10px]">Unassigned</span>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="w-16">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${task.priorityClass}`}
              >
                {task.priority}
              </span>
            </div>

            {/* Status */}
            <div className="w-24">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${task.statusClass}`}
              >
                {task.status}
              </span>
            </div>

            {/* Due Date */}
            <div className={`flex w-24 items-center gap-1 ${task.dueClass}`}>
              <CalendarDays size={13} />
              <span className="text-[10px] font-medium">
                {task.due}
              </span>
            </div>

            <ArrowRight
              size={15}
              className="shrink-0 text-text-secondary"
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default MyTasks;