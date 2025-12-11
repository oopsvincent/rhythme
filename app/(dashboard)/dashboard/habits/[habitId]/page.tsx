import { notFound } from "next/navigation";
import { HabitDetailClient } from "./habit-detail-client";
import { getHabit, getHabitStats } from "@/app/actions/habits";

interface HabitDetailPageProps {
  params: Promise<{ habitId: string }>;
}

export default async function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { habitId } = await params;
  const habitIdNum = parseInt(habitId, 10);

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
