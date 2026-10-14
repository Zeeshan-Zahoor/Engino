import { Sparkles } from "lucide-react";

const StepHeader = ({
  eyebrow,
  title,
  description,
  badge,
}) => {
  return (
    <div className="mb-6 w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles size={13} />
          {eyebrow || "Engino AI"}
        </div>

        {badge && (
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            {badge}
          </span>
        )}
      </div>

      <h1 className="break-words text-2xl font-semibold tracking-tight text-text-primary">
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
};

export default StepHeader;
