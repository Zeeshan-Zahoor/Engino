import { Filter, Search, X } from "lucide-react";

function ProjectFilters({
  searchInput,
  selectedStatus,
  sortBy,
  setSearchInput,
  setSelectedStatus,
  setSortBy
}) {

  const resetFilters = () => {
    setSearchInput("");
    setSelectedStatus("All");
    setSortBy("Recently Updated");
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 lg:flex-row lg:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />

        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value)
          }}
          placeholder="Search projects..."
          className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* Status Filter */}
      <button
        type="button"
        className="flex h-10 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 text-sm text-text-primary transition hover:border-primary/40 lg:w-auto lg:gap-8"
      >
        <span className="flex items-center gap-2 font-medium">
          <Filter size={15} className="text-text-secondary" />
          Status:
          <select 
            className="h-8 min-w-0 max-w-full rounded-lg bg-card text-sm text-text-primary outline-none"
            value={selectedStatus}
            onChange={(e) => (
              setSelectedStatus(e.target.value)
            )}
          >
            <option value="All">All</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Planning">Planning</option>
            <option value="Not Started">Not Started</option>

          </select>
        </span>
      </button>

      {/* Sort */}
      <button
        type="button"
        className="flex h-10 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 text-sm text-text-primary transition hover:border-primary/40 lg:w-auto lg:gap-8"
      >
        <span className="font-medium">
          Sort: 
           <select 
               className="h-8 min-w-0 max-w-full bg-card text-sm text-text-primary outline-none"
              value={sortBy}
              onChange={(e) => (
                setSortBy(e.target.value)
              )}
              >
              <option value="Recently Updated">Recently Updated</option>
              <option value="Oldest Updated">Oldest Updated</option>
              <option value="Progress: High to Low">Progress: High to Low</option>
              <option value="Progress: Low to High">Progress: Low to High</option>
              <option value="Name: A-Z">Name: A-Z</option>
              <option value="Name: Z-A">Name: Z-A</option>
            </select>
        </span>
      </button>

      {/* Clear */}
      <button
        type="button"
        onClick={resetFilters}
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-secondary lg:w-auto lg:justify-start"
        disabled={searchInput === "" && selectedStatus === "All" && sortBy === "Recently Updated"}
      >
        <X size={15} />
        Clear
      </button>
    </div>
  );
}

export default ProjectFilters;
