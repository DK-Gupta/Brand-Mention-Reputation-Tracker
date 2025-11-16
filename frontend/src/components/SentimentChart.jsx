// src/components/SentimentChart.jsx
import React, { useEffect, useState } from "react";

const SentimentChart = ({ mentions }) => {
  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });

  useEffect(() => {
    if (!mentions || mentions.length === 0) {
      setSentimentData({ positive: 0, neutral: 0, negative: 0 });
      return;
    }

    const getLabel = (s) =>
      typeof s === "object" ? s.label?.toLowerCase() : s?.toLowerCase();

    setSentimentData({
      positive: mentions.filter((m) => getLabel(m.sentiment) === "positive").length,
      neutral: mentions.filter((m) => getLabel(m.sentiment) === "neutral").length,
      negative: mentions.filter((m) => getLabel(m.sentiment) === "negative").length,
    });
  }, [mentions]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Summary</h3>
      <div className="space-y-4">
        <div className="bg-emerald-500 rounded-lg p-5 text-white">
          <p className="text-3xl font-bold">{sentimentData.positive}</p>
          <p className="text-sm opacity-80">Positive</p>
        </div>

        <div className="bg-gray-400 rounded-lg p-5 text-white">
          <p className="text-3xl font-bold">{sentimentData.neutral}</p>
          <p className="text-sm opacity-80">Neutral</p>
        </div>

        <div className="bg-rose-500 rounded-lg p-5 text-white">
          <p className="text-3xl font-bold">{sentimentData.negative}</p>
          <p className="text-sm opacity-80">Negative</p>
        </div>
      </div>
    </div>
  );
};

export default SentimentChart;
