import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Google News Search using SerpAPI
 * engine=google_news
 */
export const fetchGoogleNewsMentions = async (keyword) => {
    try {
      const res = await axios.get("https://serpapi.com/search.json", {
        params: {
          engine: "google_news",
          search_query: keyword,
          api_key: process.env.SERPAPI_KEY,
        },
      });
  
      if (!res.data.news_results) return [];
  
      return res.data.news_results.map((item) => {
        let ts = new Date(item.date || Date.now());
        if (isNaN(ts.valueOf())) ts = new Date();
  
        return {
          source: "google_news",
          content: item.title || item.snippet || "No title",
          username: item.source || "unknown",
          timestamp: ts,
          url: item.link || "",
          metadata: item,
        };
      });
    } catch (err) {
      console.error("Google News Error:", err.response?.data || err.message);
      return [];
    }
  };
  