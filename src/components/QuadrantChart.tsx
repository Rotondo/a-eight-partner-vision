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

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    quadrantLines.forEach(line => {
      g.append('line')
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', line.x2)
        .attr('y2', line.y2)
        .attr('stroke', '#94a3b8')
        .attr('stroke-dasharray', '4 2');
    });

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

    const legendData = [
      { label: 'PP', color: sizeColorMap['PP'] },
      { label: 'P', color: sizeColorMap['P'] },
      { label: 'M', color: sizeColorMap['M'] },
      { label: 'G', color: sizeColorMap['G'] },
      { label: 'GG', color: '#FF46A2' }
    ];

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${margin.left}, ${margin.top / 2})`);

    legendData.forEach((item, i) => {
      legend.append('circle')
        .attr('cx', i * 60)
        .attr('cy', 0)
        .attr('r', 7)
        .attr('fill', item.color);

      legend.append('text')
        .attr('x', i * 60 + 15)
        .attr('y', 5)
        .attr('font-size', '0.8rem')
        .attr('fill', '#64748b')
        .text(item.label);
    });

    const tooltip = d3.select(tooltipRef.current)
      .attr('class', 'absolute bg-white p-2 rounded shadow-md text-sm z-10 pointer-events-none')
      .style('display', 'none');

    const partnersWithPositions = partners.map(partner => ({
      ...partner,
      ...calculateChartPosition(partner)
    }));

    const points = g.selectAll('.partner-point')
      .data(partnersWithPositions)
      .enter()
      .append('circle')
      .attr('class', 'partner-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', d => d.size === 'GG' ? '#FF46A2' : sizeColorMap[d.size])
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('click', (_, d) => onSelectPartner(d));

    const labelPadding = 10;
    const labelData = partnersWithPositions.map(d => ({
      ...d,
      labelX: xScale(d.x) + labelPadding,
      labelY: yScale(d.y) - labelPadding,
      width: d.name.length * 5.5,
      height: 16
    }));

    const overlapping = new Set<number>();
    for (let i = 0; i < labelData.length; i++) {
      const a = labelData[i];
      for (let j = i + 1; j < labelData.length; j++) {
        const b = labelData[j];
        if (a.labelX < b.labelX + b.width &&
            a.labelX + a.width > b.labelX &&
            a.labelY < b.labelY + b.height &&
            a.labelY + a.height > b.labelY) {
          overlapping.add(i);
          overlapping.add(j);
        }
      }
    }

    const fixedLabels = g.append('g').attr('class', 'fixed-labels');
    const hoverLabels = g.append('g').attr('class', 'hover-labels').style('opacity', 0);

    labelData.forEach((d, i) => {
      if (!overlapping.has(i)) {
        fixedLabels.append('text')
          .attr('x', d.labelX)
          .attr('y', d.labelY)
          .attr('font-size', '0.75rem')
          .attr('fill', '#22223b')
          .attr('stroke', 'white')
          .attr('stroke-width', '0.3px')
          .attr('paint-order', 'stroke')
          .text(d.name);
      }
    });

    points.on('mouseover', function(event, d) {
      const i = labelData.findIndex(item => item.id === d.id);
      d3.select(this)
        .transition()
        .duration(150)
        .attr('r', 8)
        .attr('stroke-width', 2);
      if (overlapping.has(i)) {
        hoverLabels.selectAll('*').remove();
        hoverLabels
          .append('line')
          .attr('x1', xScale(d.x))
          .attr('y1', yScale(d.y))
          .attr('x2', labelData[i].labelX)
          .attr('y2', labelData[i].labelY)
          .attr('stroke', '#22223b')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,2');
        hoverLabels
          .append('text')
          .attr('x', labelData[i].labelX)
          .attr('y', labelData[i].labelY)
          .attr('font-size', '0.75rem')
          .attr('fill', '#22223b')
          .attr('stroke', 'white')
          .attr('stroke-width', '0.3px')
          .attr('paint-order', 'stroke')
          .text(d.name);
        hoverLabels.style('opacity', 1);
      }
      tooltip
        .html(`
          <div class="font-semibold">${d.name}</div>
          <div>Tamanho: ${d.size}</div>
          <div>Lead: ${d.leadPotential}</div>
          <div>Investimento: ${d.investmentPotential}</div>
          <div>Engajamento: ${d.engagement}</div>
        `)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`)
        .style('display', 'block');
    })
    .on('mousemove', function(event) {
      tooltip
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(150)
        .attr('r', 5)
        .attr('stroke-width', 1.5);
      hoverLabels.style('opacity', 0);
      tooltip.style('display', 'none');
    });

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '0.9rem')
      .text('Potencial de Geração de Leads');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '0.9rem')
      .text('Potencial de Investimento');

  }, [partners, onSelectPartner]);

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      <div ref={tooltipRef} className="absolute hidden bg-white p-2 rounded shadow-md text-sm z-10" />
    </div>
  );
};

export default QuadrantChart;
