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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
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
            className="rounded-lg p-1.5 text-text-secondary transition hover:bg-gray-100 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  Are you sure you want to delete this task?
                </p>

                <p className="mt-1.5 break-words text-sm text-gray-600">
                  "{task.title}"
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  The task and its associated information will be permanently
                  removed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border bg-gray-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
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