"use client";

import { useState, useEffect, useCallback } from "react";

type ServiceStatus = "idle" | "waking" | "ready" | "error";

interface UseWarmServicesResult {
  status: ServiceStatus;
  isReady: boolean;
  retry: () => void;
}

import { warmServicesAction } from "@/app/actions/ml";
/**
 * Hook that pings the ML services to wake them from Render's cold start.
 * Runs automatically on mount, with subtle status tracking.
 */
export function useWarmServices(): UseWarmServicesResult {
  const [status, setStatus] = useState<ServiceStatus>("idle");

  const warmUp = useCallback(async () => {
    setStatus("waking");

    try {
      const isOk = await warmServicesAction();

      if (isOk) {
        setStatus("ready");
        console.log("[WarmServices] ML services are ready");
      } else {
        setStatus("error");
        console.warn("[WarmServices] Health check failed");
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
