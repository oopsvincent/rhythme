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
    let cancelled = false;

    const runWarmUp = () => {
      if (cancelled) return;
      void warmUp();
    };

    // Defer ML warm-up until the browser is idle so initial app data (Supabase)
    // is not competing with Render cold-start requests.
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(runWarmUp, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(runWarmUp, 1200);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, [warmUp]);

  return {
    status,
    isReady: status === "ready",
    retry: warmUp,
  };
}
