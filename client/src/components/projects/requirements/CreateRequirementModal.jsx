import { useEffect, useState } from "react";
import {
  X,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";

import useRequirementStore from "../../../stores/requirementStore";
import useToastStore from "../../../stores/toastStore";
import Loader from "../../common/Loader";

const complexities = [
  "Low",
  "Medium",
  "High",
];

function CreateRequirementModal({ open, onClose, workspaceId, projectId, projectMembers, requirement = null }) {

   const isEditMode = Boolean(requirement);

    const { isLoading, createRequirement, updateRequirement } = useRequirementStore();
    const { showToast } = useToastStore();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        owner: "",
        complexity: "",
        acceptanceCriteria: [""],
    });

    const [error, setError] = useState("");

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            owner: "",
            complexity: "",
            acceptanceCriteria: [""],
        })
    }

    useEffect(() => {
      if(requirement) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
            name: requirement.name || "",
            description: requirement.description || "",
            owner:
                typeof requirement.owner === "object"
                    ? requirement.owner?._id || ""
                    : requirement.owner || "",
            complexity: requirement.complexity || "",
            acceptanceCriteria:
                requirement.acceptanceCriteria?.length > 0
                    ? requirement.acceptanceCriteria
                    : [""],
        });
      } else {
        resetForm();
      }

      setError("");
    }, [requirement, open]);

    if (!open) return null;

    const handleChange = (field, value) => {
        setError("");
        setFormData((prev) => ({
        ...prev,
        [field]: value,
        }));
    };

    const handleCriteriaChange = (index, value) => {
        setFormData((prev) => ({
        ...prev,
        acceptanceCriteria: prev.acceptanceCriteria.map(
            (criteria, i) => (i === index ? value : criteria)
        ),
        }));
    };

    const addCriteria = () => {
        setFormData((prev) => ({
        ...prev,
        acceptanceCriteria: [
            ...prev.acceptanceCriteria,
            "",
        ],
        }));
    };

    const removeCriteria = (index) => {
        setFormData((prev) => {
        const updatedCriteria =
            prev.acceptanceCriteria.filter(
            (_, i) => i !== index
            );

        return {
            ...prev,
            acceptanceCriteria:
            updatedCriteria.length > 0
                ? updatedCriteria
                : [""],
        };
        });
    };

    

    const handleSubmit = async () => {
      try {
          if (isEditMode) {
              await updateRequirement(
                  workspaceId,
                  projectId,
                  requirement._id,
                  formData
              );

              onClose();
              showToast("Requirement updated successfully!", "success");
              resetForm();

              return;
          }

          await createRequirement(
              workspaceId,
              projectId,
              formData
          );

          onClose();
          showToast("Requirement created successfully!", "success");
          resetForm();
      } catch (error) {
          setError(
              error.response?.data?.message ||
              `Failed to ${
                  isEditMode ? "update" : "create"
              } requirement. Try again.`
          );
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 backdrop-blur-[2px] sm:px-4">

      {/* Modal */}
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-background shadow-xl">

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">

          <div>
            <h2 className="text-lg font-semibold text-text-primary">
                {isEditMode ? "Edit Requirement" : "Create Requirement"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
                {isEditMode
                    ? "Update the requirement details."
                    : "Define what this project needs to accomplish."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition hover:bg-surface hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-4 py-5 sm:px-6">

          <div className="space-y-5">

            {/* Requirement Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Requirement Name{" "}
                <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. User Authentication"
                value={formData.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Description
              </label>

              <textarea
                rows={4}
                placeholder="Describe what the system should accomplish..."
                value={formData.description}
                onChange={(e) =>
                  handleChange(
                    "description",
                    e.target.value
                  )
                }
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary-light"
              />

              <p className="mt-1 text-xs text-text-secondary">
                Provide enough context for Engino AI to understand
                the requirement.
              </p>
            </div>

            {/* Owner + Complexity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Owner */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Owner
                </label>

                <div className="relative">
                  <select
                    value={formData.owner}
                    onChange={(e) =>
                      handleChange(
                        "owner",
                        e.target.value
                      )
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                  >
                    <option value="">
                      Select owner
                    </option>

                    {projectMembers.map((member) => (
                      <option
                        key={member.userId._id}
                        value={member.userId._id}
                      >
                        {member.userId.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                </div>

                <p className="mt-1 text-xs text-text-secondary">
                  Person responsible for this requirement.
                </p>
              </div>

              {/* Complexity */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Complexity{" "}
                  <span className="text-danger">*</span>
                </label>

                <div className="relative">
                  <select
                    value={formData.complexity}
                    onChange={(e) =>
                      handleChange(
                        "complexity",
                        e.target.value
                      )
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                  >
                    <option value="">
                      Select complexity
                    </option>

                    {complexities.map(
                      (complexity) => (
                        <option
                          key={complexity}
                          value={complexity}
                        >
                          {complexity}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <div>
                  <label className="block text-sm font-medium text-text-primary">
                    Acceptance Criteria
                  </label>

                  <p className="mt-1 text-xs text-text-secondary">
                    Define the conditions that must be satisfied
                    for this requirement to be considered complete.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addCriteria}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-primary transition hover:bg-surface"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <div className="space-y-2.5">

                {formData.acceptanceCriteria.map(
                  (criteria, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2"
                    >

                      {/* Number */}
                      <div className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-medium text-primary">
                        {index + 1}
                      </div>

                      {/* Input */}
                      <input
                        type="text"
                        placeholder={`Acceptance criteria ${
                          index + 1
                        }`}
                        value={criteria}
                        onChange={(e) =>
                          handleCriteriaChange(
                            index,
                            e.target.value
                          )
                        }
                        className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />

                      {/* Delete */}
                      {formData.acceptanceCriteria
                        .length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeCriteria(index)
                          }
                          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition hover:bg-danger/5 hover:text-danger"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* AI Notice */}
            <div className="rounded-lg border border-primary/15 bg-primary-light px-4 py-3">

              <p className="text-sm font-medium text-primary">
                Engino AI will analyze this requirement
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                After creation, Engino will evaluate the
                requirement for clarity and completeness. If
                important information is missing, you will be
                asked clarification questions before an
                implementation plan is generated.
              </p>
            </div>
          </div>
        </div>

        {error && (
            <p className="text-xs text-center my-2 text-danger">{error}</p>
        )}
        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            {isLoading ? (
                <Loader />
            ) : (
                isEditMode
                    ? "Save Changes"
                    : "Create Requirement"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRequirementModal;
