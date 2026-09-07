import { useEffect, useState } from "react";
import {
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import Loader from '../common/Loader';
import useProjectStore from "../../stores/projectStore";
import useToastStore from "../../stores/toastStore";
import useWorkspaceStore from "../../stores/workspaceStore";
import Avatar from "../../utils/Avatar";

function CreateProjectModal({ isOpen, onClose }) {

  const { workspaceMembers, getWorkspaceMembers, currentWorkspaceId } = useWorkspaceStore();
  const { addProject, isLoading } = useProjectStore();

 const showToast = useToastStore((state) => state.showToast);

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [projectCode, setProjectCode] = useState("--- ---");
  const [technologyInput, setTechnologyInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goals: [],
    technologies: [],
    status: "Planning",
    startDate: "",
    targetDate: "",
    team: [],
    projectCode,
  });

  useEffect(() => {
    getWorkspaceMembers();
  }, [getWorkspaceMembers]);


  const handleNameChange = (e) => {
    setError("");
    const name = e.target.value;

    if(name.length < 3) {
        setProjectCode("--- ---");

        setFormData((prev) => ({
            ...prev,
            name,
            code: "",
        }));

        return;
    }

    const prefix = name.slice(0, 3);
    const number = Math.floor((Math.random() * 900) + 100);

    const generatedCode = `${prefix.toUpperCase()}-${number}`;
    setProjectCode(generatedCode);
    setFormData((prev) => ({
        ...prev,
        name,
        projectCode: generatedCode,
    }))
  }

  const handleAddTechnology = (e) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        const technology = technologyInput.trim();

        if (!technology) return;

        if (
          formData.technologies.some(
            (tech) => tech.toLowerCase() === technology.toLowerCase()
          )
        ) {
          setTechnologyInput("");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          technologies: [...prev.technologies, technology],
        }));

        setTechnologyInput("");
    };

    const removeTechnology = (technology) => {
      setFormData((prev) => ({
        ...prev,
        technologies: prev.technologies.filter(
          (tech) => tech !== technology
        ),
      }));
    };

    const handleAddGoal = () => {
      const goal = goalInput.trim();

      if(!goal) return;

      if(formData.goals.includes(goal)) {
        setError("This goal has already been added.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        goals: [...prev.goals, goal],
      }));

      setGoalInput("");
    };


    const removeGoal = (index) => {
      setFormData((prev) => ({
        ...prev,
        goals: prev.goals.filter((_, i) => i !== index),
      }));
    };

  if (!isOpen) return null;

  const toggleMember = (memberId) => {
    setError("");
    setSelectedMembers((current) => { 
        const member = workspaceMembers?.find((member) => (
            member.userId._id === memberId
        ));

        if(!member) return current;

        const alreadySelected = current.some((member) => 
            member.userId._id === memberId
        )

        const updatedMembers = alreadySelected
            ? current.filter((member) => member.userId._id !== memberId)
            : [...current, member]

        setFormData(prev => ({
            ...prev,
            team: updatedMembers,
        }))  
        
        return updatedMembers;
    });
    
  };

  const validateRequiredFields = () => {
        if(formData.name === "" || formData.description === "" || formData.startDate === "" || formData.targetDate === "") {
            return false;
        }
        return true;
  }

  const dateValidation = () => {
    if(new Date(formData.startDate) > new Date(formData.targetDate)) {
        return false;
    }
    return true;
  }

 const validateTeam = () => {
    if(formData.team.length === 0) {
        return false;
    }
    return true;
 }

  const handleAddProject = async () => {
    if(!validateRequiredFields()) {
        setError("The required fields can not be empty!");
        return;
    } else if (!validateTeam()) {
        setError("Please select team members for this project!");
        return;
    } else if (!dateValidation()) {
        setError("Target date must be after start date")
        return;
    }


    try {
      await addProject(currentWorkspaceId, formData);

      setFormData({
        name: "",
        description: "",
        goals:[],
        technologies: [],
        status: "Not Started",
        startDate: "",
        targetDate: "",
        team: [],
        projectCode,
    })

      onClose();
      showToast("Project Created Successfully!", "success");

    } catch (error) {
      setError(error.response?.data?.message || "Failed to add project. Try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Create New Project
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Create a project and start managing its work.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
          >
            <X size={19} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6 scrollbar-thin">

          {/* Project Name + Code */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Project Name <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleNameChange}
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Project Code
              </label>

              <input
                type="text"
                value={projectCode}
                readOnly
                className="h-11 w-full cursor-not-allowed rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-secondary outline-none"
              />

              <p className="mt-1.5 text-xs text-text-secondary">
                Automatically generated
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Description <span className="text-danger">*</span>
            </label>

            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => {
                setError("")
                setFormData(prev => ({
                ...prev,
                description: e.target.value,
              }))
              }}
              placeholder="Describe the purpose and goals of this project..."
              className="w-full resize-none rounded-lg border border-border bg-white px-3 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            <p className="mt-1.5 text-xs text-text-secondary">
              Briefly describe the purpose and goals of this project.
            </p>
          </div>

          {/* Project Goals */}
          <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Project Goals
              </label>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={goalInput}
                  onChange={(e) => {
                    setError("");
                    setGoalInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if(e.key === "Enter") {
                      e.preventDefault();
                      handleAddGoal();
                    }
                  }}
                  placeholder="e.g. Provide students with a centralized learning platform"
                  className="flex-1 rounded-lg border border-border bg-white px-3 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
                 />

                 <button 
                  type="button"
                  onClick={handleAddGoal}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                 >
                    Add
                 </button>
              </div>

              {/* Goals list */}
              {formData.goals.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.goals.map((goal, index) => (
                    <div
                      key={`${goal}-${index}`}
                      className="flex items-start gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
                    >
                      <span className="mt-0.5 text-sm font-medium text-primary">
                        {index + 1}
                      </span>

                      <p className="flex-1 text-sm text-text-primary">
                        {goal}
                      </p>

                      <button 
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="text-xs font-medium text-red-500 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-1.5 text-xs text-text-secondary">
                Add the main outcomes or objectives you want this project to achieve.
              </p>
          </div>


          {/* Technologies */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Technologies
            </label>

            <div className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              
              <div className="flex flex-wrap items-center gap-2">
                {formData.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary"
                  >
                    {technology}

                    <button
                      type="button"
                      onClick={() => removeTechnology(technology)}
                      className="rounded-full hover:text-danger"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  value={technologyInput}
                  onChange={(e) => setTechnologyInput(e.target.value)}
                  onKeyDown={handleAddTechnology}
                  placeholder={
                    formData.technologies.length === 0
                      ? "e.g. React, Node.js, MongoDB..."
                      : "Add technology..."
                  }
                  className="min-w-[180px] flex-1 bg-transparent py-1 text-sm text-text-primary outline-none placeholder:text-text-secondary"
                />
              </div>
            </div>

            <p className="mt-1.5 text-xs text-text-secondary">
              Press Enter after each technology to add it.
            </p>
          </div>

          {/* Status + Start Date */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Status <span className="text-danger">*</span>
              </label>

              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    status: e.target.value,
                  }))}
                  className="h-11 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-10 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Start Date <span className="text-danger">*</span>
              </label>

              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setError("");
                    setFormData(prev => ({
                        ...prev,
                        startDate: e.target.value
                    }))
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>

          {/* Target Date + Team Members */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Target Date <span className="text-danger">*</span>
              </label>

              <div className="relative">
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => {
                    setError("");
                    setFormData(prev => ({
                        ...prev,
                        targetDate: e.target.value
                    }))
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Team Members
              </label>

              <div className="relative">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleMember(e.target.value);
                    }
                  }}
                  className="h-11 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-10 text-sm text-text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">Select team members...</option>

                  {workspaceMembers?.map((member) => (
                    <option key={member.userId._id} value={member.userId._id}>
                      {selectedMembers.some((selected) => selected.userId._id === member.userId._id) ? "✓ " : ""}
                      {member.userId.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
              </div>

              {selectedMembers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedMembers.map((member) => {
                    return (
                      <span
                        key={member.userId._id}
                        className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        <div className="flex h-6 w-6 items-center justify-cneter rounded-full">
                          <Avatar 
                          user={member?.userId}
                        /> 
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleMember(member.userId._id)}
                          className="hover:text-danger"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <p className="mt-1.5 text-xs text-text-secondary">
                You can add or remove members later.
              </p>
            </div>
          </div>

          
        </div>

        {/* Footer */}
        {error && (
            <p className="text-danger text-center text-sm mb-2">{error}</p>
          )}
        <div className="flex items-center justify-end gap-3 border-t border-border bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition hover:bg-surface"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddProject}
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <Plus size={16} strokeWidth={2.5} />
            {isLoading ? (
              <Loader />
            ) : ("Add Project")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectModal;