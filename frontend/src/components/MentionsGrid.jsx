import React from "react";
import { Globe } from "lucide-react";

const MentionsGrid = ({ mentions = [] }) => {
  if (!mentions.length) {
    return (
      <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
        <p className="text-gray-500">No mentions found</p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    return new Date(timestamp).toISOString().split("T")[0];
  };

  const getSentimentLabel = (sentiment) =>
    typeof sentiment === "object" ? sentiment.label : sentiment;

  const getSentimentClass = (sentiment) => {
    const label = getSentimentLabel(sentiment)?.toLowerCase();
    switch (label) {
      case "positive":
        return "bg-emerald-100 text-emerald-700";
      case "negative":
        return "bg-rose-100 text-rose-700";
      case "neutral":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Latest Mentions</h3>
        <span className="text-sm text-gray-500">
          Showing {mentions.length} mentions
        </span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {mentions.map((mention, idx) => {
          const label = getSentimentLabel(mention.sentiment);
          return (
            <div
              key={mention._id || idx}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="text-blue-600" size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <a
                    href={mention.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 block mb-1"
                  >
                    {mention.title || mention.content || "No Title"}
                  </a>

                  {mention.content && (
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {mention.content}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 truncate mt-1">
                    {mention.url || "No URL available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Globe size={14} />
                  <span className="font-medium">{mention.source || "Unknown"}</span>
                  {mention.username && mention.username !== "unknown" && (
                    <span>• {mention.username}</span>
                  )}
                  {mention.topics?.length > 0 && <span>• {mention.topics[0]}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(mention.timestamp)}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${getSentimentClass(
                      mention.sentiment
                    )}`}
                  >
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MentionsGrid;
