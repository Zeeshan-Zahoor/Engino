import {  useEffect, useState } from "react";
import {
  X,
  ChevronDown,
  CalendarDays,
  Tag,
  Plus,
} from "lucide-react";
import useWorkspaceStore from "../../stores/workspaceStore";
import useProjecStore from "../../stores/projectStore";
import useToastStore from "../../stores/toastStore";
import useTaskStore from "../../stores/taskStore";
import { useParams } from "react-router-dom";

import Loader from "../common/Loader";
import Toast from "../common/Toast";

const taskTypes = [
  "Feature",
  "Bug",
  "Improvement",
  "Documentation",
  "Testing",
  "Other",
];

const complexities = [
  "Low",
  "Medium",
  "High",
];

const priorities = [
  "Low",
  "Medium",
  "High",
];

function CreateTaskModal({ open, onClose }) {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { activeProject, fetchProject } = useProjecStore();
  const { createTask, isLoading } = useTaskStore();
  const { showToast } = useToastStore();
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    complexity: "",
    priority: "Medium",
    assignee: "",
    dueDate: "",
    estimatedEffortMinutes: "",
    requirementId: "",
    tags: [],
  });

  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if(!currentWorkspaceId || projectId || activeProject) return;
    fetchProject(projectId);

  }, [currentWorkspaceId, projectId, fetchProject, activeProject]);


  const requirements = activeProject?.requirements || [];
  const projectMembers = activeProject?.team || [];

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      complexity: "",
      priority: "Medium",
      assignee: "",
      dueDate: "",
      estimatedEffortMinutes: "",
      requirementId: "",
      tags: [],
    })
  }

  const handleCreateTask = async () => {
      try {
        await createTask(currentWorkspaceId, projectId, {
          ...formData,
          assignee: formData.assignee || null,
          requirementId: formData.requirementId || null,
        });
        await fetchProject(currentWorkspaceId, projectId);
        
        onClose();
        showToast("Task Created Successfully!", "success");
        resetForm();

      } catch (error) {
          setError(error.response?.data?.message || "Failed to create task. Try again.");
      }
  }

  const handleChange = (field, value) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (formData.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if(!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">

      {/* Modal */}
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-background shadow-xl">

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Create Task
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Add a new task to the project.
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
        <div className="overflow-y-auto px-6 py-5">

          <div className="space-y-5">

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Task Title <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Implement authentication API"
                value={formData.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
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
                placeholder="Describe what needs to be done..."
                value={formData.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>

            {/* Type + Complexity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Task Type <span className="text-danger">*</span>
                </label>

                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      handleChange("type", e.target.value)
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                  >
                    <option value="">Select type</option>

                    {taskTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                </div>
              </div>

              {/* Complexity */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Complexity <span className="text-danger">*</span>
                </label>

                <div className="relative">
                  <select
                    value={formData.complexity}
                    onChange={(e) =>
                      handleChange("complexity", e.target.value)
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                  >
                    <option value="">Select complexity</option>

                    {complexities.map((complexity) => (
                      <option
                        key={complexity}
                        value={complexity}
                      >
                        {complexity}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Priority + Assignee */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Priority */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Priority
                </label>

                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      handleChange("priority", e.target.value)
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Assignee
                </label>

                <div className="relative">
                  <select
                    value={formData.assignee}
                    onChange={(e) =>
                      handleChange("assignee", e.target.value)
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                  >
                    <option value="">Unassigned</option>

                    {projectMembers.map((member) => (
                      <option key={member.userId._id} value={member.userId._id}>
                        {member.userId.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Due Date + Estimated Effort */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Due Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Due Date
                </label>

                <div className="relative">
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleChange("dueDate", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />

                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                </div>
              </div>

              {/* Estimated Effort */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Estimated Effort
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 240"
                    value={formData.estimatedEffortMinutes}
                    onChange={(e) =>
                      handleChange(
                        "estimatedEffortMinutes",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-14 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                    min
                  </span>
                </div>

                <p className="mt-1 text-xs text-text-secondary">
                  Enter estimated time in minutes.
                </p>
              </div>
            </div>

            {/* Requirement */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Requirement
              </label>

              <div className="relative">
                <select
                  value={formData.requirementId}
                  onChange={(e) =>
                    handleChange(
                      "requirementId",
                      e.target.value
                    )
                  }
                  className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                >
                  <option value="">
                    No linked requirement
                  </option>

                  {requirements.map((requirement, index) => (
                    <option
                      key={requirement._id}
                      value={requirement._id}
                    >
                      {index + 1} — {requirement.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
              </div>

              <p className="mt-1 text-xs text-text-secondary">
                Optionally link this task to a project requirement.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Tags
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />

                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) =>
                      setTagInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddTag}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-text-primary transition hover:bg-surface"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {/* Tag List */}
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {tag}

                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-center text-danger my-2">{error}</p>
        )}

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreateTask}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader />
              </div>
            ) :
            ("Create Task")
            }
          </button>
        </div>
      </div>

      <Toast />
    </div>
  );
}

export default CreateTaskModal;
