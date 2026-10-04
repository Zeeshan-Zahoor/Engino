import useRequirementStore from "../../../stores/requirementStore";
import useToastStore from "../../../stores/toastStore";
import useWorkspaceStore from "../../../stores/workspaceStore";

function DeleteRequirementModal({ isOpen, onClose, projectId, requirement, navigateBack = null }) {
    
    const { deleteRequirement, isLoading } = useRequirementStore();
    const { showToast } = useToastStore();
    const { currentWorkspaceId } = useWorkspaceStore();
    
    if(!isOpen) return null;

    const handleDeleteRequirement = async () => {
        try {
            await deleteRequirement(
                    currentWorkspaceId,
                    projectId,
                    requirement._id,
                );

            onClose();
            showToast("Requirement deleted successfully!", "success");
            if(navigateBack) {
                navigateBack();
            }
        } catch (error) {
            showToast(
                error.response?.data?.message || "Failed to delete requirement.",
                "error"
            );
        }
    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                    <div className="border-b border-border px-6 py-5">
                        <h2 className="text-lg font-semibold text-text-primary">
                            Delete Requirement
                        </h2>

                        <p className="mt-2 text-sm leading-5 text-text-secondary">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-text-primary">
                                {requirement?.name}
                            </span>
                            ? This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleDeleteRequirement}
                            disabled={isLoading}
                            className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? "Deleting..." : "Delete Requirement"}
                        </button>
                    </div>
                </div>
        </div>
  )
}

export default DeleteRequirementModal