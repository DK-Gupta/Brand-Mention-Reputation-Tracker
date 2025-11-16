import Mention from "../models/Mention.js";
import Keyword from "../models/Keyword.js";

export async function processKeyword(keyword) {
  console.log("Processing keyword:", keyword);

  // Your existing logic for scraping mentions here...
  return true;
}

export async function updateReputation(keyword) {
  try {
    const mentions = await Mention.find({ keyword });

    if (!mentions.length) return;

    const positive = mentions.filter(m => m.sentiment === "positive").length;
    const negative = mentions.filter(m => m.sentiment === "negative").length;

    // formula: reputation %
    const reputationScore =
      positive + negative === 0
        ? 0
        : Math.round((positive / (positive + negative)) * 100);

    await Keyword.updateOne(
      { keyword },
      { reputationScore }
    );

    console.log(`⭐ Reputation updated for ${keyword}: ${reputationScore}`);
  } catch (err) {
    console.error("Error updating reputation:", err);
  }
}
