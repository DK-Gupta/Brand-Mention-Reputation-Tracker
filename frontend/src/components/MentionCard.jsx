// src/components/MentionCard.jsx
import React from "react";
import { Globe } from "lucide-react";

const MentionCard = ({ mention }) => {
  const sentimentColor =
    mention.sentiment === "positive"
      ? "bg-emerald-100 text-emerald-700"
      : mention.sentiment === "negative"
      ? "bg-rose-100 text-rose-700"
      : "bg-gray-100 text-gray-700";

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    return new Date(timestamp).toISOString().split("T")[0];
  };

  return (
    <div className="bg-white p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Globe className="text-blue-600" size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <a
            href={mention.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 block mb-1"
          >
            {mention.title || mention.content || "No Title"}
          </a>

          {mention.content && (
            <p className="text-xs text-gray-600 line-clamp-2">{mention.content}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Globe size={14} />
          <span>{mention.source}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{formatDate(mention.timestamp)}</span>
          <span className={`px-3 py-1 rounded-md text-xs font-medium ${sentimentColor}`}>
            {mention.sentiment || "neutral"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MentionCard;
