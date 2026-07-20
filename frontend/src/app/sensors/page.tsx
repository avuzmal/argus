"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { Server, Activity, Thermometer, Radio } from "lucide-react";
import { useMemo } from "react";

export default function SensorsPage() {
  const alerts = useDashboardStore(state => state.alerts);
  const activeSensorsCount = useDashboardStore(state => state.activeSensors);

  // Generate a realistic grid of sensors
  const sensors = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 48; i++) {
      const id = `MCH-${i.toString().padStart(3, '0')}`;
      
      // Check if this sensor has a recent alert
      const recentAlert = alerts.find(a => a.sensor_id === id);
      
      list.push({
        id,
        type: i % 3 === 0 ? 'Vibration' : i % 2 === 0 ? 'Temperature' : 'Pressure',
        status: recentAlert ? recentAlert.severity : 'normal',
        value: recentAlert 
          ? (recentAlert.score * 100).toFixed(1) 
          : (Math.random() * 40 + 20).toFixed(1), // Normal baseline
        unit: i % 3 === 0 ? 'mm/s' : i % 2 === 0 ? '°C' : 'PSI'
      });
    }
    return list;
  }, [alerts]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Active Sensors</p>
              <h3 className="text-3xl font-bold text-slate-50 mt-2">{activeSensorsCount.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
              <Server size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Network Health</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-2">99.9%</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
              <Activity size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Critical Nodes</p>
              <h3 className="text-3xl font-bold text-red-400 mt-2">
                {sensors.filter(s => s.status === 'critical').length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
              <Radio size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Thermometer size={20} className="text-blue-400" />
            Sensor Array Status (Zone Alpha)
          </h3>
          <div className="text-sm text-slate-400">Showing 48 monitored nodes</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sensors.map(sensor => {
            const isCritical = sensor.status === 'critical';
            const isWarning = sensor.status === 'high' || sensor.status === 'medium';
            
            return (
              <div 
                key={sensor.id}
                className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                  isCritical 
                    ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse'
                    : isWarning
                    ? 'bg-orange-500/10 border-orange-500/50'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono text-slate-500 mb-2">{sensor.id}</div>
                <div className={`text-xl font-bold mb-1 ${
                  isCritical ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-slate-200'
                }`}>
                  {sensor.value}
                  <span className="text-xs font-normal ml-1 opacity-70">{sensor.unit}</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  {sensor.type}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
