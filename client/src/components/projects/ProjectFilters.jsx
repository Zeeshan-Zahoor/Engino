import { ChevronDown, Filter, Search, X } from "lucide-react";

function ProjectFilters() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 lg:flex-row lg:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />

        <input
          type="text"
          placeholder="Search projects..."
          className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* Status Filter */}
      <button
        type="button"
        className="flex h-10 items-center justify-between gap-8 rounded-lg border border-border bg-white px-3 text-sm text-text-primary transition hover:border-primary/40"
      >
        <span className="flex items-center gap-2 font-medium">
          <Filter size={15} className="text-text-secondary" />
          Status: All
        </span>

        <ChevronDown size={15} className="text-text-secondary" />
      </button>

      {/* Sort */}
      <button
        type="button"
        className="flex h-10 items-center justify-between gap-8 rounded-lg border border-border bg-white px-3 text-sm text-text-primary transition hover:border-primary/40"
      >
        <span className="font-medium">Sort: Recently Updated</span>

        <ChevronDown size={15} className="text-text-secondary" />
      </button>

      {/* Clear */}
      <button
        type="button"
        className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-text-secondary transition hover:bg-surface hover:text-text-primary"
      >
        <X size={15} />
        Clear
      </button>
    </div>
  );
}

export default ProjectFilters;