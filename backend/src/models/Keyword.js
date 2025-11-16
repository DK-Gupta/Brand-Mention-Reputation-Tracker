// src/models/Keyword.js
import mongoose from "mongoose";

const keywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  reputationScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Keyword", keywordSchema);
