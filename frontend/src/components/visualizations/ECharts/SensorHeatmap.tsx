"use client";

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function SensorHeatmap() {
  const [options, setOptions] = useState({});

  useEffect(() => {
    // Generate some demo heatmap data
    const xData = ['00', '01', '02', '03', '04'];
    const yData = ['A', 'B', 'C', 'D'];
    const data = [];
    
    for (let i = 0; i < xData.length; i++) {
      for (let j = 0; j < yData.length; j++) {
        data.push([i, j, Math.random() * 10]);
      }
    }

    setOptions({
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '70%',
        top: '10%',
        bottom: '20%',
        left: '10%',
        right: '5%'
      },
      xAxis: {
        type: 'category',
        data: xData,
        splitArea: { show: true },
        axisLabel: { color: '#94a3b8' }
      },
      yAxis: {
        type: 'category',
        data: yData,
        splitArea: { show: true },
        axisLabel: { color: '#94a3b8' }
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: {
          color: ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        },
        textStyle: { color: '#94a3b8' },
        show: false
      },
      series: [{
        name: 'Sensor Density',
        type: 'heatmap',
        data: data,
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
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
