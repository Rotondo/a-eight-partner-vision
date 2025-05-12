
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Partner, sizeColorMap } from '@/types/partner';

interface QuadrantChartProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
}

const QuadrantChart: React.FC<QuadrantChartProps> = ({ partners, onSelectPartner }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || partners.length === 0) return;
    
    const createChart = () => {
      // Clear previous chart
      d3.select(svgRef.current).selectAll('*').remove();
      
      const svg = d3.select(svgRef.current);
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      const margin = { top: 40, right: 40, bottom: 60, left: 60 };
      
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      
      // Create scales
      const xScale = d3.scaleLinear()
        .domain([0, 5])
        .range([0, innerWidth])
        .nice();
        
      const yScale = d3.scaleLinear()
        .domain([0, 5])
        .range([innerHeight, 0])
        .nice();
      
      // Create group for translating margins
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
      
      // Create axes
      const xAxis = d3.axisBottom(xScale)
        .ticks(5);
        
      const yAxis = d3.axisLeft(yScale)
        .ticks(5);
      
      // Add axes to chart
      g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis)
        .attr('class', 'axis x-axis');
        
      g.append('g')
        .call(yAxis)
        .attr('class', 'axis y-axis');
      
      // Add axes labels
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 40)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', '0.875rem')
        .text('Potencial de Geração de Leads');
        
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', '0.875rem')
        .text('Potencial de Investimento');
      
      // Add quadrant lines
      g.append('line')
        .attr('x1', xScale(2.5))
        .attr('y1', 0)
        .attr('x2', xScale(2.5))
        .attr('y2', innerHeight)
        .attr('stroke', 'gray')
        .attr('stroke-dasharray', '5,5')
        .attr('stroke-width', 1);
        
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(2.5))
        .attr('x2', innerWidth)
        .attr('y2', yScale(2.5))
        .attr('stroke', 'gray')
        .attr('stroke-dasharray', '5,5')
        .attr('stroke-width', 1);
      
      // Add quadrant labels
      const quadLabels = [
        { text: "Baixo Lead, Baixo Investimento", x: xScale(1.25), y: yScale(1.25) },
        { text: "Alto Lead, Baixo Investimento", x: xScale(3.75), y: yScale(1.25) },
        { text: "Baixo Lead, Alto Investimento", x: xScale(1.25), y: yScale(3.75) },
        { text: "Alto Lead, Alto Investimento", x: xScale(3.75), y: yScale(3.75) }
      ];
      
      g.selectAll('.quadrant-label')
        .data(quadLabels)
        .enter()
        .append('text')
        .attr('class', 'quadrant-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('text-anchor', 'middle')
        .attr('fill', 'gray')
        .attr('font-size', '0.75rem')
        .text(d => d.text);
      
      // Create tooltip
      const tooltip = d3.select(tooltipRef.current)
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', '1px solid #ddd')
        .style('border-radius', '4px')
        .style('padding', '10px')
        .style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.1)')
        .style('z-index', '10')
        .style('pointer-events', 'none');
      
      // Add points
      const points = g.selectAll('.partner-point')
        .data(partners)
        .enter()
        .append('circle')
        .attr('class', 'partner-point')
        .attr('cx', d => xScale(Number(d.leadPotential)))
        .attr('cy', d => yScale(Number(d.investmentPotential)))
        .attr('r', d => 5 + Number(d.engagement) * 2)
        .attr('fill', d => sizeColorMap[d.size])
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .style('opacity', 0.8)
        .on('mouseover', function(event, d) {
          d3.select(this)
            .style('opacity', 1)
            .attr('stroke-width', 2);
            
          tooltip
            .style('visibility', 'visible')
            .html(`
              <div class="font-semibold">${d.name}</div>
              <div>Tamanho: ${d.size}</div>
              <div>Engajamento: ${d.engagement}</div>
              <div>Lead: ${d.leadPotential}</div>
              <div>Investimento: ${d.investmentPotential}</div>
            `);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('opacity', 0.8)
            .attr('stroke-width', 1.5);
            
          tooltip.style('visibility', 'hidden');
        })
        .on('click', (_, d) => {
          onSelectPartner(d);
        });
      
      // Add labels for points
      g.selectAll('.partner-label')
        .data(partners)
        .enter()
        .append('text')
        .attr('class', 'partner-label')
        .attr('x', d => xScale(Number(d.leadPotential)))
        .attr('y', d => yScale(Number(d.investmentPotential)) - 10 - Number(d.engagement))
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', '0.75rem')
        .attr('pointer-events', 'none')
        .text(d => d.name);
    };
    
    // Create chart initially and add resize listener
    createChart();
    
    const handleResize = () => {
      createChart();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [partners, onSelectPartner]);
  
  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      <div ref={tooltipRef} />
    </div>
  );
};

export default QuadrantChart;
