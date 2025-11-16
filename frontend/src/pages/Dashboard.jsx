import React, { useState, useEffect, useMemo } from "react";
import { BarChart3, MessageSquare, Globe, Settings, Search } from "lucide-react";
import MentionsGrid from "../components/MentionsGrid";
import AlertsPanel from "../components/AlertsPanel";
import SentimentChart from "../components/SentimentChart";
import SourceChart from "../components/SourceChart";
import TimelineChart from "../components/TimelineChart";
import StatsCards from "../components/StatsCards";
import { searchKeyword, fetchMentions } from "../services/api";

const Dashboard = () => {
  const [currentQuery, setCurrentQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleSearch = async () => {
    const query = searchInput.trim();
    if (!query) return;

    setCurrentQuery(query);
    setLoading(true);

    try {
      await searchKeyword(query);
      setTimeout(() => fetchLatestMentions(query), 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const fetchLatestMentions = async (query) => {
    if (!query) return;
    try {
      const res = await fetchMentions(query);
      setMentions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentQuery) return;
    const interval = setInterval(() => fetchLatestMentions(currentQuery), 15000);
    return () => clearInterval(interval);
  }, [currentQuery]);

  // ➤ Stats calculation
  const stats = useMemo(() => {
    let total = 0, positive = 0, negative = 0, neutral = 0, reputationScore = 0;
    mentions.forEach((m) => {
      const sentiment = typeof m.sentiment === "object" ? m.sentiment.label : m.sentiment;
      total += 1;
      if (sentiment === "positive") {
        positive += 1;
        reputationScore += 1;
      } else if (sentiment === "negative") {
        negative += 1;
        reputationScore -= 1;
      } else {
        neutral += 1;
      }
    });
    return { total, positive, negative, neutral, reputationScore };
  }, [mentions]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Mentions Tracker</h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <BarChart3 size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("mentions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                activeTab === "mentions"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <MessageSquare size={20} />
              <span className="font-medium">Mentions</span>
            </button>
            <button
              onClick={() => setActiveTab("sources")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                activeTab === "sources"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Globe size={20} />
              <span className="font-medium">Sources</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all text-left">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1500px] mx-auto">
          {/* Header + Search */}
          <div className="flex items-center justify-between mb-8 gap-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {currentQuery || "Enter a brand to track"}
            </h2>

            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search brand or keyword"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Alerts */}
          {currentQuery && <AlertsPanel query={currentQuery} />}

          {/* Loading Spinner */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading mentions...</p>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && currentQuery && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left side */}
              <div className="lg:col-span-2 space-y-8">
                <StatsCards stats={stats} />
                <SourceChart mentions={mentions} />
                <MentionsGrid mentions={mentions} />
              </div>

              {/* Right side */}
              <div className="space-y-8">
                <SentimentChart mentions={mentions} />
                <TimelineChart mentions={mentions} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !currentQuery && (
            <div className="text-center py-20">
              <MessageSquare
                className="mx-auto text-gray-300 mb-4"
                size={64}
              />
              <p className="text-gray-500 text-lg">
                Enter a brand name to start tracking mentions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
