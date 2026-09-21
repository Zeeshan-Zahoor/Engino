import {
  X,
  CalendarDays,
  Clock3,
  BarChart3,
  ListChecks,
  Tags,
  Folder,
  FileText,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import Avatar from "../../../utils/Avatar";

const EditTaskModal = ({ task, open, onClose, onSave }) => {
  if (!open) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "Todo",
    priority: task.priority || "Medium",
    type: task.type || "Development",
    assignee: task.assignee || null,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    estimatedEffortMinutes: task.estimatedEffortMinutes || 0,
    complexity: task.complexity || "Medium",
    tags: task.tags || [],
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newTag, setNewTag] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    const tag = newTag.trim();

    if (!tag || formData.tags.includes(tag)) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setNewTag("");
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave?.({
      ...formData,
      dueDate: formData.dueDate || null,
      estimatedEffortMinutes: Number(formData.estimatedEffortMinutes) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      {/* Modal */}
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

        {/* ================= HEADER ================= */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Task
            </h2>

            <div className="mt-1 h-1 w-10 rounded-full bg-violet-600" />

            <p className="mt-2 text-xs text-gray-400">
              Update task information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <form
          id="edit-task-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-6 px-6 py-6">

            {/* ================= BASIC INFORMATION ================= */}
            <section>
              <SectionLabel
                icon={<ListChecks size={15} />}
                label="Basic Information"
              />

              <div className="mt-3 space-y-4">

                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500">
                    Title
                  </label>

                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      updateField("title", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    placeholder="Enter task title"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    placeholder="Describe the task..."
                  />
                </div>
              </div>
            </section>

            {/* ================= STATUS / PRIORITY / TYPE ================= */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* STATUS */}
              <FormField label="Status">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    updateField("status", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="Todo">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </FormField>

              {/* PRIORITY */}
              <FormField label="Priority">
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    updateField("priority", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </FormField>

              {/* TYPE */}
              <FormField label="Type">
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) =>
                    updateField("type", e.target.value)
                  }
                  className="form-input"
                  placeholder="Development"
                />
              </FormField>
            </div>

            {/* ================= TASK DETAILS ================= */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* DUE DATE */}
              <FormField
                label="Due Date"
                icon={<CalendarDays size={15} />}
              >
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    updateField("dueDate", e.target.value)
                  }
                  className="form-input"
                />
              </FormField>

              {/* ESTIMATED EFFORT */}
              <FormField
                label="Estimated Effort"
                icon={<Clock3 size={15} />}
              >
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedEffortMinutes}
                    onChange={(e) =>
                      updateField(
                        "estimatedEffortMinutes",
                        e.target.value
                      )
                    }
                    className="form-input pr-20"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    minutes
                  </span>
                </div>
              </FormField>

              {/* COMPLEXITY */}
              <FormField
                label="Complexity"
                icon={<BarChart3 size={15} />}
              >
                <select
                  value={formData.complexity}
                  onChange={(e) =>
                    updateField("complexity", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </FormField>

              {/* ASSIGNEE */}
              <FormField label="Assignee">
                <div className="flex h-11 items-center gap-2 rounded-lg border border-gray-200 px-3">
                  {formData.assignee ? (
                    <>
                      <div className="w-7">
                        <Avatar user={formData.assignee} />
                      </div>

                      <span className="text-sm text-gray-700">
                        {formData.assignee.name || "Assigned user"}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Unassigned
                    </span>
                  )}
                </div>
              </FormField>
            </div>

            {/* ================= TAGS ================= */}
            <section>
              <SectionLabel
                icon={<Tags size={15} />}
                label="Tags"
              />

              <div className="mt-3 rounded-xl border border-gray-200 p-4">

                <div className="flex flex-wrap gap-2">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                      >
                        {tag}

                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-400 transition hover:text-red-500"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">
                      No tags added
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag"
                    className="h-10 flex-1 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />

                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-violet-600"
                  >
                    <Plus size={15} />
                    Add
                  </button>
                </div>
              </div>
            </section>

            {/* ================= PROJECT / REQUIREMENT ================= */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <ReferenceCard
                icon={
                  <Folder
                    size={17}
                    className="text-blue-500"
                  />
                }
                label="Project"
                title={
                  task.projectId?.name ||
                  "User Authentication for Queuecare"
                }
                secondary={
                  task.projectId?.code ||
                  "Third project"
                }
              />

              <ReferenceCard
                icon={
                  <FileText
                    size={17}
                    className="text-violet-500"
                  />
                }
                label="Requirement"
                title={
                  task.requirementId?.name ||
                  "User Authentication"
                }
                secondary={
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">
                    <CheckCircle2 size={11} />
                    Approved
                  </span>
                }
              />
            </div>

            <div className="h-1" />
          </div>
        </form>

        {/* ================= FOOTER ================= */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-gray-100 bg-white px-6 py-4">

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Task ID</span>

            <span className="rounded-md bg-gray-50 px-2.5 py-1.5 font-mono text-[11px] text-gray-500">
              {task._id || task.id || "—"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="edit-task-form"
              className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================= */
/* Helper Components                                          */
/* ========================================================= */

const FormField = ({ label, icon, children }) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
        {icon}
        {label}
      </label>

      {children}
    </div>
  );
};

const SectionLabel = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
      {icon}
      <span>{label}</span>
    </div>
  );
};

const ReferenceCard = ({
  icon,
  label,
  title,
  secondary,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-500">
        {icon}
        <span>{label}</span>
      </div>

      <p className="text-sm font-semibold text-gray-800">
        {title}
      </p>

      <div className="mt-1 text-xs text-gray-400">
        {secondary}
      </div>
    </div>
  );
};

export default EditTaskModal;