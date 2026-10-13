import { Clock3, FileText } from "lucide-react";
import useProjectStore from "../../stores/projectStore";
import Avatar from "../../utils/Avatar";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";

const statusStyles = {
  "Plan Generated": "bg-success-surface text-success",
  "AI Plan Ready": "bg-primary-light text-primary",
  "Needs Clarification": "bg-warning-surface text-warning",
  "Pending": "bg-subtle text-text-secondary",
  "Approved": "bg-success-surface text-success",
};

const complexityStyles = {
  High: "bg-danger-surface text-danger",
  Medium: "bg-warning-surface text-warning",
  Low: "bg-success-surface text-success",
};

function RequirementsList({ 
  requirements,
  selectedRequirement,
  setSelectedRequirement,
  loading,
  error,
  hasRequirements,
  hasSearch,
  onClearSearch,
 }) {

  const projects = useProjectStore(state => state.projects);
  console.log("Requirements: ", requirements)
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card transition-all">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Requirements
            </h2>

            <p className="mt-1 text-xs text-text-secondary">
              Select a requirement to view its details
            </p>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden grid-cols-[minmax(220px,2fr)_1fr_1fr_0.8fr_0.8fr] gap-4 border-b border-border bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary xl:grid">
        <span>Requirement</span>
        <span>Project</span>
        <span>Status</span>
        <span>Complexity</span>
        <span>Owner</span>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader color="text-primary" /></div>
        ) : error ? (
          <EmptyState icon={FileText} title="Requirements are unavailable" description={error} compact />
        ) : requirements.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={hasRequirements && hasSearch ? "No matching requirements" : "No requirements yet"}
            description={hasRequirements && hasSearch ? "Try a different search or clear the search field." : "Create a requirement to start an AI-assisted engineering plan."}
            actionLabel={hasRequirements && hasSearch ? "Clear search" : undefined}
            onAction={hasRequirements && hasSearch ? onClearSearch : undefined}
            compact
          />
        ) : (
        requirements.map((requirement) => (
          <button
            key={requirement._id}
            onClick={() => setSelectedRequirement(requirement)}
            type="button"
            // no need to worry for selected state right now
            className={`w-full text-left transition ${
              requirement._id === selectedRequirement?._id
                ? "bg-primary-light/40"
                : "hover:bg-surface"
            }`}
          >
            {/* Desktop */}
            <div className="hidden grid-cols-[minmax(220px,2fr)_1fr_1fr_0.8fr_0.8fr] items-center gap-4 px-5 py-4 xl:grid">
              {/* Requirement */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    requirement._id === selectedRequirement?._id
                      ? "bg-primary text-white"
                      : "bg-surface text-text-secondary"
                  }`}
                >
                  <FileText size={15} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {requirement.name}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                    <Clock3 size={10} />
                    Updated {requirement.updatedAt ? new Date(requirement.updatedAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>

              {/* Project */}
              <span className="truncate text-xs text-text-secondary">
                {projects.find(project => project._id === requirement.projectId)?.name}
              </span>

              {/* Status */}
              <span
                className={`w-fit rounded-md px-2 py-1 text-xs font-medium ${
                  statusStyles[requirement.aiStatus]
                }`}
              >
                {requirement.aiStatus}
              </span>

              {/* Complexity */}
              <span
                className={`w-fit rounded-md px-2 py-1 text-xs font-medium ${
                  complexityStyles[requirement.complexity]
                }`}
              >
                {requirement.complexity}
              </span>

              {/* Owner */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                  <Avatar user={requirement.owner}/>
                </div>

                <span className="truncate text-xs text-text-secondary">
                  {requirement.owner.name}
                </span>
              </div>
            </div>

            {/* Mobile / Tablet */}
            <div className="flex items-start gap-3 px-4 py-4 xl:hidden">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  requirement._id === selectedRequirement?._id
                    ? "bg-primary text-white"
                    : "bg-surface text-text-secondary"
                }`}
              >
                <FileText size={15} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-text-primary">
                    {requirement.name}
                  </p>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                    <Avatar user={requirement.owner}/>
                  </div>
                </div>

                <p className="mt-1 text-xs text-text-secondary">
                  {projects.find(project => project._id === requirement.projectId)?.name}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      statusStyles[requirement.aiStatus]
                    }`}
                  >
                    {requirement.aiStatus}
                  </span>

                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      complexityStyles[requirement.complexity]
                    }`}
                  >
                    {requirement.complexity}
                  </span>

                  <span className="text-xs text-text-secondary">
                    Updated {requirement.updatedAt ? new Date(requirement.updatedAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))
        )}
      </div>

    </section>
  );
}

export default RequirementsList;
