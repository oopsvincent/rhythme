"use client";

import { useState, useEffect, useCallback } from "react";

type ServiceStatus = "idle" | "waking" | "ready" | "error";

interface UseWarmServicesResult {
  status: ServiceStatus;
  isReady: boolean;
  retry: () => void;
}

const HEALTH_ENDPOINT = `${process.env.NEXT_PUBLIC_HABIT_PREDICTOR_URL}/o1/health`;

/**
 * Hook that pings the ML services to wake them from Render's cold start.
 * Runs automatically on mount, with subtle status tracking.
 */
export function useWarmServices(): UseWarmServicesResult {
  const [status, setStatus] = useState<ServiceStatus>("idle");

  const warmUp = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_HABIT_PREDICTOR_URL) {
      console.warn("[WarmServices] No HABIT_PREDICTOR_URL configured");
      return;
    }

    setStatus("waking");

    try {
      const response = await fetch(HEALTH_ENDPOINT, {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        setStatus("ready");
        console.log("[WarmServices] ML services are ready");
      } else {
        setStatus("error");
        console.warn("[WarmServices] Health check failed:", response.status);
      }
    } catch (error) {
      setStatus("error");
      console.warn("[WarmServices] Failed to reach ML services:", error);
    }
  }, []);

  useEffect(() => {
    warmUp();
  }, [warmUp]);

  return {
    status,
    isReady: status === "ready",
    retry: warmUp,
  };
}
