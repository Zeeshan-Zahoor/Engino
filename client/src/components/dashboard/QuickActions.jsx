import {
  ArrowRight,
  FolderPlus,
  ListPlus,
  Sparkles,
  Users,
} from "lucide-react";
import CreateProjectModal from "../projects/CreateProjectModal";
import { useState } from "react";

const actions = [
  {
    title: "Create Project",
    description: "Start a new project",
    icon: FolderPlus,
    iconClass: "bg-purple-50 text-primary",
  },
  {
    title: "Generate AI Plan",
    description: "Turn a requirement into a plan",
    icon: Sparkles,
    iconClass: "bg-orange-50 text-warning",
  },
  {
    title: "Create Task",
    description: "Add engineering work",
    icon: ListPlus,
    iconClass: "bg-blue-50 text-info",
  },
  {
    title: "Manage Team",
    description: "Manage workspace members",
    icon: Users,
    iconClass: "bg-green-50 text-success",
  },
];

function QuickActions() {

  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="px-5 py-4">
        <h2 className="text-base font-semibold text-text-primary">
          Quick Actions
        </h2>

        <p className="mt-1 text-xs text-text-secondary">
          Common actions to manage your workspace
        </p>
      </div>

      {/* Actions */}
      <div className="grid border-t border-border grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => {
                if(action.title === "Create Project") {
                  setOpenCreateProjectModal(true);
                }
              }}
              className={`group flex items-center gap-3 border-r border-border p-4 text-left transition-colors hover:bg-surface ${
                index % 2 === 0 ? "sm:border-r" : ""
              } border-border`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.iconClass}`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-primary">
                  {action.title}
                </p>

                <p className="mt-0.5 text-xs text-text-secondary">
                  {action.description}
                </p>
              </div>

              <ArrowRight
                size={15}
                className="shrink-0 text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </button>
          );
        })}
      </div>

      <CreateProjectModal 
        isOpen={openCreateProjectModal}
        onClose={() => setOpenCreateProjectModal(false)}
      />
    </section>
  );
}

export default QuickActions;
