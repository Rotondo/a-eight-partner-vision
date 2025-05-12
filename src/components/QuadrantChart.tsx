// src/components/QuadrantChart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Partner, sizeColorMap } from '@/types/partner';
import { getChartConfig, calculateChartPosition } from '@/lib/form-utils';

interface QuadrantChartProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
}

const QuadrantChart: React.FC<QuadrantChartProps> = ({ partners, onSelectPartner }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || partners.length === 0) return;

    // Configurações do gráfico
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const { 
      margin, 
      innerWidth, 
      innerHeight, 
      xScale, 
      yScale, 
      quadrantLines, 
      quadrantLabels 
    } = getChartConfig(width, height);

    // Limpa o SVG antes de redesenhar
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Cria grupo principal
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 1. Desenha linhas do quadrante
    quadrantLines.forEach(line => {
      g.append('line')
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', line.x2)
        .attr('y2', line.y2)
        .attr('stroke', '#94a3b8')
        .attr('stroke-dasharray', '4 2');
    });

    // 2. Adiciona rótulos dos quadrantes
    quadrantLabels.forEach(label => {
      g.append('text')
        .attr('x', label.x)
        .attr('y', label.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', '0.75rem')
        .text(label.text);
    });

    // 3. Calcula posições dos parceiros
    const partnersWithPositions = partners.map(partner => ({
      ...partner,
      ...calculateChartPosition(partner)
    }));

    // 4. Desenha pontos dos parceiros
    g.selectAll('.partner-point')
      .data(partnersWithPositions)
      .enter()
      .append('circle')
      .attr('class', 'partner-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', d => sizeColorMap[d.size])
      .attr('stroke', 'white')
      .on('click', (_, d) => onSelectPartner(d));

  }, [partners, onSelectPartner]);

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      <div ref={tooltipRef} className="hidden" />
    </div>
  );
};

export default QuadrantChart;
