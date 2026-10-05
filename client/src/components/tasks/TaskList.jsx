import { CheckSquare, MoreVertical } from "lucide-react";
import Avatar from "../../utils/Avatar";
import { getRelativeEstimatedTime } from "../../utils/getRelativeTime";

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-blue-50 text-info",
    Todo: "bg-blue-50 text-info",
    // "In Review": "bg-purple-50 text-primary",
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

function TaskList({ projects, requirements, tasks, selectedTask, setSelectedTask, insightFilter }) {

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
  return (
    <div className="max-h-220 overflow-auto scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-white">

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
      {filteredTasks?.map((task) => {
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

              <MoreVertical
                size={16}
                className="shrink-0 text-text-secondary"
              />
            </div>
          </div>
        </div>
        )
      })}
    </div>
  );
}

export default TaskList;