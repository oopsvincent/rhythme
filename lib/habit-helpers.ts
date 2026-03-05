/**
 * Shared habit frequency utilities used by both server actions and client components.
 * 
 * Frequency mapping (ML model dependency — DO NOT CHANGE):
 *   0 = Daily
 *   1 = Weekly
 *   2 = Monthly
 *   3 = Multiple times per week
 */

export type HabitFrequency = 0 | 1 | 2 | 3;

export const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
  0: "Daily",
  1: "Weekly",
  2: "Monthly",
  3: "Multiple per week",
};

/**
 * Human-readable frequency label
 */
export function getFrequencyLabel(freq: HabitFrequency): string {
  return FREQUENCY_LABELS[freq] ?? "Daily";
}

/**
 * Label for the target_count input field in the config UI
 */
export function getTargetLabel(freq: HabitFrequency): string {
  switch (freq) {
    case 0:
      return "Target per day";
    case 1:
      return "Target completions per week";
    case 2:
      return "Target completions per month";
    case 3:
      return "Completions per week";
    default:
      return "Target per day";
  }
}

/**
 * Period label for progress display: "today", "this week", "this month"
 */
export function getPeriodLabel(freq: HabitFrequency): string {
  switch (freq) {
    case 0:
      return "today";
    case 1:
    case 3:
      return "this week";
    case 2:
      return "this month";
    default:
      return "today";
  }
}

/**
 * Streak unit for display: "day", "week", "month"
 */
export function getStreakUnit(freq: HabitFrequency): string {
  switch (freq) {
    case 0:
      return "day";
    case 1:
    case 3:
      return "week";
    case 2:
      return "month";
    default:
      return "day";
  }
}

/**
 * Get the current period boundaries (UTC) for a given frequency.
 * Returns ISO strings suitable for Supabase range queries.
 */
export function getPeriodBounds(freq: HabitFrequency): { start: string; end: string } {
  const now = new Date();

  switch (freq) {
    case 0: {
      // Daily: today 00:00 to 23:59:59.999 UTC
      const dayStr = now.toISOString().split("T")[0];
      return {
        start: `${dayStr}T00:00:00.000Z`,
        end: `${dayStr}T23:59:59.999Z`,
      };
    }
    case 1:
    case 3: {
      // Weekly: Monday 00:00 to Sunday 23:59:59.999 UTC
      const day = now.getUTCDay(); // 0=Sun, 1=Mon...
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday));
      const sunday = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 6, 23, 59, 59, 999));
      return {
        start: monday.toISOString(),
        end: sunday.toISOString(),
      };
    }
    case 2: {
      // Monthly: 1st of month to last day of month UTC
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
      return {
        start: monthStart.toISOString(),
        end: monthEnd.toISOString(),
      };
    }
    default:
      return getPeriodBounds(0);
  }
}

// ============ Streak Calculation ============

/**
 * UTC-safe subtract one day
 */
function subtractOneDayUTC(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().split("T")[0];
}

/**
 * Get ISO week key (e.g. "2026-W10") for a date string
 */
function getISOWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/**
 * Get ISO month key (e.g. "2026-03") for a date string
 */
function getISOMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/**
 * Compute a daily streak: consecutive days with >= targetCount completions.
 * dateStrs must be unique date strings in descending order.
 * dateCounts maps each date string to its completion count.
 */
function computeDailyStreak(dateStrs: string[], dateCounts: Map<string, number>, targetCount: number): number {
  if (dateStrs.length === 0) return 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  const latest = dateStrs[0];
  if (latest !== today && latest !== yesterday) return 0;

  let streak = 0;
  let expected = latest;

  for (const date of dateStrs) {
    if (date === expected && (dateCounts.get(date) ?? 0) >= targetCount) {
      streak++;
      expected = subtractOneDayUTC(expected);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Compute a weekly streak: consecutive weeks with >= targetCount completions.
 * dateStrs should be completion date strings in descending order.
 */
function computeWeeklyStreak(dateStrs: string[], targetCount: number): number {
  if (dateStrs.length === 0) return 0;

  // Count completions per week
  const weekCounts = new Map<string, number>();
  for (const d of dateStrs) {
    const wk = getISOWeekKey(d);
    weekCounts.set(wk, (weekCounts.get(wk) ?? 0) + 1);
  }

  // Get unique week keys that meet the target, sorted descending
  const qualifiedWeeks = [...weekCounts.entries()]
    .filter(([, count]) => count >= targetCount)
    .map(([wk]) => wk)
    .sort((a, b) => b.localeCompare(a));

  if (qualifiedWeeks.length === 0) return 0;

  const currentWeekKey = getISOWeekKey(new Date().toISOString());
  const now = new Date();
  const lastWeekDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7));
  const lastWeekKey = getISOWeekKey(lastWeekDate.toISOString());

  const latest = qualifiedWeeks[0];
  if (latest !== currentWeekKey && latest !== lastWeekKey) return 0;

  let streak = 0;
  let expectedWeek = latest;

  for (const week of qualifiedWeeks) {
    if (week === expectedWeek) {
      streak++;
      const parts = expectedWeek.split("-W");
      const year = parseInt(parts[0]);
      const wk = parseInt(parts[1]);
      if (wk === 1) {
        const dec28 = new Date(Date.UTC(year - 1, 11, 28));
        expectedWeek = getISOWeekKey(dec28.toISOString());
      } else {
        expectedWeek = `${year}-W${String(wk - 1).padStart(2, "0")}`;
      }
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Compute a monthly streak: consecutive months with >= targetCount completions.
 * dateStrs should be completion date strings in descending order.
 */
function computeMonthlyStreak(dateStrs: string[], targetCount: number): number {
  if (dateStrs.length === 0) return 0;

  // Count completions per month
  const monthCounts = new Map<string, number>();
  for (const d of dateStrs) {
    const mk = getISOMonthKey(d);
    monthCounts.set(mk, (monthCounts.get(mk) ?? 0) + 1);
  }

  const qualifiedMonths = [...monthCounts.entries()]
    .filter(([, count]) => count >= targetCount)
    .map(([mk]) => mk)
    .sort((a, b) => b.localeCompare(a));

  if (qualifiedMonths.length === 0) return 0;

  const currentMonthKey = getISOMonthKey(new Date().toISOString());
  const lastMonthDate = new Date();
  lastMonthDate.setUTCMonth(lastMonthDate.getUTCMonth() - 1);
  const lastMonthKey = getISOMonthKey(lastMonthDate.toISOString());

  const latest = qualifiedMonths[0];
  if (latest !== currentMonthKey && latest !== lastMonthKey) return 0;

  let streak = 0;
  let expectedMonth = latest;

  for (const month of qualifiedMonths) {
    if (month === expectedMonth) {
      streak++;
      const [year, mon] = expectedMonth.split("-").map(Number);
      if (mon === 1) {
        expectedMonth = `${year - 1}-12`;
      } else {
        expectedMonth = `${year}-${String(mon - 1).padStart(2, "0")}`;
      }
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Unified streak computation for all frequency types.
 * 
 * @param freq - habit frequency (0=daily, 1=weekly, 2=monthly, 3=multiple-per-week)
 * @param targetCount - required completions per period
 * @param completionDates - array of ISO date strings (completion timestamps), unsorted ok
 * @returns current streak count
 */
export function computeUnifiedStreak(
  freq: HabitFrequency,
  targetCount: number,
  completionDates: string[],
): number {
  if (completionDates.length === 0) return 0;

  // Extract just the date part and sort descending
  const dateStrs = completionDates.map((d) => d.split("T")[0]);
  const sortedDesc = [...dateStrs].sort((a, b) => b.localeCompare(a));

  switch (freq) {
    case 0: {
      // Daily: need targetCount completions each day
      const dateCounts = new Map<string, number>();
      for (const d of dateStrs) {
        dateCounts.set(d, (dateCounts.get(d) ?? 0) + 1);
      }
      const uniqueDatesDesc = [...new Set(sortedDesc)];
      return computeDailyStreak(uniqueDatesDesc, dateCounts, targetCount);
    }
    case 1:
    case 3:
      // Weekly / multiple-per-week: need targetCount completions each week
      return computeWeeklyStreak(sortedDesc, targetCount);
    case 2:
      // Monthly: need targetCount completions each month
      return computeMonthlyStreak(sortedDesc, targetCount);
    default:
      return 0;
  }
}
