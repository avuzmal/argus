"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { Settings, Sliders, Database, Moon, Sun, AlertOctagon } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { 
    isSimulatorRunning, 
    toggleSimulator, 
    simulatorSpeed, 
    setSimulatorSpeed,
    anomalyThreshold,
    setAnomalyThreshold,
    theme,
    setTheme,
    wsUrl,
    setWsUrl
  } = useDashboardStore();

  const [localWsUrl, setLocalWsUrl] = useState(wsUrl);

  const handleSaveWsUrl = () => {
    setWsUrl(localWsUrl);
    // Ideally this would trigger a reconnection in useWebSocket
    alert("WebSocket URL updated. Reconnecting...");
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300">
          <Settings size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Platform Settings</h2>
          <p className="text-xs text-slate-400">Configure global dashboard parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Simulation Settings */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Sliders size={18} className="text-blue-400" />
            <h3 className="font-semibold text-slate-200">Simulation Controls</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-200">Mock Data Generator</div>
                <div className="text-xs text-slate-400">Generate local telemetry data if backend is offline</div>
              </div>
              <button 
                onClick={toggleSimulator}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSimulatorRunning ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSimulatorRunning ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="text-sm font-medium text-slate-200">Simulation Speed</div>
                <div className="text-sm font-bold text-blue-400">{simulatorSpeed}x</div>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="5" 
                step="0.5"
                value={simulatorSpeed} 
                onChange={(e) => setSimulatorSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Analytics Settings */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <AlertOctagon size={18} className="text-orange-400" />
            <h3 className="font-semibold text-slate-200">Machine Learning</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-200">Global Anomaly Threshold</div>
                  <div className="text-xs text-slate-400">Minimum confidence score to trigger Critical alert</div>
                </div>
                <div className="text-sm font-bold text-orange-400">{(anomalyThreshold * 100).toFixed(0)}%</div>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="0.99" 
                step="0.01"
                value={anomalyThreshold} 
                onChange={(e) => setAnomalyThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Connection Settings */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur space-y-6 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Database size={18} className="text-emerald-400" />
            <h3 className="font-semibold text-slate-200">Backend Connection</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2 max-w-xl">
              <div className="text-sm font-medium text-slate-200">FastAPI WebSocket URL</div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={localWsUrl}
                  onChange={(e) => setLocalWsUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
                <button 
                  onClick={handleSaveWsUrl}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Save & Reconnect
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Override the default ws:// connection string if your backend is hosted remotely.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
