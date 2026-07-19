"use client";

import { Download, FileImage, FileJson, FileSpreadsheet } from "lucide-react";
import html2canvas from "html2canvas";
import { useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";

export default function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const alerts = useDashboardStore(state => state.alerts);

  const exportPNG = async () => {
    const dashboard = document.getElementById("dashboard-content");
    if (!dashboard) return;
    
    try {
      const canvas = await html2canvas(dashboard, {
        backgroundColor: "#020617", // slate-950
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `argus-dashboard-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export failed", e);
    }
    setIsOpen(false);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const link = document.createElement("a");
    link.download = `argus-alerts-${new Date().toISOString()}.json`;
    link.href = dataStr;
    link.click();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700 shadow-sm"
      >
        <Download size={16} />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1">
          <button 
            onClick={exportPNG}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FileImage size={16} /> Dashboard PNG
          </button>
          <button 
            onClick={exportJSON}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FileJson size={16} /> Alerts JSON
          </button>
        </div>
      )}
    </div>
  );
}
