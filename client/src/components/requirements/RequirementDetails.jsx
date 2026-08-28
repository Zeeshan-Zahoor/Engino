import {
  Check,
  Eye,
  Rocket,
  X,
} from "lucide-react";
import { getInitials } from '../../utils/getIniitals';
import useProjectStore from "../../stores/projectStore";

// const acceptanceCriteria = [
//   "Admin can create and manage classes",
//   "Admin can mark attendance for each student",
//   "Students can view their attendance percentage",
//   "Admin can generate monthly attendance reports",
//   "Low attendance alerts are sent to students",
// ];

const complexityStyles = {
  High: "text-danger",
  Medium: "text-warning",
  Low: "text-success",
};

function RequirementDetails({ requirement }) {
  const projects = useProjectStore(state => state.projects);
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white">
      {/* Requirement Header */}
      <div className="border-b border-border px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <span className="text-sm font-semibold">{getInitials(requirement.name)}</span>
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold leading-5 text-text-primary">
                {requirement.name}
              </h2>

              <p className="mt-1 text-xs text-text-secondary">
                · {projects.find(project => project.id === requirement.projectId)?.name}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-2">
            <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-success">
              {requirement.aiStatus}
            </span>

            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-md text-text-secondary transition hover:bg-surface hover:text-text-primary"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex overflow-x-auto">
          {[
            "Overview",
            "AI Conversation",
            "Plan",
            "Tasks (24)",
            "History",
          ].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`relative shrink-0 px-2 pb-3 text-xs font-medium ${
                index === 0
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      <div className="px-4 py-4">
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
            {requirement.acceptanceCriteria.map((criteria) => (
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
            value={requirement.estimatedEffort}
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
              {projects.find(project => project.id === requirement.projectId)?.name}
            </span>
          </div>

          <div className="min-h-[72px] rounded-lg border border-border p-2.5">
            <p className="text-xs font-medium text-text-secondary">
              Created By
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Avatar initials={getInitials(requirement.owner.name)} />

              <div>
                <p className="text-xs font-semibold text-text-primary">
                  {requirement.owner.name}
                </p>

                <p className="mt-0.5 text-xs text-text-secondary">
                  {requirement.createdAt}
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[72px] rounded-lg border border-border p-2.5">
            <p className="text-xs font-medium text-text-secondary">
              Last Updated
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Avatar initials={getInitials(requirement.updatedBy.name)} />

              <div>
                <p className="text-xs font-semibold text-text-primary">
                  {requirement.updatedAt}
                </p>

                <p className="mt-0.5 text-xs text-text-secondary">
                  {requirement.updated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Action */}
      <div className="border-t border-border px-4 py-4">
        <h3 className="text-sm font-bold text-text-primary">
          Next Action
        </h3>

        <p className="mt-2 text-xs leading-4 text-text-secondary">
          Review the generated engineering plan and publish tasks.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-semibold text-text-primary transition hover:bg-surface"
          >
            <Eye size={12} />
            View Plan
          </button>

          <button
            type="button"
            className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary-dark"
          >
            <Rocket size={12} />
            Review & Publish
          </button>
        </div>
      </div>
    </section>
  );
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

function Avatar({ initials }) {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-primary">
      {initials}
    </div>
  );
}

export default RequirementDetails;
