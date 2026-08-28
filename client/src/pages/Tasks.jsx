import { useState } from "react";

import Header from "../components/layout/Header";
import { Plus, ChevronDown } from "lucide-react";
import TaskStats from "../components/tasks/TaskStats";
import TaskToolbar from "../components/tasks/TaskToolbar";
import TaskList from "../components/tasks/TaskList";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";
import { tasks } from "../data/tasks";

function Tasks() {
  const [selectedTask, setSelectedTask] = useState(tasks[0]);

  return (
    <div className="space-y-6 px-8">
      <Header
        title="Tasks"
        description="Track, manage and execute all engineering tasks across projects."
      />

      {/* New Task */}
      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <Plus size={17} strokeWidth={2.5} />
          New Task
          <ChevronDown size={15} />
        </button>
      </div>

      <TaskStats />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="min-w-0">
            <TaskToolbar />
            <TaskList 
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
            />
        </div>

        <div className="hidden xl:block">
            <TaskDetailsPanel task={selectedTask}/>
        </div>
        </div>
    </div>
  );
}

export default Tasks;