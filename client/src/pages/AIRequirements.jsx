import Header from "../components/layout/Header"
import RequirementStats from "../components/requirements/RequirementStats"
import RequirementToolbar from "../components/requirements/RequirementToolbar"
import RequirementsList from "../components/requirements/RequirementsList"
import RequirementDetails from "../components/requirements/RequirementDetails"

function AIRequirements() {
  return (
    <div className="space-y-6 px-8">
        <Header 
            title="AI Requirements"
            description="Define, analyse and convert requirements into executable engineering plans."
        />

        <RequirementStats />
        
        <RequirementToolbar />

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
            <RequirementsList />
            <RequirementDetails />
            </div>
    </div>
  )
}

export default AIRequirements