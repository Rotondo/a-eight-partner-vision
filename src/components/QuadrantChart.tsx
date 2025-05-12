import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Partner, sizeColorMap } from '@/types/partner';
import { calculateChartPosition } from '@/lib/form-utils';

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
      d3.select(svgRef.current).selectAll('*').remove();
      
      const svg = d3.select(svgRef.current);
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      const margin = { top: 40, right: 40, bottom: 60, left: 60 };
      
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      
      // Configuração das escalas
      const xScale = d3.scaleLinear()
        .domain([0, 5])
        .range([0, innerWidth])
        .nice();
        
      const yScale = d3.scaleLinear()
        .domain([0, 5])
        .range([innerHeight, 0])
        .nice();

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Adiciona eixos
      g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(5))
        .attr('class', 'axis x-axis');
        
      g.append('g')
        .call(d3.axisLeft(yScale).ticks(5))
        .attr('class', 'axis y-axis');

      // Rótulos dos eixos
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 40)
        .attr('text-anchor', 'middle')
        .text('Potencial de Geração de Leads');
        
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .text('Potencial de Investimento');

      // Linhas do quadrante
      g.append('line')
        .attr('x1', xScale(2.5))
        .attr('y1', 0)
        .attr('x2', xScale(2.5))
        .attr('y2', innerHeight)
        .attr('class', 'quadrant-line');
        
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(2.5))
        .attr('x2', innerWidth)
        .attr('y2', yScale(2.5))
        .attr('class', 'quadrant-line');

      // Tooltip
      const tooltip = d3.select(tooltipRef.current)
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');

      // Processamento dos dados
      const partnersWithPositions = partners.map(partner => ({
        ...partner,
        ...calculateChartPosition(partner)
      }));

      // Desenha pontos
      g.selectAll('.partner-point')
        .data(partnersWithPositions)
        .enter()
        .append('circle')
        .attr('class', 'partner-point')
        .attr('cx', d => xScale(d.calculatedX))
        .attr('cy', d => yScale(d.calculatedY))
        .attr('r', d => 5 + d.engagement * 2)  // engagement agora é number
        .attr('fill', d => sizeColorMap[d.size])
        .attr('stroke', 'white')
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          d3.select(this).raise();
          tooltip
            .style('visibility', 'visible')
            .html(`
              <div class="font-bold">${d.name}</div>
              <div>Tamanho: ${d.size}</div>
              <div>Engajamento: ${d.engagement}</div>
              <div>Lead: ${d.leadPotential}</div>
              <div>Investimento: ${d.investmentPotential}</div>
              ${d.strategicAlignment ? `<div>Alinhamento: ${d.strategicAlignment}</div>` : ''}
            `);
        })
        .on('mousemove', (event) => {
          tooltip
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'))
        .on('click', (_, d) => onSelectPartner(d));

      // Labels dos pontos
      g.selectAll('.partner-label')
        .data(partnersWithPositions)
        .enter()
        .append('text')
        .attr('class', 'partner-label')
        .attr('x', d => xScale(d.calculatedX))
        .attr('y', d => yScale(d.calculatedY) - 15)
        .attr('text-anchor', 'middle')
        .text(d => d.name);
    };

    createChart();
    window.addEventListener('resize', createChart);
    
    return () => window.removeEventListener('resize', createChart);
  }, [partners, onSelectPartner]);

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      <div ref={tooltipRef} className="tooltip" />
    </div>
  );
};

export default QuadrantChart;
