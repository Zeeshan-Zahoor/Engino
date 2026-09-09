import { useState } from "react";

const tabs = ["Overview", "AI Requirements", "Tasks", "Team", "Activity"];

function ProjectTabs() {
  const [active, setActive] = useState(tabs[0]);
  
  const handleTabClick = (tab) => {
    switch (tab) {
      case "Overview":
        
        break;
    
      default:
        break;
    }
  }

  return (
    <div className="overflow-x-auto border-b border-border">
      <div className="flex min-w-max items-center gap-7">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActive(tab)
              handleTabClick(tab)
            }}
            className={`relative py-3 text-sm font-medium transition ${
              active === tab
                ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary transition-all"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProjectTabs;