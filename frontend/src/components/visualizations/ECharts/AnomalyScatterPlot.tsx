"use client";

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function AnomalyScatterPlot() {
  const [options, setOptions] = useState({});

  useEffect(() => {
    // Generate some demo data for the scatter plot
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push([
        Math.random() * 100, // X: Time or Feature A
        Math.random() * 100, // Y: Feature B
        Math.random() * 100  // Size: Anomaly Score
      ]);
    }

    setOptions({
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `Score: ${params.value[2].toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8' }
      },
      series: [{
        symbolSize: (data: any) => data[2] / 2,
        data: data,
        type: 'scatter',
        itemStyle: {
          color: '#f59e0b',
          opacity: 0.7
        }
      }],
      grid: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 30,
      }
    });
  }, []);

  return (
    <div className="w-full h-full relative min-h-[160px]">
      <ReactECharts 
        option={options} 
        style={{ height: '100%', width: '100%' }} 
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
