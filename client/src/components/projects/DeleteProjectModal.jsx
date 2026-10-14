import useProjectStore from "../../stores/projectStore";
import useToastStore from "../../stores/toastStore";
import useWorkspaceStore from "../../stores/workspaceStore";

function DeleteProjectModal({ isOpen, onClose, selectedProject, navigateBack = null }) {
    
    const { deleteProject, isLoading } = useProjectStore();
    const { showToast } = useToastStore();
    const { currentWorkspaceId } = useWorkspaceStore();
    
    if(!isOpen) return null;


    const handleDeleteProject = async () => {
        try {
            await deleteProject(
                    currentWorkspaceId,
                    selectedProject._id
                );

            onClose();
            showToast("Project deleted successfully!", "success");
            if(navigateBack) {
                navigateBack();
            }
        } catch (error) {
            showToast(
                error.response?.data?.message || "Failed to delete project.",
                "error"
            );
        }
    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 sm:px-4">
                <div className="w-full max-w-md rounded-2xl bg-card shadow-xl">
                    <div className="border-b border-border px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-semibold text-text-primary">
                            Delete Project
                        </h2>

                        <p className="mt-2 text-sm leading-5 text-text-secondary">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-text-primary">
                                {selectedProject?.name}
                            </span>
                            ? This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse gap-2 px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface sm:w-auto"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleDeleteProject}
                            disabled={isLoading}
                            className="w-full rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            {isLoading ? "Deleting..." : "Delete Project"}
                        </button>
                    </div>
                </div>
        </div>
  )
}

export default DeleteProjectModal
