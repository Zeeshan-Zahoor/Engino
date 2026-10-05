import {
  X,
  ChevronDown,
  MoreVertical,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";
import useAuthStore from "../../stores/authStore";
import Avatar from "../../utils/Avatar";
import { getRelativeEstimatedTime } from "../../utils/getRelativeTime";

const statusStyles = {
    "In Progress": "bg-blue-50 text-info",
    Todo: "bg-blue-50 text-info",
    // "In Review": "bg-purple-50 text-primary",
    Done: "bg-green-50 text-success",
  };

const complexityStyles = {
  High: "text-danger",
  Medium: "text-warning",
  Low: "text-success",
};

const priorityStyles = {
  High: "text-danger",
  Medium: "text-warning",
  Low: "text-success",
};

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-text-secondary">
        {label}
      </span>

      <div className="text-right text-sm font-medium text-text-primary">
        {children}
      </div>
    </div>
  );
}

function TaskDetailsPanel({ task, requirements, setSelectedTask }) {
  if(!task) return null;
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useAuthStore();
  const isAdmin = isWorkspaceAdmin();
 
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-white">
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-secondary">
              {task._id.slice(task._id.length-4).toUpperCase()}
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-6 text-text-primary">
              {task.title}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
              <span className="text-primary text-lg">▣</span>
              <span>{requirements.find(requirement => requirement._id === task.requirementId)?.name || "No Linked Requirement"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTask(null)}
            className="shrink-0 text-text-secondary transition hover:text-text-primary"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status */}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className={`flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold ${statusStyles[task.status]}`}
          >
            {task.status}
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Description */}
        <section className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Description
          </h3>

          <p className="mt-3 text-sm leading-5 text-text-secondary">
            {task.description}
          </p> 
        
        </section>

        {/* Details */}
        <section className="space-y-4 border-b border-border p-4">
          <DetailRow label="Assignee">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                <Avatar user={task.assignee}/>
              </div>
              {task.assignee?.name || "Unassigned"}
            </div>
          </DetailRow>

          <DetailRow label="Reporter">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                <Avatar user={task.reporter}/>
              </div>
              {task.reporter?.name || "Unknown"}
            </div>
          </DetailRow>

          <DetailRow label="Priority">
            <span className={`inline-flex rounded-md bg-red-50 px-2 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
          </DetailRow>

          <DetailRow label="Due Date">
            <div>
              <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-- -- --"}</span>
            </div>
          </DetailRow>

          <DetailRow label="Estimated Effort">
            {getRelativeEstimatedTime(task.estimatedEffortMinutes)}
          </DetailRow>

          <DetailRow label="Time Spent">
            {task.timeSpent || "Yet to implement"} 
          </DetailRow>

          <DetailRow label="Task Type">
            <span className="inline-flex rounded-md bg-purple-50 px-2 py-1 text-xs font-semibold text-primary">
              {task.type}
            </span>
          </DetailRow>

          <DetailRow label="Complexity">
            <div className="flex items-center gap-2">
                <ComplexityStyling 
                  complexity={task.complexity}
                  valueClassName={complexityStyles[task.complexity]}
                />
            </div>
          </DetailRow>
        </section>

        {/* Tags */}
        <section className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Tags
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {task.tags.map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ),
            )}

          </div>
        </section>

        <section className="border-b border-border p-4">
          <div className="mt-2 flex items-center justify-end gap-1 text-xs text-text-secondary">
            <Clock3 size={13} />
            {task.timeSpent} of {task.effort}
          </div>
        </section>

        {/* Linked Requirement */}
        <section className="p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Linked Requirement
          </h3>

          <div className="mt-3 rounded-lg bg-purple-50 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-primary">
                <CheckCircle2 size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  {requirements.find(requirement => requirement._id === task.requirementId)?.name || "No Linked Requirement"}
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  {requirements.find(requirement => requirement._id === task.requirementId)?._id.slice(task.requirementId.length-4).toUpperCase() || ""}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border p-3">
        {(isAdmin || task.assignee?._id === user?._id) && (
          <div className="flex gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface"
          >
            <MoreVertical size={16} />
            More Actions
          </button>

          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Update Status
            <ChevronDown size={15} />
          </button>
        </div>
        )}
      </div>
    </aside>
  );
}

function ComplexityStyling ({ complexity, valueClassName }) {
  return(
    <div className="flex gap-2 items-center">
      {complexity === "Medium"
          ? (
            <div className="mt-2 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
          )
          : complexity === "High"
                ? (
                  <div className="mt-2 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                )
                : (
                  <div className="mt-2 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                )
    
    }
      <span
        className={`mt-1 text-sm font-semibold ${valueClassName}`}
      >
        {complexity}
      </span>
    </div>
  )
}

export default TaskDetailsPanel;