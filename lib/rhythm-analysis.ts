import { rhythmCopy } from "./copy";
import { getLocalDateString } from "./timezone";

export interface DailyLog {
  date: string;
  tasks_done: number;
  habits_completed: number;
  journaled: number; // 0 or 1
  mood: number; // 1 to 5
  focus_mins: number;
}

export interface PastWin {
  date: string;
  tasksDone: number;
  habitsCompleted: number;
  moodScore: number;
  summary: string;
}

export type MomentumState = "building" | "stable" | "drift" | "risk";

// Helper to aggregate raw data into 14 daily logs
export function aggregateDailyLogs(
  tasks: any[],
  habits: any[],
  journals: any[],
  moodLogs: any[],
  focusSessions: any[]
): DailyLog[] {
  const dailyMap: Record<string, DailyLog> = {};
  const todayStr = getLocalDateString();
  
  // Initialize last 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    dailyMap[dateStr] = {
      date: dateStr,
      tasks_done: 0,
      habits_completed: 0,
      journaled: 0,
      mood: 0,
      focus_mins: 0,
    };
  }

  // Aggregate completed tasks
  tasks.forEach((t) => {
    if (t.status === "completed" && t.completed_at) {
      const dateStr = t.completed_at.slice(0, 10);
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].tasks_done++;
      }
    }
  });

  // Aggregate habit logs
  habits.forEach((h) => {
    // In database, logs are related or habits have list of logs
    // Let's check habit_logs directly if passed, or habits completed_at dates
    if (h.completed_at) {
      const dateStr = h.completed_at.slice(0, 10);
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].habits_completed++;
      }
    }
  });

  // Aggregate journals
  journals.forEach((j) => {
    if (j.created_at) {
      const dateStr = j.created_at.slice(0, 10);
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].journaled = 1;
      }
    }
  });

  // Aggregate mood logs
  moodLogs.forEach((m) => {
    if (m.logged_at) {
      const dateStr = m.logged_at;
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].mood = m.mood_score || 0;
      }
    }
  });

  // Aggregate focus sessions
  focusSessions.forEach((s) => {
    if (s.started_at) {
      const dateStr = s.started_at.slice(0, 10);
      if (dailyMap[dateStr]) {
        const duration = s.actual_duration || s.planned_duration || 0;
        dailyMap[dateStr].focus_mins += Math.round(duration / 60);
      }
    }
  });

  return Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
}

// Calculate the momentum state
export function calculateMomentumState(logs: DailyLog[]): {
  state: MomentumState;
  streak: number;
  text: string;
  pastWin: PastWin | null;
} {
  const todayStr = getLocalDateString();
  
  // Count consecutive active days backward from today/yesterday
  let streak = 0;
  let checkDate = new Date();
  
  // Helper to check if a day was active
  const isDayActive = (dateString: string) => {
    const log = logs.find((l) => l.date === dateString);
    if (!log) return false;
    return log.tasks_done > 0 || log.habits_completed > 0 || log.journaled > 0 || log.focus_mins > 0;
  };

  const todayActive = isDayActive(todayStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const yesterdayActive = isDayActive(yesterdayStr);

  if (todayActive) {
    streak = 1;
    let tempDate = new Date();
    while (true) {
      tempDate.setDate(tempDate.getDate() - 1);
      const tempStr = tempDate.toISOString().split("T")[0];
      if (isDayActive(tempStr)) {
        streak++;
      } else {
        break;
      }
    }
  } else if (yesterdayActive) {
    streak = 1;
    let tempDate = new Date(yesterday);
    while (true) {
      tempDate.setDate(tempDate.getDate() - 1);
      const tempStr = tempDate.toISOString().split("T")[0];
      if (isDayActive(tempStr)) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Count active days in the last 7 days
  let activeDaysInLast7 = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (isDayActive(d.toISOString().split("T")[0])) {
      activeDaysInLast7++;
    }
  }

  // Determine state
  let state: MomentumState = "stable";
  if (streak >= 3) {
    state = "building";
  } else if (streak >= 1 || activeDaysInLast7 >= 4) {
    state = "stable";
  } else if (activeDaysInLast7 >= 1) {
    state = "drift";
  } else {
    state = "risk";
  }

  // Centralized copy mapping
  const text = rhythmCopy.momentum[state];

  // Find a past win: a day with high activity (max score)
  let pastWin: PastWin | null = null;
  let bestScore = 0;
  let bestDay: DailyLog | null = null;

  logs.forEach((log) => {
    // Skip today to find a genuine past day
    if (log.date === todayStr) return;
    
    // Score formula: tasks count * 2 + habits count + (mood >= 4 ? 2 : 0)
    const score = log.tasks_done * 2 + log.habits_completed + (log.mood >= 4 ? 2 : 0);
    if (score > bestScore) {
      bestScore = score;
      bestDay = log;
    }
  });

  if (bestDay) {
    const d = new Date((bestDay as DailyLog).date + "T00:00:00");
    const dateFormatted = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    const details: string[] = [];
    if ((bestDay as DailyLog).tasks_done > 0) details.push(`${(bestDay as DailyLog).tasks_done} tasks completed`);
    if ((bestDay as DailyLog).habits_completed > 0) details.push(`${(bestDay as DailyLog).habits_completed} habits logged`);
    if ((bestDay as DailyLog).mood > 0) details.push(`feeling ${getMoodLabel((bestDay as DailyLog).mood)}`);

    pastWin = {
      date: (bestDay as DailyLog).date,
      tasksDone: (bestDay as DailyLog).tasks_done,
      habitsCompleted: (bestDay as DailyLog).habits_completed,
      moodScore: (bestDay as DailyLog).mood,
      summary: `On ${dateFormatted}, you had a strong day with ${details.join(", ")}.`,
    };
  }

  return { state, streak, text, pastWin };
}

function getMoodLabel(score: number): string {
  if (score >= 4.5) return "Excellent";
  if (score >= 4) return "Bright";
  if (score >= 3.5) return "Grounded";
  if (score >= 3) return "Steady";
  if (score >= 2.5) return "Uneasy";
  if (score >= 2) return "Heavy";
  return "Drained";
}

// Pearson Correlation Math
function calculatePearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    num += diffX * diffY;
    denX += diffX * diffX;
    denY += diffY * diffY;
  }
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}

// Point-Biserial Correlation Math (binary vs continuous)
function calculatePointBiserial(binary: number[], continuous: number[]): number {
  const n = binary.length;
  if (n === 0) return 0;
  
  const group1 = continuous.filter((_, i) => binary[i] === 1);
  const group0 = continuous.filter((_, i) => binary[i] === 0);
  
  const n1 = group1.length;
  const n0 = group0.length;
  
  if (n1 === 0 || n0 === 0) return 0;
  
  const mean1 = group1.reduce((a, b) => a + b, 0) / n1;
  const mean0 = group0.reduce((a, b) => a + b, 0) / n0;
  
  const meanTotal = continuous.reduce((a, b) => a + b, 0) / n;
  const stdDevTotal = Math.sqrt(continuous.map(val => Math.pow(val - meanTotal, 2)).reduce((a, b) => a + b, 0) / n);
  
  if (stdDevTotal === 0) return 0;
  
  return ((mean1 - mean0) / stdDevTotal) * Math.sqrt((n1 * n0) / (n * n));
}

// Calculate the Rhythm Story narrative correlation
export function calculateRhythmStory(logs: DailyLog[]): {
  headline: string;
  story: string;
} {
  // We need at least 5 days with any activity to extract patterns, otherwise fall back to onboarding placeholder
  const activeDays = logs.filter(l => l.tasks_done > 0 || l.habits_completed > 0 || l.journaled > 0 || l.focus_mins > 0);
  if (activeDays.length < 5) {
    return {
      headline: "Writing Your Story",
      story: rhythmCopy.insights.defaultInsight
    };
  }

  // Extract arrays
  const journaled = logs.map(l => l.journaled);
  const tasksDone = logs.map(l => l.tasks_done);
  const mood = logs.map(l => l.mood);
  const focusMins = logs.map(l => l.focus_mins);

  // Compute coefficients
  const correlations = [
    {
      name: "journal_focus",
      coefficient: calculatePointBiserial(journaled, focusMins),
      story: rhythmCopy.insights.journalingAnchor,
      headline: "Journaling & Focus"
    },
    {
      name: "journal_tasks",
      coefficient: calculatePointBiserial(journaled, tasksDone),
      story: rhythmCopy.insights.journalingAnchor,
      headline: "Reflections & Actions"
    },
    {
      name: "mood_tasks",
      coefficient: calculatePearson(mood, tasksDone),
      story: rhythmCopy.insights.moodTasks,
      headline: "Mood & Execution"
    },
    {
      name: "tasks_mood",
      coefficient: calculatePearson(tasksDone, mood),
      story: rhythmCopy.insights.moodTasksLift,
      headline: "Action & Outlook"
    },
    {
      name: "mood_focus",
      coefficient: calculatePearson(mood, focusMins),
      story: rhythmCopy.insights.generalSteady,
      headline: "Grounded Mind, Focused Work"
    }
  ];

  // Filter out weak correlations (< 0.25 for client-side sample sizes)
  const strongCorrelations = correlations
    .filter(c => Math.abs(c.coefficient) >= 0.25)
    .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient));

  if (strongCorrelations.length > 0) {
    return {
      headline: strongCorrelations[0].headline,
      story: strongCorrelations[0].story
    };
  }

  return {
    headline: "Steady Ground",
    story: rhythmCopy.insights.defaultInsight
  };
}
