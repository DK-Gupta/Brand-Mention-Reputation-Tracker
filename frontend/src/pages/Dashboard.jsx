import React, { useState, useEffect } from "react";
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
      setTimeout(() => fetchLatestMentions(query), 2000); // give backend time to index
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
      console.log("Fetched mentions:", res.data); // debug
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
            {[
              { tab: "dashboard", icon: BarChart3, label: "Dashboard" },
              { tab: "mentions", icon: MessageSquare, label: "Mentions" },
              { tab: "sources", icon: Globe, label: "Sources" },
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            ))}

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1500px] mx-auto">
          {/* Header + Search */}
          <div className="flex items-center justify-between mb-8 gap-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {currentQuery || "Enter a brand to track"}
            </h2>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search brand or keyword"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Alerts */}
          {currentQuery && <AlertsPanel query={currentQuery} />}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading mentions...</p>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && currentQuery && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                <StatsCards mentions={mentions} />

                {/* Chart containers with fixed height to prevent -1/-1 warning */}
                <div className="w-full h-64">
                  <SourceChart mentions={mentions} />
                </div>

                <MentionsGrid mentions={mentions} />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div className="w-full h-64">
                  <SentimentChart mentions={mentions} query={currentQuery} />
                </div>
                <div className="w-full h-64">
                  <TimelineChart mentions={mentions} />
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !currentQuery && (
            <div className="text-center py-20">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={64} />
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
