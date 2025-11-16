// src/workers/poller.js
import cron from "node-cron";
import Keyword from "../models/Keyword.js"; // renamed from Brand for clarity
import { processKeyword, updateReputation } from "./processor.js";

console.log("Poller worker started.");

// Named export for manual polling
export const pollKeyword = async (keyword) => {
  try {
    await processKeyword(keyword);
    await updateReputation(keyword);
    console.log(`✅ Polling done for keyword: ${keyword}`);
  } catch (err) {
    console.error("❌ Polling error for keyword:", keyword, err);
  }
};

// Automatic cron job (polls all keywords every 5 minutes)
cron.schedule("*/5 * * * *", async () => {
  console.log("⏳ Running poller job...");

  try {
    const keywords = await Keyword.find();

    for (const item of keywords) {
      await pollKeyword(item.keyword); // use the exported function
    }

    console.log("✅ Polling cycle completed.");
  } catch (err) {
    console.error("❌ Poller error:", err);
  }
});
