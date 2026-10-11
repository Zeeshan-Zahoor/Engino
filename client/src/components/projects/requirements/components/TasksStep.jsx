import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ListChecks,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";

import StepHeader from "./StepHeader";
import { isWorkspaceAdmin } from "../../../../utils/isWorkspaceAdmin";


const TasksStep = ({
  tasks = [],
  loading = false,
  error = null,
  onGenerate,
}) => {

  const isAdmin = isWorkspaceAdmin();

  const formatEffort = (minutes) => {
    if (!minutes || minutes <= 0) return "Not estimated";


    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };


  const totalEffort = tasks.reduce(
    (total, task) => total + (task.estimatedEffortMinutes || 0),
    0
  );


  const priorityClass = {
    High: "bg-danger/10 text-danger",
    Medium: "bg-warning/10 text-warning",
    Low: "bg-success/10 text-success",
  };


  const complexityClass = {
    High: "bg-danger/10 text-danger",
    Medium: "bg-warning/10 text-warning",
    Low: "bg-success/10 text-success",
  };


  if (tasks.length === 0) {
    return (
      <div className="space-y-6">

        <StepHeader
          eyebrow="Tasks"
          title="Turn the approved plan into tasks"
          description="Engino will break the approved engineering plan into executable tasks for the development team."
          badge="Ready"
        />


        {/* Ready Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6">

          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex items-start gap-5">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles size={25} />
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-base font-semibold text-text-primary">
                  Your engineering plan is ready
                </h2>

                <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                  Plan approved
                </span>

              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                The approved plan will be used as the source for generating
                actionable engineering tasks. Engino will preserve the planned
                scope, priorities, and estimated effort.
              </p>

            </div>

          </div>

        </section>


        {/* Generation Card */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">

          <div className="flex items-start justify-between gap-6">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ListChecks size={20} />
              </div>

              <div>

                <h2 className="text-sm font-semibold text-text-primary">
                  Generate engineering tasks
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-text-secondary">
                  Engino will analyze the approved features and create
                  implementation-ready tasks with priorities, complexity,
                  effort estimates, and relevant tags.
                </p>

              </div>

            </div>


            {isAdmin && (
              <button
                type="button"
                onClick={onGenerate}
                disabled={loading}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Generate Tasks
                  </>
                )}
              </button>
            )}

          </div>


          {/* What will be generated */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">

            <div className="rounded-xl border border-border bg-surface/40 p-4">

              <ListChecks
                size={17}
                className="text-primary"
              />

              <p className="mt-3 text-sm font-medium text-text-primary">
                Actionable tasks
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Break features into concrete engineering work.
              </p>

            </div>


            <div className="rounded-xl border border-border bg-surface/40 p-4">

              <Clock3
                size={17}
                className="text-primary"
              />

              <p className="mt-3 text-sm font-medium text-text-primary">
                Effort estimates
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Each task receives an estimated implementation effort.
              </p>

            </div>


            <div className="rounded-xl border border-border bg-surface/40 p-4">

              <Tag
                size={17}
                className="text-primary"
              />

              <p className="mt-3 text-sm font-medium text-text-primary">
                Task metadata
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Priority, complexity, type, and tags are generated.
              </p>

            </div>

          </div>

        </section>


        {/* Error */}
        {error && (
          <section className="rounded-2xl border border-danger/20 bg-danger/5 p-5">

            <div className="flex items-start gap-3">

              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0 text-danger"
              />

              <div>

                <h2 className="text-sm font-semibold text-text-primary">
                  Task generation failed
                </h2>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  {error}
                </p>

              </div>

            </div>

          </section>
        )}

      </div>
    );
  }


  return (
    <div className="space-y-6">

      <StepHeader
        eyebrow="Tasks"
        title="Engineering tasks"
        description="The approved engineering plan has been converted into executable tasks."
        badge="Generated"
      />


      {/* Success Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-success/20 bg-gradient-to-br from-success/10 via-background to-primary/5 p-6">

        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-success/10 blur-3xl" />

        <div className="relative flex items-start gap-5">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
            <CheckCircle2 size={26} />
          </div>


          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="text-base font-semibold text-text-primary">
                Tasks generated successfully
              </h2>

              <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                Ready for execution
              </span>

            </div>


            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Engino has converted the approved engineering plan into
              executable work items. These tasks can now be assigned and
              tracked by the development team.
            </p>

          </div>

        </div>

      </section>


      {/* Summary */}
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Task summary
          </p>

          <h2 className="mt-1 text-lg font-semibold text-text-primary">
            Generated engineering work
          </h2>
        </div>


        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-xl border border-border bg-surface/50 p-4">

            <p className="text-xs text-text-secondary">
              Total tasks
            </p>

            <p className="mt-1 text-xl font-semibold text-text-primary">
              {tasks.length}
            </p>

          </div>


          <div className="rounded-xl border border-border bg-surface/50 p-4">

            <p className="text-xs text-text-secondary">
              High priority
            </p>

            <p className="mt-1 text-xl font-semibold text-text-primary">
              {tasks.filter((task) => task.priority === "High").length}
            </p>

          </div>


          <div className="rounded-xl border border-border bg-surface/50 p-4">

            <p className="text-xs text-text-secondary">
              Estimated effort
            </p>

            <p className="mt-1 text-xl font-semibold text-text-primary">
              {formatEffort(totalEffort)}
            </p>

          </div>


          <div className="rounded-xl border border-border bg-surface/50 p-4">

            <p className="text-xs text-text-secondary">
              Task types
            </p>

            <p className="mt-1 text-xl font-semibold text-text-primary">
              {new Set(tasks.map((task) => task.type)).size}
            </p>

          </div>

        </div>

      </section>


      {/* Task List */}
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Generated work
            </p>

            <h2 className="mt-1 text-lg font-semibold text-text-primary">
              Tasks
            </h2>

          </div>

          <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>

        </div>


        <div className="mt-5 space-y-3">

          {tasks.map((task, index) => (

            <div
              key={task._id || task.id || index}
              className="rounded-xl border border-border bg-surface/30 p-5 transition hover:bg-surface/60"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-start gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </div>

                  <div className="min-w-0">

                    <h3 className="text-sm font-semibold text-text-primary">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                        {task.description}
                      </p>
                    )}

                  </div>

                </div>


                {task.priority && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      priorityClass[task.priority] ||
                      "bg-surface text-text-secondary"
                    }`}
                  >
                    {task.priority}
                  </span>
                )}

              </div>


              <div className="mt-4 flex flex-wrap items-center gap-2">

                {task.type && (
                  <span className="rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                    {task.type}
                  </span>
                )}


                {task.complexity && (
                  <span
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                      complexityClass[task.complexity] ||
                      "bg-surface text-text-secondary"
                    }`}
                  >
                    {task.complexity} complexity
                  </span>
                )}


                {task.estimatedEffortMinutes && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                    <Clock3 size={12} />
                    {formatEffort(task.estimatedEffortMinutes)}
                  </span>
                )}


                {task.tags?.map((tag, tagIndex) => (
                  <span
                    key={`${tag}-${tagIndex}`}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] text-text-secondary"
                  >
                    #{tag}
                  </span>
                ))}

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
};


export default TasksStep;