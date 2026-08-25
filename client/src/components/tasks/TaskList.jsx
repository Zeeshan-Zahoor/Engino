import { CheckSquare, MoreVertical } from "lucide-react";

const tasks = [
  {
    id: "TSK-1024",
    title: "Build Attendance API",
    description: "Develop REST API for attendance marking and retrieval.",
    project: "Student Portal",
    requirement: "Student Attendance Tracking System",
    assignee: "Ahmed Khan",
    initials: "AK",
    status: "In Progress",
    priority: "High",
    dueDate: "May 28, 2025",
    dueLabel: "2 days left",
    effort: "8h",
    progress: 60,
  },
  {
    id: "TSK-1025",
    title: "Attendance Percentage Calculation",
    description: "Calculate student attendance percentage and status.",
    project: "Student Portal",
    requirement: "Student Attendance Tracking System",
    assignee: "Ganga",
    initials: "GA",
    status: "To Do",
    priority: "Medium",
    dueDate: "May 30, 2025",
    dueLabel: "4 days left",
    effort: "5h",
    progress: 0,
  },
  {
    id: "TSK-1026",
    title: "Attendance Report Generation",
    description: "Generate PDF/Excel attendance reports for students.",
    project: "Student Portal",
    requirement: "Student Attendance Tracking System",
    assignee: "Areeb",
    initials: "AR",
    status: "In Review",
    priority: "Medium",
    dueDate: "May 26, 2025",
    dueLabel: "Due today",
    effort: "6h",
    progress: 90,
  },
  {
    id: "TSK-1027",
    title: "Attendance Module UI",
    description: "Build UI for attendance dashboard and student view.",
    project: "Student Portal",
    requirement: "Student Attendance Tracking System",
    assignee: "Zeeshan",
    initials: "ZZ",
    status: "In Progress",
    priority: "High",
    dueDate: "May 29, 2025",
    dueLabel: "3 days left",
    effort: "10h",
    progress: 40,
  },
  {
    id: "TSK-1031",
    title: "Student Login API",
    description: "Implement secure student login and authentication.",
    project: "Student Portal",
    requirement: "Secure User Authentication",
    assignee: "Zeeshan",
    initials: "ZZ",
    status: "Completed",
    priority: "High",
    dueDate: "May 20, 2025",
    dueLabel: "Completed",
    effort: "6h",
    progress: 100,
  },
  {
    id: "TSK-1032",
    title: "Password Reset API",
    description: "Create password reset and email verification flow.",
    project: "Student Portal",
    requirement: "Secure User Authentication",
    assignee: "Ganga",
    initials: "GA",
    status: "Completed",
    priority: "Medium",
    dueDate: "May 21, 2025",
    dueLabel: "Completed",
    effort: "4h",
    progress: 100,
  },
  {
    id: "TSK-1033",
    title: "Role-Based Access Middleware",
    description: "Implement role-based access control middleware.",
    project: "Student Portal",
    requirement: "Secure User Authentication",
    assignee: "Areeb",
    initials: "AR",
    status: "To Do",
    priority: "Medium",
    dueDate: "Jun 02, 2025",
    dueLabel: "1 week left",
    effort: "6h",
    progress: 0,
  },
  {
    id: "TSK-1041",
    title: "Email Notifications Service",
    description: "Send email notifications for attendance alerts and announcements.",
    project: "Notification System",
    requirement: "Real-time Notification System",
    assignee: "Zeeshan",
    initials: "ZZ",
    status: "To Do",
    priority: "Low",
    dueDate: "Jun 05, 2025",
    dueLabel: "8 days left",
    effort: "5h",
    progress: 0,
  },
];

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-blue-50 text-info",
    "To Do": "bg-blue-50 text-info",
    "In Review": "bg-purple-50 text-primary",
    Completed: "bg-green-50 text-success",
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
    High: "bg-red-50 text-danger",
    Medium: "bg-orange-50 text-warning",
    Low: "bg-green-50 text-success",
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

function ProgressBar({ progress }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full ${
            progress === 100
              ? "bg-success"
              : progress > 0
                ? "bg-primary"
                : "bg-border"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-xs text-text-secondary">
        {progress}%
      </span>
    </div>
  );
}

function TaskList() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      {/* Header */}
      <div className="hidden border-b border-border bg-surface px-4 py-3 lg:grid lg:grid-cols-[28px_minmax(210px,1.65fr)_minmax(145px,1.15fr)_minmax(95px,.75fr)_minmax(85px,.75fr)_minmax(70px,.65fr)_minmax(110px,.85fr)_55px_90px_36px] lg:items-center lg:gap-3">
        <div />

        <span className="text-xs font-medium text-text-secondary">
          Task
        </span>

        <span className="text-xs font-medium text-text-secondary">
          Project / Requirement
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

        <span className="text-xs font-medium text-text-secondary">
          Progress
        </span>

        <span className="text-xs font-medium text-text-secondary">
          Actions
        </span>
      </div>

      {/* Rows */}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="border-b border-border px-4 py-3 last:border-b-0 hover:bg-surface/40"
        >
          <div className="hidden lg:grid lg:grid-cols-[28px_minmax(210px,1.65fr)_minmax(145px,1.15fr)_minmax(95px,.75fr)_minmax(85px,.75fr)_minmax(70px,.65fr)_minmax(110px,.85fr)_55px_90px_36px] lg:items-center lg:gap-3">
            {/* Checkbox */}
            <button
              type="button"
              className="flex items-center justify-center"
            >
              <CheckSquare
                size={16}
                className="text-text-secondary"
              />
            </button>

            {/* Task */}
            <div className="min-w-0">
              <p className="text-xs text-text-secondary">
                {task.id}
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
                {task.project}
              </p>

              <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-text-secondary">
                {task.requirement}
              </p>
            </div>

            {/* Assignee */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                {task.initials}
              </div>

              <span className="truncate text-xs text-text-primary">
                {task.assignee}
              </span>
            </div>

            {/* Status */}
            <StatusBadge status={task.status} />

            {/* Priority */}
            <PriorityBadge priority={task.priority} />

            {/* Due Date */}
            <div>
              <p className="text-xs font-medium text-text-primary">
                {task.dueDate}
              </p>

              <p
                className={`mt-0.5 text-xs ${
                  task.dueLabel === "Due today"
                    ? "font-semibold text-danger"
                    : task.dueLabel === "Completed"
                      ? "text-success"
                      : "text-text-secondary"
                }`}
              >
                {task.dueLabel}
              </p>
            </div>

            {/* Effort */}
            <span className="text-xs font-medium text-text-primary">
              {task.effort}
            </span>

            {/* Progress */}
            <ProgressBar progress={task.progress} />

            {/* Actions */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-surface"
            >
              <MoreVertical size={16} />
            </button>
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
                  {task.id}
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
                      {task.project}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">
                      Assignee
                    </p>
                    <p className="mt-1 text-xs font-medium">
                      {task.assignee}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">
                      Due
                    </p>
                    <p className="mt-1 text-xs font-medium">
                      {task.dueDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">
                      Progress
                    </p>

                    <div className="mt-1">
                      <ProgressBar progress={task.progress} />
                    </div>
                  </div>
                </div>
              </div>

              <MoreVertical
                size={16}
                className="shrink-0 text-text-secondary"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;