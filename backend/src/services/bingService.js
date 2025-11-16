import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const fetchBingMentions = async (keyword) => {
    try {
        const res = await axios.get("https://serpapi.com/search.json", {
          params: {
            engine: "bing",
            q: keyword,
            api_key: process.env.SERPAPI_KEY,
          },
        });

    if (!res.data.organic_results) return [];

    return res.data.organic_results.map((item) => ({
      source: "bing",
      content: item.title || "",
      username: item.displayed_link || "unknown",
      timestamp: new Date(),
      url: item.link,
    }));
  } catch (err) {
    console.error("❌ Bing Error:", err.response?.data || err.message);
    return [];
  }
};
