import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  UserRound,
} from "lucide-react";
import useProjectStore from "../../stores/projectStore";
import useTaskStore from "../../stores/taskStore";
import useWorkspaceStore from "../../stores/workspaceStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Avatar from "../../utils/Avatar";

const priorityStyles = {
  High: "bg-danger-surface text-danger",
  Medium: "bg-warning-surface text-warning",
  Low: "bg-success-surface text-success",
};

const statusStyles = {
  "In Progress": "bg-info-surface text-info",
  Todo: "bg-surface text-text-secondary",
  Done: "bg-success-surface text-success",
};

const dueStyles = {
  overdue: "text-danger",
  today: "text-danger",
  upcoming: "text-primary",
};


function MyTasks() {
  const navigate = useNavigate();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { projects } = useProjectStore();
  const { allTasks, fetchAllTasks } = useTaskStore();
  
  useEffect(() => {
    if(allTasks.length === 0) {
      fetchAllTasks(currentWorkspaceId);
    }
  }, [currentWorkspaceId, fetchAllTasks, allTasks.length]);
  return (
    <section className="rounded-2xl border border-border bg-card">
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
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Tasks */}
      <div className="divide-y divide-border">
        {(allTasks.slice(0, 5)).map((task) => {
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
              key={task._id}
              type="button"
              onClick={() => navigate(`/tasks?taskId=${task._id}`)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
            >
              {/* Status Icon */}
              <div className="shrink-0">
                {task.status === "Done" ? (
                  <CheckCircle2 
                    size={18}
                    className="text-success"
                    strokeWidth={1.8}
                  />
                ) : task.status === "In Progress" ? (
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
                  {(projects.find(project => project._id === task.projectId))?.name}
                </p>
              </div>

              {/* Assignee */}
              <div className="flex w-20 items-center gap-2">
                {task.assignee ? (
                  <>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                      <Avatar user={task?.assignee}/>
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
              {task.dueDate ? (
                <div className={`flex w-24 items-center gap-1 ${dueClass}`}>
                  <CalendarDays size={13} />
                  <span className="text-xs font-medium">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <div className={`flex w-24 items-center gap-1 text-primary`}>
                  <span className="text-xs font-medium">
                    Not Set
                  </span>
                </div>
              )}

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
