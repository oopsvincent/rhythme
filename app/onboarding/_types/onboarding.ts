// app/onboarding/_types/onboarding.ts

export type OnboardingStep =
  | 'goal'
  | 'profile'
  | 'generating'
  | 'edit'
  | 'commitment'

export interface TaskItem {
  id: string
  title: string
  description: string
  type: string
  isEdited: boolean
}

export interface HabitItem {
  id: string
  title: string
  frequency: string // 'daily' | '2x per week' | '3x per week' | 'once per week'
  reason: string
  isEdited: boolean
}

export interface GeneratedPlan {
  tasks: TaskItem[]
  habits: HabitItem[]
  generated: boolean
  fallback_used: boolean
}

export interface OnboardingState {
  // Step
  currentStep: OnboardingStep

  // Goal data (Step 2)
  goalTitle: string
  goalDescription: string

  // Profile data (Step 3)
  displayName: string
  avatarId: string
  dailyTaskTarget: number
  dailyHabitTarget: number

  // Generation (Step 4)
  generatedPlan: GeneratedPlan | null
  isGenerating: boolean
  generationError: string | null

  // Edit (Step 5)
  tasks: TaskItem[]
  habits: HabitItem[]
  regenerateCount: number

  // Save (Step 6 â†’ 7)
  isSaving: boolean
  saveError: string | null
}

/** Shape returned by the ML endpoint */
export interface MLGenerateResponse {
  tasks: Array<{ title: string; description: string; type: string }>
  habits: Array<{ title: string; frequency: string; reason: string }>
  generated: boolean
  fallback_used: boolean
}

/** Frequency options for the Edit Screen dropdown */
export const HABIT_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: '2x per week', label: '2x per week' },
  { value: '3x per week', label: '3x per week' },
  { value: 'once per week', label: 'Once per week' },
] as const

/** Map string frequencies from ML/UI to numeric values for the habits table */
export function frequencyToNumeric(freq: string): number {
  switch (freq) {
    case 'daily':
      return 0
    case 'once per week':
      return 1
    case '2x per week':
    case '3x per week':
      return 3
    default:
      return 0
  }
}

/** Max limits */
export const MAX_TASKS = 7
export const MAX_HABITS = 5
export const MAX_REGENERATIONS = 2
export const TITLE_MIN_LENGTH = 3
export const TITLE_MAX_LENGTH = 120
export const DESCRIPTION_MAX_LENGTH = 500
