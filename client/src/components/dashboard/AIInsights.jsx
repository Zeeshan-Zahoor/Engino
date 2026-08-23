import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Sparkles,
} from "lucide-react";

const insights = [
  {
    icon: CircleAlert,
    iconClass: "bg-purple-50 text-primary",
    title: "2 requirements need clarification",
    description: "Attendance Module, LMS Platform",
  },
  {
    icon: CheckCircle2,
    iconClass: "bg-green-50 text-success",
    title: "Student Portal estimated",
    description: "28 hours · Medium Complexity",
  },
  {
    icon: AlertCircle,
    iconClass: "bg-red-50 text-danger",
    title: "3 tasks are blocked",
    description: "Waiting for dependencies",
  },
  {
    icon: CheckCircle2,
    iconClass: "bg-green-50 text-success",
    title: "You have 5 tasks due this week",
    description: "Stay on track!",
  },
];

function AIInsights() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />

          <h2 className="text-sm font-semibold text-text-primary">
            AI Insights
          </h2>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-primary hover:text-primary-dark"
        >
          View all
        </button>
      </div>

      {/* Insights */}
      <div className="divide-y divide-border">
        {insights.map((insight) => {
          const Icon = insight.icon;

          return (
            <button
              key={insight.title}
              type="button"
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-surface"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${insight.iconClass}`}
              >
                <Icon size={17} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-primary">
                  {insight.title}
                </p>

                <p className="mt-0.5 text-[11px] text-text-secondary">
                  {insight.description}
                </p>
              </div>

              <ArrowRight
                size={15}
                className="shrink-0 text-text-secondary"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default AIInsights;