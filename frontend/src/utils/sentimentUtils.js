// src/utils/sentimentUtils.js

/**
 * Normalize sentiment from backend response.
 *
 * Backend format:
 *  sentiment: {
 *    label: "positive" | "neutral" | "negative",
 *    score: number
 *  }
 *
 * This helper safely extracts and returns:
 *  "positive" | "neutral" | "negative"
 */

export const normalizeSentiment = (sentiment) => {
    if (!sentiment) return "neutral";
  
    // If backend sends: { label: "positive", score: 2 }
    if (typeof sentiment === "object" && sentiment.label) {
      return String(sentiment.label).toLowerCase();
    }
  
    // If sentiment somehow comes as string
    if (typeof sentiment === "string") {
      return sentiment.toLowerCase();
    }
  
    // Default fallback
    return "neutral";
  };
  