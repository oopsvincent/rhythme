"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createMoodLog,
  deleteMoodLog,
  getMoodLogs,
  updateMoodLog,
} from "@/app/actions/moodLogs"
import type { CreateMoodLogInput, UpdateMoodLogInput } from "@/types/database"

export const moodKeys = {
  all: ["mood-logs"] as const,
}

export function useMoodLogs(limit = 90) {
  return useQuery({
    queryKey: [...moodKeys.all, limit],
    queryFn: async () => {
      const result = await getMoodLogs(limit)
      if (result.error) throw new Error(result.error)
      return result.data || []
    },
    staleTime: 30 * 1000,
  })
}

export function useCreateMoodLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateMoodLogInput) => {
      const result = await createMoodLog(input)
      if (result.error) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moodKeys.all })
    },
  })
}

export function useUpdateMoodLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number
      input: UpdateMoodLogInput
    }) => {
      const result = await updateMoodLog(id, input)
      if (result.error) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moodKeys.all })
    },
  })
}

export function useDeleteMoodLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteMoodLog(id)
      if (result.error) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moodKeys.all })
    },
  })
}
