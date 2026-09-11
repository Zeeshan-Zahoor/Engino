import {
  Check,
  Circle,
  Lock,
} from "lucide-react";

const WorkflowNav = ({
  steps,
  getStepStatus,
  canAccessStep,
  onStepClick,
}) => {
  return (
    <aside className="w-full rounded-2xl border border-border bg-background p-5 shadow-sm lg:w-64">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Engino AI
        </p>

        <h2 className="mt-1 text-lg font-semibold text-text-primary">
          Workflow
        </h2>
      </div>

      <div>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isAccessible = canAccessStep(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              {/* Connector */}
              {!isLast && (
                <div
                  className={`absolute left-[25px] top-8 h-[calc(100%-8px)] w-0.5 ${
                    status === "completed"
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              )}

              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => onStepClick(step.id)}
                className={`relative z-10 flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition ${
                  status === "current"
                    ? "bg-primary-light"
                    : isAccessible
                      ? "hover:bg-surface"
                      : "cursor-not-allowed"
                }`}
              >
                {/* Step indicator */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    status === "completed"
                      ? "border-primary bg-primary text-white"
                      : status === "current"
                        ? "border-primary bg-background text-primary"
                        : status === "visited"
                          ? "border-primary text-primary"
                          : "border-border bg-surface text-text-secondary"
                  }`}
                >
                  {status === "completed" ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : status === "locked" ? (
                    <Lock size={14} />
                  ) : (
                    <Circle
                      size={9}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      status === "current"
                        ? "text-primary"
                        : status === "locked"
                          ? "text-text-secondary"
                          : "text-text-primary"
                    }`}
                  >
                    {step.label}
                  </p>

                  {status === "current" && (
                    <p className="mt-0.5 text-xs text-primary">
                      Current step
                    </p>
                  )}

                  {status === "completed" && (
                    <p className="mt-0.5 text-xs text-success">
                      Completed
                    </p>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default WorkflowNav;