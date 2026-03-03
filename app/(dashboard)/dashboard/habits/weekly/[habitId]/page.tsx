import { notFound } from "next/navigation";
import { WeeklyHabitDetailClient } from "./weekly-habit-detail-client";
import { getHabit, getHabitStats } from "@/app/actions/habits";

interface WeeklyHabitDetailPageProps {
  params: Promise<{ habitId: string }>;
}

export default async function WeeklyHabitDetailPage({
  params,
}: WeeklyHabitDetailPageProps) {
  const { habitId: slug } = await params;

  // Extract ID from slug (e.g., "meal-prep-42" -> "42")
  const idFromSlug = slug.split("-").pop();
  const habitIdNum = parseInt(idFromSlug || "", 10);

  if (isNaN(habitIdNum)) {
    notFound();
  }

  // Fetch habit and stats in parallel
  const [habitResult, statsResult] = await Promise.all([
    getHabit(habitIdNum),
    getHabitStats(habitIdNum),
  ]);

  if (habitResult.error || !habitResult.data) {
    notFound();
  }

  // Ensure this is a weekly habit
  if (habitResult.data.frequency !== "weekly") {
    notFound();
  }

  return (
    <WeeklyHabitDetailClient
      initialHabit={habitResult.data}
      initialStats={statsResult.data || null}
    />
  );
}
