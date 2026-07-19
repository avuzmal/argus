"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Cpu, ActivitySquare } from "lucide-react";
import { formatNumber } from "@/lib/utils";

// Dummy components that we would flesh out later
const StreamingLineChart = () => (
  <div className="h-64 w-full flex items-center justify-center border border-slate-800 rounded-lg bg-slate-900/50">
    <p className="text-slate-500">Streaming D3.js Line Chart (Connecting...)</p>
  </div>
);

const AlertFeed = () => (
  <div className="flex flex-col gap-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-3 border-l-4 border-amber-500 bg-slate-900/80 rounded shadow-sm">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-sm">Temperature Spike [MCH-042-TEMP]</p>
          <span className="text-xs text-slate-400">2 min ago</span>
        </div>
        <p className="text-xs text-slate-300 mt-1">Anomaly score: 0.85</p>
      </div>
    ))}
  </div>
);

export default function Home() {
  const [throughput, setThroughput] = useState(12450);

  useEffect(() => {
    // Simulate real-time throughput updates
    const interval = setInterval(() => {
      setThroughput(prev => prev + Math.floor(Math.random() * 500) - 250);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Sensors</p>
              <h3 className="text-3xl font-bold text-slate-50">1,248</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Cpu size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-3 flex items-center">
            <span className="font-medium">+12</span> <span className="text-slate-500 ml-1">since yesterday</span>
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Throughput</p>
              <h3 className="text-3xl font-bold text-slate-50">{formatNumber(throughput)} <span className="text-lg text-slate-500 font-normal">evt/s</span></h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Activity size={20} />
            </div>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-400 h-full w-[85%]"></div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Anomalies Detected</p>
              <h3 className="text-3xl font-bold text-slate-50">47</h3>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-500 mt-3 flex items-center">
            <span className="font-medium">+5</span> <span className="text-slate-500 ml-1">in last hour</span>
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Avg Latency</p>
              <h3 className="text-3xl font-bold text-slate-50">42 <span className="text-lg text-slate-500 font-normal">ms</span></h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <ActivitySquare size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            P99: 120ms
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Charts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Real-Time Sensor Streams</h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs bg-slate-800 rounded text-slate-300 cursor-pointer hover:bg-slate-700">TEMP</span>
                <span className="px-2 py-1 text-xs bg-slate-800 rounded text-slate-300 cursor-pointer hover:bg-slate-700">VIBRATION</span>
              </div>
            </div>
            <StreamingLineChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
              <h3 className="font-semibold text-sm mb-4">Anomaly Scatter Plot</h3>
              <div className="h-40 w-full flex items-center justify-center border border-slate-800 border-dashed rounded-lg">
                <p className="text-slate-500 text-xs">ECharts rendering...</p>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
              <h3 className="font-semibold text-sm mb-4">Sensor Heatmap</h3>
              <div className="h-40 w-full flex items-center justify-center border border-slate-800 border-dashed rounded-lg">
                <p className="text-slate-500 text-xs">Map rendering...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Alert Feed */}
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Live Alert Feed</h3>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </div>
            <AlertFeed />
            <button className="w-full py-2 mt-4 text-sm text-slate-400 hover:text-slate-200 border border-slate-800 rounded hover:bg-slate-800 transition-colors">
              View All Alerts
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
