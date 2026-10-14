import Header from "../components/layout/Header"
import RequirementStats from "../components/requirements/RequirementStats"
import RequirementToolbar from "../components/requirements/RequirementToolbar"
import RequirementsList from "../components/requirements/RequirementsList"
import RequirementDetails from "../components/requirements/RequirementDetails"
import useWorkspaceStore from "../stores/workspaceStore";
import useRequirementStore from "../stores/requirementStore"
import useAuthStore from "../stores/authStore";
import { useEffect, useState } from "react"

function AIRequirements() {
  const { user } = useAuthStore();
  const { 
    workspaceRequirements,
    fetchWorkspaceRequirements,
    fetchRequirement,
    currentRequirement,
    isLoading,
    error,
    workspaceRequirementsFetched,
  } = useRequirementStore();
  const { currentWorkspaceId } = useWorkspaceStore();

  const [searchInput, setSearchInput] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  useEffect(() => {
      if (!selectedRequirement || !currentWorkspaceId) return;

      fetchRequirement(
          currentWorkspaceId,
          selectedRequirement.projectId,
          selectedRequirement._id
      );
  }, [
      selectedRequirement,
      currentWorkspaceId,
      fetchRequirement,
  ]);

  useEffect(() => {
    if(workspaceRequirements.length === 0) {
      fetchWorkspaceRequirements(currentWorkspaceId);
    }
  }, [currentWorkspaceId, workspaceRequirements.length, fetchWorkspaceRequirements]);

  const searchedRequirements = workspaceRequirements.filter((requirement) => {
    const nameMatched = requirement?.name.toLowerCase().includes(searchInput.toLowerCase());
    
    return nameMatched;
  })

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        <Header 
            title="AI Requirements"
            description="Define, analyse and convert requirements into executable engineering plans."
            user={user}
            showBack={true}
        />

        <RequirementStats requirements={workspaceRequirements}/>
        
        <RequirementToolbar 
             searchInput={searchInput}
             setSearchInput={setSearchInput}  
             onClear={() => setSearchInput("")}
        />

        <div className={`grid items-start gap-4 ${
              selectedRequirement
                ? "xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]"
                : "grid-cols-1"
            }`}>
            <RequirementsList 
              requirements={searchedRequirements}
              selectedRequirement={selectedRequirement}
              setSelectedRequirement={setSelectedRequirement}
              loading={isLoading || !workspaceRequirementsFetched}
              error={error}
              hasRequirements={workspaceRequirements.length > 0}
              hasSearch={searchInput.trim().length > 0}
              onClearSearch={() => setSearchInput("")}
            />  

            {/* will get the selected requirement from store later */}
            <RequirementDetails 
                requirement={currentRequirement}
                setSelectedRequirement={setSelectedRequirement}
                isLoading={isLoading}
              /> 
        </div>
    </div>
  )
}

export default AIRequirements
