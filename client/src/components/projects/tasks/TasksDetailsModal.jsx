import {
  X,
  Pencil,
  AlertTriangle,
  Code2,
  Clock3,
  CalendarDays,
  BarChart3,
  ListChecks,
  Tags,
  Folder,
  FileText,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useState } from "react";
import Avatar from "../../../utils/Avatar";
import Loader from "../../common/Loader";
import { isWorkspaceAdmin } from "../../../utils/isWorkspaceAdmin";

const TaskDetailsModal = ({ task, open, editMode, cancelEditMode, onEdit, onClose, projectMembers = [], onSave, loading, error }) => {
  
  const [editedTask, setEditedTask] = useState(task || {});
  const isAdmin = isWorkspaceAdmin();

  console.log(task)

  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditedTask(task);
    }
  }, [task, editMode]);
  
  if (!task || !open) return null;

  const updateField = (field, value) => {
    setEditedTask((prev) => ({
      ...prev, 
      [field]: value,
    }));
  }
  
  const formatDate = (date) => {
    if (!date) return "Not set";
    
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  
  const formatEffort = (minutes = 0) => {
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return mins ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  const statusConfig = {
    Todo: {
      label: "To Do",
      className: "bg-info-surface text-info",
      dotClassName: "bg-info-surface0",
    },
    "In Progress": {
      label: "In Progress",
      className: "bg-info-surface text-info",
      dotClassName: "bg-info-surface0",
    },
    Done: {
      label: "Done",
      className: "bg-success-surface text-success",
      dotClassName: "bg-success-surface0",
    },
  };

  const priorityConfig = {
    Low: {
      className: "bg-success-surface text-success",
    },
    Medium: {
      className: "bg-warning-surface text-warning",
    },
    High: {
      className: "bg-danger-surface text-danger",
    },
  };

  const complexityConfig = {
    Low: "bg-success-surface text-success",
    Medium: "bg-warning-surface text-warning",
    High: "bg-danger-surface text-danger",
  };

  const status = statusConfig[task.status] || statusConfig["Todo"];
  const priority =
    priorityConfig[task.priority] || priorityConfig.Medium;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      {/* Modal */}
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

        {/* ================= HEADER ================= */}
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Task Details
            </h2>

            <div className="mt-1 h-1 w-10 rounded-full bg-violet-600" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted transition hover:bg-subtle-strong hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 py-6">

            {/* AI GENERATED + EDIT */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">

                <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
                  <Code2 size={13} />
                  AI Generated
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>
                    Created{" "}
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recently"}
                  </span>
                </div>

                {editMode ? (
                  <input
                    type="text"
                    value={editedTask.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-xl font-semibold text-text-primary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    placeholder="Task title"
                  />
                ) : (
                  <h1 className="mt-2 text-xl font-semibold leading-7 text-text-primary">
                    {task.title}
                  </h1>
                )}

                {editMode ? (
                  <textarea
                    value={editedTask.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    className="mt-2 w-full resize-none rounded-lg border border-border px-3 py-2 text-sm leading-5 text-text-secondary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    placeholder="Task description"
                  />
                ) : (
                  <p className="mt-1.5 max-w-2xl text-sm leading-5 text-text-secondary">
                    {task.description || "No task description provided."}
                  </p>
                )}
              </div>

              {!editMode && isAdmin && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-text-primary shadow-sm transition hover:bg-subtle"
                >
                  <Pencil size={15} />
                  Edit Task
                </button>
              )}

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* STATUS */}
              <PropertyBlock label="Status">
                {editMode ? (
                  <select
                    value={editedTask.status || "Todo"}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-text-primary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="Todo">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                ) : (
                  <div
                    className={`flex h-11 items-center rounded-lg px-3.5 text-sm font-medium ${status.className}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${status.dotClassName}`}
                      />
                      <span>{status.label}</span>
                    </div>
                  </div>
                )}
              </PropertyBlock>

              {/* PRIORITY */}
              <PropertyBlock label="Priority">
                {editMode ? (
                  <select
                    value={editedTask.priority || "Medium"}
                    onChange={(e) => updateField("priority", e.target.value)}
                    className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-text-primary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                ) : (
                  <div
                  className={`flex h-11 items-center justify-between rounded-lg px-3.5 text-sm font-medium ${priority.className}`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={15} />
                    <span>{task.priority || "Medium"}</span>
                  </div>

                </div>
                )}
              </PropertyBlock>

              {/* TYPE */}
              <PropertyBlock label="Type">
                {editMode ? (
                  <select
                    value={editedTask.type || "Development"}
                    onChange={(e) => updateField("type", e.target.value)}
                    className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-text-primary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="Feature">Feature</option>
                    <option value="Bug">Bug</option>
                    <option value="Improvement">Improvement</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Testing">Testing</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="flex h-11 items-center justify-between rounded-lg bg-violet-50 px-3.5 text-sm font-medium text-violet-600">
                    <div className="flex items-center gap-2">
                      <Code2 size={15} />
                      <span>{task.type || "Development"}</span>
                    </div>

                  </div>
                )}
              </PropertyBlock>
            </div>

            <div className="grid grid-cols-2 gap-5 border-y border-border py-5 md:grid-cols-4">

              {/* ASSIGNEE */}
              {editMode ? (
                <PropertyBlock label="Assignee">
                  <select
                    value={editedTask.assignee?._id || editedTask.assignee || ""}
                    onChange={(e) => {
                      const selectedMember = projectMembers.find(
                        (member) => member.userId?._id === e.target.value || member.userId === e.target.value
                      );

                      updateField("assignee", selectedMember?.userId || null);
                    }}
                    className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-text-primary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="">Unassigned</option>

                    {projectMembers.map((member) => {
                      const user = member.userId;

                      return (
                        <option key={user?._id} value={user?._id}>
                          {user?.name}
                        </option>
                      );
                    })}
                  </select>
                </PropertyBlock>
              ) : (
                <InfoItem
                  icon={
                    <div className="w-8">
                      <Avatar user={task.assignee} />
                    </div>
                  }
                  label="Assignee"
                  value={task.assignee?.name || "Unassigned"}
                  secondary={task.assignee?.role || "No assignee"}
                />
              )}

              {/* DUE DATE */}
              {editMode ? (
                <PropertyBlock
                  label="Due Date"
                >
                  <input
                    type="date"
                    value={
                      editedTask.dueDate
                        ? new Date(editedTask.dueDate).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => updateField("dueDate", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </PropertyBlock>
              ) : (
                <InfoItem
                icon={
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-subtle text-text-secondary">
                    <CalendarDays size={17} />
                  </div>
                }
                label="Due Date"
                value={formatDate(task.dueDate)}
                secondary={
                  task.dueDate
                    ? getRelativeDate(task.dueDate)
                    : "No due date"
                }
              />
              )}

              {/* EFFORT */}
              {editMode ? (
                <PropertyBlock
                  label="Estimated Effort"
                >
                  <input
                    type="number"
                    min="0"
                    value={editedTask.estimatedEffortMinutes || 0}
                    onChange={(e) =>
                      updateField(
                        "estimatedEffortMinutes",
                        Number(e.target.value)
                      )
                    }
                    className="h-10 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </PropertyBlock>
              ) : (
                <InfoItem
                icon={
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-subtle text-text-secondary">
                    <Clock3 size={17} />
                  </div>
                }
                label="Estimated Effort"
                value={formatEffort(task.estimatedEffortMinutes)}
                secondary="Estimated"
              />
              )}

              {/* COMPLEXITY */}
              {editMode ? (
                <PropertyBlock
                  label="Complexity"
                >
                  <select
                    value={editedTask.complexity || "Medium"}
                    onChange={(e) => updateField("complexity", e.target.value)}
                    className="h-10 w-full rounded-lg border border-border px-3 text-sm text-text-primary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </PropertyBlock>
              ) : (
                <InfoItem
                  icon={
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-surface text-orange-500">
                      <BarChart3 size={17} />
                    </div>
                  }
                  label="Complexity"
                  value={
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        complexityConfig[task.complexity] ||
                        complexityConfig.Medium
                      }`}
                    >
                      {task.complexity || "Medium"}
                    </span>
                  }
                  secondary=""
                />
              )}
            </div>

            {/* ================= DESCRIPTION ================= */}
            <section>
              <SectionLabel
                icon={<ListChecks size={15} />}
                label="Description"
              />

              {editMode ? (
                <textarea
                  value={editedTask.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={5}
                  className="mt-3 w-full resize-none rounded-xl border border-border bg-subtle px-4 py-3 text-sm leading-6 text-text-secondary outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  placeholder="Task description"
                />
              ) : (
                <div className="mt-3 rounded-xl bg-subtle px-4 py-4">
                <p className="text-sm leading-6 text-text-secondary">
                  {task.description ||
                    "No description has been provided for this task."}
                </p>
              </div>
              )}
            </section>

            {/* ================= TAGS ================= */}
            {editMode ? (
              <div className="mt-3 rounded-xl border border-border p-4">
              <div className="flex flex-wrap gap-2">
                {(editedTask.tags || []).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-subtle-strong px-3 py-1.5 text-xs font-medium text-text-secondary"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "tags",
                          editedTask.tags.filter((_, i) => i !== index)
                        )
                      }
                      className="text-text-muted hover:text-danger"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            ) : (
              <section>
              <SectionLabel
                icon={<Tags size={15} />}
                label="Tags"
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {task.tags?.length ? (
                  task.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full bg-subtle-strong px-3 py-1.5 text-xs font-medium text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-text-muted">
                    No tags
                  </span>
                )}

                <button
                  type="button"
                  className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-violet-400 hover:text-violet-600"
                >
                  + Add tag
                </button>
              </div>
            </section>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* PROJECT */}
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
                  "Unknown"
                }
                secondary={
                  task.projectId?.code ||
                  "No code"
                }
              />

              {/* REQUIREMENT */}
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
                  "No Requirement"
                }
                secondary={
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-surface px-2 py-0.5 text-[11px] font-medium text-primary">
                    <CheckCircle2 size={11} />
                    {task.requirementId?.aiStatus}
                  </span>
                }
              />
            </div>

            {/* Extra bottom breathing room for scroll */}
            <div className="h-1" />
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-danger my-2">{error}</p>
        )}

        {/* ================= FOOTER ================= */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-card px-6 py-4">

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Task ID</span>

            <span className="rounded-md bg-subtle px-2.5 py-1.5 font-mono text-[11px] text-text-secondary">
              {task._id || task.id || "—"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={cancelEditMode}
                  className="rounded-lg bg-subtle px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-subtle-strong"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => onSave(editedTask)}
                  className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
                >
                  {loading ? (
                    <Loader />                   
                  ) : ("Save Changes")}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-subtle px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-subtle-strong"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const PropertyBlock = ({ label, children }) => {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-text-secondary">
        {label}
      </p>

      {children}
    </div>
  );
};


const InfoItem = ({
  icon,
  label,
  value,
  secondary,
}) => {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-text-secondary">
        {label}
      </p>

      <div className="flex items-center gap-2.5">
        {icon}

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-text-primary">
            {value}
          </div>

          {secondary && (
            <div className="mt-0.5 truncate text-xs text-text-muted">
              {secondary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
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
    <div className="rounded-xl border border-border bg-subtle/50 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-text-secondary">
        {icon}
        <span>{label}</span>
      </div>

      <p className="text-sm font-semibold text-text-primary">
        {title}
      </p>

      <div className="mt-1 text-xs text-text-muted">
        {secondary}
      </div>
    </div>
  );
};

const getRelativeDate = (date) => {
  const target = new Date(date);
  const now = new Date();

  const diff = target.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "In 1 day";

  return `In ${days} days`;
};

export default TaskDetailsModal;