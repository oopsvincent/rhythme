// app/tasks/page.tsx
import { getTasks, getTaskStats } from "@/app/actions/getTasks";
import TaskForm from "@/components/task-form";
import { SiteHeader } from "@/components/site-header";
import TaskList from "@/components/task-list";
import { TaskStatsGrid } from "@/components/task-stats";

export default async function TasksPage() {
  // Fetch data directly in Server Component
  const [tasksResult, statsResult] = await Promise.all([
    getTasks(),
    getTaskStats(),
  ]);

  // Handle errors
  if (tasksResult.error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Error: {tasksResult.error}
        </div>
      </div>
    );
  }

  if (statsResult.error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Error: {statsResult.error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-5">
      <SiteHeader />
      <div className="flex flex-col gap-6 py-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and organize your tasks efficiently
          </p>
        </div>

        {/* Stats Section */}
        <TaskStatsGrid stats={statsResult.data ?? { total: 0, pending: 0, in_progress: 0, completed: 0 }} />

        {/* Add New Task Button - Now after stats */}
        <TaskForm />

        {/* Task List */}
        <TaskList tasks={tasksResult.data} />
      </div>
    </div>
  );
}
