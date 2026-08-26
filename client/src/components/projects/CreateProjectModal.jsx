import { useState } from "react";
import {
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import useProjectStore from "../../stores/projectStore";
import useToastStore from "../../stores/toastStore";

const teamMembers = [
  { id: "1", name: "Zeeshan Zahoor", initials: "ZZ" },
  { id: "2", name: "Ganga", initials: "GA" },
  { id: "3", name: "Areeb", initials: "AR" },
  { id: "4", name: "Ahmed Khan", initials: "AK" },
];

function CreateProjectModal({ isOpen, onClose }) {

 const addProject = useProjectStore((state) => state.addProject);
 const showToast = useToastStore((state) => state.showToast);

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [projectCode, setProjectCode] = useState("--- ---");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Not Started",
    startDate: "",
    targetDate: "",
    team: [],
    url: ""
  });


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
        code: generatedCode,
    }))
  }

  if (!isOpen) return null;

  const toggleMember = (memberId) => {
    setError("");
    setSelectedMembers((current) => { 
        const member = teamMembers.find((member) => (
            member.id === memberId
        ));

        if(!member) return current;

        const alreadySelected = current.some((member) => 
            member.id === memberId
        )

        const updatedMembers = alreadySelected
            ? current.filter((member) => member.id !== memberId)
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

    const validateGithubURL = () => {
        const githubRepoRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:\.git)?\/?$/;
        if(formData.url !== "" && !formData.url.match(githubRepoRegex)) {
            return false;
        }
        return true;
    }

  const handleAddProject = () => {
    if(!validateRequiredFields()) {
        setError("The required fields can not be empty!");
        return;
    } else if (!validateTeam()) {
        setError("Please select team members for this project!");
        return;
    } else if (!validateGithubURL()) {
        setError("Enter a valid repository link!");
        return;
    } else if (!dateValidation()) {
        setError("Target date must be after start date")
        return;
    }

    addProject(formData);
    setFormData({
        name: "",
        description: "",
        status: "Not Started",
        startDate: "",
        targetDate: "",
        team: [],
        url: ""
    })
    onClose();
    showToast("Project Created Successfully!", "success");
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
                  <option value="Not Started">Not Started</option>
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

                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {selectedMembers.some((selected) => selected.id === member.id) ? "✓ " : ""}
                      {member.name}
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
                        key={member.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {member.initials}

                        <button
                          type="button"
                          onClick={() => toggleMember(member.id)}
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

          {/* Repository */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Repository URL
            </label>

            <input
              type="url"
              value={formData.url}
              onChange={(e) => {
                setError("");
                setFormData(prev => ({
                    ...prev,
                    url: e.target.value
                }))
              }}
              placeholder="https://github.com/..."
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            <p className="mt-1.5 text-xs text-text-secondary">
              Optional · You can add or change this later.
            </p>
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
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectModal;