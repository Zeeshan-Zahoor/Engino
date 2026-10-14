import { ArrowRight, FileText } from "lucide-react";
import EmptyState from "../common/EmptyState";

const statusStyles = {
  "Completed": "bg-success/10 text-success",
  "In Progress": "bg-info/10 text-info",
  "Planned": "bg-primary/10 text-primary",
};

function ProjectRequirements({ project, onViewAll }) {
  const projectRequirements = project?.requirements || [];
  return (
    <section className="rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-text-primary">
          AI Requirements
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Requirements */}
      <div className="divide-y divide-border overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-surface">
        {projectRequirements.length === 0 ? (
          <EmptyState icon={FileText} title="No requirements yet" description="Requirements for this project will appear here." actionLabel="View requirements" onAction={onViewAll} compact />
        ) : (
        projectRequirements.map((requirement) => (
          <div
            key={requirement._id}
            className="flex items-start gap-3 px-5 py-3.5 sm:items-center"
          >
            {/* Icon */}
            <FileText
              size={14}
              strokeWidth={1.8}
              className="shrink-0 text-success"
            />

            {/* Name */}
            <p className="min-w-0 flex-1 break-words text-sm font-medium text-text-primary">
              {requirement?.name}
            </p>

            {/* Status + Date */}
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  statusStyles[requirement?.status]
                }`}
              >
                {requirement?.status}
              </span>

              <span className="text-xs text-text-secondary">
                {requirement?.createdAt ? new Date(requirement.createdAt).toLocaleDateString() : ""}
              </span>
            </div>
          </div>
        ))
        )}
      </div>
    </section>
  );
}

export default ProjectRequirements;
