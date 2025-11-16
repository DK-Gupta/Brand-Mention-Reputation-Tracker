import axios from "axios";

export const fetchHNBrandMentions = async (keyword) => {
  const BASE_URL = "https://hn.algolia.com/api/v1/search_by_date";

  try {
    let allResults = [];

    // Fetch 3 pages (you can increase to 5 for more coverage)
    for (let page = 0; page < 3; page++) {
      const res = await axios.get(BASE_URL, {
        params: {
          query: keyword,
          tags: "story",
          page: page
        }
      });

      if (res.data.hits) {
        allResults = allResults.concat(res.data.hits);
      }
    }

    // Filter for last 30 days
    const now = new Date();
    const past30 = new Date();
    past30.setDate(now.getDate() - 30);

    const filtered = allResults.filter((item) => {
      const postDate = new Date(item.created_at);
      return postDate >= past30; // only posts within last 30 days
    });

    return filtered.map((item) => ({
      source: "hackernews",
      title: item.title,
      content: item.story_text || "",
      url: item.url,
      username: item.author,
      timestamp: new Date(item.created_at),
      points: item.points,
      comments: item.num_comments,
    }));

  } catch (err) {
    console.error("HN API Error:", err.message);
    return [];
  }
};
