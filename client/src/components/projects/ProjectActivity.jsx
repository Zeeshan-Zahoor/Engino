import {
  Bot,
  CheckCircle2,
  FilePlus2,
  Pencil,
  UserPlus,
} from "lucide-react";
import { activities } from "../../data/activities";

const activityConfig = {
  update: {
    icon: Pencil,
    iconClass: "bg-info-surface text-info",
  },

  task: {
    icon: CheckCircle2,
    iconClass: "bg-success-surface text-success",
  },

  requirement: {
    icon: FilePlus2,
    iconClass: "bg-primary-light text-primary",
  },

  member: {
    icon: UserPlus,
    iconClass: "bg-warning-surface text-warning",
  },

  ai: {
    icon: Bot,
    iconClass: "bg-primary-light text-primary",
  },
};

function ProjectActivity({ projectId }) {
  const projectActivities = activities.filter(activity => activity.projectId === projectId);
  return (
    <section className="rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-text-primary">
          Activity
        </h2>

        <button
          type="button"
          className="text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
        </button>
      </div>

      {/* Activity */}
      <div className="px-5">
        {projectActivities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="relative flex gap-3 py-4"
            >
              {/* Timeline */}
              <div className="relative shrink-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${config.iconClass}`}
                >
                  <Icon size={14} strokeWidth={1.8} />
                </div>

                {index !== projectActivities.length - 1 && (
                  <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-border" />
                )}
              </div>

              {/* Content */}
              {/* <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-4 text-text-primary">
                  {activity.target}
                </p>

                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-text-secondary">
                    {activity.user.name}
                  </p>

                  <span className="shrink-0 text-xs text-text-secondary">
                    {activity.time}
                  </span>
                </div>
              </div> */}
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-5 text-text-secondary">
                  <span className="font-semibold text-text-primary">
                    {activity.user.name}
                  </span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium text-text-primary">
                    {activity.target}
                  </span>
                </p>

                <p className="mt-0.5 text-xs text-text-secondary">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProjectActivity;
