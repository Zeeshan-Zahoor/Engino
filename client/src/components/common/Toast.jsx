import { useEffect } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import useToastStore from "../../stores/toastStore";

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconWrapper: "bg-green-50 text-success",
    progress: "bg-success",
  },
  error: {
    icon: CircleAlert,
    iconWrapper: "bg-red-50 text-danger",
    progress: "bg-danger",
  },
  warning: {
    icon: TriangleAlert,
    iconWrapper: "bg-orange-50 text-warning",
    progress: "bg-warning",
  },
  info: {
    icon: Info,
    iconWrapper: "bg-blue-50 text-info",
    progress: "bg-info",
  },
};

function Toast() {
  const toast = useToastStore((state) => state.toast);
  const hideToast = useToastStore((state) => state.hideToast);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed right-6 top-6 z-[100] w-[360px] overflow-hidden rounded-xl border border-border bg-white shadow-xl">
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Icon */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconWrapper}`}
        >
          <Icon size={19} strokeWidth={2.2} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-text-primary">
            {toast.type === "success" && "Success"}
            {toast.type === "error" && "Something went wrong"}
            {toast.type === "warning" && "Attention"}
            {toast.type === "info" && "Information"}
          </p>

          <p className="mt-0.5 text-sm leading-5 text-text-secondary">
            {toast.message}
          </p>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={hideToast}
          className="rounded-md p-1 text-text-secondary transition hover:bg-surface hover:text-text-primary"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      {/* Auto-dismiss progress */}
      <div className="h-0.5 w-full bg-surface">
        <div
          className={`h-full ${config.progress} animate-[toast-progress_4s_linear_forwards]`}
        />
      </div>
    </div>
  );
}

export default Toast;