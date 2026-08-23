import { Sparkles, WandSparkles } from "lucide-react";

const examples = [
  "Student Portal",
  "LMS Dashboard",
  "Notification System",
];

function AIWorkspace() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5b2eff] via-[#4b24c9] to-[#17105c] p-6 text-white">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex min-h-[250px] items-center gap-8">
        {/* Content */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={20} />
            <h2 className="text-xl font-semibold">
              AI Workspace
            </h2>

            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              Beta
            </span>
          </div>

          <p className="mb-5 max-w-xl text-sm leading-6 text-white/80">
            Describe what you want to build. Our AI will break it down
            into a clear execution plan.
          </p>

          {/* Requirement input */}
          <div className="rounded-xl bg-white p-2 shadow-xl">
            <textarea
              rows={3}
              placeholder="E.g. Build Student Portal with attendance, assignments and notifications"
              className="w-full resize-none bg-transparent px-3 py-2 text-sm text-text-primary outline-none placeholder:text-gray-400"
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Generate Plan
                <WandSparkles size={16} />
              </button>
            </div>
          </div>

          {/* Examples */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/70">
              Not sure? Try an example:
            </span>

            {examples.map((example) => (
              <button
                key={example}
                type="button"
                className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-white"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Illustration placeholder */}
        <div className="hidden w-64 shrink-0 items-center justify-center lg:flex">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
              <Sparkles
                size={52}
                strokeWidth={1.3}
                className="text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIWorkspace;