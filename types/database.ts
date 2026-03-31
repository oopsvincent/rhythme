// app/types/database.ts
export type Priority = 'low' | 'medium' | 'high'
export type Status = 'pending' | 'in_progress' | 'completed'

export interface Task {
  task_id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: Priority
  status: Status
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  due_date?: Date | undefined
  priority?: Priority
  status?: Status
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  due_date?: string | null
  priority?: Priority
  status?: Status
  completed_at?: string | null
}

// Habits
// Frequency mapping (ML model dependency — DO NOT CHANGE):
//   0 = Daily, 1 = Weekly, 2 = Monthly, 3 = Multiple times per week
export type HabitFrequency = 0 | 1 | 2 | 3

// Matches the `habits` table
export interface Habit {
  habit_id: number
  user_id: string
  name: string
  description: string | null
  frequency: HabitFrequency
  frequency_num: HabitFrequency
  target_count: number
  streak_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Matches the `habit_logs` table
export interface HabitLog {
  habit_log_id: number
  habit_id: number
  user_id: string
  completed_at: string
  note: string | null
}

// Input types for habit CRUD operations
export interface CreateHabitInput {
  name: string
  description?: string
  frequency?: HabitFrequency
  target_count?: number
}

export interface UpdateHabitInput {
  name?: string
  description?: string | null
  frequency?: HabitFrequency
  target_count?: number
  is_active?: boolean
}

// ML Prediction types
export interface HabitPredictionInput {
  completion_rate_30d: number  // 0.0 - 1.0
  completion_rate_7d: number   // 0.0 - 1.0
  current_streak: number
  day_of_week: number          // 0-6 (Monday=0)
  days_since_start: number
  frequency_encoded: number    // 0=daily, 1=weekly, 2=monthly, 3=multiple_per_week
  is_weekend: number           // 0 or 1
}

export interface HabitPrediction {
  prediction: "Complete" | "Skip"  // ML model's classification
  probability: number              // 0.0 - 1.0
  probability_percent: string      // e.g., "49.9%"
  message: string                  // Human-readable message
}

// Cached prediction with timestamp
export interface CachedHabitPrediction {
  prediction: HabitPrediction
  timestamp: number
}

// Extended habit with computed stats for UI
export interface HabitWithStats extends Habit {
  completedToday: boolean       // Keep for backward compat (daily habits)
  completedThisWeek: boolean    // Keep for backward compat (weekly habits)
  isCompletedForPeriod: boolean // Unified: completions >= target_count for current period
  periodCompletions: number     // Number of completions in the current period
  periodTarget: number          // target_count for the habit
  periodLabel: string           // "today" | "this week" | "this month"
  completionLogs: HabitLog[]
  current_streak: number        // Computed from logs, most accurate
  prediction?: HabitPrediction | null
  daysUntilPrediction?: number  // Days remaining until AI predictions are available
}

// Journals 

export interface JournalMoodTags {
  mood: MoodTags;
  sentiment?: string;    // e.g. "neutral", "positive", "negative"
  emotions?: string[];   // e.g. ["neutral", "joy"]
  model_used?: string;   // e.g. "roberta"
  analyzed_at?: string;  // ISO timestamp from ML service
}

export interface Journal {
  journal_id: string;
  user_id: string;
  title: string;
  content: string; // Stores plaintext OR encrypted base64 content
  created_at: string;
  updated_at: string;
  sentiment_score?: number; // 0-100, derived from ML confidence
  mood_tags?: JournalMoodTags;
  iv?: string | null; // Base64 IV - if present, content is encrypted
}

// ML Sentiment Analysis response from /o1/journal endpoint
export interface SentimentAnalysisResult {
  text: string;
  title: string;
  sentiment: string;
  confidence: number; // 0.0 - 1.0
  emotions: string[];
  model_used: string;
  created_at: string;
}

export interface JournalInput {
  title: string;
  content: string; // Plaintext or encrypted base64 content
  iv?: string; // If provided, content is encrypted
  mood_tags?: MoodTags;
  created_at?: string;
  updated_at?: string;
}

export type MoodTags = "happy" | "calm" | "neutral" | "sad" | "frustrated" | "excited" | "anxious"


// Generic API response type
export type ActionResponse<T = object> = 
  | { data: T; error?: never }
  | { data?: never; error: string }

// Onboarding data stored in user_preferences.onboarding_data
export interface OnboardingData {
  role: "student" | "working_professional" | "freelancer" | "entrepreneur" | "other"
  daily_habits_target: number
  daily_tasks_target: number
  long_term_goal: string
  long_term_goal_description?: string
}

// Notifications
export interface Notification {
  notification_id: number
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  link?: string | null
  created_at: string
}