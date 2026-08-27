import {
  CalendarDays,
  Circle,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const avatarClasses = [
  "bg-purple-100 text-primary",
  "bg-blue-100 text-info",
  "bg-green-100 text-success",
];

function ProjectsList({
  filteredProjects,
}) {

  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const totalPages = Math.ceil(filteredProjects.length / pageSize);

  // get the projects for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const handleProjectClick = (projectId) => {
    navigate(`${projectId}`);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white">
      {/* Desktop Header */}
      <div className="hidden grid-cols-[2.2fr_1.8fr_0.8fr_0.9fr_1fr_0.3fr] gap-4 border-b border-border bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary lg:grid">
        <span>Project</span>
        <span>Progress</span>
        <span>Status</span>
        <span>Team</span>
        <span>Last Updated</span>
        <span>Actions</span>
      </div>

      {/* Projects */}
      <div className="divide-y divide-border">
        {paginatedProjects.map((project) => {
          let team = project.team;
          if(team.length > 3) {
            team = project.team.slice(0, 3);
          }

          const extraMembers = project.team.length - team.length;
        return (
          <div 
            key={project.id}
            role="button"
            className="transition hover:bg-surface cursor-default active:scale-[1.005]"
            onClick={() => handleProjectClick(project.id)}
          >
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

                    {project.code === "STU-001" && (
                      <span className="text-warning">★</span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs font-medium text-text-secondary">
                    {project.code}
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
                      {project.stats.completedTasks}
                    </span>
                    <span className="text-text-secondary">Done</span>
                  </div>

                  <div>
                    <span className="block font-semibold text-info">
                      {project.stats.inProgressTasks}
                    </span>
                    <span className="text-text-secondary">In Progress</span>
                  </div>

                  <div>
                    <span className="block font-semibold text-text-secondary">
                      {project.stats.todoTasks}
                    </span>
                    <span className="text-text-secondary">To Do</span>
                  </div>

                  <div>
                    <span className="block font-semibold text-warning">
                      {project.stats.reviewTasks}
                    </span>
                    <span className="text-text-secondary">Review</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium 
                    ${project.status === "In Progress"
                                  ? "bg-primary-light text-primary"
                                  : project.status === "On Hold"
                                                  ? "bg-orange-50 text-warning"
                                                  : project.status === "Planning"
                                                          ? "bg-blue-50 text-info"
                                                          : project.status === "Completed"
                                                                    ? "bg-green-50 text-success"
                                                                    : "bg-surface text-text-secondary"
                    }`} 
                >
                  {project.status}
                </span>
              </div>

              {/* Team */}
              <div className="flex items-center">
                {team.map((member, index) => (
                  <div
                    key={member.id}
                    className={`-ml-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold ${avatarClasses[index]}`}
                  >
                    {member.initials}
                  </div>
                ))}

                {extraMembers > 0 && (
                  <span className="ml-1 rounded-full bg-surface px-2 py-1 text-xs font-medium text-text-secondary">
                    +{extraMembers}
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
                        {project.code}
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
                    className={`rounded-md px-2 py-1 text-xs font-medium ${project.status === "In Progress"
                                  ? "bg-primary-light text-primary"
                                  : project.status === "On Hold"
                                                  ? "bg-orange-50 text-warning"
                                                  : project.status === "Planning"
                                                          ? "bg-blue-50 text-info"
                                                          : "bg-surface text-text-secondary"
                    }`}
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
                    {project.stats.completedTasks}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    Done
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-info">
                    {project.stats.inProgressTasks}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    In Progress
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-secondary">
                    {project.stats.todoTasks}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    To Do
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-warning">
                    {project.stats.reviewTasks}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    Review
                  </p>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  {team.map((member, index) => (
                    <div
                      key={member.id}
                      className={`-ml-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-semibold first:ml-0 ${avatarClasses[index]}`}
                    >
                      {member.initials}
                    </div>
                  ))}

                  {extraMembers > 0 && (
                    <span className="ml-1 text-xs text-text-secondary">
                      +{extraMembers}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <CalendarDays size={12} />
                  {project.updatedDate}
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-secondary">
        <span>Showing </span>
          <span className="font-semibold text-text-primary">
            {paginatedProjects.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-text-primary">{filteredProjects.length}</span>{" "}
          projects
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary disabled:opacity-40"
          >
            ‹
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white"
          >
            {currentPage}
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface disabled:opacity-40"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>Show</span>

          <select 
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1)
            }}
            className="h-8 rounded-lg border border-border bg-white px-2 text-xs text-text-primary outline-none focus:border-primary">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          <span>per page</span>
        </div>
      </div>
    </section>
  );
}

export default ProjectsList;
