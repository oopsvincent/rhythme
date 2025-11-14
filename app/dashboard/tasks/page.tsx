// app/tasks/page.tsx
import { getTasks, getTaskStats } from "@/app/actions/getTasks";
import TaskList from "@/components/task-list";
import TaskForm from "@/components/task-form";
import { SiteHeader } from "@/components/site-header";

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
    <div className="container mx-auto px-5">
        <SiteHeader />
      <div className="flex flex-col justify-between gap-4 py-5">
        <div>
          <h1 className="text-2xl md:text-3xl">Tasks</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and organize your tasks efficiently
          </p>
        </div>
        {/* <h1 className="text-3xl font-bold mb-8">My Tasks</h1> */}

        {/* Form to create new task */}
        <TaskForm />
        {/* Stats Section */}
        <div className="flex justify-center flex-wrap gap-4 mb-8 mt-5 [&>*]:w-[40%] lg:[&>*]:w-[23%]">
          <div className="bg-primary p-4 rounded-lg shadow">
            <p className="">Total</p>
            <p className="text-2xl font-bold">{statsResult.data?.total ?? 0}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-gray-600">To Do</p>
            <p className="text-2xl font-bold text-blue-600">
              {statsResult.data?.todo ?? 0}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">
              {statsResult.data?.in_progress ?? 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {statsResult.data?.completed ?? 0}
            </p>
          </div>
        </div>

        {/* Task List */}
        <TaskList initialTasks={tasksResult?.data ?? []} />
      </div>
    </div>
  );
}
