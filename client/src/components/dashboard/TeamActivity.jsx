import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDot,
  UserPlus,
} from "lucide-react";

const activities = [
  {
    type: "user",
    icon: CheckCircle2,
    iconClass: "bg-green-50 text-success",
    name: "Zeeshan",
    action: "completed",
    target: "Attendance API Integration",
    time: "2 minutes ago",
  },
  {
    type: "user",
    icon: UserPlus,
    iconClass: "bg-purple-50 text-primary",
    name: "Ganga",
    action: "claimed",
    target: "Student Login UI",
    time: "18 minutes ago",
  },
  {
    type: "user",
    icon: CheckCircle2,
    iconClass: "bg-blue-50 text-info",
    name: "Admin",
    action: "approved",
    target: "Student Portal",
    time: "1 hour ago",
  },
  {
    type: "user",
    icon: CircleDot,
    iconClass: "bg-orange-50 text-warning",
    name: "Arjun",
    action: "updated",
    target: "Notification API",
    time: "2 hours ago",
  },
  {
    type: "ai",
    icon: Bot,
    iconClass: "bg-primary-light text-primary",
    name: "AI",
    action: "generated a plan for",
    target: "Payment Gateway",
    time: "3 hours ago",
  },
];

function TeamActivity() {
  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Team Activity
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Recent activity across your workspace
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-dark"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Activity list */}
      <div className="px-5 py-2">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={`${activity.name}-${activity.target}`}
              className="flex gap-3 py-3.5"
            >
              {/* Timeline */}
              <div className="relative">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${activity.iconClass}`}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </div>

                {index !== activities.length - 1 && (
                  <div className="absolute left-1/2 top-8 h-7 w-px -translate-x-1/2 bg-border" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-5 text-text-secondary">
                  <span className="font-semibold text-text-primary">
                    {activity.name}
                  </span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium text-text-primary">
                    {activity.target}
                  </span>
                </p>

                <p className="mt-0.5 text-[10px] text-text-secondary">
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

export default TeamActivity;