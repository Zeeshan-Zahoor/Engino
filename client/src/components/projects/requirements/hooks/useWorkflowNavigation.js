import { useState, useCallback } from "react";

const initialWorkflow = {
  current: "requirement",
  visited: ["requirement"],
  completed: [],
};

const useWorkflowNavigation = () => {
  const [workflow, setWorkflow] = useState(initialWorkflow);

  const navigateToStep = useCallback((stepId) => {
    setWorkflow((prev) => ({
      ...prev,
      current: stepId,
      visited: prev.visited.includes(stepId)
        ? prev.visited
        : [...prev.visited, stepId],
    }));
  }, []);

  const completeStep = useCallback((stepId) => {
    setWorkflow((prev) => {
      if (prev.completed.includes(stepId)) {
        return prev;
      }

      return {
        ...prev,
        completed: [...prev.completed, stepId],
      };
    });
  }, []);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const completeCurrentStep = useCallback(() => {
    completeStep(workflow.current);
  }, [completeStep, workflow]);

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

  const resetWorkflow = useCallback(() => {
    setWorkflow(initialWorkflow);
  }, []);

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