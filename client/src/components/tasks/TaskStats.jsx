import {
  ClipboardCheck,
  ListTodo,
  LoaderCircle,
  ClipboardList,
  CircleCheck,
  Clock3,
} from "lucide-react";

import StatsCard from "../dashboard/StatsCard";

function TaskStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatsCard
        icon={ClipboardCheck}
        iconClassName="bg-purple-50 text-primary"
        title="Total Tasks"
        value="124"
        description="Across all projects"
      />

      <StatsCard
        icon={ListTodo}
        iconClassName="bg-blue-50 text-info"
        title="To Do"
        value="28"
        description="22% of total"
      />

      <StatsCard
        icon={LoaderCircle}
        iconClassName="bg-orange-50 text-warning"
        title="In Progress"
        value="45"
        description="36% of total"
      />

      <StatsCard
        icon={ClipboardList}
        iconClassName="bg-purple-50 text-primary"
        title="In Review"
        value="32"
        description="26% of total"
      />

      <StatsCard
        icon={CircleCheck}
        iconClassName="bg-green-50 text-success"
        title="Completed"
        value="19"
        description="15% of total"
      />

      <StatsCard
        icon={Clock3}
        iconClassName="bg-red-50 text-danger"
        title="Overdue"
        value="5"
        description="Needs attention"
      />
    </div>
  );
}

export default TaskStats;