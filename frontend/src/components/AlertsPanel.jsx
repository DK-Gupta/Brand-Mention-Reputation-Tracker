// src/components/AlertsPanel.jsx
import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { fetchAlerts } from "../services/api";

const AlertsPanel = ({ query }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!query) return;

    const getAlerts = async () => {
      try {
        const res = await fetchAlerts(query);
        setAlerts(res.data);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };

    getAlerts();
    const interval = setInterval(getAlerts, 30000);
    return () => clearInterval(interval);
  }, [query]);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-6 flex items-start gap-3 shadow-sm">
      <AlertCircle className="text-rose-600 flex-shrink-0 mt-1" size={26} />
      <div className="flex-1">
        <h3 className="font-semibold text-rose-900 mb-2 text-base">Alerts Detected!</h3>
        <ul className="space-y-1">
          {alerts.map((alert) => (
            <li key={alert._id} className="text-sm text-rose-700">
              {alert.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AlertsPanel;
