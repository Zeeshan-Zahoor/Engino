import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function StatsCard({
  icon: Icon,
  iconClassName,
  title,
  value,
  description,
  trend,
  trendType = "positive",
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex items-center gap-2 rounded-2xl border border-border bg-card p-3 text-left ${
        onClick
          ? "cursor-pointer transition hover:border-primary/40 hover:shadow-sm"
          : "cursor-default"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-15 w-15 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={30} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-3 flex flex-1 justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight text-text-primary">
            {value ?? 0}
          </p>

          <p className="mt-0.5 text-xs font-medium text-text-secondary">
            {title}
          </p>

          {description && (
            <p className="mt-1 text-xs text-text-secondary">
              {description}
            </p>
          )}
        </div>

        {trend && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium ${
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
    </button>
  );
}

export default StatsCard;