import { ArrowRight, FileText } from "lucide-react";

const statusStyles = {
  "Completed": "bg-green-50 text-success",
  "In Progress": "bg-blue-50 text-info",
  "Planned": "bg-surface text-text-secondary",
};

function ProjectRequirements({ project }) {
  const projectRequirements = project?.requirements || [];
  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-text-primary">
          AI Requirements
        </h2>

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Requirements */}
      <div className="divide-y divide-border">
        {projectRequirements.map((requirement) => (
          <div
            key={requirement._id}
            className="flex items-center gap-3 px-5 py-3.5"
          >
            {/* Icon */}
            <FileText
              size={14}
              strokeWidth={1.8}
              className="shrink-0 text-success"
            />

            {/* Name */}
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
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
                {requirement?.createdAt ? new Date(requirement.createdAt) : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectRequirements;
