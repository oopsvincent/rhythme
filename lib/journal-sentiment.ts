/**
 * =============================================================================
 * JOURNAL SENTIMENT ANALYSIS SERVICE
 * =============================================================================
 *
 * Calls the ML sentiment analysis endpoint (/o1/journal) to analyze
 * journal text and return sentiment, emotions, and confidence scores.
 *
 * Uses the same ML service base URL as habit predictions.
 * =============================================================================
 */

import { fetchSentimentAction } from "@/app/actions/ml";
export interface SentimentRequest {
  text: string;
  title: string;
}

export interface SentimentResponse {
  text: string;
  title: string;
  sentiment: string;
  confidence: number;
  emotions: string[];
  model_used: string;
  created_at: string;
}

/**
 * Call the ML sentiment analysis endpoint.
 * Returns null if the service is unavailable.
 */
export async function fetchSentimentAnalysis(
  request: SentimentRequest
): Promise<SentimentResponse | null> {
  try {
    console.log("[JournalSentiment] Fetching analysis from server action");

    const result = await fetchSentimentAction(request);

    if (!result) {
      console.error("[JournalSentiment] Service returned null");
      return null;
    }

    console.log("[JournalSentiment] Analysis result:", result);
    return result;
  } catch (error) {
    console.error("[JournalSentiment] Failed to fetch analysis:", error);
    return null;
  }
}
