import { Inbox } from "lucide-react";

function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
  tone = "default",
}) {
  const IconComponent = Icon;

  return (
    <div className={`flex flex-col items-center justify-center px-6 text-center ${compact ? "py-8" : "py-14"}`}>
      <div className={`mb-3 flex items-center justify-center rounded-full ${compact ? "h-10 w-10" : "h-12 w-12"} ${tone === "success" ? "bg-success-surface text-success" : "bg-surface text-text-secondary"}`}>
        <IconComponent size={compact ? 19 : 22} strokeWidth={1.8} />
      </div>
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
