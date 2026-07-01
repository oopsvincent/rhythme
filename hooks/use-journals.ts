"use client";

import { useQuery } from "@tanstack/react-query";
import { getJournals } from "@/app/actions/journals";
import type { Journal } from "@/types/database";

export const journalKeys = {
  all: ["journals"] as const,
};

/**
 * Fetch all journals with caching
 */
export function useJournals() {
  return useQuery<Journal[]>({
    queryKey: journalKeys.all,
    queryFn: async () => {
      return await getJournals();
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}
