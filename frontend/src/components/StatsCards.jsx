import React from "react";

const StatsCards = ({ mentions }) => {

  const normalizeSentiment = (sentiment) => {
    if (!sentiment) return "neutral";

    if (typeof sentiment === "string") {
      return sentiment.toLowerCase();
    }

    if (typeof sentiment === "object" && sentiment.label) {
      return sentiment.label.toLowerCase();
    }

    return "neutral";
  };

  const counts = { positive: 0, neutral: 0, negative: 0 };

  mentions.forEach(m => {
    const s = normalizeSentiment(m.sentiment);
    if (counts[s] !== undefined) counts[s] += 1;
  });

  const total = mentions.length || 1;

  const reputationScore = Math.round(
    ((counts.positive * 2) + counts.neutral - (counts.negative * 2))
    / total * 50 + 50
  );

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Total Mentions</p>
        <h2 className="text-3xl font-bold">{mentions.length}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Reputation Score</p>
        <h2 className="text-3xl font-bold">{reputationScore}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Sentiment</p>
        <div className="text-sm">
          <p className="text-green-600">Positive: {counts.positive}</p>
          <p className="text-gray-600">Neutral: {counts.neutral}</p>
          <p className="text-red-600">Negative: {counts.negative}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
