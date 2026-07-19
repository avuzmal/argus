"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function StreamingLineChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Set up dimensions
    const width = svgRef.current.clientWidth;
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Dummy data generation
    const n = 100;
    const random = d3.randomNormal(50, 10);
    const data = d3.range(n).map(() => random());

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3.scaleLinear()
      .domain([0, n - 1])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Define line generator
    const line = d3.line<number>()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    // Define area generator
    const area = d3.area<number>()
      .x((d, i) => x(i))
      .y0(innerHeight)
      .y1(d => y(d))
      .curve(d3.curveMonotoneX);

    // Create a clipping path so the line doesn't draw outside bounds
    g.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight);

    // Add axes
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(() => ''))
      .attr('color', '#334155');

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#334155');

    // Add area
    const areaPath = g.append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('fill', 'url(#gradient)')
      .attr('opacity', 0.2)
      .attr('d', area);

    // Add line
    const path = g.append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '#34d399')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Gradient definition
    const defs = svg.select('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#34d399')
      .attr('stop-opacity', 1);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#34d399')
      .attr('stop-opacity', 0);

    // Animation loop
    function tick() {
      // Push a new data point onto the back
      data.push(random());

      // Redraw the line and area
      path.attr('d', line)
        .attr('transform', null);
        
      areaPath.attr('d', area)
        .attr('transform', null);

      // Slide it to the left
      path.transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('transform', `translate(${x(-1)},0)`)
        .on('end', tick);
        
      areaPath.transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('transform', `translate(${x(-1)},0)`);

      // Pop the old data point off the front
      data.shift();
    }

    tick();

  }, []);

  return (
    <div className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
