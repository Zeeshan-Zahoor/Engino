function ProjectTabs() {
  const tabs = ["Overview", "AI Requirements", "Tasks", "Team", "Activity"];

  return (
    <div className="overflow-x-auto border-b border-border">
      <div className="flex min-w-max items-center gap-7">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`relative py-3 text-sm font-medium transition ${
              index === 0
                ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
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