import { ArrowRight, Sparkles } from "lucide-react";
import useProjectStore from "../../stores/projectStore";
import useRequirementStore from "../../stores/requirementStore";
import useWorkspaceStore from "../../stores/workspaceStore";
import useTaskStore from "../../stores/taskStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { getRelativeTime } from "../../utils/getRelativeTime";

const statusStyles = {
  "AI Plan Ready": "bg-primary-light text-primary",
  "Needs Clarification": "bg-warning-surface text-warning",
  "Plan Generated": "bg-info-surface text-info",
  Approved: "bg-success-surface text-success",
  Pending: "bg-surface text-text-secondary",
};

function RequirementsOverview() {
  const navigate = useNavigate();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { projects } = useProjectStore();
  const { workspaceRequirements, fetchWorkspaceRequirements } = useRequirementStore();
  const { allTasks, fetchAllTasks } = useTaskStore();

  useEffect(() => {
    if(workspaceRequirements.length === 0) {
      fetchWorkspaceRequirements(currentWorkspaceId);
    }
    if(allTasks.length === 0) {
      fetchAllTasks(currentWorkspaceId);
    }
  }, [fetchWorkspaceRequirements, fetchAllTasks, currentWorkspaceId, workspaceRequirements.length, allTasks.length]);
  
  return (
    <section className="rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={17} className="text-primary" />

            <h2 className="text-base font-semibold text-text-primary">
              Recent Requirements
            </h2>
          </div>

          <p className="mt-1 text-xs text-text-secondary">
            Latest AI requirement analysis and plans
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/requirements')}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Requirements */}
      <div className="divide-y divide-border">
        {/* temporary until we get exact timestamps from mongodb */}
        {(workspaceRequirements.slice(0, 5)).map((requirement) => {
          const tasks = allTasks.filter(task => task.requirementId === requirement._id);
          return (
            <button
              key={requirement._id}
              type="button"
              onClick={() => {
                if (!requirement.projectId || !requirement._id) {
                  navigate("/requirements");
                  return;
                }

                navigate(
                  `/projects/${requirement.projectId}/requirements/${requirement._id}`
                )
              }}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
            >
              {/* Requirement */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {requirement.name}
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  {projects.find(project => (project._id === requirement.projectId))?.name}
                </p>
              </div>

              {/*AI Status */}
              <div className="w-36">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[requirement.aiStatus]}`}
                >
                  {requirement.aiStatus}
                </span>
              </div>

              {/* Complexity */}
              <div className="w-20">
                <p className="text-xs font-medium text-text-primary">
                  {requirement.complexity}
                </p>

                <p className="mt-0.5 text-xs text-text-secondary">
                  Complexity
                </p>
              </div>

              {/* Tasks */}
              <div className="w-20">
                <p className="text-xs font-medium text-text-primary">
                  {tasks.length}
                </p>

                <p className="mt-0.5 text-xs text-text-secondary">
                  Tasks
                </p>
              </div>

              {/* Updated */}
              <div className="w-20">
                <p className="text-xs text-text-secondary">
                  {getRelativeTime(requirement.updatedAt)}
                </p>
              </div>

              <ArrowRight
                size={16}
                className="shrink-0 text-text-secondary"
              />
          </button>
          )
        })}
      </div>
    </section>
  );
}

export default RequirementsOverview;
