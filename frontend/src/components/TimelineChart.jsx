// src/components/TimelineChart.jsx
import React from "react";

const TimelineChart = ({ mentions }) => {
  // Group mentions by date
  const getLast5Days = () => {
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const days = getLast5Days();
  const mentionsByDay = days.map(day => {
    const count = mentions.filter(m => 
      m.timestamp && m.timestamp.startsWith(day)
    ).length;
    return { date: day, count };
  });

  const maxCount = Math.max(...mentionsByDay.map(d => d.count), 20);
  const minCount = 0;

  // Calculate Y position for a value
  const getYPosition = (value) => {
    const chartHeight = 120;
    const range = maxCount - minCount;
    if (range === 0) return chartHeight / 2;
    return chartHeight - ((value - minCount) / range) * chartHeight;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Mentions Over Time</h3>
      <div className="w-full h-48">
        <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Y-axis grid lines and labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
            const value = Math.round(maxCount * (1 - factor));
            const y = 20 + (120 * factor);
            return (
              <g key={i}>
                <line x1="50" y1={y} x2="380" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                <text x="10" y={y + 4} className="text-xs fill-gray-400">{value}</text>
              </g>
            );
          })}

          {/* Line path */}
          <polyline
            points={mentionsByDay.map((d, i) => {
              const x = 60 + (i * 70);
              const y = 20 + getYPosition(d.count);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {mentionsByDay.map((d, i) => {
            const x = 60 + (i * 70);
            const y = 20 + getYPosition(d.count);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill="#3B82F6" stroke="white" strokeWidth="2" />
                <text x={x} y="155" className="text-xs fill-gray-400" textAnchor="middle">
                  {d.date.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default TimelineChart;