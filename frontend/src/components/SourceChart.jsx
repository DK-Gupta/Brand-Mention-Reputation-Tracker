import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SourceChart = ({ mentions }) => {
  const data = mentions.reduce((acc, m) => {
    const source = m.source || "Unknown";
    const found = acc.find((d) => d.source === source);
    if (found) found.count += 1;
    else acc.push({ source, count: 1 });
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="source" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SourceChart;
