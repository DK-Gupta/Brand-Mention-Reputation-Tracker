import React from "react";

const StatsCards = ({ stats = {} }) => {
  const {
    total = 0,
    positive = 0,
    negative = 0,
    neutral = 0,
    reputationScore = 0,
  } = stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <p className="text-xs text-gray-500">Total Mentions</p>
        <h3 className="text-2xl font-semibold">{total}</h3>
      </div>

      <div className="bg-green-50 p-5 rounded-xl border border-green-200 shadow-sm">
        <p className="text-xs text-green-700">Positive</p>
        <h3 className="text-2xl font-semibold text-green-700">{positive}</h3>
      </div>

      <div className="bg-red-50 p-5 rounded-xl border border-red-200 shadow-sm">
        <p className="text-xs text-red-700">Negative</p>
        <h3 className="text-2xl font-semibold text-red-700">{negative}</h3>
      </div>

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-xs text-gray-700">Neutral</p>
        <h3 className="text-2xl font-semibold">{neutral}</h3>
      </div>

      {/* NEW — Reputation Score */}
      <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow-sm col-span-2 md:col-span-4">
        <p className="text-xs text-blue-700">Reputation Score</p>
        <h3 className="text-3xl font-bold text-blue-700">{reputationScore}</h3>
      </div>

    </div>
  );
};

export default StatsCards;
