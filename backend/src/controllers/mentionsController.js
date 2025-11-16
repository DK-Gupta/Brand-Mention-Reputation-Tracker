import Sentiment from "sentiment";
import Mention from "../models/Mention.js";
import extractTopics from "../utils/topicExtractor.js";

import { fetchBingMentions } from "../services/bingService.js";
import { fetchGoogleNewsMentions } from "../services/googleNewsService.js";
import { fetchYoutubeMentions } from "../services/youtubeService.js";
import { fetchHNBrandMentions } from "../services/hnService.js";

const sentiment = new Sentiment();

/**
 * GET /api/mentions/:keyword/fetch
 */
export const collectMentions = async (req, res) => {
  try {
    const keyword = (req.params.keyword || req.body.keyword || "").trim();
    if (!keyword) return res.status(400).json({ error: "keyword required" });

    // FETCH ALL SOURCES
    const [bing, gnews, youtube, hn] = await Promise.all([
      fetchBingMentions(keyword),
      fetchGoogleNewsMentions(keyword),
      fetchYoutubeMentions(keyword),
      fetchHNBrandMentions(keyword),
    ]);

    const raw = [...bing, ...gnews, ...youtube, ...hn];

    // NORMALIZE
    const normalized = raw
      .map((item) => {
        const text =
          item.content?.trim() ||
          item.title?.trim() ||
          item.description?.trim() ||
          null;

        if (!text) return null;

        const sent = sentiment.analyze(text);

        let ts = new Date(item.timestamp || item.published_date || Date.now());
        if (isNaN(ts.valueOf())) ts = new Date();

        let username = "unknown";
        if (typeof item.username === "string") username = item.username;
        else if (typeof item.author === "string") username = item.author;
        else if (item.source?.authors) username = item.source.authors.join(", ");
        else if (item.source?.name) username = item.source.name;

        return {
          keyword,
          source: item.source?.name || item.source || "unknown",
          content: text,
          url: item.url || item.link || "",
          username,
          timestamp: ts,
          fetchedAt: new Date(),
          sentiment: {
            label: sent.score > 0 ? "positive" : sent.score < 0 ? "negative" : "neutral",
            score: sent.score,
          },
          topics: extractTopics(text),
          metadata: item.metadata || {},
        };
      })
      .filter(Boolean);

    // DEDUP URL
    const byUrl = {};
    const toInsert = [];

    for (const m of normalized) {
      const key = m.url && m.url.length ? m.url : `${m.source}::${m.content.slice(0, 200)}`;
      if (!byUrl[key]) {
        byUrl[key] = true;
        toInsert.push(m);
      }
    }

    // SKIP ALREADY SAVED
    const urls = toInsert.map((t) => t.url).filter(Boolean);
    const existingUrls = new Set(
      (await Mention.find({ url: { $in: urls } }).select("url")).map((e) => e.url)
    );

    const finalInsert = toInsert.filter((t) => !(t.url && existingUrls.has(t.url)));

    const inserted = finalInsert.length ? await Mention.insertMany(finalInsert) : [];

    res.json({
      keyword,
      totalFetched: raw.length,
      uniqueCandidates: toInsert.length,
      inserted: inserted.length,

      sources: inserted.reduce((acc, cur) => {
        acc[cur.source] = (acc[cur.source] || 0) + 1;
        return acc;
      }, {}),

      sentimentSummary: {
        positive: inserted.filter((i) => i.sentiment.label === "positive").length,
        neutral: inserted.filter((i) => i.sentiment.label === "neutral").length,
        negative: inserted.filter((i) => i.sentiment.label === "negative").length,
      },

      examples: inserted.slice(0, 15),
    });

  } catch (err) {
    console.error("Collect Error:", err);
    res.status(500).json({ error: err.message });
  }
};
