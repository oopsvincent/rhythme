// app/onboarding/_hooks/useOnboarding.ts
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_AVATAR_ID, extractSocialAvatarUrl, resolveAvatarUrl } from '@/lib/avatars'
import type { HabitSource } from '@/types/database'
import type {
  OnboardingStep,
  TaskItem,
  HabitItem,
  GeneratedPlan,
  MLGenerateResponse,
} from '../_types/onboarding'
import {
  MAX_TASKS,
  MAX_HABITS,
  MAX_REGENERATIONS,
  frequencyToNumeric,
} from '../_types/onboarding'

function generateId(): string {
  return crypto.randomUUID()
}

function mapMLTasks(mlTasks: MLGenerateResponse['tasks']): TaskItem[] {
  return mlTasks.map((t) => ({
    id: generateId(),
    title: t.title,
    description: t.description,
    type: t.type,
    isEdited: false,
  }))
}

function mapMLHabits(mlHabits: MLGenerateResponse['habits']): HabitItem[] {
  return mlHabits.map((h) => ({
    id: generateId(),
    title: h.title,
    frequency: h.frequency,
    reason: h.reason,
    isEdited: false,
  }))
}

export function useOnboarding() {
  const router = useRouter()
  const supabase = createClient()

  // Auth
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  // Step
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('goal')

  // Goal (Step 2)
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDescription, setGoalDescription] = useState('')

  // Profile (Step 3)
  const [displayName, setDisplayName] = useState('')
  const [avatarId, setAvatarId] = useState(DEFAULT_AVATAR_ID)
  const [socialAvatarUrl, setSocialAvatarUrl] = useState<string | null>(null)
  const [dailyTaskTarget, setDailyTaskTarget] = useState(3)
  const [dailyHabitTarget, setDailyHabitTarget] = useState(2)

  // Generation (Step 4)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  // Edit (Step 5)
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [habits, setHabits] = useState<HabitItem[]>([])
  const [regenerateCount, setRegenerateCount] = useState(0)

  // Save (Step 6 → 7)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // ─── Auth check on mount ──────────────────────────────────
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        window.location.href = '/login?redirect=/onboarding'
        return
      }

      setUserId(user.id)

      // Pre-fill name
      if (user.user_metadata?.display_name) {
        setDisplayName(user.user_metadata.display_name)
      } else if (user.user_metadata?.full_name) {
        setDisplayName(user.user_metadata.full_name)
      }

      // Extract social avatar from OAuth identity
      const oauthAvatar = extractSocialAvatarUrl(user.identities)
      if (oauthAvatar) setSocialAvatarUrl(oauthAvatar)

      // Check if already onboarded
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single()

      if (preferences?.onboarding_completed) {
        router.push('/dashboard')
        return
      }

      setIsAuthLoading(false)
    }

    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Step navigation ──────────────────────────────────────
  const goToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step)
  }, [])

  // ─── Generate plan ────────────────────────────────────────
  const generate = useCallback(async () => {
    setIsGenerating(true)
    setGenerationError(null)

    try {
      const response = await fetch('/api/onboarding/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_title: goalTitle,
          goal_description: goalDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate your plan.')
      }

      const data: MLGenerateResponse = await response.json()

      const plan: GeneratedPlan = {
        tasks: mapMLTasks(data.tasks),
        habits: mapMLHabits(data.habits),
        generated: data.generated,
        fallback_used: data.fallback_used,
      }

      setGeneratedPlan(plan)
      setTasks(plan.tasks)
      setHabits(plan.habits)
      setIsGenerating(false)
      setCurrentStep('edit')
    } catch (err) {
      setIsGenerating(false)
      setGenerationError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    }
  }, [goalTitle, goalDescription])

  // ─── Regenerate ───────────────────────────────────────────
  const regenerate = useCallback(async () => {
    if (regenerateCount >= MAX_REGENERATIONS) return

    setRegenerateCount((c) => c + 1)
    setIsGenerating(true)
    setGenerationError(null)

    try {
      const response = await fetch('/api/onboarding/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_title: goalTitle,
          goal_description: goalDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to regenerate your plan.')
      }

      const data: MLGenerateResponse = await response.json()

      const plan: GeneratedPlan = {
        tasks: mapMLTasks(data.tasks),
        habits: mapMLHabits(data.habits),
        generated: data.generated,
        fallback_used: data.fallback_used,
      }

      setGeneratedPlan(plan)
      setTasks(plan.tasks)
      setHabits(plan.habits)
      setIsGenerating(false)
    } catch (err) {
      setIsGenerating(false)
      setGenerationError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    }
  }, [goalTitle, goalDescription, regenerateCount])

  // ─── Task CRUD ────────────────────────────────────────────
  const updateTask = useCallback((id: string, updates: Partial<TaskItem>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, isEdited: true } : t
      )
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addTask = useCallback(() => {
    setTasks((prev) => {
      if (prev.length >= MAX_TASKS) return prev
      return [
        ...prev,
        {
          id: generateId(),
          title: '',
          description: '',
          type: 'custom',
          isEdited: true,
        },
      ]
    })
  }, [])

  // ─── Habit CRUD ───────────────────────────────────────────
  const updateHabit = useCallback((id: string, updates: Partial<HabitItem>) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, ...updates, isEdited: true } : h
      )
    )
  }, [])

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const addHabit = useCallback(() => {
    setHabits((prev) => {
      if (prev.length >= MAX_HABITS) return prev
      return [
        ...prev,
        {
          id: generateId(),
          title: '',
          frequency: 'daily',
          reason: '',
          isEdited: true,
        },
      ]
    })
  }, [])

  // ─── Save & redirect ─────────────────────────────────────
  const save = useCallback(async () => {
    if (!userId) return
    setIsSaving(true)
    setSaveError(null)

    try {
      // 1. Update display name + avatar in auth metadata
      const avatarUrl = resolveAvatarUrl(avatarId, { socialAvatarUrl, userName: displayName })
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          full_name: displayName,
          avatar_url: avatarUrl,
        },
      })
      if (authError) throw authError

      // 1b. Upsert profiles record with avatar + name
      await supabase.from('profiles').upsert({
        id: userId,
        avatar_url: avatarUrl,
        full_name: displayName,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

      // 2. Upsert user_goals record (handles retries or existing goals cleanly)
      const { data: goal, error: goalError } = await supabase
        .from('user_goals')
        .upsert(
          {
            user_id: userId,
            title: goalTitle.trim(),
            description: goalDescription.trim() || null,
            is_primary: true,
          },
          {
            onConflict: 'user_id',
          }
        )
        .select()
        .single()

      if (goalError) throw goalError

      // Delete existing tasks and habits linked to this goal to avoid duplicates on retry
      await supabase
        .from('tasks')
        .delete()
        .eq('user_id', userId)
        .eq('goal_id', goal.id)

      await supabase
        .from('habits')
        .delete()
        .eq('user_id', userId)
        .eq('goal_id', goal.id)

      // 3. Insert tasks
      const tasksToInsert = tasks
        .filter((t) => t.title.trim().length > 0)
        .map((task) => ({
          user_id: userId,
          goal_id: goal.id,
          title: task.title.trim(),
          description: task.description.trim() || null,
          source: task.isEdited ? 'user_edited' : 'ai_generated',
        }))

      if (tasksToInsert.length > 0) {
        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasksToInsert)

        if (tasksError) throw tasksError
      }

      // 4. Insert habits
      const habitsToInsert = habits
        .filter((h) => h.title.trim().length > 0)
        .map((habit) => ({
          user_id: userId,
          goal_id: goal.id,
          name: habit.title.trim(),
          frequency: habit.frequency,
          frequency_num: frequencyToNumeric(habit.frequency),
          target_count: 1,
          source: habit.isEdited ? 'user_edited' : 'ai_generated' as HabitSource,
        }))

      if (habitsToInsert.length > 0) {
        const { error: habitsError } = await supabase
          .from('habits')
          .insert(habitsToInsert)

        if (habitsError) throw habitsError
      }

      // 5. Mark onboarding complete in user_preferences
      const { data: existingPref } = await supabase
        .from('user_preferences')
        .select('user_preferences_id')
        .eq('user_id', userId)
        .single()

      if (existingPref) {
        const { error: prefError } = await supabase
          .from('user_preferences')
          .update({ onboarding_completed: true })
          .eq('user_id', userId)

        if (prefError) throw prefError
      } else {
        const { error: prefError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            notifications_enabled: true,
            onboarding_completed: true,
          })

        if (prefError) throw prefError
      }

      // 6. Save goal to localStorage for quick sidebar access
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user_goal',
          JSON.stringify({
            title: goalTitle.trim(),
            description: goalDescription.trim() || undefined,
          })
        )
      }

      // 7. Refresh session & redirect
      await supabase.auth.refreshSession()
      router.push('/dashboard')
      router.refresh()
    } catch (error: unknown) {
      const errorWithMeta = error as {
        message?: string
        details?: string
        hint?: string
        code?: string
      }
      console.error('Onboarding save error details:', {
        message: errorWithMeta?.message,
        details: errorWithMeta?.details,
        hint: errorWithMeta?.hint,
        code: errorWithMeta?.code,
        error
      })
      setIsSaving(false)
      setSaveError(errorWithMeta?.message || 'Something went wrong saving your plan.')
    }
  }, [
    userId,
    displayName,
    avatarId,
    goalTitle,
    goalDescription,
    tasks,
    habits,
    supabase,
    router,
  ])

  return {
    // Auth
    userId,
    isAuthLoading,

    // Step
    currentStep,
    goToStep,

    // Goal
    goalTitle,
    setGoalTitle,
    goalDescription,
    setGoalDescription,

    // Profile
    displayName,
    setDisplayName,
    avatarId,
    setAvatarId,
    socialAvatarUrl,
    dailyTaskTarget,
    setDailyTaskTarget,
    dailyHabitTarget,
    setDailyHabitTarget,

    // Generation
    generatedPlan,
    isGenerating,
    generationError,
    generate,
    regenerate,
    regenerateCount,

    // Tasks
    tasks,
    updateTask,
    deleteTask,
    addTask,

    // Habits
    habits,
    updateHabit,
    deleteHabit,
    addHabit,

    // Save
    isSaving,
    saveError,
    save,
  }
}
