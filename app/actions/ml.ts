"use server";

import type { HabitPredictionInput, HabitPrediction } from "@/types/database";
import type { SentimentRequest, SentimentResponse } from "@/lib/journal-sentiment";

const ML_ENDPOINT = process.env.ML_ENDPOINT;
const API_SECRET = process.env.API_SECRET || "";
const ML_HEALTH_TIMEOUT_MS = Number(process.env.ML_HEALTH_TIMEOUT_MS || "2500");

export async function fetchPredictionAction(
  input: HabitPredictionInput
): Promise<HabitPrediction> {
  if (!ML_ENDPOINT) {
    throw new Error("Prediction service unavailable (missing URL)");
  }

  const response = await fetch(`${ML_ENDPOINT}/v1/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-secret": API_SECRET,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Prediction service unavailable");
  }

  return response.json();
}

export async function fetchSentimentAction(
  request: SentimentRequest
): Promise<SentimentResponse | null> {
  if (!ML_ENDPOINT) {
    console.error("[JournalSentiment] Missing ML_ENDPOINT");
    return null;
  }

  try {
    const response = await fetch(`${ML_ENDPOINT}/v1/journal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": API_SECRET,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error("[JournalSentiment] Service returned status:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("[JournalSentiment] Failed to fetch analysis:", error);
    return null;
  }
}

export async function warmServicesAction(): Promise<boolean> {
  if (!ML_ENDPOINT) {
    console.warn("[WarmServices] No ML_ENDPOINT configured");
    return false;
  }

  try {
    // Keep warm-up bounded so ML cold starts never hold app startup work.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ML_HEALTH_TIMEOUT_MS);

    try {
      const response = await fetch(`${ML_ENDPOINT}/v1/health`, {
        method: "GET",
        headers: {
          "x-api-secret": API_SECRET,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      return response.ok;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.warn("[WarmServices] Failed to reach ML services:", error);
    return false;
  }
}
