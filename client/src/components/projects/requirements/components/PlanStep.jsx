import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  Layers3,
  ListChecks,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";

import StepHeader from "./StepHeader";
import { isWorkspaceAdmin } from "../../../../utils/isWorkspaceAdmin";

const PlanStep = ({
  plan,
  loading,
  error,
  onContinue,
  onRetry,
}) => {

  const isAdmin = isWorkspaceAdmin();

  if (loading) {
    return (
      <div>
        <StepHeader
          eyebrow="AI Plan"
          title="Engino is creating your engineering plan"
          description="Engino is turning the clarified requirement into a structured implementation plan."
          badge="Generating"
        />

        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/10" />

              <Sparkles
                size={32}
                className="relative animate-pulse"
              />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-text-primary">
              Generating your engineering plan...
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Engino is organizing the requirement into objectives,
              features, technical considerations, dependencies, and risks.
            </p>

            <div className="mt-7 flex items-center gap-2">
              <RefreshCw
                size={16}
                className="animate-spin text-primary"
              />

              <span className="text-xs font-medium text-text-secondary">
                AI plan generation in progress
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <StepHeader
          eyebrow="AI Plan"
          title="We couldn't generate the plan"
          description="Engino ran into a problem while creating the engineering plan."
          badge="Generation Failed"
        />

        <div className="rounded-2xl border border-danger/20 bg-background p-5 shadow-sm sm:p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertCircle size={34} />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-text-primary">
              AI plan couldn't be generated
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Something went wrong while Engino was creating the
              engineering plan. Please try again.
            </p>

            <div className="mt-6 w-full max-w-md rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-left">
              <p className="text-xs font-medium text-danger">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={onRetry}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div>
        <StepHeader
          eyebrow="AI Plan"
          title="No engineering plan available"
          description="Engino could not find a generated plan for this requirement."
          badge="No Plan"
        />

        <div className="rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
          <p className="text-sm text-text-secondary">
            Generate an AI plan before continuing to Admin Review.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <RefreshCw size={17} />
            Generate Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepHeader
        eyebrow="AI Plan"
        title="Review the proposed engineering plan"
        description="Engino has translated the clarified requirement into a structured implementation plan. Review it before moving to Admin Review."
        badge="Generated"
      />

      <div className="space-y-5">

        {/* AI Plan Status */}
        <section className="rounded-2xl border border-primary/20 bg-primary-light p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
              <Sparkles size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Engino AI
              </p>

              <h2 className="mt-1 text-lg font-semibold text-text-primary">
                Engineering plan generated
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                The clarified requirement has been converted into a
                structured engineering plan for administrative review.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeader
            icon={ClipboardIcon}
            title="Overview"
            description="AI's understanding of the implementation scope"
          />

          <div className="rounded-xl bg-surface p-4">
            <p className="text-sm leading-6 text-text-primary">
              {plan.overview}
            </p>
          </div>
        </section>

        {/* Objectives */}
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeader
            icon={Target}
            title="Objectives"
            description="What this implementation should achieve"
          />

          <div className="space-y-3">
            {plan.objectives?.map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-surface p-4"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-success"
                />

                <p className="text-sm leading-6 text-text-primary">
                  {objective}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <SectionHeader
              icon={Layers3}
              title="Planned Features"
              description="Major implementation areas identified by AI"
            />

            <div className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary">
              {plan.features?.length || 0} features
            </div>
          </div>

          <div className="space-y-4">
            {plan.features?.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Technical Considerations */}
        <ListSection
          icon={Wrench}
          title="Technical Considerations"
          description="Important engineering considerations"
          items={plan.technicalConsiderations}
        />

        {/* Dependencies */}
        <ListSection
          icon={Code2}
          title="Dependencies"
          description="Existing systems or capabilities required"
          items={plan.dependencies}
        />

        {/* Risks */}
        <ListSection
          icon={ShieldAlert}
          title="Risks"
          description="Potential issues or concerns identified by AI"
          items={plan.risks}
          danger
        />

        {/* Review Notice */}
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-success"
            />

            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Ready for Admin Review
              </h3>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                This plan was generated from the clarified requirement.
                An administrator will review, modify, and approve the
                proposed work before actual project tasks are created.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex flex-col items-stretch justify-end gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
          {isAdmin && (
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Continue to Admin Review
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// section 

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
        <Icon size={18} />
      </div>

      <div>
        <h2 className="text-base font-semibold text-text-primary">
          {title}
        </h2>

        <p className="text-xs text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
};

// feature carrd 

const FeatureCard = ({ feature, index }) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start gap-4">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-xs font-bold text-text-secondary">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                {feature.name}
              </h3>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                {feature.description}
              </p>
            </div>

            <PriorityBadge priority={feature.priority} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">

            <MetaBadge
              icon={Clock3}
              value={formatEffort(feature.estimatedEffortMinutes)}
            />

            <MetaBadge
              icon={Layers3}
              value="Feature"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

// list section 

const ListSection = ({
  icon,
  title,
  description,
  items = [],
  danger = false,
}) => {
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <SectionHeader
        icon={icon}
        title={title}
        description={description}
      />

      {items?.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl bg-surface p-4"
            >
              <div
                className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                  danger ? "bg-danger" : "bg-primary"
                }`}
              />

              <p className="text-sm leading-6 text-text-primary">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-surface p-4 text-sm text-text-secondary">
          None identified.
        </div>
      )}
    </section>
  );
};

// priority badge 

const PriorityBadge = ({ priority }) => {
  const normalizedPriority = priority?.toLowerCase();

  return (
    <span className="w-fit rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold capitalize text-primary">
      {normalizedPriority || "medium"} priority
    </span>
  );
};

// meta badge 

const MetaBadge = ({ icon: Icon, value }) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-text-secondary">
      <Icon size={12} />
      {value}
    </span>
  );
};

// helpers 

const formatEffort = (minutes) => {
  if (!minutes || minutes <= 0) {
    return "Effort not specified";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  }

  return `${hours} hr${hours > 1 ? "s" : ""} ${remainingMinutes} min`;
};

const ClipboardIcon = ListChecks;

export default PlanStep;
