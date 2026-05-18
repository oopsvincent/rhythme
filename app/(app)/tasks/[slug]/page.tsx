// app/dashboard/tasks/[slug]/page.tsx
import { TaskDetailClient } from "./task-detail-client";

interface TaskPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TaskSlugPage({ params }: TaskPageProps) {
  const { slug } = await params;
  // Extract task ID from slug (handles both "task-id" format and plain ID)
  const taskId = slug.includes("-") ? slug.split("-").pop()! : slug;

  return <TaskDetailClient taskId={taskId} />;
}