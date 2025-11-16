// src/routes/alerts.js
import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

/**
 * GET /api/alerts
 * Optional: ?keyword=iphone
 */
router.get("/", async (req, res) => {
  const { keyword } = req.query;

  try {
    const filter = keyword ? { keyword } : {};

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(alerts);
  } catch (err) {
    console.error("Alerts fetch error:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

/**
 * GET /api/alerts/:keyword
 * Fetch alerts for a specific keyword
 */
router.get("/:keyword", async (req, res) => {
  const { keyword } = req.params;

  try {
    const alerts = await Alert.find({ keyword })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(alerts);
  } catch (err) {
    console.error("Alerts fetch error:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

export default router;
