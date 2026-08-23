import { ArrowRight, CheckCircle2, FolderKanban } from "lucide-react";

const projects = [
  {
    name: "Student Portal",
    description: "12 of 20 tasks completed",
    progress: 60,
    status: "In Progress",
    statusClass: "bg-blue-50 text-info",
  },
  {
    name: "E-Commerce Platform",
    description: "18 of 24 tasks completed",
    progress: 75,
    status: "In Progress",
    statusClass: "bg-blue-50 text-info",
  },
  {
    name: "Attendance System",
    description: "8 of 8 tasks completed",
    progress: 100,
    status: "Completed",
    statusClass: "bg-green-50 text-success",
  },
  {
    name: "Notification System",
    description: "5 of 12 tasks completed",
    progress: 42,
    status: "In Progress",
    statusClass: "bg-blue-50 text-info",
  },
];

function ProjectProgress() {
  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Project Progress
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Overview of your active projects
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Projects */}
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {projects.map((project) => (
          <button
            key={project.name}
            type="button"
            className="rounded-xl border border-border p-4 text-left transition hover:border-primary/30 hover:shadow-sm"
          >
            {/* Project heading */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  {project.progress === 100 ? (
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                  ) : (
                    <FolderKanban size={18} strokeWidth={1.8} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {project.name}
                  </p>

                  <p className="mt-0.5 text-[11px] text-text-secondary">
                    {project.description}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${project.statusClass}`}
              >
                {project.status}
              </span>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-text-secondary">
                  Progress
                </span>

                <span className="text-xs font-semibold text-text-primary">
                  {project.progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ProjectProgress;