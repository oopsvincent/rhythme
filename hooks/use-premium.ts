"use client"

import { useQuery } from "@tanstack/react-query"
import { getSubscriptionStatus, type SubscriptionStatus } from "@/app/actions/subscription"

/**
 * Client-side hook to check premium/subscription status.
 * Uses React Query for caching — refetches on window focus.
 */
export function usePremium() {
  const { data, isLoading, error, refetch } = useQuery<SubscriptionStatus>({
    queryKey: ["subscription-status"],
    queryFn: () => getSubscriptionStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  })

  return {
    isPremium: data?.isPremium ?? false,
    subscriptionStatus: data?.subscriptionStatus ?? "inactive",
    subscriptionId: data?.subscriptionId ?? null,
    isLoading,
    error,
    refetch,
  }
}
