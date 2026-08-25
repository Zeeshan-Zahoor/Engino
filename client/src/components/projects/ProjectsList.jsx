import {
  CalendarDays,
  Circle,
  MoreVertical,
} from "lucide-react";

const projects = [
  {
    id: "STU-001",
    name: "Student Portal",
    description:
      "Complete student portal with attendance, assignments, and notifications.",
    progress: 75,
    done: 24,
    inProgress: 8,
    todo: 6,
    review: 2,
    status: "In Progress",
    statusClass: "bg-primary-light text-primary",
    team: ["ZZ", "GA", "AR"],
    extraMembers: 5,
    updatedDate: "May 24, 2025",
    updated: "2h ago",
  },
  {
    id: "ATT-002",
    name: "Attendance Module",
    description:
      "Attendance tracking and management module for students.",
    progress: 60,
    done: 16,
    inProgress: 6,
    todo: 4,
    review: 1,
    status: "In Progress",
    statusClass: "bg-primary-light text-primary",
    team: ["GA", "ZZ", "AR"],
    extraMembers: 3,
    updatedDate: "May 23, 2025",
    updated: "5h ago",
  },
  {
    id: "ASM-003",
    name: "Assignment System",
    description:
      "Assignment creation, submission and evaluation system.",
    progress: 40,
    done: 8,
    inProgress: 4,
    todo: 6,
    review: 2,
    status: "On Hold",
    statusClass: "bg-orange-50 text-warning",
    team: ["ZZ", "AR"],
    extraMembers: 2,
    updatedDate: "May 22, 2025",
    updated: "1d ago",
  },
  {
    id: "NOT-004",
    name: "Notification System",
    description:
      "Real-time notifications and alerts management.",
    progress: 30,
    done: 6,
    inProgress: 2,
    todo: 8,
    review: 1,
    status: "Planning",
    statusClass: "bg-blue-50 text-info",
    team: ["GA", "ZZ"],
    extraMembers: 1,
    updatedDate: "May 21, 2025",
    updated: "2d ago",
  },
  {
    id: "PAY-005",
    name: "Payment Gateway",
    description:
      "Secure payment integration for fees and transactions.",
    progress: 20,
    done: 4,
    inProgress: 2,
    todo: 10,
    review: 0,
    status: "Planning",
    statusClass: "bg-blue-50 text-info",
    team: ["ZZ", "GA"],
    extraMembers: 2,
    updatedDate: "May 20, 2025",
    updated: "3d ago",
  },
  {
    id: "HOS-006",
    name: "Hostel Management",
    description:
      "Hostel allocation, room management and facilities.",
    progress: 10,
    done: 2,
    inProgress: 1,
    todo: 12,
    review: 0,
    status: "Not Started",
    statusClass: "bg-surface text-text-secondary",
    team: ["ZZ", "AR", "GA"],
    extraMembers: 4,
    updatedDate: "May 18, 2025",
    updated: "5d ago",
  },
];

const avatarClasses = [
  "bg-purple-100 text-primary",
  "bg-blue-100 text-info",
  "bg-green-100 text-success",
];

function ProjectsList() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white">
      {/* Desktop Header */}
      <div className="hidden grid-cols-[2.2fr_1.8fr_0.8fr_0.9fr_1fr_0.3fr] gap-4 border-b border-border bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary lg:grid">
        <span>Project</span>
        <span>Progress</span>
        <span>Status</span>
        <span>Team</span>
        <span>Last Updated</span>
        <span />
      </div>

      {/* Projects */}
      <div className="divide-y divide-border">
        {projects.map((project) => (
          <div key={project.id}>
            {/* Desktop Row */}
            <div className="hidden grid-cols-[2.2fr_1.8fr_0.8fr_0.9fr_1fr_0.3fr] items-center gap-4 px-5 py-4 lg:grid">
              {/* Project */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                  <Circle size={20} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {project.name}
                    </p>

                    {project.id === "STU-001" && (
                      <span className="text-warning">★</span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs font-medium text-text-secondary">
                    {project.id}
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-4 text-text-secondary">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="block font-semibold text-success">
                      {project.done}
                    </span>
                    <span className="text-text-secondary">Done</span>
                  </div>

                  <div>
                    <span className="block font-semibold text-info">
                      {project.inProgress}
                    </span>
                    <span className="text-text-secondary">In Progress</span>
                  </div>

                  <div>
                    <span className="block font-semibold text-text-secondary">
                      {project.todo}
                    </span>
                    <span className="text-text-secondary">To Do</span>
                  </div>

                  <div>
                    <span className="block font-semibold text-warning">
                      {project.review}
                    </span>
                    <span className="text-text-secondary">Review</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${project.statusClass}`}
                >
                  {project.status}
                </span>
              </div>

              {/* Team */}
              <div className="flex items-center">
                {project.team.map((member, index) => (
                  <div
                    key={member}
                    className={`-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-semibold ${avatarClasses[index]}`}
                  >
                    {member}
                  </div>
                ))}

                {project.extraMembers > 0 && (
                  <span className="ml-1 rounded-full bg-surface px-2 py-1 text-xs font-medium text-text-secondary">
                    +{project.extraMembers}
                  </span>
                )}
              </div>

              {/* Updated */}
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {project.updatedDate}
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  {project.updated}
                </p>
              </div>

              {/* Actions */}
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary"
              >
                <MoreVertical size={17} />
              </button>
            </div>

            {/* Mobile Card */}
            <div className="p-4 lg:hidden">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                  <Circle size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {project.name}
                      </p>

                      <p className="mt-0.5 text-xs text-text-secondary">
                        {project.id}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 text-text-secondary"
                    >
                      <MoreVertical size={17} />
                    </button>
                  </div>

                  <p className="mt-2 text-sm leading-4 text-text-secondary">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Status + Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${project.statusClass}`}
                  >
                    {project.status}
                  </span>

                  <span className="text-xs font-semibold text-text-primary">
                    {project.progress}%
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Task stats */}
              <div className="mt-4 grid grid-cols-4 rounded-xl bg-surface p-3">
                <div>
                  <p className="text-xs font-semibold text-success">
                    {project.done}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    Done
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-info">
                    {project.inProgress}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    In Progress
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-secondary">
                    {project.todo}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    To Do
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-warning">
                    {project.review}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    Review
                  </p>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  {project.team.map((member, index) => (
                    <div
                      key={member}
                      className={`-ml-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-semibold first:ml-0 ${avatarClasses[index]}`}
                    >
                      {member}
                    </div>
                  ))}

                  {project.extraMembers > 0 && (
                    <span className="ml-1 text-xs text-text-secondary">
                      +{project.extraMembers}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <CalendarDays size={12} />
                  {project.updated}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-secondary">
        <span>Showing </span>
          <span className="font-semibold text-text-primary">
            {projects.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-text-primary">10</span>{" "}
          projects
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary disabled:opacity-40"
            disabled
          >
            ‹
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white"
          >
            1
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>Show</span>

          <select className="h-8 rounded-lg border border-border bg-white px-2 text-xs text-text-primary outline-none focus:border-primary">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>

          <span>per page</span>
        </div>
      </div>
    </section>
  );
}

export default ProjectsList;
