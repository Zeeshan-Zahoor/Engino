import { useEffect, useState } from "react";
import {
  UserPlus,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import Avatar from "../../utils/Avatar";

import useAuthStore from "../../stores/authStore";
import useWorkspaceStore from "../../stores/workspaceStore";
import useProjectStore from "../../stores/projectStore";
import useToastStore from "../../stores/toastStore";
import Loader from "../common/Loader";
import AddProjectMemberModal from "./AddProjectMembersModal";

function ProjectTeam({ project }) {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const { currentWorkspaceId, workspaceMembers, getWorkspaceMembers } = useWorkspaceStore();
  const { removeProjectMember, isLoading, error } = useProjectStore();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const team = project?.team || [];

  useEffect(() => {
    getWorkspaceMembers();
  }, [getWorkspaceMembers]);

  const handleRemoveProjectMember = (userId) => {
        try {
            removeProjectMember(currentWorkspaceId, project?._id, userId);
        } catch {
            showToast(error.response?.data?.message || "Failed to remove memeber. Try again.", "error")
        }  finally {
            setOpenMenuId(null); 
        }
  }

  const isAdmin = workspaceMembers?.some(member => member.userId._id === user?._id && member.role === "Admin")


  return (
    <section className="rounded-2xl border border-border bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Team Members ({team.length})
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            {isAdmin ? "Manage project members and their roles." : "See project members and their roles."}
          </p>
        </div>

        {isAdmin && (
            <button
                type="button"
                onClick={() => setIsAddMemberModalOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
                <UserPlus size={16} />
                Add Member
            </button>
        )}
      </div>

      {/* Empty state */}
      {team.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border py-12 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
            <UserPlus size={20} />
          </div>

          <p className="mt-3 text-sm font-semibold text-text-primary">
            No team members
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            Add members to start working on this project.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-visible rounded-xl border border-border">
          {/* Table header */}
          <div className="grid grid-cols-[minmax(280px,1.8fr)_1fr_1fr_80px] items-center border-b border-border bg-surface px-4 py-3 text-xs font-semibold text-text-secondary">
            <span>Member</span>
            <span>Role</span>
            <span>Joined On</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Members */}
          {team.map((membership) => {
            const member = membership.userId;

            if (!member) return null;

            const isCreator = String(member._id) === String(project?.createdBy);
            const isCurrentUser = String(member._id) === String(user?._id);

            return (
              <div
                key={membership._id}
                className="grid grid-cols-[minmax(280px,1.8fr)_1fr_1fr_80px] items-center border-b border-border px-4 py-4 last:border-b-0"
              >
                {/* Member */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light text-sm font-semibold text-primary">
                    <Avatar user={member}/>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {member.name}
                      </p>

                      {isCurrentUser && (
                        <span className="rounded-full bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary">
                          You
                        </span>
                      )}
                    </div>

                    <p className="truncate text-xs text-text-secondary">
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <span className="inline-flex rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                    {membership.role}
                  </span>
                </div>

                {/* Joined */}
                <div className="text-sm text-text-secondary">
                  {membership.joinedAt
                    ? new Date(
                        membership.joinedAt
                      ).toLocaleDateString()
                    : "—"}
                </div>

                {/* Actions */}
                <div className="relative flex justify-end">
                  {isCreator ? (
                    <span className="flex text-xs h-9 px-2  items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary">Creator</span>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={!isAdmin}
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === membership._id
                              ? null
                              : membership._id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed" 
                        aria-label={`Actions for ${member.name}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenuId === membership._id && (
                        <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg">
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveProjectMember(member._id)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger transition hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                            {isLoading ? (
                                <Loader color="text-warning"/>
                            ) : "Remove"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddProjectMemberModal
            isOpen={isAddMemberModalOpen}
            onClose={() => setIsAddMemberModalOpen(false)}
            project={project}
        />
    </section>
  );
}

export default ProjectTeam;