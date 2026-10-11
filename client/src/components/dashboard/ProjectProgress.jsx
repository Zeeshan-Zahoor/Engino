import { ArrowRight, CheckCircle2, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  "Planning": "bg-yellow-50 text-warning",
  "In Progress": "bg-blue-50 text-info",
  "On Hold": "bg-orange-50 text-orange-600",
  "Completed": "bg-green-50 text-success",
};

function ProjectProgress({ projects }) {

  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Project Progress
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Overview of your active projects
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Projects */}
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {(projects.slice(0, 4)).map((project) => {
          const tasks = project.tasks || [];

          const completedTasks = tasks.filter(
            (task) => task.status === "Done"
          );

          const progress =
            tasks.length > 0
              ? Math.floor((completedTasks.length / tasks.length) * 100)
              : 0;

          return (
            <button
              key={project._id}
              type="button"
              onClick={() => navigate(`/projects/${project._id}`)}
              className="rounded-xl border border-border p-4 text-left transition hover:border-primary/30 hover:shadow-sm"
            >
            {/* Project heading */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  {progress === 100 ? (
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                  ) : (
                    <FolderKanban size={18} strokeWidth={1.8} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {project.name}
                  </p>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    {project.description}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${statusStyles[project.status]}`}
              >
                {project.status}
              </span>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">
                  Progress
                </span>

                <span className="text-xs font-semibold text-text-primary">
                  {progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </button>
          )
        })}
      </div>
    </section>
  );
}

export default ProjectProgress;
