import { useState } from "react";
import {
    Check,
    ChevronDown,
} from "lucide-react";

import { getInitials } from "../../utils/getInitials";
import useWorkspaceStore from "../../stores/workspaceStore";
import useAuthStore from "../../stores/authStore";

function WorkspaceSwitcher() {
    const { workspaces, currentWorkspaceId, setCurrentWorkspace } = useWorkspaceStore();
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    const selectedWorkspace = workspaces.find((workspace) =>
        workspace._id === currentWorkspaceId
    )

    const handleSelect = (id) => {
        setCurrentWorkspace(id);
        setIsOpen(false);
        window.location.reload();
    };

    return (
        <div className="relative px-4 mb-6">
            {/* Current Workspace */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5
                    bg-workspace hover:bg-workspace-hover transition-colors
                    text-left ${
                        isOpen ? "ring-1 ring-border" : ""
                    }`}
            >
                <div
                    className={`h-9 w-9 shrink-0 rounded-full
                    flex items-center justify-center font-semibold text-sm text-white bg-violet-600`}
                >
                    {getInitials(selectedWorkspace?.name || "?")}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary truncate">
                        {selectedWorkspace?.name || "Select Workspace"}
                    </p>

                    <p className="text-xs text-text-secondary truncate">
                        {selectedWorkspace?.ownerId === user._id
                            ? ("Personal Workspace")
                            : (`${selectedWorkspace?.name}'s Workspace`)
                        }
                    </p>
                </div>

                <ChevronDown
                    size={17}
                    className={`shrink-0 text-text-secondary transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute left-4 right-4 top-[calc(100%+6px)] z-50
                    rounded-xl border border-border bg-card shadow-lg
                    overflow-hidden"
                >
                    <div className="px-4 py-3">
                        <p className="text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                            Workspaces
                        </p>
                    </div>

                    <div className="px-2 pb-2">
                        {workspaces.map((workspace) => {
                            const isSelected =
                                selectedWorkspace?._id === workspace._id;

                            return (
                                <button
                                    key={workspace._id}
                                    type="button"
                                    onClick={() =>
                                        handleSelect(workspace._id)
                                    }
                                    className={`w-full flex items-center gap-3
                                        rounded-lg px-2.5 py-2.5 text-left
                                        transition-colors ${
                                            isSelected
                                                ? "bg-workspace-hover"
                                                : "hover:bg-subtle"
                                        }`}
                                >
                                    <div
                                        className={`h-9 w-9 shrink-0 rounded-full
                                            flex items-center justify-center
                                            text-white bg-violet-500 font-semibold text-sm`}
                                    >
                                        {getInitials(workspace?.name)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-text-primary truncate">
                                            {workspace?.name}
                                        </p>

                                        <p className="text-xs text-text-secondary truncate">
                                            {workspace?.role}
                                        </p>
                                    </div>

                                    {isSelected && (
                                        <Check
                                            size={17}
                                            className="shrink-0 text-violet-600"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkspaceSwitcher;
