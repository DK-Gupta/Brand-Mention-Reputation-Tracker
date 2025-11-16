// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import mentionRoutes from "./src/routes/mentions.js";
import alertRoutes from "./src/routes/alerts.js";
import keywordRoutes from "./src/routes/Keywords.js";
import { pollKeyword } from "./src/workers/poller.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/keywords", keywordRoutes);
app.use("/api/mentions", mentionRoutes);
app.use("/api/alerts", alertRoutes);

// Manual polling endpoint
let currentQuery = null;
let pollerInterval = null;

app.post("/api/search", async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  currentQuery = query.trim();

  // Clear previous poller
  if (pollerInterval) clearInterval(pollerInterval);

  try {
    // Run immediately once
    await pollKeyword(currentQuery);

    // Start interval for automatic polling every 5 minutes
    pollerInterval = setInterval(async () => {
      try {
        await pollKeyword(currentQuery);
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5 * 60 * 1000);

    res.json({ message: `✅ Polling started for keyword: "${currentQuery}"` });
  } catch (err) {
    console.error("Polling error:", err);
    res.status(500).json({ error: "Failed to start polling" });
  }
});

// Health check endpoint (optional)
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
