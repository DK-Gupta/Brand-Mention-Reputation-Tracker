import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const fetchYoutubeMentions = async (keyword) => {
    try {
        const res = await axios.get("https://serpapi.com/search.json", {
          params: {
            engine: "youtube",
            search_query: keyword,
            api_key: process.env.SERPAPI_KEY,
          },
        });

    if (!res.data.video_results) return [];

    return res.data.video_results.map((video) => ({
      source: "youtube",
      content: video.title,
      username: video.channel?.name || "unknown",
      timestamp: new Date(video.published_date || Date.now()),
      url: video.link,
    }));
  } catch (err) {
    console.error(" YouTube Error:", err.response?.data || err.message);
    return [];
  }
};
