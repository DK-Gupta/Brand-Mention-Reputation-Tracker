// src/routes/keywords.js
import express from "express";
import Keyword from "../models/Keyword.js";
import Mention from "../models/Mention.js"; // IMPORTANT for reputation calculations

const router = express.Router();

// ➤ Add a new keyword
router.post("/", async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    const exists = await Keyword.findOne({ keyword });

    if (exists) {
      return res.status(400).json({ error: "Keyword already exists" });
    }

    const newKeyword = await Keyword.create({ keyword });

    res.json(newKeyword);
  } catch (err) {
    console.error("Keyword create error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ➤ Get list of all keywords + reputation scores
router.get("/", async (req, res) => {
  try {
    const keywords = await Keyword.find().sort({ createdAt: -1 });
    res.json(keywords);
  } catch (err) {
    console.error("Keyword fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ➤ Recalculate reputation for a keyword
router.get("/:keyword/reputation", async (req, res) => {
  try {
    const { keyword } = req.params;

    const mentions = await Mention.find({ matchedKeyword: keyword });

    let score = 0;

    mentions.forEach((m) => {
      const sentiment = typeof m.sentiment === "object" ? m.sentiment.label : m.sentiment;

      if (sentiment === "positive") score += 1;
      else if (sentiment === "negative") score -= 1;
    });

    const updated = await Keyword.findOneAndUpdate(
      { keyword },
      { reputationScore: score },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Reputation calculate error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
