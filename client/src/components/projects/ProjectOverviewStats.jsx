import {
  CalendarDays,
  ClipboardList,
  Users,
} from "lucide-react";
import Avatar from "../../utils/Avatar";

function ProjectOverviewStats({ project }) {

  // for progress ring

  const tasks = project?.tasks;
  const total = tasks?.length || 0;

  const completedTasks = tasks?.filter(task => task.status === "Done");
  const inProgressTasks = tasks?.filter(task => task.status === "In Progress");
  const todoTasks = tasks?.filter(task => task.status === "Todo");

  const completed = total ? (completedTasks?.length / total) * 100 : 0;
  const inProgress = total ? (inProgressTasks?.length / total) * 100 : 0;
  const todo = total ? (todoTasks?.length / total) * 100 : 0;
  
  const completedEnd = completed;
  const inProgressEnd = completed + inProgress;
  const todoEnd = inProgress + todo;

  const progress = ((completedTasks?.length) / total) * 100 || 0;

  // team members display
  let team = project?.team.map(member => member.userId);

  console.log(team)

  let extraMembers = 0;
  if(project?.team?.length > 3) {
    team = team.slice(0, 3);
    extraMembers = project.team.length - 3;
  }


  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* Progress */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-text-primary">
            Progress
          </p>
        </div>

        <div className="mt-3 flex items-center gap-5">
          {/* Donut */}
          <div
            className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
            style={{
               background: `conic-gradient(
                #10b981 0% ${completedEnd}%,
                #3b82f6 ${completedEnd}% ${inProgressEnd}%,
                #f97316 ${inProgressEnd}% ${todoEnd}%,
                #f2f2f6 ${todoEnd}% 100%
              )`,
            }}
          >
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white">
              <span className="text-lg font-bold text-text-primary">
                {progress}%
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-8 text-sm">
              <span className="flex items-center gap-2 text-text-secondary">
                <span className="h-2 w-2 rounded-full bg-success" />
                Done
              </span>
              <span className="font-semibold text-text-primary">{completedTasks?.length}</span>
            </div>

            <div className="flex items-center justify-between gap-8 text-sm">
              <span className="flex items-center gap-2 text-text-secondary">
                <span className="h-2 w-2 rounded-full bg-info" />
                In Progress
              </span>
              <span className="font-semibold text-text-primary">{inProgressTasks?.length}</span>
            </div>

            <div className="flex items-center justify-between gap-8 text-sm">
              <span className="flex items-center gap-2 text-text-secondary">
                <span className="h-2 w-2 rounded-full bg-gray-400" />
                To Do
              </span>
              <span className="font-semibold text-text-primary">{todoTasks?.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-text-primary">
              Tasks
            </p>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-text-primary">
                {total}
              </span>
            </div>

            <p className="mt-1 text-xs text-text-secondary">
              Total Tasks
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
            <ClipboardList size={20} strokeWidth={1.8} />
          </div>
        </div>

        <button
          type="button"
          className="mt-6 text-xs font-semibold text-primary transition hover:text-primary-dark"
        >
          View Tasks →
        </button>
      </div>

      {/* Team */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-text-primary">
              Team
            </p>

            <p className="mt-3 text-2xl font-bold text-text-primary">
              {project?.team?.length}
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Members
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-success">
            <Users size={20} strokeWidth={1.8} />
          </div>
        </div>

        <div className="mt-4 flex items-center">
          {team?.map((member, index) => (
            <div
              key={member._id}
              className={`-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold first:ml-0 ${
                index === 0
                  ? "bg-purple-100 text-primary"
                  : index === 1
                    ? "bg-blue-100 text-info"
                    : "bg-orange-100 text-warning"
              }`}
            >
              <Avatar user={member}/>
            </div>
          ))}

          {extraMembers > 0 && (
            <span className="ml-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-surface px-2 text-xs font-semibold text-text-secondary">
               +{extraMembers}
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-text-primary">
              Timeline
            </p>

            <div className="mt-4">
              <p className="text-xs text-text-secondary">
                Start Date
              </p>

              <p className="mt-1 text-sm font-semibold text-text-primary">
                {project?.startDate ? new Date(project.startDate).toLocaleDateString() : ""}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xs text-text-secondary">
                Target Date
              </p>

              <p className="mt-1 text-sm font-semibold text-text-primary">
                {project?.targetDate ? new Date(project.targetDate).toLocaleDateString() : ""}
              </p>
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-info">
            <CalendarDays size={20} strokeWidth={1.8} />
          </div>
        </div>
      </div>

    </section>
  );
}

export default ProjectOverviewStats;
