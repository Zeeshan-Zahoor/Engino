import {
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import useDashboardStore from "../../stores/dashboardStore";
import useWorkspaceStore from "../../stores/workspaceStore";
import { useEffect } from "react";
import Loader from "../common/Loader";

const getInsightStyle = (severity) => {
  switch (severity) {
    case "error":
      return {
        icon: AlertCircle,
        iconClass: "text-red-500",
        bgClass: "bg-red-50",
      };

    case "warning":
      return {
        icon: AlertCircle,
        iconClass: "text-primary",
        bgClass: "bg-primary-light",
      };

    case "info":
      return {
        icon: Info,
        iconClass: "text-blue-500",
        bgClass: "bg-blue-50",
      };

    case "success":
    default:
      return {
        icon: CheckCircle2,
        iconClass: "text-green-500",
        bgClass: "bg-green-50",
      };
  }
};

function AIInsights() {
  const { currentWorkspaceId } = useWorkspaceStore();

  const fetchInsights = useDashboardStore(
    (state) => state.fetchInsights
  );

  const insights = useDashboardStore(
    (state) => state.insights
  );

  const isInsightsLoading = useDashboardStore(
    (state) => state.isLoading
  ); 

  useEffect(() => {
    if(!currentWorkspaceId) return;

    fetchInsights(currentWorkspaceId);
  }, [currentWorkspaceId, fetchInsights]);
  return (
    <section className="rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />

          <h2 className="text-base font-semibold text-text-primary">
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
      <div className="divide-y divide-border max-h-70 overflow-y-scroll scrollbar-thin scrollbar-thumb-surface">
        {isInsightsLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader color="text-primary"/>
          </div>
        ) : insights.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="text-green-500" size={22} />
            </div>

            <p className="text-sm font-semibold text-text-primary">
              Everything looks good
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              There are no important issues requiring your attention right now.
            </p>
          </div>
        ) : (
          insights.map((insight) => {
            const {
              icon: Icon,
              iconClass,
              bgClass,
            } = getInsightStyle(insight.severity);

            return (
              <button
                key={insight.type}
                type="button"
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-surface"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgClass}`}
                >
                  <Icon size={18} className={iconClass} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {insight.title}
                  </p>

                  <p className="mt-0.5 truncate text-sm text-text-secondary">
                    {insight.description}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-text-secondary"
                />
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

export default AIInsights;
