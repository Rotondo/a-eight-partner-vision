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

    // 3. Legenda de cores para tamanhos das empresas
    const legendData = [
      { label: 'PP', color: sizeColorMap['PP'] },
      { label: 'P', color: sizeColorMap['P'] },
      { label: 'M', color: sizeColorMap['M'] },
      { label: 'G', color: sizeColorMap['G'] },
      { label: 'GG', color: sizeColorMap['GG'] }
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

    // 4. Configuração do tooltip
    const tooltip = d3.select(tooltipRef.current)
      .attr('class', 'absolute bg-white p-2 rounded shadow-md text-sm z-10 pointer-events-none hidden');

    // 5. Calcula posições dos parceiros
    const partnersWithPositions = partners.map(partner => ({
      ...partner,
      ...calculateChartPosition(partner)
    }));

    // 6. Desenha pontos dos parceiros
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
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Aumenta o tamanho e destaca o ponto
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', 8)
          .attr('stroke-width', 2);

        // Mostra o tooltip
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
          .classed('hidden', false);
      })
      .on('mousemove', function(event) {
        // Atualiza posição do tooltip ao mover o mouse
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', function() {
        // Restaura o tamanho original do ponto
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', 5)
          .attr('stroke-width', 1.5);

        // Esconde o tooltip
        tooltip.classed('hidden', true);
      })
      .on('click', (_, d) => onSelectPartner(d));

    // 7. Desenha os nomes dos parceiros próximos aos pontos (com offset para evitar sobreposição)
    const labelOffset = 10;
    
    g.selectAll('.partner-label')
      .data(partnersWithPositions)
      .enter()
      .append('text')
      .attr('class', 'partner-label')
      .attr('x', d => xScale(d.x) + labelOffset)
      .attr('y', d => yScale(d.y) - labelOffset)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '0.75rem')
      .attr('fill', '#22223b')
      .attr('pointer-events', 'none') // Permite cliques nos pontos por baixo do texto
      .attr('stroke', 'white')  // Contorno branco para melhor legibilidade
      .attr('stroke-width', '0.3px')
      .attr('paint-order', 'stroke')
      .text(d => d.name);

    // 8. Adiciona eixos X e Y
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

  // Função para redimensionar o gráfico quando a janela mudar de tamanho
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current && partners.length > 0) {
        // Força o redesenho do gráfico
        const event = new Event('resize');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [partners]);

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      <div ref={tooltipRef} className="absolute hidden bg-white p-2 rounded shadow-md text-sm z-10" />
    </div>
  );
};

export default QuadrantChart;
