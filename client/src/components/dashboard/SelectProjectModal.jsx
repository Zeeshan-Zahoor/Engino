import { FolderKanban, X } from "lucide-react";

function SelectProjectModal({
    isOpen,
    onClose,
    projects,
    onSelect,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-xl">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">
                            Select a Project
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Choose where this requirement should be created.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
                    <div className="space-y-2">
                        {projects.map((project) => (
                            <button
                                key={project._id}
                                type="button"
                                onClick={() => onSelect(project)}
                                className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition hover:border-primary hover:bg-primary-light"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                                    <FolderKanban size={18} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-text-primary">
                                        {project.name}
                                    </p>

                                    {project.description && (
                                        <p className="mt-0.5 truncate text-xs text-text-secondary">
                                            {project.description}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SelectProjectModal;