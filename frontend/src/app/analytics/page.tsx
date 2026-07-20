"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import dynamic from 'next/dynamic';
import { BarChart3, TrendingUp, Zap } from "lucide-react";
import { useMemo } from "react";

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function AnalyticsPage() {
  const throughput = useDashboardStore(state => state.throughput);
  const alerts = useDashboardStore(state => state.alerts);

  const throughputOption = useMemo(() => {
    // Generate historical data points terminating at current throughput
    const data = [];
    let current = throughput || 5000;
    for (let i = 0; i < 60; i++) {
      data.unshift(current);
      current = Math.max(1000, current + (Math.random() - 0.5) * 1000);
    }
    
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: Array.from({length: 60}, (_, i) => `-${60 - i}m`),
          axisLabel: { color: '#94a3b8' }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: { color: '#94a3b8' },
          splitLine: { lineStyle: { color: '#1e293b' } }
        }
      ],
      series: [
        {
          name: 'Msg/sec',
          type: 'line',
          smooth: true,
          lineStyle: { width: 3, color: '#3b82f6' },
          showSymbol: false,
          areaStyle: {
            opacity: 0.2,
            color: '#3b82f6'
          },
          data: data
        }
      ]
    };
  }, [throughput]);

  const radarOption = useMemo(() => {
    // Calculate anomalies per zone
    const zoneCounts = { 'Alpha': 0, 'Beta': 0, 'Gamma': 0, 'Delta': 0, 'Epsilon': 0 };
    
    alerts.forEach(alert => {
      const idStr = alert.sensor_id.split('-')[1];
      if (idStr) {
        const num = parseInt(idStr, 10);
        if (num < 10) zoneCounts['Alpha']++;
        else if (num < 20) zoneCounts['Beta']++;
        else if (num < 30) zoneCounts['Gamma']++;
        else if (num < 40) zoneCounts['Delta']++;
        else zoneCounts['Epsilon']++;
      }
    });
    
    return {
      tooltip: {},
      radar: {
        indicator: [
          { name: 'Zone Alpha', max: Math.max(5, zoneCounts['Alpha'] * 2) },
          { name: 'Zone Beta', max: Math.max(5, zoneCounts['Beta'] * 2) },
          { name: 'Zone Gamma', max: Math.max(5, zoneCounts['Gamma'] * 2) },
          { name: 'Zone Delta', max: Math.max(5, zoneCounts['Delta'] * 2) },
          { name: 'Zone Epsilon', max: Math.max(5, zoneCounts['Epsilon'] * 2) }
        ],
        splitNumber: 4,
        axisName: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#1e293b' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#1e293b' } }
      },
      series: [{
        name: 'Anomalies by Zone',
        type: 'radar',
        data: [
          {
            value: [zoneCounts['Alpha'], zoneCounts['Beta'], zoneCounts['Gamma'], zoneCounts['Delta'], zoneCounts['Epsilon']],
            name: 'Recent Alerts',
            itemStyle: { color: '#ef4444' },
            areaStyle: { color: 'rgba(239, 68, 68, 0.3)' }
          }
        ]
      }]
    };
  }, [alerts]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
          <BarChart3 size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">System Analytics</h2>
          <p className="text-xs text-slate-400">Throughput & Production ML Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Timeline */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-400" />
              Throughput Timeline (1h)
            </h3>
          </div>
          <div className="h-[400px]">
            <ReactECharts 
              option={throughputOption} 
              style={{ height: '100%', width: '100%' }} 
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Zap size={18} className="text-red-400" />
              Anomaly Distribution
            </h3>
          </div>
          <div className="h-[400px]">
            <ReactECharts 
              option={radarOption} 
              style={{ height: '100%', width: '100%' }} 
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
