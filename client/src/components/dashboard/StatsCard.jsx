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
      className={`flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-card p-3 text-left ${
        onClick
          ? "cursor-pointer transition hover:border-primary/40 hover:shadow-sm"
          : "cursor-default"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 lg:h-15 lg:w-15 ${iconClassName}`}
        >
          <Icon size={24} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-0 min-w-0 flex-1 justify-between sm:mt-3 sm:flex">
        <div className="min-w-0">
          <p className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {value ?? 0}
          </p>

          <p className="mt-0.5 break-words text-xs font-medium text-text-secondary">
            {title}
          </p>

          {description && (
            <p className="mt-1 break-words text-xs text-text-secondary">
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
