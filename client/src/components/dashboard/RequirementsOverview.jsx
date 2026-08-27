import { ArrowRight, Sparkles } from "lucide-react";
import { requirements } from "../../data/requirements";
import useProjectStore from "../../stores/projectStore";

const statusStyles = {
  "AI Plan Ready": "bg-primary-light text-primary",
  "Needs Clarification": "bg-orange-50 text-warning",
  "Plan Generated": "bg-blue-50 text-info",
  Approved: "bg-green-50 text-success",
  Pending: "bg-surface text-text-secondary",
};

function RequirementsOverview() {

  const projects = useProjectStore(state => state.projects);
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
        {/* temporary until we get exact timestamps from mongodb */}
        {(requirements.slice(0, 5)).map((requirement) => (
          <button
            key={requirement.id}
            type="button"
            className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
          >
            {/* Requirement */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">
                {requirement.name}
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                {projects.find(project => (project.id === requirement.projectId))?.name}
              </p>
            </div>

            {/*AI Status */}
            <div className="w-36">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[requirement.aiStatus]}`}
              >
                {requirement.aiStatus}
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
                {requirement.generatedTasks}
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
