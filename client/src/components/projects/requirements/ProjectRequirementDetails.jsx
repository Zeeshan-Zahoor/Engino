import { useEffect, useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import WorkflowNav from "./components/WorkflowNav";

import RequirementStep from "./components/RequirementStep";
import AnalysisStep from "./components/AnalysisStep";
import PlanStep from "./components/PlanStep";
import ReviewStep from "./components/ReviewStep";
// import Loader from "../../common/Loader";

import useWorkflowNavigation from "./hooks/useWorkflowNavigation";
import useWorkspaceStore from "../../../stores/workspaceStore";
import useRequirementStore from "../../../stores/requirementStore";

import {
  workflowSteps,
} from "./data/mockRequirement";
import TasksStep from "./components/TasksStep";


const ProjectRequirementDetails = () => {
  const navigate = useNavigate();
  const { projectId, requirementId } = useParams();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { 
    currentRequirement, 
    fetchRequirement,
    analyzeRequirement, 
    clarifyRequirement,
    generatePlan,
    generateAiTasks,
    approvePlan,
    isLoading, 
    error,
   } = useRequirementStore();

  const {
    currentStep,
    navigateToStep,
    completeStep,
    canAccessStep,
    getStepStatus,
    resetWorkflow,
  } = useWorkflowNavigation();

  const workflowInitiated = useRef(false);
  const [analysis, setAnalysis] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentStep]);

  useEffect(() => {
    workflowInitiated.current = false;
    resetWorkflow();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnalysis(null);
    setPlan(null);
    setTasks([]);
  }, [requirementId, resetWorkflow]);

  useEffect(() => {
    if (!currentWorkspaceId || !projectId || !requirementId) return;

    fetchRequirement(
      currentWorkspaceId,
      projectId,
      requirementId
    );
  }, [
    currentWorkspaceId,
    projectId,
    requirementId,
    fetchRequirement,
  ]);

  useEffect(() => {
    if (!currentRequirement) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnalysis(
      currentRequirement.aiAnalysis
        ? {
            status:
              currentRequirement.aiStatus === "Needs Clarification"
                ? "needs_clarification"
                : currentRequirement.aiStatus === "Clear"
                  ? "clear"
                  : "needs_clarification",
            confidence: currentRequirement.aiConfidence,
            summary: currentRequirement.aiAnalysis.summary,
            questions: currentRequirement.aiAnalysis.questions || [],
          }
        : null
    );

    setPlan(
      currentRequirement.aiPlan?.content || null
    );

    setTasks(
      currentRequirement.aiTasks || []
    );
  }, [currentRequirement]);
  

  useEffect(() => {
      if (
        !currentRequirement ||
        currentRequirement._id !== requirementId ||
        workflowInitiated.current
      ) return;

      workflowInitiated.current = true;

      if (currentRequirement.aiStatus === "Needs Clarification") {
        completeStep("requirement");
        navigateToStep("analysis");
      }

      if (currentRequirement.aiStatus === "Clear") {
        completeStep("requirement");
        navigateToStep("analysis");
      }

      if (currentRequirement.aiStatus === "Plan Generated") {
        completeStep("requirement");
        completeStep("analysis");
        completeStep("plan")
        navigateToStep("review");
      }

      if (currentRequirement.aiStatus === "Approved") {
        completeStep("requirement");
        completeStep("analysis");
        completeStep("plan");
        completeStep("review");
        navigateToStep("tasks");
      }

  }, [currentRequirement, requirementId, navigateToStep, completeStep]);

  const handleContinue = () => {
      const currentIndex = workflowSteps.findIndex(
        (step) => step.id === currentStep
      );

      const nextStep = workflowSteps[currentIndex + 1];

      if (!nextStep) {
        return;
      }

      completeStep(currentStep);

      navigateToStep(nextStep.id);
  }

  const handleStartAnalysis =  async () => {
    try {
      completeStep("requirement");
      navigateToStep("analysis");
      const response = await analyzeRequirement(
        currentWorkspaceId,
        projectId,
        requirementId
      );

      setAnalysis(response.analysis);

    } catch {
        // Store already contains the error.
    }
  }

  const handleRetryAnalysis = async () => {
  try {
    const response = await analyzeRequirement(
      currentWorkspaceId,
      projectId,
      requirementId
    );

    setAnalysis(response.analysis);
  } catch {
    // Store already contains the error.
  }
  }

  const handleGeneratePlan = async () => {
    try {
      const response = await generatePlan(
        currentWorkspaceId,
        projectId,
        requirementId
      );

      setPlan(response.plan.content);
    } catch {
      // store already contains the error.
    }
  }

  
  const handleApprovePlan = async (reviewedPlan) => {
    try {
      await approvePlan(
        currentWorkspaceId,
        projectId,
        requirementId,
        reviewedPlan,
      );
      
      setPlan(reviewedPlan);
      
    } catch {
      // store already handles the error state
    }
  }

  const handleGenerateTasks = async () => {
    try {
      const response = await generateAiTasks(
        currentWorkspaceId,
        projectId,
        requirementId,
      );

      setTasks(response.tasks || []);

    } catch {
      // store already handles error state
    }
  }


  const renderCurrentStep = () => {
    switch (currentStep) {
      case "requirement":
        return (
          <RequirementStep
            requirement={currentRequirement}
            onContinue={handleStartAnalysis}
          />
        );

      case "analysis":
        return (
          <AnalysisStep
            analysis={analysis}
            onClarify={async (answer) => {
              const response = await clarifyRequirement(
                  currentWorkspaceId, 
                  projectId,
                  requirementId,
                  answer,
                );

              setAnalysis(response.analysis);
              return response;
            }}
            onRetry={handleRetryAnalysis}
            loading={isLoading}
            error={error}
            onComplete={() => {
              completeStep("analysis");
              if (currentRequirement.aiStatus === "Clear") {
                handleGeneratePlan();
                return;
              }
              // Requirement has already progressed beyond analysis
              navigateToStep("plan");
            }}
          />
        );

      case "plan":
        return (
          <PlanStep
            plan={plan}
            loading={isLoading}
            error={error}
            onContinue={handleContinue}
            onRetry={handleGeneratePlan}
          />
        );

      case "review":
        return (
          <ReviewStep
            plan={plan}
            onContinue={handleContinue}
            onApprove={handleApprovePlan}
          />
        );

      case "tasks":
        return (
          <TasksStep
            tasks={tasks}
            loading={isLoading}
            error={error}
            onGenerate={handleGenerateTasks}
          />
        );

      default:
        return null;
    }
  };

  if (error && !currentRequirement) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-6 py-5 text-sm text-danger">
          {error}
        </div>
      </div>
    );
  }
  if (!currentRequirement) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-text-secondary transition hover:bg-surface hover:text-text-primary"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-medium text-text-secondary">
                {currentRequirement?.projectId?.name}
              </p>

              <h1 className="mt-0.5 truncate text-lg font-semibold text-text-primary">
                {currentRequirement?.name}
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs text-text-secondary">
              Requirement
            </span>

            <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
              {currentRequirement?.status}
            </span>
          </div>
        </div>
      </div>


      {/* Main Layout */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          
          {/* Workflow Navigation */}
          <div>
            <WorkflowNav
              steps={workflowSteps}
              currentStep={currentStep}
              getStepStatus={getStepStatus}
              canAccessStep={canAccessStep}
              onStepClick={navigateToStep}
            />
          </div>


          {/* Active Step */}
          <main className="flex-1">
            {renderCurrentStep()}
          </main>

        </div>
      </div>
    </div>
  );
};


export default ProjectRequirementDetails;
