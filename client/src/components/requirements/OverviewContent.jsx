import Avatar from "../../utils/Avatar";
import { 
    Check,

 } from "lucide-react";
import { getRelativeEstimatedTime, getRelativeTime } from "../../utils/getRelativeTime";


const complexityStyles = {
  High: "text-danger",
  Medium: "text-warning",
  Low: "text-success",
};



function OverviewContent({ requirement, projects }) {
  return (
    <div className="px-4 py-4 max-h-100 overflow-auto scrollbar-thin scrollbar-thumb-surface">
            {/* Requirement Description */}
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Requirement Description
              </h3>

              <p className="mt-2 text-sm leading-5 text-text-secondary">
                {requirement.description}
              </p>
            </div>

            {/* Acceptance Criteria */}
            <div className="mt-5">
              <h3 className="text-sm font-bold text-text-primary">
                Acceptance Criteria
              </h3>

              <div className="mt-3 space-y-2">
                {(requirement.acceptanceCriteria || []).map((criteria) => (
                  <div
                    key={criteria}
                    className="flex items-start gap-2"
                  >
                    <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-green-50 text-success">
                      <Check size={9} strokeWidth={3} />
                    </div>

                    <span className="text-sm leading-4 text-text-secondary">
                      {criteria}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-5 grid grid-cols-3 gap-1.5">
              <MetricCard
                title="Complexity"
                value={`${requirement.complexity}`}
                valueClassName={`${complexityStyles[requirement.complexity]}`}
                complexity
                complexityType={requirement.complexity}
              />

              <MetricCard
                title="Estimated Effort"
                value={getRelativeEstimatedTime(requirement.estimatedEffortMinutes)}
              />

              <MetricCard
                title="AI Confidence"
                value={`${requirement.aiConfidence}%`}
                valueClassName="text-text-primary"
              />
            </div>

            {/* Metadata */}
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              <div className="min-h-[72px] rounded-lg border border-border p-2.5">
                <p className="text-xs font-medium text-text-secondary">
                  Project
                </p>

                <span className="mt-2 inline-flex rounded-md bg-primary-light px-2 py-1 text-xs font-semibold text-primary">
                  {projects.find(project => project._id === requirement.projectId._id)?.name}
                </span>
              </div>

              <div className="min-h-[72px] rounded-lg border border-border p-2.5">
                <p className="text-xs font-medium text-text-secondary">
                  Created By
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <Avatar user={requirement.owner}/>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      {requirement.owner?.name || "Unknown"}
                    </p>

                    <p className="mt-0.5 text-xs text-text-secondary">
                      {requirement.createdAt ? new Date(requirement.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-h-[72px] rounded-lg border border-border p-2.5">
                <p className="text-xs font-medium text-text-secondary">
                  Last Updated
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <Avatar user={requirement.updatedBy}/>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      {requirement.owner?.name || "Unknown"}
                    </p>

                    <p className="mt-0.5 text-xs text-text-secondary">
                      {getRelativeTime(requirement.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}

function MetricCard({
  title,
  value,
  valueClassName = "text-text-primary",
  complexity = false,
  complexityType,
}) {
  return (
    <div className="min-h-[58px] rounded-lg border border-border p-2.5">
      <p className="text-xs font-medium text-text-secondary">
        {title}
      </p>

      {complexity && 
        ( complexityType === "Medium"
          ? (
            <div className="mt-2 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
          )
          : complexityType === "High"
                ? (
                  <div className="mt-2 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                )
                : (
                  <div className="mt-2 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                )
    
    )}
      <p
        className={`mt-1 text-sm font-semibold ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

export default OverviewContent