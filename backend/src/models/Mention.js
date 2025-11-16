import mongoose from "mongoose";

const MentionSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  source: { type: String, required: true },
  content: { type: String, required: true },
  url: String,
  username: String,
  sentiment: {
    label: { type: String, enum: ["positive", "neutral", "negative"] },
    score: Number,
  },
  topics: [String],
  timestamp: Date,
  fetchedAt: { type: Date, default: Date.now },
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.model("Mention", MentionSchema);
