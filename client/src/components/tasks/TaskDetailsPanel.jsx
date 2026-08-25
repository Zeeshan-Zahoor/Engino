import {
  X,
  ChevronDown,
  MoreVertical,
  Clock3,
  CheckCircle2,
} from "lucide-react";

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-text-secondary">
        {label}
      </span>

      <div className="text-right text-sm font-medium text-text-primary">
        {children}
      </div>
    </div>
  );
}

function TaskDetailsPanel() {
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-white">
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-secondary">
              TSK-1024
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-6 text-text-primary">
              Build Attendance API
            </h2>

            <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
              <span className="text-primary">▣</span>
              <span>Student Attendance Tracking System</span>
            </div>
          </div>

          <button
            type="button"
            className="shrink-0 text-text-secondary transition hover:text-text-primary"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status */}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-info"
          >
            In Progress
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-b border-border px-4">
        <div className="flex gap-5 overflow-x-auto">
          <button
            type="button"
            className="relative whitespace-nowrap py-3 text-sm font-semibold text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
          >
            Details
          </button>

          <button
            type="button"
            className="whitespace-nowrap py-3 text-sm text-text-secondary"
          >
            Subtasks (6)
          </button>

          <button
            type="button"
            className="whitespace-nowrap py-3 text-sm text-text-secondary"
          >
            Comments (3)
          </button>

          <button
            type="button"
            className="whitespace-nowrap py-3 text-sm text-text-secondary"
          >
            Activity
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Description */}
        <section className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Description
          </h3>

          <p className="mt-3 text-sm leading-5 text-text-secondary">
            Develop RESTful API endpoints to mark, update and
            retrieve student attendance records.
          </p>

          <button
            type="button"
            className="mt-1 text-sm font-medium text-primary"
          >
            Show more
          </button>
        </section>

        {/* Details */}
        <section className="space-y-4 border-b border-border p-4">
          <DetailRow label="Assignee">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                AK
              </div>
              Ahmed Khan
            </div>
          </DetailRow>

          <DetailRow label="Reporter">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-primary">
                ZZ
              </div>
              Zeeshan Zahoor
            </div>
          </DetailRow>

          <DetailRow label="Priority">
            <span className="inline-flex rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-danger">
              High
            </span>
          </DetailRow>

          <DetailRow label="Due Date">
            <div>
              <span>May 28, 2025</span>
              <span className="ml-1 text-danger">(2 days left)</span>
            </div>
          </DetailRow>

          <DetailRow label="Estimated Effort">
            8h
          </DetailRow>

          <DetailRow label="Time Spent">
            4h 48m
          </DetailRow>

          <DetailRow label="Task Type">
            <span className="inline-flex rounded-md bg-purple-50 px-2 py-1 text-xs font-semibold text-primary">
              Development
            </span>
          </DetailRow>

          <DetailRow label="Complexity">
            <div className="flex items-center gap-2">
              <span className="tracking-wide text-warning">
                ●●●○
              </span>
              <span>Medium</span>
            </div>
          </DetailRow>
        </section>

        {/* Tags */}
        <section className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Tags
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {["backend", "api", "attendance", "express.js"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ),
            )}

            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary"
            >
              +
            </button>
          </div>
        </section>

        {/* Progress */}
        <section className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              Progress
            </h3>

            <span className="text-sm font-semibold text-text-primary">
              60%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: "60%" }}
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-1 text-xs text-text-secondary">
            <Clock3 size={13} />
            4h 48m of 8h
          </div>
        </section>

        {/* Linked Requirement */}
        <section className="p-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Linked Requirement
          </h3>

          <div className="mt-3 rounded-lg bg-purple-50 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-primary">
                <CheckCircle2 size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  Student Attendance Tracking System
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  REQ-001
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface"
          >
            <MoreVertical size={16} />
            More Actions
          </button>

          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Update Status
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default TaskDetailsPanel;