import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Project } from '../types';
import { calculateProgress } from '../lib/progress';
import { Activity } from 'lucide-react';
import { translations } from '../lib/translations';

interface ProjectHealthChartProps {
  projects: Project[];
  lang: 'en' | 'de';
}

export default function ProjectHealthChart({ projects, lang }: ProjectHealthChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Helper to calculate project progress
  
  useEffect(() => {
    if (!svgRef.current || projects.length === 0) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const chartData = projects.map(p => ({
      name: p.name,
      progress: calculateProgress(p.tasks || [], p.columns || []),
      status: p.status || 'Blank'
    })).slice(0, 5); // Display top 5 projects

    const margin = { top: 20, right: 80, bottom: 20, left: 140 };
    const width = 600 - margin.left - margin.right;
    const barHeight = 36;
    const height = chartData.length * (barHeight + 16) + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 600 ${height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define glowing gradients
    const defs = svg.append('defs');
    
    // Epic Cyan Gradient
    const cyanGrad = defs.append('linearGradient')
      .attr('id', 'cyan-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    cyanGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0097a7');
    cyanGrad.append('stop').attr('offset', '100%').attr('stop-color', '#00e5ff');

    // Unreal Orange Gradient for 100% health
    const orangeGrad = defs.append('linearGradient')
      .attr('id', 'orange-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    orangeGrad.append('stop').attr('offset', '0%').attr('stop-color', '#e04f00');
    orangeGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ff5e00');

    // Scales
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(chartData.map(d => d.name))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.3);

    // Background Bars
    g.selectAll('.bar-bg')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar-bg')
      .attr('y', d => y(d.name) || 0)
      .attr('x', 0)
      .attr('width', width)
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', 'var(--ue-border)')
      .attr('opacity', 0.25);

    // Progress Bars (Animated)
    g.selectAll('.bar-progress')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar-progress')
      .attr('y', d => y(d.name) || 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', d => d.progress === 100 ? 'url(#orange-gradient)' : 'url(#cyan-gradient)')
      .attr('width', 0) // Start at 0 for transition
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('width', d => x(d.progress));

    // Y Axis Labels (Project Names)
    g.selectAll('.label-name')
      .data(chartData)
      .enter()
      .append('text')
      .attr('class', 'label-name')
      .attr('y', d => (y(d.name) || 0) + y.bandwidth() / 2 + 4)
      .attr('x', -15)
      .attr('text-anchor', 'end')
      .attr('fill', 'var(--ue-text)')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .text(d => d.name.length > 18 ? d.name.slice(0, 16) + '...' : d.name);

    // Progress percentages (Animated)
    g.selectAll('.label-percent')
      .data(chartData)
      .enter()
      .append('text')
      .attr('class', 'label-percent')
      .attr('y', d => (y(d.name) || 0) + y.bandwidth() / 2 + 4)
      .attr('x', width + 15)
      .attr('text-anchor', 'start')
      .attr('fill', d => d.progress === 100 ? '#FF5E00' : '#00E5FF')
      .style('font-size', '12px')
      .style('font-weight', '900')
      .style('font-family', 'monospace')
      .text('0%')
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('x', d => Math.max(x(d.progress) + 12, width + 12))
      .tween('text', function(d) {
        const i = d3.interpolateNumber(0, d.progress);
        return function(t) {
          this.textContent = `${Math.round(i(t))}%`;
        };
      });

  }, [projects, lang]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="bg-ue-panel border border-ue-border rounded-2xl p-6 relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-epic-cyan/5 to-transparent rounded-full pointer-events-none" />
      
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 bg-epic-cyan/10 rounded-lg text-epic-cyan">
            <Activity size={18} />
          </div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-ue-text">
            {lang === 'en' ? translations.en.projectHealthTitle : translations.de.projectHealthTitle}
          </h3>
        </div>
        <p className="text-xs text-ue-text-muted mb-6">
          {lang === 'en' ? translations.en.activeProjectsStats : translations.de.activeProjectsStats}
        </p>

        <div className="relative w-full overflow-hidden">
          <svg ref={svgRef} className="w-full h-auto"></svg>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-ue-border/50 flex justify-between items-center text-[10px] text-ue-text-muted uppercase tracking-wider font-bold">
        <span>{lang === 'en' ? 'Top Active UEFN Projects' : 'Aktivste UEFN-Projekte'}</span>
        <span className="text-epic-cyan flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-epic-cyan animate-ping" />
          {lang === 'en' ? 'Live Progress' : 'Live-Fortschritt'}
        </span>
      </div>
    </div>
  );
}
