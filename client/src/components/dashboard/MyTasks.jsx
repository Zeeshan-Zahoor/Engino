import {
  ArrowRight,
  CalendarDays,
  Circle,
  Clock3,
  UserRound,
} from "lucide-react";
import { tasks } from "../../data/tasks";
import useProjectStore from "../../stores/projectStore";

const priorityStyles = {
  High: "bg-red-50 text-danger",
  Medium: "bg-orange-50 text-warning",
  Low: "bg-green-50 text-success",
};

const statusStyles = {
  "In Progress": "bg-blue-50 text-info",
  Todo: "bg-surface text-text-secondary",
  Completed: "bg-green-50 text-success",
  Review: "bg-orange-50 text-warning",
};

const dueStyles = {
  overdue: "text-danger",
  today: "text-danger",
  upcoming: "text-primary",
};


function MyTasks() {
  const projects = useProjectStore(state => state.projects);

  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          {/* Will handle task assigned to current user display after role integration */}
          <h2 className="text-base font-semibold text-text-primary">
            {/* My Tasks */}
             Tasks
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Tasks currently assigned to teams
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
        {(tasks.slice(0, 5)).map((task) => {
          const dueDate = new Date(task.dueDate);
          const today =  new Date();

          const dueDateOnly =  new Date(
            dueDate.getFullYear(),
            dueDate.getMonth(),
            dueDate.getDate()
          );

          const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          )

          const dueClass = dueDateOnly < todayOnly
              ? dueStyles.overdue
              : dueDateOnly > todayOnly
                  ? dueStyles.upcoming
                  : dueStyles.today;
          return (
            <button
              key={task.id}
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
                  {(projects.find(project => project.id === task.projectId))?.name}
                </p>
              </div>

              {/* Assignee */}
              <div className="flex w-20 items-center gap-2">
                {task.assignee ? (
                  <>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                      {task.assignee.initials}
                    </div>

                    <span className="hidden text-xs text-text-secondary xl:block">
                      Assigned
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <UserRound size={14} />
                    <span className="text-xs">Unassigned</span>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="w-16">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
                >
                  {task.priority}
                </span>
              </div>

              {/* Status */}
              <div className="w-24">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[task.status]}`}
                >
                  {task.status}
                </span>
              </div>

              {/* Due Date */}
              <div className={`flex w-24 items-center gap-1 ${dueClass}`}>
                <CalendarDays size={13} />
                <span className="text-xs font-medium">
                  {task.dueDate}
                </span>
              </div>

              <ArrowRight
                size={15}
                className="shrink-0 text-text-secondary"
              />
            </button>
          )
      })}
      </div>
    </section>
  );
}

export default MyTasks;
