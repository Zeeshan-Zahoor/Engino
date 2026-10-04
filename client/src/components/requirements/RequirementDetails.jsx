import {
  Rocket,
  X,
} from "lucide-react";
import { getInitials } from '../../utils/getInitials';
import useProjectStore from "../../stores/projectStore";
import { useEffect, useState } from "react";
import useWorkspaceStore from "../../stores/workspaceStore";
import useRequirementStore from "../../stores/requirementStore";
import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";
import Loader from "../../components/common/Loader";
import OverviewContent from "./OverviewContent";
import PlanContent from "./PlanContent";
import TasksContent from "./TasksContent";
import ConversationContent from "./ConversationContent";
import { useNavigate } from "react-router-dom";


function RequirementDetails({ requirement, setSelectedRequirement, isLoading }) {
  const { projects, fetchProjects } = useProjectStore();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { fetchAIConversation } = useRequirementStore();
  const isAdmin = isWorkspaceAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Overview");
  const [conversation, setConversation] = useState(null);
  const [conversationLoading, setConversationLoading] = useState(false);

  
  useEffect(() => {
    if (
        activeTab !== "AI Conversation" ||
        !requirement?._id ||
        !currentWorkspaceId ||
        conversation
    ) {
        return;
    }

    const loadConversation = async () => {
        try {
            setConversationLoading(true);
            const projectId =
              typeof requirement.projectId === "object"
                  ? requirement.projectId?._id
                  : requirement.projectId;

            const response = await fetchAIConversation(
                currentWorkspaceId,
                projectId,
                requirement._id
            );

            setConversation(response?.conversation || null);
        } catch {
            setConversation(null);
        } finally {
            setConversationLoading(false);
        }
    };

    loadConversation();
}, [
    activeTab,
    requirement?._id,
    requirement?.projectId,
    currentWorkspaceId,
    fetchAIConversation,
    conversation
]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab("Overview");
  }, [requirement?._id]);


  useEffect(() => {
    if(!currentWorkspaceId) return;
    if(projects.length === 0) {
      fetchProjects(currentWorkspaceId);
    }
  }, [currentWorkspaceId, fetchProjects, projects.length]);

  const handleNextAction = () => {
    if (!requirement?.projectId._id || !requirement?._id) return;

    navigate(`/projects/${requirement?.projectId._id}/requirements/${requirement._id}`);
  };

  if(!requirement) return null;

  if(isLoading) {
    return <div className="w-full h-full flex justify-center  items-center">
          <Loader color="text-primary" size={30}/>
        </div>
  }

  const nextActionConfig = {
      Pending: {
        title: "Start AI Analysis",
        description:
          "Analyze this requirement to identify ambiguity and determine whether it is ready for planning.",
        button: "Start AI Analysis",
      },

      "Needs Clarification": {
        title: "Answer Clarification",
        description:
          "AI needs additional information before this requirement can move to planning.",
        button: "Answer Clarification",
      },

      Clear: {
        title: "Generate Engineering Plan",
        description:
          "The requirement is clear and ready to be converted into an engineering plan.",
        button: "Generate Plan",
      },

      "Plan Generated": {
        title: "Review AI Plan",
        description:
          "The engineering plan has been generated and is ready for review.",
        button: "Review Plan",
      },

      "AI Plan Ready": {
        title: "Review AI Plan",
        description:
          "The AI-generated engineering plan is ready for your review.",
        button: "Review Plan",
      },

      Approved: {
        title: "Manage Generated Tasks",
        description:
          "The AI plan has been approved. Review and manage the generated engineering tasks.",
        button: "View Tasks",
      },
    };

    const nextAction =
      nextActionConfig[requirement?.aiStatus] || nextActionConfig.Pending;
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white transition-all">
   
      {/* Requirement Header */}
      <div className="border-b border-border px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <span className="text-sm font-semibold">{getInitials(requirement.name)}</span>
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold leading-5 text-text-primary">
                {requirement.name}
              </h2>

              <p className="mt-1 text-xs text-text-secondary">
                · {projects.find(project => project._id === requirement.projectId._id)?.name}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-2">
            <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-success">
              {requirement.aiStatus}
            </span>

            <button
              type="button"
              onClick={() => setSelectedRequirement(null)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-text-secondary transition hover:bg-surface hover:text-text-primary"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex overflow-x-auto">
          {[
            "Overview",
            "AI Conversation",
            "Plan",
            "Tasks",
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative shrink-0 px-2 pb-3 text-xs font-medium ${
                activeTab === tab
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "Overview" && (
        <OverviewContent 
          requirement={requirement}
          projects={projects}
        />
      )}
      
      {activeTab === "AI Conversation" && (
        <ConversationContent 
          conversation={conversation}
          conversationLoading={conversationLoading}
        />
      )}

      {activeTab === "Plan" && (
        <PlanContent requirement={requirement}/>
      )}

      {activeTab === "Tasks" && (
        <TasksContent requirement={requirement}/>
      )}

      {/* Next Action */}
      {isAdmin && (
        <div className="border-t border-border px-4 py-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Next Action
            </h3>

            <div className="mt-3 rounded-xl border border-border bg-surface p-4">
              <h4 className="text-sm font-semibold text-text-primary">
                {nextAction.title}
              </h4>

              <p className="mt-1.5 text-sm leading-5 text-text-secondary">
                {nextAction.description}
              </p>

              <button
                type="button"
                onClick={handleNextAction}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                <Rocket size={15} />
                {nextAction.button}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}







export default RequirementDetails;
