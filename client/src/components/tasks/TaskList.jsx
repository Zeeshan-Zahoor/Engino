import { CheckSquare, MoreVertical } from "lucide-react";
import { tasks } from "../../data/tasks";
import useProjectStore from '../../stores/projectStore';
import { requirements } from '../../data/requirements';
import { getInitials } from '../../utils/getInitials';

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

function TaskList({ selectedTask, setSelectedTask }) {
  const projects = useProjectStore(state => state.projects);
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
      {(tasks.slice(0, 8)).map((task) => (
        <div
          role="button"
          onClick={() => setSelectedTask(task)}
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
                fill={selectedTask.id === task.id ? "green" : "none"}
                className={`${selectedTask.id === task.id ? "text-white" : "text-text-secondary"}`}
              />
            </button>

            {/* Task */}
            <div className="min-w-0">
              <p className="text-xs text-text-secondary">
                {task.id.toUpperCase()}
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
                {projects.find(project => project.id === task.projectId)?.name}
              </p>

              <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-text-secondary">
                {requirements.find(requirement => requirement.id === task.requirementId)?.name}
              </p>
            </div>

            {/* Assignee */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                {getInitials(task.assignee?.name)}
              </div>

              <span className="truncate text-xs text-text-primary">
                {task.assignee?.name}
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

              <p className="text-xs font-medium text-text-primary">
                {task.dueDate}
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
                      {projects.find(project => project.id === task.projectId)?.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">
                      Assignee
                    </p>
                    <p className="mt-1 text-xs font-medium">
                      {task.assignee?.name}
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