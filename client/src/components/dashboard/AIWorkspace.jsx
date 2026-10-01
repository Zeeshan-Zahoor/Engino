import { useState } from "react";
import { Sparkles, WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";
import useWorkspaceStore from "../../stores/workspaceStore";
import useProjectStore from "../../stores/projectStore";
import useRequirementStore from "../../stores/requirementStore";
import useToastStore from "../../stores/toastStore";

import Loader from "../common/Loader";
import Toast from "../common/Toast";
import SelectProjectModal from "./SelectProjectModal";
import CreateProjectModal from "../projects/CreateProjectModal";

const examples = [
  "Student Portal",
  "LMS Dashboard",
  "Notification System",
];

function AIWorkspace() {
  const navigate = useNavigate();
  const isAdmin = isWorkspaceAdmin();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { fetchProjects } = useProjectStore();
  const { extractRequirement, createRequirement } = useRequirementStore();

  const { showToast } = useToastStore();
  
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [showProjectCreation, setShowProjectCreation] = useState(false);
  const [availableProjects, setAvailableProjects] = useState([]);

  const handleCreateRequirement = async (project) => {
    try {
      setIsSubmitting(true);
      setShowProjectSelection(false);
      setShowProjectCreation(false);

      const extractionResponse = await extractRequirement(
        currentWorkspaceId,
        prompt.trim()
      );

      const requirementData = extractionResponse?.requirementData;

      if(!requirementData) {
        showToast("Failed to extract requirement data.", "error");
        throw new Error("Failed to extract requirement data.")
      }

      const requirementResponse =await createRequirement(
        currentWorkspaceId,
        project._id,
        requirementData,
      );

      const requirement = requirementResponse?.requirement;

      if(!requirement) {
        showToast("Failed to create requirement.", "error");
        throw new Error("Failed to create requirement.");
      }

      navigate(`/projects/${project._id}/requirements/${requirement._id}`);

    } catch (error) {
      showToast(error.response?.data?.message || "AI Workspace Error.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGeneratePlan = async () => {
    if (!prompt.trim()) return;

    try {
      setIsSubmitting(true);
      // get the latest accessible projexts
      const projectResponse = await fetchProjects(currentWorkspaceId);
      const projects = projectResponse?.projects || [];

      // no project yet
      if (projects.length === 0) {
        setShowProjectCreation(true);
        return;
      }

      // exactly one projet
      if(projects.length === 1) {
        await handleCreateRequirement(projects[0]);
        return;
      }

      // multiple projects
      setAvailableProjects(projects);
      setShowProjectSelection(true);

      
    } catch (error) {

      showToast(error.response?.data?.message || "Failed to fetch projects.", "error");

    } finally {
        if (showProjectSelection) {
            setIsSubmitting(false);
        }
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5b2eff] via-[#4b24c9] to-[#17105c] p-6 text-white">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex min-h-[250px] items-center gap-8">
        {/* Content */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={20} />
            <h2 className="text-xl font-semibold">
              AI Workspace
            </h2>

            <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
              Beta
            </span>
          </div>

          <p className="mb-5 max-w-xl text-sm leading-6 text-white/80">
            Describe what you want to build. Our AI will break it down
            into a clear execution plan.
          </p>

          {/* Requirement input */}
          <div className="rounded-xl bg-white p-2 shadow-xl">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) =>  setPrompt(e.target.value)}
              placeholder="E.g. Build Student Portal with attendance, assignments and notifications"
              className="w-full resize-none bg-transparent px-3 py-2 text-sm text-text-primary outline-none placeholder:text-gray-400"
              disabled={isSubmitting}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={isAdmin ? handleGeneratePlan : undefined}
                disabled={isSubmitting || (isAdmin && !prompt.trim())}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {isSubmitting
                  ? (
                    <>
                      <Loader />
                      <span> Processing...</span>
                    </>
                  )
                  : isAdmin
                    ? "Generate Plan"
                    : "Explore with AI"}
                <WandSparkles size={16} />
              </button>
            </div>
          </div>

          {/* Examples */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/70">
              Not sure? Try an example:
            </span>

            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={isSubmitting}
                className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-white"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden w-64 shrink-0 items-center justify-center lg:flex">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
              <Sparkles
                size={52}
                strokeWidth={1.3}
                className="text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <Toast />
      <SelectProjectModal 
        isOpen={showProjectSelection}
        onClose={() => setShowProjectSelection(false)}
        projects={availableProjects}
        onSelect={handleCreateRequirement}
      />

      <CreateProjectModal 
        isOpen={showProjectCreation}
        onClose={() => setShowProjectCreation(false)}
        AIWorkspace={showProjectCreation}
        AIWorkspaceAction={handleCreateRequirement}
      />
    </section>
  );
}

export default AIWorkspace;
