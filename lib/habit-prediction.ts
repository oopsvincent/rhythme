import type {
  Habit,
  HabitLog,
  HabitPredictionInput,
  HabitPrediction,
  CachedHabitPrediction,
} from "@/types/database";

// ML Prediction Service Configuration
const ML_ENDPOINT = `${process.env.NEXT_PUBLIC_HABIT_PREDICTOR_URL}/o1/predict`;
const CACHE_KEY_PREFIX = "habit_prediction_";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MIN_DAYS_FOR_PREDICTION = 7;

// === Helper Functions ===

function daysSince(date: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function filterLogsByDays(logs: HabitLog[], days: number): HabitLog[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logs.filter((log) => new Date(log.completed_at) >= cutoffDate);
}

function getExpectedCompletions(frequency: string, days: number): number {
  switch (frequency) {
    case "daily":
      return days;
    case "weekly":
      return Math.ceil(days / 7);
    case "monthly":
      return Math.ceil(days / 30);
    default:
      return days;
  }
}

function encodeFrequency(frequency: string): number {
  switch (frequency) {
    case "daily":
      return 0;
    case "weekly":
      return 1;
    case "monthly":
      return 2;
    default:
      return 0;
  }
}

// === Cache Management ===

function getCacheKey(habitId: number): string {
  return `${CACHE_KEY_PREFIX}${habitId}`;
}

function getFromCache(habitId: number): CachedHabitPrediction | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(getCacheKey(habitId));
    if (!cached) return null;
    return JSON.parse(cached) as CachedHabitPrediction;
  } catch {
    return null;
  }
}

function saveToCache(habitId: number, prediction: HabitPrediction): void {
  if (typeof window === "undefined") return;

  try {
    const cached: CachedHabitPrediction = {
      prediction,
      timestamp: Date.now(),
    };
    localStorage.setItem(getCacheKey(habitId), JSON.stringify(cached));
  } catch {
    // Ignore cache errors
  }
}

function isCacheExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_TTL_MS;
}

function clearPredictionCache(habitId: number): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(getCacheKey(habitId));
  } catch {
    // Ignore cache errors
  }
}

// === Core Prediction Functions ===

/**
 * Check if a habit is old enough to use ML predictions
 */
export function canUsePrediction(habit: Habit): boolean {
  const daysOld = daysSince(new Date(habit.created_at));
  return daysOld >= MIN_DAYS_FOR_PREDICTION;
}

/**
 * Get the number of days remaining until predictions are available
 */
export function getDaysUntilPrediction(habit: Habit): number {
  const daysOld = daysSince(new Date(habit.created_at));
  return Math.max(0, MIN_DAYS_FOR_PREDICTION - daysOld);
}

/**
 * Calculate the prediction input from habit data
 */
export function calculatePredictionInput(
  habit: Habit,
  logs: HabitLog[]
): HabitPredictionInput {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  const isWeekend = dayOfWeek >= 5 ? 1 : 0;

  // Calculate completion rates
  const logs7d = filterLogsByDays(logs, 7);
  const logs30d = filterLogsByDays(logs, 30);

  const expectedCompletions7d = getExpectedCompletions(habit.frequency, 7);
  const expectedCompletions30d = getExpectedCompletions(habit.frequency, 30);

  return {
    completion_rate_7d: Math.min(
      logs7d.length / Math.max(expectedCompletions7d, 1),
      1
    ),
    completion_rate_30d: Math.min(
      logs30d.length / Math.max(expectedCompletions30d, 1),
      1
    ),
    current_streak: habit.streak_count,
    day_of_week: dayOfWeek,
    days_since_start: daysSince(new Date(habit.created_at)),
    frequency_encoded: encodeFrequency(habit.frequency),
    is_weekend: isWeekend,
  };
}

/**
 * Fetch prediction from ML model API
 */
async function fetchPrediction(
  input: HabitPredictionInput
): Promise<HabitPrediction> {
  const response = await fetch(ML_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Prediction service unavailable");
  }

  return response.json();
}

/**
 * Get cached prediction or fetch a new one (with 24h cache)
 */
export async function getCachedPrediction(
  habitId: number,
  habit: Habit,
  logs: HabitLog[]
): Promise<HabitPrediction | null> {
  // Check minimum age requirement
  if (!canUsePrediction(habit)) {
    return null;
  }

  // Check cache first
  const cached = getFromCache(habitId);
  if (cached && !isCacheExpired(cached.timestamp)) {
    console.log("[HabitPrediction] Using cached prediction for habit:", habitId);
    return cached.prediction;
  }

  try {
    // Calculate input and fetch new prediction
    const input = calculatePredictionInput(habit, logs);
    console.log("[HabitPrediction] Fetching prediction from:", ML_ENDPOINT);
    console.log("[HabitPrediction] Request payload:", JSON.stringify(input, null, 2));
    
    const prediction = await fetchPrediction(input);
    console.log("[HabitPrediction] Response:", prediction);

    // Store in cache
    saveToCache(habitId, prediction);

    return prediction;
  } catch (error) {
    console.error("[HabitPrediction] Failed to fetch prediction:");
    console.error("[HabitPrediction] Endpoint:", ML_ENDPOINT);
    console.error("[HabitPrediction] Error:", error);
    if (error instanceof Error) {
      console.error("[HabitPrediction] Error message:", error.message);
      console.error("[HabitPrediction] Error stack:", error.stack);
    }
    // Return cached prediction if available, even if expired
    return cached?.prediction || null;
  }
}

/**
 * Force refresh prediction (bypass cache)
 */
export async function refreshPrediction(
  habitId: number,
  habit: Habit,
  logs: HabitLog[]
): Promise<HabitPrediction | null> {
  if (!canUsePrediction(habit)) {
    return null;
  }

  // Clear existing cache
  clearPredictionCache(habitId);

  try {
    const input = calculatePredictionInput(habit, logs);
    const prediction = await fetchPrediction(input);
    saveToCache(habitId, prediction);
    return prediction;
  } catch (error) {
    console.error("Failed to refresh prediction:", error);
    return null;
  }
}

/**
 * Get predictions for multiple habits (batch operation)
 */
export async function getBatchPredictions(
  habits: Array<{ habit: Habit; logs: HabitLog[] }>
): Promise<Map<number, HabitPrediction | null>> {
  const predictions = new Map<number, HabitPrediction | null>();

  await Promise.all(
    habits.map(async ({ habit, logs }) => {
      const prediction = await getCachedPrediction(habit.habit_id, habit, logs);
      predictions.set(habit.habit_id, prediction);
    })
  );

  return predictions;
}
