import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, X, Check } from "lucide-react";

import Avatar from "../../utils/Avatar";
import Loader from "../common/Loader";

import useWorkspaceStore from "../../stores/workspaceStore";
import useProjectStore from "../../stores/projectStore";
import useToastStore from "../../stores/toastStore";

function AddProjectMembersModal({ isOpen, onClose, project }) {
    const {
        currentWorkspaceId,
        workspaceMembers,
        getWorkspaceMembers,
    } = useWorkspaceStore();

    const {
        addProjectMembers,
        isLoading,
    } = useProjectStore();

    const { showToast } = useToastStore();

    const [searchInput, setSearchInput] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [roles, setRoles] = useState({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const projectTeam = project?.team || [];

    // Load workspace members when modal opens
    useEffect(() => {
        if (!isOpen) return;

        getWorkspaceMembers();
    }, [isOpen, getWorkspaceMembers]);

    // Reset modal state when closed
    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchInput("");
            setSelectedMembers([]);
            setRoles({});
        }
    }, [isOpen]);

    // Users already belonging to project
    const existingMemberIds = useMemo(
        () =>
            new Set(
                projectTeam.map((membership) =>
                    String(membership.userId?._id)
                )
            ),
        [projectTeam]
    );

    // Search workspace members
    const filteredMembers = useMemo(() => {
        const query = searchInput.trim().toLowerCase();

        if (!query) {
            return workspaceMembers || [];
        }

        return (workspaceMembers || []).filter((membership) => {
            const user = membership.userId;

            return (
                user?.name?.toLowerCase().includes(query) ||
                user?.email?.toLowerCase().includes(query)
            );
        });
    }, [workspaceMembers, searchInput]);

    const toggleMember = (userId) => {
        const id = String(userId);

        setSelectedMembers((current) => {
            if (current.includes(id)) {
                return current.filter((memberId) => memberId !== id);
            }

            return [...current, id];
        });

        // Default role
        setRoles((current) => ({
            ...current,
            [id]: current[id] || "Developer",
        }));
    };

    const handleRoleChange = (userId, role) => {
        setRoles((current) => ({
            ...current,
            [String(userId)]: role,
        }));
    };

    const handleAddMembers = async () => {
        if (selectedMembers.length === 0) {
            showToast("Select at least one member.", "error");
            return;
        }

        try {
            const members = selectedMembers.map((userId) => ({
                targetUserId: userId,
                role: roles[userId],
            }));

            await addProjectMembers(
                currentWorkspaceId,
                project._id,
                members
            );

            showToast(`${members.length} ${members.length === 1 ?  "member" : "members"} added successfully.`, "success");

            onClose();

        } catch (error) {
            showToast(
                error.response?.data?.message ||
                    "Failed to add project members.",
                "error"
            );
        }
    };

    if (!isOpen) return null;

    const projectRoles = [
        "Project Manager",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "UI/UX Designer",
        "QA Tester",
        "DevOps Engineer",
        "AI Engineer",
        "Developer",
        "Other",
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 sm:px-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-xl">

                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-6 sm:py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">
                            Add Team Members
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Select workspace members and assign their project roles.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto px-4 py-5 sm:px-6">

                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                        />

                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) =>
                                setSearchInput(e.target.value)
                            }
                            placeholder="Search workspace members..."
                            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
                        />
                    </div>

                    {/* Members */}
                    <div className="mt-4 space-y-2">

                        {filteredMembers.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-border py-10 text-center">
                                <p className="text-sm font-semibold text-text-primary">
                                    No members found
                                </p>

                                <p className="mt-1 text-sm text-text-secondary">
                                    Try a different search.
                                </p>
                            </div>
                        ) : (
                            filteredMembers.map((membership) => {
                                const member = membership.userId;

                                if (!member) return null;

                                const memberId = String(member._id);

                                const alreadyAdded =
                                    existingMemberIds.has(memberId);

                                const selected =
                                    selectedMembers.includes(memberId);

                                return (
                                    <div
                                        key={membership._id}
                                        onClick={() => {
                                            if (!alreadyAdded) {
                                                toggleMember(memberId);
                                            }
                                        }}
                                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                                            alreadyAdded
                                                ? "cursor-not-allowed bg-surface opacity-60"
                                                : selected
                                                ? "cursor-pointer border-primary bg-primary-light"
                                                : "cursor-pointer border-border hover:bg-surface"
                                        }`}
                                    >
                                        {/* Checkbox */}
                                        <div
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                                selected
                                                    ? "border-primary bg-primary text-white"
                                                    : "border-border"
                                            }`}
                                        >
                                            {selected && (
                                                <Check size={14} />
                                            )}
                                        </div>

                                        {/* Avatar */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light">
                                            <Avatar user={member} />
                                        </div>

                                        {/* User */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-text-primary">
                                                {member.name}
                                            </p>

                                            <p className="truncate text-xs text-text-secondary">
                                                {member.email}
                                            </p>
                                        </div>

                                        {/* Workspace role */}
                                        <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                                            {membership.role}
                                        </span>

                                        {alreadyAdded && (
                                            <span className="shrink-0 text-xs font-medium text-success">
                                                Already added
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Selected members */}
                    {selectedMembers.length > 0 && (
                        <div className="mt-6">
                            <div className="mb-3">
                                <h3 className="text-sm font-semibold text-text-primary">
                                    Selected Members ({selectedMembers.length})
                                </h3>

                                <p className="mt-1 text-xs text-text-secondary">
                                    Assign a project role to each member.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {selectedMembers.map((userId) => {
                                    const membership =
                                        workspaceMembers.find(
                                            (item) =>
                                                String(item.userId?._id) ===
                                                String(userId)
                                        );

                                    const member = membership?.userId;

                                    if (!member) return null;

                                    return (
                                        <div
                                            key={userId}
                                            className="flex items-center gap-3 rounded-xl border border-border px-4 py-3"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light">
                                                <Avatar user={member} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-text-primary">
                                                    {member.name}
                                                </p>

                                                <p className="truncate text-xs text-text-secondary">
                                                    {member.email}
                                                </p>
                                            </div>

                                            <select
                                                value={
                                                    roles[userId] ||
                                                    "Developer"
                                                }
                                                onChange={(e) =>
                                                    handleRoleChange(
                                                        userId,
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                            >
                                                {projectRoles.map((role) => (
                                                    <option
                                                        key={role}
                                                        value={role}
                                                    >
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleMember(userId)
                                                }
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface hover:text-danger"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-xs text-text-secondary">
                        {selectedMembers.length > 0
                            ? `${selectedMembers.length} selected`
                            : "No members selected"}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleAddMembers}
                            disabled={
                                isLoading ||
                                selectedMembers.length === 0
                            }
                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={16} />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} />
                                    Add{" "}
                                    {selectedMembers.length > 0
                                        ? `${selectedMembers.length} `
                                        : ""}
                                    {selectedMembers.length === 1
                                        ? "Member"
                                        : "Members"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProjectMembersModal;
