import { useState } from "react";
import {
  X,
  ChevronDown,
  CalendarDays,
  Tag,
  Plus,
} from "lucide-react";

const projectMembers = [
  {
    id: "1",
    name: "Zeeshan Zahoor",
    initials: "ZZ",
  },
  {
    id: "2",
    name: "Zeeshan Member",
    initials: "ZM",
  },
  {
    id: "3",
    name: "Dilshada begum",
    initials: "DB",
  },
  {
    id: "4",
    name: "Queue Care",
    initials: "QC",
  },
];

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

const requirements = [
  {
    id: "REQ-001",
    title: "User Authentication",
  },
  {
    id: "REQ-002",
    title: "Project Management",
  },
  {
    id: "REQ-003",
    title: "Task Management",
  },
];

function CreateTaskModal({ open, onClose }) {

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

  const [tagInput, setTagInput] = useState("");

  const handleChange = (field, value) => {
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
                      <option key={member.id} value={member.id}>
                        {member.name}
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

                  {requirements.map((requirement) => (
                    <option
                      key={requirement.id}
                      value={requirement.id}
                    >
                      {requirement.id} — {requirement.title}
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
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskModal;