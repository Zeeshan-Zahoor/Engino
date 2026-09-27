import {
  CalendarDays,
  Clock3,
  Pencil,
  Share2,
} from "lucide-react";

import { getInitials } from "../../utils/getInitials";
import { getRelativeTime } from "../../utils/getRelativeTime";
import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";

function ProjectOverviewHeader({ project, onEdit }) {
  const isAdmin = isWorkspaceAdmin();
  return (
    <section className="rounded-2xl border border-border bg-white p-4">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Project identity */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
            <span className="text-2xl font-semibold">{getInitials(project?.name)}</span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold text-text-primary">
                {project?.name}
              </h1>

              <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                {project?.status}
              </span>
            </div>

            <p className="mt-1.5 max-w-2xl text-sm text-text-secondary">
              {project?.description}
            </p>

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-text-primary">
                  Project Code:
                </span>
                {project?.code}
              </span>

              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} />
                Created: {project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}  
              </span>

              <span className="flex items-center gap-1.5">
                <Clock3 size={13} />
                Last Updated: {project?.updatedAt ? getRelativeTime(project.updatedAt) : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {isAdmin && (
            <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-text-primary transition hover:bg-surface"
          >
            <Pencil size={14} />
            Edit Project
          </button>
          )}

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-text-primary transition hover:bg-surface"
          >
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProjectOverviewHeader;
