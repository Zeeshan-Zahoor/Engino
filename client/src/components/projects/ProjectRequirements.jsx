import { ArrowRight, FileText } from "lucide-react";

const requirements = [
  {
    name: "User Authentication & Authorization",
    status: "Completed",
    date: "May 15, 2025",
  },
  {
    name: "Student Dashboard & Profile",
    status: "Completed",
    date: "May 16, 2025",
  },
  {
    name: "Attendance Management",
    status: "In Progress",
    date: "May 18, 2025",
  },
  {
    name: "Assignment Management",
    status: "In Progress",
    date: "May 20, 2025",
  },
  {
    name: "Notification System",
    status: "Planned",
    date: "May 22, 2025",
  },
];

const statusStyles = {
  Completed: "bg-green-50 text-success",
  "In Progress": "bg-blue-50 text-info",
  Planned: "bg-surface text-text-secondary",
};

function ProjectRequirements() {
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
        {requirements.map((requirement) => (
          <div
            key={requirement.name}
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
              {requirement.name}
            </p>

            {/* Status + Date */}
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  statusStyles[requirement.status]
                }`}
              >
                {requirement.status}
              </span>

              <span className="text-xs text-text-secondary">
                {requirement.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectRequirements;
