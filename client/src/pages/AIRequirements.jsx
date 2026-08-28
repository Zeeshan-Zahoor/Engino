import Header from "../components/layout/Header"
import RequirementStats from "../components/requirements/RequirementStats"
import RequirementToolbar from "../components/requirements/RequirementToolbar"
import RequirementsList from "../components/requirements/RequirementsList"
import RequirementDetails from "../components/requirements/RequirementDetails"

import { requirements } from "../data/requirements"
import { useState } from "react"

function AIRequirements() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState(requirements[0]);

  const searchedRequirements = requirements.filter((requirement) => {
    const nameMatched = requirement?.name.toLowerCase().includes(searchInput.toLowerCase());
    
    return nameMatched;
  })

  return (
    <div className="space-y-6 px-8">
        <Header 
            title="AI Requirements"
            description="Define, analyse and convert requirements into executable engineering plans."
        />

        <RequirementStats />
        
        <RequirementToolbar 
             searchInput={searchInput}
             setSearchInput={setSearchInput}  
        />

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
            <RequirementsList 
              requirements={searchedRequirements}
              selectedRequirement={selectedRequirement}
              setSelectedRequirement={setSelectedRequirement}
            />  

            {/* will get the selected requirement from store later */}
            <RequirementDetails requirement={selectedRequirement}/> 
        </div>
    </div>
  )
}

export default AIRequirements