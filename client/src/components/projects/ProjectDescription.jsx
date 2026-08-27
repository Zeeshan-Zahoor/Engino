import { CheckCircle2 } from "lucide-react";

function ProjectDescription({ project }) {
  const goals = project.goals;
  const technologies = project.technologies;
  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      {/* Description */}
      <div>
        <h2 className="text-base font-semibold text-text-primary">
          Project Description
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-6 text-text-secondary">
          {project.description}
        </p>
      </div>

      {/* Goals */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-text-primary">
          Project Goals
        </h3>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {goals.map((goal) => (
            <div
              key={goal}
              className="flex items-start gap-2 rounded-lg bg-surface px-3 py-2.5"
            >
              <CheckCircle2
                size={14}
                className="mt-0.5 shrink-0 text-success"
              />

              <span className="text-sm leading-4 text-text-secondary">
                {goal}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-text-primary">
          Technology Stack
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectDescription;
