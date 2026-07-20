"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { AlertTriangle, Filter, Search, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AlertsPage() {
  const alerts = useDashboardStore(state => state.alerts);
  const clearAlerts = useDashboardStore(state => state.clearAlerts);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.sensor_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 border border-slate-800 rounded-xl p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">System Alerts</h2>
            <p className="text-xs text-slate-400">{alerts.length} total events recorded</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search ID or message..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select 
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button 
            onClick={clearAlerts}
            className="flex items-center gap-2 bg-slate-950 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Trash2 size={16} />
            <span className="hidden md:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Sensor ID</th>
                <th className="px-6 py-4 font-medium">Event Message</th>
                <th className="px-6 py-4 font-medium">Anomaly Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                      {new Date(alert.time).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider
                        ${alert.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          alert.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                          alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {alert.sensor_id}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {alert.message}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 max-w-[100px]">
                          <div 
                            className={`h-1.5 rounded-full ${alert.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}
                            style={{ width: `${alert.score * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{(alert.score * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No alerts match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
