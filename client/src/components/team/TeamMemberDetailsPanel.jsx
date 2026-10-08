import {
  X,
  Mail,
  Shield,
  ListTodo,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

import Avatar from "../../utils/Avatar";
import { getRelativeEstimatedTime } from "../../utils/getRelativeTime";

function TeamMemberDetailsPanel({ member, tasks = [], isAdmin, onClose }) {
  if (!member) return null;

  const user = member.userId;

  const activeTasks = tasks.filter(
    (task) => task.status !== "Done"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const todoTasks = tasks.filter(
    (task) => task.status === "Todo"
  );

  //dates
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const endOfWeek = new Date(startOfToday);
  const day = endOfWeek.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);

  const overdueTasks = activeTasks.filter((task) => {
    if (!task.dueDate) return false;

    return new Date(task.dueDate) < startOfToday;
  });

  const dueTodayTasks = activeTasks.filter((task) => {
    if (!task.dueDate) return false;

    const date = new Date(task.dueDate);

    return date >= startOfToday && date < endOfToday;
  });

  const dueThisWeekTasks = activeTasks.filter((task) => {
    if (!task.dueDate) return false;

    const date = new Date(task.dueDate);

    return date >= startOfToday && date < endOfWeek;
  });

  const estimatedActiveEffortMinutes = activeTasks.reduce(
    (total, task) =>
      total + (task.estimatedEffortMinutes || 0),
    0
  );


  // helpers
  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No due date";

    const date = new Date(dueDate);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === "Done") {
      return false;
    }

    return new Date(task.dueDate) < startOfToday;
  };

  const isDueToday = (task) => {
    if (!task.dueDate || task.status === "Done") {
      return false;
    }

    const date = new Date(task.dueDate);

    return date >= startOfToday && date < endOfToday;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Done":
        return "bg-success/10 text-success";

      case "In Progress":
        return "bg-warning/10 text-warning";

      default:
        return "bg-surface text-text-secondary";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600";

      case "Medium":
        return "bg-warning/10 text-warning";

      default:
        return "bg-surface text-text-secondary";
    }
  };

  
  // task sorting
  const sortedTasks = [...tasks].sort((a, b) => {
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);

    if (aOverdue !== bOverdue) {
      return aOverdue ? -1 : 1;
    }

    const aToday = isDueToday(a);
    const bToday = isDueToday(b);

    if (aToday !== bToday) {
      return aToday ? -1 : 1;
    }

    if (a.dueDate && b.dueDate) {
      return (
        new Date(a.dueDate) -
        new Date(b.dueDate)
      );
    }

    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    if (
      a.status === "In Progress" &&
      b.status !== "In Progress"
    ) {
      return -1;
    }

    if (
      b.status === "In Progress" &&
      a.status !== "In Progress"
    ) {
      return 1;
    }

    return 0;
  });

  const email = user?.email || "—";

  const maskedEmail =
    email.length > 2
      ? `${email.slice(0, 2)}**********@gmail.com`
      : "—";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 w-full h-full"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-border bg-white shadow-xl scrollbar-thin scrollbar-thumb-text-secondary/30">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Member Details
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Workload and assigned tasks
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* ----------------------------------------
              Profile
          ----------------------------------------- */}
          <div className="border-b border-border px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                <Avatar user={user} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-text-primary">
                  {user?.name || "Unknown User"}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
                  <Mail size={14} />

                  <span className="truncate">
                    {isAdmin ? email : maskedEmail}
                  </span>
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <Shield size={12} />
                  {member.role || "Member"}
                </div>
              </div>
            </div>
          </div>

          {/* Stats  */}
          <div className="grid grid-cols-2 gap-3 border-b border-border p-6 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center gap-2 text-text-secondary">
                <ListTodo size={15} />

                <span className="text-xs">
                  Tasks
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-text-primary">
                {tasks.length}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock3 size={15} />

                <span className="text-xs">
                  Active
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-text-primary">
                {activeTasks.length}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center gap-2 text-text-secondary">
                <CheckCircle2 size={15} />

                <span className="text-xs">
                  Done
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-text-primary">
                {completedTasks.length}
              </p>
            </div>

            <div className="rounded-lg border border-red-100 bg-red-50 p-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={15} />

                <span className="text-xs">
                  Overdue
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-red-600">
                {overdueTasks.length}
              </p>
            </div>
          </div>

          {/* Workload Summary  */}
          <div className="border-b border-border px-6 py-5">
            <h3 className="text-sm font-semibold text-text-primary">
              Workload Summary
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-text-secondary">
                  In Progress
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {inProgressTasks.length}
                </p>
              </div>

              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-text-secondary">
                  To Do
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {todoTasks.length}
                </p>
              </div>

              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-text-secondary">
                  Due Today
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {dueTodayTasks.length}
                </p>
              </div>

              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-text-secondary">
                  Due This Week
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {dueThisWeekTasks.length}
                </p>
              </div>

              <div className="col-span-2 rounded-lg border border-border p-3">
                <p className="text-xs text-text-secondary">
                  Estimated Active Effort
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {getRelativeEstimatedTime(
                    estimatedActiveEffortMinutes
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">
                Assigned Tasks
              </h3>

              <span className="text-xs text-text-secondary">
                {tasks.length} total
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {sortedTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                  <ListTodo
                    size={24}
                    className="mx-auto mb-2 text-text-secondary"
                  />

                  <p className="text-sm font-medium text-text-primary">
                    No assigned tasks
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    This member currently has no tasks assigned.
                  </p>
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <div
                    key={task._id}
                    className="rounded-lg border border-border p-4 transition hover:bg-surface"
                  >
                    {/* Task title */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary">
                          {task.title}
                        </p>

                        {task.requirementId?.name && (
                          <p className="mt-1 truncate text-xs text-text-secondary">
                            Requirement:{" "}
                            {task.requirementId.name}
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-medium ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {task.priority} Priority
                      </span>

                      {task.type && (
                        <span className="rounded-full bg-surface px-2 py-1 text-[11px] font-medium text-text-secondary">
                          {task.type}
                        </span>
                      )}

                      {task.complexity && (
                        <span className="rounded-full bg-surface px-2 py-1 text-[11px] font-medium text-text-secondary">
                          {task.complexity}
                        </span>
                      )}
                    </div>

                    {/* Due date + effort */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                      <div
                        className={`flex items-center gap-1.5 ${
                          isOverdue(task)
                            ? "font-medium text-red-600"
                            : isDueToday(task)
                            ? "font-medium text-warning"
                            : "text-text-secondary"
                        }`}
                      >
                        {isOverdue(task) ? (
                          <AlertTriangle size={14} />
                        ) : (
                          <CalendarClock size={14} />
                        )}

                        <span>
                          {isOverdue(task)
                            ? `Overdue · ${formatDueDate(
                                task.dueDate
                              )}`
                            : isDueToday(task)
                            ? "Due Today"
                            : formatDueDate(task.dueDate)}
                        </span>
                      </div>

                      {task.estimatedEffortMinutes > 0 && (
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          <Clock3 size={14} />

                          <span>
                            {getRelativeEstimatedTime(
                              task.estimatedEffortMinutes
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {task.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default TeamMemberDetailsPanel;