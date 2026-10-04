import { getRelativeEstimatedTime } from "../../utils/getRelativeTime";
import { Check } from "lucide-react";

function PlanContent({ requirement }) {
  return (
        <div className="space-y-6 p-6 max-h-100 overflow-auto scrollbar-thin scrollbar-thumb-surface">
            {requirement?.aiPlan?.content ? (
            <>
                {/* Overview */}
                <div>
                <h3 className="text-sm font-semibold text-text-primary">
                    Plan Overview
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {requirement.aiPlan.content.overview}
                </p>
                </div>

                {/* Objectives */}
                {requirement.aiPlan.content.objectives?.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                    Objectives
                    </h3>

                    <div className="mt-3 space-y-2">
                    {requirement.aiPlan.content.objectives.map((objective, index) => (
                        <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg bg-surface px-3 py-2.5"
                        >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-light text-success">
                            <Check size={13} />
                        </div>

                        <p className="text-sm leading-5 text-text-secondary">
                            {objective}
                        </p>
                        </div>
                    ))}
                    </div>
                </div>
                )}

                {/* Features */}
                {requirement.aiPlan.content.features?.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                    Features
                    </h3>

                    <div className="mt-3 space-y-3">
                    {requirement.aiPlan.content.features.map((feature, index) => (
                        <div
                        key={index}
                        className="rounded-xl border border-border p-4"
                        >
                        <div className="flex items-start justify-between gap-3">
                            <h4 className="text-sm font-semibold text-text-primary">
                            {feature.name}
                            </h4>

                            <span
                            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${
                                feature.priority === "high"
                                ? "bg-danger-light text-danger"
                                : feature.priority === "medium"
                                ? "bg-warning-light text-warning"
                                : "bg-success-light text-success"
                            }`}
                            >
                            {feature.priority}
                            </span>
                        </div>

                        <p className="mt-2 text-sm leading-5 text-text-secondary">
                            {feature.description}
                        </p>

                        <p className="mt-3 text-xs font-medium text-text-secondary">
                            Estimated effort:{" "}
                            {getRelativeEstimatedTime(feature.estimatedEffortMinutes)}
                        </p>
                        </div>
                    ))}
                    </div>
                </div>
                )}

                {/* Technical Considerations */}
                {requirement.aiPlan.content.technicalConsiderations?.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                    Technical Considerations
                    </h3>

                    <ul className="mt-3 space-y-2">
                    {requirement.aiPlan.content.technicalConsiderations.map(
                        (item, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2 text-sm leading-5 text-text-secondary"
                        >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-text-secondary" />
                            {item}
                        </li>
                        )
                    )}
                    </ul>
                </div>
                )}

                {/* Dependencies */}
                {requirement.aiPlan.content.dependencies?.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                    Dependencies
                    </h3>

                    <ul className="mt-3 space-y-2">
                    {requirement.aiPlan.content.dependencies.map(
                        (dependency, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2 text-sm leading-5 text-text-secondary"
                        >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-text-secondary" />
                            {dependency}
                        </li>
                        )
                    )}
                    </ul>
                </div>
                )}

                {/* Risks */}
                {requirement.aiPlan.content.risks?.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                    Risks
                    </h3>

                    <ul className="mt-3 space-y-2">
                    {requirement.aiPlan.content.risks.map((risk, index) => (
                        <li
                        key={index}
                        className="flex items-start gap-2 text-sm leading-5 text-text-secondary"
                        >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                        {risk}
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </>
            ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border">
                <div className="text-center">
                <h3 className="text-sm font-semibold text-text-primary">
                    No AI Plan Yet
                </h3>

                <p className="mt-1 text-xs text-text-secondary">
                    Generate an engineering plan for this requirement to see it here.
                </p>
                </div>
            </div>
            )}
        </div>
    ) 

}

export default PlanContent;