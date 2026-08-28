import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

function RequirementToolbar({
  searchInput,
  setSearchInput,
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 mb-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or keyword..."
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton label="All Projects" />
          <FilterButton label="All Status" />
          <FilterButton label="All Complexity" />
          <FilterButton label="All Owners" />

          <button
            type="button"
            className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-text-secondary transition hover:bg-surface hover:text-text-primary"
          >
            <X size={14} />
            Clear
          </button>
        </div>

        {/* Sort + View */}
        <div className="flex items-center gap-2 xl:ml-auto">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-text-primary transition hover:border-primary/40"
          >
            <SlidersHorizontal
              size={14}
              className="text-text-secondary"
            />

            <span className="hidden sm:inline">Recently Updated</span>

            <ChevronDown size={14} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FilterButton({ label }) {
  return (
    <button
      type="button"
      className="flex h-10 items-center gap-3 rounded-lg border border-border px-3 text-sm font-medium text-text-primary transition hover:border-primary/40"
    >
      {label}

      <ChevronDown size={14} className="text-text-secondary" />
    </button>
  );
}

export default RequirementToolbar;
