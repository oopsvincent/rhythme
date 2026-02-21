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

const ML_SENTIMENT_ENDPOINT = `${process.env.NEXT_PUBLIC_HABIT_PREDICTOR_URL}/o1/journal`;

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
    console.log("[JournalSentiment] Fetching analysis from:", ML_SENTIMENT_ENDPOINT);

    const response = await fetch(ML_SENTIMENT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error(
        "[JournalSentiment] Service returned status:",
        response.status
      );
      return null;
    }

    const result: SentimentResponse = await response.json();
    console.log("[JournalSentiment] Analysis result:", result);
    return result;
  } catch (error) {
    console.error("[JournalSentiment] Failed to fetch analysis:", error);
    return null;
  }
}
