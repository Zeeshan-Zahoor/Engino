import { CheckCircle2 } from "lucide-react";

const goals = [
  "Simplify student academic management",
  "Provide real-time attendance information",
  "Centralize assignments and notifications",
  "Improve communication between students and administrators",
];

const technologies = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind CSS",
];

function ProjectDescription() {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      {/* Description */}
      <div>
        <h2 className="text-sm font-semibold text-text-primary">
          Project Description
        </h2>

        <p className="mt-3 max-w-4xl text-xs leading-6 text-text-secondary">
          Student Portal is a centralized platform designed to help students
          manage their academic activities, including attendance, assignments,
          notifications, and profile information.
        </p>
      </div>

      {/* Goals */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold text-text-primary">
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

              <span className="text-[11px] leading-4 text-text-secondary">
                {goal}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold text-text-primary">
          Technology Stack
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[10px] font-medium text-text-secondary"
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