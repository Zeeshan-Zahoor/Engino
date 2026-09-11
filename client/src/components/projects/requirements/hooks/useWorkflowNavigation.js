import { useState } from "react";

const initialWorkflow = {
  current: "requirement",
  visited: ["requirement"],
  completed: [],
};

const useWorkflowNavigation = () => {
  const [workflow, setWorkflow] = useState(initialWorkflow);

  const navigateToStep = (stepId) => {
    setWorkflow((prev) => ({
      ...prev,
      current: stepId,
      visited: prev.visited.includes(stepId)
        ? prev.visited
        : [...prev.visited, stepId],
    }));
  };

  const completeStep = (stepId) => {
    setWorkflow((prev) => {
      if (prev.completed.includes(stepId)) {
        return prev;
      }

      return {
        ...prev,
        completed: [...prev.completed, stepId],
      };
    });
  };

  const completeCurrentStep = () => {
    completeStep(workflow.current);
  };

  const canAccessStep = (stepId) => {
    return (
      workflow.current === stepId ||
      workflow.visited.includes(stepId) ||
      workflow.completed.includes(stepId)
    );
  };

  const getStepStatus = (stepId) => {
    if (workflow.current === stepId) {
      return "current";
    }

    if (workflow.completed.includes(stepId)) {
      return "completed";
    }

    if (workflow.visited.includes(stepId)) {
      return "visited";
    }

    return "locked";
  };

  const resetWorkflow = () => {
    setWorkflow(initialWorkflow);
  };

  return {
    currentStep: workflow.current,
    visitedSteps: workflow.visited,
    completedSteps: workflow.completed,

    navigateToStep,
    completeStep,
    completeCurrentStep,

    canAccessStep,
    getStepStatus,

    resetWorkflow,
  };
};

export default useWorkflowNavigation;