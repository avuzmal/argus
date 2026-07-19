"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { Play, Square, FastForward, Settings2 } from "lucide-react";

export default function SimulatorControls() {
  const { isSimulatorRunning, simulatorSpeed, toggleSimulator, setSimulatorSpeed } = useDashboardStore();

  return (
    <div className="flex items-center gap-3 p-2 bg-slate-900/80 rounded-lg border border-slate-800">
      <div className="flex items-center gap-1 border-r border-slate-700 pr-3">
        <Settings2 size={16} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-300 ml-1">DATA SIMULATOR</span>
      </div>
      
      <button 
        onClick={toggleSimulator}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          isSimulatorRunning 
            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
        }`}
      >
        {isSimulatorRunning ? <Square size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
        {isSimulatorRunning ? 'Stop' : 'Start'}
      </button>

      <div className="flex items-center gap-1 pl-2">
        {[1, 2, 5, 10].map((speed) => (
          <button
            key={speed}
            onClick={() => setSimulatorSpeed(speed)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              simulatorSpeed === speed
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {speed > 1 && <FastForward size={12} />}
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
}
