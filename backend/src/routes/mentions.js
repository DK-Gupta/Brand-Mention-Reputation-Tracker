// src/routes/mentions.js
import express from "express";
import Mention from "../models/Mention.js";
import Alert from "../models/Alert.js";

const router = express.Router();

/**
 * GET /api/mentions
 * Optional query: ?keyword=Iphone
 */
router.get("/", async (req, res) => {
  try {
    const { keyword } = req.query;
    const filter = keyword ? { keyword } : {};
    const mentions = await Mention.find(filter).sort({ timestamp: -1 }).limit(100);
    res.json(mentions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * GET /api/mentions/:keyword/fetch
 */
router.get("/:keyword/fetch", async (req, res) => {
  try {
    const { keyword } = req.params;
    const mentions = await Mention.find({ keyword })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(mentions);
  } catch (err) {
    console.error("Failed to fetch mentions:", err);
    res.status(500).json({ error: "Failed to fetch mentions" });
  }
});

/**
 * GET /api/mentions/alerts
 * Optional: ?keyword=iphone
 */
router.get("/alerts", async (req, res) => {
  try {
    const { keyword } = req.query;
    const filter = keyword ? { keyword } : {};

    const alerts = await Alert.find(filter)
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
