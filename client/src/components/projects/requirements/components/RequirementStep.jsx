import {
  CheckCircle2,
  FileText,
  User,
  Calendar,
  Gauge,
  ArrowRight,
} from "lucide-react";

import StepHeader from "./StepHeader";

const RequirementStep = ({
  requirement,
  onContinue,
}) => {
  return (
    <div className="w-full">
      <StepHeader
        eyebrow="Requirement"
        title="Review the requirement"
        description="Start by reviewing the requirement submitted for this project. Make sure the intent and acceptance criteria are clearly understood before Engino analyzes it."
        badge={requirement?.status || "Draft"}
      />

      <div className="space-y-5">
        {/* Requirement overview */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <FileText size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-text-secondary">
                {(requirement?._id.toString().toUpperCase().slice(requirement?._id.length-5, requirement?._id.length))}
              </p>

              <h2 className="mt-1 text-xl font-semibold text-text-primary">
                {requirement?.name}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {requirement?.projectId?.name}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <p className="mb-2 text-sm font-semibold text-text-primary">
              Description
            </p>

            <p className="text-sm leading-6 text-text-secondary">
              {requirement?.description || "No description provided."}
            </p>
          </div>
        </section>

        {/* Metadata */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetadataCard
            icon={User}
            label="Owner"
            value={requirement?.owner?.name || "Unassigned"}
          />

          <MetadataCard
            icon={Gauge}
            label="Complexity"
            value={requirement?.complexity || "Not specified"}
          />

          <MetadataCard
            icon={Calendar}
            label="Created"
            value={new Date(requirement.createdAt).toLocaleDateString() || "Not available"}
          />

          <MetadataCard
            icon={CheckCircle2}
            label="Status"
            value={requirement?.status || "Draft"}
          />
        </section>

        {/* Acceptance criteria */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-text-primary">
              Acceptance Criteria
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Conditions that define when this requirement should be considered
              complete.
            </p>
          </div>

          <div className="space-y-3">
            {requirement?.acceptanceCriteria?.length ? (
              requirement.acceptanceCriteria.map((criterion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl bg-surface p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-success"
                  />

                  <p className="text-sm leading-6 text-text-primary">
                    {criterion}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-surface p-4 text-sm text-text-secondary">
                No acceptance criteria have been provided.
              </div>
            )}
          </div>
        </section>

        {/* Footer action */}
        <div className="flex items-center justify-end border-t border-border pt-5">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Continue to AI Analysis
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

const MetadataCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon size={16} />
        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-3 truncate text-sm font-semibold text-text-primary">
        {value}
      </p>
    </div>
  );
};

export default RequirementStep;