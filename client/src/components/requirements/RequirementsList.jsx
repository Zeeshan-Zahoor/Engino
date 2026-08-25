import { Clock3, FileText } from "lucide-react";

const requirements = [
  {
    title: "Student Attendance Tracking",
    project: "Student Portal",
    status: "Plan Generated",
    complexity: "Medium",
    owner: "Zeeshan",
    initials: "ZZ",
    updated: "2h ago",
    selected: true,
  },
  {
    title: "User Authentication & Authorization",
    project: "Student Portal",
    status: "Plan Generated",
    complexity: "High",
    owner: "Ganga",
    initials: "GA",
    updated: "5h ago",
  },
  {
    title: "Assignment Submission Workflow",
    project: "Student Portal",
    status: "AI Clarification",
    complexity: "High",
    owner: "Areeb",
    initials: "AR",
    updated: "1d ago",
  },
  {
    title: "Notification Preferences",
    project: "Student Portal",
    status: "Approved",
    complexity: "Low",
    owner: "Zeeshan",
    initials: "ZZ",
    updated: "2d ago",
  },
  {
    title: "Student Profile Management",
    project: "Student Portal",
    status: "Plan Generated",
    complexity: "Medium",
    owner: "Ganga",
    initials: "GA",
    updated: "3d ago",
  },
  {
    title: "Assignment Management",
    project: "Student Portal",
    status: "AI Clarification",
    complexity: "Medium",
    owner: "Areeb",
    initials: "AR",
    updated: "4d ago",
  },
  {
    title: "Real-time Notifications",
    project: "Notification System",
    status: "Ready to Generate",
    complexity: "Low",
    owner: "Zeeshan",
    initials: "ZZ",
    updated: "5d ago",
  },
];

const statusStyles = {
  "Ready to Generate": "bg-green-50 text-success",
  "Plan Generated": "bg-blue-50 text-info",
  "AI Clarification": "bg-orange-50 text-warning",
  Approved: "bg-purple-50 text-primary",
};

const complexityStyles = {
  High: "bg-red-50 text-danger",
  Medium: "bg-orange-50 text-warning",
  Low: "bg-green-50 text-success",
};

function RequirementsList() {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white">
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

          <span className="text-xs font-medium text-text-secondary">
            12 requirements
          </span>
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
        {requirements.map((requirement) => (
          <button
            key={requirement.title}
            type="button"
            className={`w-full text-left transition ${
              requirement.selected
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
                    requirement.selected
                      ? "bg-primary text-white"
                      : "bg-surface text-text-secondary"
                  }`}
                >
                  <FileText size={15} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {requirement.title}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                    <Clock3 size={10} />
                    Updated {requirement.updated}
                  </p>
                </div>
              </div>

              {/* Project */}
              <span className="truncate text-xs text-text-secondary">
                {requirement.project}
              </span>

              {/* Status */}
              <span
                className={`w-fit rounded-md px-2 py-1 text-xs font-medium ${
                  statusStyles[requirement.status]
                }`}
              >
                {requirement.status}
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
                  {requirement.initials}
                </div>

                <span className="truncate text-xs text-text-secondary">
                  {requirement.owner}
                </span>
              </div>
            </div>

            {/* Mobile / Tablet */}
            <div className="flex items-start gap-3 px-4 py-4 xl:hidden">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  requirement.selected
                    ? "bg-primary text-white"
                    : "bg-surface text-text-secondary"
                }`}
              >
                <FileText size={15} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-text-primary">
                    {requirement.title}
                  </p>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                    {requirement.initials}
                  </div>
                </div>

                <p className="mt-1 text-xs text-text-secondary">
                  {requirement.project}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      statusStyles[requirement.status]
                    }`}
                  >
                    {requirement.status}
                  </span>

                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      complexityStyles[requirement.complexity]
                    }`}
                  >
                    {requirement.complexity}
                  </span>

                  <span className="text-xs text-text-secondary">
                    Updated {requirement.updated}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-text-secondary">
                Showing 1 to 7 of 12 requirements
            </span>

            <div className="flex items-center gap-1">
                <button
                type="button"
                aria-label="Previous page"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-secondary transition hover:bg-surface"
                >
                ‹
                </button>

                <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-white"
                >
                1
                </button>

                <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-xs font-medium text-text-primary transition hover:bg-surface"
                >
                2
                </button>

                <button
                type="button"
                aria-label="Next page"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-secondary transition hover:bg-surface"
                >
                ›
                </button>
            </div>
        </div>
    </section>
  );
}

export default RequirementsList;
