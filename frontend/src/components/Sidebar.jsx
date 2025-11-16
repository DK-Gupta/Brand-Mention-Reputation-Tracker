import React from "react";
import { BarChart2, MessageSquare, Layers, Settings } from "lucide-react";

const Sidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart2 size={18} /> },
    { id: "mentions", label: "Mentions", icon: <MessageSquare size={18} /> },
    { id: "sources", label: "Sources", icon: <Layers size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm h-full flex flex-col">
      <h1 className="text-xl font-bold px-6 py-5 border-b bg-gray-50">
        Mentions Tracker
      </h1>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200 ${
                activePage === item.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
