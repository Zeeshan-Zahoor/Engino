import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  ChevronDown,
  MoreHorizontal,
  FileText,
  CircleAlert,
  CircleCheck,
  ListChecks,
  ClipboardCheck,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useWorkspaceStore from "../../stores/workspaceStore";
import useRequirementStore from "../../stores/requirementStore";
import CreateRequirementModal from "./requirements/CreateRequirementModal";

import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";

function Requirements({ project }) {
    const navigate = useNavigate();
    const { currentWorkspaceId } = useWorkspaceStore();
    const {
        requirements: storedRequirements,
        requirementsProjectId,
        fetchRequirements,
    } = useRequirementStore();

    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const [openCreateModal, setOpenCreateModal] = useState(false);

    const requirements = String(requirementsProjectId) === String(project?._id)
        ? storedRequirements
        : [];

    useEffect(() => {
        if (currentWorkspaceId && project?._id) {
            fetchRequirements(currentWorkspaceId, project?._id);
        }
    }, [fetchRequirements, currentWorkspaceId, project?._id]);

    useEffect(() => {
        if (!openMenuId) return;
        const close = () => setOpenMenuId(null);
        window.addEventListener("scroll", close, true);
        window.addEventListener("resize", close);
        return () => {
            window.removeEventListener("scroll", close, true);
            window.removeEventListener("resize", close);
        };
    }, [openMenuId]);
    const isAdmin = isWorkspaceAdmin();

    const projectMembers = project?.team || [];

    const totalRequirements = requirements.length || 0;
    const clarificationNeeded = requirements.filter(req => req.aiStatus === "Needs Clarification");
    const readyRequirements = requirements.filter(req => req.aiStatus === "Clear");
    const approvedRequirements = requirements.filter(req => req.aiStatus === "Approved");
    const generatedPlans = requirements.filter(req => req.aiStatus === "Plan Generated");

    const handleMenuToggle = (e, requirementId) => {
        if(openMenuId === requirementId) {
            setOpenMenuId(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + 8,
            left: rect.right - 220,
        })

        setOpenMenuId(requirementId)
    };

    const getStatusClass = (status) => {
        switch (status) {
        case "Needs Clarification":
            return "bg-warning/10 text-warning";

        case "Clear":
            return "bg-info/10 text-info";

        case "Approved":
            return "bg-success/10 text-success";

        case "Plan Generated":
            return "bg-primary-light text-primary";

        case "Pending":
            return "bg-primary-light text-primary";

        default:
            return "bg-surface text-text-secondary";
        }
    };

  return (
    <div className="rounded-2xl border border-border bg-background p-5">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            AI Requirements ({totalRequirements})
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Turn project requirements into clear, executable engineering work
            with Engino AI.
          </p>
        </div>

        {isAdmin && (
          <button
          type="button"
          onClick={() => setOpenCreateModal(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark"
        >
          <Plus size={18} />
          New Requirement
        </button>
        )}
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

        {/* Total */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
            <FileText size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-text-primary">
              {totalRequirements}
            </p>

            <p className="text-xs text-text-secondary">
              Total Requirements
            </p>
          </div>
        </div>

        {/* Needs Clarification */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/10 text-warning">
            <CircleAlert size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-text-primary">
              {clarificationNeeded.length}
            </p>

            <p className="text-xs text-text-secondary">
              Needs Clarification
            </p>
          </div>
        </div>

        {/* Ready */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-info/10 text-info">
            <CircleCheck size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-text-primary">
              {readyRequirements.length}
            </p>

            <p className="text-xs text-text-secondary">
              Ready for Planning
            </p>
          </div>
        </div>

        {/* Plan Approved */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success">
            <ClipboardCheck size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-text-primary">
              {approvedRequirements.length}
            </p>

            <p className="text-xs text-text-secondary">
              Plan Approved
            </p>
          </div>
        </div>

        {/* Plans Generated */}
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
            <ListChecks size={18} />
          </div>

          <div>
            <p className="text-lg font-semibold text-text-primary">
              {generatedPlans.length}
            </p>

            <p className="text-xs text-text-secondary">
              Plans Generated
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            type="text"
            placeholder="Search requirements..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-text-primary outline-none placeholder:text-text-secondary transition focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm text-text-primary transition hover:bg-surface"
          >
            Status
            <ChevronDown size={15} className="text-text-secondary" />
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm text-text-primary transition hover:bg-surface"
          >
            Sort
            <ChevronDown size={15} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Requirements Table */}
      <div className="relative mt-5 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[850px] text-left">

          {/* Table Header */}
          <thead>
            <tr className="border-b border-border bg-surface/60">

              <th className="px-4 py-3 text-xs font-medium text-text-secondary">
                No.
              </th>

              <th className="px-3 py-3 text-xs font-medium text-text-secondary">
                Requirement
              </th>

              <th className="px-3 py-3 text-xs font-medium text-text-secondary">
                AI Status
              </th>

              <th className="px-3 py-3 text-xs font-medium text-text-secondary">
                Tasks
              </th>

              <th className="px-3 py-3 text-xs font-medium text-text-secondary">
                Last Updated
              </th>

              <th className="w-16 px-4 py-3 text-right text-xs font-medium text-text-secondary">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {requirements.map((requirement, index) => {
              return (
                <tr
                  key={requirement._id}
                  onClick={() => 
                    navigate(`/projects/${project._id}/requirements/${requirement._id}`)
                  }
                  className="border-b border-border last:border-b-0 transition hover:bg-surface"
                >

                  {/* ID */}
                  <td className="px-4 py-4 text-xs font-medium text-text-secondary">
                    {index + 1}
                  </td>

                  {/* Requirement */}
                  <td className="max-w-[390px] px-3 py-4">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {requirement.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-text-secondary">
                      {requirement.description}
                    </p>
                  </td>

                  {/* AI Status */}
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        requirement.aiStatus
                      )}`}
                    >
                      {requirement.aiStatus}
                    </span>
                  </td>

                  {/* Tasks */}
                  <td className="px-3 py-4">
                      <span className="text-sm text-text-secondary">
                        {requirement?.tasks?.length}
                      </span>
                  </td>

                  {/* Updated */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">
                    {requirement.updatedAt ? new Date(requirement.updatedAt).toLocaleDateString() : ""}
                  </td>

                  {/* Actions */}
                  <td className="relative px-4 py-4 text-right">

                    <button
                      type="button"
                      onClick={(e) =>
                        handleMenuToggle(e, requirement._id)
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition hover:bg-surface hover:text-text-primary"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openMenuId === requirement._id && (
                      createPortal(
                          <div 
                              className="absolute right-4 top-12 z-30 w-55 rounded-lg border border-border bg-background p-1.5 text-left shadow-lg"
                              style={{ top: menuPosition.top, left: menuPosition.left }}
                          >

                          <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary transition hover:bg-surface"
                          >
                              <Eye size={15} />
                              Open Requirement
                          </button>

                          <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary transition hover:bg-surface"
                          >
                              <Pencil size={15} />
                              Edit Requirement
                          </button>

                          <div className="my-1 border-t border-border" />

                          <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger transition hover:bg-danger/5"
                          >
                              <Trash2 size={15} />
                              Delete Requirement
                          </button>
                          </div>,

                          document.body
                      )
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>


      <CreateRequirementModal 
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        workspaceId={currentWorkspaceId}
        projectId={project?._id}
        projectMembers={projectMembers}
      />
    </div>
  );
}

export default Requirements;
