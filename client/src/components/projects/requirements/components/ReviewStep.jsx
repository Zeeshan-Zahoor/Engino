import {
  ArrowRight,
  Check,
  CheckCircle2,
  Edit3,
  Plus,
  Save,
  ShieldAlert,
  Sparkles,
  Target,
  Trash2,
  Wrench,
  X,
  Layers3,
  Clock3,
} from "lucide-react";

import useRequirementStore from "../../../../stores/requirementStore";
import useWorkspaceStore from "../../../../stores/workspaceStore";

import { useEffect, useState } from "react";
import StepHeader from "./StepHeader";
import Loader from "../../../common/Loader";
import { useParams } from "react-router-dom";
import { isWorkspaceAdmin } from "../../../../utils/isWorkspaceAdmin";

const ReviewStep = ({
  plan,
  onContinue,
  onApprove,
}) => {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { currentRequirement, fetchRequirement } = useRequirementStore();
  const { projectId, requirementId } = useParams();

  const [reviewPlan, setReviewPlan] = useState({
    overview: plan?.overview || "",
    objectives: plan?.objectives || [],
    features: plan?.features || [],
    technicalConsiderations: plan?.technicalConsiderations || [],
    dependencies: plan?.dependencies || [],
    risks: plan?.risks || [],
  });

  const [approved, setApproved] = useState(currentRequirement.aiStatus === "Approved" || false);
  const [isApproving, setIsApproving] = useState(false);

  const [editingFeature, setEditingFeature] = useState(null);

  const [featureForm, setFeatureForm] = useState({
    name: "",
    description: "",
    priority: "medium",
    estimatedEffortMinutes: 60,
  });

  const [showAddFeature, setShowAddFeature] = useState(false);

  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    priority: "medium",
    estimatedEffortMinutes: 60,
  });

  const isAdmin = isWorkspaceAdmin();

  useEffect(() => {
    if(currentRequirement) return;

    fetchRequirement(
      currentWorkspaceId,
      projectId,
      requirementId,
    );
  })

  const handleOverviewChange = (value) => {
    setReviewPlan((prev) => ({
      ...prev,
      overview: value,
    }));
  };


  const handleObjectiveChange = (index, value) => {
    setReviewPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((objective, objectiveIndex) =>
        objectiveIndex === index ? value : objective
      ),
    }));
  };

  const removeObjective = (index) => {
    setReviewPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.filter(
        (_, objectiveIndex) => objectiveIndex !== index
      ),
    }));
  };

  const addObjective = () => {
    setReviewPlan((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }));
  };


  const startEditingFeature = (feature, index) => {
    setEditingFeature(index);

    setFeatureForm({
      name: feature.name || "",
      description: feature.description || "",
      priority: feature.priority || "medium",
      estimatedEffortMinutes: feature.estimatedEffortMinutes || 60,
    });
  };

  const cancelEditingFeature = () => {
    setEditingFeature(null);

    setFeatureForm({
      name: "",
      description: "",
      priority: "medium",
      estimatedEffortMinutes: 60,
    });
  };

  const saveFeature = (index) => {
    if (!featureForm.name.trim()) return;

    setReviewPlan((prev) => ({
      ...prev,
      features: prev.features.map((feature, featureIndex) =>
        featureIndex === index
          ? {
              ...feature,
              name: featureForm.name.trim(),
              description: featureForm.description.trim(),
              priority: featureForm.priority,
              estimatedEffortMinutes:
                Number(featureForm.estimatedEffortMinutes) || 0,
            }
          : feature
      ),
    }));

    cancelEditingFeature();
  };

  const removeFeature = (index) => {
    setReviewPlan((prev) => ({
      ...prev,
      features: prev.features.filter(
        (_, featureIndex) => featureIndex !== index
      ),
    }));

    if (editingFeature === index) {
      cancelEditingFeature();
    }
  };

  const handleAddFeature = () => {
    if (!newFeature.name.trim()) return;

    setReviewPlan((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          name: newFeature.name.trim(),
          description: newFeature.description.trim(),
          priority: newFeature.priority,
          estimatedEffortMinutes:
            Number(newFeature.estimatedEffortMinutes) || 0,
        },
      ],
    }));

    setNewFeature({
      name: "",
      description: "",
      priority: "medium",
      estimatedEffortMinutes: 60,
    });

    setShowAddFeature(false);
  };

  const handleApprove = async () => {
    try {
      setIsApproving(true);

      await onApprove?.(reviewPlan);

      setApproved(true);

    } catch {
      // parent/store handles the error
    } finally {
      setIsApproving(false);
    }
  };

  const handleContinue = () => {
    if (!approved) return;

    onContinue?.(reviewPlan);
  };

  if (approved) {
      const totalEffort = reviewPlan.features.reduce(
        (total, feature) => total + (feature.estimatedEffortMinutes || 0),
        0
      );

      const formatEffort = (minutes) => {
        if (minutes < 60) return `${minutes} min`;

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
          return `${hours}h`;
        }

        return `${hours}h ${remainingMinutes}m`;
      };

      return (
        <div className="space-y-6">
          {/* Header */}
          <StepHeader
            eyebrow="Admin Review"
            title="Plan approved"
            description="The engineering plan has been reviewed and approved. It is now ready to be converted into executable tasks."
            badge="Approved"
          />

          {/* Approval Banner */}
          <section className="relative overflow-hidden rounded-2xl border border-success/20 bg-gradient-to-br from-success/10 via-background to-primary/5 p-4 sm:p-6">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-success/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
                <CheckCircle2 size={26} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-text-primary">
                    Engineering plan approved
                  </h2>

                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                    Ready for execution
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  The reviewed plan is now the approved source for task generation.
                  Engineering work can proceed from the defined features and
                  objectives below.
                </p>
              </div>
            </div>
          </section>

          {/* Plan Snapshot */}
          <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Approved plan
                </p>

                <h2 className="mt-1 text-sm text-text-primary">
                  {reviewPlan.overview || "Engineering execution plan"}
                </h2>
              </div>

              <div className="hidden rounded-xl border border-success/20 bg-success/5 px-3 py-2 text-right sm:block">
                <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary text-center">
                  Status
                </p>
                <p className="mt-0.5 text-sm font-semibold text-success text-center">
                  Approved
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-surface/50 p-4">
                <p className="text-xs text-text-secondary">
                  Objectives
                </p>

                <p className="mt-1 text-xl font-semibold text-text-primary">
                  {reviewPlan.objectives.length}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface/50 p-4">
                <p className="text-xs text-text-secondary">
                  Features
                </p>

                <p className="mt-1 text-xl font-semibold text-text-primary">
                  {reviewPlan.features.length}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface/50 p-4">
                <p className="text-xs text-text-secondary">
                  Estimated effort
                </p>

                <p className="mt-1 text-xl font-semibold text-text-primary">
                  {formatEffort(totalEffort)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface/50 p-4">
                <p className="text-xs text-text-secondary">
                  Dependencies
                </p>

                <p className="mt-1 text-xl font-semibold text-text-primary">
                  {reviewPlan.dependencies.length}
                </p>
              </div>
            </div>
          </section>

          {/* Objectives + Features */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Objectives */}
            <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Objectives
                  </h2>

                  <p className="text-xs text-text-secondary">
                    What this plan is intended to achieve
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {reviewPlan.objectives.map((objective, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-5 text-text-secondary">
                      {objective}
                    </p>
                  </div>
                ))}

                {reviewPlan.objectives.length === 0 && (
                  <p className="text-sm text-text-secondary">
                    No objectives defined.
                  </p>
                )}
              </div>
            </section>

            {/* Features */}
            <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Layers3 size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Planned features
                  </h2>

                  <p className="text-xs text-text-secondary">
                    Approved scope for task generation
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {reviewPlan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-surface/40 p-4"
                  >
                    <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-start sm:gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-semibold text-text-primary">
                          {feature.name}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                          {feature.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                          feature.priority === "high"
                            ? "bg-danger/10 text-danger"
                            : feature.priority === "medium"
                            ? "bg-warning/10 text-warning"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {feature.priority}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-text-secondary">
                      <Clock3 size={13} />
                      {formatEffort(feature.estimatedEffortMinutes || 0)}
                    </div>
                  </div>
                ))}

                {reviewPlan.features.length === 0 && (
                  <p className="text-sm text-text-secondary">
                    No features defined.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Execution Readiness */}
          <section className="rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-text-primary">
                  Ready for task generation
                </h2>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Engino will use this approved plan as the source for breaking the
                  requirement into executable engineering tasks.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-secondary">
                    {reviewPlan.features.length} features
                  </span>

                  <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-secondary">
                    {reviewPlan.objectives.length} objectives
                  </span>

                  <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-secondary">
                    {formatEffort(totalEffort)} estimated effort
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Continue */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
            >
              Continue to Tasks
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      );
    }

  return (
    <div>
      <StepHeader
        eyebrow="Admin Review"
        title="Review and refine the AI plan"
        description="Review the engineering plan generated by Engino. Make any necessary changes before approving it for task generation."
        badge={approved ? "Approved" : "Awaiting Review"}
      />

      <div className="space-y-5">

        {/* AI generated notice */}
        <section className="rounded-2xl border border-primary/20 bg-primary-light p-5">
          <div className="flex items-start gap-3">
            <Sparkles
              size={19}
              className="mt-0.5 shrink-0 text-primary"
            />

            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                AI-generated engineering plan
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Engino generated this plan from the clarified requirement.
                Review and modify it before approving the proposed work.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}

        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          <SectionHeader
            icon={Sparkles}
            title="Plan Overview"
            description="AI's understanding of the implementation scope"
          />

          <textarea
            value={reviewPlan.overview}
            onChange={(event) =>
              handleOverviewChange(event.target.value)
            }
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </section>

        {/* Objectives  */}

        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <SectionHeader
              icon={Target}
              title="Objectives"
              description="What the implementation should achieve"
            />

            {isAdmin && (
              <button
                type="button"
                onClick={addObjective}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-surface"
              >
                <Plus size={14} />
                Add
              </button>
            )}
          </div>

          <div className="space-y-3">
            {reviewPlan.objectives.length > 0 ? (
              reviewPlan.objectives.map((objective, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <div className="mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <CheckCircle2 size={15} />
                  </div>

                  <textarea
                    value={objective}
                    onChange={(event) =>
                      handleObjectiveChange(
                        index,
                        event.target.value
                      )
                    }
                    rows={2}
                    className="min-w-0 flex-1 resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm leading-6 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="mt-2 rounded-lg p-2 text-danger transition hover:bg-danger/10"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <EmptyState text="No objectives have been defined." />
            )}
          </div>
        </section>

        {/* Features */}

        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeader
              icon={Wrench}
              title="Planned Features"
              description="Major implementation areas identified by AI"
            />

            {isAdmin && (
              <button
                type="button"
                onClick={() =>
                  setShowAddFeature((prev) => !prev)
                }
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface"
              >
                <Plus size={16} />
                Add Feature
              </button>
            )}
          </div>

          {/* Add Feature */}
          {showAddFeature && (
            <div className="mb-5 rounded-xl border border-primary/20 bg-primary-light p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Add a feature
                  </h3>

                  <p className="mt-1 text-xs text-text-secondary">
                    Add an implementation area that the AI missed.
                  </p>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowAddFeature(false)}
                    className="rounded-lg p-1.5 text-text-secondary hover:bg-background hover:text-text-primary"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <FeatureForm
                form={newFeature}
                setForm={setNewFeature}
                onSave={handleAddFeature}
                saveLabel="Add Feature"
              />
            </div>
          )}

          <div className="space-y-3">
            {reviewPlan.features.length > 0 ? (
              reviewPlan.features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  {editingFeature === index ? (
                    <FeatureForm
                      form={featureForm}
                      setForm={setFeatureForm}
                      onSave={() => saveFeature(index)}
                      onCancel={cancelEditingFeature}
                      saveLabel="Save Changes"
                    />
                  ) : (
                    <FeatureRow
                      feature={feature}
                      index={index}
                      onEdit={() =>
                        startEditingFeature(feature, index)
                      }
                      onRemove={() => removeFeature(index)}
                    />
                  )}
                </div>
              ))
            ) : (
              <EmptyState text="No features have been defined." />
            )}
          </div>
        </section>

        {/* Technical Considerations */}

        <ListSection
          icon={Wrench}
          title="Technical Considerations"
          description="Important engineering considerations identified by AI"
          items={reviewPlan.technicalConsiderations}
        />

        {/* Dependencies */}

        <ListSection
          icon={Target}
          title="Dependencies"
          description="Systems or capabilities required for implementation"
          items={reviewPlan.dependencies}
        />

        {/* Risks  */}

        <ListSection
          icon={ShieldAlert}
          title="Risks"
          description="Potential issues identified by AI"
          items={reviewPlan.risks}
          danger
        />

        {/* Review plan  */}

        <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-success"
            />

            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                You remain in control
              </h3>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Engino proposes the engineering plan, but the
                administrator decides what should move forward.
                Actual project tasks will only be created after approval.
              </p>
            </div>
          </div>
        </section>

        {/* footer  */}

        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
            {isAdmin && (
              <button
                type="button"
                disabled={approved || isApproving}
                onClick={handleApprove}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  reviewPlan.features.length > 0
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "cursor-not-allowed bg-surface text-text-secondary"
                }`}
              >
                
                {isApproving ? (
                  <>
                    <Loader />
                    <span>Approving...</span>
                  </>
                ) : approved ? (
                  <>
                    <Check size={17} />
                    <span>Plan Approved</span>
                  </>
                ) : (
                  <>
                    <Check size={17}/>
                    <span>Approve Plan</span>
                  </>
                )}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

// Feature Row 
const FeatureRow = ({
  feature,
  index,
  onEdit,
  onRemove,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-xs font-bold text-text-secondary">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
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
            <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-text-secondary">
              {formatEffort(feature.estimatedEffortMinutes)}
            </span>

            <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-text-secondary">
              Feature
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-surface"
        >
          <Edit3 size={14} />
          Edit
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 rounded-lg border border-danger/20 bg-background px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger/10"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>
    </div>
  );
}

// Feature form 
const FeatureForm = ({
  form,
  setForm,
  onSave,
  onCancel,
  saveLabel,
}) => {
  return (
    <div>
      <div className="grid gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
            Feature Name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                name: event.target.value,
              }))
            }
            placeholder="Feature name"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            rows={3}
            placeholder="Describe what this feature should accomplish..."
            className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm leading-6 text-text-primary outline-none placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
              Priority
            </label>

            <select
              value={form.priority}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  priority: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
              Estimated Effort (minutes)
            </label>

            <input
              type="number"
              min="0"
              value={form.estimatedEffortMinutes}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  estimatedEffortMinutes: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface"
            >
              <X size={14} />
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={!form.name.trim()}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
              form.name.trim()
                ? "bg-primary text-white hover:bg-primary-dark"
                : "cursor-not-allowed bg-surface text-text-secondary"
            }`}
          >
            <Save size={14} />
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// List actions 

const ListSection = ({
  icon: Icon,
  title,
  description,
  items = [],
  danger = false,
}) => {
  return (
    <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
      <SectionHeader
        icon={Icon}
        title={title}
        description={description}
      />

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl bg-surface p-4"
            >
              <div
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
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
        <EmptyState text="None identified." />
      )}
    </section>
  );
};

// section header 

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
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

// priority badge 

const PriorityBadge = ({ priority }) => {
  return (
    <span className="w-fit shrink-0 rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold capitalize text-primary">
      {priority || "medium"} priority
    </span>
  );
};

// empty state 

const EmptyState = ({ text }) => {
  return (
    <div className="rounded-xl bg-surface p-4 text-sm text-text-secondary">
      {text}
    </div>
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

export default ReviewStep;
