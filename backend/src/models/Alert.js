// src/models/Alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Alert", alertSchema);
