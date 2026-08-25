import { ArrowRight, Sparkles } from "lucide-react";

const requirements = [
  {
    title: "Student Portal",
    project: "Student Portal",
    status: "AI Plan Ready",
    statusClass: "bg-primary-light text-primary",
    complexity: "Medium",
    tasks: "12 tasks",
    updated: "2h ago",
  },
  {
    title: "Attendance Module",
    project: "Student Portal",
    status: "Needs Clarification",
    statusClass: "bg-orange-50 text-warning",
    complexity: "Easy",
    tasks: "—",
    updated: "4h ago",
  },
  {
    title: "Payment Gateway",
    project: "E-Commerce",
    status: "Plan Generated",
    statusClass: "bg-blue-50 text-info",
    complexity: "Hard",
    tasks: "18 tasks",
    updated: "Yesterday",
  },
  {
    title: "Notification System",
    project: "Student Portal",
    status: "Approved",
    statusClass: "bg-green-50 text-success",
    complexity: "Medium",
    tasks: "8 tasks",
    updated: "Yesterday",
  },
];

function RequirementsOverview() {
  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={17} className="text-primary" />

            <h2 className="text-base font-semibold text-text-primary">
              Recent Requirements
            </h2>
          </div>

          <p className="mt-1 text-xs text-text-secondary">
            Latest AI requirement analysis and plans
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Requirements */}
      <div className="divide-y divide-border">
        {requirements.map((requirement) => (
          <button
            key={requirement.title}
            type="button"
            className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
          >
            {/* Requirement */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">
                {requirement.title}
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                {requirement.project}
              </p>
            </div>

            {/* Status */}
            <div className="w-36">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${requirement.statusClass}`}
              >
                {requirement.status}
              </span>
            </div>

            {/* Complexity */}
            <div className="w-20">
              <p className="text-xs font-medium text-text-primary">
                {requirement.complexity}
              </p>

              <p className="mt-0.5 text-xs text-text-secondary">
                Complexity
              </p>
            </div>

            {/* Tasks */}
            <div className="w-20">
              <p className="text-xs font-medium text-text-primary">
                {requirement.tasks}
              </p>

              <p className="mt-0.5 text-xs text-text-secondary">
                Generated
              </p>
            </div>

            {/* Updated */}
            <div className="w-20">
              <p className="text-xs text-text-secondary">
                {requirement.updated}
              </p>
            </div>

            <ArrowRight
              size={16}
              className="shrink-0 text-text-secondary"
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default RequirementsOverview;
