import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function StatsCard({
  icon: Icon,
  iconClassName,
  title,
  value,
  description,
  trend,
  trendType = "positive",
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-3 flex items-center gap-2">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-15 w-15 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={30} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-3 flex justify-between flex-1">
        <div>
            <p className="text-2xl font-bold tracking-tight text-text-primary">
            {value}
            </p>

            <p className="mt-0.5 text-xs font-medium text-text-secondary">
            {title}
            </p>

            {description && (
            <p className="mt-1 text-[11px] text-text-secondary">
                {description}
            </p>
            )}
        </div>

        <div>
            {trend && (
            <div
                className={`flex items-center gap-0.5 text-[11px] font-medium ${
                trendType === "negative"
                    ? "text-danger"
                    : "text-success"
                }`}
            >
                {trendType === "negative" ? (
                <ArrowDownRight size={13} />
                ) : (
                <ArrowUpRight size={13} />
                )}

                {trend}
            </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;