import { ArrowRight, LockKeyhole } from "lucide-react";
import { FaGithub } from "react-icons/fa"

function RepositoryStatus() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-white p-5">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary-light/60 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <FaGithub size={20} strokeWidth={1.8} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-text-primary">
                  Repository Status
                </h2>

                <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-warning">
                  Coming Soon
                </span>
              </div>

              <p className="mt-1 text-xs text-text-secondary">
                Codebase intelligence is on its way.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-5 rounded-xl border border-dashed border-border bg-surface p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-text-secondary">
              <LockKeyhole size={15} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-xs font-semibold text-text-primary">
                Connect your repository
              </p>

              <p className="mt-1 max-w-2xl text-sm leading-5 text-text-secondary">
                Engino will soon understand your codebase, dependencies,
                architecture, and repository structure to provide deeper
                engineering insights.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-text-secondary">
            GitHub integration
          </p>

          <button
            type="button"
            disabled
            className="flex cursor-not-allowed items-center gap-1.5 text-xs font-semibold text-text-secondary"
          >
            Coming Soon
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default RepositoryStatus;
