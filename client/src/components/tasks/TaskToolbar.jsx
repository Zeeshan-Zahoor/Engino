import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";

function FilterButton({ children }) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface"
    >
      {children}
      <ChevronDown size={15} className="text-text-secondary" />
    </button>
  );
}

function TaskToolbar() {
  return (
    <div className="rounded-xl border border-border bg-white p-3 mb-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            type="text"
            placeholder="Search tasks..."
            className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-3 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
          <FilterButton>All Projects</FilterButton>
          <FilterButton>All Status</FilterButton>
          <FilterButton>All Priority</FilterButton>
          <FilterButton>All Assignees</FilterButton>
          <FilterButton>All Task Types</FilterButton>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>

          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 px-2 py-2 text-sm font-medium text-primary transition hover:text-primary-dark"
          >
            <X size={15} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskToolbar;
