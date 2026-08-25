import {
  ClipboardCheck,
  FileCheck2,
  ListChecks,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const stats = [
  {
    title: "Total Requirements",
    value: "12",
    description: "Across all projects",
    icon: ListChecks,
    iconClassName: "bg-purple-50 text-primary",
  },
  {
    title: "Ready to Generate",
    value: "5",
    description: "Generate engineering plan",
    icon: WandSparkles,
    iconClassName: "bg-green-50 text-success",
  },
  {
    title: "AI Clarification",
    value: "3",
    description: "Awaiting your input",
    icon: Sparkles,
    iconClassName: "bg-orange-50 text-warning",
  },
  {
    title: "Plans Generated",
    value: "6",
    description: "Ready for review",
    icon: ClipboardCheck,
    iconClassName: "bg-blue-50 text-info",
  },
  {
    title: "Approved",
    value: "8",
    description: "Converted to tasks",
    icon: FileCheck2,
    iconClassName: "bg-purple-50 text-primary",
  },
];

function RequirementStats() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-border bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconClassName}`}
              >
                <Icon size={19} strokeWidth={1.9} />
              </div>

              <div className="min-w-0">
                <p className="text-xl font-bold leading-none text-text-primary">
                  {stat.value}
                </p>

                <p className="mt-2 text-[11px] font-semibold text-text-primary">
                  {stat.title}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-text-secondary">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default RequirementStats;