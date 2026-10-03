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

  const [showAllInsights, setShowAllInsights] = useState(false);

  useEffect(() => {
    if(!currentWorkspaceId) return;
    if(insights.length === 0) {
       fetchInsights(currentWorkspaceId);
    }
      
  }, [currentWorkspaceId, fetchInsights, insights.length]);

  const handleInsightClick = (insight) => {
    switch (insight.action?.type) {
      case "requirement":
        navigate(`/projects/${insight.action.projectId}/requirements/${insight.action.requirementId}`);
        break;
      
      case "requirements":
        navigate("/requirements");
        break;
      
      case "tasks":
        navigate(`/tasks?filter=${insight.action.filter}`);
        break;

      default:
        break;
    }
  }

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
          onClick={() => setShowAllInsights(true)}
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
                onClick={() => handleInsightClick(insight)}
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

        {showAllInsights && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowAllInsights(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
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
            <div className="max-h-[65vh] overflow-y-auto">
                  {insights.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle2
                          size={22}
                          className="text-green-500"
                        />
                      </div>

                      <p className="text-sm font-semibold text-text-primary">
                        Everything looks good
                      </p>

                      <p className="mt-1 max-w-sm text-sm text-text-secondary">
                        There are no important issues requiring your attention right now.
                      </p>
                    </div>
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
                            key={insight.type}
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
