import {
  CalendarDays,
  Circle,
  MoreVertical,
  Edit2,
  Trash,
  FolderKanban,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Avatar from "../../utils/Avatar";
import { getRelativeTime } from "../../utils/getRelativeTime";
import Loader from "../common/Loader";
import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";
import EmptyState from "../common/EmptyState";

const avatarClasses = [
  "bg-purple-100 text-primary",
  "bg-info-surface text-info",
  "bg-success-surface text-success",
];


function ProjectsList({
  filteredProjects,
  loading,
  error,
  hasProjects,
  hasActiveFilters,
  onClearFilters,
  onCreateProject,
  onEditProject,
  onDeleteProject,
}) {

  const navigate = useNavigate();

  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuId, setOpenMenuId] = useState(null);


  const totalPages = Math.ceil(filteredProjects?.length / pageSize) || 0;

  // get the projects for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const handleProjectClick = (projectId) => {
    navigate(`${projectId}`);
  }

  const isAdmin = isWorkspaceAdmin();

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
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
        {loading ? (
                  <div className="min-h-30 flex justify-center items-center">
                    <Loader size={25} color="text-primary"/>
                  </div>
              ) : error ? (
                <EmptyState icon={FolderKanban} title="Projects are unavailable" description={error} compact />
              ) : paginatedProjects.length === 0 ? (
                <EmptyState
                  icon={FolderKanban}
                  title={hasProjects && hasActiveFilters ? "No matching projects" : "No projects yet"}
                  description={hasProjects && hasActiveFilters ? "Try a different search or clear the current filters." : "Create a project to begin organizing your engineering work."}
                  actionLabel={hasProjects && hasActiveFilters ? "Clear filters" : isAdmin ? "New project" : undefined}
                  onAction={hasProjects && hasActiveFilters ? onClearFilters : isAdmin ? onCreateProject : undefined}
                  compact
                />
              ) : (
                  paginatedProjects?.map((project) => {
                    let team = project.team;
                    if(team.length > 3) {
                      team = project.team.slice(0, 3);
                    }

                    const tasks = project?.tasks || [];
                    const completedTasks = tasks.filter(task => task.status === "Done");

                    const inProgressTasks = tasks.filter(task => task.status === "In Progress");

                    const todoTasks = tasks.filter(task => task.status === "Todo");

                    const progress = Math.floor((completedTasks.length / tasks.length) * 100) || 0;

                    const extraMembers = project?.team?.length - team?.length;
                  return (
                    <div 
                      key={project._id}
                      role="button"
                      className="transition hover:bg-surface cursor-default"
                      onClick={() => handleProjectClick(project._id)}
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
                              <p className="break-words text-sm font-semibold text-text-primary">
                                {project?.name}
                              </p>
                            </div>

                            <p className="mt-0.5 text-xs font-medium text-text-secondary">
                              {project?.code}
                            </p>

                            <p className="mt-1 max-w-xs text-xs leading-4 text-text-secondary">
                              {project?.description}
                            </p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-text-primary">
                              {progress}%
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="block font-semibold text-success">
                                {completedTasks?.length}
                              </span>
                              <span className="text-text-secondary">Done</span>
                            </div>

                            <div>
                              <span className="block font-semibold text-info">
                                {inProgressTasks?.length}
                              </span>
                              <span className="text-text-secondary">In Progress</span>
                            </div>

                            <div>
                              <span className="block font-semibold text-text-secondary">
                                {todoTasks?.length}
                              </span>
                              <span className="text-text-secondary">To Do</span>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <span
                            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium 
                              ${project?.status === "In Progress"
                                            ? "bg-primary-light text-primary"
                                            : project?.status === "On Hold"
                                                            ? "bg-warning-surface text-warning"
                                                            : project?.status === "Planning"
                                                                    ? "bg-info-surface text-info"
                                                                    : project?.status === "Completed"
                                                                              ? "bg-success-surface text-success"
                                                                              : "bg-surface text-text-secondary"
                              }`} 
                          >
                            {project?.status}
                          </span>
                        </div>

                        {/* Team */}
                        <div className="flex items-center">
                          {team.map((member, index) => (
                            <div
                              key={member._id}
                              className={`-ml-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold ${avatarClasses[index]}`}
                            >
                              <Avatar 
                                user={member?.userId}
                              />
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
                            {project?.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : ''}
                          </p>

                          <p className="mt-1 text-xs text-text-secondary">
                            {project?.updatedAt ? getRelativeTime(project.updatedAt) : ''}
                          </p>
                        </div>

                        {/* Actions */}
                       <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId((current) =>
                                current === project._id ? null : project._id
                              );
                            }}
                            disabled={!isAdmin}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed"
                          >
                            <MoreVertical size={17} />
                          </button>

                          {openMenuId === project._id && (
                            <div
                              className="absolute right-0 top-full z-30 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onEditProject(project);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-text-primary  hover:bg-surface"
                              >
                                <Edit2 size={14}/>
                                Edit Project
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onDeleteProject(project);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger-surface"
                              >
                                <Trash size={14}/>
                                Delete Project
                              </button>
                            </div>
                          )}
                        </div>
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
                                <p className="break-words text-sm font-semibold text-text-primary">
                                  {project?.name}
                                </p>

                                <p className="mt-0.5 text-xs text-text-secondary">
                                  {project?.code}
                                </p>
                              </div>

                               <button
                                 type="button"
                                 aria-label={`Actions for ${project?.name}`}
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setOpenMenuId((current) =>
                                     current === project._id ? null : project._id
                                   );
                                 }}
                                 className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary"
                               >
                                <MoreVertical size={17} />
                              </button>
                            </div>

                             {openMenuId === project._id && (
                               <div
                                 className="relative z-30 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
                                 onClick={(e) => e.stopPropagation()}
                               >
                                 <button
                                   type="button"
                                   disabled={!isAdmin}
                                   onClick={() => {
                                     setOpenMenuId(null);
                                     onEditProject(project);
                                   }}
                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                                 >
                                   <Edit2 size={14} />
                                   Edit Project
                                 </button>
                                 <button
                                   type="button"
                                   disabled={!isAdmin}
                                   onClick={() => {
                                     setOpenMenuId(null);
                                     onDeleteProject(project);
                                   }}
                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger-surface disabled:cursor-not-allowed disabled:opacity-50"
                                 >
                                   <Trash size={14} />
                                   Delete Project
                                 </button>
                               </div>
                             )}

                             <p className="mt-2 line-clamp-2 break-words text-sm leading-4 text-text-secondary">
                              {project?.description}
                            </p>
                          </div>
                        </div>

                        {/* Status + Progress */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <span
                              className={`rounded-md px-2 py-1 text-xs font-medium ${project?.status === "In Progress"
                                            ? "bg-primary-light text-primary"
                                            : project?.status === "On Hold"
                                                            ? "bg-warning-surface text-warning"
                                                            : project?.status === "Planning"
                                                                    ? "bg-info-surface text-info"
                                                                    : "bg-surface text-text-secondary"
                              }`}
                            >
                              {project?.status}
                            </span>

                            <span className="text-xs font-semibold text-text-primary">
                              {progress}%
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Task stats */}
                        <div className="mt-4 grid grid-cols-3 rounded-xl bg-surface p-3">
                          <div>
                            <p className="text-xs font-semibold text-success">
                              {completedTasks?.length}
                            </p>
                            <p className="mt-0.5 text-xs text-text-secondary">
                              Done
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-info">
                              {inProgressTasks.length}
                            </p>
                            <p className="mt-0.5 text-xs text-text-secondary">
                              In Progress
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-text-secondary">
                              {todoTasks.length}
                            </p>
                            <p className="mt-0.5 text-xs text-text-secondary">
                              To Do
                            </p>
                          </div>
                        </div>

                        {/* Bottom */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            {team.map((member, index) => (
                              <div
                                key={member._id}
                                className={`-ml-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-semibold first:ml-0 ${avatarClasses[index]}`}
                              >
                                <Avatar 
                                  user={member?.userId}
                                />
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
                            {project?.updatedAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  )})
              )  
          }
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-secondary">
        <span>Showing </span>
          <span className="font-semibold text-text-primary">
            {paginatedProjects.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-text-primary">{filteredProjects?.length}</span>{" "}
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
            className="h-8 rounded-lg border border-border bg-card px-2 text-xs text-text-primary outline-none focus:border-primary">
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
