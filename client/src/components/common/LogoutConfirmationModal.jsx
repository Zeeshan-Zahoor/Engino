import { X, LogOut } from "lucide-react";
import Loader from './Loader';

function LogoutConfirmModal({ isOpen, onClose, onConfirm, isLoading, error }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl border border-border">

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface">
                            <LogOut className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold">
                                Log out?
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to log out?
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-danger text-center mt-2">{error}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                    >
                        {isLoading ? (
                            <Loader size={5}/>
                        ) : ("Log Out")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutConfirmModal;