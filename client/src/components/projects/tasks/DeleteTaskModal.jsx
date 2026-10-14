import { AlertTriangle, Loader, Trash2, X } from "lucide-react";

function DeleteTaskModal({
  task,
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-3 py-4 backdrop-blur-[2px] sm:px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-surface text-danger">
              <Trash2 size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Delete Task
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-text-secondary transition hover:bg-subtle-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-5 sm:px-6">
          <div className="rounded-xl border border-red-100 bg-danger-surface/60 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-danger"
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  Are you sure you want to delete this task?
                </p>

                <p className="mt-1.5 break-words text-sm text-text-secondary">
                  "{task.title}"
                </p>

                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  The task and its associated information will be permanently
                  removed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-border bg-subtle/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-lg bg-card px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-subtle-strong disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-danger-surface0 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader size={15} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Delete Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
