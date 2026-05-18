"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type ServiceStatus = "idle" | "waking" | "ready" | "error";

interface UseWarmServicesResult {
  status: ServiceStatus;
  isReady: boolean;
  retry: () => void;
}

/**
 * Hook that pings the ML services to wake them from Render's cold start.
 * Runs automatically on mount, with subtle status tracking.
 */
export function useWarmServices(): UseWarmServicesResult {
  const [status, setStatus] = useState<ServiceStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const retryTimerRef = useRef<number | null>(null);

  const warmUp = useCallback(async () => {
    abortRef.current?.abort();
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    setStatus("waking");

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch("/api/ai/health", {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => null)) as { status?: ServiceStatus } | null;
      const nextStatus = payload?.status;

      if (nextStatus === "ready") {
        setStatus("ready");
        return;
      }

      if (nextStatus === "waking") {
        setStatus("waking");
        retryTimerRef.current = window.setTimeout(() => {
          retryTimerRef.current = null;
          void warmUp();
        }, 5000);
        return;
      }

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("error");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setStatus("error");
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
      abortRef.current?.abort();
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
      }
      globalThis.clearTimeout(timeoutId);
    };
  }, [warmUp]);

  return {
    status,
    isReady: status === "ready",
    retry: warmUp,
  };
}
