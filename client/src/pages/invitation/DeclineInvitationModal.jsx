import { AlertTriangle, X } from "lucide-react";
import Loader from "../../components/common/Loader";

function DeclineInvitationModal({ isOpen, onClose, onConfirm, isLoading = false, error = "" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={22} strokeWidth={2} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Decline invitation?
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg
                       text-slate-400 hover:bg-slate-100 hover:text-slate-600
                       transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to decline this invitation? You will not be
            added to the workspace, and the invitation will no longer be
            available.
          </p>
        </div>

        {error && (
            <p className="text-danger text-xs text-center mt-2 mb-0">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2.5 text-sm font-medium
                       text-slate-700 hover:bg-slate-100
                       transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold
                       text-white shadow-sm hover:bg-red-700
                       transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
                <Loader />
            ) : "Decline invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeclineInvitationModal;