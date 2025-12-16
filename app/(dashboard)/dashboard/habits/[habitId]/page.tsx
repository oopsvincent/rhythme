import { notFound } from "next/navigation";
import { HabitDetailClient } from "./habit-detail-client";
import { getHabit, getHabitStats } from "@/app/actions/habits";

interface HabitDetailPageProps {
  params: Promise<{ habitId: string }>;
}

export default async function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { habitId: slug } = await params;
  
  // Extract ID from slug (e.g., "morning-exercise-123" -> "123")
  const idFromSlug = slug.split("-").pop();
  const habitIdNum = parseInt(idFromSlug || "", 10);

  if (isNaN(habitIdNum)) {
    notFound();
  }

  const [habitResult, statsResult] = await Promise.all([
    getHabit(habitIdNum),
    getHabitStats(habitIdNum),
  ]);

  if (habitResult.error || !habitResult.data) {
    notFound();
  }

  return (
    <HabitDetailClient
      initialHabit={habitResult.data}
      initialStats={statsResult.data || null}
    />
  );
}

