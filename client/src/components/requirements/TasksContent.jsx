import { getRelativeEstimatedTime } from "../../utils/getRelativeTime"

function TasksContent({ requirement }) {
  return (
    <div className="space-y-4 p-6 max-h-100 overflow-auto scrollbar-thin scrollbar-thumb-surface">
        {requirement?.aiTasks?.length > 0 ? (
        <>
            <div>
            <h3 className="text-sm font-semibold text-text-primary">
                Generated Tasks
            </h3>

            <p className="mt-1 text-xs text-text-secondary">
                {requirement.aiTasks.length} task
                {requirement.aiTasks.length !== 1 ? "s" : ""} generated for this
                requirement.
            </p>
            </div>

            <div className="space-y-2">
            {requirement.aiTasks.map((task) => (
                <div
                key={task._id}
                className="rounded-xl border border-border bg-white p-4"
                >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary">
                        {task.title}
                    </h4>

                    {task.description && (
                        <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                        {task.description}
                        </p>
                    )}
                    </div>

                    <span
                    className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold ${
                        task.priority === "High"
                        ? "bg-danger-light text-danger"
                        : task.priority === "Medium"
                        ? "bg-warning-light text-warning"
                        : "bg-success-light text-success"
                    }`}
                    >
                    {task.priority}
                    </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
                    <span className="rounded-md bg-surface px-2 py-1">
                    {task.status}
                    </span>

                    {task.type && (
                    <span className="rounded-md bg-surface px-2 py-1">
                        {task.type}
                    </span>
                    )}

                    {task.complexity && (
                    <span className="rounded-md bg-surface px-2 py-1">
                        {task.complexity}
                    </span>
                    )}

                    {task.estimatedEffortMinutes > 0 && (
                    <span className="px-1">
                        {getRelativeEstimatedTime(
                        task.estimatedEffortMinutes
                        )}
                    </span>
                    )}
                </div>
                </div>
            ))}
            </div>
        </>
        ) : (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border">
            <div className="text-center">
            <h3 className="text-sm font-semibold text-text-primary">
                No Tasks Yet
            </h3>

            <p className="mt-1 text-xs text-text-secondary">
                Tasks generated from this requirement will appear here.
            </p>
            </div>
        </div>
        )}
    </div>
  )
}

export default TasksContent