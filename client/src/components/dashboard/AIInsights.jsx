import {
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import useDashboardStore from "../../stores/dashboardStore";
import useWorkspaceStore from "../../stores/workspaceStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

const getInsightStyle = (severity) => {
  switch (severity) {
    case "error":
      return {
        icon: AlertCircle,
        iconClass: "text-danger",
        bgClass: "bg-danger-surface",
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
        bgClass: "bg-info-surface",
      };

    case "success":
    default:
      return {
        icon: CheckCircle2,
        iconClass: "text-green-500",
        bgClass: "bg-success-surface",
      };
  }
};

function AIInsights() {
  const navigate = useNavigate();
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
  const insightsError = useDashboardStore((state) => state.error);
  const insightsFetched = useDashboardStore((state) => state.insightsFetched);

  const [showAllInsights, setShowAllInsights] = useState(false);

  useEffect(() => {
    if(!currentWorkspaceId) return;
    if(insights.length === 0) {
       fetchInsights(currentWorkspaceId);
    }
      
  }, [currentWorkspaceId, fetchInsights, insights.length]);

  
const handleInsightClick = (insight) => {
  const action = insight.action;

  if (!action?.type) return;

  switch (action.type) {
    case "requirement": {
      const { projectId, requirementId } = action;

      if (!projectId || !requirementId) {
        navigate("/requirements");
        return;
      }

      navigate(
        `/projects/${projectId}/requirements/${requirementId}`
      );
      break;
    }

    case "requirements":
      navigate("/requirements");
      break;

    case "tasks": {
      const params = new URLSearchParams();

      if (action.filter) {
        params.set("filter", action.filter);
      }

      navigate(
        params.size ? `/tasks?${params.toString()}` : "/tasks"
      );
      break;
    }

    case "project":
      if (action.projectId) {
        navigate(`/projects/${action.projectId}`);
      } else {
        navigate("/projects");
      }
      break;

    default:
      // Don't navigate to an unverified destination.
      break;
  }
};


  return (
    <section className="rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex min-w-0 items-center justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles size={18} className="text-primary" />

          <h2 className="min-w-0 text-base font-semibold text-text-primary">
            AI Insights
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowAllInsights(true)}
          className="shrink-0 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          View all
        </button>
      </div>

      {/* Insights */}
      <div className="divide-y divide-border max-h-70 overflow-y-scroll scrollbar-thin scrollbar-thumb-surface">
        {isInsightsLoading || !insightsFetched ? (
          <div className="flex h-64 items-center justify-center">
            <Loader color="text-primary"/>
          </div>
        ) : insightsError ? (
          <EmptyState
            icon={AlertCircle}
            title="Insights are unavailable"
            description={insightsError}
            actionLabel="Try again"
            onAction={() => fetchInsights(currentWorkspaceId)}
            compact
          />
        ) : insights.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="Everything looks good" description="There are no important issues requiring your attention right now." tone="success" compact />
        ) : (
          insights.map((insight) => {
            const {
              icon: Icon,
              iconClass,
              bgClass,
            } = getInsightStyle(insight.severity);

            return (
              <button
                key={insight._id || `${insight.type}-${insight.title}`}
                type="button"
                onClick={() => handleInsightClick(insight)}
                className="flex w-full min-w-0 items-center gap-3 px-5 py-4 text-left transition hover:bg-surface sm:gap-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgClass}`}
                >
                  <Icon size={18} className={iconClass} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold text-text-primary">
                    {insight.title}
                  </p>

                  <p className="mt-0.5 line-clamp-2 break-words text-xs text-text-secondary">
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

        {showAllInsights && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowAllInsights(false)}
        >
          <div
            className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={18}
                    className="text-primary"
                  />

                  <h2 className="text-lg font-semibold text-text-primary">
                    AI Insights
                  </h2>
                </div>

                <p className="mt-1 text-sm text-text-secondary">
                  Important things happening across your workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllInsights(false)}
                className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            {/* Insights */}
            <div className="min-h-0 flex-1 overflow-y-auto">
                  {insightsError ? (
                    <EmptyState icon={AlertCircle} title="Insights are unavailable" description={insightsError} actionLabel="Try again" onAction={() => fetchInsights(currentWorkspaceId)} />
                  ) : insights.length === 0 ? (
                    <EmptyState icon={CheckCircle2} title="Everything looks good" description="There are no important issues requiring your attention right now." tone="success" />
                  ) : (
                    <div className="divide-y divide-border">
                      {insights.map((insight) => {
                        const {
                          icon: Icon,
                          iconClass,
                          bgClass,
                        } = getInsightStyle(insight.severity);

                        return (
                          <button
                            key={insight._id || `${insight.type}-${insight.title}`}
                            type="button"
                            onClick={() => {
                              setShowAllInsights(false);
                              handleInsightClick(insight);
                            }}
                            className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-surface"
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgClass}`}
                            >
                              <Icon
                                size={18}
                                className={iconClass}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-text-primary">
                                {insight.title}
                              </p>

                              <p className="mt-1 text-sm text-text-secondary">
                                {insight.description}
                              </p>
                            </div>

                            <ArrowRight
                              size={18}
                              className="shrink-0 text-text-secondary"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

    </section>
  );
}

export default AIInsights;
