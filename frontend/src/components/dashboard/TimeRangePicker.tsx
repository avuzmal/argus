"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { Clock } from "lucide-react";

export default function TimeRangePicker() {
  const { timeRange, setTimeRange } = useDashboardStore();
  
  const ranges = [
    { value: '5m', label: 'Last 5m' },
    { value: '15m', label: 'Last 15m' },
    { value: '1h', label: 'Last 1h' },
    { value: '6h', label: 'Last 6h' },
    { value: '24h', label: 'Last 24h' },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-lg border border-slate-800">
      <div className="px-2 text-slate-400">
        <Clock size={16} />
      </div>
      <div className="flex gap-1">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              timeRange === range.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
