import { useEffect, useRef, useState } from "react";
import { Sparkles, WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import enginoAiLogo from "../../assets/images/engino-ai-logo.png";
import { isWorkspaceAdmin } from "../../utils/isWorkspaceAdmin";
import useWorkspaceStore from "../../stores/workspaceStore";
import useProjectStore from "../../stores/projectStore";
import useRequirementStore from "../../stores/requirementStore";
import useToastStore from "../../stores/toastStore";
import useAIStore from "../../stores/aiStore";

import Loader from "../common/Loader";
import Toast from "../common/Toast";
import SelectProjectModal from "./SelectProjectModal";
import CreateProjectModal from "../projects/CreateProjectModal";

import ReactMarkdown from "react-markdown";

const examples = [
  {
    label: "Student Portal",
    prompt:
      "Build a student portal where students can view their courses, assignments, attendance, and academic notifications.",
  },
  {
    label: "LMS Dashboard",
    prompt:
      "Build an LMS dashboard where students can view enrolled courses, upcoming assignments, learning progress, and recent announcements.",
  },
  {
    label: "Notification System",
    prompt:
      "Build a notification system that allows users to receive and manage important application notifications, including unread and read states.",
  },
];

function AIWorkspace() {
  const navigate = useNavigate();
  const isAdmin = isWorkspaceAdmin();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { fetchProjects } = useProjectStore();
  const { extractRequirement, createRequirement } = useRequirementStore();
  const { exploreWithAI } = useAIStore();

  const { showToast } = useToastStore();
  
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [conversation, setConversation] = useState([]);
  const conversationRef = useRef(null);

  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [showProjectCreation, setShowProjectCreation] = useState(false);
  const [availableProjects, setAvailableProjects] = useState([]);

  useEffect(() => {
    if(conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

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
    setPrompt(example.prompt);
  }

  const handleExploreWithAI = async () => {
    if (!prompt.trim()) return;

    try {
      setIsExploring(true);

      const userMessage = {
        role: "user",
        content: prompt.trim(),
      };

      const response = await exploreWithAI(
        currentWorkspaceId,
        prompt.trim(),
        conversation
      );

      const aiMessage = {
        role: "assistant",
        content: response?.aiResponse,
      };

      setConversation((prev) => [
        ...prev,
        userMessage,
        aiMessage,
      ]);

      setPrompt("");

    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to explore with AI.",
        "error"
      );
    } finally {
      setIsExploring(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5b2eff] via-[#4b24c9] to-[#17105c] p-6 text-white">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-card/10 blur-3xl" />

      <div className="relative flex min-h-[250px] items-center gap-8">
        {/* Content */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={20} />
            <h2 className="text-xl font-semibold">
              AI Workspace
            </h2>

            <span className="rounded-md bg-card/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
              Beta
            </span>
          </div>

          <p className="mb-5 max-w-xl text-sm leading-6 text-white/80">
            Explore ideas with AI or turn your idea into an execution plan.
          </p>

          {/* Requirement input */}
          <div className="rounded-xl bg-card p-2 shadow-lg">
            {conversation.length > 0 && (
                  <div
                    ref={conversationRef} 
                    className="mb-2 max-w-200 max-h-72 space-y-3 overflow-auto px-3 pt-2 scrollbar-none overfl">
                    {conversation.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                            message.role === "user"
                              ? "bg-primary text-white"
                              : "bg-surface text-text-primary"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="space-y-2 leading-6 text-text-primary [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:font-semibold [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mb-1 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-border [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-code [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-white">
                              <ReactMarkdown>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) =>  setPrompt(e.target.value)}
              placeholder={
                isAdmin
                  ? "Describe what you want to build or explore..."
                  : "Ask anything about software engineering..."
              }
              className={`${conversation.length > 0 ? "py-2 h-10 border-t border-border" : "py-2"} w-full resize-none rounded-lg bg-transparent px-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:outline-none`}
              disabled={isSubmitting || isExploring}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleExploreWithAI}
                disabled={isSubmitting || isExploring || !prompt.trim()}
                className="flex items-center gap-2 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-light"
              >
                {isExploring ? (
                  <>
                    <Loader color="primary"/>
                    <span>Processing...</span>
                  </>
                ) : conversation.length > 0 ? (
                  <>
                    Send
                  </>
                ) : (
                  (
                  <>
                    <Sparkles size={16} />
                    Explore with AI
                  </>
                )
                )}
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  disabled={isSubmitting || isExploring || !prompt.trim()}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  {isSubmitting ? (
                    <>
                      <Loader />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      Generate Plan
                      <WandSparkles size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Examples */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/70">
              Not sure? Try an example:
            </span>

            {examples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={isSubmitting || isExploring}
                className="rounded-md bg-card/90 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-card"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden w-64 shrink-0 items-center justify-center lg:flex">
          <div className="relative flex h-70 w-70 items-center justify-center">
            <div className="absolute h-40 w-40 rounded-full bg-card/10 blur-3xl" />

            <img
              src={enginoAiLogo}
              alt="AI assistant"
              className="relative h-70 w-70 object-contain drop-shadow-2xl"
            />
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
