import {
  ClipboardCheck,
  ListTodo,
  LoaderCircle,
  CircleCheck,
  Clock3,
} from "lucide-react";

import StatsCard from "../dashboard/StatsCard";

function TaskStats({ tasks }) {
  const todoTasks = tasks.filter(task => task.status === "Todo");
  const inProgressTasks = tasks.filter(task => task.status === "In Progress");
  const completedTasks = tasks.filter(task => task.status === "Done");
  const overdueTasks = tasks.filter(task => task.dueDate < new Date());
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatsCard
        icon={ClipboardCheck}
        iconClassName="bg-purple-50 text-primary"
        title="Total Tasks"
        value={tasks.length}
        description="Across all projects"
      />

      <StatsCard
        icon={ListTodo}
        iconClassName="bg-blue-50 text-info"
        title="To Do"
        value={todoTasks.length}
        description={`${Math.round(todoTasks.length/tasks.length * 100)}% of total`}
      />

      <StatsCard
        icon={LoaderCircle}
        iconClassName="bg-orange-50 text-warning"
        title="In Progress"
        value={inProgressTasks.length}
        description={`${Math.round(inProgressTasks.length/tasks.length * 100)}% of total`}
      />

      <StatsCard
        icon={CircleCheck}
        iconClassName="bg-green-50 text-success"
        title="Completed"
        value={completedTasks.length}
        description={`${Math.round(completedTasks.length/tasks.length * 100)}% of total`}
      />

      <StatsCard
        icon={Clock3}
        iconClassName="bg-red-50 text-danger"
        title="Overdue"
        value={overdueTasks.length}
        description="Needs attention"
      />
    </div>
  );
}

export default TaskStats;