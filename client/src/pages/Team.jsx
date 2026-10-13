import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  CheckCircle2,
  Clock3,
  FolderKanban,
} from "lucide-react";

import Header from "../components/layout/Header";
import Avatar from "../utils/Avatar";
import TeamMemberDetailsPanel from "../components/team/TeamMemberDetailsPanel";
import EmptyState from "../components/common/EmptyState";

import { isWorkspaceAdmin } from "../utils/isWorkspaceAdmin"

import useWorkspaceStore from "../stores/workspaceStore";
import useTaskStore from "../stores/taskStore";
import useAuthStore from "../stores/authStore";
import useProjectStore from "../stores/projectStore";

function Team() {
  const {
    currentWorkspaceId,
    workspaceMembers,
    getWorkspaceMembers,
    isLoading: membersLoading,
    error: membersError,
    membersFetched,
  } = useWorkspaceStore();

  const {
    projects,
    fetchProjects
  } = useProjectStore();

  const { user } = useAuthStore();
 
  const {
    allTasks,
    fetchAllTasks,
  } = useTaskStore();

  const isAdmin = isWorkspaceAdmin();

  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);



  useEffect(() => {
    if (!currentWorkspaceId) return;

    getWorkspaceMembers();
    fetchAllTasks(currentWorkspaceId);
  }, [
    currentWorkspaceId,
    getWorkspaceMembers,
    fetchAllTasks,
  ]);

  useEffect(() => {
    if(!currentWorkspaceId) return;
    if(projects.length === 0) {
      fetchProjects(currentWorkspaceId);
    }
  }, [currentWorkspaceId, fetchProjects, projects.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const members = workspaceMembers || [];
  const tasks = allTasks || [];

  const filteredMembers = useMemo(() => {
    const query = searchInput.trim().toLowerCase();

    return members.filter((membership) => {
      const user = membership.userId;

      const matchesSearch =
        !query ||
        user?.name?.toLowerCase().includes(query) ||
        user?.email?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" ||
        membership.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, searchInput, roleFilter]);

  const getMemberTasks = (userId) => {
    return tasks.filter(
      (task) => task.assignee?._id === userId
    );
  };

  return (
    <div className="space-y-6 px-8">
      <Header 
        title={"Team"}
        description={"Manage your workspace members and view their workload."}
        showBack={true}
        user={user}
      />
        
        {/* Stats */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  Total Members
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">
                  {members.length}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  Active Members
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">
                  {
                    members.filter((member) =>
                      getMemberTasks(member.userId?._id).some(
                        (task) => task.status !== "Done"
                      )
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-lg bg-success/10 p-2.5 text-success">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  Active Tasks
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">
                  {
                    tasks.filter(
                      (task) => task.status !== "Done"
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-lg bg-warning/10 p-2.5 text-warning">
                <Clock3 size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  Projects
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">
                  {projects?.length}
                </p>
              </div>

              <div className="rounded-lg bg-info/10 p-2.5 text-info">
                <FolderKanban size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Members */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Workspace Members
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                View and manage everyone in this workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search members..."
                  className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-64"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-text-primary outline-none focus:border-primary"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-border bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary md:grid">
            <span>Member</span>
            <span>Role</span>
            <span>Tasks</span>
            <span>Active Tasks</span>
          </div>

          {/* Members */}
          <div className="divide-y divide-border">
            {membersLoading || !membersFetched ? (
              <div className="flex h-40 items-center justify-center text-sm text-text-secondary">Loading members...</div>
            ) : membersError ? (
              <EmptyState icon={Users} title="Members are unavailable" description={membersError} compact />
            ) : filteredMembers.length === 0 ? (
              <EmptyState
                icon={Users}
                title={members.length > 0 ? "No matching members" : "No members yet"}
                description={members.length > 0 ? "Try changing your search or role filter." : "Workspace members will appear here once they are added."}
                actionLabel={members.length > 0 ? "Clear filters" : undefined}
                onAction={members.length > 0 ? () => { setSearchInput(""); setRoleFilter("All"); } : undefined}
                compact
              />
            ) : (
              filteredMembers.map((membership) => {
                const user = membership.userId;
                const memberTasks = getMemberTasks(user?._id);
                const activeTasks = memberTasks.filter(
                  (task) => task.status !== "Done"
                );

                return (
                  <div
                    key={user?._id}
                    onClick={() => setSelectedMember(membership)}
                    className="grid grid-cols-1 gap-4 px-5 py-4 transition hover:bg-surface md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center"
                  >
                    {/* Member */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                        <Avatar user={user}/>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {user?.name || "Unknown User"}
                        </p>

                        <p className="truncate text-xs text-text-secondary">
                          {isAdmin ? (
                            user?.email || "—"
                          ) : (
                            user?.email
                              ? user.email.slice(0, 2) + "**********@gmail.com"
                              : "—"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {membership.role || "Member"}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div className="text-sm text-text-primary">
                      {memberTasks.length}
                    </div>

                    {/* Active */}
                    <div className="text-sm text-text-primary">
                      {activeTasks.length}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
          {selectedMember && (
              <TeamMemberDetailsPanel
                member={selectedMember}
                tasks={getMemberTasks(selectedMember.userId?._id)}
                isAdmin={isAdmin}
                currentUserId={user?._id}
                onClose={() => setSelectedMember(null)}
              />
           )}
    </div>
  );
}

export default Team;
