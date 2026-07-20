"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import dynamic from 'next/dynamic';
import { Map as MapIcon, Navigation, Crosshair } from "lucide-react";
import { useMemo } from "react";

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function GeospatialPage() {
  const alerts = useDashboardStore(state => state.alerts);
  const activeSensorsCount = useDashboardStore(state => state.activeSensors);

  const mapOption = useMemo(() => {
    // Generate a 10x10 grid for the factory floor
    // We will place sensors with a random location
    // We overlay the alerts on top
    const data = [];
    
    // Static sensors
    for(let i=0; i<100; i++) {
        data.push([
            Math.random() * 100, // X
            Math.random() * 100, // Y
            1, // Base size
            'Sensor' // Type
        ]);
    }
    
    // Alerts
    const alertData = alerts.map(alert => {
        // Pseudo-random position based on sensor string
        const idNum = parseInt(alert.sensor_id.replace(/\D/g, '') || '0', 10);
        return {
            name: alert.sensor_id,
            value: [
                (idNum * 13) % 100, 
                (idNum * 7) % 100, 
                alert.score * 20, // size
                alert.severity,
                alert.message
            ],
            itemStyle: {
                color: alert.severity === 'critical' ? '#ef4444' :
                       alert.severity === 'high' ? '#f97316' :
                       alert.severity === 'medium' ? '#eab308' : '#3b82f6'
            }
        };
    });

    return {
      tooltip: {
        formatter: function (params: any) {
            if (params.seriesName === 'Anomalies') {
                return `
                    <div class="font-mono text-xs">
                        <div class="font-bold text-${params.data.value[3] === 'critical' ? 'red' : 'orange'}-400 mb-1">${params.data.name}</div>
                        <div>Severity: ${params.data.value[3]}</div>
                        <div class="text-slate-400 mt-1">${params.data.value[4]}</div>
                    </div>
                `;
            }
            return 'Normal Sensor Node';
        },
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: '#1e293b',
        textStyle: { color: '#f8fafc' }
      },
      grid: { left: '5%', right: '5%', bottom: '5%', top: '5%' },
      xAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 100
      },
      series: [
        {
          name: 'Factory Grid',
          type: 'scatter',
          symbolSize: 4,
          itemStyle: { color: '#334155' },
          data: data
        },
        {
          name: 'Anomalies',
          type: 'effectScatter',
          symbolSize: function (val: any) {
            return Math.max(15, val[2]); // Size based on anomaly score
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 3
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: '#000'
          },
          data: alertData,
          zlevel: 1
        }
      ]
    };
  }, [alerts]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
          <MapIcon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Facility Geospatial View</h2>
          <p className="text-xs text-slate-400">Real-time topographical anomaly tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Main Map */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-2 backdrop-blur flex flex-col h-full relative">
            
          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button className="bg-slate-950/80 border border-slate-700 hover:border-blue-500 p-2 rounded-lg text-slate-400 hover:text-blue-400 transition-colors">
                <Navigation size={18} />
            </button>
            <button className="bg-slate-950/80 border border-slate-700 hover:border-blue-500 p-2 rounded-lg text-slate-400 hover:text-blue-400 transition-colors">
                <Crosshair size={18} />
            </button>
          </div>

          <div className="flex-1 w-full relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20 rounded-lg overflow-hidden border border-slate-800/50">
            <ReactECharts 
              option={mapOption} 
              style={{ height: '100%', width: '100%' }} 
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur flex flex-col gap-6 overflow-y-auto">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Sector Beta-4</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Main manufacturing floor housing 12 heavy assembly lines. Currently operating at nominal capacity.
            </p>
          </div>
          
          <div className="space-y-4">
              <div className="bg-slate-950 rounded-lg border border-slate-800 p-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Active Nodes</div>
                  <div className="text-2xl font-bold text-blue-400">{activeSensorsCount.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 rounded-lg border border-slate-800 p-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Detected Anomalies</div>
                  <div className="text-2xl font-bold text-orange-400">{alerts.length}</div>
              </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Legend</div>
              <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#334155]"></div>
                      <span className="text-slate-300">Nominal Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]"></div>
                      <span className="text-slate-300">Warning Anomaly</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                      <span className="text-slate-300">Critical Anomaly</span>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
