"use client";

import { useEffect } from "react";
import { Activity, AlertTriangle, Cpu, ActivitySquare } from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboardStore";
import { startDemoSimulator, stopDemoSimulator } from "@/lib/demoSimulator";
import { useWebSocket } from "@/hooks/useWebSocket";
import dynamic from 'next/dynamic';
import { ChartSkeleton } from "@/components/ui/Skeleton";

import StreamingLineChart from "@/components/visualizations/D3Components/StreamingLineChart";

const AnomalyScatterPlot = dynamic(() => import('@/components/visualizations/ECharts/AnomalyScatterPlot'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

const SensorHeatmap = dynamic(() => import('@/components/visualizations/ECharts/SensorHeatmap'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

import { List, ListChildComponentProps } from 'react-window';

const AlertFeed = () => {
  const alerts = useDashboardStore(state => state.alerts);

  if (alerts.length === 0) {
    return <p className="text-slate-500 text-sm text-center py-4">No recent alerts</p>;
  }

  const Row = ({ index, style }: ListChildComponentProps) => {
    const alert = alerts[index];
    return (
      <div style={{ ...style, height: (style.height as number) - 8 }} className={`p-3 border-l-4 rounded shadow-sm bg-slate-900/80 mb-2 ${
        alert.severity === 'critical' ? 'border-red-500' : 'border-amber-500'
      }`}>
        <div className="flex justify-between items-start">
          <p className="font-semibold text-sm truncate pr-2" title={alert.message}>
            {alert.message} [{alert.sensor_id}]
          </p>
          <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(alert.time)}</span>
        </div>
        <p className="text-xs text-slate-300 mt-1">Anomaly score: {alert.score.toFixed(2)}</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-[350px]">
      <List
        height={400}
        itemCount={alerts.length}
        itemSize={80}
        width="100%"
        className="custom-scrollbar pr-2"
      >
        {Row}
      </List>
    </div>
  );
};

export default function Home() {
  const { throughput, activeSensors, alerts, isSimulatorRunning } = useDashboardStore();
  
  // Connect to actual WebSocket backend
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8001/ws/dashboard";
  const { isConnected } = useWebSocket(wsUrl);

  useEffect(() => {
    // If we're not connected to the real backend, and the simulator is enabled, run the local demo simulator
    if (!isConnected && isSimulatorRunning) {
      startDemoSimulator();
    } else {
      stopDemoSimulator();
    }
    return () => {
      stopDemoSimulator();
    };
  }, [isConnected, isSimulatorRunning]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur transition-all hover:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Sensors</p>
              <h3 className="text-3xl font-bold text-slate-50">{formatNumber(activeSensors)}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Cpu size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-3 flex items-center">
            <span className="font-medium">+12</span> <span className="text-slate-500 ml-1">since yesterday</span>
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur transition-all hover:border-slate-700">
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
            <div className="bg-emerald-400 h-full" style={{ width: `${Math.min(100, (throughput / 15000) * 100)}%`, transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur transition-all hover:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Anomalies Detected</p>
              <h3 className="text-3xl font-bold text-slate-50">{formatNumber(alerts.length)}</h3>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-500 mt-3 flex items-center">
            <span className="font-medium">Active Monitoring</span>
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur transition-all hover:border-slate-700">
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
            <div className="h-64 w-full">
              <StreamingLineChart />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
              <h3 className="font-semibold text-sm mb-4">Anomaly Scatter Plot</h3>
              <div className="h-48 w-full">
                <AnomalyScatterPlot />
              </div>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur">
              <h3 className="font-semibold text-sm mb-4">Sensor Heatmap</h3>
              <div className="h-48 w-full">
                <SensorHeatmap />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Alert Feed */}
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur flex-1 flex flex-col max-h-[700px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Live Alert Feed</h3>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <AlertFeed />
            </div>
            <button className="w-full py-2 mt-4 text-sm text-slate-400 hover:text-slate-200 border border-slate-800 rounded hover:bg-slate-800 transition-colors">
              View All Alerts
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
